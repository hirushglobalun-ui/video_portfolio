"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SiteLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminOrLogin = pathname?.startsWith("/admin") || pathname?.startsWith("/login");

  if (isAdminOrLogin) {
    return <main className="min-h-screen bg-gray-50">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <div className="portfolio-container flex flex-col min-h-screen pt-[60px] sm:pt-[68px]">
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </>
  );
}
