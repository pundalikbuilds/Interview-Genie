/**
 * src/services/audio_ws.ts
 * =========================
 * Persistent WebSocket client for the interview audio flow.
 * Mirrors the structure of video_ws.ts: one long-lived connection,
 * automatic reconnect, and callback-based message handling instead of
 * opening a fresh socket per request.
 */

type AudioStreamMessage = {
    type?: string;
    transcript?: string;
    question?: string;
    decision?: string;
    next_question?: string;
    clarifying_question?: string;
    report?: Record<string, unknown>;
    emotion?: string;
    confidence?: number;
    confidence_label?: string;
    detail?: string;
    [key: string]: unknown;
};

type CreateAudioStreamClientOptions = {
    sessionId?: string;
    endpoint?: string;
    onOpen?: () => void;
    onClose?: () => void;
    onError?: (error: Event | Error) => void;
    /** Fires for every JSON control/result message from the server. */
    onMessage?: (message: AudioStreamMessage) => void | Promise<void>;
    /** Fires for every binary WAV frame from the server (TTS audio). */
    onAudio?: (blob: Blob) => void | Promise<void>;
};

export type AudioStreamClient = {
    /** Ask the server to speak this text; result arrives via onAudio. */
    speak: (text: string) => void;
    /** Start the interview; first question audio/text arrives via onAudio/onMessage. */
    start: (sessionId?: string) => void;
    /** Tell the server a new answer is about to be streamed. */
    startRecording: (question?: string, sessionId?: string) => void;
    /** Stream one raw PCM chunk (16-bit mono) as it's captured — call repeatedly. */
    sendChunk: (pcmBuffer: ArrayBuffer) => void;
    /** Signal that the candidate stopped speaking; triggers transcription + evaluation. */
    endRecording: () => void;
    close: () => void;
    isConnected: () => boolean;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL;
const DEFAULT_AUDIO_WS_ENDPOINT = "ws://localhost:8000/api/audio/ws";

function normalizeWebSocketUrl(endpoint: string): string {
    // Allow a bare path (e.g. "/api/audio/ws") to resolve against API_BASE,
    // same convention as before but using URL for correctness.
    const base = endpoint.startsWith("ws://") || endpoint.startsWith("wss://") || endpoint.startsWith("http")
        ? endpoint
        : `${API_BASE ?? ""}${endpoint}`;

    const url = new URL(base, typeof window !== "undefined" ? window.location.origin : undefined);
    if (url.protocol === "http:") url.protocol = "ws:";
    else if (url.protocol === "https:") url.protocol = "wss:";
    return url.toString();
}

export function createAudioStreamClient({
    sessionId,
    endpoint = DEFAULT_AUDIO_WS_ENDPOINT,
    onOpen,
    onClose,
    onError,
    onMessage,
    onAudio,
}: CreateAudioStreamClientOptions = {}): AudioStreamClient {
    if (typeof window === "undefined") {
        throw new Error("Audio streaming is only available in the browser.");
    }

    let socket: WebSocket;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 6;
    const baseReconnectDelay = 1000; // ms
    let isManuallyClosed = false;

    function send(payload: Record<string, unknown>) {
        if (socket.readyState !== WebSocket.OPEN) return;
        socket.send(JSON.stringify(payload));
    }

    async function handleSocketMessage(event: MessageEvent) {
        // Binary frame = WAV audio
        if (event.data instanceof ArrayBuffer) {
            const blob = new Blob([event.data], { type: "audio/wav" });
            try {
                await onAudio?.(blob);
            } catch (error) {
                onError?.(error instanceof Error ? error : new Error("Audio frame handler failed"));
            }
            return;
        }

        // Text frame = JSON control/result message
        let parsedMessage: AudioStreamMessage;
        try {
            parsedMessage = JSON.parse(event.data) as AudioStreamMessage;
        } catch {
            parsedMessage = { type: "raw", payload: event.data };
        }
        try {
            await onMessage?.(parsedMessage);
        } catch (error) {
            onError?.(error instanceof Error ? error : new Error("Audio message handler failed"));
        }
    }

    function setupSocketListeners() {
        socket.binaryType = "arraybuffer";

        socket.addEventListener("open", () => {
            reconnectAttempts = 0;
            onOpen?.();
        });

        socket.addEventListener("message", (event) => {
            void handleSocketMessage(event);
        });

        socket.addEventListener("error", (event) => {
            onError?.(event);
        });

        socket.addEventListener("close", () => {
            onClose?.();
            if (isManuallyClosed) return;

            if (reconnectAttempts < maxReconnectAttempts) {
                const delay = baseReconnectDelay * Math.pow(2, reconnectAttempts);
                reconnectAttempts += 1;
                setTimeout(() => {
                    if (isManuallyClosed) return;
                    try {
                        socket = new WebSocket(normalizeWebSocketUrl(endpoint));
                        setupSocketListeners();
                    } catch {
                        // let the outer close handler schedule the next reconnect
                    }
                }, delay);
            }
        });
    }

    socket = new WebSocket(normalizeWebSocketUrl(endpoint));
    setupSocketListeners();

    return {
        speak(text: string) {
            send({ type: "speak", text });
        },
        start(overrideSessionId?: string) {
            send({ type: "start", session_id: overrideSessionId ?? sessionId });
        },
        startRecording(question?: string, overrideSessionId?: string) {
            send({ type: "record_start", session_id: overrideSessionId ?? sessionId, question });
        },
        sendChunk(pcmBuffer: ArrayBuffer) {
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(pcmBuffer);
            }
        },
        endRecording() {
            send({ type: "answer_end" });
        },
        close() {
            isManuallyClosed = true;
            if (socket.readyState === WebSocket.CONNECTING || socket.readyState === WebSocket.OPEN) {
                socket.close();
            }
        },
        isConnected() {
            return socket.readyState === WebSocket.OPEN;
        },
    };
}