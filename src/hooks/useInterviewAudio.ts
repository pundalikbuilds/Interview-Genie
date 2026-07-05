/**
 * src/hooks/useInterviewAudio.ts
 * ===============================
 * React hook — owns mic recording state and orchestrates the full flow:
 *   speak → record → transcribe
 * Talks to the backend through the persistent client from services/audio_ws.ts
 * instead of opening a new socket per request.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { createAudioStreamClient, type AudioStreamClient } from "@/services/audio_ws";

const SAMPLE_RATE      = 16000;
const SILENCE_MS       = 3000;
const NOISE_MULTIPLIER = 3.5;
const MIN_THRESHOLD    = 80;
const MAX_THRESHOLD    = 1500;
const CALIBRATION_MS   = 500;

interface UseInterviewAudioOptions {
    onTranscript: (text: string) => void;
    onError?: (message: string) => void;

    // NEW
    onQuestion?: (question: string) => void;

    sessionId?: string;
}

export interface InterviewAudioState {
  isAiSpeaking:   boolean;
  isRecording:    boolean;
  isTranscribing: boolean;
  startQuestion:  (questionText: string) => Promise<void>;
}

// One slot each — this hook only ever has a single speak-or-transcribe
// request in flight at a time, since startQuestion runs the steps in order.
type PendingAudio  = { resolve: () => void; reject: (err: Error) => void };
type PendingResult = { resolve: (transcript: string) => void; reject: (err: Error) => void };

export function useInterviewAudio({
  onTranscript,
    onError,
    onQuestion,
    sessionId,
}: UseInterviewAudioOptions): InterviewAudioState {
  const [isAiSpeaking,   setIsAiSpeaking]   = useState(false);
  const [isRecording,    setIsRecording]     = useState(false);
  const [isTranscribing, setIsTranscribing]  = useState(false);

  const audioContextRef   = useRef<AudioContext | null>(null);
  const isRecordingRef    = useRef(false);
  const silenceTimerRef   = useRef<number | null>(null);

  const clientRef         = useRef<AudioStreamClient | null>(null);
  const pendingAudioRef    = useRef<PendingAudio | null>(null);
  const pendingResultRef   = useRef<PendingResult | null>(null);
  const currentQuestionRef = useRef<string>("");

  // ── Play a WAV blob and resolve when playback finishes ───────────────────
  const playBlob = (blob: Blob): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      const url   = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.onended = () => { URL.revokeObjectURL(url); resolve(); };
      audio.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Playback failed")); };
      audio.play().catch(reject);
    });
  };

  // ── Set up the persistent connection once ────────────────────────────────
  useEffect(() => {
    console.log("Session from backend:", sessionId);

    if (!sessionId) {
      return;
    }

    const client = createAudioStreamClient({
      sessionId,
      onError: (err) => {
        const message = err instanceof Error ? err.message : "Audio websocket error";
        // Fail whichever request is currently in flight.
        pendingAudioRef.current?.reject(new Error(message));
        pendingAudioRef.current = null;
        pendingResultRef.current?.reject(new Error(message));
        pendingResultRef.current = null;
        onError?.(message);
      },
      onAudio: async (blob) => {
        const pending = pendingAudioRef.current;
        if (!pending) return; // unsolicited frame (e.g. backend's auto next-question audio) — ignored for now
        pendingAudioRef.current = null;
        try {
          await playBlob(blob);
          pending.resolve();
        } catch (err) {
          pending.reject(err instanceof Error ? err : new Error("Playback failed"));
        }
      },
      onMessage: (message) => {
        if (message.type === "error") {
          const err = new Error(typeof message.detail === "string" ? message.detail : "Audio error");
          pendingAudioRef.current?.reject(err);
          pendingAudioRef.current = null;
          pendingResultRef.current?.reject(err);
          pendingResultRef.current = null;
          return;
        }

        if (message.type === "result") {
          const transcript =
            typeof message.transcript === "string"
              ? message.transcript
              : "";

          console.log("Final transcript received:", transcript);

          pendingResultRef.current?.resolve(transcript);
          pendingResultRef.current = null;

          return;
        }

        if (message.type === "question" && typeof message.question === "string") {
          currentQuestionRef.current = message.question;

          onQuestion?.(message.question);

          void startQuestionRef.current?.(message.question);

          return;
        }
        // "question" messages for an auto-advanced next question are sent
        // separately by the backend after "result" — not consumed here yet.
      },
    });
    clientRef.current = client;

    return () => {
      client.close();
      clientRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  // ── Utility: Float32 chunk → Int16 PCM ArrayBuffer (for streaming) ───────
  const float32ToPcm16 = (samples: Float32Array): ArrayBuffer => {
    const buffer = new ArrayBuffer(samples.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < samples.length; i++) {
      const s = Math.max(-1, Math.min(1, samples[i]));
      view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
    return buffer;
  };

  // (buildWav removed — the backend now assembles the WAV from streamed
  // PCM chunks itself; see audio_ws.py's _pcm_to_wav.)

  // ── Phase 1: Speak (via persistent client) ────────────────────────────────
  const speakQuestion = useCallback((text: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      const client = clientRef.current;
      if (!client) { reject(new Error("Audio connection not ready")); return; }

      currentQuestionRef.current = text;
      pendingAudioRef.current = { resolve, reject };
      setIsAiSpeaking(true);

      try {
        client.speak(text);
      } catch (err) {
        pendingAudioRef.current = null;
        reject(err instanceof Error ? err : new Error("Speak failed"));
      }
    }).finally(() => setIsAiSpeaking(false));
  }, []);

  // ── Phase 2: Record + stream chunks live, end with answer_end ────────────
  // Combines what used to be two separate steps (record locally, then send
  // the whole WAV) into one: every chunk is streamed to the backend as it's
  // captured, and silence-detection (still local, for low latency) triggers
  // an "answer_end" message instead of building/sending a WAV file.
  const recordAndTranscribe = useCallback((): Promise<string> => {
    return new Promise<string>(async (resolve, reject) => {
      const client = clientRef.current;
      if (!client) { reject(new Error("Audio connection not ready")); return; }

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      } catch {
        reject(new Error("Microphone permission denied")); return;
      }

      const ctx       = new AudioContext({ sampleRate: SAMPLE_RATE });
      audioContextRef.current = ctx;
      const source    = ctx.createMediaStreamSource(stream);
      const processor = ctx.createScriptProcessor(4096, 1, 1);

      let calibrating   = true;
      const calRms: number[] = [];
      let threshold     = MIN_THRESHOLD;
      let speechStarted = false;
      let silenceMs     = 0;
      const calEnd      = Date.now() + CALIBRATION_MS;
      let ended         = false;

      const finishRecording = () => {
        if (ended) return;
        ended = true;
        isRecordingRef.current = false;
        setIsRecording(false);
        processor.disconnect();
        source.disconnect();
        stream.getTracks().forEach((t) => t.stop());
        ctx.close();

        // The "result" message (carrying the transcript) resolves this promise.
        pendingResultRef.current = { resolve, reject };
        setIsTranscribing(true);
        try {
          client.endRecording();
        } catch (err) {
          pendingResultRef.current = null;
          reject(err instanceof Error ? err : new Error("Failed to end recording"));
        }
      };

      // Tell the backend a new answer is starting, before any chunks arrive.
      try {
        console.log("Sending session_id:", sessionId);
        client.startRecording(currentQuestionRef.current, sessionId);
      } catch (err) {
        reject(err instanceof Error ? err : new Error("Failed to start recording"));
        stream.getTracks().forEach((t) => t.stop());
        ctx.close();
        return;
      }

      processor.onaudioprocess = (e) => {
        const samples = new Float32Array(e.inputBuffer.getChannelData(0));
        const rms     = Math.sqrt(samples.reduce((s, x) => s + x * x, 0) / samples.length);
        const rmsInt  = rms * 32768;

        if (calibrating) {
          calRms.push(rmsInt);
          if (Date.now() >= calEnd) {
            calibrating  = false;
            const floor  = calRms.reduce((a, b) => a + b, 0) / calRms.length;
            threshold    = Math.max(MIN_THRESHOLD, Math.min(MAX_THRESHOLD, floor * NOISE_MULTIPLIER));
            isRecordingRef.current = true;
            setIsRecording(true);
          }
          return;
        }

        // Stream this chunk immediately — no local buffering.
        client.sendChunk(float32ToPcm16(samples));

        if (rmsInt > threshold) {
          speechStarted = true;
          silenceMs     = 0;
          if (silenceTimerRef.current !== null) {
            window.clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
          }
        } else if (speechStarted) {
          silenceMs += (samples.length / SAMPLE_RATE) * 1000;
          if (silenceMs >= SILENCE_MS && silenceTimerRef.current === null) {
            silenceTimerRef.current = window.setTimeout(finishRecording, 0);
          }
        }
      };

      source.connect(processor);
      processor.connect(ctx.destination);
    }).finally(() => setIsTranscribing(false));
  }, [sessionId]);

  // ── Public: full flow for one question ───────────────────────────────────
  const startQuestion = useCallback(async (questionText: string): Promise<void> => {
    try {
      await speakQuestion(questionText);
      const transcript = await recordAndTranscribe();
      if (transcript) onTranscript(transcript);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Audio error";
      onError?.(message);
    }
  }, [speakQuestion, recordAndTranscribe, onTranscript, onError]);

  const startQuestionRef = useRef(startQuestion);

  useEffect(() => {
    startQuestionRef.current = startQuestion;
  }, [startQuestion]);

  return { isAiSpeaking, isRecording, isTranscribing, startQuestion };
}

