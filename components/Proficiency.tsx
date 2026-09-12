"use client";

import { useState, useEffect } from "react";
import AnimatedSectionHeader from "@/components/animations/AnimatedSectionHeader";
import ScrollRevealCard from "@/components/animations/ScrollRevealCard";
import { getSoftware, defaultSoftware } from "@/lib/data";
import { SoftwareTool } from "@/types/cms";

export default function Proficiency() {
  const [softwareList, setSoftwareList] = useState<SoftwareTool[]>(defaultSoftware);

  useEffect(() => {
    async function loadDynamicSoftware() {
      try {
        const dyn = await getSoftware();
        if (dyn && dyn.length > 0) {
          setSoftwareList(dyn);
        }
      } catch (err) {
        console.warn("Could not load dynamic software:", err);
      }
    }
    loadDynamicSoftware();
  }, []);

  return (
    <section
      id="toolkit"
      className="relative w-full border-b border-gray-200 py-16 sm:py-20 md:py-28 px-4 sm:px-6 md:px-12 bg-white overflow-hidden scroll-mt-24 sm:scroll-mt-28"
    >
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Animated Section Header matching the rest of the website */}
        <AnimatedSectionHeader
          label="TOOLKIT • POST-PRODUCTION"
          title="SOFTWARE & PRODUCTION"
          subtitle="Industry-standard editing, color grading, motion graphics, and finishing tools I leverage to craft high-impact cinematic films and commercial content."
        />

        {/* 3-Column Card Grid with matching 3D perspective and scale scroll entrance */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full items-stretch mt-8 sm:mt-12 [perspective:1200px]">
          {softwareList.map((tool, idx) => {
            const highlights = tool.highlights || [];
            const col = idx % 3;
            const direction: "left" | "right" | "up" =
              col === 0 ? "left" : col === 1 ? "up" : "right";
            const delay = col === 0 ? 0 : col === 1 ? 0.08 : 0.16;

            return (
              <ScrollRevealCard
                key={tool.id || tool.name || idx}
                direction={direction}
                distance={70}
                delay={delay}
                className="h-full"
              >
                <div className="group relative rounded-2xl sm:rounded-3xl border border-gray-200 bg-[#F8F9FA] p-6 sm:p-7 flex flex-col justify-between hover:border-[#FF3B1F]/60 hover:bg-white hover:shadow-xl hover:shadow-[#FF3B1F]/5 transition-all duration-300 overflow-hidden cursor-pointer h-full">
                  {/* Subtle top-corner gradient hover flare */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF3B1F]/5 rounded-full blur-2xl pointer-events-none group-hover:bg-[#FF3B1F]/10 transition-colors" />

                  <div>
                    {/* Top Row: Monogram Box + Role Pill Badge */}
                    <div className="flex items-center justify-between gap-3">
                      {/* Left: Rounded Monogram Container */}
                      <div className="w-11 h-11 rounded-xl bg-white border border-gray-200 text-[#FF3B1F] flex items-center justify-center font-display text-lg font-bold shadow-xs group-hover:scale-105 group-hover:border-[#FF3B1F]/50 transition-all duration-300">
                        {tool.monogram || tool.name.slice(0, 2).toUpperCase()}
                      </div>

                      {/* Right: Pill Badge in Signature Red */}
                      <span className="px-3 py-1 rounded-full text-[10px] font-mono tracking-wider text-[#FF3B1F] bg-[#FF3B1F]/10 border border-[#FF3B1F]/20 uppercase font-bold">
                        {tool.role || "TOOLKIT"}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-gray-950 tracking-wide mt-5 group-hover:text-[#FF3B1F] transition-colors leading-snug uppercase">
                      {tool.name}
                    </h3>

                    {/* Description */}
                    {tool.description && (
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mt-2.5 min-h-[3.5rem]">
                        {tool.description}
                      </p>
                    )}
                  </div>

                  {/* Bullet Points List with Red Dots */}
                  {highlights.length > 0 && (
                    <ul className="mt-6 pt-5 border-t border-gray-200 space-y-2.5">
                      {highlights.map((highlight, hIdx) => (
                        <li
                          key={hIdx}
                          className="flex items-center gap-2.5 text-xs font-mono text-gray-700 group-hover:text-gray-950 transition-colors"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B1F] shrink-0" />
                          <span className="leading-snug font-medium">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </ScrollRevealCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
