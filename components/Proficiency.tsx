"use client";

import AnimatedSectionHeader from "@/components/animations/AnimatedSectionHeader";
import ScrollRevealCard from "@/components/animations/ScrollRevealCard";

export default function Proficiency() {
  const mainTools = [
    {
      name: "DAVINCI RESOLVE",
      role: "COLOR GRADING & FINISHING",
      monogram: "DR",
      color: "from-[#FF4E27]/20 to-[#FFA337]/10",
      borderHover: "hover:border-[#FF4E27]/50",
      accentText: "text-[#FF4E27]",
      description:
        "Primary color grading and finishing environment for commercial films, automotive showcases, and custom cinematic look development.",
      highlights: [
        "Color Grading",
        "Color Correction",
        "Cinematic Finishing",
        "Custom LUTs",
        "Fusion VFX",
        "Audio / Fairlight",
        "Skin Tone Balance",
      ],
    },
    {
      name: "ADOBE PREMIERE PRO",
      role: "NLE & STORYTELLING",
      monogram: "Pr",
      color: "from-[#9999FF]/20 to-[#6E44FF]/10",
      borderHover: "hover:border-[#9999FF]/50",
      accentText: "text-[#9999FF]",
      description:
        "Main timeline editor for commercial pacing, long-form narrative structure, multicam synchronization, and multi-track audio mixing.",
      highlights: [
        "Video Editing",
        "Storytelling & Pacing",
        "Commercial Edits",
        "Multicam Sync",
        "Audio Editing & Mixing",
        "Podcast Formatting",
        "Plugin Workflows",
      ],
    },
  ];

  const companionTools = [
    {
      name: "AFTER EFFECTS",
      role: "MOTION & VFX",
      monogram: "Ae",
      color: "from-[#6E44FF]/20 to-[#9999FF]/10",
      borderHover: "hover:border-[#6E44FF]/50",
      accentText: "text-[#9999FF]",
      description: "Motion graphics · Text animation · Visual effects · Compositing · Speed ramping",
      tags: [
        "Motion Graphics",
        "Text Animation",
        "Visual Effects",
        "Compositing",
        "Speed Ramping",
      ],
    },
    {
      name: "CAPCUT PRO",
      role: "SHORT-FORM & SOCIAL",
      monogram: "CC",
      color: "from-[#00F0FF]/15 to-[#00A3FF]/5",
      borderHover: "hover:border-[#00F0FF]/40",
      accentText: "text-[#00F0FF]",
      description: "Short-form editing · Reels · TikTok · Fast-paced social content · Trend cuts",
      tags: [
        "Short-Form Editing",
        "Instagram Reels",
        "TikTok Formats",
        "Fast-Paced Content",
        "Sound Pacing",
      ],
    },
    {
      name: "PHOTOSHOP",
      role: "ASSETS & RETOUCHING",
      monogram: "Ps",
      color: "from-[#31A8FF]/20 to-[#0066FF]/10",
      borderHover: "hover:border-[#31A8FF]/50",
      accentText: "text-[#31A8FF]",
      description: "Thumbnails · Posters · Image retouching · Compositing · Key visuals",
      tags: [
        "High-CTR Thumbnails",
        "Posters & Key Art",
        "Image Retouching",
        "Compositing",
      ],
    },
    {
      name: "LIGHTROOM",
      role: "PHOTO GRADING",
      monogram: "Lr",
      color: "from-[#31A8FF]/15 to-[#0099FF]/5",
      borderHover: "hover:border-[#31A8FF]/50",
      accentText: "text-[#31A8FF]",
      description: "Photo correction · Color grading · Exposure balance · Preset tuning",
      tags: [
        "Photo Correction",
        "Color Grading",
        "Exposure Balance",
        "Preset Calibration",
      ],
    },
  ];

  const cameraTelemetry = [
    { label: "SHUTTER", value: "180° CINEMATIC RULE" },
    { label: "FRAME RATES", value: "24 / 60 / 120 FPS" },
    { label: "COLOR PROFILES", value: "10-BIT 4:2:2 LOG" },
    { label: "EXPOSURE", value: "MANUAL METERING" },
    { label: "AERIAL", value: "DRONE FLIGHT MECHANICS" },
  ];

  return (
    <section
      id="toolkit"
      className="w-full border-b border-white/10 pt-16 sm:pt-20 md:pt-28 pb-12 sm:pb-16 md:pb-24 px-4 sm:px-6 md:px-12 bg-black overflow-hidden scroll-mt-24 sm:scroll-mt-28"
    >
      {/* Section Header with per-word stagger & line draw */}
      <AnimatedSectionHeader
        label="TOOLKIT • POST-PRODUCTION"
        title="SOFTWARE & PRODUCTION"
        subtitle="Industry-standard editing, color grading, motion graphics and production tools I use to create polished video content."
      />

      {/* Main Suite Bento Grid */}
      <div className="space-y-6">
        {/* Row 1: Featured Main Video Editing & Grading Tools (DaVinci from LEFT, Premiere from RIGHT) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 [perspective:1200px]">
          {mainTools.map((tool, idx) => {
            const isLeft = idx === 0;
            return (
              <ScrollRevealCard
                key={tool.name}
                direction={isLeft ? "left" : "right"}
                distance={100}
                delay={isLeft ? 0 : 0.08}
              >
                <div
                  className={`group relative rounded-2xl sm:rounded-3xl border border-white/10 ${tool.borderHover} p-6 sm:p-8 bg-gradient-to-br from-[#0e0e0e] to-[#050505] flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-black/80 h-full`}
                >
                  <div className="space-y-4">
                    {/* Header: Monogram + Titles */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} border border-white/15 flex items-center justify-center font-display text-xl font-bold ${tool.accentText} shadow-inner`}
                        >
                          {tool.monogram}
                        </div>
                        <div>
                          <h3 className="font-display text-xl sm:text-2xl text-[#F5F5F5] uppercase tracking-wide group-hover:text-white transition-colors">
                            {tool.name}
                          </h3>
                          <span
                            className={`text-[10px] font-mono font-bold tracking-wider ${tool.accentText} uppercase`}
                          >
                            {tool.role}
                          </span>
                        </div>
                      </div>

                      <span className="hidden sm:inline-block text-[10px] font-mono text-[#888888] bg-white/5 border border-white/10 px-3 py-1 rounded-full uppercase tracking-wider">
                        FEATURED SUITE
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-[#A0A0A0] leading-relaxed">
                      {tool.description}
                    </p>

                    {/* Highlight Pills */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {tool.highlights.map((item) => (
                        <span
                          key={item}
                          className="text-[10px] sm:text-[11px] font-mono text-[#CCCCCC] bg-white/[0.04] border border-white/10 px-3 py-1.5 rounded-full uppercase transition-colors group-hover:border-white/20 group-hover:bg-white/[0.07]"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Subtle Bar */}
                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-[#666666]">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B1F]"></span>
                      POST-PRODUCTION SUITE
                    </span>
                    <span className="text-[#888888]">PROFESSIONAL GRADE</span>
                  </div>
                </div>
              </ScrollRevealCard>
            );
          })}
        </div>

        {/* Row 2: Smaller Companion Cards (AE: left 70px, CapCut: left 45px, Photoshop: right 45px, Lightroom: right 70px) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 [perspective:1200px]">
          {companionTools.map((tool, idx) => {
            const row2Config = [
              { direction: "left" as const, distance: 70, delay: 0.1 },
              { direction: "left" as const, distance: 45, delay: 0.15 },
              { direction: "right" as const, distance: 45, delay: 0.15 },
              { direction: "right" as const, distance: 70, delay: 0.2 },
            ];
            const cfg = row2Config[idx] || { direction: "left" as const, distance: 50, delay: 0.1 };

            return (
              <ScrollRevealCard
                key={tool.name}
                direction={cfg.direction}
                distance={cfg.distance}
                delay={cfg.delay}
              >
                <div
                  className={`group rounded-2xl border border-white/10 ${tool.borderHover} p-5 bg-[#0a0a0a] flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-black h-full`}
                >
                  <div className="space-y-3">
                    {/* Monogram + Role */}
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tool.color} border border-white/15 flex items-center justify-center font-display text-lg font-bold ${tool.accentText}`}
                      >
                        {tool.monogram}
                      </div>
                      <span className="text-[9px] font-mono font-bold tracking-wider text-[#888888] bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full uppercase">
                        {tool.role}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-display text-base sm:text-lg text-[#F5F5F5] uppercase tracking-wide group-hover:text-white transition-colors">
                        {tool.name}
                      </h4>
                      <p className="text-[11px] text-[#777777] font-mono mt-1 leading-snug line-clamp-2">
                        {tool.description}
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {tool.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-mono text-[#888888] bg-white/5 border border-white/10 px-2.5 py-1 rounded-full uppercase group-hover:text-[#CCCCCC]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollRevealCard>
            );
          })}
        </div>

        {/* Row 3: Compact Production & Camera Telemetry Strip (Subtle upward reveal) */}
        <ScrollRevealCard direction="up" distance={40} delay={0.22}>
          <div className="rounded-2xl border border-white/10 p-4 sm:p-6 bg-gradient-to-r from-[#0c0c0c] via-[#080808] to-[#0c0c0c] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#FF3B1F] animate-pulse shrink-0"></span>
              <div>
                <span className="text-[11px] font-mono font-bold text-[#F5F5F5] uppercase tracking-wider block">
                  CAMERA & PRODUCTION TELEMETRY
                </span>
                <span className="text-[10px] font-mono text-[#777777]">
                  Practical field expertise ensuring footage is captured calibrated for post-production
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {cameraTelemetry.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-1.5 bg-black/80 border border-white/10 px-3 py-1.5 rounded-full text-[10px] font-mono"
                >
                  <span className="text-[#FF3B1F]">{item.label}:</span>
                  <span className="text-[#F5F5F5] font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollRevealCard>
      </div>
    </section>
  );
}
