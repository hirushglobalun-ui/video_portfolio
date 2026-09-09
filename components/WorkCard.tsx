"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Project } from "@/data/projects";
import { ArrowUpRight, Play } from "lucide-react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";

interface WorkCardProps {
  project: Project;
  index: number;
  onPlay?: (project: Project) => void;
}

export default function WorkCard({ project, onPlay }: WorkCardProps) {
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
    : { href: `/work/${project.slug}` };

  return (
    <div ref={cardRef} className="relative w-full h-full will-change-transform">
      <CardWrapper
        {...(wrapperProps as any)}
        data-cursor="PLAY"
        className="group flex flex-col justify-between w-full h-full rounded-2xl border border-white/10 p-4 bg-[#0a0a0a] hover:border-[#FF3B1F]/60 hover:shadow-2xl hover:shadow-[#FF3B1F]/10 transition-colors duration-500 block relative overflow-hidden cursor-pointer"
      >
        <div className="flex flex-col gap-4">
          {/* Media Preview Container with Image Parallax and Hover Zoom */}
          <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-white/10 bg-black shrink-0">
            {/* Parallax Inner Image Wrapper */}
            <motion.div
              style={{
                y: shouldReduceMotion || isMobile ? 0 : mediaY,
              }}
              className="absolute inset-[-10%] w-[120%] h-[120%] will-change-transform"
            >
              <Image
                src={project.thumbnail}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover filter brightness-95 contrast-110 group-hover:scale-105 transition-transform duration-600 ease-[cubic-bezier(0.25,1,0.5,1)]"
              />
            </motion.div>

            {/* Dark Overlay with "WATCH FILM" label fading in on hover */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px] z-10">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF3B1F] text-black text-xs font-mono font-bold tracking-widest uppercase transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 shadow-lg">
                <Play className="w-3.5 h-3.5 fill-black" />
                WATCH FILM
              </span>
            </div>

            {/* Top Category Badge - Pill */}
            <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md border border-white/15 px-3 py-1 rounded-full text-[10px] font-mono tracking-widest text-[#FF3B1F] uppercase z-20">
              {project.category}
            </div>

            {/* Duration / Case Study Link */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
              {project.duration && (
                <span className="bg-black/80 backdrop-blur-md border border-white/15 px-2 py-0.5 rounded-full text-[10px] font-mono text-[#F5F5F5]">
                  {project.duration}
                </span>
              )}
              <Link
                href={`/work/${project.slug}`}
                onClick={(e) => e.stopPropagation()}
                title="View Case Study"
                className="w-8 h-8 rounded-full bg-black/80 backdrop-blur-md border border-white/15 flex items-center justify-center text-[#F5F5F5] hover:bg-[#FF3B1F] hover:text-black hover:border-[#FF3B1F] transition-all duration-300 shadow-md"
              >
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Info Meta Row */}
          <div className="flex flex-col gap-2 pt-1 px-1">
            <div className="flex items-center justify-between font-mono text-xs text-[#8A8A8A]">
              <span className="text-[#FF3B1F] font-bold tracking-wider">
                {project.number}
              </span>
              <span className="tracking-wider">{project.year}</span>
            </div>

            {/* Uniform Title Height */}
            <div className="min-h-[2.75rem] sm:min-h-[3.25rem] flex items-start">
              <h3 className="font-display text-xl sm:text-2xl tracking-wide text-[#F5F5F5] group-hover:text-[#FF3B1F] transition-colors uppercase leading-tight line-clamp-2">
                {project.title}
              </h3>
            </div>

            {/* Uniform Description Height */}
            <p className="text-xs text-[#8A8A8A] line-clamp-2 leading-relaxed min-h-[2.5rem]">
              {project.description}
            </p>
          </div>
        </div>

        {/* Tags Row */}
        <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5 overflow-hidden max-h-6">
            {project.services.slice(0, 2).map((service) => (
              <span
                key={service}
                className="text-[9px] font-mono text-[#8A8A8A] bg-white/5 border border-white/10 px-2 py-0.5 rounded-sm uppercase tracking-wider"
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
