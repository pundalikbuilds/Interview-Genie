"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { CircularScore } from "./CircularScore";

interface Question {
  question: string;
  answer: string;
  evaluation: {
    score: number;
    feedback: string;
    category: string;
    correct_points: string[];
    missing_points: string[];
  };

  };


function QuestionCard({ q, index }: { q: Question; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
      className="bg-white p-8 rounded-2xl shadow-[0_12px_30px_rgba(0,0,0,0.06)] border border-neutral-200"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
            Question {index + 1} · {q.evaluation.category}
          </span>
          <h3 className="text-base font-bold text-neutral-800 leading-relaxed">
            {q.question}
          </h3>
        </div>
        <CircularScore score={q.evaluation.score} size={56} strokeWidth={5} />
      </div>

      {/* Action Button */}
      <div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm font-medium text-neutral-900 transition-colors hover:text-neutral-600"
        >
          {isExpanded ? (
            <>
              Hide Details <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              View Details <ChevronDown className="h-4 w-4" />
            </>
          )}
        </button>
      </div>

      {/* Expandable Section */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
          className="mt-6 border-t border-neutral-200 pt-6"
        >
          <div className="mb-4 rounded-xl bg-neutral-50 p-4 border border-neutral-100">
            <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              Candidate's Answer
            </h4>
            <p className="text-neutral-700 leading-relaxed text-sm">{q.answer}</p>
          </div>

          <div className="rounded-xl bg-neutral-50 p-4 border border-neutral-100">
            <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              Evaluation Feedback
            </h4>
            <p className="text-neutral-700 leading-relaxed text-sm">
              {q.evaluation.feedback}
            </p>
          </div>
          {/* Correct Points */}
          <div className="mt-4 rounded-xl bg-green-50 p-4 border border-green-100">
            <h4 className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-2">
              Correct Points
            </h4>

            {q.evaluation.correct_points &&
            q.evaluation.correct_points.length > 0 ? (
              <ul className="list-disc list-inside space-y-1 text-sm text-neutral-700">
                {q.evaluation.correct_points.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-neutral-500 italic">
                No correct points were identified.
              </p>
            )}
          </div>

          {/* Missing Points */}
          <div className="mt-4 rounded-xl bg-red-50 p-4 border border-red-100">
            <h4 className="text-xs font-semibold text-red-700 uppercase tracking-wider mb-2">
              Missing Points
            </h4>

            {q.evaluation.missing_points &&
            q.evaluation.missing_points.length > 0 ? (
              <ul className="list-disc list-inside space-y-1 text-sm text-neutral-700">
                {q.evaluation.missing_points.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-neutral-500 italic">
                No missing points were identified.
              </p>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function QnASection({ questions }: { questions: Question[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare className="w-5 h-5 text-neutral-400" />
        <h2 className="text-lg font-bold text-neutral-900">Questions & Answers</h2>
      </div>

      <div className="flex flex-col gap-6">
        {questions.map((q, index) => (
          <QuestionCard key={index} q={q} index={index} />
        ))}
      </div>
    </motion.div>
  );
}