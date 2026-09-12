"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import MagneticButton from "@/components/animations/MagneticButton";
import { getHomepage, defaultHomepage } from "@/lib/data";
import { HomepageContent } from "@/types/cms";

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [heroData, setHeroData] = useState<HomepageContent>(defaultHomepage);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    async function loadDynamicHero() {
      try {
        const dyn = await getHomepage();
        if (dyn) setHeroData(dyn);
      } catch (err) {
        console.warn("Could not load dynamic hero data:", err);
      }
    }
    loadDynamicHero();
  }, []);

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

  const wordmark = heroData.title || "MAHROOF";
  const headlineLetters = wordmark.split("");

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
      className="relative w-full min-h-[85vh] lg:min-h-[90vh] flex flex-col justify-between border-b border-gray-200 overflow-hidden bg-white px-4 sm:px-6 md:px-12 pt-6 sm:pt-8 pb-8 sm:pb-10"
    >
      {/* Background Visual (YouTube, Vimeo, or MP4 Video with Image Fallback) */}
      <motion.div
        style={{
          y: shouldReduceMotion ? 0 : bgY,
          scale: shouldReduceMotion ? 1 : bgScale,
        }}
        className="absolute inset-[-5%] w-[110%] h-[110%] z-0 opacity-50 md:opacity-55 will-change-transform overflow-hidden pointer-events-none"
      >
        {(() => {
          const videoUrl = heroData.heroVideoUrl?.trim() || "";
          
          // Check for YouTube URL
          const ytMatch = videoUrl.match(
            /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
          );
          if (ytMatch && ytMatch[1]) {
            const ytId = ytMatch[1];
            return (
              <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden flex items-center justify-center">
                <iframe
                  src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${ytId}&playsinline=1&rel=0&showinfo=0&disablekb=1&modestbranding=1&enablejsapi=1`}
                  title="Hero Background Video"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  className="w-[180%] h-[180%] min-w-full min-h-full object-cover pointer-events-none scale-125 border-0"
                />
              </div>
            );
          }

          // Check for Vimeo URL
          const vimeoMatch = videoUrl.match(/vimeo\.com\/(?:video\/)?(\d+)/);
          if (vimeoMatch && vimeoMatch[1]) {
            const vimeoId = vimeoMatch[1];
            return (
              <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden flex items-center justify-center">
                <iframe
                  src={`https://player.vimeo.com/video/${vimeoId}?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1`}
                  title="Hero Background Video"
                  allow="autoplay; encrypted-media"
                  className="w-[180%] h-[180%] min-w-full min-h-full object-cover pointer-events-none scale-125 border-0"
                />
              </div>
            );
          }

          // Direct MP4 / WebM / Local video file
          if (videoUrl && !videoUrl.includes("hero-bg.mp4")) {
            return (
              <video
                autoPlay
                muted
                loop
                playsInline
                onCanPlay={() => setVideoLoaded(true)}
                className="w-full h-full object-cover filter brightness-[0.98] contrast-[1.05]"
              >
                <source src={videoUrl} type="video/mp4" />
              </video>
            );
          }

          // Poster Image fallback (high-res cinematic still if default)
          const fallbackImage =
            heroData.heroImage && heroData.heroImage !== "/images/hero-bg.jpg"
              ? heroData.heroImage
              : "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1920&q=90";

          return (
            <Image
              src={fallbackImage}
              alt="Mohammed Mahroof Video Editor Studio"
              fill
              className="object-cover filter brightness-[0.95] contrast-[1.05]"
              priority
            />
          );
        })()}

        {/* Soft Balanced Editorial Overlay: gentle presence without overpowering */}
        <div className="absolute inset-0 bg-white/35 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-transparent to-white/50 pointer-events-none"></div>
      </motion.div>

      {/* Hero Content Layer */}
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
          className="flex items-center justify-between border border-gray-200/80 bg-white/75 backdrop-blur-md px-4 py-2.5 rounded-2xl mb-4 sm:mb-6 shadow-2xs"
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xs font-mono tracking-[0.25em] text-[#FF3B1F] uppercase font-bold">
              {heroData.eyebrow || "SHOWREEL"}
            </span>
            <span className="hidden sm:inline text-gray-300 font-mono text-xs">•</span>
            <span className="hidden sm:inline text-xs font-mono tracking-widest text-gray-600 uppercase font-medium">
              VIDEO EDITOR & VISUAL STORYTELLER
            </span>
          </div>
          <div className="text-[10px] sm:text-[11px] font-mono tracking-[0.2em] text-gray-500 uppercase font-medium">
            CUT • COLOR • STORY
          </div>
        </motion.div>

        {/* Top Header Row in Hero */}
        <div className="w-full flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 sm:gap-6">
          {/* Huge Main Title */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="w-full lg:w-auto overflow-hidden"
          >
            <h1 className="font-display text-[14vw] sm:text-[15vw] lg:text-[8vw] xl:text-[8.8vw] leading-[0.85] tracking-tight text-[#FF3B1F] select-none font-bold uppercase drop-shadow-[0_12px_32px_rgba(255,255,255,0.9)] flex flex-nowrap whitespace-nowrap">
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

          {/* Top Right Tagline */}
          <motion.div
            initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0 }}
            whileInView={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-xs text-left sm:text-right self-start sm:self-end lg:self-auto bg-white/80 backdrop-blur-md px-4 py-3 rounded-2xl border border-gray-200/80 shadow-2xs"
          >
            <p className="text-base sm:text-xl md:text-2xl font-light text-gray-700 tracking-tight leading-tight">
              Turning Footage{" "}
              <span className="font-bold text-gray-950">Into Stories.</span>
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
                href={heroData.primaryCtaLink || "/work"}
                className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[#FF3B1F] hover:bg-[#E0341A] text-xs font-mono tracking-widest text-white transition-all duration-300 group shadow-md shadow-red-500/25"
              >
                <span>{heroData.primaryCtaText || "VIEW MY WORK"}</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
              </Link>
            </MagneticButton>

            {/* Editorial Subhead Bio */}
            <div className="max-w-xl space-y-1 bg-white/85 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs">
              <h2 className="text-xs sm:text-sm md:text-base font-bold tracking-wider text-gray-900 uppercase font-display">
                {heroData.subtitle || "SENIOR VIDEO EDITOR & MEDIA PRODUCTION SPECIALIST"}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                {heroData.description || "Transforming raw footage into polished, engaging and story-driven visual content."}
              </p>
            </div>
          </div>

          {/* Bottom Right Experience Badge */}
          <div className="lg:col-span-4 flex flex-col lg:items-end justify-end">
            <div className="inline-flex flex-col items-start lg:items-end gap-1 p-3.5 sm:p-4 rounded-2xl border border-gray-200 bg-white/90 backdrop-blur-sm shadow-xs">
              <span className="text-[11px] sm:text-xs font-mono tracking-[0.25em] text-[#FF3B1F] font-bold uppercase">
                04+ YEARS EXPERIENCE
              </span>
              <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-gray-500 uppercase font-medium">
                2018 — PRESENT
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
