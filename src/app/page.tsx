"use client";

import Link from 'next/link';
import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import { PlayCircle, ArrowRight, Camera, Activity, Code2, LineChart } from 'lucide-react';
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';
import { hasAccessToken } from "@/services/auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Import new modular landing page components
import { OutlineText } from '@/components/landing-page/OutlineText';
import { AiNeuralBackground } from '@/components/landing-page/AiNeuralBackground';
import { ExpandableFeatureCard } from '@/components/landing-page/ExpandableFeatureCard';
import { TechStackSection } from '@/components/landing-page/TechStackSection';
import { HeroInteractiveMockup } from '@/components/landing-page/HeroInteractiveMockup';

export default function Home() {
  const heroRef = useRef(null);
  const router = useRouter();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // PARALLAX TEXT (Y movement applied to parent)
  const yText = useTransform(scrollYProgress, [0, 1], [0, 100]);
  
  // BUTTON ONLY TRANSFORMS (Waits until 60% scroll before fading and fully blurs/hides by 90%)
  const buttonOpacity = useTransform(scrollYProgress, [0, 0.6, 0.9], [1, 1, 0]);
  const buttonFilter  = useTransform(scrollYProgress, [0, 0.6, 0.9], ['blur(0px)', 'blur(0px)', 'blur(12px)']);
  
  // SCROLL ANIMATIONS FOR THE HERO MOCKUP
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

  useEffect(() => {
  if (hasAccessToken()) {
    router.replace("/dashboard");
  }
}, [router]);

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

          {/* PARENT TEXT WRAPPER */}
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

            {/* BUTTON WRAPPER */}
            <motion.div 
              variants={itemVariants} 
              style={{ opacity: buttonOpacity, filter: buttonFilter }} 
              className="flex gap-4"
            >
              <Link
                href="/signup"
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

          {/* Extracted Hero Mockup Component */}
          <HeroInteractiveMockup 
            scaleImg={scaleImg} 
            yImg={yImg} 
            rotateX={rotateX} 
            rotateZ={rotateZ} 
          />

        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="pt-16 pb-12 lg:pb-16 bg-white border-t border-neutral-100 relative z-20">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14 lg:mb-16">
            <span className="inline-flex items-center gap-3 text-sm font-mono text-neutral-400 mb-12 uppercase tracking-widest font-bold">
              <span className="w-8 h-px bg-neutral-200" />
              Capabilities
              <span className="w-8 h-px bg-neutral-200" />
            </span>
            <h2 className="text-4xl md:text-7xl font-bold tracking-tighter leading-[0.88] text-neutral-900">
              BUILT TO <br />
              <OutlineText strokeWidth={1.7} scale={1.13}>IMPROVE</OutlineText>{' '}
              RESULTS.
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