"use client";
import { Rnd } from "react-rnd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bot, Clock, MessageSquare, Mic, MoreHorizontal, PhoneOff, User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { createVideoStreamClient, type VideoStreamClient } from "@/services/video_ws";
import { useInterviewAudio } from "@/hooks/useInterviewAudio";

type TranscriptEntry = {
  id: string;
  role: "ai" | "user";
  text: string;
};

/**
 * Pick the built-in laptop webcam, avoiding phone/virtual cameras.
 */
async function getBuiltinCameraId(): Promise<string | undefined> {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((d) => d.kind === "videoinput");
    const externalKeywords = [
      "iphone", "ipad", "android", "phone", "continuity",
      "obs", "virtual", "capture", "droidcam", "epoccam",
    ];
    const builtIn = cameras.find((cam) => {
      const label = cam.label.toLowerCase();
      return !externalKeywords.some((kw) => label.includes(kw));
    });
    return builtIn?.deviceId ?? cameras[0]?.deviceId;
  } catch {
    return undefined;
  }
}

// Module-level flag — survives Strict Mode remount cycles.
// Prevents the audio flow from firing twice in React dev mode.
let _audioFlowStarted = false;

export default function InterviewRoom() {
  const [timeElapsed, setTimeElapsed]     = useState(0);
  const [transcript, setTranscript]       = useState<TranscriptEntry[]>([]);
  const [isStartingInterview, setIsStartingInterview] = useState(true);
  const [cameraError, setCameraError]     = useState<string | null>(null);
  const [emotion, setEmotion]             = useState("");
  const [confidence, setConfidence]       = useState(0);
  const [predictionError, setPredictionError] = useState<string | null>(null);
  const [isClientMounted, setIsClientMounted] = useState(false);
  const [isSwapped, setIsSwapped]         = useState(false);
  const [audioError, setAudioError]       = useState<string | null>(null);
  const router = useRouter();

  const videoRef              = useRef<HTMLVideoElement>(null);
  const streamRef             = useRef<MediaStream | null>(null);
  const videoStreamRef        = useRef<VideoStreamClient | null>(null);
  const transcriptEndRef      = useRef<HTMLDivElement>(null);
  const interviewSessionIdRef = useRef<string | null>(null);
  const audioStartedRef       = useRef(false);

  // ── Audio hook ─────────────────────────────────────────────────────────────
  // useCallback stabilises these so startQuestion gets a stable reference,
  // preventing the audio useEffect from re-firing on every render.
  const handleTranscript = useCallback((text: string) => {
    setTranscript((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", text },
    ]);
  }, []);

  const handleAudioError = useCallback((msg: string) => {
    setAudioError(msg);
  }, []);

  const { isAiSpeaking, isRecording, isTranscribing, startQuestion } =
    useInterviewAudio({
      onTranscript: handleTranscript,
      onError:      handleAudioError,
    });

  // ── Add an AI bubble helper ────────────────────────────────────────────────
  const addAiBubble = (text: string) => {
    setTranscript((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "ai", text },
    ]);
  };

  // ── Video emotion handler ──────────────────────────────────────────────────
  const handleVideoMessage = async (message: {
    emotion?: string;
    confidence?: number;
  }) => {
    setIsStartingInterview(false);
    if (typeof message.emotion === "string")   setEmotion(message.emotion);
    if (typeof message.confidence === "number") setConfidence(message.confidence);
  };

  const captureAndSendFrame = async (client: VideoStreamClient) => {
    const video = videoRef.current;
    if (!video || !client.isConnected()) return;
    if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;
    if (video.videoWidth === 0 || video.videoHeight === 0) return;

    const canvas = document.createElement("canvas");
    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const base64Frame = canvas.toDataURL("image/jpeg", 0.85).split(",")[1];
    if (!base64Frame) return;

    try {
      await client.sendFrame(base64Frame);
      if (predictionError) setPredictionError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Video websocket streaming failed";
      setPredictionError((prev) => (prev === message ? prev : message));
    }
  };

  // ── Camera + video WebSocket ───────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;

    const sessionId = window.sessionStorage.getItem("interviewSessionId");
    interviewSessionIdRef.current = sessionId;

    if (!sessionId) {
      setIsStartingInterview(false);
      setPredictionError("Missing interview session.");
      return;
    }

    let mounted = true;
    let interval: number | null = null;
    let isCleanedUp = false;

    const client = createVideoStreamClient({
      sessionId,
      onOpen:    () => setPredictionError(null),
      onMessage: handleVideoMessage,
      onError: (error) => {
        if (isCleanedUp) return;
        setIsStartingInterview(false);
        const message = error instanceof Error ? error.message : "Video websocket failed";
        setPredictionError(message);
      },
      onClose: () => { if (!isCleanedUp) setIsStartingInterview(false); },
    });
    videoStreamRef.current = client;

    const startCamera = async () => {
      try {
        const deviceId = await getBuiltinCameraId();
        const videoConstraint = deviceId
          ? { deviceId: { exact: deviceId }, width: { ideal: 1280 }, height: { ideal: 720 } }
          : { width: { ideal: 1280 }, height: { ideal: 720 } };

        let stream: MediaStream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: videoConstraint,
            audio: true,
          });
        } catch {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        }
        if (!mounted) { stream.getTracks().forEach((t) => t.stop()); return; }

        let retries = 0;
        while (!videoRef.current && retries < 20) {
          await new Promise((r) => window.setTimeout(r, 100));
          retries++;
        }
        if (!videoRef.current) { stream.getTracks().forEach((t) => t.stop()); return; }

        streamRef.current = stream;
        videoRef.current.srcObject = stream;

        await new Promise<void>((resolve) => {
          const video = videoRef.current;
          if (!video || video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) { resolve(); return; }
          video.addEventListener("canplay", () => resolve(), { once: true });
        });

        await videoRef.current.play().catch(() => undefined);

        // Wait for WS connection (max 10s)
        await new Promise<void>((resolve) => {
          if (client.isConnected()) { resolve(); return; }
          let waited = 0;
          const poll = window.setInterval(() => {
            waited += 100;
            if (client.isConnected() || waited >= 10000) {
              window.clearInterval(poll); resolve();
            }
          }, 100);
        });

        if (!mounted) return;
        interval = window.setInterval(() => void captureAndSendFrame(client), 2000);
      } catch (error) {
        if (isCleanedUp) return;
        const err = error as DOMException;
        let errorMsg = "Camera unavailable";
        if (err.name === "NotReadableError")  errorMsg = "Camera in use by another app";
        if (err.name === "NotAllowedError")   errorMsg = "Camera permission denied";
        if (err.name === "NotFoundError")     errorMsg = "No camera found";
        if (mounted) setCameraError(errorMsg);
      }
    };

    startCamera();

    return () => {
      mounted = false;
      isCleanedUp = true;
      if (interval !== null) window.clearInterval(interval);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      client.close();
      videoStreamRef.current = null;
    };
  }, []);

  // ── Timer (Count Up) ───────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setInterval(() => setTimeElapsed((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // ── Start audio flow once on mount ────────────────────────────────────────
  // Uses a ref to startQuestion so this effect only runs once on mount
  // regardless of whether startQuestion's reference changes between renders.
  const startQuestionRef = useRef(startQuestion);
  useEffect(() => { startQuestionRef.current = startQuestion; }, [startQuestion]);

  useEffect(() => {
    console.log("[InterviewRoom] mount effect fired, _audioFlowStarted:", _audioFlowStarted);

    if (_audioFlowStarted) {
      console.log("[InterviewRoom] already started — skipping");
      return;
    }
    _audioFlowStarted = true;

    let firstQuestion =
      "Hello! I'm your AI Interviewer. Let's begin — please introduce yourself.";

    try {
      const raw = window.sessionStorage.getItem("interviewQuestions");
      console.log("[InterviewRoom] raw questions from sessionStorage:", raw);

      if (raw) {
        const questions: string[] = JSON.parse(raw);
        console.log("[InterviewRoom] parsed questions:", questions);
        if (Array.isArray(questions) && questions.length > 0 && questions[0]) {
          firstQuestion = questions[0];
          console.log("[InterviewRoom] firstQuestion set to:", firstQuestion);
        }
      } else {
        console.warn("[InterviewRoom] no interviewQuestions in sessionStorage — using fallback");
      }
    } catch (e) {
      console.error("[InterviewRoom] failed to parse questions:", e);
    }

    // Strict Mode in React dev intentionally unmounts+remounts every component.
    // The cleanup return was cancelling the timeout on the first unmount,
    // and the ref blocked the second mount from rescheduling.
    // Fix: no cleanup — let the timeout fire. The ref prevents double execution.
    console.log("[InterviewRoom] scheduling audio start in 1500ms...");
    window.setTimeout(() => {
      console.log("[InterviewRoom] adding AI bubble:", firstQuestion);
      addAiBubble(firstQuestion);

      console.log("[InterviewRoom] calling startQuestion...");
      void startQuestionRef.current(firstQuestion).then(() => {
        console.log("[InterviewRoom] startQuestion completed");
      }).catch((err: unknown) => {
        console.error("[InterviewRoom] startQuestion threw:", err);
      });
    }, 1500);

  }, []);  // empty deps — runs exactly once on mount

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  useEffect(() => { setIsClientMounted(true); }, []);

  useEffect(() => {
    if (videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => undefined);
    }
  }, [isSwapped]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // ── End call handler ───────────────────────────────────────────────────────
  // Stops camera/mic tracks immediately (rather than waiting for the route's
  // unmount cleanup) so the loading screen doesn't show a "camera still on"
  // indicator, then sends the user to the evaluation loading page.
  const handleEndCall = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    videoStreamRef.current?.close();
    router.replace("/interview-loading");
  };

  // ── Status bar label ───────────────────────────────────────────────────────
  const statusLabel = () => {
    if (isStartingInterview) return { icon: <Mic className="w-4 h-4 text-neutral-400" />, text: "Starting interview…" };
    if (isAiSpeaking)        return { icon: <Bot className="w-4 h-4 text-indigo-600" />,  text: "AI is speaking…" };
    if (isRecording)         return { icon: <Mic className="w-4 h-4 text-red-500 animate-pulse" />, text: "Listening to your response…" };
    if (isTranscribing)      return { icon: <Bot className="w-4 h-4 text-indigo-400" />,  text: "Processing your answer…" };
    return { icon: <Mic className="w-4 h-4 text-neutral-400" />, text: "Ready" };
  };

  const renderCameraView = (isMain: boolean) => (
    <div className="relative h-full w-full bg-neutral-900 flex items-center justify-center">
      {cameraError === null ? (
        <>
          <video ref={videoRef} autoPlay playsInline muted
            className="w-full h-full object-cover transform scale-x-[-1]" />
          {emotion && (
            <div className={`absolute bg-black/65 backdrop-blur-md text-white rounded-xl shadow-lg border border-white/10 ${
              isMain ? "bottom-6 left-6 px-4 py-2 text-sm" : "bottom-4 left-4 px-3 py-1.5 text-xs"
            }`}>
              <div className="font-semibold capitalize">{emotion}</div>
              <div className="text-xs text-neutral-300">{(confidence * 100).toFixed(1)}% confidence</div>
            </div>
          )}
        </>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 bg-neutral-900">
          <User className="mb-3 h-8 w-8 opacity-50" />
          <span className="text-sm">{cameraError}</span>
        </div>
      )}
    </div>
  );

  const renderAiView = (isMain: boolean) => (
    <div className={`relative flex h-full w-full flex-col items-center justify-center transition-transform duration-500 ${isMain ? "scale-100" : "scale-75"}`}>
      {isAiSpeaking && (
        <motion.div
          initial={{ opacity: 0.3, scale: 0.9 }}
          animate={{ opacity: [0.2, 0.55, 0.2], scale: [1, 1.12, 1] }}
          transition={{ repeat: Infinity, duration: 2.2 }}
          className="absolute -inset-14 rounded-full bg-neutral-500/20 blur-3xl"
        />
      )}
      <div className="relative flex h-56 w-56 items-center justify-center rounded-full border border-neutral-700 bg-gradient-to-br from-neutral-800 to-neutral-900 shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
          className="absolute inset-3 rounded-full border border-dashed border-neutral-600/70" />
        <motion.div
          animate={{ scale: isAiSpeaking ? [1, 1.05, 1] : 1 }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className={`relative z-10 flex h-32 w-32 flex-col items-center justify-center rounded-full border transition-colors duration-500 ${
            isAiSpeaking ? "border-neutral-400 bg-neutral-700/40 shadow-[0_0_40px_rgba(255,255,255,0.08)]"
                         : "border-neutral-700 bg-neutral-800/80"
          }`}
        >
          <Bot className={`mb-2 h-11 w-11 ${isAiSpeaking ? "text-white" : "text-neutral-400"}`} />
          <div className="flex h-4 items-end gap-1">
            {[1, 2, 3, 4].map((i) => (
              <motion.div key={i}
                animate={{ height: isAiSpeaking ? ["25%", "100%", "25%"] : "25%" }}
                transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.1 }}
                className={`w-1 rounded-full ${isAiSpeaking ? "bg-white" : "bg-neutral-600"}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
      {isMain && (
        <div className="mt-6 rounded-full border border-white/10 bg-black/20 px-4 py-2 backdrop-blur-md">
          <span className="text-xs font-bold uppercase tracking-[0.24em] text-neutral-300">AI Interviewer</span>
        </div>
      )}
    </div>
  );

  const { icon: statusIcon, text: statusText } = statusLabel();

  return (
    <div className="min-h-screen w-full bg-neutral-950 text-white overflow-hidden font-sans">
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute left-[12%] top-[10%] h-80 w-80 rounded-full bg-neutral-700/20 blur-3xl" />
        <div className="absolute right-[10%] bottom-[8%] h-96 w-96 rounded-full bg-neutral-800/30 blur-3xl" />
      </div>

      <div className="relative grid min-h-screen grid-cols-1 gap-6 p-4 lg:grid-cols-[minmax(0,1fr)_420px] lg:p-6">
        {predictionError && (
          <div className="absolute right-4 top-4 z-50 rounded-md bg-red-500/90 px-3 py-2 text-xs text-white shadow-lg">
            Emotion API: {predictionError}
          </div>
        )}
        {audioError && (
          <div className="absolute right-4 top-14 z-50 rounded-md bg-orange-500/90 px-3 py-2 text-xs text-white shadow-lg">
            Audio: {audioError}
          </div>
        )}

        {/* LEFT SIDE */}
        <div className="relative min-h-[calc(100vh-2rem)] overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950 shadow-2xl lg:min-h-[calc(100vh-3rem)]">
          <div className="absolute inset-0 pointer-events-none opacity-[0.06] [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:28px_28px]" />

          <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-20">
            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-bold tracking-widest uppercase">Live Recording</span>
            </div>
            <div className="bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
              <Clock className="w-4 h-4 text-neutral-400" />
              <span className="font-mono text-sm font-medium">{formatTime(timeElapsed)}</span>
            </div>
          </div>

          <div className="absolute inset-8 top-24 bottom-28 z-10 flex items-center justify-center rounded-3xl"
            onDoubleClick={() => setIsSwapped((p) => !p)} title="Double-click to swap">
            {isSwapped ? (
              <div className="h-full w-full overflow-hidden rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                {renderCameraView(true)}
              </div>
            ) : renderAiView(true)}
          </div>

          {isClientMounted && (
            <Rnd
              default={{ x: 28, y: typeof window !== "undefined" ? window.innerHeight - 290 : 0, width: 340, height: 210 }}
              minWidth={250} minHeight={150} bounds="window" className="z-40"
            >
              <div className="w-full h-full rounded-3xl overflow-hidden bg-neutral-900 border border-white/10 shadow-2xl relative backdrop-blur-md"
                onDoubleClick={() => setIsSwapped((p) => !p)} title="Double-click to swap">
                {isSwapped ? renderAiView(false) : renderCameraView(false)}
              </div>
            </Rnd>
          )}

          <div className="absolute bottom-8 right-8 z-20">
            <button onClick={handleEndCall}
              className="px-6 py-4 rounded-2xl font-medium flex items-center gap-2 transition-all bg-red-600 hover:bg-red-700 text-white shadow-xl">
              <PhoneOff className="w-5 h-5" />
              End Call
            </button>
          </div>
        </div>

        {/* RIGHT SIDE - TRANSCRIPT */}
        <motion.div
          initial={{ x: 400 }} animate={{ x: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 200 }}
          className="z-20 flex h-[520px] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-white text-neutral-900 shadow-[0_20px_60px_rgba(0,0,0,0.28)] lg:h-[calc(100vh-3rem)]"
        >
          <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-600" />
              <h2 className="font-bold text-lg tracking-tight">Live Transcript</h2>
            </div>
            <MoreHorizontal className="w-5 h-5 text-neutral-400" />
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-neutral-50/50">
            <AnimatePresence initial={false}>
              {transcript.map((msg) => (
                <motion.div key={msg.id}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                >
                  <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-1 ml-1">
                    {msg.role === "ai" ? "AI Assistant" : "You"}
                  </span>
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed max-w-[90%] shadow-sm border ${
                    msg.role === "user"
                      ? "bg-neutral-900 text-white rounded-tr-none border-neutral-900"
                      : "bg-white text-neutral-700 rounded-tl-none border-neutral-200"
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={transcriptEndRef} />
          </div>

          <div className="p-4 bg-white border-t border-neutral-100">
            <div className="flex items-center gap-3 px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-500">
              {statusIcon}
              {statusText}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}