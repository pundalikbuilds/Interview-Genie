"use client";

import React from "react";
import { motion, MotionValue } from "framer-motion";
import { Bot, CheckCircle, Mic2, Mic, Camera } from "lucide-react";

interface HeroInteractiveMockupProps {
  scaleImg: MotionValue<number>;
  yImg: MotionValue<number>;
  rotateX: MotionValue<number>;
  rotateZ: MotionValue<number>;
}

export function HeroInteractiveMockup({
  scaleImg,
  yImg,
  rotateX,
  rotateZ,
}: HeroInteractiveMockupProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
      style={{ scale: scaleImg, y: yImg }}
      className="relative z-10 h-[600px] w-full flex items-center justify-center lg:justify-end lg:pl-8 lg:-translate-x-15 perspective-[2000px] grayscale hover:grayscale-0 transition-all duration-100"
    >
      <motion.div
        className="relative w-[350px] sm:w-[450px] h-[500px] transform-style-3d"
        style={{ transformStyle: "preserve-3d", rotateX, rotateZ }}
      >
        <div
          className="absolute inset-0 bg-white/80 backdrop-blur-xl rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-neutral-200"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div
            className="absolute top-8 left-8 right-8 bottom-32 bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden flex flex-col"
            style={{ transform: "translateZ(40px)" }}
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
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="absolute -right-16 top-32 bg-white/90 p-5 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] border border-neutral-100 w-52 z-20 backdrop-blur-xl"
            style={{ transform: "translateZ(80px)" }}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-neutral-100 rounded-lg text-neutral-800">
                <CheckCircle size={18} />
              </div>
              <span className="text-2xl font-bold tracking-tighter text-neutral-900">
                98%
              </span>
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
            transition={{
              repeat: Infinity,
              duration: 6,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute left-2 sm:left-0 lg:-left-6 bottom-48 bg-neutral-900 p-5 rounded-xl shadow-2xl border border-neutral-800 w-52 z-20 text-white"
            style={{ transform: "translateZ(60px)" }}
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
                  transition={{
                    repeat: Infinity,
                    duration: 1,
                    delay: i * 0.1,
                  }}
                  className="w-1.5 bg-white rounded-full"
                  style={{ height: h + "%" }}
                />
              ))}
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{
              repeat: Infinity,
              duration: 6,
              ease: "easeInOut",
              delay: 0.5,
            }}
            className="absolute left-6 right-6 bottom-10 bg-white/90 p-4 rounded-xl shadow-xl border border-neutral-100 z-20 backdrop-blur-md"
            style={{ transform: "translateZ(50px)" }}
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
  );
}