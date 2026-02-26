"use client";

import Link from 'next/link';
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Bot, CheckCircle, Mic2, PlayCircle, ArrowRight, Cpu as Chip, Mic, Camera } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white">
      {/* Site Header */}
      <Header />

      {/* HERO SECTION */}
      <section ref={heroRef} className="relative min-h-[100vh] flex items-center pt-32 pb-20 overflow-hidden border-b border-neutral-100">
        {/* Background Grid */}
        <div
          className="absolute inset-0 z-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          {/* Hero Text */}
          <motion.div style={{ y: yText, opacity: opacityText }} className="max-w-2xl">
            <h1 className="mt-8 text-7xl lg:text-9xl font-bold tracking-tighter leading-[0.85] mb-8">
              ACE <br />
              YOUR <span className="text-neutral-400 font-light italic">INTERVIEW.</span>
            </h1>

            <p className="text-xl text-neutral-600 leading-relaxed max-w-md mb-10 font-light">
              Train with realistic AI interviewers, get instant feedback, and improve your answers before the real interview.
            </p>

            <div className="flex gap-4">
              <Link href="/interview-setup" className="group px-8 py-4 bg-neutral-900 text-white rounded-none flex items-center gap-3 transition-all hover:pl-10">
                Start Mock Interview
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button className="px-8 py-4 border border-neutral-200 hover:bg-neutral-50 transition-colors flex items-center gap-2">
                <PlayCircle className="w-4 h-4" />
                View Demo
              </button>
            </div>
          </motion.div>

          {/* Isometric Dashboard (Parallax) */}
          <motion.div
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

      {/* METHODOLOGY / BENTO GRID */}
      <section className="py-32 bg-white border-t border-neutral-100">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Heading */}
          <div className="mb-20">
            <h2 className="mt-8 text-4xl md:text-6xl font-bold tracking-tighter leading-[0.9] text-neutral-900">
              BUILT TO <br /> IMPROVE RESULTS.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-4 h-auto md:h-[600px]">
            {/* Large Feature Card */}
            <div className="md:col-span-2 md:row-span-2 bg-neutral-100 p-8 lg:p-12 relative group overflow-hidden">
              
              <div className="relative z-10 h-full flex flex-col justify-end">
                <h3 className="text-3xl font-bold tracking-tight mb-4">Role-Specific Practice</h3>
                <p className="text-neutral-600 max-w-md">Personalized, adaptive questions based on job role, performance, and experience level.</p>
              </div>
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 group-hover:scale-105 transition-transform duration-700"></div>
            </div>

            {/* Metric Card */}
            <div className="bg-neutral-900 text-white p-8 relative overflow-hidden group">
              <div className="absolute inset-0 bg-neutral-800 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">Instant Feedback</h3>
                <p className="text-neutral-400 text-sm">Real-time NLP scoring, semantic analysis, and improvement insights after every answer.</p>
              </div>
            </div>

            {/* CTA Card */}
            <div className="bg-neutral-100 p-8 relative group cursor-pointer border border-neutral-200">
              <div className="mt-20">
                <h3 className="text-xl font-bold">Final AI Review</h3>
                <p className="text-sm text-neutral-500 mt-2">Comprehensive performance report with strengths, gaps, and recommendations.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Site Footer */}
      <Footer />
    </div>
  );
}
