"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Briefcase, Calendar, Clock, ChevronDown, ChevronUp, Trash2, Loader2, AlertCircle } from "lucide-react";
import { ScoreBar } from "./ScoreBar";
import { ConfidenceSegments } from "./ConfidenceSegments";

export interface InterviewRecord {
  id: string;
  sessionId: string;
  role: string;
  date: string;
  duration: string;
  overallScore: number;
  confidenceLabel: string;
  overallFeedback: string;
}

interface InterviewHistoryCardProps {
  interview: InterviewRecord;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  onDelete: (sessionId: string) => Promise<void>;
}

export function InterviewHistoryCard({
  interview,
  index,
  isExpanded,
  onToggle,
  onDelete,
}: InterviewHistoryCardProps) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteClick = async () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    setDeleting(true);
    setError(null);
    try {
      await onDelete(interview.sessionId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete interview.");
      setDeleting(false);
      setConfirming(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
      className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-[0_12px_30px_rgba(0,0,0,0.06)]"
    >
      <div className="flex flex-col">
        {/* Role Title Row */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Briefcase className="h-5 w-5 text-neutral-400" />
            <Link href={`/feedback/${interview.sessionId}`}>
              <h3 className="text-xl font-bold text-neutral-800 hover:text-neutral-500 hover:underline transition-colors cursor-pointer">
                {interview.role}
              </h3>
            </Link>
          </div>

          {/* ── UPDATED: Polished Delete Button UI ── */}
          <button
            onClick={handleDeleteClick}
            disabled={deleting}
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
              confirming
                ? "bg-red-500 text-white shadow-sm ring-4 ring-red-500/20 hover:bg-red-600"
                : "text-neutral-400 hover:bg-red-50 hover:text-red-600"
            }`}
          >
            {deleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            <span>
              {deleting ? "Deleting..." : confirming ? "Click to confirm" : "Delete"}
            </span>
          </button>
          {/* ── END UPDATED ── */}
        </div>

        {/* Date and Overall Score Row */}
        <div className="mb-3 flex flex-col gap-4 md:flex-row md:items-center">
          <div className="flex w-full items-center gap-3 text-sm text-neutral-600 md:w-[280px] md:shrink-0">
            <Calendar className="h-4 w-4 text-neutral-400" />
            <span>{interview.date}</span>
          </div>
          <div className="w-full flex-1">
            <ScoreBar
              label="Overall"
              score={interview.overallScore}
              delay={0.2 + index * 0.1}
            />
          </div>
        </div>

        {/* Duration and Confidence Row */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
          <div className="flex w-full items-center gap-3 text-sm text-neutral-600 md:w-[280px] md:shrink-0">
            <Clock className="h-4 w-4 text-neutral-400" />
            <span>{interview.duration}</span>
          </div>
          <div className="w-full flex-1">
            <ConfidenceSegments
              label="Confidence"
              level={interview.confidenceLabel}
              delay={0.3 + index * 0.1}
            />
          </div>
        </div>

        {/* ── UPDATED: Error message & Cancel hint UI ── */}
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-md bg-red-50 p-2.5 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {confirming && !deleting && !error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: "auto" }} 
            className="mb-4 flex items-center gap-2 text-sm text-neutral-500"
          >
            <p>
              Are you sure? This cannot be undone.{" "}
              <button
                onClick={() => setConfirming(false)}
                className="font-semibold text-neutral-700 underline hover:text-neutral-900 transition-colors"
              >
                Cancel
              </button>
            </p>
          </motion.div>
        )}
        {/* ── END UPDATED ── */}

        {/* Action Button Row */}
        <div>
          <button
            onClick={onToggle}
            className="flex items-center gap-2 text-sm font-medium text-neutral-900 transition-colors hover:text-neutral-600"
          >
            {isExpanded ? (
              <>
                Hide Feedback <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                View Feedback <ChevronDown className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
          className="mt-6 border-t border-neutral-200 pt-6"
        >
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Overall Feedback
          </h4>
          <p className="text-sm leading-relaxed text-neutral-600">
            {interview.overallFeedback}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}