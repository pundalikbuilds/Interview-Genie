"use client";
import { Rnd } from "react-rnd";
import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  Clock,
  MessageSquare,
  Mic,
  MoreHorizontal,
  PhoneOff,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";

const MOCK_SCRIPT = [
  {
    role: "ai",
    text: "Hello! I am your AI Interviewer. Welcome, I'm excited to get to know you. Could you briefly introduce yourself?",
    delay: 2000,
  },
  {
    role: "user",
    text: "Hi, thanks for having me. I'm a frontend developer with 5 years of experience building React applications.",
    delay: 6000,
  },
  {
    role: "ai",
    text: "That's great. To get us started, can you describe a challenging technical problem you solved recently?",
    delay: 10000,
  },
] as const;

type TranscriptEntry = {
  id: string;
  role: "ai" | "user";
  text: string;
};

export default function InterviewRoom() {
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [isAiSpeaking, setIsAiSpeaking] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [emotion, setEmotion] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [predictionError, setPredictionError] = useState<string | null>(null);
  const [isClientMounted, setIsClientMounted] = useState(false);
  const [isSwapped, setIsSwapped] = useState(false);
  const router = useRouter();

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const transcriptIdRef = useRef(0);
  const scriptStartedRef = useRef(false);
  const scriptTimeoutsRef = useRef<number[]>([]);
  const predictionRetryAfterRef = useRef(0);
  const predictionApiUrl =
    process.env.NEXT_PUBLIC_PREDICTION_API_URL ?? "/api/";

  // EMOTION DETECTION
  const captureAndSendFrame = async () => {
  if (!videoRef.current) return;
  if (Date.now() < predictionRetryAfterRef.current) return;
  if (videoRef.current.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;
  if (videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) return;

  const canvas = document.createElement("canvas");
  canvas.width = videoRef.current.videoWidth;
  canvas.height = videoRef.current.videoHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.drawImage(videoRef.current, 0, 0);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg")
  );

  if (!blob) return;

  const formData = new FormData();
  formData.append("file", blob, "frame.jpg");

  try {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 8000);
    const res = await fetch(predictionApiUrl, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });
    window.clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Prediction API failed with ${res.status}`);
    }

    const data = await res.json();
    setEmotion(data.emotion);
    setConfidence(data.confidence);
    if (predictionError) {
      setPredictionError(null);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Prediction request failed";
    predictionRetryAfterRef.current = Date.now() + 10000;
    setPredictionError((prev) => (prev === message ? prev : message));
  }
};
useEffect(() => {
  const interval = setInterval(() => {
    captureAndSendFrame();
  }, 2000); // every 2 seconds

  return () => clearInterval(interval);
}, []);
  // CAMERA
  useEffect(() => {
    let stream: MediaStream | null = null;
    let mounted = true;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: true,
        });
        streamRef.current = stream;
        if (videoRef.current && mounted) {
          videoRef.current.srcObject = stream;
          // Ensure video plays
          try {
            await videoRef.current.play();
          } catch (playError) {
            console.warn("Video autoplay failed, user interaction may be required:", playError);
          }
        }
      } catch (error) {
        const err = error as DOMException;
        console.error("Camera error:", err.name, err.message);
        let errorMsg = "Camera unavailable";
        if (err.name === "NotReadableError") {
          errorMsg = "Camera in use by another app";
        } else if (err.name === "NotAllowedError") {
          errorMsg = "Camera permission denied";
        } else if (err.name === "NotFoundError") {
          errorMsg = "No camera found";
        }
        if (mounted) {
          setCameraError(errorMsg);
        }
      }
    };

    startCamera();

    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  // TIMER
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      router.replace("/feedback");
    }
  }, [timeLeft, router]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${secs}`;
  };

  const handleEndCall = () => {
    router.replace("/feedback");
  };

  // MOCK SCRIPT
  useEffect(() => {
    if (scriptStartedRef.current) return;
    scriptStartedRef.current = true;

    MOCK_SCRIPT.forEach((msg, index) => {
      const timeoutId = window.setTimeout(() => {
        if (msg.role === "ai") setIsAiSpeaking(true);

        transcriptIdRef.current += 1;
        const uniqueId = crypto.randomUUID();

        setTranscript((prev) => [
          ...prev,
          {
            id: uniqueId,
            role: msg.role,
            text: msg.text,
          },
        ]);

        if (msg.role === "ai") {
          const speakingTimeout = window.setTimeout(
            () => setIsAiSpeaking(false),
            msg.text.length * 50
          );
          scriptTimeoutsRef.current.push(speakingTimeout);
        }
      }, msg.delay);

      scriptTimeoutsRef.current.push(timeoutId);
    });

    return () => {
      scriptTimeoutsRef.current.forEach((timeoutId) =>
        window.clearTimeout(timeoutId)
      );
      scriptTimeoutsRef.current = [];
      scriptStartedRef.current = false;
    };
  }, []);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  useEffect(() => {
    setIsClientMounted(true);
  }, []);

  useEffect(() => {
    if (videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => undefined);
    }
  }, [isSwapped]);

  const renderCameraView = (isMain: boolean) => (
    <div className="relative h-full w-full bg-neutral-900 flex items-center justify-center">
      {cameraError === null ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover transform scale-x-[-1]"
          />

          {emotion && (
            <div
              className={`absolute bg-black/65 backdrop-blur-md text-white rounded-xl shadow-lg border border-white/10 ${
                isMain ? 'bottom-6 left-6 px-4 py-2 text-sm' : 'bottom-4 left-4 px-3 py-1.5 text-xs'
              }`}
            >
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
    <div
      className={`relative flex h-full w-full flex-col items-center justify-center transition-transform duration-500 ${
        isMain ? 'scale-100' : 'scale-75'
      }`}
    >
      {isAiSpeaking && (
        <motion.div
          initial={{ opacity: 0.3, scale: 0.9 }}
          animate={{ opacity: [0.2, 0.55, 0.2], scale: [1, 1.12, 1] }}
          transition={{ repeat: Infinity, duration: 2.2 }}
          className="absolute -inset-14 rounded-full bg-neutral-500/20 blur-3xl"
        />
      )}

      <div className="relative flex h-56 w-56 items-center justify-center rounded-full border border-neutral-700 bg-gradient-to-br from-neutral-800 to-neutral-900 shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 18, ease: 'linear' }}
          className="absolute inset-3 rounded-full border border-dashed border-neutral-600/70"
        />
        <motion.div
          animate={{ scale: isAiSpeaking ? [1, 1.05, 1] : 1 }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className={`relative z-10 flex h-32 w-32 flex-col items-center justify-center rounded-full border transition-colors duration-500 ${
            isAiSpeaking
              ? 'border-neutral-400 bg-neutral-700/40 shadow-[0_0_40px_rgba(255,255,255,0.08)]'
              : 'border-neutral-700 bg-neutral-800/80'
          }`}
        >
          <Bot className={`mb-2 h-11 w-11 ${isAiSpeaking ? 'text-white' : 'text-neutral-400'}`} />
          <div className="flex h-4 items-end gap-1">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                animate={{ height: isAiSpeaking ? ['25%', '100%', '25%'] : '25%' }}
                transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.1 }}
                className={`w-1 rounded-full ${isAiSpeaking ? 'bg-white' : 'bg-neutral-600'}`}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {isMain && (
        <div className="mt-6 rounded-full border border-white/10 bg-black/20 px-4 py-2 backdrop-blur-md">
          <span className="text-xs font-bold uppercase tracking-[0.24em] text-neutral-300">
            AI Interviewer
          </span>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-neutral-950 text-white overflow-hidden font-sans">
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute left-[12%] top-[10%] h-80 w-80 rounded-full bg-neutral-700/20 blur-3xl" />
        <div className="absolute right-[10%] bottom-[8%] h-96 w-96 rounded-full bg-neutral-800/30 blur-3xl" />
      </div>

      <div className="relative grid min-h-screen grid-cols-1 gap-6 p-4 lg:grid-cols-[minmax(0,1fr)_420px] lg:p-6">
      {predictionError && (
        <div className="absolute right-4 top-4 z-50 rounded-md bg-red-500/90 px-3 py-2 text-xs text-white shadow-lg">
          Emotion API unavailable: {predictionError}
        </div>
      )}
      
      {/* LEFT SIDE */}
      <div className="relative min-h-[calc(100vh-2rem)] overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950 shadow-2xl lg:min-h-[calc(100vh-3rem)]">

        <div className="absolute inset-0 pointer-events-none opacity-[0.06] [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:28px_28px]" />

        {/* Top Bar */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-20">
          <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-bold tracking-widest uppercase">
              Live Recording
            </span>
          </div>

          <div className="bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
            <Clock className="w-4 h-4 text-neutral-400" />
            <span className="font-mono text-sm font-medium">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        <div
          className="absolute inset-8 top-24 bottom-28 z-10 flex items-center justify-center rounded-3xl"
          onDoubleClick={() => setIsSwapped((prev) => !prev)}
          title="Double-click to swap"
        >
          {isSwapped ? (
            <div className="h-full w-full overflow-hidden rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              {renderCameraView(true)}
            </div>
          ) : (
            renderAiView(true)
          )}
        </div>

        {/* WEBCAM (40% bottom-left) */}
        {isClientMounted && (
          <Rnd
            default={{
              x: 28,
              y: typeof window !== 'undefined' ? window.innerHeight - 290 : 0,
              width: 340,
              height: 210,
            }}
            minWidth={250}
            minHeight={150}
            bounds="window"
            className="z-40"
          >
            <div
              className="w-full h-full rounded-3xl overflow-hidden bg-neutral-900 border border-white/10 shadow-2xl relative backdrop-blur-md"
              onDoubleClick={() => setIsSwapped((prev) => !prev)}
              title="Double-click to swap"
            >
              {isSwapped ? renderAiView(false) : renderCameraView(false)}
            </div>
          </Rnd>
        )}
        

        {/* End Call Button */}
        <div className="absolute bottom-8 right-8 z-20">
          <button
            onClick={handleEndCall}
            className="px-6 py-4 rounded-2xl font-medium flex items-center gap-2 transition-all bg-red-600 hover:bg-red-700 text-white shadow-xl"
          >
            <PhoneOff className="w-5 h-5" />
            End Call
          </button>
        </div>


      </div>

      {/* RIGHT SIDE - TRANSCRIPT */}
      <motion.div
        initial={{ x: 400 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
        className="z-20 flex min-h-[520px] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-white text-neutral-900 shadow-[0_20px_60px_rgba(0,0,0,0.28)] lg:min-h-[calc(100vh-3rem)]"

      >
        <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            <h2 className="font-bold text-lg tracking-tight">
              Live Transcript
            </h2>
          </div>
          <MoreHorizontal className="w-5 h-5 text-neutral-400" />
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-neutral-50/50">
          <AnimatePresence initial={false}>
            {transcript.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col ${
                  msg.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-1 ml-1">
                  {msg.role === "ai" ? "AI Assistant" : "You"}
                </span>
                <div
                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed max-w-[90%] shadow-sm border ${
                    msg.role === "user"
                      ? "bg-neutral-900 text-white rounded-tr-none border-neutral-900"
                      : "bg-white text-neutral-700 rounded-tl-none border-neutral-200"
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={transcriptEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-neutral-100">
          <div className="flex items-center gap-3 px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-500">
            {isAiSpeaking ? (
              <>
                <Bot className="w-4 h-4 text-indigo-600" />
                AI is speaking...
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 text-neutral-400" />
                Listening to your response...
              </>
            )}
          </div>
        </div>
      </motion.div>
      </div>
    </div>
  );
}