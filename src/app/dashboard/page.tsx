"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Briefcase,
  Calendar,
  Clock,
  Mail,
  User as UserIcon,
  ChevronDown,
  ChevronUp,
  FileText,
} from "lucide-react";

import { Header } from "@/components/Header";

const userProfile = {
  name: "Aaron Wang",
  email: "aaron.wang@example.com",
  memberSince: "Feb 2024",
  totalInterviews: 3,
};

const interviewHistory = [
  {
    id: "int_1",
    role: "Developer Intern",
    date: "Mar 5, 2024",
    duration: "9 minutes and 25 seconds",
    overallScore: 60,
    confidenceScore: 88,
    overallFeedback:
      "Overall, Aaron has shown a decent grasp of Python and strong problem-solving abilities. His communication skills are generally clear, but there is room for improvement in professional conduct and depth of discussion. His technical knowledge and problem-solving approach are promising, but he should work on providing more detailed explanations and maintaining a professional demeanor throughout the interview process.",
  },
  {
    id: "int_2",
    role: "Frontend Engineer",
    date: "Feb 18, 2024",
    duration: "11 minutes and 2 seconds",
    overallScore: 82,
    confidenceScore: 88,
    overallFeedback:
      "Aaron displayed strong command of React fundamentals and was able to reason clearly through component design trade-offs. His explanations of state management were well structured, though he occasionally rushed through edge cases. Overall a confident, well-communicated performance with minor room for deeper technical elaboration.",
  },
  {
    id: "int_3",
    role: "Data Analyst",
    date: "Jan 30, 2024",
    duration: "8 minutes and 47 seconds",
    overallScore: 64,
    confidenceScore: 59,
    overallFeedback:
      "Aaron's statistical reasoning was reasonable but lacked precision when discussing hypothesis testing. He struggled to clearly articulate the difference between correlation and causation in his example. Communication was polite and professional throughout, but the technical depth of his answers needs improvement before the next round.",
  },
];

function ScoreBar({
  label,
  score,
  delay = 0,
}: {
  label: string;
  score: number;
  delay?: number;
}) {
  const clampedScore = Math.max(0, Math.min(100, score));

  return (
    <div className="flex items-center gap-4">
      <span className="w-24 shrink-0 text-sm font-medium text-neutral-500">
        {label}
      </span>
      <div className="relative h-3 flex-1 min-w-[220px] overflow-hidden rounded-full bg-neutral-100">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clampedScore}%` }}
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

function averageScore(history: typeof interviewHistory) {
  if (history.length === 0) return 0;
  const total = history.reduce((sum, interview) => sum + interview.overallScore, 0);
  return Math.round(total / history.length);
}

export default function UserDashboard() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const avgScore = averageScore(interviewHistory);

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white">
      <Header />

      <main className="mx-auto max-w-7xl px-6 pb-20 pt-28">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">
              Your Space
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              Dashboard
            </h1>
          </div>
        </div>

        <div className="mx-auto max-w-6xl">
          <div className="mb-12 flex flex-col items-start justify-between gap-8 md:flex-row">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-1"
            >
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-900 text-xl font-bold text-white">
                  {userProfile.name
                    .split(" ")
                    .map((name) => name[0])
                    .join("")}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900 md:text-3xl">
                    {userProfile.name}
                  </h2>
                </div>
              </div>
              <div className="space-y-3 text-sm text-neutral-600">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-neutral-400" />
                  <span>{userProfile.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-neutral-400" />
                  <span>{userProfile.totalInterviews} interviews completed</span>
                </div>
              </div>

              <Link
                href="/interview-setup"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-neutral-800"
              >
                Start New Interview
              </Link>
            </motion.div>
          </div>

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
            {interviewHistory.map((interview, index) => {
              const isExpanded = expandedId === interview.id;

              return (
                <motion.div
                  key={interview.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-[0_12px_30px_rgba(0,0,0,0.06)]"
                >
                  <div className="flex flex-col">
                    {/* Role Title Row - Now a Clickable Link to Results */}
                    <div className="mb-4 flex items-center gap-3">
                      <Briefcase className="h-4 w-4 text-neutral-400" />
                      <Link href="/results">
                        <h3 className="text-xl font-bold text-neutral-800 hover:text-neutral-500 hover:underline transition-colors cursor-pointer">
                          {interview.role}
                        </h3>
                      </Link>
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

                    {/* Duration and Confidence Score Row */}
                    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
                      <div className="flex w-full items-center gap-3 text-sm text-neutral-600 md:w-[280px] md:shrink-0">
                        <Clock className="h-4 w-4 text-neutral-400" />
                        <span>{interview.duration}</span>
                      </div>
                      <div className="w-full flex-1">
                        <ScoreBar
                          label="Confidence"
                          score={interview.confidenceScore}
                          delay={0.3 + index * 0.1}
                        />
                      </div>
                    </div>

                    {/* Action Button Row */}
                    <div>
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : interview.id)}
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
            })}
          </div>

          {interviewHistory.length === 0 && (
            <div className="py-20 text-center">
              <UserIcon className="mx-auto mb-4 h-10 w-10 text-neutral-300" />
              <p className="text-sm text-neutral-500">
                No interviews yet. Start your first mock interview to see your history here.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}