"use client";

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface ExpandableFeatureCardProps {
  children: React.ReactNode;
  className?: string;
  index: number;
  hoveredIndex: number | null;
  onHover: () => void;
}

export function ExpandableFeatureCard({
  children,
  className = '',
  index,
  hoveredIndex,
  onHover,
}: ExpandableFeatureCardProps) {
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