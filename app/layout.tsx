import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScrollProvider from "@/components/animations/SmoothScrollProvider";
import CustomCursor from "@/components/animations/CustomCursor";

export const metadata: Metadata = {
  title: "Mohammed Mahroof TM — Senior Video Editor & Media Production Specialist",
  description:
    "Video Editor and Media Production Specialist with 4+ years of experience producing high-quality digital content for brands, agencies, and premium automotive showrooms.",
  keywords: [
    "Mohammed Mahroof TM",
    "Mohammed Mahroof",
    "Senior Video Editor",
    "Media Production Specialist",
    "Automotive Video Editor",
    "Commercial Video Editor",
    "DaVinci Resolve",
    "Premiere Pro",
  ],
  openGraph: {
    title: "Mohammed Mahroof TM — Video Editor & Media Specialist",
    description:
      "Transforming raw footage into polished, engaging and story-driven visual content.",
    url: "https://mohammedmahroof.com",
    siteName: "Mohammed Mahroof TM Portfolio",
    images: [
      {
        url: "/images/hero-bg.jpg",
        width: 1200,
        height: 630,
        alt: "Mohammed Mahroof TM Video Editor Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black text-[#F5F5F5] antialiased selection:bg-[#FF3B1F] selection:text-black">
        <SmoothScrollProvider>
          <CustomCursor />
          <Navbar />
          <div className="portfolio-container flex flex-col min-h-screen pt-[60px] sm:pt-[68px]">
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
