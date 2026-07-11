'use client';

import { useState, useEffect, useRef } from 'react';
import { Camera, Mic, AlertCircle } from 'lucide-react';

interface CameraPreviewProps {
  cameraEnabled: boolean;
  micEnabled: boolean;
  onCameraToggle: (enabled: boolean) => void;
  onMicToggle: (enabled: boolean) => void;
}

/**
 * Pick the best camera device — prefers the built-in laptop webcam.
 * Filters out virtual cameras, phone cameras, and OBS/capture devices
 * by checking the device label for common keywords.
 */
async function getBuiltinCameraId(): Promise<string | undefined> {
  try {
    // Must request permission first before labels are available
    const tempStream = await navigator.mediaDevices.getUserMedia({ video: true });
    tempStream.getTracks().forEach((t) => t.stop());

    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((d) => d.kind === "videoinput");

    // Keywords that indicate non-laptop cameras
    const externalKeywords = [
      "iphone", "ipad", "android", "phone", "continuity",
      "obs", "virtual", "capture", "droidcam", "epoccam",
      "snap camera", "mmhmm",
    ];

    // Prefer a camera whose label does NOT contain external keywords
    const builtIn = cameras.find((cam) => {
      const label = cam.label.toLowerCase();
      return !externalKeywords.some((kw) => label.includes(kw));
    });

    // Fall back to first available camera
    return builtIn?.deviceId ?? cameras[0]?.deviceId;
  } catch {
    return undefined;
  }
}

export default function CameraPreview({
  cameraEnabled,
  micEnabled,
  onCameraToggle,
  onMicToggle,
}: CameraPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const [cameraAvailable, setCameraAvailable] = useState(true);
  const [micAvailable, setMicAvailable] = useState(true);
  const [micPermissionDenied, setMicPermissionDenied] = useState(false);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const deviceId = await getBuiltinCameraId();

        const videoConstraint = deviceId
          ? { deviceId: { exact: deviceId }, width: { ideal: 1280 }, height: { ideal: 720 } }
          : { width: { ideal: 1280 }, height: { ideal: 720 } };

        const stream = await navigator.mediaDevices.getUserMedia({
          video: videoConstraint,
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
        streamRef.current.getTracks().forEach((track) => track.stop());
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

    return () => { stopCamera(); };
  }, [cameraEnabled]);

  // ── Actually request mic permission when micEnabled becomes true ───────────
  useEffect(() => {
    const startMic = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micStreamRef.current = stream;
        setMicAvailable(true);
        setMicPermissionDenied(false);
      } catch (error) {
        const err = error as DOMException;
        if (err.name === "NotAllowedError") {
          console.warn("User denied mic permissions");
          setMicPermissionDenied(true);
        } else if (err.name === "NotFoundError") {
          console.warn("No mic device found");
          setMicAvailable(false);
        } else {
          console.warn("Mic error:", err);
          setMicAvailable(false);
        }
        // Reset the toggle since we didn't actually get access
        onMicToggle(false);
      }
    };

    const stopMic = () => {
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((track) => track.stop());
        micStreamRef.current = null;
      }
    };

    if (micEnabled) {
      startMic();
    } else {
      stopMic();
    }

    return () => { stopMic(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [micEnabled]);

  // Check device presence up front (does not itself trigger a permission prompt)
  useEffect(() => {
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        const hasMic = devices.some((device) => device.kind === "audioinput");
        setMicAvailable(hasMic);
      })
      .catch(() => setMicAvailable(false));
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
        <button
          onClick={() => { if (cameraAvailable) onCameraToggle(!cameraEnabled); }}
          disabled={!cameraAvailable}
          className={`flex items-center justify-center gap-2 px-4 py-4 rounded-xl font-bold transition-all duration-300 ${
            cameraEnabled
              ? "bg-neutral-900 border-2 border-neutral-900 text-white"
              : "bg-white border-2 border-neutral-200 text-neutral-600 hover:border-neutral-300"
          } ${!cameraAvailable ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          <Camera className={`h-5 w-5 transition-transform ${cameraEnabled ? "scale-110" : ""}`} />
          <span className="text-sm">{cameraEnabled ? "Camera On" : "Enable Camera"}</span>
        </button>

        <button
          onClick={() => { if (micAvailable) onMicToggle(!micEnabled); }}
          disabled={!micAvailable}
          className={`flex items-center justify-center gap-2 px-4 py-4 rounded-xl font-bold transition-all duration-300 ${
            micEnabled
              ? "bg-neutral-900 border-2 border-neutral-900 text-white"
              : "bg-white border-2 border-neutral-200 text-neutral-600 hover:border-neutral-300"
          } ${!micAvailable ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          <Mic className={`h-5 w-5 transition-transform ${micEnabled ? "scale-110" : ""}`} />
          <span className="text-sm">{micEnabled ? "Mic On" : "Enable Mic"}</span>
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
        {micPermissionDenied && (
          <div className="flex items-center gap-2 text-xs font-medium text-red-700 px-4 py-3 bg-red-50 rounded-lg border border-red-200">
            <AlertCircle className="h-4 w-4" />
            <span>Microphone permission was denied. Please allow access in your browser settings and try again.</span>
          </div>
        )}
      </div>
    </div>
  );
}