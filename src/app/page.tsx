"use client";

import Link from 'next/link';
import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Bot, CheckCircle, Mic2, PlayCircle, ArrowRight, 
  Mic, Camera, FileText, Activity, Code2, LineChart 
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// ==========================================
// EXPANDABLE SPOTLIGHT CARD
// ==========================================
function ExpandableFeatureCard({ 
  children, 
  className = '', 
  index, 
  hoveredIndex, 
  onHover 
}: { 
  children: React.ReactNode, 
  className?: string,
  index: number,
  hoveredIndex: number | null,
  onHover: () => void
}) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [spotlightOpacity, setSpotlightOpacity] = useState(0);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  };

  // Determine state based on which card is hovered
  const isHovered = hoveredIndex === index;
  const isOthersHovered = hoveredIndex !== null && hoveredIndex !== index;

  return (
    <motion.div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => {
        setSpotlightOpacity(1);
        onHover();
      }}
      onMouseLeave={() => setSpotlightOpacity(0)}
      animate={{
        scale: isHovered ? 1.08 : isOthersHovered ? 0.95 : 1,
        filter: isOthersHovered ? 'blur(4px)' : 'blur(0px)',
        opacity: isOthersHovered ? 0.5 : 1,
        zIndex: isHovered ? 50 : 1,
      }}
      transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
      className={`relative overflow-hidden rounded-3xl border border-neutral-200 bg-white p-8 transition-colors hover:bg-neutral-50 ${className} ${
        isHovered ? 'shadow-[0_30px_80px_-15px_rgba(0,0,0,0.15)] border-neutral-300' : 'shadow-sm'
      }`}
    >
      {/* Mouse Tracking Spotlight */}
      <div
        className="pointer-events-none absolute -inset-px transition duration-300"
        style={{
          opacity: spotlightOpacity,
          background: `radial-gradient(500px circle at ${position.x}px ${position.y}px, rgba(0,0,0,.04), transparent 45%)`
        }}
      />
      
      {/* Card Content */}
      <div className="relative z-10 h-full flex flex-col">
        {children}
      </div>
    </motion.div>
  );
}

// ==========================================
// MAIN HOME PAGE
// ==========================================
export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });

  const yText = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacityText = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scaleImg = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const yImg = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [60, 0]);
  const rotateZ = useTransform(scrollYProgress, [0, 1], [-45, 0]);

  // State to track which feature card is currently being hovered
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);

  // Animation variants for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white">
      {/* Site Header */}
      <Header />

      {/* HERO SECTION */}
      <section ref={heroRef} className="relative min-h-[88vh] flex items-center pt-28 pb-10 overflow-hidden border-b border-neutral-100">
        {/* Background Grid */}
        <div
          className="absolute inset-0 z-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          {/* Hero Text */}
          <motion.div 
            style={{ y: yText, opacity: opacityText }} 
            className="max-w-2xl"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <motion.h1 variants={itemVariants} className="mt-8 text-7xl lg:text-9xl font-bold tracking-tighter leading-[0.85] mb-8">
              ACE <br />
              YOUR <span className="text-neutral-400 font-light italic">INTERVIEW.</span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-xl text-neutral-600 leading-relaxed max-w-md mb-10 font-light">
              Train with realistic AI interviewers, get instant feedback, and improve your answers before the real interview.
            </motion.p>

            <motion.div variants={itemVariants} className="flex gap-4">
              <Link href="/interview-setup" className="group px-8 py-4 bg-neutral-900 text-white rounded-xl flex items-center gap-3 transition-all hover:pl-10">
                Start Mock Interview
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button className="px-8 py-4 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors flex items-center gap-2">
                <PlayCircle className="w-4 h-4" />
                View Demo
              </button>
            </motion.div>
          </motion.div>

          {/* Isometric Dashboard (Parallax) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            style={{ scale: scaleImg, y: yImg }}
            className="relative h-[600px] w-full flex items-center justify-center perspective-[2000px] grayscale hover:grayscale-0 transition-all duration-700"
          >
            <motion.div
              className="relative w-[350px] sm:w-[450px] h-[500px] transform-style-3d"
              style={{ transformStyle: 'preserve-3d', rotateX, rotateZ }}
            >
              <div
                className="absolute inset-0 bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-neutral-200"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Main Interface Window */}
                <div
                  className="absolute top-8 left-8 right-8 bottom-32 bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden flex flex-col"
                  style={{ transform: 'translateZ(40px)' }}
                >
                  <div className="h-10 border-b border-neutral-100 flex items-center px-4 gap-2 bg-neutral-50/50">
                    <div className="w-2.5 h-2.5 rounded-full bg-neutral-300"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-neutral-200"></div>
                  </div>

                  <div className="p-6 space-y-6 flex-1 bg-[radial-gradient(#e5e5e5_1px,transparent_1px)] [background-size:16px_16px]">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded bg-neutral-900 flex items-center justify-center text-white shrink-0">
                        <Bot size={16} />
                      </div>
                      <div className="bg-white border border-neutral-200 p-4 rounded-lg rounded-tl-none shadow-sm text-xs font-mono leading-relaxed text-neutral-600 max-w-[80%]">
                        Walk me through how you would optimize a slow API endpoint.
                      </div>
                    </div>

                    <div className="flex gap-4 flex-row-reverse">
                      <div className="w-8 h-8 rounded bg-neutral-200 shrink-0"></div>
                      <div className="bg-neutral-900 text-neutral-300 p-4 rounded-lg rounded-tr-none shadow-sm text-xs font-mono leading-relaxed max-w-[80%]">
                        I would start by profiling, then add caching and optimize database queries...
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Metric: Confidence */}
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
                  className="absolute -right-16 top-32 bg-white p-5 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] border border-neutral-100 w-52 z-20 backdrop-blur-xl"
                  style={{ transform: 'translateZ(80px)' }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-green-50 rounded-lg text-green-600"><CheckCircle size={18} /></div>
                    <span className="text-2xl font-bold tracking-tighter">98%</span>
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-2">Response Score</div>
                  <div className="h-1 w-full bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-neutral-900 w-[98%]"></div>
                  </div>
                </motion.div>

                {/* Floating Metric: Audio Input */}
                <motion.div
                  animate={{ y: [0, 15, 0] }}
                  transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut', delay: 1 }}
                  className="absolute -left-12 bottom-48 bg-neutral-900 p-5 rounded-xl shadow-2xl border border-neutral-800 w-52 z-20 text-white"
                  style={{ transform: 'translateZ(60px)' }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Mic2 size={16} className="text-neutral-400" />
                    <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">Speech Clarity</span>
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
                  className="absolute left-6 right-6 bottom-10 bg-white p-4 rounded-xl shadow-xl border border-neutral-100 z-20"
                  style={{ transform: 'translateZ(50px)' }}
                >
                  <div className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-3">Live Chat</div>
                  <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3 text-xs text-neutral-600 leading-relaxed">
                    I'm ready for the next question.
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-neutral-500">
                      <Mic className="w-4 h-4" />
                      <Camera className="w-4 h-4" />
                    </div>
                    <div className="text-[10px] text-neutral-400">00:42</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES SECTION (Blur & Expand Grid) */}
      <section className="pt-16 pb-24 bg-white border-t border-neutral-100 relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-[0.9] text-neutral-900">
              BUILT TO <br /> IMPROVE RESULTS.
            </h2>
          </div>
          
          {/* Grid Container - Reset hover state when mouse leaves the entire grid */}
          <div 
            className="grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-[250px] md:auto-rows-[280px]"
            onMouseLeave={() => setHoveredCardIndex(null)}
          >
            
            {/* Card 1 */}
            <ExpandableFeatureCard 
              index={0} 
              hoveredIndex={hoveredCardIndex} 
              onHover={() => setHoveredCardIndex(0)} 
              className="md:col-span-2"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-neutral-900 text-white rounded-xl flex items-center justify-center">
                  <Code2 className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-auto">
                <h3 className="text-2xl font-bold tracking-tight mb-2">Role-Specific Practice</h3>
                <p className="text-sm text-neutral-600 leading-relaxed max-w-md">
                  Adaptive question sets based on your target role, stack, and selected difficulty.
                </p>
              </div>
            </ExpandableFeatureCard>

            {/* Card 2 */}
            <ExpandableFeatureCard 
              index={1} 
              hoveredIndex={hoveredCardIndex} 
              onHover={() => setHoveredCardIndex(1)}
            >
              <div className="w-12 h-12 bg-neutral-900 text-white rounded-xl flex items-center justify-center mb-6">
                <Mic2 className="w-5 h-5" />
              </div>
              <div className="flex items-end gap-1 mb-8 h-10 opacity-70">
                {[30, 60, 100, 40, 80, 20, 50, 90, 40].map((h, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [`${h}%`, `${h / 2}%`, `${h}%`] }}
                    transition={{ repeat: Infinity, duration: 1.4, delay: i * 0.08 }}
                    className="flex-1 bg-neutral-300 rounded-t-sm"
                  />
                ))}
              </div>
              <div className="mt-auto">
                <h3 className="text-xl font-bold tracking-tight mb-2">Vocal Analysis</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Analyze pacing, filler words, and clarity while you answer.
                </p>
              </div>
            </ExpandableFeatureCard>

            {/* Card 3 */}
            <ExpandableFeatureCard 
              index={2} 
              hoveredIndex={hoveredCardIndex} 
              onHover={() => setHoveredCardIndex(2)}
            >
              <div className="w-12 h-12 bg-neutral-900 text-white rounded-xl flex items-center justify-center mb-6">
                <Activity className="w-5 h-5" />
              </div>
              <div className="relative w-16 h-16 mb-6">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-neutral-200" />
                  <motion.circle
                    cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent"
                    strokeDasharray="176"
                    initial={{ strokeDashoffset: 176 }}
                    whileInView={{ strokeDashoffset: 36 }}
                    transition={{ duration: 1.3 }}
                    className="text-neutral-900"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-neutral-900">80%</div>
              </div>
              <div className="mt-auto">
                <h3 className="text-xl font-bold tracking-tight mb-2">Instant Feedback</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Get live scoring signals and response-quality insights instantly.
                </p>
              </div>
            </ExpandableFeatureCard>

            {/* Card 4 */}
            <ExpandableFeatureCard 
              index={3} 
              hoveredIndex={hoveredCardIndex} 
              onHover={() => setHoveredCardIndex(3)} 
              className="md:col-span-2"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-neutral-900 text-white rounded-xl flex items-center justify-center">
                  <LineChart className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-neutral-100 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-500">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-auto">
                <h3 className="text-2xl font-bold tracking-tight mb-2">Final AI Review</h3>
                <p className="text-sm text-neutral-600 leading-relaxed max-w-md">
                  Receive a complete performance summary with key strengths, weak spots, and next steps.
                </p>
              </div>
              <div className="absolute -right-12 -bottom-12 w-40 h-40 border-[24px] border-neutral-200 rounded-full pointer-events-none" />
            </ExpandableFeatureCard>

          </div>
        </div>
      </section>

      {/* Site Footer */}
      <Footer />
    </div>
  );
}