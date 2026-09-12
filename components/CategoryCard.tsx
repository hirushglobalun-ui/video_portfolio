"use client";

import Link from "next/link";
import Image from "next/image";
import { Category } from "@/types/cms";
import { getSmartThumbnail } from "@/lib/data";
import { ArrowUpRight, Film } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

interface CategoryCardProps {
  category: Category;
  index: number;
  projectCount?: number;
}

export default function CategoryCard({ category, index, projectCount }: CategoryCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const count = projectCount !== undefined ? projectCount : 0;
  const thumbUrl = category.thumbnail?.trim() || getSmartThumbnail(category.slug || category.name, category.name);
  const catNumber = (category as any).number || String(index + 1).padStart(2, "0");

  return (
    <div className="h-full">
      <Link
        href={`/work?category=${category.slug}`}
        className="group relative flex flex-col justify-between h-full rounded-2xl sm:rounded-3xl border border-gray-200 hover:border-[#FF3B1F]/60 bg-white p-5 sm:p-7 overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-[#FF3B1F]/10 hover:-translate-y-1 block"
      >
        {/* Background Image with subtle zoom & clean light gradient */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src={thumbUrl}
            alt={category.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover opacity-15 filter grayscale contrast-110 group-hover:grayscale-0 group-hover:opacity-25 group-hover:scale-110 transition-all duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/85 to-white/70 group-hover:via-white/75 transition-colors duration-500" />
        </div>

        {/* Top Meta: Number + Category Badge + Arrow */}
        <div className="relative z-10 flex items-center justify-between gap-3 mb-8 sm:mb-12">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs sm:text-sm font-bold text-[#FF3B1F] tracking-widest bg-red-50 border border-red-100 px-2.5 py-1 rounded-md">
              {catNumber}
            </span>
            <span className="text-[10px] sm:text-xs font-mono tracking-widest text-gray-500 uppercase font-medium">
              CATEGORY
            </span>
          </div>

          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-700 group-hover:bg-[#FF3B1F] group-hover:text-white group-hover:border-[#FF3B1F] group-hover:rotate-45 transition-all duration-300 shadow-xs shrink-0">
            <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform" />
          </div>
        </div>

        {/* Content: Title, Tagline, Description */}
        <div className="relative z-10 flex flex-col gap-3">
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono font-bold tracking-wider text-[#FF3B1F] uppercase block">
              {category.tagline}
            </span>
            <h3 className="font-display text-2xl sm:text-3xl text-gray-950 uppercase tracking-wide group-hover:text-[#FF3B1F] transition-colors leading-tight font-bold">
              {category.name}
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed font-sans font-normal">
            {category.description}
          </p>

          {/* Bottom Footer: Project Count & CTA Pill */}
          <div className="pt-4 sm:pt-5 border-t border-gray-200 flex items-center justify-between mt-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-gray-500 group-hover:text-gray-900 transition-colors uppercase font-medium">
              <Film className="w-3 h-3 text-[#FF3B1F]" />
              {count} {count === 1 ? "Project" : "Projects"}
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
