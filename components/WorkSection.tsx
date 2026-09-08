"use client";

import { projects } from "@/data/projects";
import WorkCard from "./WorkCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AnimatedSectionHeader from "@/components/animations/AnimatedSectionHeader";
import ParallaxWordmark from "@/components/animations/ParallaxWordmark";

import ScrollProjectCard from "@/components/animations/ScrollProjectCard";

export default function WorkSection() {
  return (
    <section
      id="work"
      className="relative w-full border-b border-white/10 py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-12 bg-black overflow-hidden scroll-mt-24 sm:scroll-mt-28"
    >
      {/* Giant Background Parallax Wordmark (5-8% opacity) */}
      <ParallaxWordmark text="WORK" speed={0.3} />

      {/* Content Container */}
      <div className="relative z-10">
        {/* Animated Section Header */}
        <AnimatedSectionHeader
          label="SELECTED WORK"
          title="SELECTED PROJECTS"
          subtitle="A curated selection of commercial films, social campaigns, brand stories, and automotive edits."
          action={
            <Link
              href="/work"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 bg-white/5 hover:bg-[#FF3B1F] hover:border-[#FF3B1F] text-xs font-mono tracking-widest text-[#F5F5F5] hover:text-black uppercase transition-all duration-300 group backdrop-blur-sm"
            >
              <span>VIEW ALL PROJECTS ({projects.length})</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          }
        />

        {/* Project Cards Grid with Scroll-Driven 3D Kinematics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch [perspective:1200px]">
          {projects.map((project, index) => (
            <ScrollProjectCard key={project.slug} index={index}>
              <WorkCard project={project} index={index} />
            </ScrollProjectCard>
          ))}
        </div>
      </div>
    </section>
  );
}
