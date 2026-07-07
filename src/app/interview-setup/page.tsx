"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, PlayCircle } from "lucide-react";

import Header from "@/components/Header";
import JobRoleInput from "@/components/interview-setup/JobRoleInput";
import SkillsInput from "@/components/interview-setup/SkillsInput";
import DifficultySelector from "@/components/interview-setup/DifficultySelector";
import CameraPreview from "@/components/interview-setup/CameraPreview";
import ProgressIndicator from "@/components/interview-setup/ProgressIndicator";
import { sendJobDetails } from "@/services/jobdesc";

export default function InterviewSetupPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const totalSteps = 2;

  const [jobRole, setJobRole] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<"easy" | "intermediate" | "hard">("intermediate");

  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const [isStartingInterview, setIsStartingInterview] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);
  const [questionsReady, setQuestionsReady] = useState(false);

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleStartInterview = async () => {
    setStartError(null);
    const userId = "12345"; // temp until auth
    const candidateName = "Aaron Wang"; // temp until auth
    setIsStartingInterview(true);
    setQuestionsReady(false);

    try {
      const res = await sendJobDetails({
        userId,
        candidateName,
        jobRole,
        skills,
        difficulty,
      });

      const sessionId = res?.session_id;

      if (!sessionId) {
        throw new Error("Backend did not return a session_id");
      }

      const questions = res?.questions ?? [];

      console.log("Session from backend:", sessionId);
      console.log("Questions received from backend:", questions);

      if (typeof window !== "undefined") {
        window.sessionStorage.setItem("interviewSessionId", sessionId);
        window.sessionStorage.setItem(
          "interviewQuestions",
          JSON.stringify(questions)
        );
      }

      setQuestionsReady(true);
      router.push("/interview-room");

    } catch (err) {
      console.error("Failed to start interview:", err);
      setStartError("Unable to start the interview right now. Please try again.");
      setQuestionsReady(false);
    } finally {
      setIsStartingInterview(false);
    }
  };

  const isStep1Valid = jobRole.trim().length > 2 && skills.length > 0;
  const canStartInterview = cameraEnabled && micEnabled;

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.35 },
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.25 },
    },
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white">
      <Header />

      <main className="pt-28 pb-16 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors mb-6"
            >
              <ArrowLeft className="h-3 w-3" />
              Back to Home
            </Link>

            <h1 className="text-4xl font-bold text-neutral-900 tracking-tight">
              Configure Session
            </h1>

            <p className="mt-2 text-neutral-500">
              Calibrate your interview settings before you begin.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.05)] border border-neutral-200 p-6 md:p-10">
            <ProgressIndicator currentStep={step} totalSteps={totalSteps} />

            <div className="min-h-[350px]">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step-1"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-8"
                  >
                    <JobRoleInput value={jobRole} onChange={setJobRole} />
                    <SkillsInput skills={skills} onChange={setSkills} />
                    <DifficultySelector value={difficulty} onChange={setDifficulty} />
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step-2"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-8"
                  >
                    <CameraPreview
                      cameraEnabled={cameraEnabled}
                      micEnabled={micEnabled}
                      onCameraToggle={setCameraEnabled}
                      onMicToggle={setMicEnabled}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-12 pt-8 border-t border-neutral-100 flex justify-between items-center">
              <button
                onClick={handleBack}
                disabled={step === 1}
                className={`flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-lg transition-colors ${
                  step === 1
                    ? "text-neutral-300 cursor-not-allowed"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                }`}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>

              {step < totalSteps ? (
                <button
                  onClick={handleNext}
                  disabled={step === 1 && !isStep1Valid}
                  className={`flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold transition-all ${
                    step === 1 && !isStep1Valid
                      ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                      : "bg-neutral-900 text-white hover:bg-neutral-800 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                  }`}
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <>
                  {canStartInterview ? (
                    <button
                      type="button"
                      onClick={handleStartInterview}
                      disabled={isStartingInterview}
                      className="flex items-center gap-2 px-8 py-3.5 bg-neutral-900 text-white rounded-xl text-sm font-bold hover:bg-neutral-800 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <PlayCircle className="h-5 w-5" />
                      {isStartingInterview ? "Starting..." : "Start Interview"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="flex items-center gap-2 px-8 py-3.5 bg-neutral-100 text-neutral-400 rounded-xl text-sm font-bold cursor-not-allowed"
                    >
                      <PlayCircle className="h-5 w-5" />
                      Start Interview
                    </button>
                  )}
                </>
              )}
            </div>

            {startError && (
              <p className="mt-4 text-sm text-red-600">{startError}</p>
            )}

            {isStartingInterview && !questionsReady && (
              <p className="mt-3 text-sm text-neutral-400 text-center">
                ⏳ Generating your interview questions...
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}