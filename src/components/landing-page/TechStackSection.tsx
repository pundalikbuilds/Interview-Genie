"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const frontendStack = [
  { name: "Next.js", category: "Framework" },
  { name: "React", category: "Frontend" },
  { name: "TypeScript", category: "Language" },
  { name: "Tailwind CSS", category: "Styling" },
  { name: "Framer Motion", category: "Animation" },
  { name: "react-rnd", category: "Draggable UI" },
  { name: "lucide-react", category: "Icons" },
];

const backendStack = [
  { name: "FastAPI", category: "Backend" },
  { name: "LangGraph", category: "Orchestration" },
  { name: "Gemini API", category: "LLM / TTS" },
  { name: "Qwen3-8B (LoRA)", category: "Evaluation Model" },
  { name: "YOLOv8", category: "Emotion Detection" },
  { name: "PyTorch", category: "ML Runtime" },
  { name: "OpenCV", category: "Computer Vision" },
  { name: "WebSockets", category: "Real-time Streaming" },
];

export function TechStackSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section 
      ref={sectionRef} 
      className="relative pt-12 pb-24 lg:pt-16 lg:pb-32 bg-white overflow-hidden border-t border-neutral-100 z-20"
    >
      <motion.div style={{ opacity }} className="max-w-[1400px] mx-auto px-6 lg:px-12 mb-16 lg:mb-24">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-neutral-400 mb-6 uppercase tracking-widest font-bold">
            <span className="w-8 h-px bg-neutral-200" />
            Tech Stack
            <span className="w-8 h-px bg-neutral-200" />
          </span>
          <h2 className="text-4xl lg:text-6xl font-bold tracking-tighter leading-tight mb-6 text-neutral-900">
            Powered by modern <br />
            <span className="text-neutral-400 font-light italic">technologies.</span>
          </h2>
        </div>
      </motion.div>

      {/* Row 1: Frontend (Right to Left) */}
      <div className="w-full mb-6 flex overflow-x-hidden py-1">
        <motion.div
          className="flex gap-6 whitespace-nowrap px-3 will-change-transform"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 80, repeat: Infinity }}
        >
          {[...frontendStack, ...frontendStack].map((tech, idx) => (
            <div
              key={`front-${tech.name}-${idx}`}
              className="shrink-0 w-64 px-8 py-6 bg-white border border-neutral-900 shadow-sm rounded-none hover:bg-neutral-50 hover:shadow-md transition-all duration-300 group cursor-default"
            >
              <div className="text-lg font-bold text-neutral-900 group-hover:translate-x-1 transition-transform">
                {tech.name}
              </div>
              <div className="text-sm font-mono text-neutral-400 mt-1">
                {tech.category}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Row 2: Backend / AI (Left to Right) */}
      <div className="w-full flex overflow-x-hidden py-1">
        <motion.div
          className="flex gap-6 whitespace-nowrap px-3 will-change-transform"
          animate={{ x: ["-50%", "0%"] }}
          transition={{ ease: "linear", duration: 90, repeat: Infinity }}
        >
          {[...backendStack, ...backendStack].map((tech, idx) => (
            <div
              key={`back-${tech.name}-${idx}`}
              className="shrink-0 w-64 px-8 py-6 bg-neutral-50/50 border border-neutral-900 shadow-sm rounded-none hover:bg-neutral-100 hover:shadow-md transition-all duration-300 group cursor-default"
            >
              <div className="text-lg font-bold text-neutral-900 group-hover:-translate-x-1 transition-transform">
                {tech.name}
              </div>
              <div className="text-sm font-mono text-neutral-400 mt-1">
                {tech.category}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
      
      {/* Gradient fades on the edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent" />
    </section>
  );
}