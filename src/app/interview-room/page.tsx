'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronRight, Clock, Send, StopCircle } from 'lucide-react';
import Header from '@/components/Header';
import CameraPreview from '@/components/interview/CameraPreview';

// Sample questions per difficulty (replace with real AI calls)
const SAMPLE_QUESTIONS: Record<string, string[]> = {
  easy: [
    'Tell me about yourself and your background.',
    'What are your greatest strengths?',
    'Why are you interested in this role?',
    'Describe a project you are proud of.',
    'Where do you see yourself in five years?',
  ],
  medium: [
    'Describe a challenging problem you solved and the approach you took.',
    'How do you prioritise tasks when handling multiple deadlines?',
    'Give an example of when you worked in a team under pressure.',
    'How do you stay up to date with industry trends?',
    'Describe a situation where you had to learn a new skill quickly.',
  ],
  hard: [
    'Deep dive into the architecture of a system you designed from scratch.',
    'How would you debug a production issue with no logs available?',
    'Describe a time you disagreed with your manager — how did you handle it?',
    'What trade-offs did you make in your most complex technical decision?',
    'How would you scale a service to 10× its current traffic?',
  ],
};

function InterviewRoomContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const role = searchParams.get('role') ?? 'Software Engineer';
  const difficulty = (searchParams.get('difficulty') ?? 'medium') as 'easy' | 'medium' | 'hard';

  const questions = SAMPLE_QUESTIONS[difficulty];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(''));
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes per question
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Format seconds as mm:ss
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  // Countdown timer
  useEffect(() => {
    if (!isTimerRunning || timeLeft <= 0) return;
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [isTimerRunning, timeLeft]);

  const handleNext = useCallback(() => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((q) => q + 1);
      setTimeLeft(120);
    } else {
      // Go to feedback with answers
      const params = new URLSearchParams({
        role,
        difficulty,
        answers: JSON.stringify(answers),
        questions: JSON.stringify(questions),
      });
      router.push(`/feedback?${params.toString()}`);
    }
  }, [currentQuestion, questions, answers, role, difficulty, router]);

  // Auto-advance when timer hits 0
  useEffect(() => {
    if (timeLeft === 0) handleNext();
  }, [timeLeft, handleNext]);

  const updateAnswer = (value: string) => {
    setAnswers((prev) => {
      const copy = [...prev];
      copy[currentQuestion] = value;
      return copy;
    });
  };

  const timerColor =
    timeLeft > 60 ? 'text-green-600' : timeLeft > 30 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm">
          <span className="text-gray-500">
            <span className="font-medium text-gray-800">{role}</span> · {difficulty.toUpperCase()}
          </span>
          <span className="text-gray-500">
            Question{' '}
            <span className="font-semibold text-gray-800">
              {currentQuestion + 1}/{questions.length}
            </span>
          </span>
          <div className={`flex items-center gap-1.5 font-mono font-semibold ${timerColor}`}>
            <Clock className="h-4 w-4" />
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 grid lg:grid-cols-2 gap-6">
        {/* Left — Camera */}
        <div className="flex flex-col gap-4">
          <CameraPreview />

          {/* Progress pills */}
          <div className="flex gap-1.5 flex-wrap">
            {questions.map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  i < currentQuestion
                    ? 'bg-blue-600'
                    : i === currentQuestion
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right — Question & Answer */}
        <div className="flex flex-col gap-4">
          {/* Question card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 mb-3">
              Question {currentQuestion + 1}
            </p>
            <p className="text-lg font-medium text-gray-900 leading-relaxed">
              {questions[currentQuestion]}
            </p>
          </div>

          {/* Answer textarea */}
          <div className="flex-1 flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">Your Answer</label>
            <textarea
              value={answers[currentQuestion]}
              onChange={(e) => updateAnswer(e.target.value)}
              placeholder="Type your answer here, or speak (recording coming soon)..."
              className="flex-1 min-h-[180px] w-full p-4 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 text-sm"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                const params = new URLSearchParams({ role, difficulty });
                router.push(`/interview-setup?${params.toString()}`);
              }}
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <StopCircle className="h-4 w-4" />
              End Session
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              {currentQuestion < questions.length - 1 ? (
                <>
                  Next Question <ChevronRight className="h-4 w-4" />
                </>
              ) : (
                <>
                  Submit & Get Feedback <Send className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function InterviewRoom() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading interview room...</p>
        </div>
      </div>
    }>
      <InterviewRoomContent />
    </Suspense>
  );
}
