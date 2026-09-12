import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDocs } from "firebase/firestore";
import * as fs from "fs";
import * as path from "path";

// Load .env.local
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const [key, ...vals] = trimmed.split("=");
      process.env[key.trim()] = vals.join("=").trim();
    }
  });
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

console.log("Connecting to Firebase project:", firebaseConfig.projectId);
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const categories = [
  {
    id: "automotive-films",
    slug: "automotive-films",
    number: "01",
    name: "Automotive Films",
    tagline: "High-octane automotive reels and cinematic rolling shots",
    description: "Precision-cut automotive films, exhaust sound design, rolling speed cuts, and commercial car detailing showcases.",
    thumbnail: "https://mir-s3-cdn-cf.behance.net/projects/original_webp/6ec151249370781.Y3JvcCwxMDY4LDgzNSwwLDY2Ng.png",
    displayOrder: 1,
    active: true,
  },
  {
    id: "commercial-ads",
    slug: "commercial-ads",
    number: "02",
    name: "Brand Promos & Commercials",
    tagline: "Dynamic commercial campaigns and brand launches",
    description: "High-retention commercial advertisements, brand launches, and corporate fast-cut showcases.",
    thumbnail: "https://mir-s3-cdn-cf.behance.net/projects/original_webp/989d85249440489.Y3JvcCwxMDcwLDgzNiwwLDM5OQ.png",
    displayOrder: 2,
    active: true,
  },
  {
    id: "real-estate-drone",
    slug: "real-estate-drone",
    number: "03",
    name: "Real Estate & Drone",
    tagline: "Aerial drone cinematography & architectural showcases",
    description: "Dynamic construction progress films, architectural overviews, drone fast-cuts, and builder campaign reels.",
    thumbnail: "https://mir-s3-cdn-cf.behance.net/projects/original_webp/632b2d235630137.Y3JvcCw5ODYsNzcxLDAsNDU4.png",
    displayOrder: 3,
    active: true,
  },
  {
    id: "events-fast-cut",
    slug: "events-fast-cut",
    number: "04",
    name: "Event & Fast-Cut Films",
    tagline: "High-energy event recaps & ceremony highlights",
    description: "Fast-paced graduation ceremonies, community meets, and high-tempo event editorial recaps.",
    thumbnail: "https://mir-s3-cdn-cf.behance.net/projects/original_webp/66e84e249370299.Y3JvcCwxMDY4LDgzNSwwLDYwMg.png",
    displayOrder: 4,
    active: true,
  },
];

const projectsJsonPath = "C:\\Users\\HP\\.gemini\\antigravity-ide\\brain\\9daef00e-cf69-4e37-9419-cfdba96d5673\\scratch\\final_behance_projects.json";
const rawProjects = JSON.parse(fs.readFileSync(projectsJsonPath, "utf-8"));

async function seed() {
  console.log("Seeding categories...");
  for (const cat of categories) {
    const catRef = doc(db, "categories", cat.id);
    await setDoc(catRef, cat, { merge: true });
    console.log(`Saved category: ${cat.name} (${cat.slug})`);
  }

  console.log("\nSeeding 12 Behance projects...");
  let idx = 1;
  for (const p of rawProjects) {
    const num = String(idx).padStart(2, "0");
    const projData = {
      slug: p.slug,
      number: num,
      title: p.title,
      shortDescription: p.description.slice(0, 150) + "...",
      description: p.description,
      client: p.client || "Commercial Client",
      year: p.year || "2024 - 2026",
      role: p.role || "Senior Video Editor & Colorist",
      runtime: "01:00",
      category: p.category,
      categorySlug: p.categorySlug,
      thumbnail: p.thumbnail,
      heroImage: p.heroImage || p.thumbnail,
      videoUrl: p.videoUrl,
      videoProvider: "external",
      status: "published",
      featured: true,
      displayOrder: p.displayOrder || idx,
      sections: {
        footageSelection: "Carefully curated dynamic takes selecting prime movement, sharp focus, and high-impact actions.",
        editingAndPacing: "Beat-synced fast cuts paired with breathing room for key beauty and motion shots.",
        colorGrading: "Bespoke cinematic palette graded in DaVinci Resolve with rich contrast and rich skin tones.",
        soundDesign: "Multi-layered whooshes, engine roars, impacts, and rhythmic sound effects for full immersion.",
        motionGraphics: "Clean typography, kinetic titles, and smooth speed ramping.",
        finalDelivery: "High-bitrate ProRes and web-optimized 4K master delivery."
      },
      gallery: [
        {
          id: `${p.slug}-still-1`,
          url: p.thumbnail,
          alt: `${p.title} master shot`,
          order: 1
        }
      ],
      services: [
        "Commercial Video Editing",
        "Cinematic Color Grading",
        "Sound Design & Foley",
        "Pacing & Speed Ramping"
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const projRef = doc(db, "projects", p.slug);
    await setDoc(projRef, projData, { merge: true });
    console.log(`Saved project [${num}/12]: ${p.title} -> ${p.slug}`);
    idx++;
  }

  console.log("\nVerifying Firestore records count...");
  const snapProjs = await getDocs(collection(db, "projects"));
  console.log(`Total projects in Firestore: ${snapProjs.size}`);
  const snapCats = await getDocs(collection(db, "categories"));
  console.log(`Total categories in Firestore: ${snapCats.size}`);
  console.log("Seed completed successfully!");
}

seed().catch(err => {
  console.error("Seed error:", err);
  process.exit(1);
});
