"use client";

import Link from "next/link";
import Image from "next/image";
import { Category, projects } from "@/data/projects";
import { ArrowUpRight, Film } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

interface CategoryCardProps {
  category: Category;
  index: number;
}

export default function CategoryCard({ category, index }: CategoryCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const categoryProjects = projects.filter(
    (p) => p.categorySlug.toLowerCase() === category.slug.toLowerCase()
  );

  return (
    <div className="h-full">
      <Link
        href={`/work?category=${category.slug}`}
        data-cursor="EXPLORE"
        className="group relative flex flex-col justify-between h-full rounded-2xl sm:rounded-3xl border border-white/10 hover:border-[#FF3B1F]/60 bg-[#0a0a0a] p-5 sm:p-7 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-[#FF3B1F]/10 hover:-translate-y-1 block"
      >
        {/* Background Image with subtle zoom & dark gradient */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src={category.thumbnail}
            alt={category.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover opacity-25 filter grayscale contrast-125 group-hover:grayscale-0 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-black/60 group-hover:via-black/75 transition-colors duration-500" />
        </div>

        {/* Top Meta: Number + Category Badge + Arrow */}
        <div className="relative z-10 flex items-center justify-between gap-3 mb-8 sm:mb-12">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs sm:text-sm font-bold text-[#FF3B1F] tracking-widest bg-white/5 border border-white/10 px-2.5 py-1 rounded-md">
              {category.number}
            </span>
            <span className="text-[10px] sm:text-xs font-mono tracking-widest text-[#888888] uppercase">
              CATEGORY
            </span>
          </div>

          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-[#F5F5F5] group-hover:bg-[#FF3B1F] group-hover:text-black group-hover:border-[#FF3B1F] group-hover:rotate-45 transition-all duration-300 shadow-md shrink-0">
            <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform" />
          </div>
        </div>

        {/* Content: Title, Tagline, Description */}
        <div className="relative z-10 flex flex-col gap-3">
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono font-bold tracking-wider text-[#FF3B1F] uppercase block">
              {category.tagline}
            </span>
            <h3 className="font-display text-2xl sm:text-3xl text-[#F5F5F5] uppercase tracking-wide group-hover:text-white transition-colors leading-tight">
              {category.name}
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-[#8A8A8A] line-clamp-2 leading-relaxed font-sans">
            {category.description}
          </p>

          {/* Bottom Footer: Project Count & CTA Pill */}
          <div className="pt-4 sm:pt-5 border-t border-white/10 flex items-center justify-between mt-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#888888] group-hover:text-[#F5F5F5] transition-colors uppercase">
              <Film className="w-3 h-3 text-[#FF3B1F]" />
              {categoryProjects.length} {categoryProjects.length === 1 ? "Project" : "Projects"}
            </span>

            <span className="text-[10px] font-mono font-bold tracking-widest text-[#FF3B1F] uppercase group-hover:translate-x-1 transition-transform">
              EXPLORE WORK →
            </span>
          </div>
        </div>

        {/* Subtle hover accent light */}
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#FF3B1F]/10 rounded-full blur-2xl group-hover:bg-[#FF3B1F]/20 transition-all pointer-events-none" />
      </Link>
    </div>
  );
}
