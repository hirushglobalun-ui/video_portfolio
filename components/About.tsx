"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";
import Image from "next/image";
import CountUpStat from "@/components/animations/CountUpStat";
import { getAbout, defaultAbout } from "@/lib/data";
import { AboutContent } from "@/types/cms";

export default function About() {
  const containerRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [aboutData, setAboutData] = useState<AboutContent>(defaultAbout);

  useEffect(() => {
    async function loadDynamicAbout() {
      try {
        const dyn = await getAbout();
        if (dyn) setAboutData(dyn);
      } catch (err) {
        console.warn("Could not load dynamic about data:", err);
      }
    }
    loadDynamicAbout();
  }, []);

  const stats = aboutData.stats && aboutData.stats.length > 0 ? aboutData.stats : defaultAbout.stats;

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
      className="w-full border-b border-gray-200 py-10 sm:py-14 md:py-16 px-4 sm:px-6 md:px-12 bg-[#F8F9FA] relative overflow-hidden scroll-mt-24 sm:scroll-mt-28"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-14 items-center relative z-10">
        {/* LEFT COLUMN - TEXT CONTENT */}
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
                {aboutData.label || "ABOUT"}
              </span>
            </div>

            {/* Large Editorial Title */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-bold uppercase tracking-tight text-gray-950 leading-[1.12] font-display">
              {aboutData.headline || "I DON'T JUST EDIT VIDEOS."}{" "}
              <span className="text-gray-500">
                {aboutData.subheadline || "I BUILD VISUAL STORIES"}
              </span>{" "}
              THAT PEOPLE REMEMBER.
            </h2>

            {/* Professional Summary */}
            <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed max-w-xl">
              {aboutData.description || defaultAbout.description}
            </p>
          </div>

          {/* Stats Cards Section with CountUp Animation */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-4 pt-4 sm:pt-5 border-t border-gray-200">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="p-3 sm:p-4 rounded-xl border border-gray-200 bg-white shadow-xs flex flex-col justify-between"
              >
                <div className="text-2xl sm:text-3xl md:text-4xl font-mono font-bold text-[#FF3B1F] tracking-tight">
                  <CountUpStat value={stat.number} />
                </div>
                <span className="text-[8px] sm:text-[10px] md:text-xs font-mono tracking-widest text-gray-500 mt-1 sm:mt-2 uppercase font-medium">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT COLUMN - PORTRAIT IMAGE */}
        <motion.div
          style={{ y: shouldReduceMotion ? 0 : imgY }}
          initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5 relative w-full aspect-[4/5] max-h-[500px] rounded-3xl overflow-hidden border border-gray-200 bg-white group shadow-xl will-change-transform justify-self-center"
        >
          <div className="relative w-full h-full overflow-hidden">
            <Image
              src={aboutData.profileImage || "/images/editor-portrait.jpg"}
              alt="Mohammed Mahroof TM — Senior Video Editor"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 35vw"
              className="object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
              priority
            />
          </div>

          {/* Subtle bottom gradient vignette for badge readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"></div>

          {/* Overlay Corner Badges */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
            <span className="text-[10px] sm:text-xs font-mono tracking-widest text-gray-900 uppercase bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-gray-200 shadow-xs font-medium">
              MOHAMMED MAHROOF TM
            </span>
            <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-[#FF3B1F] uppercase bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#FF3B1F]/30 shadow-xs font-bold">
              MEDIA SPECIALIST
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
