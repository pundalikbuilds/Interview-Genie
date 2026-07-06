"use client";

import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import {
  Bot, CheckCircle, Mic2, PlayCircle, ArrowRight,
  Mic, Camera, Activity, Code2, LineChart,
} from 'lucide-react';
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';

// ==========================================
// NEURAL DATA STREAM ANIMATED BACKGROUND (GRAYSCALE)
// ==========================================
function AiNeuralBackground() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-neutral-50">
      
      {/* Interactive Mouse Glow */}
      <motion.div
        animate={{
          x: mousePos.x - 400,
          y: mousePos.y - 400,
        }}
        transition={{ type: "tween", ease: "easeOut", duration: 1.2 }}
        className="absolute w-[800px] h-[800px] rounded-full bg-neutral-300/20 blur-[120px] z-10"
      />

      {/* Large Ambient AI Gradients */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-neutral-300/30 blur-[130px]"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -100, 0],
          y: [0, 80, 0],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-gray-300/30 blur-[150px]"
      />

      {/* Floating Neural Nodes */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={`node-${i}`}
          animate={{
            y: [0, Math.sin(i) * -80, 0],
            x: [0, Math.cos(i) * 60, 0],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{
            duration: 8 + (i % 5) * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3
          }}
          className="absolute rounded-full bg-neutral-400"
          style={{
            width: `${4 + (i % 3) * 4}px`,
            height: `${4 + (i % 3) * 4}px`,
            left: `${10 + (i * 7) % 80}%`,
            top: `${15 + (i * 11) % 70}%`,
            boxShadow: '0 0 20px 4px rgba(163, 163, 163, 0.4)'
          }}
        />
      ))}

      {/* Data Stream Circuit Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-40">
        <defs>
          <linearGradient id="circuit-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a3a3a3" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#d4d4d8" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#a3a3a3" stopOpacity="0.1" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Static faint circuits */}
        <path d="M-100,200 L200,200 L300,300 L600,300 L700,200 L1200,200" fill="none" stroke="#d4d4d8" strokeWidth="1" />
        <path d="M400,-100 L400,100 L500,200 L500,500" fill="none" stroke="#d4d4d8" strokeWidth="1" />
        
        {/* Animated Data Packets (Moving Dashes) */}
        <motion.path
          d="M-100,200 L200,200 L300,300 L600,300 L700,200 L1200,200"
          fill="none"
          stroke="url(#circuit-grad)"
          strokeWidth="3"
          filter="url(#glow)"
          strokeDasharray="40 400"
          animate={{ strokeDashoffset: [440, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />
        <motion.path
          d="M1200,400 L800,400 L700,500 L300,500 L200,600 L-100,600"
          fill="none"
          stroke="url(#circuit-grad)"
          strokeWidth="2"
          filter="url(#glow)"
          strokeDasharray="30 500"
          animate={{ strokeDashoffset: [0, 530] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear", delay: 2 }}
        />
        <motion.path
          d="M400,-100 L400,100 L500,200 L500,800"
          fill="none"
          stroke="url(#circuit-grad)"
          strokeWidth="3"
          filter="url(#glow)"
          strokeDasharray="50 600"
          animate={{ strokeDashoffset: [650, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear", delay: 1 }}
        />
      </svg>

      {/* Hexagonal Tech Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='100' viewBox='0 0 60 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' stroke-width='1' stroke='%23000' fill='none' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: '40px 60px'
        }}
      />

      {/* Subtle Binary / Vertical Data Flow */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`data-line-${i}`}
          animate={{ y: ['-100vh', '100vh'] }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5
          }}
          className="absolute w-[1px] h-[300px] bg-gradient-to-b from-transparent via-neutral-300/40 to-transparent"
          style={{ left: `${15 * (i + 1)}%` }}
        />
      ))}

      {/* Bottom fade into clean white */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white via-white/95 to-transparent z-20" />
    </div>
  );
}

// ==========================================
// EXPANDABLE SPOTLIGHT CARD (FEATURES)
// ==========================================
function ExpandableFeatureCard({
  children,
  className = '',
  index,
  hoveredIndex,
  onHover,
}: {
  children: React.ReactNode;
  className?: string;
  index: number;
  hoveredIndex: number | null;
  onHover: () => void;
}) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [spotlightOpacity, setSpotlightOpacity] = useState(0);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  };

  const isHovered       = hoveredIndex === index;
  const isOthersHovered = hoveredIndex !== null && hoveredIndex !== index;

  return (
    <motion.div
      layout
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => { setSpotlightOpacity(1); onHover(); }}
      onMouseLeave={() => setSpotlightOpacity(0)}
      animate={{
        minHeight:    isHovered ? '220px' : '100px',
        borderRadius: '0px',
        scale:        isHovered ? 1.02 : isOthersHovered ? 0.95 : 1,
        filter:       isOthersHovered ? 'blur(2px)' : 'blur(0px)',
        opacity:      isOthersHovered ? 0.5 : 1,
        zIndex:       isHovered ? 50 : 1,
      }}
      transition={{ type: 'spring', bounce: 0.3, duration: 0.6 }}
      className={`relative overflow-hidden border border-neutral-300 rounded-none bg-white p-8 transition-colors hover:bg-neutral-50/80 ${className} ${
        isHovered
          ? 'shadow-[0_30px_80px_-15px_rgba(0,0,0,0.15)] border-neutral-400'
          : 'shadow-sm'
      }`}
    >
      {/* Mouse spotlight - Grayscale */}
      <div
        className="pointer-events-none absolute -inset-px transition duration-300"
        style={{
          opacity:    spotlightOpacity,
          background: `radial-gradient(500px circle at ${position.x}px ${position.y}px, rgba(0,0,0,0.04), transparent 45%)`,
        }}
      />

      <motion.div layout className="relative z-10 h-full flex flex-col justify-center">
        {children}
      </motion.div>
    </motion.div>
  );
}

// ==========================================
// TECH STACK SCROLLING MARQUEE
// ==========================================
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

function TechStackSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section 
      ref={sectionRef} 
      className="relative py-24 lg:py-32 bg-white overflow-hidden border-t border-neutral-100 z-20"
    >
      <motion.div style={{ opacity }} className="max-w-[1400px] mx-auto px-6 lg:px-12 mb-16 lg:mb-24">
        {/* Header */}
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
      <div className="w-full mb-6 flex overflow-hidden">
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
      <div className="w-full flex overflow-hidden">
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

// ==========================================
// MAIN HOME PAGE
// ==========================================
export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // PARALLAX TEXT (Y movement applied to parent)
  const yText = useTransform(scrollYProgress, [0, 1], [0, 100]);
  
  // BUTTON ONLY TRANSFORMS (Waits until 60% scroll before fading and fully blurs/hides by 90%)
  const buttonOpacity = useTransform(scrollYProgress, [0, 0.6, 0.9], [1, 1, 0]);
  const buttonFilter  = useTransform(scrollYProgress, [0, 0.6, 0.9], ['blur(0px)', 'blur(0px)', 'blur(12px)']);
  
  const scaleImg = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const yImg     = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const rotateX  = useTransform(scrollYProgress, [0, 1], [60, 0]);
  const rotateZ  = useTransform(scrollYProgress, [0, 1], [-45, 0]);

  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show:   { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white">
      <Header />

      {/* HERO SECTION */}
      <section
        ref={heroRef}
        className="relative min-h-[88vh] flex items-center pt-28 pb-10 overflow-hidden border-b border-neutral-100"
      >
        <AiNeuralBackground />

        <div className="max-w-screen-2xl mx-auto px-6 grid lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">

          {/* PARENT TEXT WRAPPER - No opacity/filter here anymore, just Y movement */}
          <motion.div
            style={{ y: yText }}
            className="relative z-20 max-w-2xl"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <motion.h1
              variants={itemVariants}
              className="mt-2 text-7xl lg:text-9xl font-bold tracking-tighter leading-[0.85] mb-8"
            >
              ACE <br />
              YOUR <span className="text-neutral-400 font-light italic">INTERVIEW.</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl text-neutral-600 leading-relaxed max-w-md mb-10 font-light"
            >
              Train with realistic AI interviewers, get instant feedback, and improve your
              answers before the real interview.
            </motion.p>

            {/* BUTTON WRAPPER - Transforms applied exclusively here */}
            <motion.div 
              variants={itemVariants} 
              style={{ opacity: buttonOpacity, filter: buttonFilter }} 
              className="flex gap-4"
            >
              <Link
                href="/interview-setup"
                className="group px-8 py-4 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl flex items-center gap-3 transition-all hover:pl-10 shadow-lg shadow-neutral-200"
              >
                Start Mock Interview
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button className="px-8 py-4 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors flex items-center gap-2 bg-white/50 backdrop-blur-sm">
                <PlayCircle className="w-4 h-4" />
                View Demo
              </button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
            style={{ scale: scaleImg, y: yImg }}
            className="relative z-10 h-[600px] w-full flex items-center justify-center lg:justify-end lg:pl-8 lg:-translate-x-15 perspective-[2000px] grayscale hover:grayscale-0 transition-all duration-100"
          >
            <motion.div
              className="relative w-[350px] sm:w-[450px] h-[500px] transform-style-3d"
              style={{ transformStyle: 'preserve-3d', rotateX, rotateZ }}
            >
              <div
                className="absolute inset-0 bg-white/80 backdrop-blur-xl rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-neutral-200"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div
                  className="absolute top-8 left-8 right-8 bottom-32 bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden flex flex-col"
                  style={{ transform: 'translateZ(40px)' }}
                >
                  <div className="h-10 border-b border-neutral-100 flex items-center px-4 gap-2 bg-neutral-50/50">
                    <div className="w-2.5 h-2.5 rounded-full bg-neutral-300" />
                    <div className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
                  </div>

                  <div className="p-6 space-y-6 flex-1 bg-[radial-gradient(#e5e5e5_1px,transparent_1px)] [background-size:16px_16px]">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded bg-neutral-900 flex items-center justify-center text-white shrink-0 shadow-lg shadow-neutral-200">
                        <Bot size={16} />
                      </div>
                      <div className="bg-white border border-neutral-200 p-4 rounded-lg rounded-tl-none shadow-sm text-xs font-mono leading-relaxed text-neutral-600 max-w-[80%]">
                        Walk me through how you would optimize a slow API endpoint.
                      </div>
                    </div>

                    <div className="flex gap-4 flex-row-reverse">
                      <div className="w-8 h-8 rounded bg-neutral-200 shrink-0" />
                      <div className="bg-neutral-900 text-neutral-300 p-4 rounded-lg rounded-tr-none shadow-sm text-xs font-mono leading-relaxed max-w-[80%]">
                        I would start by profiling, then add caching and optimize database
                        queries...
                      </div>
                    </div>
                  </div>
                </div>

                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
                  className="absolute -right-16 top-32 bg-white/90 p-5 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] border border-neutral-100 w-52 z-20 backdrop-blur-xl"
                  style={{ transform: 'translateZ(80px)' }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-neutral-100 rounded-lg text-neutral-800">
                      <CheckCircle size={18} />
                    </div>
                    <span className="text-2xl font-bold tracking-tighter text-neutral-900">98%</span>
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-2">
                    Response Score
                  </div>
                  <div className="h-1 w-full bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-neutral-900 w-[98%]" />
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 15, 0] }}
                  transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut', delay: 1 }}
                  className="absolute left-2 sm:left-0 lg:-left-6 bottom-48 bg-neutral-900 p-5 rounded-xl shadow-2xl border border-neutral-800 w-52 z-20 text-white"
                  style={{ transform: 'translateZ(60px)' }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Mic2 size={16} className="text-neutral-400" />
                    <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">
                      Speech Clarity
                    </span>
                  </div>
                  <div className="flex items-end gap-1 h-8">
                    {[40, 70, 100, 50, 80, 40].map((h, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [h / 2, h, h / 2] }}
                        transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
                        className="w-1.5 bg-white rounded-full"
                        style={{ height: h + '%' }}
                      />
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut', delay: 0.5 }}
                  className="absolute left-6 right-6 bottom-10 bg-white/90 p-4 rounded-xl shadow-xl border border-neutral-100 z-20 backdrop-blur-md"
                  style={{ transform: 'translateZ(50px)' }}
                >
                  <div className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-3">
                    Live Chat
                  </div>
                  <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3 text-xs text-neutral-600 leading-relaxed">
                    I&#39;m ready for the next question.
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-neutral-500">
                      <Mic className="w-4 h-4 hover:text-neutral-900 transition-colors cursor-pointer" />
                      <Camera className="w-4 h-4 hover:text-neutral-900 transition-colors cursor-pointer" />
                    </div>
                    <div className="text-[10px] text-neutral-400">00:42</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="pt-16 pb-24 bg-white border-t border-neutral-100 relative z-20">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14 lg:mb-16">
            <span className="inline-flex items-center gap-3 text-sm font-mono text-neutral-400 mb-12 uppercase tracking-widest font-bold">
              <span className="w-8 h-px bg-neutral-200" />
              Capabilities
              <span className="w-8 h-px bg-neutral-200" />
            </span>
            <h2 className="text-4xl md:text-7xl font-bold tracking-tighter leading-[0.88] text-neutral-900">
              BUILT TO <br /> IMPROVE RESULTS.
            </h2>
          </div>

          <div
            className="grid grid-cols-1 gap-6"
            onMouseLeave={() => setHoveredCardIndex(null)}
          >
            <ExpandableFeatureCard
              index={0}
              hoveredIndex={hoveredCardIndex}
              onHover={() => setHoveredCardIndex(0)}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-6 h-full">
                <motion.div layout className="w-14 h-14 bg-neutral-900 text-white rounded-none flex items-center justify-center shrink-0">
                  <Code2 className="w-6 h-6" />
                </motion.div>
                <motion.div layout className="flex-1">
                  <motion.h3 layout className="text-3xl md:text-4xl font-bold tracking-tight">
                    Role-Specific Practice
                  </motion.h3>

                  {hoveredCardIndex === 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="overflow-hidden"
                    >
                      <p className="text-base md:text-lg text-neutral-600 leading-relaxed max-w-2xl mt-3">
                        A focused question bank tailored to your target role, stack, and selected difficulty.
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </ExpandableFeatureCard>

            <ExpandableFeatureCard
              index={1}
              hoveredIndex={hoveredCardIndex}
              onHover={() => setHoveredCardIndex(1)}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-6 h-full">
                <motion.div layout className="w-14 h-14 bg-neutral-900 text-white rounded-none flex items-center justify-center shrink-0">
                  <Camera className="w-6 h-6" />
                </motion.div>
                <motion.div layout className="flex-1">
                  <motion.h3 layout className="text-3xl md:text-4xl font-bold tracking-tight">
                    Facial Emotion Detection
                  </motion.h3>

                  {hoveredCardIndex === 1 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="overflow-hidden"
                    >
                      <p className="text-base md:text-lg text-neutral-600 leading-relaxed">
                        Detect confidence, hesitation, and engagement cues during your answers so you can refine your delivery.
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </ExpandableFeatureCard>

            <ExpandableFeatureCard
              index={2}
              hoveredIndex={hoveredCardIndex}
              onHover={() => setHoveredCardIndex(2)}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-6 h-full">
                <motion.div layout className="w-14 h-14 bg-neutral-900 text-white rounded-none flex items-center justify-center shrink-0">
                  <Activity className="w-6 h-6" />
                </motion.div>
                <motion.div layout className="flex-1">
                  <motion.h3 layout className="text-3xl md:text-4xl font-bold tracking-tight">
                    Instant Feedback
                  </motion.h3>

                  {hoveredCardIndex === 2 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-4">
                        <div className="relative w-16 h-16 shrink-0">
                          <svg className="w-full h-full -rotate-90">
                            <circle
                              cx="32" cy="32" r="28"
                              stroke="currentColor" strokeWidth="6" fill="transparent"
                              className="text-neutral-200"
                            />
                            <motion.circle
                              cx="32" cy="32" r="28"
                              stroke="currentColor" strokeWidth="6" fill="transparent"
                              strokeDasharray="176"
                              initial={{ strokeDashoffset: 176 }}
                              animate={{ strokeDashoffset: 36 }}
                              transition={{ duration: 1.3, delay: 0.1 }}
                              className="text-neutral-900"
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-neutral-900">
                            80%
                          </div>
                        </div>
                        <p className="text-base md:text-lg text-neutral-600 leading-relaxed">
                          Get live scoring signals and response-quality insights instantly.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </ExpandableFeatureCard>

            <ExpandableFeatureCard
              index={3}
              hoveredIndex={hoveredCardIndex}
              onHover={() => setHoveredCardIndex(3)}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-6 h-full">
                <motion.div layout className="w-14 h-14 bg-neutral-900 text-white rounded-none flex items-center justify-center shrink-0 relative z-10">
                  <LineChart className="w-6 h-6" />
                </motion.div>
                <motion.div layout className="flex-1 relative z-10">
                  <motion.h3 layout className="text-3xl md:text-4xl font-bold tracking-tight">
                    Final AI Review
                  </motion.h3>

                  {hoveredCardIndex === 3 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="overflow-hidden"
                    >
                      <p className="text-base md:text-lg text-neutral-600 leading-relaxed max-w-2xl mt-3 mb-5">
                        Receive a complete performance summary with key strengths, weak spots,
                        and next steps.
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              </div>

              {hoveredCardIndex === 3 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute -right-12 -bottom-12 w-40 h-40 border-[24px] border-neutral-100/50 rounded-full pointer-events-none"
                />
              )}
            </ExpandableFeatureCard>
          </div>
        </div>
      </section>

      {/* TECH STACK SECTION */}
      <TechStackSection />

      <Footer />
    </div>
  );
}