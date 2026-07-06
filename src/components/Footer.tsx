"use client";

import Link from "next/link";
import { motion } from "framer-motion";

// ==========================================
// ANIMATED WAVE COMPONENT
// ==========================================
function AnimatedWave() {
  return (
    <div className="relative h-full w-full">
      {/* First Wave (Moves Left) */}
      <motion.svg
        className="absolute top-0 left-0 w-[200%] h-full"
        viewBox="0 0 2000 200"
        preserveAspectRatio="none"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
      >
        <path
          fill="currentColor"
          className="text-slate-300/80"
          d="M 0,100 C 250,200 250,0 500,100 C 750,200 750,0 1000,100 C 1250,200 1250,0 1500,100 C 1750,200 1750,0 2000,100 L 2000,0 L 0,0 Z"
        />
      </motion.svg>
      
      {/* Second Wave (Moves Right) */}
      <motion.svg
        className="absolute top-0 left-0 w-[200%] h-full"
        viewBox="0 0 2000 200"
        preserveAspectRatio="none"
        animate={{ x: ["-50%", "0%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 35 }}
      >
        <path
          fill="currentColor"
          className="text-slate-400/50"
          d="M 0,100 C 250,0 250,200 500,100 C 750,0 750,200 1000,100 C 1250,0 1250,200 1500,100 C 1750,0 1750,200 2000,100 L 2000,0 L 0,0 Z"
        />
      </motion.svg>
    </div>
  );
}

// ==========================================
// MAIN FOOTER COMPONENT
// ==========================================
export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-slate-200 bg-white text-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,0,0,0.03),_transparent_45%)]" />
      
      {/* Animated wave background */}
      <div className="absolute inset-0 h-64 opacity-20 pointer-events-none overflow-hidden">
        <AnimatedWave />
      </div>

      <div className="relative mx-auto max-w-screen-2xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.35fr_0.85fr] md:items-start">
          <div>
            <Link href="/" className="text-xl font-bold tracking-tight text-slate-900">
              Interview-Genie
            </Link>
            <h2 className="mt-4 max-w-xl text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Build interview confidence with focused practice, live feedback, and clear results.
            </h2>
          </div>

          <div className="flex flex-col gap-6 md:items-end md:text-right">
            <div>
              <p className="text-sm font-medium text-slate-900">Ready to practice now?</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Jump into the interview setup, choose your role, and start the session.
              </p>
            </div>

            <Link
              href="/interview-setup"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-slate-800"
            >
              Start a practice interview
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-6 border-t border-slate-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            &copy; 2026 Interview-Genie. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}