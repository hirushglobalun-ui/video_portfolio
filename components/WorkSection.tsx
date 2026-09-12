"use client";

import { useState, useEffect } from "react";
import { getCategories, getProjects } from "@/lib/data";
import CategoryCard from "./CategoryCard";
import ScrollRevealCard from "@/components/animations/ScrollRevealCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AnimatedSectionHeader from "@/components/animations/AnimatedSectionHeader";
import ParallaxWordmark from "@/components/animations/ParallaxWordmark";

export default function WorkSection() {
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [projectCount, setProjectCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDynamic() {
      try {
        const [cats, projs] = await Promise.all([getCategories(), getProjects()]);
        setCategoriesList(cats || []);
        setProjectsList(projs || []);
        setProjectCount(projs ? projs.length : 0);
      } catch (err) {
        console.warn("Could not load dynamic categories for WorkSection:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDynamic();
  }, []);

  return (
    <section
      id="work"
      className="relative w-full border-b border-gray-200 py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-12 bg-[#F8F9FA] overflow-hidden scroll-mt-24 sm:scroll-mt-28"
    >
      {/* Giant Background Parallax Wordmark (3% opacity) */}
      <ParallaxWordmark text="WORK" speed={0.3} />

      {/* Content Container */}
      <div className="relative z-10">
        {/* Animated Section Header */}
        <AnimatedSectionHeader
          label="SELECTED WORK"
          title="SELECTED PROJECTS"
          subtitle="Explore commercial films, automotive showcases, social campaigns, and motion design categorized by production discipline."
          action={
            <Link
              href="/work"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 bg-white hover:bg-[#FF3B1F] hover:border-[#FF3B1F] text-xs font-mono tracking-widest text-gray-800 hover:text-white uppercase transition-all duration-300 group shadow-xs font-semibold"
            >
              <span>VIEW ALL PROJECTS ({projectCount})</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          }
        />

        {/* Category Bento Grid with Scroll-Driven Directional Entrance */}
        {categoriesList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch [perspective:1200px]">
            {categoriesList.map((category, index) => {
              const col = index % 3;
              const direction: "left" | "right" | "up" =
                col === 0 ? "left" : col === 1 ? "up" : "right";
              const delay = col === 0 ? 0 : col === 1 ? 0.08 : 0.16;

              const count = projectsList.filter(
                (p) =>
                  (p.categorySlug || "").toLowerCase() === (category.slug || "").toLowerCase() ||
                  (p.category || "").toLowerCase() === (category.name || "").toLowerCase()
              ).length;

              return (
                <ScrollRevealCard
                  key={category.id || category.slug || index}
                  direction={direction}
                  distance={70}
                  delay={delay}
                  className="h-full"
                >
                  <CategoryCard category={category} index={index} projectCount={count} />
                </ScrollRevealCard>
              );
            })}
          </div>
        ) : loading ? (
          <div className="w-full py-16 flex flex-col items-center justify-center gap-3">
            <div className="w-7 h-7 rounded-full border-2 border-[#FF3B1F] border-t-transparent animate-spin" />
            <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">
              Loading Disciplines...
            </p>
          </div>
        ) : (
          <div className="w-full py-16 flex flex-col items-center justify-center text-center gap-4 border border-dashed border-gray-300 bg-white rounded-2xl shadow-xs px-6">
            <h3 className="font-display text-xl sm:text-2xl text-gray-950 uppercase font-bold">
              Explore Video Production Work
            </h3>
            <p className="text-xs sm:text-sm font-mono text-gray-500 max-w-md">
              {projectCount > 0
                ? `${projectCount} films and video productions are available to watch in the portfolio archive.`
                : "New video projects and production categories added in the Admin panel will appear here automatically."}
            </p>
            <Link
              href="/work"
              className="mt-2 px-6 py-2.5 rounded-full bg-[#FF3B1F] hover:bg-[#E0341A] text-white font-mono text-xs font-bold uppercase shadow-sm transition-colors"
            >
              Go to Full Archive →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
