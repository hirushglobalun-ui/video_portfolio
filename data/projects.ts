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
    id: "automotive-films",
    slug: "automotive-films",
    number: "01",
    name: "Automotive Films",
    tagline: "High-octane automotive reels and cinematic rolling shots",
    description: "Precision-cut automotive films, exhaust sound design, rolling speed cuts, and commercial car detailing showcases.",
    thumbnail: "https://mir-s3-cdn-cf.behance.net/projects/original_webp/6ec151249370781.Y3JvcCwxMDY4LDgzNSwwLDY2Ng.png",
    videoPreview: "https://www-ccv.adobe.io/v1/player/ccv/8IXjr3HYm2M/embed?api_key=behance1&bgcolor=%23191919",
  },
  {
    id: "commercial-ads",
    slug: "commercial-ads",
    number: "02",
    name: "Brand Promos & Commercials",
    tagline: "Dynamic commercial campaigns and brand launches",
    description: "High-retention commercial advertisements, brand launches, and corporate fast-cut showcases.",
    thumbnail: "https://mir-s3-cdn-cf.behance.net/projects/original_webp/989d85249440489.Y3JvcCwxMDcwLDgzNiwwLDM5OQ.png",
    videoPreview: "https://www-ccv.adobe.io/v1/player/ccv/4bkmxqDMqa9/embed?api_key=behance1&bgcolor=%23191919",
  },
  {
    id: "real-estate-drone",
    slug: "real-estate-drone",
    number: "03",
    name: "Real Estate & Drone",
    tagline: "Aerial drone cinematography & architectural showcases",
    description: "Dynamic construction progress films, architectural overviews, drone fast-cuts, and builder campaign reels.",
    thumbnail: "https://mir-s3-cdn-cf.behance.net/projects/original_webp/632b2d235630137.Y3JvcCw5ODYsNzcxLDAsNDU4.png",
    videoPreview: "https://www-ccv.adobe.io/v1/player/ccv/LKcKq6YXnfQ/embed?api_key=behance1&bgcolor=%23191919",
  },
  {
    id: "events-fast-cut",
    slug: "events-fast-cut",
    number: "04",
    name: "Event & Fast-Cut Films",
    tagline: "High-energy event recaps & ceremony highlights",
    description: "Fast-paced graduation ceremonies, community meets, and high-tempo event editorial recaps.",
    thumbnail: "https://mir-s3-cdn-cf.behance.net/projects/original_webp/66e84e249370299.Y3JvcCwxMDY4LDgzNSwwLDYwMg.png",
    videoPreview: "https://www-ccv.adobe.io/v1/player/ccv/JieHHiBGm8N/embed?api_key=behance1&bgcolor=%23191919",
  },
];

export const projects: Project[] = [
  {
    slug: "business-meet-uae-fastcut",
    number: "01",
    title: "Business Meet — UAE — Fastcut",
    category: "Brand Promos & Commercials",
    categorySlug: "commercial-ads",
    client: "UAE Commercial Client",
    year: "2024",
    duration: "01:00",
    role: "Senior Video Editor & Colorist",
    thumbnail: "https://mir-s3-cdn-cf.behance.net/projects/original_webp/989d85249440489.Y3JvcCwxMDcwLDgzNiwwLDM5OQ.png",
    video: "https://www-ccv.adobe.io/v1/player/ccv/4bkmxqDMqa9/embed?api_key=behance1&bgcolor=%23191919",
    description: "High-octane corporate business summit film crafted for international audience engagement in Dubai, UAE. Featuring rapid visual pacing, precision dialogue cuts, and modern aesthetic color mastering.",
    creativeApproach: {
      footageSelection: "Curated key moments of leadership address, audience engagement, and high-level networking.",
      editingAndPacing: "High-velocity cut cadence timed to driving modern percussion and tech-forward rhythms.",
      colorGrading: "Cool corporate clean tones balanced with warm ambient stage highlights in DaVinci Resolve.",
      soundDesign: "Bespoke whooshes, ambient auditorium texture, and spatial conference room audio design.",
      motionGraphics: "Sleek lower-thirds, kinetic event branding, and keynote topic cards.",
      finalDelivery: "4K master delivery optimized for social broadcast, LinkedIn, and brand archives."
    },
    services: ["Event Fast-Cut", "Color Grading", "Sound Design", "Audio Mastering"],
    gallery: ["https://mir-s3-cdn-cf.behance.net/projects/original_webp/989d85249440489.Y3JvcCwxMDcwLDgzNiwwLDM5OQ.png"]
  },
  {
    slug: "car-detailing-fastcut-uae",
    number: "02",
    title: "Car Detailing — Fastcut — UAE",
    category: "Automotive Films",
    categorySlug: "automotive-films",
    client: "UAE Detailing Studio",
    year: "2024",
    duration: "01:00",
    role: "Senior Video Editor & Colorist",
    thumbnail: "https://mir-s3-cdn-cf.behance.net/projects/original_webp/6ec151249370781.Y3JvcCwxMDY4LDgzNSwwLDY2Ng.png",
    video: "https://www-ccv.adobe.io/v1/player/ccv/8IXjr3HYm2M/embed?api_key=behance1&bgcolor=%23191919",
    description: "Hyper-focused automotive aesthetics film showcasing ultra-luxury vehicle detailing in the UAE. Rhythmic polisher passes, water beading macros, and metallic flake depth.",
    creativeApproach: {
      footageSelection: "Isolated micro-detail shots of ceramic coating, gloss enhancement, and high-pressure steam rinses.",
      editingAndPacing: "Snappy mechanical cuts aligned with machine frequencies and bass-heavy hip-hop downbeats.",
      colorGrading: "Deep black specular curves highlighting paint reflection clarity and mirror finishes.",
      soundDesign: "Enhanced foam gun spray textures, buffing pad friction, and engine exhaust rumble.",
      motionGraphics: "Minimal luxury brand typography with metallic gloss wipe accents.",
      finalDelivery: "Ultra-sharp 4K Instagram 9:16 and 16:9 commercial cutdowns."
    },
    services: ["Automotive Editing", "Macro Sound Design", "Commercial Color", "Speed Ramping"],
    gallery: ["https://mir-s3-cdn-cf.behance.net/projects/original_webp/6ec151249370781.Y3JvcCwxMDY4LDgzNSwwLDY2Ng.png"]
  },
  {
    slug: "automotive-shoot-slow-cut-kawasaki",
    number: "03",
    title: "Automotive Shoot — Slow Cut — Kawasaki",
    category: "Automotive Films",
    categorySlug: "automotive-films",
    client: "Kawasaki",
    year: "2024",
    duration: "01:00",
    role: "Senior Video Editor & Colorist",
    thumbnail: "https://mir-s3-cdn-cf.behance.net/projects/original_webp/e6499f249370465.Y3JvcCw4NjIsNjc0LDAsNTYz.png",
    video: "https://www-ccv.adobe.io/v1/player/ccv/9hkHruCdvb-/embed?api_key=behance1&bgcolor=%23191919",
    description: "Atmospheric and brooding slow-cut visual poem centered on the menacing design and aggressive stance of Kawasaki superbikes.",
    creativeApproach: {
      footageSelection: "Selected smooth gimbal moves, dramatic low-angles, and headlight ignition flares.",
      editingAndPacing: "Deliberate, tension-building pacing that allows the motorcycle's muscular contours to breathe.",
      colorGrading: "Signature Kawasaki green isolation amidst moody desaturated industrial contrast.",
      soundDesign: "Sub-bass throbs, high-RPM exhaust wails echoing in distance, and visor click foley.",
      motionGraphics: "Cinematic anamorphic letterboxing with subdued technical specification overlays.",
      finalDelivery: "Master cinema ProRes 422 HQ export."
    },
    services: ["Slow-Cut Pacing", "Color Separation", "Superbike Sound Foley", "Atmospheric Edit"],
    gallery: ["https://mir-s3-cdn-cf.behance.net/projects/original_webp/e6499f249370465.Y3JvcCw4NjIsNjc0LDAsNTYz.png"]
  },
  {
    slug: "graduation-ceremony-mysore-fastcut",
    number: "04",
    title: "Graduation Ceremony Mysore — Fastcut",
    category: "Event & Fast-Cut Films",
    categorySlug: "events-fast-cut",
    client: "Mysore Academy",
    year: "2024",
    duration: "01:00",
    role: "Senior Video Editor & Colorist",
    thumbnail: "https://mir-s3-cdn-cf.behance.net/projects/original_webp/66e84e249370299.Y3JvcCwxMDY4LDgzNSwwLDYwMg.png",
    video: "https://www-ccv.adobe.io/v1/player/ccv/JieHHiBGm8N/embed?api_key=behance1&bgcolor=%23191919",
    description: "Vibrant and celebratory fast-cut recap honoring academic excellence, convocation ceremonies, and joyful celebrations in Mysore.",
    creativeApproach: {
      footageSelection: "Captured genuine smiles, diploma handoffs, cap tosses, and emotional family embraces.",
      editingAndPacing: "Uplifting, fast-paced rhythm that builds from formal convocation to exuberant student celebration.",
      colorGrading: "Warm golden skin tones with vivid gown colors and bright collegiate lighting.",
      soundDesign: "Layered applause swells, musical crescendo, and lively crowd laughter.",
      motionGraphics: "Elegant animated typography and graduation batch year highlights.",
      finalDelivery: "High-definition recap package for institutional web and social platforms."
    },
    services: ["Event Recap", "Dynamic Rhythms", "Color Correction", "Social Media Cutdown"],
    gallery: ["https://mir-s3-cdn-cf.behance.net/projects/original_webp/66e84e249370299.Y3JvcCwxMDY4LDgzNSwwLDYwMg.png"]
  },
  {
    slug: "car-detailing-fast-cut",
    number: "05",
    title: "Car Detailing — Fast Cut",
    category: "Automotive Films",
    categorySlug: "automotive-films",
    client: "Auto Detailing Works",
    year: "2024",
    duration: "01:00",
    role: "Senior Video Editor & Colorist",
    thumbnail: "https://mir-s3-cdn-cf.behance.net/projects/original_webp/c70a45249369843.Y3JvcCwxMDcwLDgzNiwwLDYyNw.png",
    video: "https://www-ccv.adobe.io/v1/player/ccv/CoXHSEfaYAv/embed?api_key=behance1&bgcolor=%23191919",
    description: "Rapid transformation montage tracking complete interior and exterior vehicle restoration with beat-synced editorial precision.",
    creativeApproach: {
      footageSelection: "Fast before-and-after match cuts showing scratch removal and deep leather conditioning.",
      editingAndPacing: "High-bpm cut sequence utilizing optical flow speed ramps and snap transitions.",
      colorGrading: "High-contrast commercial grade accentuating paint gloss and chrome reflection.",
      soundDesign: "Rotary polisher hum, aerosol hiss, and clean impact whooshes.",
      motionGraphics: "Modern minimalist lower third brand markers.",
      finalDelivery: "Web and reel multi-format exports."
    },
    services: ["Fast-Cut Montage", "Sound Design", "Automotive Finishing", "Color Balancing"],
    gallery: ["https://mir-s3-cdn-cf.behance.net/projects/original_webp/c70a45249369843.Y3JvcCwxMDcwLDgzNiwwLDYyNw.png"]
  },
  {
    slug: "automotive-event-banditbikers",
    number: "06",
    title: "Automotive Event — Banditbikers",
    category: "Automotive Films",
    categorySlug: "automotive-films",
    client: "Bandit Bikers",
    year: "2024",
    duration: "01:00",
    role: "Senior Video Editor & Colorist",
    thumbnail: "https://mir-s3-cdn-cf.behance.net/projects/original_webp/9af8ab247680879.Y3JvcCw4NjIsNjc0LDAsMjg4.png",
    video: "https://www-ccv.adobe.io/v1/player/ccv/6SuxGyhnrT-/embed?api_key=behance1&bgcolor=%23191919",
    description: "Adrenaline-fueled biker rally and stunts montage capturing the camaraderie, highway cruising, and roaring motors of Banditbikers.",
    creativeApproach: {
      footageSelection: "High-speed helmet cam clips, corner carving tracking shots, and group rally lines.",
      editingAndPacing: "Rock-and-bass powered speed edits with dynamic camera whip transitions.",
      colorGrading: "Raw, gritty film look with crushed shadows and punchy asphalt textures.",
      soundDesign: "Synchronized dual-cylinder thumps, rev limiter bounces, and wind rushes.",
      motionGraphics: "Distressed biker club badge kinetic motion intro.",
      finalDelivery: "Full HD rally film and social teaser."
    },
    services: ["Action Sports Editing", "Speed Ramping", "Motor Foley", "Raw Film Emulation"],
    gallery: ["https://mir-s3-cdn-cf.behance.net/projects/original_webp/9af8ab247680879.Y3JvcCw4NjIsNjc0LDAsMjg4.png"]
  },
  {
    slug: "blush-and-glow-inauguration-video",
    number: "07",
    title: "Blush And Glow Inauguration Video",
    category: "Brand Promos & Commercials",
    categorySlug: "commercial-ads",
    client: "Blush & Glow",
    year: "2024",
    duration: "01:00",
    role: "Senior Video Editor & Colorist",
    thumbnail: "https://mir-s3-cdn-cf.behance.net/projects/original_webp/933d66247680273.Y3JvcCw4NTgsNjcxLDAsNTM5.png",
    video: "https://www-ccv.adobe.io/v1/player/ccv/S23ykeZB94w/embed?api_key=behance1&bgcolor=%23191919",
    description: "Luxurious beauty lounge grand opening film spotlighting opulent salon interiors, ribbon cutting, celebrity guests, and modern aesthetic care.",
    creativeApproach: {
      footageSelection: "Polished interior tracking, makeup artist precision brushes, and welcoming smiles.",
      editingAndPacing: "Lyrical elegance that transitions smoothly between grand architecture and intimate guest interactions.",
      colorGrading: "Creamy pastels, glowing warm skin tones, and luminous rose-gold highlights.",
      soundDesign: "Lush ambient acoustic harmonies, ribbon snip foley, and gentle champagne glass clinks.",
      motionGraphics: "Golden script typography and brand sparkle flourishes.",
      finalDelivery: "Luxury brand promo package for Instagram & television."
    },
    services: ["Commercial Promo", "Beauty Grading", "Lounge Sound Design", "Brand Pacing"],
    gallery: ["https://mir-s3-cdn-cf.behance.net/projects/original_webp/933d66247680273.Y3JvcCw4NTgsNjcxLDAsNTM5.png"]
  },
  {
    slug: "construction-work-fast-cut",
    number: "08",
    title: "Construction Work — Fast Cut",
    category: "Real Estate & Drone",
    categorySlug: "real-estate-drone",
    client: "Infrastructure Group",
    year: "2024",
    duration: "01:00",
    role: "Senior Video Editor & Colorist",
    thumbnail: "https://mir-s3-cdn-cf.behance.net/projects/original_webp/58e31f238826369.Y3JvcCwyNTkzLDIwMjgsMTUyMSw5MTE.jpg",
    video: "https://www-ccv.adobe.io/v1/player/ccv/HBbCVLxX9LG/embed?api_key=behance1&bgcolor=%23191919",
    description: "Industrial strength and engineering excellence documented through rapid, punchy cutting of heavy machinery, welding sparks, and towering structure assembly.",
    creativeApproach: {
      footageSelection: "Dynamic telephoto machinery arcs, crane sweeps, and intense welder flame close-ups.",
      editingAndPacing: "Hammer-on-anvil rhythm syncing structural erection milestones to heavy industrial percussions.",
      colorGrading: "High dynamic range grade balancing bright open sky with deep concrete shadows.",
      soundDesign: "Hydraulic hiss, metallic hammer strikes, and site engine ambiance.",
      motionGraphics: "Precision engineering blueprint graphics and architectural dimension overlays.",
      finalDelivery: "Corporate progress documentary and promotional sizzle reel."
    },
    services: ["Industrial Editing", "Drone Synchronization", "Heavy Foley Design", "HDR Grading"],
    gallery: ["https://mir-s3-cdn-cf.behance.net/projects/original_webp/58e31f238826369.Y3JvcCwyNTkzLDIwMjgsMTUyMSw5MTE.jpg"]
  },
  {
    slug: "construction-shoot-mix-cut",
    number: "09",
    title: "Construction Shoot — Mix Cut",
    category: "Real Estate & Drone",
    categorySlug: "real-estate-drone",
    client: "Prime Builders",
    year: "2024",
    duration: "01:00",
    role: "Senior Video Editor & Colorist",
    thumbnail: "https://mir-s3-cdn-cf.behance.net/projects/original_webp/d122a3238825663.Y3JvcCw3NzMyLDYwNDgsMjEwLDA.jpg",
    video: "https://www-ccv.adobe.io/v1/player/ccv/Ss7A-PcRvQg/embed?api_key=behance1&bgcolor=%23191919",
    description: "Balanced architectural narrative combining high-altitude drone flyovers with intimate craftsmanship and structural milestone progress.",
    creativeApproach: {
      footageSelection: "Juxtaposed wide orbital drone paths with ground-level masonry and concrete pours.",
      editingAndPacing: "A rhythmic mixture of slow majestic landscape reveals and snappy building milestone cuts.",
      colorGrading: "Clean natural sunlight balancing earth tones and blue sky saturation.",
      soundDesign: "Wind breeze at altitude blending into grounded site activity.",
      motionGraphics: "Architectural floor elevation titles and completion statistics.",
      finalDelivery: "Investor report video and marketing promo reel."
    },
    services: ["Aerial Editing", "Mix Pacing", "Color Grading", "Investor Showcase"],
    gallery: ["https://mir-s3-cdn-cf.behance.net/projects/original_webp/d122a3238825663.Y3JvcCw3NzMyLDYwNDgsMjEwLDA.jpg"]
  },
  {
    slug: "fast-cut-for-builtup-builders-drone-footage",
    number: "10",
    title: "Fast Cut For Builtup Builders — Drone Footage",
    category: "Real Estate & Drone",
    categorySlug: "real-estate-drone",
    client: "Builtup Builders",
    year: "2024",
    duration: "01:00",
    role: "Senior Video Editor & Colorist",
    thumbnail: "https://mir-s3-cdn-cf.behance.net/projects/original_webp/632b2d235630137.Y3JvcCw5ODYsNzcxLDAsNDU4.png",
    video: "https://www-ccv.adobe.io/v1/player/ccv/LKcKq6YXnfQ/embed?api_key=behance1&bgcolor=%23191919",
    description: "Fast-tempo FPV and aerial cinematography cut designed to showcase modern luxury living, structural integrity, and premium builder craftsmanship.",
    creativeApproach: {
      footageSelection: "Seamless FPV dive through balconies, rooftop amenities, and sweeping community panoramas.",
      editingAndPacing: "High-kinetic aerial dive speed ramps synchronized with punchy electronic beats.",
      colorGrading: "Punchy, modern real-estate color grade highlighting lush landscapes and sparkling glass façades.",
      soundDesign: "Drone rotor whoosh design, sonic dive swooshes, and atmospheric musical scoring.",
      motionGraphics: "Kinetic builder branding and community feature callouts.",
      finalDelivery: "High-impact social advertisement and real-estate sales showcase."
    },
    services: ["FPV Drone Editing", "Speed Ramps", "Sound Design", "Brand Positioning"],
    gallery: ["https://mir-s3-cdn-cf.behance.net/projects/original_webp/632b2d235630137.Y3JvcCw5ODYsNzcxLDAsNDU4.png"]
  },
  {
    slug: "shoot-for-royal-enfield-freedom-ride",
    number: "11",
    title: "Shoot For Royal Enfield — Freedom Ride",
    category: "Automotive Films",
    categorySlug: "automotive-films",
    client: "Royal Enfield",
    year: "2024",
    duration: "01:00",
    role: "Senior Video Editor & Colorist",
    thumbnail: "https://mir-s3-cdn-cf.behance.net/projects/original_webp/5ae464232679501.Y3JvcCwxMTcwLDkxNSwwLDEwMDI.png",
    video: "https://www-ccv.adobe.io/v1/player/ccv/DAMgktqG6av/embed?api_key=behance1&bgcolor=%23191919",
    description: "An epic Independence Day motorcycle expedition film celebrating unity, open highways, the legendary Royal Enfield heartbeat, and rider camaraderie.",
    creativeApproach: {
      footageSelection: "Tri-color flag fluttering in wind, endless mountain switchbacks, and riders smiling in unison.",
      editingAndPacing: "Epic and emotional narrative pacing that swells with pride and adventure spirit.",
      colorGrading: "Kodak film emulation with rich vintage greens, deep amber highway glows, and patriotic flag tones.",
      soundDesign: "Iconic Royal Enfield single-cylinder thump synchronized with emotional cinematic strings.",
      motionGraphics: "Bespoke Freedom Ride typography and heritage badge display.",
      finalDelivery: "Official campaign cut for motorcycle community and global social channels."
    },
    services: ["Documentary Editing", "Heritage Sound Foley", "Vintage Film LUT", "Storytelling"],
    gallery: ["https://mir-s3-cdn-cf.behance.net/projects/original_webp/5ae464232679501.Y3JvcCwxMTcwLDkxNSwwLDEwMDI.png"]
  },
  {
    slug: "promo-blush-and-glow-malappuram",
    number: "12",
    title: "Promo — Blush And Glow — Malappuram",
    category: "Brand Promos & Commercials",
    categorySlug: "commercial-ads",
    client: "Blush & Glow Malappuram",
    year: "2024",
    duration: "01:00",
    role: "Senior Video Editor & Colorist",
    thumbnail: "https://mir-s3-cdn-cf.behance.net/projects/original_webp/cf63f0232218443.Y3JvcCw1OTczLDQ2NzEsODgsMA.jpg",
    video: "https://www-ccv.adobe.io/v1/player/ccv/Dh8UpJbF-Hb/embed?api_key=behance1&bgcolor=%23191919",
    description: "High-conversion commercial promo capturing the premier bridal beauty and aesthetics experience at Blush & Glow Malappuram.",
    creativeApproach: {
      footageSelection: "Selected exquisite bridal makeup close-ups, mirror reveals, and glowing bride smiles.",
      editingAndPacing: "Polished commercial cut with delicate cross-dissolves and tempo-matched bridal transitions.",
      colorGrading: "Flawless skin tone color correction, soft diffusion glow, and vibrant jewel tones.",
      soundDesign: "Subtle traditional chime accents, modern ambient lounge rhythm, and crisp makeup brush foley.",
      motionGraphics: "Elegant luxury logo presentation and service showcase banners.",
      finalDelivery: "Optimized commercial video for Instagram Reels, WhatsApp campaigns, and in-store displays."
    },
    services: ["Bridal Commercial", "Skin Retouching Grade", "Sound Design", "Social Ad Optimization"],
    gallery: ["https://mir-s3-cdn-cf.behance.net/projects/original_webp/cf63f0232218443.Y3JvcCw1OTczLDQ2NzEsODgsMA.jpg"]
  }
];
