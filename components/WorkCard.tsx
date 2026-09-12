"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Project } from "@/types/cms";
import { getSmartThumbnail } from "@/lib/data";
import { Play } from "lucide-react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";

interface WorkCardProps {
  project: Project & { duration?: string; number?: string };
  index: number;
  onPlay?: (project: Project) => void;
}

export default function WorkCard({ project, index = 0, onPlay }: WorkCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Media Parallax inside card: outer card moves, media moves at slightly different speed
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  const rawMediaY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const mediaY = useSpring(rawMediaY, { stiffness: 90, damping: 22 });

  const CardWrapper = onPlay ? "div" : Link;
  const wrapperProps = onPlay
    ? {
        onClick: () => onPlay(project),
        role: "button",
        tabIndex: 0,
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onPlay(project);
          }
        },
      }
    : { href: `/work?play=${project.slug}` };

  return (
    <div ref={cardRef} className="relative w-full h-full will-change-transform">
      <CardWrapper
        {...(wrapperProps as any)}
        className="group flex flex-col justify-between w-full h-full rounded-2xl border border-gray-200 p-4 bg-white hover:border-[#FF3B1F]/60 hover:shadow-xl hover:shadow-[#FF3B1F]/10 transition-colors duration-500 block relative overflow-hidden cursor-pointer"
      >
        <div className="flex flex-col gap-4">
          {/* Media Preview Container with Image Parallax and Hover Zoom */}
          <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-gray-200 bg-gray-100 shrink-0">
            {/* Parallax Inner Image Wrapper */}
            <motion.div
              style={{
                y: shouldReduceMotion || isMobile ? 0 : mediaY,
              }}
              className="absolute inset-[-10%] w-[120%] h-[120%] will-change-transform"
            >
              <Image
                src={project.thumbnail?.trim() || getSmartThumbnail(project.categorySlug || project.category, project.title, project.videoUrl)}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover filter brightness-100 contrast-105 group-hover:scale-105 transition-transform duration-600 ease-[cubic-bezier(0.25,1,0.5,1)]"
              />
            </motion.div>

            {/* Dark Overlay with "WATCH FILM" label fading in on hover */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px] z-10">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF3B1F] text-white text-xs font-mono font-bold tracking-widest uppercase transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 shadow-lg">
                <Play className="w-3.5 h-3.5 fill-white" />
                WATCH FILM
              </span>
            </div>

            {/* Top Category Badge - Pill */}
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md border border-gray-200 px-3 py-1 rounded-full text-[10px] font-mono tracking-widest text-[#FF3B1F] uppercase font-bold z-20 shadow-xs">
              {project.category}
            </div>

            {/* Duration / Play Badge */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
              {(project.duration || project.runtime) && (
                <span className="bg-white/95 backdrop-blur-md border border-gray-200 px-2.5 py-1 rounded-full text-[10px] font-mono text-gray-800 shadow-xs font-medium">
                  {project.duration || project.runtime}
                </span>
              )}
              <div
                className="w-8 h-8 rounded-full bg-white/95 backdrop-blur-md border border-gray-200 flex items-center justify-center text-gray-800 group-hover:bg-[#FF3B1F] group-hover:text-white group-hover:border-[#FF3B1F] transition-all duration-300 shadow-xs"
              >
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
              </div>
            </div>
          </div>

          {/* Info Meta Row */}
          <div className="flex flex-col gap-2 pt-1 px-1">
            <div className="flex items-center justify-between font-mono text-xs text-gray-500">
              <span className="text-[#FF3B1F] font-bold tracking-wider">
                {project.number || String(index + 1).padStart(2, "0")}
              </span>
              <span className="tracking-wider">{project.year}</span>
            </div>

            {/* Uniform Title Height */}
            <div className="min-h-[2.75rem] sm:min-h-[3.25rem] flex items-start">
              <h3 className="font-display text-xl sm:text-2xl tracking-wide text-gray-950 group-hover:text-[#FF3B1F] transition-colors uppercase leading-tight line-clamp-2 font-bold">
                {project.title}
              </h3>
            </div>

            {/* Uniform Description Height */}
            <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed min-h-[2.5rem]">
              {project.description}
            </p>
          </div>
        </div>

        {/* Tags Row */}
        <div className="pt-4 border-t border-gray-200 mt-4 flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5 overflow-hidden max-h-6">
            {project.services.slice(0, 2).map((service) => (
              <span
                key={service}
                className="text-[9px] font-mono text-gray-600 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-sm uppercase tracking-wider font-medium"
              >
                {service}
              </span>
            ))}
          </div>

          <span className="text-[10px] font-mono text-[#FF3B1F] font-bold tracking-wider group-hover:translate-x-1 transition-transform uppercase shrink-0">
            PLAY VIDEO →
          </span>
        </div>
      </CardWrapper>
    </div>
  );
}
