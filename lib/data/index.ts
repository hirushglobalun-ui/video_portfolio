import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase/client";
import {
  projects as staticProjects,
  categories as staticCategories,
  Category as StaticCategory,
  Project as StaticProject,
} from "@/data/projects";
import {
  Project,
  Category,
  Brand,
  ServiceItem,
  SoftwareTool,
  ExperienceRole,
  AboutContent,
  HomepageContent,
  SiteSettings,
  GlobalSeo,
} from "@/types/cms";

// ==========================================
// STATIC DEFAULTS FOR SEAMLESS GRACEFUL FALLBACK
// ==========================================

export const defaultBrands: Brand[] = [
  { id: "1", name: "ILLUMINATE ADS & PROMOTIONS", displayOrder: 1, active: true },
  { id: "2", name: "DUXBED INNOVATIONS", displayOrder: 2, active: true },
  { id: "3", name: "PREMIUM AUTOMOTIVE MEDIA", displayOrder: 3, active: true },
  { id: "4", name: "COMMERCIAL CAMPAIGNS", displayOrder: 4, active: true },
  { id: "5", name: "CREATOR BRAND FILMS", displayOrder: 5, active: true },
  { id: "6", name: "EVENT & EXPLAINER MEDIA", displayOrder: 6, active: true },
  { id: "7", name: "COLOR SCIENCE & MASTERING", displayOrder: 7, active: true },
];

export const defaultServices: ServiceItem[] = [
  {
    id: "1",
    number: "01",
    title: "Video Editing & Pacing",
    badge: "NLE & STORYTELLING",
    icon: "Film",
    description: "Precision rhythm alignment, seamless scene transitions, and narrative pacing crafted for commercial films and automotive rollouts.",
    points: [
      "Narrative Pacing & Tension Rhythm",
      "Multicam & Action Shot Synchronization",
      "High-Retention Hook & Intro Cutting"
    ],
    displayOrder: 1,
    active: true,
  },
  {
    id: "2",
    number: "02",
    title: "Commercial & Brand Films",
    badge: "COMMERCIAL & ADS",
    icon: "Tv",
    description: "High-retention commercial campaigns with broadcast-grade finishing tailored for television, digital billboards, and global brands.",
    points: [
      "Brand Identity & Visual Alignment",
      "Dynamic Pacing & High-Velocity Cuts",
      "Broadcast-Compliant Web Delivery"
    ],
    displayOrder: 2,
    active: true,
  },
  {
    id: "3",
    number: "03",
    title: "Automotive & Drift Films",
    badge: "AUTOMOTIVE SPECIALTY",
    icon: "Flame",
    description: "Adrenaline-fueled track rollouts, supercar speed ramps, engine roar sync, and cinematic anamorphic flare treatments.",
    points: [
      "Exhaust Sound Design & Roar Sync",
      "High-Speed Chase & Drift Motion Tracking",
      "Cinematic Lighting & Flare Enhancements"
    ],
    displayOrder: 3,
    active: true,
  },
  {
    id: "4",
    number: "04",
    title: "Color Grading & Look Dev",
    badge: "DAVINCI RESOLVE",
    icon: "Palette",
    description: "Bespoke cinematic look development, film emulation LUTs, natural skin tone perfection, and dynamic range color mastering.",
    points: [
      "Custom Film Emulation LUTs",
      "Skin Tone Isolation & Color Balance",
      "HDR & SDR Multi-Platform Mastering"
    ],
    displayOrder: 4,
    active: true,
  },
  {
    id: "5",
    number: "05",
    title: "Sound Design & Audio Mixing",
    badge: "AUDIO ENGINEERING",
    icon: "Volume2",
    description: "Multi-layered audio design featuring sub-bass impacts, spatial whooshes, atmospheric foley, and crystal-clear voice enhancement.",
    points: [
      "Sub-Bass Drops & Impact Foley",
      "Immersive 3D Stereo Soundscapes",
      "Vocal Clarity & Background Leveling"
    ],
    displayOrder: 5,
    active: true,
  },
  {
    id: "6",
    number: "06",
    title: "Motion Graphics & VFX",
    badge: "AFTER EFFECTS & VFX",
    icon: "Layers",
    description: "Kinetic typography, telemetry callouts, HUD overlays, screen replacements, visual cleanups, and high-energy graphics.",
    points: [
      "Kinetic Editorial Typography",
      "Vehicle Telemetry & HUD Spec Callouts",
      "Object Removal & Screen Cleanups"
    ],
    displayOrder: 6,
    active: true,
  },
];

export const defaultSoftware: SoftwareTool[] = [
  {
    id: "1",
    name: "ADOBE PREMIERE PRO",
    role: "NLE & STORYTELLING",
    monogram: "Pr",
    color: "from-[#9999FF]/20 to-[#6E44FF]/10",
    borderHover: "hover:border-[#9999FF]/50",
    accentText: "text-[#9999FF]",
    description: "Industry-standard timeline editor for commercial pacing, multicam synchronization, narrative structure, and audio mixing.",
    highlights: ["High-Velocity Timeline Pacing", "Multicam Clip Synchronization", "Audio Track Mixing & Foley Placement", "Dynamic Essential Graphics"],
    displayOrder: 1,
    active: true,
  },
  {
    id: "2",
    name: "DAVINCI RESOLVE",
    role: "COLOR GRADING & FINISHING",
    monogram: "Dr",
    color: "from-[#FF4E27]/20 to-[#FFA337]/10",
    borderHover: "hover:border-[#FF4E27]/50",
    accentText: "text-[#FF4E27]",
    description: "Bespoke cinematic color grading, film emulation LUTs, high dynamic range curves, and skin tone isolation.",
    highlights: ["Custom Cinematic Film LUTs", "Skin Tone Isolation & Balance", "HDR & SDR Broadcast Finishing", "Color Space Transformation"],
    displayOrder: 2,
    active: true,
  },
  {
    id: "3",
    name: "AFTER EFFECTS",
    role: "MOTION & VFX",
    monogram: "Ae",
    color: "from-[#6E44FF]/20 to-[#9999FF]/10",
    borderHover: "hover:border-[#6E44FF]/50",
    accentText: "text-[#9999FF]",
    description: "Kinetic typography, motion design, camera tracking, telemetry HUD overlays, screen replacements, and clean compositing.",
    highlights: ["Kinetic Editorial Typography", "Camera Tracking & Screen Cleanups", "Telemetry HUD Spec Overlays", "Speed Ramping & VFX Transitions"],
    displayOrder: 3,
    active: true,
  },
  {
    id: "4",
    name: "CAPCUT PRO",
    role: "SHORT-FORM & SOCIAL",
    monogram: "Cc",
    color: "from-[#00F0FF]/20 to-[#00A3FF]/10",
    borderHover: "hover:border-[#00F0FF]/40",
    accentText: "text-[#00F0FF]",
    description: "High-retention vertical reels, TikTok campaign edits, sound synchronization, dynamic captions, and trend pacing.",
    highlights: ["High-Retention Vertical Reels", "Beat-Synced Dynamic Cuts", "Custom Kinetic Auto-Captions", "Trend Adaptation Workflows"],
    displayOrder: 4,
    active: true,
  },
  {
    id: "5",
    name: "ADOBE PHOTOSHOP",
    role: "ASSETS & RETOUCHING",
    monogram: "Ps",
    color: "from-[#31A8FF]/20 to-[#0066FF]/10",
    borderHover: "hover:border-[#31A8FF]/50",
    accentText: "text-[#31A8FF]",
    description: "High-CTR YouTube thumbnails, poster art, texture creation, clean visual retouching, and custom matte composites.",
    highlights: ["High-CTR Thumbnail Design", "Poster & Key Art Composition", "Frame Retouching & Object Removal", "Digital Matte Painting"],
    displayOrder: 5,
    active: true,
  },
  {
    id: "6",
    name: "ADOBE LIGHTROOM",
    role: "PHOTO & STILLS GRADING",
    monogram: "Lr",
    color: "from-[#31A8FF]/15 to-[#0099FF]/5",
    borderHover: "hover:border-[#31A8FF]/50",
    accentText: "text-[#31A8FF]",
    description: "Raw photography processing, tone curve sculpting, batch look application, and high-fidelity still extraction.",
    highlights: ["Raw Negative Color Processing", "Custom Curve Sculpting", "Production Still Calibration", "Batch Preset Development"],
    displayOrder: 6,
    active: true,
  },
];

export const defaultExperience: ExperienceRole[] = [
  {
    id: "1",
    period: "2024 — PRESENT",
    title: "SENIOR EDITOR",
    company: "Illuminate Ads & Promotions",
    badge: "CURRENT ROLE",
    current: true,
    responsibilities: [
      "Strategically leading the media team and producing engaging content aligned with company objectives.",
      "Managing content creation workflows, resource allocation, and maintaining brand consistency across campaigns.",
      "Tracking performance metrics and fostering cross-functional team collaboration.",
    ],
    displayOrder: 1,
  },
  {
    id: "2",
    period: "2023 — 2024",
    title: "MEDIA TEAM LEADER",
    company: "DUXBED INNOVATIONS PVT LTD",
    badge: "PRODUCTION LEAD",
    current: false,
    responsibilities: [
      "Directed media team production schedules, workflows, and asset delivery.",
      "Oversaw multi-channel content creation while ensuring strict brand visual consistency.",
      "Collaborated with marketing leads to streamline post-production pipelines.",
    ],
    displayOrder: 2,
  },
  {
    id: "3",
    period: "2018 — PRESENT",
    title: "FREELANCE VIDEO EDITOR",
    company: "Independent Practice & Automotive Media",
    badge: "SOLO PRACTICE",
    current: false,
    responsibilities: [
      "End-to-end media production: Concept → Filming → Editing → Color Grading → Final Delivery.",
      "Specialized in premium car showroom content, event media management, personal branding, and commercial edits.",
      "Direct client communication and project delivery management.",
    ],
    displayOrder: 3,
  },
];

export const defaultAbout: AboutContent = {
  label: "ABOUT",
  headline: "I DON'T JUST EDIT VIDEOS.",
  subheadline: "I BUILD VISUAL STORIES THAT PEOPLE REMEMBER.",
  description: "Video Editor and Media Production Specialist with 4+ years of experience producing high-quality digital content for brands, agencies and premium automotive showrooms. Skilled in advanced video editing, color grading, audio design and project management. Experienced in leading media teams, handling client communication and transforming raw concepts into polished, impactful visuals.",
  profileImage: "/images/about-portrait.jpg",
  stats: [
    { number: "04+", label: "YEARS EXPERIENCE" },
    { number: "2018", label: "STARTED EDITING" },
    { number: "2024", label: "SENIOR EDITOR" },
  ],
  roles: [
    "SENIOR VIDEO EDITOR",
    "COMMERCIAL & BRAND FILMS",
    "AUTOMOTIVE & DRIFT EDITS",
    "COLOR GRADING & LOOK DEV",
    "SOUND DESIGN & AUDIO MIXING",
    "MOTION GRAPHICS & VFX",
    "NARRATIVE PACING & STORYTELLING",
    "HIGH-RETENTION SOCIAL REELS",
  ],
  yearsExperience: "4+",
  projectsCompleted: "50+",
  clients: "20+",
};

export const defaultHomepage: HomepageContent = {
  eyebrow: "MOHAMMED MAHROOF TM",
  title: "MAHROOF",
  subtitle: "SENIOR VIDEO EDITOR & MEDIA PRODUCTION SPECIALIST",
  description: "4+ years crafting commercial films, automotive showcases, and high-retention social media with precision rhythm and cinematic color.",
  primaryCtaText: "EXPLORE SELECTED WORK",
  primaryCtaLink: "#work",
  secondaryCtaText: "GET IN TOUCH",
  secondaryCtaLink: "#contact",
  heroImage: "/images/hero-bg.jpg",
  heroVideoUrl: "/videos/hero-bg.mp4",
};

export const defaultSiteSettings: SiteSettings = {
  name: "Mohammed Mahroof TM",
  email: "mahroofft@gmail.com",
  phone: "+91 85890 36403",
  whatsapp: "https://wa.me/918589036403",
  behance: "https://www.behance.net/mohammedmahroof",
  location: "Kerala, India",
  copyrightText: `© ${new Date().getFullYear()} Mohammed Mahroof TM. All Rights Reserved.`,
};

export const defaultSeo: GlobalSeo = {
  siteTitle: "Mohammed Mahroof TM — Senior Video Editor & Media Production Specialist",
  metaDescription: "Video Editor and Media Production Specialist with 4+ years of experience producing high-quality digital content for brands, agencies, and automotive showcases.",
  keywords: ["Mohammed Mahroof", "Video Editor", "DaVinci Resolve", "Premiere Pro", "Automotive Films", "Commercial Ads"],
  ogImage: "/images/hero-bg.jpg",
};

// ==========================================
// NORMALIZERS
// ==========================================

function normalizeStaticProject(sp: StaticProject, idx: number): Project {
  return {
    id: sp.slug,
    slug: sp.slug,
    number: sp.number,
    title: sp.title,
    description: sp.description,
    shortDescription: sp.description.slice(0, 150) + "...",
    client: sp.client || "Independent Client",
    year: sp.year,
    role: sp.role,
    runtime: sp.duration || "01:00",
    category: sp.category,
    categorySlug: sp.categorySlug,
    thumbnail: sp.thumbnail,
    videoUrl: sp.video,
    videoProvider: sp.video.includes("youtube") || sp.video.includes("youtu.be")
      ? "youtube"
      : sp.video.includes("vimeo")
      ? "vimeo"
      : "external",
    status: "published",
    featured: idx < 6,
    displayOrder: idx + 1,
    sections: {
      footageSelection: sp.creativeApproach.footageSelection,
      editingAndPacing: sp.creativeApproach.editingAndPacing,
      colorGrading: sp.creativeApproach.colorGrading,
      soundDesign: sp.creativeApproach.soundDesign,
      motionGraphics: sp.creativeApproach.motionGraphics,
      finalDelivery: sp.creativeApproach.finalDelivery,
    },
    gallery: (sp.gallery || []).map((url, gIdx) => ({
      id: `${sp.slug}-still-${gIdx}`,
      url,
      alt: `${sp.title} still frame ${gIdx + 1}`,
      order: gIdx + 1,
    })),
    services: sp.services || [],
  };
}

// ==========================================
// SMART CATEGORY-TAILORED AUTO THUMBNAIL
// ==========================================
export function getSmartThumbnail(category?: string, title?: string, videoUrl?: string): string {
  // 1. If YouTube video URL is present, extract high-res thumbnail
  if (videoUrl) {
    const ytMatch = videoUrl.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
    );
    if (ytMatch && ytMatch[1]) {
      return `https://img.youtube.com/vi/${ytMatch[1]}/maxresdefault.jpg`;
    }
  }

  const text = `${category || ""} ${title || ""}`.toLowerCase();

  // 2. Curated high-res cinematic images matching the genre
  if (
    text.includes("auto") ||
    text.includes("car") ||
    text.includes("drift") ||
    text.includes("bmw") ||
    text.includes("porsche") ||
    text.includes("speed") ||
    text.includes("motor") ||
    text.includes("vehicle")
  ) {
    return "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1600&q=85"; // Neon night supercar rollout
  }

  if (
    text.includes("commercial") ||
    text.includes("ad") ||
    text.includes("brand") ||
    text.includes("campaign") ||
    text.includes("product")
  ) {
    return "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1600&q=85"; // Studio cinema camera setup
  }

  if (
    text.includes("reel") ||
    text.includes("social") ||
    text.includes("tiktok") ||
    text.includes("short") ||
    text.includes("hook") ||
    text.includes("instagram")
  ) {
    return "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1600&q=85"; // Modern dynamic creator camera rig
  }

  if (
    text.includes("color") ||
    text.includes("grade") ||
    text.includes("davinci") ||
    text.includes("look dev") ||
    text.includes("lut") ||
    text.includes("grading")
  ) {
    return "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1600&q=85"; // Color grading suite with calibrated monitors
  }

  if (
    text.includes("event") ||
    text.includes("highlight") ||
    text.includes("concert") ||
    text.includes("wedding") ||
    text.includes("festival") ||
    text.includes("stage")
  ) {
    return "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&q=85"; // Atmospheric concert stage lights
  }

  if (
    text.includes("personal") ||
    text.includes("portrait") ||
    text.includes("creator") ||
    text.includes("docu") ||
    text.includes("story") ||
    text.includes("narrative")
  ) {
    return "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1600&q=85"; // Anamorphic cinema director monitor
  }

  if (
    text.includes("motion") ||
    text.includes("vfx") ||
    text.includes("3d") ||
    text.includes("cgi") ||
    text.includes("title") ||
    text.includes("explainer") ||
    text.includes("graphics")
  ) {
    return "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1600&q=85"; // Cyberpunk sci-fi motion graphics suite
  }

  // Cinematic editorial default
  return "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=1600&q=85";
}

// ==========================================
// PUBLIC DATA RETRIEVAL FUNCTIONS
// ==========================================

export async function getProjects(): Promise<Project[]> {
  if (isFirebaseConfigured() && db) {
    try {
      const snapshot = await getDocs(collection(db, "projects"));
      if (!snapshot.empty) {
        const list = snapshot.docs.map((docSnap) => {
          const d = docSnap.data() as Project;
          const finalThumb = d.thumbnail?.trim() || getSmartThumbnail(d.categorySlug || d.category, d.title, d.videoUrl);
          return {
            ...d,
            id: docSnap.id,
            status: "published",
            featured: true,
            thumbnail: finalThumb,
            heroImage: d.heroImage?.trim() || finalThumb,
          };
        }) as Project[];
        return list.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
      }
    } catch (err) {
      console.warn("Firestore getProjects notice:", err);
    }
  }

  // Fallback to real Behance static projects
  return staticProjects.map(normalizeStaticProject);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  return await getProjects();
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (isFirebaseConfigured() && db) {
    try {
      const q = query(
        collection(db, "projects"),
        where("slug", "==", slug)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const docSnap = snapshot.docs[0];
        const data = docSnap.data() as Project;
        const finalThumb = data.thumbnail?.trim() || getSmartThumbnail(data.categorySlug || data.category, data.title, data.videoUrl);
        return {
          id: docSnap.id,
          ...data,
          status: "published",
          featured: true,
          thumbnail: finalThumb,
          heroImage: data.heroImage?.trim() || finalThumb,
        };
      }
    } catch (err) {
      console.warn(`Firestore getProjectBySlug (${slug}) notice:`, err);
    }
  }

  const staticMatch = staticProjects.find((p) => p.slug === slug);
  if (staticMatch) {
    const idx = staticProjects.indexOf(staticMatch);
    return normalizeStaticProject(staticMatch, idx);
  }

  return null;
}

export async function getNextProject(currentSlug: string): Promise<Project | null> {
  const allProjects = await getProjects();
  const currentIndex = allProjects.findIndex((p) => p.slug === currentSlug);
  if (currentIndex === -1) return null;
  const nextIndex = (currentIndex + 1) % allProjects.length;
  return allProjects[nextIndex];
}

export async function getCategories(): Promise<Category[]> {
  if (isFirebaseConfigured() && db) {
    try {
      const q = query(
        collection(db, "categories"),
        where("active", "==", true)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const list = snapshot.docs.map((docSnap) => {
          const c = docSnap.data() as Category;
          return {
            id: docSnap.id,
            ...c,
            thumbnail: c.thumbnail?.trim() || getSmartThumbnail(c.slug || c.name, c.name),
          };
        }) as Category[];
        return list.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
      }
    } catch (err) {
      console.warn("Firestore getCategories notice:", err);
    }
  }

  // Fallback to real Behance categories
  return staticCategories.map((c, i) => ({
    id: c.id || c.slug,
    slug: c.slug,
    number: c.number || String(i + 1).padStart(2, "0"),
    name: c.name,
    tagline: c.tagline,
    description: c.description,
    thumbnail: c.thumbnail,
    videoPreview: c.videoPreview || "",
    displayOrder: i + 1,
    active: true,
  }));
}

export async function getBrands(): Promise<Brand[]> {
  if (isFirebaseConfigured() && db) {
    try {
      const q = query(
        collection(db, "brands"),
        where("active", "==", true)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const list = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })) as Brand[];
        return list.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
      }
    } catch (err) {
      console.warn("Firestore getBrands notice:", err);
    }
  }
  return defaultBrands;
}

export async function getServices(): Promise<ServiceItem[]> {
  if (isFirebaseConfigured() && db) {
    try {
      const q = query(
        collection(db, "services"),
        where("active", "==", true)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const list = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })) as ServiceItem[];
        return list.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
      }
    } catch (err) {
      console.warn("Firestore getServices notice:", err);
    }
  }
  return defaultServices;
}

export async function getSoftware(): Promise<SoftwareTool[]> {
  if (isFirebaseConfigured() && db) {
    try {
      const q = query(
        collection(db, "software"),
        where("active", "==", true)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const list = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })) as SoftwareTool[];
        return list.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
      }
    } catch (err) {
      console.warn("Firestore getSoftware notice:", err);
    }
  }
  return defaultSoftware;
}

export async function getExperience(): Promise<ExperienceRole[]> {
  if (isFirebaseConfigured() && db) {
    try {
      const snapshot = await getDocs(collection(db, "experience"));
      if (!snapshot.empty) {
        const list = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })) as ExperienceRole[];
        return list.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
      }
    } catch (err) {
      console.warn("Firestore getExperience notice:", err);
    }
  }
  return defaultExperience;
}

export async function getAbout(): Promise<AboutContent> {
  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, "site", "about");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as AboutContent;
      }
    } catch (err) {
      console.warn("Firestore getAbout notice:", err);
    }
  }
  return defaultAbout;
}

export async function getHomepage(): Promise<HomepageContent> {
  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, "site", "homepage");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as HomepageContent;
      }
    } catch (err) {
      console.warn("Firestore getHomepage notice:", err);
    }
  }
  return defaultHomepage;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, "site", "settings");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as SiteSettings;
      }
    } catch (err) {
      console.warn("Firestore getSiteSettings notice:", err);
    }
  }
  return defaultSiteSettings;
}

export async function getGlobalSeo(): Promise<GlobalSeo> {
  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, "site", "seo");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as GlobalSeo;
      }
    } catch (err) {
      console.warn("Firestore getGlobalSeo notice:", err);
    }
  }
  return defaultSeo;
}
