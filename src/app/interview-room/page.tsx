"use client";

import { Rnd } from "react-rnd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Bot, Mic, PhoneOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { createVideoStreamClient, type VideoStreamClient } from "@/services/video_ws";
import { useInterviewAudio } from "@/hooks/useInterviewAudio";

<<<<<<< HEAD
<<<<<<< HEAD
type TranscriptEntry = {
  id: string;
  role: "ai" | "user";
  text: string;
};
=======
=======
>>>>>>> ebe7cf0d66c113e462162d46534c579f5a5f4631
// Import the new components
import { AiAvatar } from "@/components/interview-room/AiAvatar";
import { CameraFeed } from "@/components/interview-room/CameraFeed";
import { TranscriptPanel, type TranscriptEntry } from "@/components/interview-room/TranscriptPanel";
import { EvaluatingLoader } from "@/components/interview-room/EvaluatingLoader"; // <-- Import the loader
<<<<<<< HEAD
>>>>>>> 7d25d43e9091a339a1a6232b92d56c7f12f1b8f2
=======
>>>>>>> ebe7cf0d66c113e462162d46534c579f5a5f4631

/**
 * Pick the built-in laptop webcam, avoiding phone/virtual cameras.
 */
async function getBuiltinCameraId(): Promise<string | undefined> {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((d) => d.kind === "videoinput");
    const externalKeywords = [
      "iphone", "ipad", "android", "phone", "continuity",
      "obs", "virtual", "capture", "droidcam", "epoccam",
    ];
    const builtIn = cameras.find((cam) => {
      const label = cam.label.toLowerCase();
      return !externalKeywords.some((kw) => label.includes(kw));
    });
    return builtIn?.deviceId ?? cameras[0]?.deviceId;
  } catch {
    return undefined;
  }
}

// Module-level flag — survives Strict Mode remount cycles.
// Prevents the audio flow from firing twice in React dev mode.
let _audioFlowStarted = false;

export default function InterviewRoom() {
  const [transcript, setTranscript]       = useState<TranscriptEntry[]>([]);
  const [isStartingInterview, setIsStartingInterview] = useState(true);
  const [cameraError, setCameraError]     = useState<string | null>(null);
  const [emotion, setEmotion]             = useState("");
  const [confidence, setConfidence]       = useState(0);
  const [predictionError, setPredictionError] = useState<string | null>(null);
  const [isClientMounted, setIsClientMounted] = useState(false);
  const [isSwapped, setIsSwapped]         = useState(false);
  const [audioError, setAudioError]       = useState<string | null>(null);
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> ebe7cf0d66c113e462162d46534c579f5a5f4631
  
  // Timer state
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Loading state for end of interview
  const [isEndingCall, setIsEndingCall] = useState(false);

  const [interviewSessionId] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return window.sessionStorage.getItem("interviewSessionId");
  });
<<<<<<< HEAD
>>>>>>> 7d25d43e9091a339a1a6232b92d56c7f12f1b8f2
=======
>>>>>>> ebe7cf0d66c113e462162d46534c579f5a5f4631
  const router = useRouter();

  const videoRef              = useRef<HTMLVideoElement>(null);
  const streamRef             = useRef<MediaStream | null>(null);
  const videoStreamRef        = useRef<VideoStreamClient | null>(null);
  const transcriptEndRef      = useRef<HTMLDivElement>(null);

  // ── Timer hook ─────────────────────────────────────────────────────────────
  useEffect(() => {
    // Only increment if we haven't started ending the call
    if (isEndingCall) return;
    
    const interval = window.setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => window.clearInterval(interval);
  }, [isEndingCall]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // ── Audio hook ─────────────────────────────────────────────────────────────
  const handleTranscript = useCallback((text: string) => {
    setTranscript((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", text },
    ]);
  }, []);

  const handleAudioError = useCallback((msg: string) => {
    setAudioError(msg);
  }, []);

  const { isAiSpeaking, isRecording, isTranscribing, startQuestion } =
    useInterviewAudio({
      onTranscript: handleTranscript,
      onError: handleAudioError,
      onQuestion: (question) => {
        addAiBubble(question);
      },
      sessionId: interviewSessionId ?? undefined,
    });

  // ── Add an AI bubble helper ────────────────────────────────────────────────
  const addAiBubble = (text: string) => {
    setTranscript((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "ai", text },
    ]);
  };

  // ── Video emotion handler ──────────────────────────────────────────────────
  const handleVideoMessage = async (message: {
    emotion?: string;
    confidence?: number;
  }) => {
    setIsStartingInterview(false);
    if (typeof message.emotion === "string")   setEmotion(message.emotion);
    if (typeof message.confidence === "number") setConfidence(message.confidence);
  };

  const captureAndSendFrame = async (client: VideoStreamClient) => {
    const video = videoRef.current;
    if (!video || !client.isConnected()) return;
    if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;
    if (video.videoWidth === 0 || video.videoHeight === 0) return;

    const canvas = document.createElement("canvas");
    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const base64Frame = canvas.toDataURL("image/jpeg", 0.85).split(",")[1];
    if (!base64Frame) return;

    try {
      await client.sendFrame(base64Frame);
      if (predictionError) setPredictionError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Video websocket streaming failed";
      setPredictionError((prev) => (prev === message ? prev : message));
    }
  };

  // ── Camera + video WebSocket ───────────────────────────────────────────────
  useEffect(() => {
<<<<<<< HEAD
<<<<<<< HEAD
    if (typeof window === "undefined") return;

    const sessionId = window.sessionStorage.getItem("interviewSessionId");
    interviewSessionIdRef.current = sessionId;

    if (!sessionId) {
      setIsStartingInterview(false);
      setPredictionError("Missing interview session.");
=======
    if (!interviewSessionId || isEndingCall) {
      if (!interviewSessionId) setIsStartingInterview(false);
>>>>>>> 7d25d43e9091a339a1a6232b92d56c7f12f1b8f2
=======
    if (!interviewSessionId || isEndingCall) {
      if (!interviewSessionId) setIsStartingInterview(false);
>>>>>>> ebe7cf0d66c113e462162d46534c579f5a5f4631
      return;
    }

    console.log("Session from backend:", interviewSessionId);

    let mounted = true;
    let interval: number | null = null;
    let isCleanedUp = false;

    const client = createVideoStreamClient({
      sessionId: interviewSessionId,
      onOpen:    () => setPredictionError(null),
      onMessage: handleVideoMessage,
      onError: (error) => {
        if (isCleanedUp) return;
        setIsStartingInterview(false);
        const message = error instanceof Error ? error.message : "Video websocket failed";
        setPredictionError(message);
      },
      onClose: () => { if (!isCleanedUp) setIsStartingInterview(false); },
    });
    videoStreamRef.current = client;

    const startCamera = async () => {
      try {
        const deviceId = await getBuiltinCameraId();
        const videoConstraint = deviceId
          ? { deviceId: { exact: deviceId }, width: { ideal: 1280 }, height: { ideal: 720 } }
          : { width: { ideal: 1280 }, height: { ideal: 720 } };

        let stream: MediaStream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: videoConstraint,
            audio: true,
          });
        } catch {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        }
        if (!mounted) { stream.getTracks().forEach((t) => t.stop()); return; }

        let retries = 0;
        while (!videoRef.current && retries < 20) {
          await new Promise((r) => window.setTimeout(r, 100));
          retries++;
        }
        if (!videoRef.current) { stream.getTracks().forEach((t) => t.stop()); return; }

        streamRef.current = stream;
        videoRef.current.srcObject = stream;

        await new Promise<void>((resolve) => {
          const video = videoRef.current;
          if (!video || video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) { resolve(); return; }
          video.addEventListener("canplay", () => resolve(), { once: true });
        });

        await videoRef.current.play().catch(() => undefined);

        // Wait for WS connection (max 10s)
        await new Promise<void>((resolve) => {
          if (client.isConnected()) { resolve(); return; }
          let waited = 0;
          const poll = window.setInterval(() => {
            waited += 100;
            if (client.isConnected() || waited >= 10000) {
              window.clearInterval(poll); resolve();
            }
          }, 100);
        });

        if (!mounted) return;
        interval = window.setInterval(() => void captureAndSendFrame(client), 2000);
      } catch (error) {
        if (isCleanedUp) return;
        const err = error as DOMException;
        let errorMsg = "Camera unavailable";
        if (err.name === "NotReadableError")  errorMsg = "Camera in use by another app";
        if (err.name === "NotAllowedError")   errorMsg = "Camera permission denied";
        if (err.name === "NotFoundError")     errorMsg = "No camera found";
        if (mounted) setCameraError(errorMsg);
      }
    };

    startCamera();

    return () => {
      mounted = false;
      isCleanedUp = true;
      if (interval !== null) window.clearInterval(interval);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      client.close();
      videoStreamRef.current = null;
    };
<<<<<<< HEAD
<<<<<<< HEAD
  }, []);

  // ── Timer (Count Up) ───────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setInterval(() => setTimeElapsed((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);
=======
  }, [interviewSessionId, isEndingCall]);
>>>>>>> 7d25d43e9091a339a1a6232b92d56c7f12f1b8f2
=======
  }, [interviewSessionId, isEndingCall]);
>>>>>>> ebe7cf0d66c113e462162d46534c579f5a5f4631

  // ── Start audio flow once on mount ────────────────────────────────────────
  const startQuestionRef = useRef(startQuestion);
  useEffect(() => { startQuestionRef.current = startQuestion; }, [startQuestion]);

  useEffect(() => {
    console.log("[InterviewRoom] mount effect fired, _audioFlowStarted:", _audioFlowStarted);

    if (!interviewSessionId) {
      console.log("[InterviewRoom] waiting for session id before starting audio flow");
      return;
    }

    if (_audioFlowStarted) {
      console.log("[InterviewRoom] already started — skipping");
      return;
    }
    _audioFlowStarted = true;

    let firstQuestion =
      "Hello! I'm your AI Interviewer. Let's begin — please introduce yourself.";

    try {
      const raw = window.sessionStorage.getItem("interviewQuestions");
      console.log("[InterviewRoom] raw questions from sessionStorage:", raw);

      if (raw) {
        const questions: string[] = JSON.parse(raw);
        console.log("[InterviewRoom] parsed questions:", questions);
        if (Array.isArray(questions) && questions.length > 0 && questions[0]) {
          firstQuestion = questions[0];
          console.log("[InterviewRoom] firstQuestion set to:", firstQuestion);
        }
      } else {
        console.warn("[InterviewRoom] no interviewQuestions in sessionStorage — using fallback");
      }
    } catch (e) {
      console.error("[InterviewRoom] failed to parse questions:", e);
    }

    console.log("[InterviewRoom] scheduling audio start in 1500ms...");
    window.setTimeout(() => {
      console.log("[InterviewRoom] adding AI bubble:", firstQuestion);
      addAiBubble(firstQuestion);

      console.log("[InterviewRoom] calling startQuestion...");
      void startQuestionRef.current(firstQuestion).then(() => {
        console.log("[InterviewRoom] startQuestion completed");
      }).catch((err: unknown) => {
        console.error("[InterviewRoom] startQuestion threw:", err);
      });
    }, 1500);

  }, [interviewSessionId]);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  useEffect(() => { setIsClientMounted(true); }, []);

  useEffect(() => {
    if (videoRef.current && streamRef.current && !isEndingCall) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => undefined);
    }
  }, [isSwapped, isEndingCall]);

  // ── End Call Handler ───────────────────────────────────────────────────────
  const handleEndCall = async () => {
    setIsEndingCall(true);

    // Turn off camera/microphone immediately so the user knows they are safe
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (videoStreamRef.current) {
      videoStreamRef.current.close();
    }

    try {
      // TODO: Replace this simulated timeout with your actual backend evaluation API call
      // Example:
      // await fetch("/api/evaluate-interview", { 
      //   method: "POST", 
      //   body: JSON.stringify({ sessionId: interviewSessionId, transcript }) 
      // });
      
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulated 3 seconds
      
      // Evaluation is done, redirect to feedback page
      router.replace("/feedback");
    } catch (error) {
      console.error("Failed to evaluate interview:", error);
      setIsEndingCall(false); // Only reset if you want them to be able to try again on error
      // Fallback: router.replace("/feedback");
    }
  };

  // ── Status bar label ───────────────────────────────────────────────────────
  const statusLabel = () => {
    if (isStartingInterview) return { icon: <Mic className="w-4 h-4 text-neutral-400" />, text: "Starting interview…" };
    if (isAiSpeaking)        return { icon: <Bot className="w-4 h-4 text-indigo-600" />,  text: "AI is speaking…" };
    if (isRecording)         return { icon: <Mic className="w-4 h-4 text-red-500 animate-pulse" />, text: "Listening to your response…" };
    if (isTranscribing)      return { icon: <Bot className="w-4 h-4 text-indigo-400" />,  text: "Processing your answer…" };
    return { icon: <Mic className="w-4 h-4 text-neutral-400" />, text: "Ready" };
  };

  const { icon: statusIcon, text: statusText } = statusLabel();

  return (
    <>
      {/* ── SEPARATED LOADING COMPONENT ── */}
      <EvaluatingLoader isOpen={isEndingCall} />

      <div className="min-h-screen w-full bg-neutral-950 text-white overflow-hidden font-sans">
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute left-[12%] top-[10%] h-80 w-80 rounded-full bg-neutral-700/20 blur-3xl" />
          <div className="absolute right-[10%] bottom-[8%] h-96 w-96 rounded-full bg-neutral-800/30 blur-3xl" />
        </div>

        <div className="relative grid min-h-screen grid-cols-1 gap-6 p-4 lg:grid-cols-[minmax(0,1fr)_420px] lg:p-6">
          {predictionError && !isEndingCall && (
            <div className="absolute right-4 top-4 z-50 rounded-md bg-red-500/90 px-3 py-2 text-xs text-white shadow-lg">
              Emotion API: {predictionError}
            </div>
<<<<<<< HEAD
<<<<<<< HEAD
            <div className="bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
              <Clock className="w-4 h-4 text-neutral-400" />
              <span className="font-mono text-sm font-medium">{formatTime(timeElapsed)}</span>
            </div>
          </div>

          <div className="absolute inset-8 top-24 bottom-28 z-10 flex items-center justify-center rounded-3xl"
            onDoubleClick={() => setIsSwapped((p) => !p)} title="Double-click to swap">
            {isSwapped ? (
              <div className="h-full w-full overflow-hidden rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                {renderCameraView(true)}
              </div>
            ) : renderAiView(true)}
          </div>

          {isClientMounted && (
            <Rnd
              default={{ x: 28, y: typeof window !== "undefined" ? window.innerHeight - 290 : 0, width: 340, height: 210 }}
              minWidth={250} minHeight={150} bounds="window" className="z-40"
            >
              <div className="w-full h-full rounded-3xl overflow-hidden bg-neutral-900 border border-white/10 shadow-2xl relative backdrop-blur-md"
                onDoubleClick={() => setIsSwapped((p) => !p)} title="Double-click to swap">
                {isSwapped ? renderAiView(false) : renderCameraView(false)}
              </div>
            </Rnd>
          )}

          <div className="absolute bottom-8 right-8 z-20">
            <button onClick={handleEndCall}
              className="px-6 py-4 rounded-2xl font-medium flex items-center gap-2 transition-all bg-red-600 hover:bg-red-700 text-white shadow-xl">
              <PhoneOff className="w-5 h-5" />
              End Call
            </button>
=======
=======
>>>>>>> ebe7cf0d66c113e462162d46534c579f5a5f4631
          )}
          {audioError && !isEndingCall && (
            <div className="absolute right-4 top-14 z-50 rounded-md bg-orange-500/90 px-3 py-2 text-xs text-white shadow-lg">
              Audio: {audioError}
            </div>
          )}

          {/* LEFT SIDE */}
          <div className="relative min-h-[calc(100vh-2rem)] overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950 shadow-2xl lg:min-h-[calc(100vh-3rem)]">
            <div className="absolute inset-0 pointer-events-none opacity-[0.06] [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:28px_28px]" />

            <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-20">
              <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-bold tracking-widest uppercase">Live Recording</span>
                <span className="text-xs font-mono ml-2 pl-2 border-l border-white/20">{formatTime(elapsedSeconds)}</span>
              </div>
            </div>

            <div
              className="absolute inset-8 top-24 bottom-28 z-10 flex items-center justify-center rounded-3xl"
              onDoubleClick={() => setIsSwapped((p) => !p)}
              title="Double-click to swap"
            >
              {isSwapped ? (
                <div className="h-full w-full overflow-hidden rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                  <CameraFeed 
                    isMain={true} 
                    videoRef={videoRef} 
                    cameraError={cameraError} 
                    emotion={emotion} 
                    confidence={confidence} 
                  />
                </div>
              ) : (
                <AiAvatar isMain={true} isAiSpeaking={isAiSpeaking} />
              )}
            </div>

            {isClientMounted && !isEndingCall && (
              <Rnd
                default={{
                  x: 28,
                  y: typeof window !== "undefined" ? window.innerHeight - 290 : 0,
                  width: 340,
                  height: 210,
                }}
                minWidth={250}
                minHeight={150}
                bounds="window"
                className="z-40"
              >
                <div
                  className="w-full h-full rounded-3xl overflow-hidden bg-neutral-900 border border-white/10 shadow-2xl relative backdrop-blur-md"
                  onDoubleClick={() => setIsSwapped((p) => !p)}
                  title="Double-click to swap"
                >
                  {isSwapped ? (
                    <AiAvatar isMain={false} isAiSpeaking={isAiSpeaking} />
                  ) : (
                    <CameraFeed 
                      isMain={false} 
                      videoRef={videoRef} 
                      cameraError={cameraError} 
                      emotion={emotion} 
                      confidence={confidence} 
                    />
                  )}
                </div>
              </Rnd>
            )}

            <div className="absolute bottom-8 right-8 z-20">
              <button
                onClick={handleEndCall}
                disabled={isEndingCall}
                className="px-6 py-4 rounded-2xl font-medium flex items-center gap-2 transition-all bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white shadow-xl"
              >
                <PhoneOff className="w-5 h-5" />
                End Call
              </button>
            </div>
<<<<<<< HEAD
>>>>>>> 7d25d43e9091a339a1a6232b92d56c7f12f1b8f2
          </div>

<<<<<<< HEAD
        {/* RIGHT SIDE - TRANSCRIPT */}
        <motion.div
          initial={{ x: 400 }} animate={{ x: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 200 }}
          className="z-20 flex h-[520px] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-white text-neutral-900 shadow-[0_20px_60px_rgba(0,0,0,0.28)] lg:h-[calc(100vh-3rem)]"
        >
          <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-600" />
              <h2 className="font-bold text-lg tracking-tight">Live Transcript</h2>
            </div>
            <MoreHorizontal className="w-5 h-5 text-neutral-400" />
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-neutral-50/50">
            <AnimatePresence initial={false}>
              {transcript.map((msg) => (
                <motion.div key={msg.id}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                >
                  <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-1 ml-1">
                    {msg.role === "ai" ? "AI Assistant" : "You"}
                  </span>
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed max-w-[90%] shadow-sm border ${
                    msg.role === "user"
                      ? "bg-neutral-900 text-white rounded-tr-none border-neutral-900"
                      : "bg-white text-neutral-700 rounded-tl-none border-neutral-200"
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={transcriptEndRef} />
          </div>

          <div className="p-4 bg-white border-t border-neutral-100">
            <div className="flex items-center gap-3 px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-500">
              {statusIcon}
              {statusText}
            </div>
          </div>
        </motion.div>
=======
=======
          </div>

>>>>>>> ebe7cf0d66c113e462162d46534c579f5a5f4631
          {/* RIGHT SIDE - TRANSCRIPT */}
          <TranscriptPanel 
            transcript={transcript} 
            transcriptEndRef={transcriptEndRef} 
            statusIcon={statusIcon} 
            statusText={statusText} 
          />
        </div>
<<<<<<< HEAD
>>>>>>> 7d25d43e9091a339a1a6232b92d56c7f12f1b8f2
=======
>>>>>>> ebe7cf0d66c113e462162d46534c579f5a5f4631
      </div>
    </>
  );
}