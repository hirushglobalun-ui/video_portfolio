"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getAbout, getServices, defaultAbout } from "@/lib/data";

const fallbackRoles = [
  "SENIOR VIDEO EDITOR",
  "COMMERCIAL & BRAND FILMS",
  "AUTOMOTIVE & DRIFT EDITS",
  "COLOR GRADING & LOOK DEV",
  "SOUND DESIGN & AUDIO MIXING",
  "MOTION GRAPHICS & VFX",
  "NARRATIVE PACING & STORYTELLING",
  "HIGH-RETENTION SOCIAL REELS",
];

export default function BrandStrip() {
  const [roleItems, setRoleItems] = useState<string[]>(
    defaultAbout.roles && defaultAbout.roles.length > 0
      ? defaultAbout.roles.map((r) => r.toUpperCase())
      : fallbackRoles
  );

  useEffect(() => {
    async function loadDynamicRoles() {
      try {
        const about = await getAbout();
        if (about?.roles && about.roles.length > 0) {
          setRoleItems(about.roles.map((r) => r.toUpperCase()));
          return;
        }

        const dynServices = await getServices();
        if (dynServices && dynServices.length > 0) {
          setRoleItems(dynServices.map((s) => s.title.toUpperCase()));
        }
      } catch (err) {
        console.warn("Could not load dynamic roles for ticker:", err);
      }
    }
    loadDynamicRoles();
  }, []);

  // Repeat for seamless infinite ticker loop
  const tickerItems = [...roleItems, ...roleItems, ...roleItems];

  return (
    <section className="relative w-full border-b border-gray-200 py-5 sm:py-6 bg-white overflow-hidden select-none">
      {/* Edge Gradient Masks for Smooth Dissolve */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      {/* Infinite Scrolling Ticker Track */}
      <motion.div
        animate={{ x: ["0%", "-33.333%"] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 12,
        }}
        className="flex items-center gap-8 sm:gap-12 whitespace-nowrap will-change-transform"
      >
        {tickerItems.map((role, idx) => (
          <div key={idx} className="flex items-center gap-8 sm:gap-12 shrink-0">
            <span className="font-mono text-xs sm:text-sm font-semibold tracking-widest text-gray-600 hover:text-[#FF3B1F] transition-colors cursor-default uppercase flex items-center gap-2.5">
              <span className="text-[#FF3B1F]">✦</span>
              <span>{role}</span>
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B1F]/50 shrink-0"></span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
