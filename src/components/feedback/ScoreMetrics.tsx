"use client";

import React from "react";
import { motion } from "framer-motion";
import { CircularScore } from "./CircularScore";

interface ScoreMetricsProps {
  report: {
    overall_score: number;
    confidence_score: number;
  };
}

export default function ScoreMetrics({ report }: ScoreMetricsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-6 mt-8 md:mt-0 md:ml-auto">
      {/* Overall Score Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-neutral-100 flex flex-col items-center min-w-[220px]"
      >
        <h3 className="text-sm font-bold text-neutral-800 mb-6">Overall Score</h3>
        <CircularScore score={report.overall_score} size={120} strokeWidth={10} showLabel />
      </motion.div>

      {/* Confidence Score Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-white p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-neutral-100 flex flex-col items-center min-w-[220px]"
      >
        <h3 className="text-sm font-bold text-neutral-800 mb-6">Confidence Score</h3>
        <CircularScore score={report.confidence_score} size={120} strokeWidth={10} showLabel />
      </motion.div>
    </div>
  );
}