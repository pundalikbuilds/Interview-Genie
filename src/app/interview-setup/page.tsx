'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import ProgressIndicator from '@/components/interview/ProgressIndicator';
import JobRoleInput from '@/components/interview/JobRoleInput';
import SkillsInput from '@/components/interview/SkillsInput';
import DifficultySelector from '@/components/interview/DifficultySelector';

const STEPS = [
  { label: 'Job Role' },
  { label: 'Skills' },
  { label: 'Difficulty' },
];

export default function InterviewSetup() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [jobRole, setJobRole] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  const canAdvance = () => {
    if (currentStep === 0) return jobRole.trim().length > 0;
    if (currentStep === 1) return skills.length > 0;
    return true;
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      // Navigate to interview room, passing config via query params
      const params = new URLSearchParams({
        role: jobRole,
        skills: skills.join(','),
        difficulty,
      });
      router.push(`/interview-room?${params.toString()}`);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Heading */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Set Up Your Interview</h1>
              <p className="text-gray-500 mt-1 text-sm">
                Customise your mock interview session in a few steps.
              </p>
            </div>

            {/* Progress indicator */}
            <div className="mb-8">
              <ProgressIndicator steps={STEPS} currentStep={currentStep} />
            </div>

            {/* Step content */}
            <div className="min-h-[220px]">
              {currentStep === 0 && (
                <JobRoleInput value={jobRole} onChange={setJobRole} />
              )}
              {currentStep === 1 && (
                <SkillsInput skills={skills} onChange={setSkills} />
              )}
              {currentStep === 2 && (
                <DifficultySelector value={difficulty} onChange={setDifficulty} />
              )}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                {currentStep === 0 ? 'Cancel' : 'Back'}
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={!canAdvance()}
                className={`flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                  canAdvance()
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {currentStep === STEPS.length - 1 ? 'Start Interview' : 'Next Step'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Session summary */}
          {(jobRole || skills.length > 0) && (
            <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl px-5 py-4 text-sm text-blue-800">
              <span className="font-medium">Session: </span>
              {jobRole && <span>{jobRole}</span>}
              {skills.length > 0 && <span> · {skills.join(', ')}</span>}
              {difficulty && <span> · {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</span>}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
