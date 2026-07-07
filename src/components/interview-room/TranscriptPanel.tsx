"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, MoreHorizontal } from "lucide-react";

export type TranscriptEntry = {
  id: string;
  role: "ai" | "user";
  text: string;
};

interface TranscriptPanelProps {
  transcript: TranscriptEntry[];
  transcriptEndRef: React.RefObject<HTMLDivElement | null>;
  statusIcon: React.ReactNode;
  statusText: string;
}

export function TranscriptPanel({
  transcript,
  transcriptEndRef,
  statusIcon,
  statusText,
}: TranscriptPanelProps) {
  return (
    <motion.div
      initial={{ x: 400 }}
      animate={{ x: 0 }}
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
          {statusIcon}
          {statusText}
        </div>
      </div>
    </motion.div>
  );
}