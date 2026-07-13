"use client";

import React from "react";
import { User } from "lucide-react";

interface CameraFeedProps {
  isMain: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  cameraError: string | null;
  emotion: string;
  emotionLabel: string;
}

export function CameraFeed({
  isMain,
  videoRef,
  cameraError,
  emotion,
  emotionLabel,
}: CameraFeedProps) {
  return (
    <div className="relative h-full w-full bg-neutral-900 flex items-center justify-center">
      {cameraError === null ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover transform scale-x-[-1]"
          />
          {emotion && (
            <div
              className={`absolute bg-black/65 backdrop-blur-md text-white rounded-xl shadow-lg border border-white/10 ${
                isMain
                  ? "bottom-6 left-6 px-4 py-2 text-sm"
                  : "bottom-4 left-4 px-3 py-1.5 text-xs"
              }`}
            >
              <div className="font-semibold capitalize">{emotion}</div>
              {emotionLabel && (
                <div className="text-xs text-neutral-300 capitalize">
                  {emotionLabel} confidence
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 bg-neutral-900">
          <User className="mb-3 h-8 w-8 opacity-50" />
          <span className="text-sm">{cameraError}</span>
        </div>
      )}
    </div>
  );
}