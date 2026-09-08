"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface CountUpStatProps {
  value: string; // e.g. "04+", "2018", "2024", "100%"
  duration?: number; // duration in seconds (default 1.5)
  className?: string;
}

export default function CountUpStat({
  value,
  duration = 1.5,
  className = "",
}: CountUpStatProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    if (!isInView) return;

    // Check prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplayValue(value);
      return;
    }

    // Extract numbers, prefixes, suffixes, and padding
    const match = value.match(/^([^\d]*)(\d+)([^\d]*)$/);
    if (!match) {
      setDisplayValue(value);
      return;
    }

    const prefix = match[1];
    const targetNumber = parseInt(match[2], 10);
    const suffix = match[3];
    const isZeroPadded = match[2].startsWith("0") && match[2].length > 1;
    const padLength = match[2].length;

    let startTimestamp: number | null = null;
    const durationMs = duration * 1000;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / durationMs, 1);

      // Ease out cubic: 1 - pow(1 - progress, 3)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.floor(easeOut * targetNumber);

      let formattedNumber = currentVal.toString();
      if (isZeroPadded) {
        formattedNumber = formattedNumber.padStart(padLength, "0");
      }

      setDisplayValue(`${prefix}${formattedNumber}${suffix}`);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };

    requestAnimationFrame(step);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {displayValue}
    </span>
  );
}
