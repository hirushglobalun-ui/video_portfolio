import { projects } from "@/data/projects";
import WorkCard from "@/components/WorkCard";
import ScrollProjectCard from "@/components/animations/ScrollProjectCard";

export const metadata = {
  title: "Selected Work — Mohammed Mahroof TM | Senior Video Editor",
  description:
    "Explore the video editing portfolio of Mohammed Mahroof TM featuring commercial films, automotive campaigns, social media edits, and creative visual storytelling.",
};

export default function WorkPage() {
  return (
    <div className="w-full py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-12 bg-black min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:gap-4 mb-10 sm:mb-16 border-b border-white/10 pb-8 sm:pb-12">
        <span className="text-xs font-mono tracking-[0.25em] text-[#FF3B1F] uppercase font-bold">
          PORTFOLIO ARCHIVE
        </span>
        <h1 className="font-display text-3xl sm:text-5xl md:text-7xl text-[#F5F5F5] uppercase tracking-tight">
          SELECTED PROJECTS
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-[#8A8A8A] max-w-2xl">
          Browse through all video production work, commercial campaigns, social reels, and narrative edits crafted with precision and passion.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch [perspective:1200px]">
        {projects.map((project, index) => (
          <ScrollProjectCard key={project.slug} index={index}>
            <WorkCard key={project.slug} project={project} index={index} />
          </ScrollProjectCard>
        ))}
      </div>
    </div>
  );
}
