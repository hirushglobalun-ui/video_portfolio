"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { projects, categories, Project } from "@/data/projects";
import WorkCard from "@/components/WorkCard";
import VideoModal from "@/components/VideoModal";
import { motion, AnimatePresence } from "framer-motion";
import { Film } from "lucide-react";

function WorkContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCategory = searchParams.get("category") || "all";

  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sync state if URL query param changes
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setActiveCategory(categoryParam.toLowerCase());
    } else {
      setActiveCategory("all");
    }
  }, [searchParams]);

  const handleSelectCategory = (slug: string) => {
    setActiveCategory(slug);
    if (slug === "all") {
      router.replace("/work", { scroll: false });
    } else {
      router.replace(`/work?category=${slug}`, { scroll: false });
    }
  };

  const filteredProjects = useMemo(() => {
    if (activeCategory === "all") return projects;
    return projects.filter(
      (p) => p.categorySlug.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [activeCategory]);

  const handlePlayProject = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-12 bg-black min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:gap-4 mb-8 sm:mb-12 border-b border-white/10 pb-8 sm:pb-12">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FF3B1F]"></span>
          <span className="text-xs font-mono tracking-[0.25em] text-[#FF3B1F] uppercase font-bold">
            PORTFOLIO ARCHIVE
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <h1 className="font-display text-3xl sm:text-5xl md:text-7xl text-[#F5F5F5] uppercase tracking-tight">
            SELECTED PROJECTS
          </h1>

          <span className="text-xs font-mono text-[#888888] bg-white/5 border border-white/10 px-3 py-1.5 rounded-full uppercase self-start md:self-auto">
            SHOWING {filteredProjects.length} OF {projects.length} FILMS
          </span>
        </div>

        <p className="text-xs sm:text-sm md:text-base text-[#8A8A8A] max-w-2xl leading-relaxed">
          Browse through all video production work, commercial campaigns, social reels, and narrative edits. Click any project to watch the video directly.
        </p>
      </div>

      {/* Category Filter Pills Bar */}
      <div className="mb-10 sm:mb-14 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-2 sm:gap-3 min-w-max">
          {/* "ALL" Pill */}
          <button
            type="button"
            onClick={() => handleSelectCategory("all")}
            className={`relative px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all duration-300 border ${
              activeCategory === "all"
                ? "text-black font-bold border-[#FF3B1F] bg-[#FF3B1F] shadow-lg shadow-[#FF3B1F]/30"
                : "text-[#888888] border-white/15 bg-white/5 hover:text-white hover:border-white/30"
            }`}
          >
            <span>ALL ({projects.length})</span>
          </button>

          {/* Individual Category Pills */}
          {categories.map((cat) => {
            const count = projects.filter(
              (p) => p.categorySlug.toLowerCase() === cat.slug.toLowerCase()
            ).length;
            const isActive = activeCategory.toLowerCase() === cat.slug.toLowerCase();

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleSelectCategory(cat.slug)}
                className={`relative px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all duration-300 border ${
                  isActive
                    ? "text-black font-bold border-[#FF3B1F] bg-[#FF3B1F] shadow-lg shadow-[#FF3B1F]/30"
                    : "text-[#888888] border-white/15 bg-white/5 hover:text-white hover:border-white/30"
                }`}
              >
                <span>
                  {cat.name} ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.slug}
                layout
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, delay: index * 0.03 }}
                className="h-full"
              >
                <WorkCard
                  project={project}
                  index={index}
                  onPlay={handlePlayProject}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="w-full py-20 flex flex-col items-center justify-center text-center gap-4 border border-dashed border-white/15 rounded-2xl">
          <Film className="w-10 h-10 text-[#FF3B1F]" />
          <h3 className="font-display text-2xl text-[#F5F5F5] uppercase">
            No projects in this category yet
          </h3>
          <p className="text-xs font-mono text-[#888888]">
            Select another category or view all projects.
          </p>
          <button
            type="button"
            onClick={() => handleSelectCategory("all")}
            className="mt-2 px-5 py-2 rounded-full bg-[#FF3B1F] text-black font-mono text-xs font-bold uppercase"
          >
            Show All Projects
          </button>
        </div>
      )}

      {/* Video Modal */}
      <VideoModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default function WorkPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen bg-black flex items-center justify-center">
          <div className="text-xs font-mono text-[#888888] uppercase tracking-widest animate-pulse">
            Loading Archive...
          </div>
        </div>
      }
    >
      <WorkContent />
    </Suspense>
  );
}
