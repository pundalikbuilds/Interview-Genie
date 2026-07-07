"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, FileText } from "lucide-react";

interface UserProfileProps {
  userProfile: {
    name: string;
    email: string;
    memberSince: string;
    totalInterviews: number;
  };
}

export function UserProfileCard({ userProfile }: UserProfileProps) {
  return (
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
  );
}