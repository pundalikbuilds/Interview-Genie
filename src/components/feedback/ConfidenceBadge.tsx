"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export type ConfidenceLevel = "high" | "medium" | "low";

interface ConfidenceConfigEntry {
  label: string;
  color: string;
  bg: string;
  src: string;
}

// NOTE: place these three files at:
//   Interview-Genie/public/icons/confidence/high-confidence.svg
//   Interview-Genie/public/icons/confidence/medium-confidence.svg
//   Interview-Genie/public/icons/confidence/low-confidence.svg
const CONFIDENCE_CONFIG: { [key in ConfidenceLevel]: ConfidenceConfigEntry } = {
  high: {
    label: "High Confidence",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    src: "/icons/confidence/high-confidence.svg",
  },
  medium: {
    label: "Medium Confidence",
    color: "text-amber-700",
    bg: "bg-amber-50",
    src: "/icons/confidence/medium-confidence.svg",
  },
  low: {
    label: "Low Confidence",
    color: "text-red-700",
    bg: "bg-red-50",
    src: "/icons/confidence/low-confidence.svg",
  },
};

export function normalizeConfidenceLevel(value: string): ConfidenceLevel {
  const v = value.trim().toLowerCase();
  if (v.startsWith("high")) return "high";
  if (v.startsWith("low")) return "low";
  return "medium";
}

export function ConfidenceBadge({
  level,
  size = 140,
}: {
  level: string;
  size?: number;
}) {
  const normalized = normalizeConfidenceLevel(level);
  const config = CONFIDENCE_CONFIG[normalized];

  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        // Each source SVG has a different intrinsic viewBox (428x582, 412x602,
        // 396x587) with a near-white baked-in background rect. Fixing the
        // wrapper to a square and using object-contain keeps all three
        // visually consistent regardless of their native aspect ratio.
        className="relative flex items-center justify-center shrink-0 overflow-hidden rounded-2xl"
        style={{ width: size, height: size }}
      >
        <Image
          src={config.src}
          alt={config.label}
          fill
          sizes={`${size}px`}
          style={{ objectFit: "contain" }}
          priority
        />
      </motion.div>

      <motion.span
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className={`mt-3 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${config.bg} ${config.color}`}
      >
        {config.label}
      </motion.span>
    </div>
  );
}