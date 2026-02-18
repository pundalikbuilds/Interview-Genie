'use client';

import { useState, useEffect, useRef } from 'react';
import { Camera, Mic, AlertCircle, CheckCircle } from 'lucide-react';

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
      .catch(() => {
        setMicAvailable(false);
      });
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-700">Setup Check</h3>
        <p className="text-xs text-gray-500 mt-1">
          Enable your camera and microphone for the interview
        </p>
      </div>

      {/* Video Preview Container */}
      <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden border-2 border-gray-700 shadow-lg">
        {cameraEnabled && cameraAvailable ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-green-500/90 text-white rounded-full text-xs font-medium backdrop-blur-sm">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              Camera On
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <Camera className="h-8 w-8 text-gray-500" />
            </div>
            <p className="text-gray-400 text-sm font-medium">Camera Off</p>
            <p className="text-gray-500 text-xs mt-1">Enable camera to continue</p>
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
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
            cameraEnabled
              ? 'bg-green-50 border-2 border-green-400 text-green-700 hover:bg-green-100'
              : 'bg-gray-100 border-2 border-gray-300 text-gray-600 hover:bg-gray-200'
          } ${!cameraAvailable ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <Camera
            className={`h-5 w-5 transition-transform ${
              cameraEnabled ? 'scale-110' : ''
            }`}
          />
          <span className="text-sm">{cameraEnabled ? 'Camera On' : 'Camera Off'}</span>
        </button>

        {/* Microphone Toggle */}
        <button
          onClick={() => {
            if (micAvailable) {
              onMicToggle(!micEnabled);
            }
          }}
          disabled={!micAvailable}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
            micEnabled
              ? 'bg-green-50 border-2 border-green-400 text-green-700 hover:bg-green-100'
              : 'bg-gray-100 border-2 border-gray-300 text-gray-600 hover:bg-gray-200'
          } ${!micAvailable ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <Mic
            className={`h-5 w-5 transition-transform ${
              micEnabled ? 'scale-110' : ''
            }`}
          />
          <span className="text-sm">{micEnabled ? 'Mic On' : 'Mic Off'}</span>
        </button>
      </div>

      {/* Status Indicators */}
      <div className="space-y-2">
        {!cameraAvailable && (
          <div className="flex items-center gap-2 text-xs text-orange-700 px-3 py-2 bg-orange-50 rounded-lg border border-orange-200">
            <AlertCircle className="h-4 w-4" />
            <span>Camera not found. Check permissions.</span>
          </div>
        )}

        {!micAvailable && (
          <div className="flex items-center gap-2 text-xs text-orange-700 px-3 py-2 bg-orange-50 rounded-lg border border-orange-200">
            <AlertCircle className="h-4 w-4" />
            <span>Microphone not found. Check permissions.</span>
          </div>
        )}
      </div>
    </div>
  );
}
