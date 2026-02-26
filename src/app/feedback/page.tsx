'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, RefreshCw, Home, Star, TrendingUp, MessageSquare } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Simple scoring heuristic based on answer length
function scoreAnswer(answer: string): number {
  const words = answer.trim().split(/\s+/).filter(Boolean).length;
  if (words === 0) return 10;
  if (words < 10) return 30 + Math.floor(words * 2);
  if (words < 30) return 55 + Math.floor((words - 10) * 1.5);
  if (words < 80) return 85 + Math.floor((words - 30) * 0.2);
  return 95;
}

const TIPS: Record<string, string[]> = {
  easy: [
    'Review core concepts of your chosen role.',
    'Practice structuring answers using the STAR method.',
    'Keep answers concise — aim for 1-2 minutes per response.',
  ],
  medium: [
    'Use the STAR (Situation, Task, Action, Result) framework.',
    'Quantify your achievements wherever possible.',
    'Show self-awareness when discussing challenges.',
  ],
  hard: [
    'Go deeper on technical trade-offs in your answers.',
    'Back up architectural decisions with real-world examples.',
    'Demonstrate leadership and cross-functional collaboration.',
  ],
};

function FeedbackContent() {
  const searchParams = useSearchParams();

  const role = searchParams.get('role') ?? 'Software Engineer';
  const difficulty = searchParams.get('difficulty') ?? 'medium';
  const answersRaw = searchParams.get('answers');
  const questionsRaw = searchParams.get('questions');

  const answers: string[] = answersRaw ? JSON.parse(answersRaw) : [];
  const questions: string[] = questionsRaw ? JSON.parse(questionsRaw) : [];

  const scores = answers.map(scoreAnswer);
  const overallScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  const grade =
    overallScore >= 85 ? { label: 'Excellent', color: 'text-green-600', bg: 'bg-green-50 border-green-200' } :
    overallScore >= 70 ? { label: 'Good', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' } :
    overallScore >= 50 ? { label: 'Fair', color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200' } :
    { label: 'Needs Work', color: 'text-red-600', bg: 'bg-red-50 border-red-200' };

  const tips = TIPS[difficulty] ?? TIPS.medium;

  const setupParams = new URLSearchParams({ role, difficulty });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-10 space-y-6">
        {/* Overall score card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="flex items-center justify-center mb-3">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Interview Complete!</h1>
          <p className="text-gray-500 text-sm mb-6">
            {role} · {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} difficulty
          </p>

          {/* Score ring */}
          <div className={`inline-flex flex-col items-center border-2 rounded-full w-32 h-32 justify-center mx-auto mb-4 ${grade.bg}`}>
            <span className={`text-4xl font-bold ${grade.color}`}>{overallScore}</span>
            <span className="text-xs text-gray-500 font-medium">/ 100</span>
          </div>
          <p className={`text-lg font-semibold ${grade.color}`}>{grade.label}</p>

          {/* Stars */}
          <div className="flex justify-center gap-1 mt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${i < Math.round(overallScore / 20) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
        </div>

        {/* Per-question breakdown */}
        {questions.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              Question Breakdown
            </h2>
            {questions.map((question, index) => {
              const score = scores[index] ?? 0;
              const answer = answers[index] ?? '';
              const barColor =
                score >= 85 ? 'bg-green-500' :
                score >= 70 ? 'bg-blue-500' :
                score >= 50 ? 'bg-yellow-500' :
                'bg-red-500';

              return (
                <div key={index} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <p className="text-sm font-medium text-gray-900 leading-snug flex-1">
                      <span className="text-blue-600 font-semibold">Q{index + 1}.</span> {question}
                    </p>
                    <span className="text-lg font-bold text-gray-800 shrink-0">{score}%</span>
                  </div>

                  {/* Score bar */}
                  <div className="h-1.5 bg-gray-100 rounded-full mb-3">
                    <div
                      className={`h-full rounded-full transition-all ${barColor}`}
                      style={{ width: `${score}%` }}
                    />
                  </div>

                  {/* Answer preview */}
                  <p className="text-sm text-gray-500 italic line-clamp-2">
                    {answer.trim() ? `"${answer.trim()}"` : '— No answer provided —'}
                  </p>

                  {/* AI feedback placeholder */}
                  <div className="mt-3 text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2">
                    💡 AI feedback: {answer.trim().length < 20
                      ? 'Try to give more detail in your answer.'
                      : 'Good level of detail. Consider adding specific examples or metrics.'}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tips section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-2xl p-6">
          <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Tips to Improve
          </h2>
          <ul className="space-y-2">
            {tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-blue-500 mt-0.5">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={`/interview-setup?${setupParams.toString()}`}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            <RefreshCw className="h-4 w-4" />
            Practice Again
          </Link>
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function FeedbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading feedback...</p>
        </div>
      </div>
    }>
      <FeedbackContent />
    </Suspense>
  );
}
