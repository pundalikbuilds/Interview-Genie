"use client";

import React, { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { UserProfileCard } from "@/components/dashboard/UserProfileCard";
import { InterviewHistoryList } from "@/components/dashboard/InterviewHistoryList";
import { getDashboard, deleteDashboardInterview } from "@/services/dashboard"; // deleteDashboardInterview: NEW import

interface UserProfile {
  id: string;
  name: string;
  email: string;
  memberSince: string;
  totalInterviews: number;
}

export default function UserDashboard() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Store complete interview documents from backend
  const [interviewHistory, setInterviewHistory] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const data = await getDashboard();
        console.log("Dashboard data:", data);
        console.log("Interview history:", data.interviewHistory);
        setUserProfile(data.userProfile);

        setInterviewHistory(data.interviewHistory);
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  /*
    Convert backend MongoDB document
    into the format expected by
    InterviewHistoryList
  */
  const formattedHistory = interviewHistory.map((interview) => ({
    id: interview._id,

    sessionId: interview.session_id ?? "Unknown",

    role: interview.role ?? "Unknown",

    date: interview.date ?? "",

    duration: interview.duration ?? "",

    overallScore: interview.overall_score ?? 0,

    confidenceLabel: interview.confidence_label ?? "unknown",

    overallFeedback: interview.overall_feedback ?? "",
  }));


  const handleDelete = async (sessionId: string) => {
    const response = await deleteDashboardInterview(sessionId);

    if (!response.success) {
      throw new Error(response.message);
    }

    setInterviewHistory((prev) =>
      prev.filter((interview) => interview.session_id !== sessionId),
    );

    setUserProfile((prev) =>
      prev
        ? {
            ...prev,
            totalInterviews: Math.max(0, prev.totalInterviews - 1),
          }
        : prev,
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading dashboard...
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Unable to load dashboard.
      </div>
    );
  }

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
            <UserProfileCard userProfile={userProfile} />
          </div>

          {/* onDelete: NEW prop passed down to enable per-card delete */}
          <InterviewHistoryList history={formattedHistory} onDelete={handleDelete} />
        </div>
      </main>
    </div>
  );
}