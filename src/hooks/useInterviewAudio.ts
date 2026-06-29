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
  onError?:     (message: string) => void;
  sessionId?:   string;   // when provided, transcript is stored server-side
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
  sessionId,
}: UseInterviewAudioOptions): InterviewAudioState {
  const [isAiSpeaking,   setIsAiSpeaking]   = useState(false);
  const [isRecording,    setIsRecording]     = useState(false);
  const [isTranscribing, setIsTranscribing]  = useState(false);

  const audioContextRef   = useRef<AudioContext | null>(null);
  const recordedChunks    = useRef<Float32Array[]>([]);
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
          const pending = pendingResultRef.current;
          if (!pending) return;
          pendingResultRef.current = null;
          pending.resolve(typeof message.transcript === "string" ? message.transcript : "");
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

  // ── Utility: Float32 PCM → WAV ArrayBuffer ────────────────────────────────
  const buildWav = (samples: Float32Array, sampleRate: number): ArrayBuffer => {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view   = new DataView(buffer);
    const str    = (offset: number, s: string) => {
      for (let i = 0; i < s.length; i++) view.setUint8(offset + i, s.charCodeAt(i));
    };
    str(0, "RIFF");
    view.setUint32(4,  36 + samples.length * 2, true);
    str(8, "WAVE"); str(12, "fmt ");
    view.setUint32(16, 16,             true);
    view.setUint16(20, 1,              true);
    view.setUint16(22, 1,              true);
    view.setUint32(24, sampleRate,     true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2,              true);
    view.setUint16(34, 16,             true);
    str(36, "data");
    view.setUint32(40, samples.length * 2, true);
    let offset = 44;
    for (let i = 0; i < samples.length; i++) {
      const s = Math.max(-1, Math.min(1, samples[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
      offset += 2;
    }
    return buffer;
  };

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

  // ── Phase 2: Record until silence (unchanged — purely local mic capture) ──
  const recordAnswer = useCallback((): Promise<Float32Array> => {
    return new Promise<Float32Array>(async (resolve, reject) => {
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
      recordedChunks.current = [];

      let calibrating   = true;
      let calRms: number[] = [];
      let threshold     = MIN_THRESHOLD;
      let speechStarted = false;
      let silenceMs     = 0;
      const calEnd      = Date.now() + CALIBRATION_MS;

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

        recordedChunks.current.push(samples);

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
            silenceTimerRef.current = window.setTimeout(() => {
              if (!isRecordingRef.current) return;
              isRecordingRef.current = false;
              setIsRecording(false);
              processor.disconnect();
              source.disconnect();
              stream.getTracks().forEach((t) => t.stop());
              ctx.close();
              const total  = recordedChunks.current.reduce((n, c) => n + c.length, 0);
              const merged = new Float32Array(total);
              let off = 0;
              for (const chunk of recordedChunks.current) {
                merged.set(chunk, off); off += chunk.length;
              }
              resolve(merged);
            }, 0);
          }
        }
      };

      source.connect(processor);
      processor.connect(ctx.destination);
    });
  }, []);

  // ── Phase 3: Send answer + get transcript (via persistent client) ────────
  const sendAnswerAndTranscribe = useCallback((samples: Float32Array): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      const client = clientRef.current;
      if (!client) { reject(new Error("Audio connection not ready")); return; }

      const wav = buildWav(samples, SAMPLE_RATE);
      pendingResultRef.current = { resolve, reject };
      setIsTranscribing(true);

      try {
        client.sendAnswer(wav, sessionId, currentQuestionRef.current);
      } catch (err) {
        pendingResultRef.current = null;
        reject(err instanceof Error ? err : new Error("Send answer failed"));
      }
    }).finally(() => setIsTranscribing(false));
  }, [sessionId]);

  // ── Public: full flow for one question ───────────────────────────────────
  const startQuestion = useCallback(async (questionText: string): Promise<void> => {
    try {
      await speakQuestion(questionText);
      const samples = await recordAnswer();
      const transcript = await sendAnswerAndTranscribe(samples);
      if (transcript) onTranscript(transcript);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Audio error";
      onError?.(message);
    }
  }, [speakQuestion, recordAnswer, sendAnswerAndTranscribe, onTranscript, onError]);

  return { isAiSpeaking, isRecording, isTranscribing, startQuestion };
}