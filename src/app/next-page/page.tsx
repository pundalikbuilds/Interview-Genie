'use client';

import { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import JobRoleInput from '@/components/interview/JobRoleInput';
import SkillsInput from '@/components/interview/SkillsInput';
import DifficultySelector from '@/components/interview/DifficultySelector';
import CameraPreview from '@/components/interview/CameraPreview';
import ProgressIndicator from '@/components/interview/ProgressIndicator';

type DifficultyLevel = 'easy' | 'intermediate' | 'hard';

export default function StartMockInterview() {
  const [jobRole, setJobRole] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('intermediate');
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notice, setNotice] = useState('');

  const isFormValid = jobRole.trim().length > 0 && skills.length > 0;
  const isStartReady = isFormValid && cameraEnabled && micEnabled;

  const handleStartInterview = async () => {
    if (!isStartReady) {
      setNotice('Interview cannot be started. Please complete all fields and turn on camera and mic.');
      setTimeout(() => setNotice(''), 2500);
      return;
    }

    setIsLoading(true);
    // Simulate loading - replace with actual interview start logic
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to interview page
      // router.push('/interview');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/80 bg-white/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-gray-900">Interview-Genie</span>
          </Link>
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Hero */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
            Let's Set Up Your Interview
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Answer a few quick questions and we'll personalize your mock interview experience
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8 max-w-2xl mx-auto">
          <ProgressIndicator currentStep={1} totalSteps={2} />
        </div>

        {/* Two-Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Interview Setup Form */}
          <div className="order-2 lg:order-1">
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="space-y-8">
                {/* Job Role Input */}
                <JobRoleInput value={jobRole} onChange={setJobRole} />

                {/* Skills Input */}
                <SkillsInput skills={skills} onChange={setSkills} />

                {/* Difficulty Selector */}
                <DifficultySelector value={difficulty} onChange={setDifficulty} />

                {/* Form Validation Message */}
                {!isFormValid && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-900">
                      Fill in your role and select at least one skill to get started
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Camera Preview */}
          <div className="order-1 lg:order-2">
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow sticky top-24">
              <CameraPreview
                cameraEnabled={cameraEnabled}
                micEnabled={micEnabled}
                onCameraToggle={setCameraEnabled}
                onMicToggle={setMicEnabled}
              />
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="mt-12 max-w-2xl mx-auto">
          <button
            onClick={handleStartInterview}
            disabled={isLoading}
            className={`w-full group relative overflow-hidden rounded-xl px-8 py-4 font-semibold text-lg transition-all duration-300 ${
              isStartReady && !isLoading
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl hover:scale-105'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

            {/* Content */}
            <div className="flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Starting Your Interview...</span>
                </>
              ) : (
                <>
                  <span>Start Interview</span>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </div>
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Your personalized interview will begin instantly
          </p>

          {notice && (
            <div className="mt-4 rounded-lg border border-orange-200 bg-orange-50 px-4 py-3 text-center text-sm text-orange-700">
              {notice}
            </div>
          )}

          {/* Trust Signal */}
          <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-xl text-center">
            <p className="text-xs text-gray-600">
              <span className="font-semibold text-blue-900">Privacy First:</span> Your camera
              and microphone stay on your device. We never record without consent.
            </p>
          </div>
        </div>
      </main>

      {/* Footer CTA - Subtle */}
      <footer className="border-t border-gray-200 bg-white/50 backdrop-blur-sm py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-600">
            First time here?{' '}
            <Link href="/" className="font-semibold text-blue-600 hover:text-blue-700">
              Learn more about Interview-Genie
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
