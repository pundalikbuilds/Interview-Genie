"use client";

import React from "react";
import { motion } from "framer-motion";
import { CircularScore } from "./CircularScore";

interface SkillsFeedbackProps {
  report: {
    overall_feedback: string;
    skills: {
      name: string;
      category: string;
      score: number;
      feedback: string;
    }[];
  };
}

export default function SkillsFeedback({ report }: SkillsFeedbackProps) {
  return (
    <>
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
    </>
  );
}