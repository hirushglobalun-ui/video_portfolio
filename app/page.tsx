import Hero from "@/components/Hero";
import BrandStrip from "@/components/BrandStrip";
import About from "@/components/About";
import Proficiency from "@/components/Proficiency";
import WorkSection from "@/components/WorkSection";
import Experience from "@/components/Experience";

export default function Home() {
  return (
    <div className="w-full flex flex-col">
      {/* 1. Hero */}
      <Hero />

      {/* 2. Client & Brand Trust Strip */}
      <BrandStrip />

      {/* 3. About */}
      <About />

      {/* 4. Software & Production */}
      <Proficiency />

      {/* 6. Selected Work / Projects */}
      <WorkSection />

      {/* 7. Experience (Zig-zag timeline) */}
      <Experience />
    </div>
  );
}
