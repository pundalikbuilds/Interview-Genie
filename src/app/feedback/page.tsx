"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Briefcase, Calendar, Clock, Home, ShieldCheck } from "lucide-react";
import Header from "@/components/Header";

const reportData = {
  candidateName: "Aaron Wang",
  role: "Developer Intern",
  date: "Mar 5, 2024",
  duration: "9 minutes and 25 seconds",
  overallScore: 77,
  overallFeedback:
    "Overall, Aaron has shown a decent grasp of Python and strong problem-solving abilities. His communication skills are generally clear, but there is room for improvement in professional conduct and depth of discussion. His technical knowledge and problem-solving approach are promising, but he should work on providing more detailed explanations and maintaining a professional demeanor throughout the interview process.",
  skills: [
    {
      id: 1,
      name: "Python",
      category: "Technical Skill",
      score: 75,
      feedback:
        "Aaron demonstrated a basic understanding of Python data structures by correctly identifying the mutability of lists and the immutability of tuples. He also correctly mentioned that tuples can be used as dictionary keys while lists cannot. However, his explanation lacked depth, as he did not elaborate on the concept of immutability or provide additional details about the characteristics and use cases of tuples and lists.",
    },
    {
      id: 2,
      name: "Communication",
      category: "Soft Skill",
      score: 70,
      feedback:
        "Aaron communicated his points clearly when discussing technical topics and was able to articulate his thought process during the problem-solving question. However, his attempt to deflect a question with humor ('Could you tell me and then give me a one hundred on the interview?') was inappropriate for an interview setting and detracted from his overall communication score. Additionally, he could have asked more clarifying questions or engaged in a more in-depth discussion on the technical topics.",
    },
    {
      id: 3,
      name: "Problem Solving",
      category: "Technical Skill",
      score: 85,
      feedback:
        "Aaron showed a good approach to problem-solving by outlining a method to test a hypothesis involving stock prices and CEO resignations. He mentioned collecting relevant data, conducting a t-test, and setting up a null and alternate hypothesis. His approach to ensuring the validity of the results, including checking the p-value, ensuring unbiased data selection, and properly interpreting the results, was solid.",
    },
  ],
};

function CircularScore({
  score,
  size = 100,
  strokeWidth = 8,
}: {
  score: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  return (
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
        {score}
      </motion.span>
    </div>
  );
}

export default function InterviewReport() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white">
      <Header />

      <main className="max-w-7xl mx-auto px-6 pt-28 pb-20">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">
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
          <div className="flex flex-col md:flex-row justify-between items-start mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-6">
                Interview Report for{" "}
                <span className="text-neutral-500 italic">
                  {reportData.candidateName}
                </span>
              </h2>
              <div className="space-y-3 text-neutral-600 text-sm">
                <div className="flex items-center gap-3">
                  <Briefcase className="w-4 h-4 text-neutral-400" />
                  <span>{reportData.role}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-neutral-400" />
                  <span>{reportData.date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-neutral-400" />
                  <span>{reportData.duration}</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-8 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-neutral-200 flex flex-col items-center min-w-[240px] mt-8 md:mt-0"
            >
              <h3 className="text-sm font-bold text-neutral-800 mb-6">
                Overall Hire Score
              </h3>
              <CircularScore score={reportData.overallScore} size={120} strokeWidth={10} />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="text-lg font-bold text-neutral-900 mb-3">
              Overall Feedback
            </h2>
            <p className="text-neutral-600 leading-relaxed text-sm">
              {reportData.overallFeedback}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reportData.skills.map((skill, index) => (
              <motion.div
                key={skill.id}
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
                    <h3 className="text-xl font-bold text-neutral-800">
                      {skill.name}
                    </h3>
                  </div>
                  <CircularScore score={skill.score} size={64} strokeWidth={6} />
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                    Feedback
                  </h4>
                  <p className="text-neutral-600 leading-relaxed text-sm">
                    {skill.feedback}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
