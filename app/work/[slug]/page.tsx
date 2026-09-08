import { getProjectBySlug, getNextProject, projects } from "@/data/projects";
import VideoPlayer from "@/components/VideoPlayer";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return projects.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProjectBySlug(params.slug);
  if (!project) return { title: "Project Not Found" };

  return {
    title: `${project.title} — Mohammed Mahroof TM Video Editor`,
    description: project.description,
    openGraph: {
      title: `${project.title} | ${project.category} by Mohammed Mahroof TM`,
      description: project.description,
      images: [project.thumbnail],
    },
  };
}

export default function ProjectDetailPage({ params }: Props) {
  const project = getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  const nextProject = getNextProject(project.slug);

  return (
    <div className="w-full py-8 sm:py-12 md:py-20 px-4 sm:px-6 md:px-12 bg-black text-[#F5F5F5]">
      {/* Top Navigation Back Link */}
      <div className="mb-6 sm:mb-10">
        <Link
          href="/work"
          className="inline-flex items-center gap-2 font-mono text-xs text-[#888888] hover:text-[#FF3B1F] tracking-widest uppercase transition-colors py-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO ALL WORK</span>
        </Link>
      </div>

      {/* Header Info */}
      <div className="flex flex-col gap-3 sm:gap-4 mb-8 sm:mb-10 border-b border-white/10 pb-6 sm:pb-10">
        <div className="flex items-center gap-2.5 sm:gap-3 font-mono text-xs text-[#FF3B1F] uppercase font-semibold tracking-widest flex-wrap">
          <span>{project.number}</span>
          <span>•</span>
          <span>{project.category}</span>
          <span>•</span>
          <span>{project.year}</span>
        </div>

        <h1 className="font-display text-3xl sm:text-6xl md:text-8xl text-[#F5F5F5] uppercase tracking-tight leading-tight sm:leading-none">
          {project.title}
        </h1>
      </div>

      {/* Large Cinematic Video Player */}
      <div className="w-full mb-16">
        <VideoPlayer
          src={project.video}
          poster={project.thumbnail}
          autoPlay={false}
        />
      </div>

      {/* Project Meta Information Grid with rounded corners */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#0a0a0a] mb-16 font-mono text-xs shadow-xl">
        <div>
          <span className="text-[#888888] block uppercase mb-1">PROJECT</span>
          <span className="text-[#F5F5F5] font-semibold">{project.title}</span>
        </div>
        <div>
          <span className="text-[#888888] block uppercase mb-1">CATEGORY</span>
          <span className="text-[#F5F5F5] font-semibold">{project.category}</span>
        </div>
        <div>
          <span className="text-[#888888] block uppercase mb-1">ROLE</span>
          <span className="text-[#FF3B1F] font-semibold">{project.role}</span>
        </div>
        <div>
          <span className="text-[#888888] block uppercase mb-1">YEAR</span>
          <span className="text-[#F5F5F5] font-semibold">{project.year}</span>
        </div>
      </div>

      {/* About & Creative Approach */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
        {/* Left: About The Project */}
        <div className="lg:col-span-5 space-y-4">
          <span className="text-xs font-mono tracking-[0.25em] text-[#FF3B1F] uppercase font-semibold">
            PROJECT OVERVIEW
          </span>
          <h2 className="font-display text-3xl md:text-4xl text-[#F5F5F5] uppercase">
            ABOUT THE PROJECT
          </h2>
          <p className="text-base text-[#888888] leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Right: Creative Process Breakdown */}
        <div className="lg:col-span-7 space-y-6">
          <span className="text-xs font-mono tracking-[0.25em] text-[#FF3B1F] uppercase font-semibold">
            EDITORIAL PROCESS
          </span>
          <h2 className="font-display text-3xl md:text-4xl text-[#F5F5F5] uppercase">
            CREATIVE APPROACH
          </h2>

          <div className="space-y-4 border-t border-white/10 pt-4">
            <div className="border-b border-white/10 pb-4">
              <h3 className="text-sm font-mono font-bold text-[#F5F5F5] uppercase mb-1">
                01 • FOOTAGE SELECTION
              </h3>
              <p className="text-xs text-[#888888] leading-relaxed">
                {project.creativeApproach.footageSelection}
              </p>
            </div>

            <div className="border-b border-white/10 pb-4">
              <h3 className="text-sm font-mono font-bold text-[#F5F5F5] uppercase mb-1">
                02 • EDITING & PACING
              </h3>
              <p className="text-xs text-[#888888] leading-relaxed">
                {project.creativeApproach.editingAndPacing}
              </p>
            </div>

            <div className="border-b border-white/10 pb-4">
              <h3 className="text-sm font-mono font-bold text-[#F5F5F5] uppercase mb-1">
                03 • COLOR GRADING
              </h3>
              <p className="text-xs text-[#888888] leading-relaxed">
                {project.creativeApproach.colorGrading}
              </p>
            </div>

            <div className="border-b border-white/10 pb-4">
              <h3 className="text-sm font-mono font-bold text-[#F5F5F5] uppercase mb-1">
                04 • SOUND DESIGN
              </h3>
              <p className="text-xs text-[#888888] leading-relaxed">
                {project.creativeApproach.soundDesign}
              </p>
            </div>

            <div className="border-b border-white/10 pb-4">
              <h3 className="text-sm font-mono font-bold text-[#F5F5F5] uppercase mb-1">
                05 • MOTION GRAPHICS
              </h3>
              <p className="text-xs text-[#888888] leading-relaxed">
                {project.creativeApproach.motionGraphics}
              </p>
            </div>

            <div className="border-b border-white/10 pb-4">
              <h3 className="text-sm font-mono font-bold text-[#F5F5F5] uppercase mb-1">
                06 • FINAL DELIVERY
              </h3>
              <p className="text-xs text-[#888888] leading-relaxed">
                {project.creativeApproach.finalDelivery}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Stills Gallery */}
      <div className="space-y-6 mb-20 border-t border-white/10 pt-12">
        <span className="text-xs font-mono tracking-[0.25em] text-[#FF3B1F] uppercase font-semibold">
          FRAME STILLS
        </span>
        <h2 className="font-display text-3xl md:text-4xl text-[#F5F5F5] uppercase">
          SELECTED PROJECT STILLS
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {project.gallery?.map((still, idx) => (
            <div
              key={idx}
              className="relative aspect-video w-full rounded-2xl border border-white/10 overflow-hidden group bg-black shadow-lg"
            >
              <Image
                src={still}
                alt={`${project.title} still frame ${idx + 1}`}
                fill
                className="object-cover contrast-110 group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Next Project Footer Link */}
      <div className="border-t border-white/10 pt-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <Link
          href="/work"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/15 bg-white/5 font-mono text-xs text-[#888888] hover:text-[#FF3B1F] hover:border-[#FF3B1F]/40 uppercase transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO ALL WORK</span>
        </Link>

        <Link
          href={`/work/${nextProject.slug}`}
          className="group flex flex-col items-start md:items-end gap-1 text-left md:text-right rounded-2xl border border-white/10 p-6 bg-[#0a0a0a] hover:border-[#FF3B1F]/60 transition-all w-full md:w-auto min-w-[320px] shadow-xl"
        >
          <span className="font-mono text-[10px] text-[#FF3B1F] tracking-widest uppercase flex items-center gap-1 font-semibold">
            NEXT PROJECT <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </span>
          <span className="font-display text-3xl text-[#F5F5F5] group-hover:text-[#FF3B1F] transition-colors uppercase">
            {nextProject.title}
          </span>
          <span className="text-xs text-[#888888] font-mono">
            {nextProject.category} ({nextProject.year})
          </span>
        </Link>
      </div>
    </div>
  );
}
