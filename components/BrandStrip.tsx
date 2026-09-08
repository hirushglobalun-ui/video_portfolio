"use client";

import { motion } from "framer-motion";

export default function BrandStrip() {
  const brands = [
    "ILLUMINATE ADS & PROMOTIONS",
    "DUXBED INNOVATIONS",
    "PREMIUM AUTOMOTIVE MEDIA",
    "COMMERCIAL CAMPAIGNS",
    "CREATOR BRAND FILMS",
    "EVENT & EXPLAINER MEDIA",
    "COLOR SCIENCE & MASTERING",
  ];

  // Repeat for seamless infinite ticker loop
  const tickerItems = [...brands, ...brands, ...brands];

  return (
    <section className="relative w-full border-b border-white/10 py-5 sm:py-6 bg-black overflow-hidden select-none">
      {/* Edge Gradient Masks for Smooth Dissolve */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

      {/* Infinite Scrolling Ticker Track */}
      <motion.div
        animate={{ x: ["0%", "-33.333%"] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 24,
        }}
        className="flex items-center gap-8 sm:gap-12 whitespace-nowrap will-change-transform"
      >
        {tickerItems.map((brand, idx) => (
          <div key={idx} className="flex items-center gap-8 sm:gap-12 shrink-0">
            <span className="font-mono text-xs sm:text-sm font-semibold tracking-widest text-[#777777] hover:text-[#FF3B1F] transition-colors cursor-default uppercase">
              ✦ {brand}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B1F]/60 shrink-0"></span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
