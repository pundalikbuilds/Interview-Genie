/**
 * src/services/audio_ws.ts
 * =========================
 * Pure API functions — no React, no state, no hooks.
 * Safe to import anywhere (services, hooks, server actions).
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

/**
 * Fetch TTS audio from backend.
 * Returns a Blob (audio/wav) ready to be played via new Audio().
 */
export async function fetchSpeakAudio(text: string): Promise<Blob> {
  const res = await fetch(
    `${API_BASE}/audio/speak?text=${encodeURIComponent(text)}`
  );
  if (!res.ok) throw new Error(`TTS failed: ${res.status}`);
  return res.blob();
}

/**
 * POST a WAV ArrayBuffer to backend, get transcript string back.
 * Pass sessionId to store the transcript in session metadata server-side.
 */
export async function postTranscribe(
  wavBuffer: ArrayBuffer,
  sessionId?: string,
): Promise<string> {
  const url = sessionId
    ? `${API_BASE}/audio/transcribe?session_id=${encodeURIComponent(sessionId)}`
    : `${API_BASE}/audio/transcribe`;

  const res = await fetch(url, {
    method:  "POST",
    headers: { "Content-Type": "audio/wav" },
    body:    wavBuffer,
  });
  if (!res.ok) throw new Error(`Transcription failed: ${res.status}`);
  const data = await res.json() as { transcript: string };
  return data.transcript;
}