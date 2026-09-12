import { collection, doc, setDoc, writeBatch } from "firebase/firestore";
import { db } from "./client";
import {
  defaultBrands,
  defaultServices,
  defaultSoftware,
  defaultExperience,
  defaultAbout,
  defaultHomepage,
  defaultSiteSettings,
  defaultSeo,
} from "@/lib/data";
import { categories as staticCategories, projects as staticProjects } from "@/data/projects";

export async function seedInitialFirestoreData(): Promise<{ success: boolean; message: string }> {
  if (!db) {
    throw new Error("Firebase Firestore is not initialized. Please verify your environment variables.");
  }

  try {
    const batch = writeBatch(db);

    // 1. Seed Categories
    for (let i = 0; i < staticCategories.length; i++) {
      const cat = staticCategories[i];
      const catRef = doc(db, "categories", cat.id);
      batch.set(catRef, {
        name: cat.name,
        slug: cat.slug,
        number: cat.number,
        tagline: cat.tagline,
        description: cat.description,
        thumbnail: cat.thumbnail,
        videoPreview: cat.videoPreview || "",
        displayOrder: i + 1,
        active: true,
      });
    }

    // 2. Seed Projects
    for (let i = 0; i < staticProjects.length; i++) {
      const p = staticProjects[i];
      const projRef = doc(db, "projects", p.slug);
      batch.set(projRef, {
        title: p.title,
        slug: p.slug,
        number: p.number,
        description: p.description,
        shortDescription: p.description.slice(0, 150) + "...",
        client: p.client || "Independent Client",
        year: p.year,
        role: p.role,
        runtime: p.duration || "01:00",
        category: p.category,
        categoryId: p.categorySlug,
        categorySlug: p.categorySlug,
        thumbnail: p.thumbnail,
        heroImage: p.thumbnail,
        videoUrl: p.video,
        videoProvider: p.video.includes("youtube") || p.video.includes("youtu.be")
          ? "youtube"
          : p.video.includes("vimeo")
          ? "vimeo"
          : "external",
        status: "published",
        featured: i < 6,
        displayOrder: i + 1,
        sections: {
          footageSelection: p.creativeApproach.footageSelection,
          editingAndPacing: p.creativeApproach.editingAndPacing,
          colorGrading: p.creativeApproach.colorGrading,
          soundDesign: p.creativeApproach.soundDesign,
          motionGraphics: p.creativeApproach.motionGraphics,
          finalDelivery: p.creativeApproach.finalDelivery,
        },
        gallery: (p.gallery || []).map((url, gIdx) => ({
          id: `${p.slug}-still-${gIdx}`,
          url,
          alt: `${p.title} frame still ${gIdx + 1}`,
          order: gIdx + 1,
        })),
        services: p.services || [],
        seoTitle: `${p.title} — Mohammed Mahroof TM Video Editor`,
        seoDescription: p.description,
        ogImage: p.thumbnail,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // 3. Seed Brands
    for (let i = 0; i < defaultBrands.length; i++) {
      const b = defaultBrands[i];
      const brandRef = doc(db, "brands", b.id || `brand-${i + 1}`);
      batch.set(brandRef, {
        name: b.name,
        displayOrder: b.displayOrder,
        active: b.active,
        website: "",
        logo: "",
      });
    }

    // 4. Seed Services
    for (let i = 0; i < defaultServices.length; i++) {
      const s = defaultServices[i];
      const sRef = doc(db, "services", s.id || `service-${i + 1}`);
      batch.set(sRef, {
        number: s.number,
        title: s.title,
        description: s.description,
        displayOrder: s.displayOrder,
        active: s.active,
      });
    }

    // 5. Seed Software
    for (let i = 0; i < defaultSoftware.length; i++) {
      const sw = defaultSoftware[i];
      const swRef = doc(db, "software", sw.id || `software-${i + 1}`);
      batch.set(swRef, {
        name: sw.name,
        role: sw.role,
        monogram: sw.monogram,
        color: sw.color,
        borderHover: sw.borderHover,
        accentText: sw.accentText,
        description: sw.description,
        highlights: sw.highlights,
        displayOrder: sw.displayOrder,
        active: sw.active,
      });
    }

    // 6. Seed Experience
    for (let i = 0; i < defaultExperience.length; i++) {
      const exp = defaultExperience[i];
      const expRef = doc(db, "experience", exp.id || `exp-${i + 1}`);
      batch.set(expRef, {
        period: exp.period,
        title: exp.title,
        company: exp.company,
        badge: exp.badge || "",
        current: exp.current || false,
        responsibilities: exp.responsibilities,
        displayOrder: exp.displayOrder,
      });
    }

    // 7. Seed Site Documents (About, Homepage, Settings, SEO)
    batch.set(doc(db, "site", "about"), defaultAbout);
    batch.set(doc(db, "site", "homepage"), defaultHomepage);
    batch.set(doc(db, "site", "settings"), defaultSiteSettings);
    batch.set(doc(db, "site", "seo"), defaultSeo);

    await batch.commit();

    return {
      success: true,
      message: `Successfully migrated ${staticProjects.length} projects, ${staticCategories.length} categories, experience, brands, and site content to Firestore!`,
    };
  } catch (error: any) {
    console.error("Data migration error:", error);
    throw new Error(error.message || "Failed to seed initial data.");
  }
}
