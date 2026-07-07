"use client";

import React from "react";
import { motion } from "framer-motion";
import { Bot } from "lucide-react";

interface AiAvatarProps {
  isMain: boolean;
  isAiSpeaking: boolean;
}

export function AiAvatar({ isMain, isAiSpeaking }: AiAvatarProps) {
  return (
    <div
      className={`relative flex h-full w-full flex-col items-center justify-center transition-transform duration-500 ${
        isMain ? "scale-100" : "scale-75"
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
          transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
          className="absolute inset-3 rounded-full border border-dashed border-neutral-600/70"
        />
        <motion.div
          animate={{ scale: isAiSpeaking ? [1, 1.05, 1] : 1 }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className={`relative z-10 flex h-32 w-32 flex-col items-center justify-center rounded-full border transition-colors duration-500 ${
            isAiSpeaking
              ? "border-neutral-400 bg-neutral-700/40 shadow-[0_0_40px_rgba(255,255,255,0.08)]"
              : "border-neutral-700 bg-neutral-800/80"
          }`}
        >
          <Bot
            className={`mb-2 h-11 w-11 ${
              isAiSpeaking ? "text-white" : "text-neutral-400"
            }`}
          />
          <div className="flex h-4 items-end gap-1">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                animate={{
                  height: isAiSpeaking ? ["25%", "100%", "25%"] : "25%",
                }}
                transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.1 }}
                className={`w-1 rounded-full ${
                  isAiSpeaking ? "bg-white" : "bg-neutral-600"
                }`}
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
}