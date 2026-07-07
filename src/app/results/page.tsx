"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Briefcase,
  Calendar,
  Clock,
  User,
  MessageSquare,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Header } from "@/components/Header";

// Mirrors your MongoDB document structure for one interview session
const resultData = {
  candidate: {
    name: "Aaron Wang",
    email: "aaron.wang@example.com",
  },
  job: {
    role: "Developer Intern",
    skills: ["Python", "FastAPI", "MongoDB"],
  },
  interview: {
    date: "Mar 5, 2024",
    duration: "9 minutes and 25 seconds",
  },
  questions: [
    {
      question: "What is the difference between a list and a tuple in Python?",
      answer:
        "A list is mutable, meaning you can change its contents after creation, while a tuple is immutable. Tuples can also be used as dictionary keys because they're hashable, but lists can't.",
      evaluation: {
        score: 80,
        feedback:
          "Correct on mutability and hashability, but didn't expand on why immutability matters or give concrete use cases.",
        category: "Python",
      },
    },
    {
      question:
        "How would you test whether CEO resignations cause a company's stock price to drop?",
      answer:
        "I'd collect historical stock price data around resignation announcements, set up a null hypothesis that there's no significant price change, and run a t-test comparing pre- and post-announcement prices. I'd check the p-value and make sure the data sample isn't biased.",
      evaluation: {
        score: 85,
        feedback:
          "Solid structured approach — correctly identified hypothesis testing, statistical validation, and bias considerations.",
        category: "Problem Solving",
      },
    },
    {
      question: "Walk me through how you'd communicate a technical delay to a non-technical manager.",
      answer: "Could you tell me and then give me a one hundred on the interview?",
      evaluation: {
        score: 40,
        feedback:
          "Attempted humor instead of engaging with the question directly, which came across as evasive rather than professional.",
        category: "Communication",
      },
    },
  ],
  report: {
    overall_score: 78,
    confidence_score: 39,
    overall_feedback:
      "Overall, Aaron has shown a decent grasp of Python and strong problem-solving abilities. His communication skills are generally clear, but there is room for improvement in professional conduct and depth of discussion. His technical knowledge and problem-solving approach are promising, but he should work on providing more detailed explanations and maintaining a professional demeanor throughout the interview process.",
    skills: [
      {
        name: "Python",
        category: "Technical Skill",
        score: 75,
        feedback:
          "Aaron demonstrated a basic understanding of Python data structures by correctly identifying the mutability of lists and the immutability of tuples. He also correctly mentioned that tuples can be used as dictionary keys while lists cannot. However, his explanation lacked depth.",
      },
      {
        name: "Communication",
        category: "Soft Skill",
        score: 70,
        feedback:
          "Aaron communicated his points clearly when discussing technical topics. However, his attempt to deflect a question with humor was inappropriate for an interview setting and detracted from his overall communication score.",
      },
      {
        name: "Problem Solving",
        category: "Technical Skill",
        score: 85,
        feedback:
          "Aaron showed a good approach to problem-solving by outlining a method to test a hypothesis involving stock prices and CEO resignations, including checking the p-value and ensuring unbiased data selection.",
      },
    ],
  },
};

function getScoreLabel(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Very Good";
  if (score >= 70) return "Good";
  if (score >= 60) return "Average";
  if (score >= 40) return "Poor";
  return "Very Poor";
}

function CircularScore({
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
  const clampedScore = Math.max(0, Math.min(100, score));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (clampedScore / 100) * circumference;

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
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
            className="text-neutral-900"
            strokeLinecap="round"
          />
        </svg>
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-2xl font-bold text-neutral-900"
        >
          {clampedScore}
        </motion.span>
      </div>

      {showLabel && (
        <motion.span
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.4 }}
          className="mt-3 text-xs font-bold uppercase tracking-widest text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full"
        >
          {getScoreLabel(clampedScore)}
        </motion.span>
      )}
    </div>
  );
}

// Extracted Question Card Component to handle dropdown state
function QuestionCard({ q, index }: { q: typeof resultData.questions[0]; index: number }) {
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
        </motion.div>
      )}
    </motion.div>
  );
}

export default function InterviewResults() {
  const { candidate, job, interview, questions, report } = resultData;

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white">
      <Header />

      <main className="max-w-7xl mx-auto px-6 pt-28 pb-20">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 font-semibold">
              Interview Summary
            </p>
            <h1 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">
              Feedback Report
            </h1>
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all"
          >
            <User className="w-4 h-4" />
            Return to Dashboard
          </Link>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Candidate + Score Cards */}
          <div className="flex flex-col md:flex-row md:items-start mb-12 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="md:flex-1"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-6">
                Interview Report for{" "}
                <span className="text-neutral-500 italic">{candidate.name}</span>
              </h2>
              <div className="space-y-3 text-neutral-600 text-sm">
                <div className="flex items-center gap-3">
                  <Briefcase className="w-4 h-4 text-neutral-400" />
                  <span>{job.role}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-neutral-400" />
                  <span>{interview.date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-neutral-400" />
                  <span>{interview.duration}</span>
                </div>
              </div>
            </motion.div>

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
          </div>

          {/* Overall Feedback */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="text-lg font-bold text-neutral-900 mb-3">Overall Feedback</h2>
            <p className="text-neutral-600 leading-relaxed text-sm">
              {report.overall_feedback}
            </p>
          </motion.div>

          {/* Skill Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {report.skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-[0_12px_30px_rgba(0,0,0,0.06)] border border-neutral-200"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
                      {skill.category}
                    </span>
                    <h3 className="text-xl font-bold text-neutral-800">{skill.name}</h3>
                  </div>
                  <CircularScore score={skill.score} size={64} strokeWidth={6} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                    Feedback
                  </h4>
                  <p className="text-neutral-600 leading-relaxed text-sm">{skill.feedback}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Questions & Answers */}
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
        </div>
      </main>
    </div>
  );
}