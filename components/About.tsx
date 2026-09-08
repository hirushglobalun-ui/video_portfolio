"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";
import Image from "next/image";
import CountUpStat from "@/components/animations/CountUpStat";

export default function About() {
  const containerRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const stats = [
    { number: "04+", label: "YEARS EXPERIENCE" },
    { number: "2018", label: "STARTED EDITING" },
    { number: "2024", label: "SENIOR EDITOR" },
  ];

  // Scroll-linked continuous depth between text column and portrait image
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 25 });

  // Text column moves at a slower vertical rate
  const textY = useTransform(smoothProgress, [0, 1], [30, -30]);

  // Image portrait moves at a slightly faster/different vertical rate to create multiplane depth
  const imgY = useTransform(smoothProgress, [0, 1], [-40, 40]);

  return (
    <section
      id="about"
      ref={containerRef}
      className="w-full border-b border-white/10 py-10 sm:py-14 md:py-16 px-4 sm:px-6 md:px-12 bg-black relative overflow-hidden scroll-mt-24 sm:scroll-mt-28"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-14 items-center relative z-10">
        {/* LEFT COLUMN - TEXT CONTENT with continuous scroll depth & replaying entrance */}
        <motion.div
          style={{ y: shouldReduceMotion ? 0 : textY }}
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 45 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-7 flex flex-col gap-6 sm:gap-7 will-change-transform justify-center"
        >
          <div className="space-y-3 sm:space-y-4">
            {/* Orange Label with Pulse Dot */}
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF3B1F]"></span>
              <span className="text-xs font-mono tracking-[0.25em] text-[#FF3B1F] uppercase font-bold">
                ABOUT
              </span>
            </div>

            {/* Large Editorial Title */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-bold uppercase tracking-tight text-[#F5F5F5] leading-[1.12] font-display">
              I DON&apos;T JUST EDIT VIDEOS.{" "}
              <span className="text-[#888888]">I BUILD VISUAL STORIES</span> THAT
              PEOPLE REMEMBER.
            </h2>

            {/* Exact Professional Summary */}
            <p className="text-xs sm:text-sm md:text-base text-[#888888] leading-relaxed max-w-xl">
              Video Editor and Media Production Specialist with 4+ years of
              experience producing high-quality digital content for brands,
              agencies and premium automotive showrooms. Skilled in advanced
              video editing, color grading, audio design and project management.
              Experienced in leading media teams, handling client communication
              and transforming raw concepts into polished, impactful visuals.
            </p>
          </div>

          {/* Stats Cards Section with CountUp Animation */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-4 pt-4 sm:pt-5 border-t border-white/10">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="p-3 sm:p-4 rounded-xl border border-white/10 bg-[#0a0a0a] flex flex-col justify-between"
              >
                <div className="text-2xl sm:text-3xl md:text-4xl font-mono font-bold text-[#FF3B1F] tracking-tight">
                  <CountUpStat value={stat.number} />
                </div>
                <span className="text-[8px] sm:text-[10px] md:text-xs font-mono tracking-widest text-[#888888] mt-1 sm:mt-2 uppercase">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT COLUMN - PORTRAIT IMAGE with scale 0.94 -> 1 reveal and multiplane scroll depth */}
        <motion.div
          style={{ y: shouldReduceMotion ? 0 : imgY }}
          initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5 relative w-full aspect-[4/5] max-h-[500px] rounded-3xl overflow-hidden border border-white/10 bg-neutral-900 group shadow-2xl will-change-transform justify-self-center"
        >
          <div className="relative w-full h-full overflow-hidden">
            <Image
              src="/images/editor-portrait.jpg"
              alt="Mohammed Mahroof TM — Senior Video Editor"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 35vw"
              className="object-cover object-top filter brightness-90 contrast-110 group-hover:scale-105 transition-transform duration-700 ease-out"
              priority
            />
          </div>

          {/* Cinematic lighting gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none"></div>

          {/* Overlay Corner Badges */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
            <span className="text-[10px] sm:text-xs font-mono tracking-widest text-[#F5F5F5] uppercase bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
              MOHAMMED MAHROOF TM
            </span>
            <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-[#FF3B1F] uppercase bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#FF3B1F]/30">
              MEDIA SPECIALIST
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
