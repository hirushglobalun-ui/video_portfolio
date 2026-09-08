"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 40);
  });

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/#about" },
    { name: "Work", href: "/work" },
    { name: "Contact", href: "/#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? "bg-black/95 backdrop-blur-xl border-b border-white/15 shadow-2xl shadow-black/80"
          : "bg-black/80 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/50"
      }`}
    >
      <div
        className={`portfolio-container border-t-0 border-b-0 min-h-0 px-4 sm:px-6 md:px-12 flex items-center justify-between transition-all duration-500 ${
          scrolled ? "py-2.5 sm:py-3" : "py-3.5 sm:py-4"
        }`}
      >
        {/* Brand / Name */}
        <Link href="/" className="group flex items-center gap-2 shrink-0">
          <span className="font-display text-lg sm:text-2xl md:text-3xl tracking-wider text-[#F5F5F5] group-hover:text-[#FF3B1F] transition-colors uppercase whitespace-nowrap">
            MAHROOF TM
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B1F]"></span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-xs tracking-widest font-medium uppercase text-[#888888]">
          {navLinks.map((link, idx) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname?.startsWith(link.href));
            return (
              <span key={link.name} className="flex items-center gap-6">
                <Link
                  href={link.href}
                  className={`transition-colors hover:text-[#FF3B1F] py-1.5 px-3 rounded-full ${
                    isActive ? "text-[#F5F5F5] bg-white/5 font-semibold" : ""
                  }`}
                >
                  {link.name}
                </Link>
                {idx < navLinks.length - 1 && (
                  <span className="text-white/20 font-mono text-[10px]">
                    •
                  </span>
                )}
              </span>
            );
          })}
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          aria-label="Toggle Navigation Menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-full border border-white/15 bg-white/5 text-[#F5F5F5] hover:text-[#FF3B1F] hover:border-[#FF3B1F]/40 transition-colors"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-white/10 p-6 flex flex-col gap-6 shadow-2xl z-50"
          >
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/" && pathname?.startsWith(link.href));
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-lg font-display uppercase tracking-wider py-2 px-3 rounded-xl transition-colors flex items-center justify-between ${
                      isActive
                        ? "text-[#FF3B1F] bg-[#FF3B1F]/10 font-bold"
                        : "text-[#F5F5F5] hover:text-[#FF3B1F] hover:bg-white/5"
                    }`}
                  >
                    <span>{link.name}</span>
                    <ArrowUpRight className="w-4 h-4 opacity-50" />
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-white/10 pt-4 flex flex-col gap-2 font-mono text-xs text-[#888888]">
              <span className="text-[#FF3B1F] tracking-widest font-semibold uppercase">
                DIRECT INQUIRY
              </span>
              <a
                href="mailto:mahroofft@gmail.com"
                className="text-[#F5F5F5] hover:text-[#FF3B1F] transition-colors"
              >
                mahroofft@gmail.com
              </a>
              <a
                href="tel:+918589036403"
                className="text-[#F5F5F5] hover:text-[#FF3B1F] transition-colors"
              >
                +91 85890 36403
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
