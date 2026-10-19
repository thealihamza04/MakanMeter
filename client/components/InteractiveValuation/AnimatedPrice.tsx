'use client';

import React, { useEffect, useState, useRef } from 'react';

interface AnimatedPriceProps {
  value: number; // In Crore (e.g. 4.54)
  prefix?: string;
  suffix?: string;
}

export function AnimatedPrice({
  value,
  prefix = '₨ ',
  suffix = ' Crore',
}: AnimatedPriceProps) {
  const [displayValue, setDisplayValue] = useState<number>(value);
  const [isUpdating, setIsUpdating] = useState(false);
  const prevValueRef = useRef<number>(value);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const startValue = prevValueRef.current;
    const endValue = value;

    if (isNaN(endValue) || startValue === endValue) {
      setDisplayValue(endValue || 0);
      return;
    }

    setIsUpdating(true);
    const duration = 450; // Smooth 450ms rolling animation
    const startTime = performance.now();

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Smooth easeOutCubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (endValue - startValue) * ease;

      setDisplayValue(current);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        prevValueRef.current = endValue;
        setDisplayValue(endValue);
        setTimeout(() => setIsUpdating(false), 200);
      }
    };

    animFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [value]);

  return (
    <span
      className={`inline-block transition-all duration-300 ${
        isUpdating
          ? 'text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.35)] scale-[1.02]'
          : 'text-primary-text'
      }`}
    >
      {prefix}
      {displayValue.toFixed(2)}
      {suffix}
    </span>
  );
}
