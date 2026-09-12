import type { Metadata } from "next";
import "./globals.css";
import SmoothScrollProvider from "@/components/animations/SmoothScrollProvider";
import SiteLayoutWrapper from "@/components/SiteLayoutWrapper";

export const metadata: Metadata = {
  metadataBase: new URL("https://mohammedmahroof.com"),
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
      <body className="bg-[#F8F9FA] text-[#111827] antialiased selection:bg-[#FF3B1F] selection:text-white">
        <SmoothScrollProvider>
          <SiteLayoutWrapper>{children}</SiteLayoutWrapper>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
