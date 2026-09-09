export interface Category {
  id: string;
  slug: string;
  number: string;
  name: string;
  tagline: string;
  description: string;
  thumbnail: string;
  videoPreview?: string;
}

export interface Project {
  slug: string;
  number: string;
  title: string;
  category: string;
  categorySlug: string;
  year: string;
  duration?: string;
  role: string;
  client?: string;
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

export const categories: Category[] = [
  {
    id: "automotive",
    slug: "automotive",
    number: "01",
    name: "Automotive Films",
    tagline: "Speed Ramp & Cinematic Sound",
    description: "High-octane supercar showcases, dealership launches, precision speed ramps, and roaring engine soundscapes.",
    thumbnail: "/images/projects/project-02.jpg",
    videoPreview: "/videos/project-02.mp4",
  },
  {
    id: "commercial-ads",
    slug: "commercial-ads",
    number: "02",
    name: "Commercial & Ads",
    tagline: "TVC & Digital Product Campaigns",
    description: "High-retention commercial advertisements crafted with narrative flow, film LUT grading, and broadcast-ready finishing.",
    thumbnail: "/images/projects/project-01.jpg",
    videoPreview: "/videos/project-01.mp4",
  },
  {
    id: "social-media",
    slug: "social-media",
    number: "03",
    name: "Social Media & Reels",
    tagline: "High-Retention 9:16 Viral Cuts",
    description: "Fast-paced TikTok and Instagram Reels edits engineered with 3-second hooks, kinetic typography, and audio synchronization.",
    thumbnail: "/images/projects/project-03.jpg",
    videoPreview: "/videos/project-03.mp4",
  },
  {
    id: "event-highlights",
    slug: "event-highlights",
    number: "04",
    name: "Event Highlights",
    tagline: "Multi-Cam Sync & Aftermovies",
    description: "Dynamic recap films capturing crowd energy, keynote moments, stage lighting choreography, and atmospheric sound.",
    thumbnail: "/images/projects/project-04.jpg",
    videoPreview: "/videos/project-04.mp4",
  },
  {
    id: "personal-branding",
    slug: "personal-branding",
    number: "05",
    name: "Personal Branding",
    tagline: "Story-Driven Creator Films",
    description: "Intimate creator profiles, talking-head interviews, cinematic lighting, and compelling visual narrative pacing.",
    thumbnail: "/images/projects/project-05.jpg",
    videoPreview: "/videos/project-05.mp4",
  },
  {
    id: "explainer-motion",
    slug: "explainer-motion",
    number: "06",
    name: "Explainer & Motion",
    tagline: "2D/3D Kinetic Graphics & VFX",
    description: "Clean product breakdowns, visual tutorials, UI callout tracking, and graphic animations that clarify complex ideas.",
    thumbnail: "/images/projects/project-06.jpg",
    videoPreview: "/videos/project-06.mp4",
  },
];

export const projects: Project[] = [
  // 1. AUTOMOTIVE
  {
    slug: "premium-car-showcase",
    number: "01",
    title: "Premium Car Showcase",
    category: "Automotive Films",
    categorySlug: "automotive",
    year: "2026",
    duration: "1:24",
    role: "Video Editor & Media Production",
    client: "Velocity Motors",
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
    slug: "supercar-night-drift",
    number: "02",
    title: "Supercar Night Drift & Rollout",
    category: "Automotive Films",
    categorySlug: "automotive",
    year: "2025",
    duration: "0:58",
    role: "Lead Post-Production Editor",
    client: "Apex Auto Club",
    thumbnail: "/images/hero-bg.jpg",
    video: "/videos/hero.mp4",
    description:
      "Adrenaline-fueled night track rollout with neon city reflection passes, synchronized tire squeal foley, and dramatic anamorphic optical flares.",
    creativeApproach: {
      footageSelection: "Gimbal car-to-car chase shots and high-speed drone dives.",
      editingAndPacing: "Fast rhythmic tempo syncing exhaust backfires with bass hits.",
      colorGrading: "Stylized cyan/orange color separation with deep velvet blacks.",
      soundDesign: "Multi-layered engine throttle recordings and sub-bass whooshes.",
      motionGraphics: "Subtle corner speed and RPM telemetry callouts.",
      finalDelivery: "High-bitrate cinematic web master.",
    },
    services: ["Cinematic Editing", "Color Grading", "Sound Foley", "Drone Cuts"],
    gallery: ["/images/hero-bg.jpg", "/images/projects/project-02.jpg"],
  },

  // 2. COMMERCIAL & ADS
  {
    slug: "commercial-advertisement",
    number: "03",
    title: "Commercial Advertisement",
    category: "Commercial & Ads",
    categorySlug: "commercial-ads",
    year: "2025",
    duration: "0:30",
    role: "Senior Video Editor",
    client: "Illuminate Brands",
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
    slug: "product-launch-campaign",
    number: "04",
    title: "Minimalist Product Launch Spot",
    category: "Commercial & Ads",
    categorySlug: "commercial-ads",
    year: "2026",
    duration: "0:45",
    role: "Commercial Post-Production Specialist",
    client: "Nordic Audio",
    thumbnail: "/images/services-thumb.jpg",
    video: "/videos/project-03.mp4",
    description:
      "Crisp studio commercial spotlighting hardware ergonomics, texture macro passes, and architectural lighting transitions.",
    creativeApproach: {
      footageSelection: "Turntable motor rotations and hand-feel tactile clips.",
      editingAndPacing: "Elegant slow-build pacing concluding with rapid kinetic resolution.",
      colorGrading: "Neutral clean high-key tones with subtle golden hour warmth.",
      soundDesign: "ASMR tactile click details and spatial ambient score.",
      motionGraphics: "Typography minimalism with typographic tracking.",
      finalDelivery: "Social promo cuts and YouTube preroll exports.",
    },
    services: ["Commercial Cut", "Product Grading", "Audio Mixing", "Title Animation"],
    gallery: ["/images/services-thumb.jpg", "/images/projects/project-01.jpg"],
  },

  // 3. SOCIAL MEDIA & REELS
  {
    slug: "social-campaign",
    number: "05",
    title: "Viral Social Campaign",
    category: "Social Media & Reels",
    categorySlug: "social-media",
    year: "2026",
    duration: "0:28",
    role: "Media Team Leader & Editor",
    client: "Pulse Lifestyle Agency",
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
    slug: "trend-cut-tiktok-series",
    number: "06",
    title: "High-Retention Streetwear Reels",
    category: "Social Media & Reels",
    categorySlug: "social-media",
    year: "2025",
    duration: "0:35",
    role: "Short-Form Editor",
    client: "HypeCulture Media",
    thumbnail: "/images/projects/project-04.jpg",
    video: "/videos/project-04.mp4",
    description:
      "Vertical trend edits engineered for maximum retention rate and shareability with audio beat drop synchronization and dynamic snap zooms.",
    creativeApproach: {
      footageSelection: "Street fashion portrait b-roll and quick movement swipes.",
      editingAndPacing: "Speed-ramped snap zoom cuts on every percussion transient.",
      colorGrading: "Retro warm film grain emulation.",
      soundDesign: "Sub-drops, paper rip textures, and cassette tape whooshes.",
      motionGraphics: "Floating dynamic captions with glow effects.",
      finalDelivery: "Native 1080x1920 60FPS vertical delivery.",
    },
    services: ["Vertical Reels", "Sound Pacing", "Captions", "Hook Retention"],
    gallery: ["/images/projects/project-04.jpg", "/images/projects/project-03.jpg"],
  },

  // 4. EVENT HIGHLIGHTS
  {
    slug: "event-highlights",
    number: "07",
    title: "Event Highlights & Recap",
    category: "Event Highlights",
    categorySlug: "event-highlights",
    year: "2025",
    duration: "2:10",
    role: "Video Editor & Production Specialist",
    client: "Nexus Global Summit",
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
    slug: "music-festival-aftermovie",
    number: "08",
    title: "Electronic Music Festival Aftermovie",
    category: "Event Highlights",
    categorySlug: "event-highlights",
    year: "2025",
    duration: "1:45",
    role: "Festival Lead Editor",
    client: "Echoes Night Festival",
    thumbnail: "/images/projects/project-02.jpg",
    video: "/videos/project-02.mp4",
    description:
      "High-energy festival recap featuring stage pyrotechnics, laser displays, crowd emotional reactions, and synchronized musical drop sequences.",
    creativeApproach: {
      footageSelection: "Laser rig aerial passes and front-row crowd slow-motion cuts.",
      editingAndPacing: "Emotional slow-tempo intro accelerating into rapid dance pacing.",
      colorGrading: "Vivid RGB stage lighting saturation preservation.",
      soundDesign: "Bass swell risers, crowd cheers, and seamless live-to-studio audio blend.",
      motionGraphics: "Glow particle title overlays.",
      finalDelivery: "4K YouTube Premiere master.",
    },
    services: ["Multi-Camera Editing", "Audio Mastering", "Lighting Grade", "Trailer Cut"],
    gallery: ["/images/projects/project-02.jpg", "/images/projects/project-04.jpg"],
  },

  // 5. PERSONAL BRANDING
  {
    slug: "creator-brand-film",
    number: "09",
    title: "Creator Brand Film",
    category: "Personal Branding",
    categorySlug: "personal-branding",
    year: "2025",
    duration: "1:55",
    role: "Creative Editor & Production Lead",
    client: "Rayhan Media",
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
    slug: "founder-journey-documentary",
    number: "10",
    title: "Founder Journey Mini-Doc",
    category: "Personal Branding",
    categorySlug: "personal-branding",
    year: "2026",
    duration: "2:40",
    role: "Narrative Director & Editor",
    client: "Genesis Ventures",
    thumbnail: "/images/editor-portrait.jpg",
    video: "/videos/project-01.mp4",
    description:
      "Cinematic documentary profile capturing entrepreneurial struggles, breakthrough moments, and company vision with emotive musical progression.",
    creativeApproach: {
      footageSelection: "Black and white archival photographs blended with modern 4K interviews.",
      editingAndPacing: "Deliberate documentary cadence emphasizing key voice quotes.",
      colorGrading: "Kodak 2383 film stock look with balanced natural highlights.",
      soundDesign: "Dynamic orchestral score and gentle room tone equalization.",
      motionGraphics: "Clean typewriter title cards and chapter markers.",
      finalDelivery: "High-resolution master for investor presentations.",
    },
    services: ["Documentary Editing", "Story Pacing", "Voice Clarity", "LUT Color Grade"],
    gallery: ["/images/editor-portrait.jpg", "/images/projects/project-05.jpg"],
  },

  // 6. EXPLAINER & MOTION
  {
    slug: "explainer-video",
    number: "11",
    title: "Interactive Explainer Video",
    category: "Explainer & Motion",
    categorySlug: "explainer-motion",
    year: "2026",
    duration: "1:15",
    role: "Video Editor & Motion Specialist",
    client: "DUX Innovations",
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
  {
    slug: "fintech-app-motion-teaser",
    number: "12",
    title: "Fintech App 3D Motion Teaser",
    category: "Explainer & Motion",
    categorySlug: "explainer-motion",
    year: "2025",
    duration: "0:40",
    role: "Motion Graphics & Compositor",
    client: "VaultPay Technologies",
    thumbnail: "/images/projects/project-01.jpg",
    video: "/videos/project-06.mp4",
    description:
      "Fast kinetic typography and UI screen parallax showcase highlighting encrypted transactions, frictionless payments, and modern fintech design.",
    creativeApproach: {
      footageSelection: "Rendered 3D phone model turns and vector screen recordings.",
      editingAndPacing: "Punchy snappy motion curves with zero easing lag.",
      colorGrading: "Deep dark mode palette with vibrant electric orange accents.",
      soundDesign: "Digital telemetry beeps, cash register chime foley, and whoosh transitions.",
      motionGraphics: "Floating 3D glass cards and animated holographic shields.",
      finalDelivery: "App Store promo video and web hero looped video.",
    },
    services: ["Motion Design", "UI Tracking", "Sound Effects", "Kinetic Typography"],
    gallery: ["/images/projects/project-01.jpg", "/images/projects/project-06.jpg"],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getProjectsByCategory(categorySlug: string): Project[] {
  if (!categorySlug || categorySlug === "all") return projects;
  return projects.filter((p) => p.categorySlug.toLowerCase() === categorySlug.toLowerCase());
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
}

export function getNextProject(currentSlug: string): Project {
  const currentIndex = projects.findIndex((p) => p.slug === currentSlug);
  const nextIndex = (currentIndex + 1) % projects.length;
  return projects[nextIndex];
}
