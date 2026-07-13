"use client";

import React from "react";
import { motion } from "framer-motion";
import { Smile, Meh, Frown } from "lucide-react";

export type ConfidenceLevel = "high" | "medium" | "low";

interface ConfidenceConfigEntry {
  label: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  ring: string;
}

const CONFIDENCE_CONFIG: { [key in ConfidenceLevel]: ConfidenceConfigEntry } = {
  high: {
    label: "High Confidence",
    icon: Smile,
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    ring: "border-emerald-200",
  },
  medium: {
    label: "Medium Confidence",
    icon: Meh,
    color: "text-amber-700",
    bg: "bg-amber-50",
    ring: "border-amber-200",
  },
  low: {
    label: "Low Confidence",
    icon: Frown,
    color: "text-red-700",
    bg: "bg-red-50",
    ring: "border-red-200",
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
  size = 120,
}: {
  level: string;
  size?: number;
}) {
  const normalized = normalizeConfidenceLevel(level);
  const config = CONFIDENCE_CONFIG[normalized];
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        className={`flex items-center justify-center rounded-full border-2 ${config.bg} ${config.ring}`}
        style={{ width: size, height: size }}
      >
        <Icon
          className={config.color}
          style={{ width: size * 0.42, height: size * 0.42 }}
          strokeWidth={1.75}
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