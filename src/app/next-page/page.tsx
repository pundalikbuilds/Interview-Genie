"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, PlayCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JobRoleInput from "@/components/interview/JobRoleInput";
import SkillsInput from "@/components/interview/SkillsInput";
import DifficultySelector from "@/components/interview/DifficultySelector";
import CameraPreview from "@/components/interview/CameraPreview";
import ProgressIndicator from "@/components/interview/ProgressIndicator";

type DifficultyLevel = "easy" | "intermediate" | "hard";

export default function InterviewSetupPage() {
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const [jobRole, setJobRole] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("intermediate");
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const isStep1Valid = jobRole.trim().length > 2 && skills.length > 0;

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white">
      <Header />

      <main className="pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">
              Configure Your Session
            </h1>
            <p className="mt-2 text-neutral-600">
              Let's tailor the AI to your specific goals.
            </p>
            <Link
              href="/"
              className="inline-flex mt-4 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Back to Home
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 md:p-8">
            <ProgressIndicator currentStep={step} totalSteps={totalSteps} />

            {step === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <JobRoleInput value={jobRole} onChange={setJobRole} />
                <SkillsInput skills={skills} onChange={setSkills} />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <DifficultySelector value={difficulty} onChange={setDifficulty} />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <CameraPreview
                  cameraEnabled={cameraEnabled}
                  micEnabled={micEnabled}
                  onCameraToggle={setCameraEnabled}
                  onMicToggle={setMicEnabled}
                />
              </div>
            )}

            <div className="mt-10 pt-6 border-t border-neutral-100 flex justify-between items-center">
              <button
                onClick={handleBack}
                disabled={step === 1}
                className={`flex items-center gap-2 text-sm font-medium ${
                  step === 1
                    ? "text-neutral-300 cursor-not-allowed"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>

              {step < totalSteps ? (
                <button
                  onClick={handleNext}
                  disabled={step === 1 && !isStep1Valid}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                    step === 1 && !isStep1Valid
                      ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                      : "bg-neutral-900 text-white hover:bg-neutral-800 shadow-md hover:shadow-lg"
                  }`}
                >
                  Next Step <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <Link
                  href="/interview-room"
                  className="flex items-center gap-2 px-8 py-3 bg-neutral-900 text-white rounded-full text-sm font-bold hover:bg-neutral-800 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                >
                  <PlayCircle className="h-5 w-5" /> Start Interview
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
