import React from "react";
import { Loader2 } from "lucide-react";

interface EvaluatingLoaderProps {
  isOpen: boolean;
}

export function EvaluatingLoader({ isOpen }: EvaluatingLoaderProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-neutral-950/90 backdrop-blur-md text-white">
      <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-6" />
      <h2 className="text-2xl font-bold mb-2 tracking-tight">Evaluating Interview</h2>
      <p className="text-neutral-400 max-w-sm text-center">
        Please wait while our AI analyzes your responses and generates your feedback report...
      </p>
    </div>
  );
}