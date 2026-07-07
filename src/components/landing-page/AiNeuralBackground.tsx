"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function AiNeuralBackground() {
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