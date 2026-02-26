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
import Link from "next/link";
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
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const router = useRouter();

  const videoRef = useRef<HTMLVideoElement>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const transcriptIdRef = useRef(0);
  const scriptStartedRef = useRef(false);
  const scriptTimeoutsRef = useRef<number[]>([]);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Camera access denied or unavailable.", error);
        setCameraError(true);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

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

  useEffect(() => {
    if (scriptStartedRef.current) {
      return;
    }

    scriptStartedRef.current = true;

    MOCK_SCRIPT.forEach((msg, index) => {
      const timeoutId = window.setTimeout(() => {
        if (msg.role === "ai") {
          setIsAiSpeaking(true);
        }

        transcriptIdRef.current += 1;
        const uniqueId =
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `msg-${transcriptIdRef.current}-${Date.now()}-${index}`;

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
      scriptTimeoutsRef.current.forEach((timeoutId) => {
        window.clearTimeout(timeoutId);
      });
      scriptTimeoutsRef.current = [];
      scriptStartedRef.current = false;
    };
  }, []);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  return (
    <div className="flex h-screen w-full bg-neutral-950 text-white overflow-hidden font-sans">
      <div className="relative flex-1 p-4 flex flex-col justify-between">
        <div className="relative z-10 flex justify-between items-center px-4 py-2">
          <div className="flex items-center gap-2 bg-neutral-900/50 backdrop-blur-md px-4 py-2 rounded-full border border-neutral-800">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-bold tracking-widest uppercase">
              Live Recording
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-neutral-900/50 backdrop-blur-md px-4 py-2 rounded-full border border-neutral-800 flex items-center gap-2">
              <Clock className="w-4 h-4 text-neutral-400" />
              <span className="font-mono text-sm font-medium">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        </div>

        <div className="absolute inset-4 rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800 z-0">
          {!cameraError ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform scale-x-[-1]"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-neutral-900 to-neutral-950">
              <div className="w-24 h-24 rounded-full bg-neutral-800 flex items-center justify-center mb-4 border border-neutral-700">
                <User className="w-10 h-10 text-neutral-500" />
              </div>
              <p className="text-neutral-400 text-sm">Camera is turned off</p>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />
        </div>

        <div className="relative z-10 flex justify-between items-end px-4 pb-4">
          <div className="bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-lg border border-white/10 text-sm font-medium">
            You
          </div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute left-1/2 bottom-8 -translate-x-1/2 flex items-center gap-4 bg-neutral-900/80 backdrop-blur-xl p-3 rounded-2xl border border-neutral-800 shadow-2xl"
          >
            <button
              type="button"
              onClick={handleEndCall}
              className="px-6 py-4 rounded-xl font-medium flex items-center gap-2 transition-all bg-red-600 hover:bg-red-700 text-white"
            >
              <PhoneOff className="w-5 h-5" />
              End Call
            </button>
          </motion.div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative"
          >
            {isAiSpeaking && (
              <motion.div
                layoutId="glow"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -inset-2 bg-indigo-500/30 rounded-3xl blur-xl"
              />
            )}

            <div className="relative bg-neutral-900 border border-neutral-700 w-32 h-40 rounded-2xl shadow-2xl overflow-hidden flex flex-col items-center justify-center bg-gradient-to-t from-indigo-950/50 to-neutral-900">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-500 ${
                  isAiSpeaking ? "bg-indigo-600" : "bg-neutral-800"
                }`}
              >
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="mt-3 text-xs font-bold tracking-widest uppercase text-neutral-300">
                AI Assistant
              </span>
              {isAiSpeaking && (
                <div className="absolute bottom-3 flex gap-1 items-end h-3">
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ height: ["40%", "100%", "40%"] }}
                      transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                      className="w-1 bg-indigo-400 rounded-full"
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ x: 400 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
        className="w-96 bg-white text-neutral-900 flex flex-col rounded-l-3xl shadow-[-20px_0_50px_rgba(0,0,0,0.5)] z-20 my-4"
      >
        <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-white rounded-tl-3xl">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            <h2 className="font-bold text-lg tracking-tight">Live Transcript</h2>
          </div>
          <button className="text-neutral-400 hover:text-neutral-900 transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth bg-neutral-50/50">
          <AnimatePresence initial={false}>
            {transcript.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
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
    </div>
  );
}
