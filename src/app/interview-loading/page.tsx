"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Brain, Mic, Sparkles, FileSearch, Award } from "lucide-react";

const STAGES = [
  { icon: Mic, label: "Compiling your responses" },
  { icon: FileSearch, label: "Analyzing answer accuracy" },
  { icon: Brain, label: "Scoring confidence & delivery" },
  { icon: Sparkles, label: "Generating personalized feedback" },
  { icon: Award, label: "Finalizing your report" },
];

// Poll interval + safety timeout in case backend never resolves
const POLL_INTERVAL_MS = 2500;
const MAX_WAIT_MS = 30000; // 30 seconds

export default function InterviewLoadingPage() {
  const router = useRouter();
  const [stageIndex, setStageIndex] = useState(0);
  const startedAt = useRef<number>(Date.now());
  const pollTimer = useRef<number | null>(null);
  const stageTimer = useRef<number | null>(null);

  // Cycle through the stage labels regardless of backend timing —
  // purely cosmetic pacing so the user always sees forward motion.
  useEffect(() => {
    stageTimer.current = window.setInterval(() => {
      setStageIndex((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 4500); 
    return () => {
      if (stageTimer.current) window.clearInterval(stageTimer.current);
    };
  }, []);

  // Poll backend for evaluation completion. Backend contract assumed:
  //   GET {API_URL}/sessions/{sessionId}/status -> { ready: boolean }
  // Falls back to a timed redirect if the endpoint isn't available,
  // so the UI never gets stuck even if this route doesn't exist yet.
  useEffect(() => {
    const sessionId =
      typeof window !== "undefined"
        ? window.sessionStorage.getItem("interviewSessionId")
        : null;

    const finish = () => {
      window.setTimeout(() => router.replace("/feedback"), 600);
    };

    if (!sessionId) {
      // 30 seconds fallback timeout
      window.setTimeout(finish, 30000);
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

    const poll = async () => {
      const elapsed = Date.now() - startedAt.current;
      if (elapsed >= MAX_WAIT_MS) {
        finish();
        return;
      }
      try {
        const res = await fetch(`${apiUrl}/sessions/${sessionId}/status`, {
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.ready) {
            finish();
            return;
          }
        }
      } catch {
        // Endpoint not available yet — keep polling until MAX_WAIT_MS,
        // then fall back automatically.
      }
      pollTimer.current = window.setTimeout(poll, POLL_INTERVAL_MS);
    };

    pollTimer.current = window.setTimeout(poll, POLL_INTERVAL_MS);

    return () => {
      if (pollTimer.current) window.clearTimeout(pollTimer.current);
    };
  }, [router]);

  const ActiveIcon = STAGES[stageIndex].icon;

  return (
    <div className="absolute inset-0 z-50 flex min-h-screen w-full items-center justify-center overflow-hidden bg-black/80 backdrop-blur-xl font-sans">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <motion.div
          animate={{ scale: [1, 1.15, 1], x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[10%] top-[15%] h-96 w-96 rounded-full bg-indigo-600/20 blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, -50, 0], y: [0, 40, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          className="absolute right-[10%] bottom-[15%] h-[28rem] w-[28rem] rounded-full bg-purple-600/20 blur-[130px]"
        />
      </div>

      <div className="absolute inset-0 opacity-[0.05] [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:26px_26px]" />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center px-6 text-center">
        {/* Central animated core */}
        <div className="relative mb-10 flex h-44 w-44 items-center justify-center">
          
          {/* Radar ping effect */}
          {[...Array(2)].map((_, i) => (
            <motion.div
              key={`ping-${i}`}
              animate={{ scale: [0.8, 1.8], opacity: [0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: i * 1 }}
              className="absolute inset-5 rounded-full border border-indigo-400"
            />
          ))}

          {/* Outer rotating ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-dashed border-white/15"
          />
          
          {/* Inner counter-rotating ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
            className="absolute inset-5 rounded-full border border-white/10"
          />
          
          {/* Pulsing glow */}
          <motion.div
            animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.9, 1.05, 0.9] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-6 rounded-full bg-indigo-500/30 blur-2xl"
          />

          {/* Center icon — crossfades between stages */}
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-neutral-900/80 backdrop-blur-md shadow-[0_0_30px_rgba(99,102,241,0.2)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={stageIndex}
                initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.6, rotate: 20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <ActiveIcon className="h-9 w-9 text-indigo-300" />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold tracking-tight text-white"
        >
          Evaluating Your Interview
        </motion.h1>

        {/* Stage label */}
        <div className="mt-3 h-6 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={stageIndex}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="text-sm font-medium text-neutral-400"
            >
              {STAGES[stageIndex].label}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Step dots */}
        <div className="mt-8 flex items-center gap-2">
          {STAGES.map((_, i) => (
            <motion.div
              key={i}
              animate={{
                width: i === stageIndex ? 24 : 8,
                backgroundColor:
                  i <= stageIndex ? "#a5b4fc" : "rgba(255,255,255,0.15)",
              }}
              transition={{ duration: 0.35 }}
              className="h-2 rounded-full"
            />
          ))}
        </div>

        {/* Indeterminate Scanner Progress bar */}
        <div className="mt-8 w-full">
          <div className="relative h-1 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="absolute bottom-0 left-0 top-0 w-1/2 rounded-full bg-gradient-to-r from-transparent via-indigo-400 to-transparent shadow-[0_0_10px_rgba(99,102,241,0.8)]"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            />
          </div>
          <div className="mt-3 flex justify-center text-[10px] font-medium uppercase tracking-widest text-neutral-500">
            <span className="animate-pulse">Processing Data...</span>
          </div>
        </div>
      </div>
    </div>
  );
}