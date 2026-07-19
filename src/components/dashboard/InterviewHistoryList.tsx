"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion"; // AnimatePresence: NEW import, enables exit animation on delete
import { User as UserIcon } from "lucide-react";
import { InterviewHistoryCard, type InterviewRecord } from "./InterviewHistoryCard";

interface InterviewHistoryListProps {
  history: InterviewRecord[];
  onDelete: (sessionId: string) => Promise<void>; // NEW prop
}

export function InterviewHistoryList({ history, onDelete }: InterviewHistoryListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mb-6"
      >
        <h2 className="mb-3 text-lg font-bold text-neutral-900">Interview History</h2>
        <p className="text-sm leading-relaxed text-neutral-600">
          A record of your past mock interviews, scores, and feedback.
        </p>
      </motion.div>

      <div className="flex flex-col gap-6">
        {/* AnimatePresence wrapper: NEW — lets cards animate out smoothly on delete */}
        <AnimatePresence>
          {history.map((interview, index) => (
            <InterviewHistoryCard
              key={interview.id}
              interview={interview}
              index={index}
              isExpanded={expandedId === interview.id}
              onToggle={() => setExpandedId(expandedId === interview.id ? null : interview.id)}
              onDelete={onDelete} // NEW: passed through to the card
            />
          ))}
        </AnimatePresence>
      </div>

      {history.length === 0 && (
        <div className="py-20 text-center">
          <UserIcon className="mx-auto mb-4 h-10 w-10 text-neutral-300" />
          <p className="text-sm text-neutral-500">
            No interviews yet. Start your first mock interview to see your history here.
          </p>
        </div>
      )}
    </>
  );
}