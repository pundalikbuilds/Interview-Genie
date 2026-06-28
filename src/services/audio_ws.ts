/**
 * src/services/audio_ws.ts
 * =========================
 * Pure API functions — no React, no state, no hooks.
 * Safe to import anywhere (services, hooks, server actions).
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

function makeWsUrl(): string {
  if (!API_BASE) throw new Error("API_BASE not configured")
  // convert http(s) -> ws(s)
  if (API_BASE.startsWith("https://")) return API_BASE.replace(/^https:/, "wss:") + "/audio/ws"
  if (API_BASE.startsWith("http://")) return API_BASE.replace(/^http:/, "ws:") + "/audio/ws"
  // fallback
  return API_BASE + "/audio/ws"
}

/**
 * Fetch TTS audio from backend.
 * Returns a Blob (audio/wav) ready to be played via new Audio().
 */
export async function fetchSpeakAudio(text: string): Promise<Blob> {
  const wsUrl = makeWsUrl();
  return await new Promise<Blob>((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    ws.binaryType = "arraybuffer";
    ws.onerror = (ev) => reject(new Error("WebSocket error"));
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "speak", text }));
    };
    ws.onmessage = (ev) => {
      if (typeof ev.data === "string") {
        // JSON error or control — treat as error
        try {
          const msg = JSON.parse(ev.data);
          if (msg?.type === "error") {
            reject(new Error(msg.detail || "TTS error"));
            ws.close();
          }
        } catch (e) {
          // ignore
        }
        return;
      }
      // binary audio frame
      const ab = ev.data as ArrayBuffer;
      const blob = new Blob([ab], { type: "audio/wav" });
      resolve(blob);
      ws.close();
    };
  });
}

/**
 * POST a WAV ArrayBuffer to backend, get transcript string back.
 * Pass sessionId to store the transcript in session metadata server-side.
 */
export async function postTranscribe(
  wavBuffer: ArrayBuffer,
  sessionId?: string,
  question?: string,
): Promise<{ transcript: string; decision?: string; next_question?: string; clarifying_question?: string }> {
  const wsUrl = makeWsUrl();
  return await new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    ws.binaryType = "arraybuffer";
    ws.onerror = () => reject(new Error("WebSocket error"));
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "audio_meta", session_id: sessionId, question }));
      ws.send(wavBuffer);
    };
    ws.onmessage = async (ev) => {
      if (typeof ev.data === "string") {
        try {
          const msg = JSON.parse(ev.data);
          if (msg.type === "result") {
            resolve({
              transcript: msg.transcript,
              decision: msg.decision,
              next_question: msg.next_question,
              clarifying_question: msg.clarifying_question,
            });
            ws.close();
            return;
          }
          if (msg.type === "error") {
            reject(new Error(msg.detail || "Transcription error"));
            ws.close();
            return;
          }
        } catch (e) {
          reject(new Error("Invalid server response"));
          ws.close();
          return;
        }
      } else {
        // unexpected binary
      }
    };
  });
}