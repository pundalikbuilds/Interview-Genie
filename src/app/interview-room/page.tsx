"use client";

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
  const router = useRouter();

  const videoRef = useRef<HTMLVideoElement>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const transcriptIdRef = useRef(0);
  const scriptStartedRef = useRef(false);
  const scriptTimeoutsRef = useRef<number[]>([]);

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
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
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

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-neutral-700 via-neutral-800 to-neutral-900 text-white overflow-hidden font-sans">
      
      {/* LEFT SIDE */}
      <div className="relative flex-1 p-6">

        {/* Top Bar */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-20">
          <div className="flex items-center gap-2 bg-neutral-900/50 backdrop-blur-md px-4 py-2 rounded-full border border-neutral-800">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-bold tracking-widest uppercase">
              Live Recording
            </span>
          </div>

          <div className="bg-neutral-900/50 backdrop-blur-md px-4 py-2 rounded-full border border-neutral-800 flex items-center gap-2">
            <Clock className="w-4 h-4 text-neutral-400" />
            <span className="font-mono text-sm font-medium">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* WEBCAM (40% bottom-left) */}
        <div className="absolute bottom-8 left-8 w-[40%] aspect-video rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-2xl z-10">
          {cameraError === null ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform scale-x-[-1]"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-neutral-900 to-neutral-950">
              <div className="w-20 h-20 rounded-full bg-neutral-800 flex items-center justify-center mb-3 border border-neutral-700">
                <User className="w-8 h-8 text-neutral-500" />
              </div>
              <p className="text-red-400 text-sm font-medium">{cameraError}</p>
              <p className="text-neutral-500 text-xs mt-1">Close other apps using camera and refresh</p>
            </div>
          )}
        </div>

        {/* End Call Button */}
        <div className="absolute bottom-8 right-8 z-20">
          <button
            onClick={handleEndCall}
            className="px-6 py-4 rounded-xl font-medium flex items-center gap-2 transition-all bg-red-600 hover:bg-red-700 text-white shadow-xl"
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
        className="w-[500px] bg-white text-neutral-900 flex flex-col rounded-l-3xl shadow-[-20px_0_50px_rgba(0,0,0,0.5)] z-20 my-4"

      >
        <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-white rounded-tl-3xl">
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

        <div className="p-4 bg-white border-t border-neutral-100 rounded-bl-3xl">
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
      {/* AI ASSISTANT - TRUE SCREEN CENTER */}
<div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
  <div className="relative">

    {isAiSpeaking && (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0.4, 0.9, 0.4], scale: [1, 1.15, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute -inset-10 bg-indigo-500/30 rounded-full blur-3xl"
      />
    )}

    <div className="relative w-56 h-56 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-800 flex flex-col items-center justify-center shadow-2xl border border-indigo-400/30">

      <Bot className="w-16 h-16 text-white mb-2" />

      <span className="text-sm font-bold tracking-widest uppercase text-white/80">
        AI Assistant
      </span>

      {isAiSpeaking && (
        <div className="absolute bottom-10 flex gap-1 items-end h-5">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              animate={{ height: ["40%", "100%", "40%"] }}
              transition={{
                repeat: Infinity,
                duration: 0.8,
                delay: i * 0.15,
              }}
              className="w-1 bg-white rounded-full"
            />
          ))}
        </div>
      )}
    </div>
  </div>
</div>

    </div>
  );
}
