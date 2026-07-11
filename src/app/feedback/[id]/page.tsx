"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Home } from "lucide-react";

import { Header } from "@/components/Header";
import CandidateProfile from "@/components/feedback/CandidateProfile";
import ScoreMetrics from "@/components/feedback/ScoreMetrics";
import SkillsFeedback from "@/components/feedback/SkillsFeedback";
import QnASection from "@/components/feedback/QnASection";

import { getInterviewReport } from "@/services/report";

export default function InterviewResults() {
  const params = useParams();

  const sessionId = params.id as string;
  console.log("Session ID:", sessionId);

  const [resultData, setResultData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId) return;

    const loadReport = async () => {
      try {
        const report = await getInterviewReport(sessionId);

        const formattedReport = {
          candidate: {
            name: report.candidateName,
            email: report.email ?? "",
          },

          job: {
            role: report.role,
            skills: report.skills ?? [],
          },

          interview: {
            date: report.date,
            duration: report.duration,
          },

          questions: report.evaluatedAnswers.map((qa: any) => ({
            question: qa.question,
            answer: qa.answer,
            evaluation: {
              score: qa.score,
              feedback: qa.feedback,
              category: qa.category,
            },
          })),

          report: {
            overall_score: report.overallScore,
            confidence_score: report.confidenceValue,
            overall_feedback: report.overallFeedback,
            skills: report.skillsFeedback,
          },
        };

        setResultData(formattedReport);
      } catch (err) {
        console.error(err);
        setError("Unable to load interview report.");
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading interview report...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {error}
      </div>
    );
  }

  if (!resultData) {
    return null;
  }

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
            href="/"
            className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all"
          >
            <Home className="w-4 h-4" />
            Return to Home
          </Link>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-start mb-12 gap-6">
            <CandidateProfile
              candidate={candidate}
              job={job}
              interview={interview}
            />

            <ScoreMetrics report={report} />
          </div>

          <SkillsFeedback report={report} />

          <QnASection questions={questions} />
        </div>
      </main>
    </div>
  );
}