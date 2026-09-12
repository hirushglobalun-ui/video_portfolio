"use client";

import { useState, useEffect } from "react";
import { ArrowUpRight, Phone, Mail, Globe } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { getSiteSettings, defaultSiteSettings } from "@/lib/data";
import { SiteSettings } from "@/types/cms";

export default function Footer() {
  const shouldReduceMotion = useReducedMotion();
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);

  useEffect(() => {
    async function loadDynamicSettings() {
      try {
        const dyn = await getSiteSettings();
        if (dyn) setSettings(dyn);
      } catch (err) {
        console.warn("Could not load dynamic settings:", err);
      }
    }
    loadDynamicSettings();
  }, []);

  const contactLinks = [
    { name: "Email", href: `mailto:${settings.email || "mahroofft@gmail.com"}`, label: settings.email || "mahroofft@gmail.com" },
    { name: "Phone", href: `tel:${(settings.phone || "+918589036403").replace(/\s+/g, "")}`, label: settings.phone || "+91 85890 36403" },
    { name: "Behance", href: settings.behance || "https://www.behance.net/mohammedmahroof", label: "behance.net/mohammedmahroof" },
  ];

  if (settings.whatsapp) {
    contactLinks.push({ name: "WhatsApp", href: settings.whatsapp, label: "WhatsApp Chat" });
  }
  if (settings.instagram) {
    contactLinks.push({ name: "Instagram", href: settings.instagram, label: "Instagram" });
  }

  const headlineContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.16,
        delayChildren: 0.1,
      },
    },
  };

  const lineVariant = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 40,
      clipPath: shouldReduceMotion ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
    },
    visible: {
      opacity: 1,
      y: 0,
      clipPath: "inset(0 0 0% 0)",
      transition: {
        duration: 0.75,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <footer id="contact" className="w-full border-t border-gray-200 py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-12 bg-white flex flex-col justify-between gap-10 sm:gap-16 relative overflow-hidden scroll-mt-24 sm:scroll-mt-28">
      {/* Subtle ambient background glow */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#FF3B1F]/5 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Top CTA Quote */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start lg:items-end relative z-10">
        <div className="lg:col-span-8 flex flex-col gap-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF3B1F]"></span>
            <span className="text-xs font-mono tracking-[0.25em] text-[#FF3B1F] uppercase font-bold">
              GET IN TOUCH
            </span>
          </div>

          {/* Sequential Typography Reveal */}
          <motion.h2
            variants={headlineContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.25 }}
            className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-gray-950 uppercase tracking-tight leading-[0.95] sm:leading-[0.9] font-bold"
          >
            <div className="overflow-hidden">
              <motion.div variants={lineVariant}>LET&apos;S CREATE</motion.div>
            </div>
            <div className="overflow-hidden">
              <motion.div variants={lineVariant} className="text-[#FF3B1F]">
                SOMETHING
              </motion.div>
            </div>
            <div className="overflow-hidden">
              <motion.div variants={lineVariant}>WORTH WATCHING.</motion.div>
            </div>
          </motion.h2>
        </div>

        {/* Contact Info Block */}
        <motion.div
          initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-4 flex flex-col gap-3.5 sm:gap-4 rounded-2xl border border-gray-200 p-5 sm:p-8 bg-[#F8F9FA] font-mono text-xs shadow-xs w-full will-change-transform"
        >
          <div className="text-[#FF3B1F] font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF3B1F] animate-ping"></span>
            <span>AVAILABLE FOR SELECT PROJECTS</span>
          </div>
          <div className="flex items-center gap-3 text-gray-800">
            <Phone className="w-4 h-4 text-[#FF3B1F] shrink-0" />
            <a href={`tel:${(settings.phone || "+918589036403").replace(/\s+/g, "")}`} className="hover:text-[#FF3B1F] transition-colors truncate font-medium">
              {settings.phone || "+91 85890 36403"}
            </a>
          </div>
          <div className="flex items-center gap-3 text-gray-800">
            <Mail className="w-4 h-4 text-[#FF3B1F] shrink-0" />
            <a href={`mailto:${settings.email || "mahroofft@gmail.com"}`} className="hover:text-[#FF3B1F] transition-colors truncate font-medium">
              {settings.email || "mahroofft@gmail.com"}
            </a>
          </div>
          {settings.behance && (
            <div className="flex items-center gap-3 text-gray-800">
              <Globe className="w-4 h-4 text-[#FF3B1F] shrink-0" />
              <a
                href={settings.behance}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#FF3B1F] transition-colors truncate font-medium"
              >
                {settings.behance.replace(/^https?:\/\/(www\.)?/, "")}
              </a>
            </div>
          )}
        </motion.div>
      </div>

      {/* Education & Languages Section near footer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 border-t border-gray-200 pt-8 sm:pt-12 text-xs font-mono text-gray-600">
        {/* Education */}
        <div className="space-y-1.5 sm:space-y-2">
          <span className="text-[#FF3B1F] uppercase font-bold tracking-widest block">
            EDUCATION
          </span>
          <p className="text-gray-900 font-bold">
            BACHELOR OF COMMERCE (COOPERATION) — University of Calicut (2020 — 2023)
          </p>
          <p className="text-gray-600">
            POST GRADUATE DIPLOMA IN LOGISTICS & SUPPLY CHAIN EXCELLENCE — CILT, UK International (Level 6 Certificate)
          </p>
        </div>

        {/* Languages */}
        <div className="space-y-1.5 sm:space-y-2 md:text-right">
          <span className="text-[#FF3B1F] uppercase font-bold tracking-widest block">
            LANGUAGES
          </span>
          <p className="text-gray-900 font-medium">
            English • Malayalam • Tamil (Basic) • Arabic (Basic)
          </p>
        </div>
      </div>

      {/* Footer Navigation Links & Copyright */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start sm:items-end border-t border-gray-200 pt-8 sm:pt-12">
        {/* Contact Links */}
        <div className="md:col-span-7 flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm font-mono tracking-widest text-gray-600 uppercase font-medium">
          {contactLinks.map((s) => (
            <a
              key={s.name}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#FF3B1F] transition-colors flex items-center gap-1.5 group"
            >
              <span>{s.name}</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div className="md:col-span-5 flex flex-col md:items-end gap-1 text-[11px] font-mono text-gray-500">
          <span className="text-gray-800 font-bold tracking-wider">{settings.name || "MOHAMMED MAHROOF TM"}</span>
          <span>&copy; {new Date().getFullYear()} SENIOR VIDEO EDITOR & MEDIA PRODUCTION SPECIALIST.</span>
        </div>
      </div>
    </footer>
  );
}
