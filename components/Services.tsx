"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export default function Services() {
  const shouldReduceMotion = useReducedMotion();

  const servicesList = [
    { number: "01", title: "Video Editing & Pacing" },
    { number: "02", title: "Commercial & Advertisement Editing" },
    { number: "03", title: "Social Media & Short-Form Reels" },
    { number: "04", title: "Event Highlights & Explainer Videos" },
    { number: "05", title: "Color Grading & Motion Graphics" },
    { number: "06", title: "Media Production & Creative Direction" },
  ];

  return (
    <section
      id="services"
      className="w-full border-b border-white/10 py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-12 bg-black overflow-hidden scroll-mt-24 sm:scroll-mt-28"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-start">
        {/* LEFT COLUMN */}
        <motion.div
          initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -35 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-6 flex flex-col gap-4 sm:gap-6"
        >
          {/* Large Video/Editing Thumbnail with rounded corners */}
          <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 group shadow-xl">
            <Image
              src="/images/services-thumb.jpg"
              alt="Video Editing Suite"
              fill
              className="object-cover grayscale group-hover:grayscale-0 contrast-125 group-hover:scale-105 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          </div>

          {/* Large Editorial Headline */}
          <h2 className="text-xl sm:text-2xl md:text-4xl font-bold uppercase tracking-tight text-[#F5F5F5] leading-tight font-display">
            I EDIT VIDEOS{" "}
            <span className="text-[#888888]">THAT CAPTURE</span> ATTENTION{" "}
            <span className="text-[#888888]">AND TELL</span> STORIES.
          </h2>
        </motion.div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-6 flex flex-col justify-between h-full">
          {/* Section Label */}
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <span className="w-2 h-2 rounded-full bg-[#FF3B1F]"></span>
            <span className="text-xs font-mono tracking-[0.25em] text-[#FF3B1F] uppercase font-bold">
              CAPABILITIES & SERVICES
            </span>
          </div>

          {/* Services List with Alternating Directional Entrance that replays on return */}
          <div className="w-full flex flex-col gap-2.5">
            {servicesList.map((service, idx) => {
              const enterFromX = idx % 2 === 0 ? -50 : 50;

              return (
                <motion.div
                  key={service.number}
                  initial={{
                    opacity: 0,
                    x: shouldReduceMotion ? 0 : enterFromX,
                    scale: shouldReduceMotion ? 1 : 0.96,
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                    scale: 1,
                  }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{
                    duration: 0.55,
                    delay: idx * 0.07,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="group relative rounded-xl border border-white/10 hover:border-[#FF3B1F]/40 p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer transition-all duration-300 overflow-hidden bg-[#0a0a0a]"
                >
                  {/* Smooth left-to-right highlight fill on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FF3B1F]/15 via-[#FF3B1F]/5 to-transparent scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out pointer-events-none" />

                  {/* Subtle bottom accent line on hover */}
                  <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-[#FF3B1F] via-[#FFA337] to-transparent scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out" />

                  <div className="flex items-center gap-4 sm:gap-6 relative z-10">
                    <span className="font-mono text-xs sm:text-sm text-[#888888] group-hover:text-[#FF3B1F] transition-colors">
                      {service.number}
                    </span>
                    <span className="font-display text-sm sm:text-base md:text-lg text-[#F5F5F5] uppercase tracking-wide group-hover:text-white transition-colors">
                      {service.title}
                    </span>
                  </div>

                  <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#888888] group-hover:text-[#FF3B1F] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 relative z-10 shrink-0" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
