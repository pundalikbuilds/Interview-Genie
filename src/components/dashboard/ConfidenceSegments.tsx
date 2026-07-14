"use client";

import React from "react";
import { motion } from "framer-motion";

interface ConfidenceSegmentsProps {
  label?: string;
  level: string; // "low_confidence" | "medium_confidence" | "high_confidence"
  delay?: number;
}

function resolveLevel(level: string) {
  // Normalize: lowercase + strip spaces/underscores/hyphens so
  // "medium_confidence", "Medium Confidence", "medium-confidence" all match.
  const v = (level || "").toLowerCase().replace(/[\s_-]/g, "");

  if (v.startsWith("high")) {
    return { filled: 3, color: "bg-emerald-500", text: "High" };
  }
  if (v.startsWith("low")) {
    return { filled: 1, color: "bg-red-500", text: "Low" };
  }
  if (v.startsWith("medium")) {
    return { filled: 2, color: "bg-yellow-500", text: "Medium" };
  }

  return { filled: 0, color: "bg-neutral-300", text: "Unknown" };
}

export function ConfidenceSegments({
  label = "Confidence",
  level,
  delay = 0,
}: ConfidenceSegmentsProps) {
  const { filled, color, text } = resolveLevel(level);

  return (
    <div className="flex items-center gap-4">
      <span className="w-24 shrink-0 text-sm font-medium text-neutral-500">
        {label}
      </span>

      <div className="flex flex-1 min-w-[220px] gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-3 flex-1 overflow-hidden rounded-full bg-neutral-100"
          >
            {i < filled && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.5, ease: "easeOut", delay: delay + i * 0.12 }}
                className={`h-full rounded-full ${color}`}
              />
            )}
          </div>
        ))}
      </div>

      <span className="w-16 shrink-0 rounded-md border border-neutral-200 bg-white px-1.5 py-0.5 text-center text-xs font-semibold text-neutral-800">
        {text}
      </span>
    </div>
  );
}