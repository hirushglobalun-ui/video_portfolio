export interface Project {
  slug: string;
  number: string;
  title: string;
  category: string;
  year: string;
  role: string;
  thumbnail: string;
  video: string;
  description: string;
  creativeApproach: {
    footageSelection: string;
    editingAndPacing: string;
    colorGrading: string;
    soundDesign: string;
    motionGraphics: string;
    finalDelivery: string;
  };
  services: string[];
  gallery: string[];
}

export const projects: Project[] = [
  {
    slug: "premium-car-showcase",
    number: "01",
    title: "Premium Car Showcase",
    category: "Automotive",
    year: "2026",
    role: "Video Editor & Media Production",
    thumbnail: "/images/projects/project-02.jpg",
    video: "/videos/project-02.mp4",
    description:
      "A sleek, high-octane automotive film created for a premium car showroom. Features precision speed ramps, dynamic whip cuts, audio mixing for engine roars, and cinematic color correction.",
    creativeApproach: {
      footageSelection:
        "Selected tracking shots, low-angle chassis passes, and high-contrast interior detail clips.",
      editingAndPacing:
        "Aggressive pulse-matched edit curve ramping between slow-motion gloss shots and rapid cut sequences.",
      colorGrading:
        "High-contrast cool night tone balance emphasizing orange brake caliper flares and body reflections.",
      soundDesign:
        "Custom mechanical risers, exhaust rumble bass drops, and sharp camera shutter foley.",
      motionGraphics:
        "Clean minimal vehicle specification callouts and brand watermark.",
      finalDelivery:
        "Mastered in 4K widescreen for showroom displays and 9:16 vertical crop for social campaigns.",
    },
    services: [
      "Video Editing",
      "Color Grading",
      "Audio Design",
      "Speed Ramping",
    ],
    gallery: [
      "/images/projects/project-02.jpg",
      "/images/hero-bg.jpg",
      "/images/projects/project-06.jpg",
    ],
  },
  {
    slug: "social-campaign",
    number: "02",
    title: "Social Campaign",
    category: "Social Media",
    year: "2026",
    role: "Media Team Leader & Editor",
    thumbnail: "/images/projects/project-03.jpg",
    video: "/videos/project-03.mp4",
    description:
      "A fast-paced social media brand campaign optimized for digital platforms. Built around hook-driven editing, punchy text overlays, and high retention pacing.",
    creativeApproach: {
      footageSelection:
        "Curated high-energy performance clips and expressive human reactions for maximum hook strength.",
      editingAndPacing:
        "Rapid 0.5s cut rhythm designed specifically for short-form social engagement.",
      colorGrading:
        "Vibrant warm contrast enhancing skin tones against dark atmospheric backdrops.",
      soundDesign:
        "Beat-matched hip-hop transitions, pop sound effects, and crisp voiceover equalization.",
      motionGraphics:
        "Kinetic typography captions and animated call-to-action buttons.",
      finalDelivery:
        "Exported in multi-platform ratios (9:16 Reels/TikTok, 1:1 Feed, 16:9 Web).",
    },
    services: [
      "Social Media Editing",
      "Kinetic Motion Graphics",
      "Audio Clean-up & Mix",
      "Content Optimization",
    ],
    gallery: [
      "/images/projects/project-03.jpg",
      "/images/editor-portrait.jpg",
      "/images/projects/project-01.jpg",
    ],
  },
  {
    slug: "event-highlights",
    number: "03",
    title: "Event Highlights",
    category: "Event",
    year: "2025",
    role: "Video Editor & Production Specialist",
    thumbnail: "/images/projects/project-04.jpg",
    video: "/videos/project-04.mp4",
    description:
      "An immersive event highlight film capturing the energy, crowd interaction, and key keynote moments of a major brand launch.",
    creativeApproach: {
      footageSelection:
        "Organized multi-camera A/B footage, stage lighting takes, and candid audience moments.",
      editingAndPacing:
        "Build-up edit sequence moving from ambient arrival footage to climax stage moments.",
      colorGrading:
        "Balanced stage tungsten lighting against deep ambient venue shadows.",
      soundDesign:
        "Merged live venue audio with crisp master audio tracks and crowd applause risers.",
      motionGraphics:
        "Lower thirds for speakers and animated event title cards.",
      finalDelivery:
        "Delivered full recap edit and 60-second teaser cuts for social promotion.",
    },
    services: [
      "Event Video Editing",
      "Multi-Cam Sync",
      "Audio Mixing",
      "Color Correction",
    ],
    gallery: [
      "/images/projects/project-04.jpg",
      "/images/hero-bg.jpg",
      "/images/services-thumb.jpg",
    ],
  },
  {
    slug: "commercial-advertisement",
    number: "04",
    title: "Commercial Advertisement",
    category: "Advertisement",
    year: "2025",
    role: "Senior Video Editor",
    thumbnail: "/images/projects/project-01.jpg",
    video: "/videos/project-01.mp4",
    description:
      "A high-impact commercial advertisement created for digital and broadcast channels. Highlights product features with narrative flow and color grade precision.",
    creativeApproach: {
      footageSelection:
        "Selected hero macro product shots and cinematic talent interactions.",
      editingAndPacing:
        "Precise 30-second commercial timing with seamless visual match cuts.",
      colorGrading:
        "Signature film print emulation LUT with warm orange highlights and rich black shadows.",
      soundDesign:
        "Layered atmospheric soundscapes, product impact sound effects, and voiceover polish.",
      motionGraphics:
        "Product feature callouts and end-frame logo resolve animation.",
      finalDelivery:
        "Mastered to broadcast loudness compliance standards (-24 LUFS).",
    },
    services: [
      "Commercial Editing",
      "Color Grading",
      "Sound Design",
      "Motion Graphics",
    ],
    gallery: [
      "/images/projects/project-01.jpg",
      "/images/projects/project-05.jpg",
      "/images/services-thumb.jpg",
    ],
  },
  {
    slug: "creator-brand-film",
    number: "05",
    title: "Creator Brand Film",
    category: "Personal Branding",
    year: "2025",
    role: "Creative Editor & Production Lead",
    thumbnail: "/images/projects/project-05.jpg",
    video: "/videos/project-05.mp4",
    description:
      "A story-driven personal branding video for an influential creator. Focuses on authentic storytelling, interview cuts, and dramatic lighting passes.",
    creativeApproach: {
      footageSelection:
        "Curated intimate interview footage combined with dynamic B-roll activity passes.",
      editingAndPacing:
        "Rhythmic interview cutting keeping narrative flow engaging and void of filler pauses.",
      colorGrading:
        "Cinematic warm skin tone enhancement with deep shadow roll-off.",
      soundDesign:
        "Subtle acoustic background score ducked automatically around voice clarity EQ.",
      motionGraphics:
        "Custom quote overlays and social handle graphics.",
      finalDelivery:
        "Optimized for personal website hero and YouTube narrative upload.",
    },
    services: [
      "Personal Brand Editing",
      "Interview & B-roll Sync",
      "Voiceover EQ & Clean-up",
      "Color Correction",
    ],
    gallery: [
      "/images/projects/project-05.jpg",
      "/images/editor-portrait.jpg",
      "/images/projects/project-03.jpg",
    ],
  },
  {
    slug: "explainer-video",
    number: "06",
    title: "Explainer Video",
    category: "Explainer",
    year: "2026",
    role: "Video Editor & Motion Specialist",
    thumbnail: "/images/projects/project-06.jpg",
    video: "/videos/project-06.mp4",
    description:
      "A clear, engaging explainer video combining live-action product breakdown with motion graphics and 2D/3D callout tracking.",
    creativeApproach: {
      footageSelection:
        "Combined product demonstration footage with screen capture and graphic assets.",
      editingAndPacing:
        "Structured step-by-step edit cadence designed to maximize comprehension.",
      colorGrading:
        "Clean, vibrant corporate color grade with natural whites and punchy contrast.",
      soundDesign:
        "Friendly upbeat audio track synced with UI click and pops audio cues.",
      motionGraphics:
        "On-screen text callouts, arrow pointers, and feature highlight rings.",
      finalDelivery:
        "Delivered in HD web format and interactive video chunk exports.",
    },
    services: [
      "Explainer Editing",
      "2D/3D Motion Tracking",
      "Audio Post-Production",
      "Graphic Compositing",
    ],
    gallery: [
      "/images/projects/project-06.jpg",
      "/images/services-thumb.jpg",
      "/images/projects/project-02.jpg",
    ],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getNextProject(currentSlug: string): Project {
  const currentIndex = projects.findIndex((p) => p.slug === currentSlug);
  const nextIndex = (currentIndex + 1) % projects.length;
  return projects[nextIndex];
}
