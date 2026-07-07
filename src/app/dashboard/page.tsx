"use client";

import React from "react";
import { Header } from "@/components/Header";
import { UserProfileCard } from "@/components/dashboard/UserProfileCard";
import { InterviewHistoryList } from "@/components/dashboard/InterviewHistoryList";

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

// Kept this from your original code in case you need to display it later
function averageScore(history: typeof interviewHistory) {
  if (history.length === 0) return 0;
  const total = history.reduce((sum, interview) => sum + interview.overallScore, 0);
  return Math.round(total / history.length);
}

export default function UserDashboard() {
  const avgScore = averageScore(interviewHistory);

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white">
      <Header />

      <main className="mx-auto max-w-7xl px-6 pb-20 pt-28">
        {/* Page Top Header */}
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
            {/* User Profile Component */}
            <UserProfileCard userProfile={userProfile} />
          </div>

          {/* Interview History List Component */}
          <InterviewHistoryList history={interviewHistory} />
        </div>
      </main>
    </div>
  );
}