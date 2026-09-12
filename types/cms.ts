export type VideoProvider = "youtube" | "vimeo" | "external";
export type ProjectStatus = "draft" | "published";

export interface CaseStudySection {
  title: string;
  description: string;
  image?: string;
  videoUrl?: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  alt?: string;
  caption?: string;
  order: number;
}

export interface Project {
  id?: string;
  slug: string;
  number?: string;
  title: string;
  shortDescription?: string;
  description: string;
  client?: string;
  year: string;
  role: string;
  runtime?: string;
  category: string;
  categoryId?: string;
  categorySlug: string;
  thumbnail: string;
  heroImage?: string;
  videoUrl: string;
  videoProvider: VideoProvider;
  status: ProjectStatus;
  featured: boolean;
  displayOrder: number;
  sections?: {
    footageSelection?: string;
    editingAndPacing?: string;
    colorGrading?: string;
    soundDesign?: string;
    motionGraphics?: string;
    finalDelivery?: string;
    [key: string]: string | undefined;
  };
  customSections?: CaseStudySection[];
  gallery: GalleryItem[];
  services: string[];
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id?: string;
  slug: string;
  number?: string;
  name: string;
  tagline?: string;
  description: string;
  thumbnail?: string;
  videoPreview?: string;
  displayOrder: number;
  active: boolean;
}

export interface Brand {
  id?: string;
  name: string;
  logo?: string;
  website?: string;
  description?: string;
  displayOrder: number;
  active: boolean;
}

export interface ServiceItem {
  id?: string;
  number?: string;
  title: string;
  slug?: string;
  description?: string;
  badge?: string;
  icon?: string;
  points?: string[];
  displayOrder: number;
  active: boolean;
}

export interface SoftwareTool {
  id?: string;
  name: string;
  role: string;
  monogram: string;
  skillLevel?: number; // 0 to 100
  color?: string;
  borderHover?: string;
  accentText?: string;
  description: string;
  highlights: string[];
  displayOrder: number;
  active: boolean;
}

export interface ExperienceRole {
  id?: string;
  period: string;
  title: string;
  company: string;
  badge?: string;
  current?: boolean;
  location?: string;
  responsibilities: string[];
  displayOrder: number;
}

export interface StatItem {
  number: string;
  label: string;
}

export interface AboutContent {
  label: string;
  headline: string;
  subheadline: string;
  description: string;
  profileImage?: string;
  stats: StatItem[];
  roles?: string[]; // Ticker strip roles & specialties ("What I Do / Who I Am")
  yearsExperience?: string;
  projectsCompleted?: string;
  clients?: string;
}

export interface HomepageContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  heroImage?: string;
  heroVideoUrl?: string;
}

export interface SiteSettings {
  name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  vimeo?: string;
  behance?: string;
  location?: string;
  copyrightText?: string;
}

export interface GlobalSeo {
  siteTitle: string;
  metaDescription: string;
  keywords: string[];
  ogImage?: string;
}

export interface MediaAsset {
  id?: string;
  url: string;
  name: string;
  category: "projects" | "profile" | "brands" | "homepage" | "other";
  size?: number;
  contentType?: string;
  createdAt: string;
}

export interface AdminUser {
  uid: string;
  email: string;
  role: "admin";
  active: boolean;
}
