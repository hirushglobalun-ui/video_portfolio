"use client";

import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Film,
  Tv,
  Flame,
  Palette,
  Volume2,
  Layers,
  Sparkles,
  Video,
  MonitorPlay,
  Scissors,
  Wand2,
} from "lucide-react";
import { getServices, defaultServices } from "@/lib/data";
import { ServiceItem } from "@/types/cms";

// Icon mapping helper
const getServiceIcon = (iconName?: string, index: number = 0) => {
  const iconMap: Record<string, any> = {
    Film,
    Tv,
    Flame,
    Palette,
    Volume2,
    Layers,
    Sparkles,
    Video,
    MonitorPlay,
    Scissors,
    Wand2,
  };

  if (iconName && iconMap[iconName]) {
    const IconComp = iconMap[iconName];
    return <IconComp className="w-5 h-5" />;
  }

  // Fallback icon list by index
  const fallbacks = [Film, Tv, Flame, Palette, Volume2, Layers];
  const FallbackComp = fallbacks[index % fallbacks.length];
  return <FallbackComp className="w-5 h-5" />;
};

export default function Services() {
  const shouldReduceMotion = useReducedMotion();
  const [servicesList, setServicesList] = useState<ServiceItem[]>(defaultServices);

  useEffect(() => {
    async function loadDynamicServices() {
      try {
        const dyn = await getServices();
        if (dyn && dyn.length > 0) setServicesList(dyn);
      } catch (err) {
        console.warn("Could not load dynamic services:", err);
      }
    }
    loadDynamicServices();
  }, []);

  return (
    <section
      id="services"
      className="relative w-full border-b border-white/10 py-16 sm:py-20 md:py-28 px-4 sm:px-6 md:px-12 bg-[#060A12] overflow-hidden scroll-mt-24 sm:scroll-mt-28"
    >
      {/* Subtle radial ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[400px] bg-cyan-950/20 blur-[130px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center space-y-3.5 max-w-3xl mb-12 sm:mb-16"
        >
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] animate-pulse" />
            <span className="text-xs font-mono tracking-[0.25em] text-cyan-400 uppercase font-bold">
              CORE CAPABILITIES
            </span>
          </div>

          {/* Large Title */}
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white font-display">
            WHAT I{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-200 bg-clip-text text-transparent">
              DO
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm md:text-base text-gray-400 leading-relaxed font-sans max-w-2xl mx-auto">
            Bridging creative storytelling, precision pacing, and broadcast-grade post-production across commercial films, automotive showcases, and digital campaigns.
          </p>
        </motion.div>

        {/* 3-Column Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full items-stretch">
          {servicesList.map((service, idx) => {
            const points = service.points || [];

            return (
              <motion.div
                key={service.id || service.number || idx}
                initial={{
                  opacity: 0,
                  y: shouldReduceMotion ? 0 : 30,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{
                  duration: 0.55,
                  delay: idx * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group relative rounded-2xl sm:rounded-3xl border border-cyan-500/20 bg-[#0B1322]/85 backdrop-blur-md p-6 sm:p-7 flex flex-col justify-between hover:border-cyan-400/50 hover:shadow-[0_0_35px_rgba(6,182,212,0.18)] transition-all duration-300 overflow-hidden cursor-pointer"
              >
                {/* Subtle card corner gradient glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/10 transition-colors" />

                <div>
                  {/* Top Row: Icon + Badge */}
                  <div className="flex items-center justify-between gap-3">
                    {/* Left: Rounded Icon Container */}
                    <div className="w-11 h-11 rounded-xl bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 flex items-center justify-center shadow-inner group-hover:scale-105 group-hover:border-cyan-500/60 transition-all duration-300">
                      {getServiceIcon(service.icon, idx)}
                    </div>

                    {/* Right: Pill Badge */}
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono tracking-wider text-cyan-400 bg-cyan-950/50 border border-cyan-800/40 uppercase font-semibold">
                      {service.badge || `CAPABILITY ${service.number || `0${idx + 1}`}`}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-white tracking-wide mt-5 group-hover:text-cyan-300 transition-colors leading-snug">
                    {service.title}
                  </h3>

                  {/* Description */}
                  {service.description && (
                    <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mt-2.5 min-h-[3.5rem]">
                      {service.description}
                    </p>
                  )}
                </div>

                {/* Bullet Points List with Glowing Cyan Dots */}
                {points.length > 0 && (
                  <ul className="mt-6 pt-5 border-t border-white/10 space-y-2.5">
                    {points.map((pt, pIdx) => (
                      <li
                        key={pIdx}
                        className="flex items-center gap-2.5 text-xs font-mono text-gray-300 group-hover:text-gray-200 transition-colors"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.9)] shrink-0" />
                        <span className="leading-snug">{pt}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
