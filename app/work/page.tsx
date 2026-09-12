"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { projects as staticProjects, categories as staticCategories } from "@/data/projects";
import { getProjects, getCategories } from "@/lib/data";
import { Project, Category } from "@/types/cms";
import WorkCard from "@/components/WorkCard";
import VideoModal from "@/components/VideoModal";
import { motion, AnimatePresence } from "framer-motion";
import { Film } from "lucide-react";

function WorkContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCategory = searchParams.get("category") || "all";

  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load from dynamic data layer (Firestore)
  useEffect(() => {
    async function loadDynamic() {
      try {
        const [dynProjects, dynCats] = await Promise.all([
          getProjects(),
          getCategories(),
        ]);
        setProjectsList(dynProjects || []);
        setCategoriesList(dynCats || []);
      } catch (err) {
        console.warn("Dynamic data load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDynamic();
  }, []);

  // Sync state if URL query param changes
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setActiveCategory(categoryParam.toLowerCase());
    } else {
      setActiveCategory("all");
    }

    const playParam = searchParams.get("play");
    if (playParam && projectsList.length > 0) {
      const match = projectsList.find((p) => p.slug === playParam);
      if (match) {
        setSelectedProject(match);
        setIsModalOpen(true);
      }
    }
  }, [searchParams, projectsList]);

  const handleSelectCategory = (slug: string) => {
    setActiveCategory(slug);
    if (slug === "all") {
      router.replace("/work", { scroll: false });
    } else {
      router.replace(`/work?category=${slug}`, { scroll: false });
    }
  };

  const filteredProjects = useMemo(() => {
    if (activeCategory === "all") return projectsList;
    return projectsList.filter(
      (p) => (p.categorySlug || "").toLowerCase() === activeCategory.toLowerCase()
    );
  }, [activeCategory, projectsList]);

  const handlePlayProject = (project: any) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-12 bg-[#F8F9FA] min-h-screen text-gray-950">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:gap-4 mb-8 sm:mb-12 border-b border-gray-200 pb-8 sm:pb-12">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FF3B1F]"></span>
          <span className="text-xs font-mono tracking-[0.25em] text-[#FF3B1F] uppercase font-bold">
            PORTFOLIO ARCHIVE
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <h1 className="font-display text-3xl sm:text-5xl md:text-7xl text-gray-950 uppercase tracking-tight font-bold">
            SELECTED PROJECTS
          </h1>

          <span className="text-xs font-mono text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-full uppercase self-start md:self-auto shadow-xs font-medium">
            SHOWING {filteredProjects.length} OF {projectsList.length} FILMS
          </span>
        </div>

        <p className="text-xs sm:text-sm md:text-base text-gray-600 max-w-2xl leading-relaxed">
          Browse through all video production work, commercial campaigns, social reels, and narrative edits. Click any project to watch the video directly.
        </p>
      </div>

      {/* Modern Editorial Filter Bar */}
      <div className="mb-10 sm:mb-14">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-200/80">
          {/* Segmented Filter Control */}
          <div className="inline-flex flex-wrap items-center gap-1.5 p-1.5 bg-white border border-gray-200 rounded-2xl shadow-xs">
            {/* "ALL" Tab */}
            <button
              type="button"
              onClick={() => handleSelectCategory("all")}
              className={`relative px-4 py-2 rounded-xl text-xs font-mono tracking-wider uppercase transition-all duration-200 cursor-pointer flex items-center gap-2 select-none ${
                activeCategory === "all"
                  ? "text-white font-bold"
                  : "text-gray-600 hover:text-gray-950 hover:bg-gray-100/70 font-medium"
              }`}
            >
              {activeCategory === "all" && (
                <motion.div
                  layoutId="activeFilterBg"
                  className="absolute inset-0 bg-gray-950 rounded-xl shadow-sm -z-0"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                {activeCategory === "all" && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B1F] animate-pulse" />
                )}
                ALL
              </span>
              <span
                className={`relative z-10 text-[10px] px-1.5 py-0.5 rounded-md font-mono transition-colors ${
                  activeCategory === "all"
                    ? "bg-white/20 text-white font-bold"
                    : "bg-gray-100 text-gray-500 font-semibold"
                }`}
              >
                {projectsList.length}
              </span>
            </button>

            {/* Individual Category Tabs */}
            {categoriesList.map((cat) => {
              const count = projectsList.filter(
                (p) => (p.categorySlug || "").toLowerCase() === (cat.slug || "").toLowerCase()
              ).length;
              const isActive = activeCategory.toLowerCase() === (cat.slug || "").toLowerCase();

              return (
                <button
                  key={cat.id || cat.slug}
                  type="button"
                  onClick={() => handleSelectCategory(cat.slug)}
                  className={`relative px-4 py-2 rounded-xl text-xs font-mono tracking-wider uppercase transition-all duration-200 cursor-pointer flex items-center gap-2 select-none ${
                    isActive
                      ? "text-white font-bold"
                      : "text-gray-600 hover:text-gray-950 hover:bg-gray-100/70 font-medium"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeFilterBg"
                      className="absolute inset-0 bg-gray-950 rounded-xl shadow-sm -z-0"
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B1F] animate-pulse" />
                    )}
                    {cat.name}
                  </span>
                  <span
                    className={`relative z-10 text-[10px] px-1.5 py-0.5 rounded-md font-mono transition-colors ${
                      isActive
                        ? "bg-white/20 text-white font-bold"
                        : "bg-gray-100 text-gray-500 font-semibold"
                    }`}
                  >
                    {count < 10 ? `0${count}` : count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="w-full py-28 flex flex-col items-center justify-center text-center gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-[#FF3B1F] border-t-transparent animate-spin" />
          <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">
            Loading Video Archive...
          </p>
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.slug || project.id || index}
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
      ) : projectsList.length === 0 ? (
        <div className="w-full py-20 flex flex-col items-center justify-center text-center gap-4 border border-dashed border-gray-300 bg-white rounded-2xl shadow-xs">
          <Film className="w-10 h-10 text-[#FF3B1F]" />
          <h3 className="font-display text-2xl text-gray-950 uppercase font-bold">
            No Projects Published Yet
          </h3>
          <p className="text-xs font-mono text-gray-500 max-w-md">
            New video edits and commercial films added in your Admin Dashboard will appear here automatically.
          </p>
          <a
            href="/admin/projects/new"
            className="mt-2 px-6 py-2.5 rounded-full bg-[#FF3B1F] hover:bg-[#E0341A] text-white font-mono text-xs font-bold uppercase shadow-sm transition-colors"
          >
            + Add First Project
          </a>
        </div>
      ) : (
        <div className="w-full py-20 flex flex-col items-center justify-center text-center gap-4 border border-dashed border-gray-300 bg-white rounded-2xl shadow-xs">
          <Film className="w-10 h-10 text-[#FF3B1F]" />
          <h3 className="font-display text-2xl text-gray-950 uppercase font-bold">
            No projects in this category yet
          </h3>
          <p className="text-xs font-mono text-gray-500">
            Select another category or view all projects.
          </p>
          <button
            type="button"
            onClick={() => handleSelectCategory("all")}
            className="mt-2 px-5 py-2 rounded-full bg-[#FF3B1F] hover:bg-[#E0341A] text-white font-mono text-xs font-bold uppercase shadow-sm transition-colors"
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
        <div className="w-full min-h-screen bg-[#F8F9FA] flex items-center justify-center">
          <div className="text-xs font-mono text-gray-500 uppercase tracking-widest animate-pulse">
            Loading Archive...
          </div>
        </div>
      }
    >
      <WorkContent />
    </Suspense>
  );
}
