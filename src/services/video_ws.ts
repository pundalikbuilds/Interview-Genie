type VideoStreamMessage = {
	type?: string;
	emotion?: string;
	confidence?: number;
	[key: string]: unknown;
};

type CreateVideoStreamClientOptions = {
	sessionId: string;
	endpoint?: string;
	onOpen?: () => void;
	onClose?: () => void;
	onError?: (error: Event | Error) => void;
	onMessage?: (message: VideoStreamMessage) => void | Promise<void>;
};

export type VideoStreamClient = {
	sendFrame: (frameB64: string) => Promise<void>;
	close: () => void;
	isConnected: () => boolean;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL;
const DEFAULT_VIDEO_WS_ENDPOINT = `${API_BASE}/api/video_ws`;

function normalizeWebSocketUrl(endpoint: string, sessionId: string) {
	const url = new URL(endpoint, window.location.origin);

	if (url.protocol === "http:") {
		url.protocol = "ws:";
	} else if (url.protocol === "https:") {
		url.protocol = "wss:";
	}

	url.searchParams.set("sessionId", sessionId);
	return url.toString();
}

export function createVideoStreamClient({
	sessionId,
	endpoint = DEFAULT_VIDEO_WS_ENDPOINT,
	onOpen,
	onClose,
	onError,
	onMessage,
}: CreateVideoStreamClientOptions): VideoStreamClient {
	if (typeof window === "undefined") {
		throw new Error("Video streaming is only available in the browser.");
	}

	let socket: WebSocket;
	socket = new WebSocket(normalizeWebSocketUrl(endpoint, sessionId));
	socket.binaryType = "arraybuffer";

	let reconnectAttempts = 0;
	const maxReconnectAttempts = 6;
	const baseReconnectDelay = 1000; // ms
	let isManuallyClosed = false;

	async function handleSocketMessage(event: MessageEvent) {
		if (typeof event.data !== "string") {
			return;
		}

		let parsedMessage: VideoStreamMessage;

		try {
			parsedMessage = JSON.parse(event.data) as VideoStreamMessage;
		} catch {
			parsedMessage = { type: "raw", payload: event.data };
		}

		try {
			await onMessage?.(parsedMessage);
		} catch (error) {
			onError?.(error instanceof Error ? error : new Error("Video message handler failed"));
		}
	}

	function setupSocketListeners() {
		socket.addEventListener("open", () => {
			// Inform server we're ready to start streaming
			try {
				socket.send(JSON.stringify({ type: "start" }));
			} catch {
				// ignore send errors on open
			}

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

				if (isManuallyClosed) {
					return;
				}

			// Try to reconnect with exponential backoff
			if (reconnectAttempts < maxReconnectAttempts) {
				const delay = baseReconnectDelay * Math.pow(2, reconnectAttempts);
				reconnectAttempts += 1;
				setTimeout(() => {
						if (isManuallyClosed) {
							return;
						}

					try {
						socket = new WebSocket(normalizeWebSocketUrl(endpoint, sessionId));
						socket.binaryType = "arraybuffer";
						setupSocketListeners();
					} catch (err) {
						// If creating a new socket fails, schedule another attempt
						// let the outer close handler schedule the next reconnect
					}
				}, delay);
			}
		});
	}

	setupSocketListeners();

	return {
		async sendFrame(frameB64: string) {
			if (socket.readyState !== WebSocket.OPEN) return;

			console.log("[WS] Sending frame, length:", frameB64.length);
			socket.send(JSON.stringify({ frame_b64: frameB64 }));
		},
		close() {
			isManuallyClosed = true;
			if (
				socket.readyState === WebSocket.CONNECTING ||
				socket.readyState === WebSocket.OPEN
			) {
				socket.close();
			}
		},
		isConnected() {
			return socket.readyState === WebSocket.OPEN;
		},
	};
}
