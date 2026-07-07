"use client";

import React from "react";
import { motion } from "framer-motion";
import { Briefcase, Calendar, Clock } from "lucide-react";

interface CandidateProfileProps {
  candidate: { name: string; email: string };
  job: { role: string; skills: string[] };
  interview: { date: string; duration: string };
}

export default function CandidateProfile({ candidate, job, interview }: CandidateProfileProps) {
  return (
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
  );
}