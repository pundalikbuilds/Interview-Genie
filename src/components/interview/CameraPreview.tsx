'use client';

import { useState, useEffect, useRef } from 'react';
import { Camera, Mic, AlertCircle } from 'lucide-react';

interface CameraPreviewProps {
  cameraEnabled: boolean;
  micEnabled: boolean;
  onCameraToggle: (enabled: boolean) => void;
  onMicToggle: (enabled: boolean) => void;
}

export default function CameraPreview({
  cameraEnabled,
  micEnabled,
  onCameraToggle,
  onMicToggle,
}: CameraPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraAvailable, setCameraAvailable] = useState(true);
  const [micAvailable, setMicAvailable] = useState(true);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        const err = error as DOMException;
        if (err.name === "NotAllowedError") {
          console.warn("User denied camera permissions");
        } else if (err.name === "NotFoundError") {
          console.warn("No camera device found");
        }
        setCameraAvailable(false);
      }
    };

    const stopCamera = () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };

    if (cameraEnabled) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [cameraEnabled]);

  useEffect(() => {
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        const hasMic = devices.some((device) => device.kind === 'audioinput');
        setMicAvailable(hasMic);
      })
      .catch((error) => {
        const err = error as DOMException;
        if (err.name === "NotAllowedError") {
          console.warn("Permission to enumerate devices denied");
        }
        setMicAvailable(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-bold text-neutral-900">System Check</h3>
        <p className="text-sm text-neutral-500 mt-1">
          Ensure you are visible and audible before starting.
        </p>
      </div>

      {/* Video Preview Container */}
      <div className="relative aspect-video bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl overflow-hidden border border-neutral-700 shadow-xl">
        {cameraEnabled && cameraAvailable ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-md text-white rounded-lg text-xs font-bold uppercase tracking-widest border border-white/10">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              Live
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-neutral-500 bg-gradient-to-b from-neutral-800 to-neutral-900">
            <div className="w-16 h-16 bg-neutral-800/60 rounded-full flex items-center justify-center mb-4 border border-neutral-700">
              <Camera className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium">Camera is disabled</p>
            <p className="text-xs mt-1">Enable camera to continue</p>
          </div>
        )}
      </div>

      {/* Media Controls */}
      <div className="grid grid-cols-2 gap-3">
        {/* Camera Toggle */}
        <button
          onClick={() => {
            if (cameraAvailable) {
              onCameraToggle(!cameraEnabled);
            }
          }}
          disabled={!cameraAvailable}
          className={`flex items-center justify-center gap-2 px-4 py-4 rounded-xl font-bold transition-all duration-300 ${
            cameraEnabled
              ? 'bg-neutral-900 border-2 border-neutral-900 text-white'
              : 'bg-white border-2 border-neutral-200 text-neutral-600 hover:border-neutral-300'
          } ${!cameraAvailable ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <Camera
            className={`h-5 w-5 transition-transform ${
              cameraEnabled ? 'scale-110' : ''
            }`}
          />
          <span className="text-sm">{cameraEnabled ? 'Camera On' : 'Enable Camera'}</span>
        </button>

        {/* Microphone Toggle */}
        <button
          onClick={() => {
            if (micAvailable) {
              onMicToggle(!micEnabled);
            }
          }}
          disabled={!micAvailable}
          className={`flex items-center justify-center gap-2 px-4 py-4 rounded-xl font-bold transition-all duration-300 ${
            micEnabled
              ? 'bg-neutral-900 border-2 border-neutral-900 text-white'
              : 'bg-white border-2 border-neutral-200 text-neutral-600 hover:border-neutral-300'
          } ${!micAvailable ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <Mic
            className={`h-5 w-5 transition-transform ${
              micEnabled ? 'scale-110' : ''
            }`}
          />
          <span className="text-sm">{micEnabled ? 'Mic On' : 'Enable Mic'}</span>
        </button>
      </div>

      {/* Status Indicators */}
      <div className="space-y-2">
        {!cameraAvailable && (
          <div className="flex items-center gap-2 text-xs font-medium text-amber-700 px-4 py-3 bg-amber-50 rounded-lg border border-amber-200">
            <AlertCircle className="h-4 w-4" />
            <span>Camera not found or permission denied.</span>
          </div>
        )}

        {!micAvailable && (
          <div className="flex items-center gap-2 text-xs font-medium text-amber-700 px-4 py-3 bg-amber-50 rounded-lg border border-amber-200">
            <AlertCircle className="h-4 w-4" />
            <span>Microphone not found or permission denied.</span>
          </div>
        )}
      </div>
    </div>
  );
}
