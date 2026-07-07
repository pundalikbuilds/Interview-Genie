'use client';

import { motion } from 'framer-motion';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressIndicator({
  currentStep,
  totalSteps,
}: ProgressIndicatorProps) {
  const percentage = (currentStep / totalSteps) * 100;

  return (
    <div className="space-y-3 mb-10">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-xs font-bold text-neutral-700">{Math.round(percentage)}%</span>
      </div>
      <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="h-full bg-neutral-900 rounded-full"
        />
      </div>
    </div>
  );
}
