"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import MagneticButton from "@/components/animations/MagneticButton";

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Scroll-linked continuous depth & parallax
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 25 });

  // Background moves slower than foreground and scales subtly from 1.05 -> 1
  const bgY = useTransform(smoothProgress, [0, 1], ["0%", "20%"]);
  const bgScale = useTransform(smoothProgress, [0, 1], [1.05, 1.0]);

  // Foreground content moves upward gradually on scroll
  const contentY = useTransform(smoothProgress, [0, 1], [0, -60]);
  const contentOpacity = useTransform(smoothProgress, [0, 0.85], [1, 0.3]);

  const headlineLetters = "MAHROOF".split("");

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-[85vh] lg:min-h-[90vh] flex flex-col justify-between border-b border-white/10 overflow-hidden bg-black px-4 sm:px-6 md:px-12 pt-6 sm:pt-8 pb-8 sm:pb-10"
    >
      {/* Background Visual (Video with Image Fallback) with continuous scroll-linked parallax */}
      <motion.div
        style={{
          y: shouldReduceMotion ? 0 : bgY,
          scale: shouldReduceMotion ? 1 : bgScale,
        }}
        className="absolute inset-[-5%] w-[110%] h-[110%] z-0 opacity-40 will-change-transform"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          onCanPlay={() => setVideoLoaded(true)}
          className="w-full h-full object-cover filter brightness-[0.7] contrast-[1.15]"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
        {/* Poster Image fallback */}
        {!videoLoaded && (
          <Image
            src="/images/hero-bg.jpg"
            alt="Mohammed Mahroof Video Editor Studio"
            fill
            className="object-cover filter brightness-[0.6]"
            priority
          />
        )}
        {/* Cinematic Gradient Overlays matching dark reference */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/70 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80 pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#FF3B1F]/15 via-transparent to-black/90 pointer-events-none"></div>
      </motion.div>

      {/* Hero Content Layer - with scroll-linked upward translation and replayable whileInView */}
      <motion.div
        style={{
          y: shouldReduceMotion ? 0 : contentY,
          opacity: shouldReduceMotion ? 1 : contentOpacity,
        }}
        className="relative z-10 w-full flex flex-col justify-between flex-grow"
      >
        {/* Editorial Top Section Marker */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between border-b border-white/10 pb-3 sm:pb-4 mb-4 sm:mb-6"
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xs font-mono tracking-[0.25em] text-[#FF3B1F] uppercase font-bold">
              SHOWREEL
            </span>
            <span className="hidden sm:inline text-white/20 font-mono text-xs">•</span>
            <span className="hidden sm:inline text-xs font-mono tracking-widest text-[#888888] uppercase">
              VIDEO EDITOR & VISUAL STORYTELLER
            </span>
          </div>
          <div className="text-[10px] sm:text-[11px] font-mono tracking-[0.2em] text-[#888888] uppercase">
            CUT • COLOR • STORY
          </div>
        </motion.div>

        {/* Top Header Row in Hero */}
        <div className="w-full flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 sm:gap-6">
          {/* Huge Main Title - Character split stagger with replay on return */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="w-full lg:w-auto overflow-hidden"
          >
            <h1 className="font-display text-[16vw] sm:text-[18vw] lg:text-[11.5rem] leading-[0.85] tracking-tight text-[#FF3B1F] select-none font-bold uppercase drop-shadow-[0_10px_30px_rgba(255,59,31,0.25)] flex flex-wrap">
              {headlineLetters.map((char, idx) => (
                <motion.span
                  key={idx}
                  variants={letterVariants}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}
            </h1>
          </motion.div>

          {/* Top Right Tagline - Clipping mask wipe reveal */}
          <motion.div
            initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0 }}
            whileInView={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-xs text-left sm:text-right self-start sm:self-end lg:self-auto"
          >
            <p className="text-base sm:text-xl md:text-2xl font-light text-[#F5F5F5] tracking-tight leading-tight">
              Turning Footage{" "}
              <span className="font-semibold text-white">Into Stories.</span>
            </p>
          </motion.div>
        </div>

        {/* Middle Empty Spacing */}
        <div className="my-6 sm:my-10 lg:my-16"></div>

        {/* Hero Bottom Row */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start sm:items-end"
        >
          {/* Bottom Left Call To Action & Bio */}
          <div className="lg:col-span-8 flex flex-col items-start gap-4 sm:gap-5">
            {/* Pill CTA Button with Magnetic Spring */}
            <MagneticButton radius={25} strength={0.35}>
              <Link
                href="/work"
                className="inline-flex items-center gap-3 px-6 sm:px-7 py-3 rounded-full border border-white/20 bg-black/70 hover:bg-[#FF3B1F] hover:border-[#FF3B1F] text-xs font-mono tracking-widest text-[#F5F5F5] hover:text-black transition-all duration-300 group backdrop-blur-md shadow-lg shadow-black/50"
              >
                <span>VIEW MY WORK</span>
                <ArrowRight className="w-4 h-4 text-[#FF3B1F] group-hover:text-black transition-colors" />
              </Link>
            </MagneticButton>

            {/* Editorial Subhead Bio */}
            <div className="max-w-xl space-y-1">
              <h2 className="text-xs sm:text-sm md:text-base font-bold tracking-wider text-[#F5F5F5] uppercase font-display">
                SENIOR VIDEO EDITOR & MEDIA PRODUCTION SPECIALIST
              </h2>
              <p className="text-xs sm:text-sm text-[#888888] leading-relaxed">
                Transforming raw footage into{" "}
                <span className="text-[#F5F5F5] font-medium">polished</span>, engaging and{" "}
                <span className="text-[#F5F5F5] font-medium">story-driven</span> visual content.
              </p>
            </div>
          </div>

          {/* Bottom Right Experience Badge */}
          <div className="lg:col-span-4 flex flex-col lg:items-end justify-end">
            <div className="inline-flex flex-col items-start lg:items-end gap-1 p-3.5 sm:p-4 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm">
              <span className="text-[11px] sm:text-xs font-mono tracking-[0.25em] text-[#FF3B1F] font-semibold uppercase">
                04+ YEARS EXPERIENCE
              </span>
              <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-[#888888] uppercase">
                2018 — PRESENT
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
