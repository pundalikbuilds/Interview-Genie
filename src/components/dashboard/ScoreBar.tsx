"use client";

import React from "react";
import { motion } from "framer-motion";

interface ScoreBarProps {
  label: string;
  score: number;
  delay?: number;
}

export function ScoreBar({ label, score, delay = 0 }: ScoreBarProps) {
  const clampedScore = Math.max(0, Math.min(10, score));

  return (
    <div className="flex items-center gap-4">
      <span className="w-24 shrink-0 text-sm font-medium text-neutral-500">
        {label}
      </span>
      <div className="relative h-3 flex-1 min-w-[220px] overflow-hidden rounded-full bg-neutral-100">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clampedScore * 10}%` }}
          transition={{ duration: 1, ease: "easeOut", delay }}
          className="h-full rounded-full bg-neutral-900"
        />
      </div>
      <span className="w-10 shrink-0 rounded-md border border-neutral-200 bg-white px-1.5 py-0.5 text-center text-sm font-semibold text-neutral-800">
        {clampedScore}
      </span>
    </div>
  );
}