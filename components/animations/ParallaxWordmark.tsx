"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface ParallaxWordmarkProps {
  text: string;
  speed?: number; // Parallax speed multiplier
  className?: string;
}

export default function ParallaxWordmark({
  text,
  speed = 0.3,
  className = "",
}: ParallaxWordmarkProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check prefers-reduced-motion or mobile
    if (
      typeof window === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.innerWidth < 768
    ) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const el = textRef.current;
    const triggerEl = containerRef.current;

    if (!el || !triggerEl) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: -80 * speed },
        {
          y: 80 * speed,
          ease: "none",
          scrollTrigger: {
            trigger: triggerEl,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        }
      );
    }, triggerEl);

    return () => ctx.revert();
  }, [speed]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none flex items-center justify-center z-0 ${className}`}
    >
      <div
        ref={textRef}
        className="font-display font-black text-[22vw] uppercase tracking-tighter text-black/[0.03] whitespace-nowrap leading-none will-change-transform"
      >
        {text}
      </div>
    </div>
  );
}
