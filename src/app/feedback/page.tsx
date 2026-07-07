"use client";

import React from "react";
import Link from "next/link";
import { Home } from "lucide-react";
import { Header } from "@/components/Header";

// Import your newly created components
import CandidateProfile from "@/components/feedback/CandidateProfile";
import ScoreMetrics from "@/components/feedback/ScoreMetrics";
import SkillsFeedback from "@/components/feedback/SkillsFeedback";
import QnASection from "@/components/feedback/QnASection";

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

export default function InterviewResults() {
  const { candidate, job, interview, questions, report } = resultData;

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white">
      <Header />

      <main className="max-w-7xl mx-auto px-6 pt-28 pb-20">
        {/* Page Top Header (Remains in main page file) */}
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
            href="/"
            className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all"
          >
            <Home className="w-4 h-4" />
            Return to Home
          </Link>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Assembled Component 1 & 2 */}
          <div className="flex flex-col md:flex-row md:items-start mb-12 gap-6">
            <CandidateProfile candidate={candidate} job={job} interview={interview} />
            <ScoreMetrics report={report} />
          </div>

          {/* Assembled Component 3 */}
          <SkillsFeedback report={report} />

          {/* Assembled Component 4 */}
          <QnASection questions={questions} />
        </div>
      </main>
    </div>
  );
}