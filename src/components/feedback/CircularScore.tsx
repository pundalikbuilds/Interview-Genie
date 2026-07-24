"use client";

import React from "react";
import { motion } from "framer-motion";

export function getScoreLabel(score: number): string {
  if (score >= 9) return "Excellent";
  if (score >= 8) return "Very Good";
  if (score >= 7) return "Good";
  if (score >= 6) return "Average";
  if (score >= 4) return "Poor";
  return "Very Poor";
}

interface ScoreColorConfig {
  stroke: string;
  text: string;
  badgeBg: string;
  badgeText: string;
}

export function getScoreColor(score: number): ScoreColorConfig {
  if (score >= 9) {
    return { stroke: "#16a34a", text: "#16a34a", badgeBg: "bg-green-50", badgeText: "text-green-700" };
  } else if (score >= 8) {
    return { stroke: "#4ade80", text: "#4ade80", badgeBg: "bg-green-50", badgeText: "text-green-600" };
  } else if (score >= 7) {
    return { stroke: "#eab308", text: "#eab308", badgeBg: "bg-yellow-50", badgeText: "text-yellow-700" };
  } else if (score >= 6) {
    return { stroke: "#fde047", text: "#fde047", badgeBg: "bg-yellow-50", badgeText: "text-yellow-600" };
  } else if (score >= 4) {
    return { stroke: "#dc2626", text: "#dc2626", badgeBg: "bg-red-50", badgeText: "text-red-700" };
  } else {
    return { stroke: "#7f1d1d", text: "#7f1d1d", badgeBg: "bg-red-50", badgeText: "text-red-900" };
  }
}

export function CircularScore({
  score,
  size = 100,
  strokeWidth = 8,
  showLabel = false,
}: {
  score: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
}) {
  // Keep the precise float for geometry, color mapping, and label thresholds —
  // only round for the number shown on screen.
  const clampedScore = Math.max(0, Math.min(10, score));
  const displayScore = Number.isInteger(clampedScore)
    ? clampedScore
    : clampedScore.toFixed(1);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (clampedScore / 10) * circumference;
  const colors = getScoreColor(clampedScore);

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <svg className="absolute transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-slate-100"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.stroke}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
            strokeLinecap="round"
          />
        </svg>
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-2xl font-bold"
          style={{ color: colors.text }}
        >
          {displayScore}
        </motion.span>
      </div>

      {showLabel && (
        <motion.span
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.4 }}
          className={`mt-3 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${colors.badgeBg} ${colors.badgeText}`}
        >
          {getScoreLabel(clampedScore)}
        </motion.span>
      )}
    </div>
  );
}