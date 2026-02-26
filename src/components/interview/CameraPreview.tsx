'use client';

import { useRef, useEffect, useState } from 'react';
import { Camera, CameraOff, Mic, MicOff, RefreshCw } from 'lucide-react';

interface CameraPreviewProps {
  onStreamReady?: (stream: MediaStream) => void;
}

export default function CameraPreview({ onStreamReady }: CameraPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: isMicOn,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraOn(true);
      onStreamReady?.(stream);
    } catch {
      setError('Unable to access camera. Please check your permissions.');
      setIsCameraOn(false);
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
  };

  const toggleCamera = () => {
    isCameraOn ? stopCamera() : startCamera();
  };

  const toggleMic = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !isMicOn;
      });
    }
    setIsMicOn((prev) => !prev);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-3">
      {/* Video frame */}
      <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isCameraOn ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Placeholder when off */}
        {!isCameraOn && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-gray-400">
            <CameraOff className="h-12 w-12" />
            <span className="text-sm">Camera is off</span>
          </div>
        )}

        {/* Live badge */}
        {isCameraOn && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            LIVE
          </div>
        )}

        {/* Mic status badge */}
        {isCameraOn && !isMicOn && (
          <div className="absolute top-3 right-3 bg-gray-800/80 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <MicOff className="h-3 w-3" />
            Muted
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={toggleCamera}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
            isCameraOn
              ? 'bg-red-100 text-red-600 hover:bg-red-200'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isCameraOn ? (
            <>
              <CameraOff className="h-4 w-4" /> Turn Off
            </>
          ) : (
            <>
              <Camera className="h-4 w-4" /> Start Camera
            </>
          )}
        </button>

        {isCameraOn && (
          <>
            <button
              type="button"
              onClick={toggleMic}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                isMicOn
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
              }`}
            >
              {isMicOn ? (
                <>
                  <Mic className="h-4 w-4" /> Mute
                </>
              ) : (
                <>
                  <MicOff className="h-4 w-4" /> Unmute
                </>
              )}
            </button>

            <button
              type="button"
              onClick={startCamera}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
            >
              <RefreshCw className="h-4 w-4" /> Restart
            </button>
          </>
        )}
      </div>
    </div>
  );
}
