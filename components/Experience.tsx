"use client";

import { useRef } from "react";
import { Briefcase, Calendar } from "lucide-react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";
import AnimatedSectionHeader from "@/components/animations/AnimatedSectionHeader";

export default function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const roles = [
    {
      period: "2024 — PRESENT",
      title: "SENIOR EDITOR",
      company: "Illuminate Ads & Promotions",
      badge: "CURRENT ROLE",
      responsibilities: [
        "Strategically leading the media team and producing engaging content aligned with company objectives.",
        "Managing content creation workflows, resource allocation, and maintaining brand consistency across campaigns.",
        "Tracking performance metrics and fostering cross-functional team collaboration.",
      ],
    },
    {
      period: "2023 — 2024",
      title: "MEDIA TEAM LEADER",
      company: "DUXBED INNOVATIONS PVT LTD",
      badge: "PRODUCTION LEAD",
      responsibilities: [
        "Directed media team production schedules, workflows, and asset delivery.",
        "Oversaw multi-channel content creation while ensuring strict brand visual consistency.",
        "Collaborated with marketing leads to streamline post-production pipelines.",
      ],
    },
    {
      period: "2018 — PRESENT",
      title: "FREELANCE VIDEO EDITOR",
      company: "Independent Practice & Automotive Media",
      badge: "SOLO PRACTICE",
      responsibilities: [
        "End-to-end media production: Concept → Filming → Editing → Color Grading → Final Delivery.",
        "Specialized in premium car showroom content, event media management, personal branding, and commercial edits.",
        "Direct client communication and project delivery management.",
      ],
    },
  ];

  // Scroll-driven progressive timeline line drawing
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 70%", "end 80%"],
  });

  const rawScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const scaleY = useSpring(rawScaleY, { stiffness: 100, damping: 25 });

  return (
    <section
      id="experience"
      className="w-full border-b border-white/10 py-12 sm:py-20 md:py-28 px-4 sm:px-6 md:px-12 bg-black relative overflow-hidden scroll-mt-24 sm:scroll-mt-28"
    >
      {/* Background glow behind timeline */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF3B1F]/5 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="flex flex-col gap-10 sm:gap-16 relative z-10">
        {/* Animated Section Header */}
        <AnimatedSectionHeader
          label="CAREER JOURNEY"
          title="CAREER TIMELINE"
          subtitle="A proven track record leading media teams, commercial campaigns, and independent video editing."
        />

        {/* Zig-Zag Timeline Container with scrubbed line */}
        <div ref={containerRef} className="relative w-full">
          {/* Static Background Guide Track */}
          <div className="absolute top-0 bottom-0 left-3 sm:left-4 md:left-1/2 -translate-x-1/2 w-[2px] bg-white/10"></div>

          {/* Animated Connecting Draw Line (scaleY synced to scroll with transform-origin: top) */}
          <motion.div
            style={{
              scaleY: shouldReduceMotion ? 1 : scaleY,
              originY: 0,
            }}
            className="absolute top-0 bottom-0 left-3 sm:left-4 md:left-1/2 -translate-x-1/2 w-[2px] bg-gradient-to-b from-[#FF3B1F] via-[#FF3B1F] to-[#FFA337] will-change-transform shadow-[0_0_12px_rgba(255,59,31,0.6)]"
          />

          <div className="flex flex-col gap-8 sm:gap-14 md:gap-20">
            {roles.map((role, idx) => {
              const isEven = idx % 2 === 0;
              const xOffset = isEven ? -50 : 50;

              return (
                <div
                  key={role.company}
                  className={`relative flex flex-col md:flex-row items-center w-full ${
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Content Card Side with alternating entrance and replay */}
                  <motion.div
                    initial={{
                      opacity: 0,
                      x: shouldReduceMotion ? 0 : xOffset,
                      scale: shouldReduceMotion ? 1 : 0.97,
                    }}
                    whileInView={{
                      opacity: 1,
                      x: 0,
                      scale: 1,
                    }}
                    viewport={{ once: false, amount: 0.25 }}
                    transition={{
                      duration: 0.7,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={`w-full pl-7 sm:pl-10 md:pl-0 md:w-[calc(50%-40px)] will-change-transform ${
                      isEven ? "md:mr-auto" : "md:ml-auto"
                    }`}
                  >
                    <div className="group rounded-2xl border border-white/10 hover:border-[#FF3B1F]/50 bg-[#0a0a0a]/90 backdrop-blur-md p-4 sm:p-6 md:p-8 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-[#FF3B1F]/5 text-left">
                      {/* Top Meta Badges Row */}
                      <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
                        {/* Period Pill */}
                        <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-mono font-bold tracking-wider text-[#FF3B1F] bg-[#FF3B1F]/10 border border-[#FF3B1F]/25">
                          <Calendar className="w-3 h-3 text-[#FF3B1F]" />
                          {role.period}
                        </span>

                        {/* Status Badge */}
                        <span className="inline-flex items-center px-2 sm:px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-mono tracking-widest text-[#888888] bg-white/5 border border-white/10 uppercase">
                          {role.badge}
                        </span>
                      </div>

                      {/* Job Title & Company */}
                      <div className="space-y-1 mb-4">
                        <h3 className="font-display text-xl sm:text-2xl md:text-3xl text-[#F5F5F5] uppercase tracking-wide group-hover:text-[#FF3B1F] transition-colors">
                          {role.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs sm:text-sm font-mono text-[#AAAAAA]">
                          <Briefcase className="w-3.5 h-3.5 text-[#FF3B1F]" />
                          <span>{role.company}</span>
                        </div>
                      </div>

                      {/* Responsibilities list with custom diamond markers */}
                      <ul className="space-y-2 border-t border-white/10 pt-4">
                        {role.responsibilities.map((resp, rIdx) => (
                          <li
                            key={rIdx}
                            className="flex items-start gap-2.5 text-xs sm:text-sm text-[#888888] leading-relaxed"
                          >
                            <span className="text-[#FF3B1F] text-xs mt-1 shrink-0">
                              ✦
                            </span>
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>

                  {/* Central Node Marker on Spine with scale reveal */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 0.45, ease: "backOut" }}
                    className="absolute left-3 sm:left-4 md:left-1/2 -translate-x-1/2 top-6 md:top-1/2 md:-translate-y-1/2 z-20 flex items-center justify-center will-change-transform"
                  >
                    {/* Glowing outer ring */}
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-black border-2 border-[#FF3B1F] flex items-center justify-center shadow-[0_0_15px_rgba(255,59,31,0.5)]">
                      <div className="w-2 h-2 rounded-full bg-[#FF3B1F]"></div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
