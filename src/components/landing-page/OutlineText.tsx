"use client";

import React, { useEffect, useRef, useState } from 'react';

interface OutlineTextProps {
  children: string;
  strokeWidth?: number;
  scale?: number;
  className?: string;
}

export function OutlineText({
  children,
  strokeWidth = 1.5,
  scale = 1.3,
  className = '',
}: OutlineTextProps) {
  const textRef = useRef<SVGTextElement>(null);
  const [box, setBox] = useState({ width: 300, height: 100 });

  useEffect(() => {
    if (textRef.current) {
      const bbox = textRef.current.getBBox();
      setBox({ width: bbox.width + strokeWidth * 4, height: bbox.height + strokeWidth * 4 });
    }
  }, [children, strokeWidth]);

  return (
    <svg
      viewBox={`0 0 ${box.width} ${box.height}`}
      className={`inline-block align-baseline ${className}`}
      style={{ height: `${scale}em`, width: (box.width / box.height) * scale + 'em' }}
      preserveAspectRatio="xMinYMid meet"
    >
      <text
        ref={textRef}
        x={strokeWidth * 2}
        y={box.height - strokeWidth * 2}
        fontSize="90"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="700"
        fill="none"
        stroke="#171717"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      >
        {children}
      </text>
    </svg>
  );
}