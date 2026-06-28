/**
 * src/hooks/useInterviewAudio.ts
 * ===============================
 * React hook — owns mic recording state and orchestrates the full flow:
 *   speak → record → transcribe
 * Imports pure API calls from services/audio_ws.ts
 */

import { useCallback, useRef, useState } from "react";
import { fetchSpeakAudio, postTranscribe } from "@/services/audio_ws";

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

export function useInterviewAudio({
  onTranscript,
  onError,
  sessionId,
}: UseInterviewAudioOptions): InterviewAudioState {
  const [isAiSpeaking,   setIsAiSpeaking]   = useState(false);
  const [isRecording,    setIsRecording]     = useState(false);
  const [isTranscribing, setIsTranscribing]  = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const recordedChunks  = useRef<Float32Array[]>([]);
  const isRecordingRef  = useRef(false);
  const silenceTimerRef = useRef<number | null>(null);

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

  // ── Phase 1: Speak ────────────────────────────────────────────────────────
  const speakQuestion = useCallback(async (text: string): Promise<void> => {
    console.log("[useInterviewAudio] fetching TTS for:", text.slice(0, 60));
    setIsAiSpeaking(true);
    try {
      const blob = await fetchSpeakAudio(text);
      console.log("[useInterviewAudio] TTS blob received, size:", blob.size);
      const url   = URL.createObjectURL(blob);
      const audio = new Audio(url);
      await new Promise<void>((resolve, reject) => {
        audio.onended = () => { URL.revokeObjectURL(url); resolve(); };
        audio.onerror = (e) => { URL.revokeObjectURL(url); console.error("[useInterviewAudio] audio playback error:", e); reject(new Error("Playback failed")); };
        audio.play().then(() => console.log("[useInterviewAudio] audio playing...")).catch(reject);
      });
      console.log("[useInterviewAudio] TTS playback finished");
    } finally {
      setIsAiSpeaking(false);
    }
  }, []);

  // ── Phase 2: Record until silence ─────────────────────────────────────────
  const recordAnswer = useCallback((): Promise<Float32Array> => {
    return new Promise(async (resolve, reject) => {
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

  // ── Phase 3: Transcribe ───────────────────────────────────────────────────
  const transcribeAudio = useCallback(async (samples: Float32Array): Promise<string> => {
    setIsTranscribing(true);
    try {
      const wav = buildWav(samples, SAMPLE_RATE);
      const res = await postTranscribe(wav, sessionId);  // from audio_ws.ts
      // `postTranscribe` returns an object { transcript, decision, ... }.
      // Ensure we return a plain string for the UI.
      if (!res) return "";
      if (typeof res === "string") return res;
      return (res.transcript as string) ?? "";
    } finally {
      setIsTranscribing(false);
    }
  }, [sessionId]);

  // ── Public: full flow for one question ───────────────────────────────────
  const startQuestion = useCallback(async (questionText: string): Promise<void> => {
    console.log("[useInterviewAudio] startQuestion called with:", questionText);
    try {
      console.log("[useInterviewAudio] → speaking question...");
      await speakQuestion(questionText);
      console.log("[useInterviewAudio] → speaking done, opening mic...");
      const samples = await recordAnswer();
      console.log("[useInterviewAudio] → recording done, samples length:", samples.length);
      const transcript = await transcribeAudio(samples);
      console.log("[useInterviewAudio] → transcript:", transcript);
      if (transcript) onTranscript(transcript);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Audio error";
      console.error("[useInterviewAudio] ERROR:", err);
      onError?.(message);
    }
  }, [speakQuestion, recordAnswer, transcribeAudio, onTranscript, onError]);

  return { isAiSpeaking, isRecording, isTranscribing, startQuestion };
}