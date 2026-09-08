"use client";

import { ArrowUpRight, Phone, Mail, Globe } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

export default function Footer() {
  const shouldReduceMotion = useReducedMotion();

  const contactLinks = [
    { name: "Email", href: "mailto:mahroofft@gmail.com", label: "mahroofft@gmail.com" },
    { name: "Phone", href: "tel:+918589036403", label: "+91 85890 36403" },
    { name: "Behance", href: "https://www.behance.net/mohammedmahroof", label: "behance.net/mohammedmahroof" },
  ];

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
    <footer id="contact" className="w-full border-t border-white/10 py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-12 bg-gradient-to-b from-black via-[#080808] to-[#040404] flex flex-col justify-between gap-10 sm:gap-16 relative overflow-hidden scroll-mt-24 sm:scroll-mt-28">
      {/* Ambient background glow */}
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

          {/* Sequential Typography Reveal that replays when leaving and returning */}
          <motion.h2
            variants={headlineContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.25 }}
            className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-[#F5F5F5] uppercase tracking-tight leading-[0.95] sm:leading-[0.9]"
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

        {/* Contact Info Block with scale and opacity reveal that replays on return */}
        <motion.div
          initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-4 flex flex-col gap-3.5 sm:gap-4 rounded-2xl border border-white/10 p-5 sm:p-8 bg-[#0a0a0a] font-mono text-xs shadow-xl w-full will-change-transform"
        >
          <div className="text-[#FF3B1F] font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF3B1F] animate-ping"></span>
            <span>AVAILABLE FOR SELECT PROJECTS</span>
          </div>
          <div className="flex items-center gap-3 text-[#F5F5F5]">
            <Phone className="w-4 h-4 text-[#FF3B1F] shrink-0" />
            <a href="tel:+918589036403" className="hover:text-[#FF3B1F] transition-colors truncate">
              +91 85890 36403
            </a>
          </div>
          <div className="flex items-center gap-3 text-[#F5F5F5]">
            <Mail className="w-4 h-4 text-[#FF3B1F] shrink-0" />
            <a href="mailto:mahroofft@gmail.com" className="hover:text-[#FF3B1F] transition-colors truncate">
              mahroofft@gmail.com
            </a>
          </div>
          <div className="flex items-center gap-3 text-[#F5F5F5]">
            <Globe className="w-4 h-4 text-[#FF3B1F] shrink-0" />
            <a
              href="https://www.behance.net/mohammedmahroof"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#FF3B1F] transition-colors truncate"
            >
              behance.net/mohammedmahroof
            </a>
          </div>
        </motion.div>
      </div>

      {/* Subtle Education & Languages Section near footer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 border-t border-white/10 pt-8 sm:pt-12 text-xs font-mono text-[#888888]">
        {/* Education */}
        <div className="space-y-1.5 sm:space-y-2">
          <span className="text-[#FF3B1F] uppercase font-semibold tracking-widest block">
            EDUCATION
          </span>
          <p className="text-[#F5F5F5] font-semibold">
            BACHELOR OF COMMERCE (COOPERATION) — University of Calicut (2020 — 2023)
          </p>
          <p className="text-[#888888]">
            POST GRADUATE DIPLOMA IN LOGISTICS & SUPPLY CHAIN EXCELLENCE — CILT, UK International (Level 6 Certificate)
          </p>
        </div>

        {/* Languages */}
        <div className="space-y-1.5 sm:space-y-2 md:text-right">
          <span className="text-[#FF3B1F] uppercase font-semibold tracking-widest block">
            LANGUAGES
          </span>
          <p className="text-[#F5F5F5]">
            English • Malayalam • Tamil (Basic) • Arabic (Basic)
          </p>
        </div>
      </div>

      {/* Footer Navigation Links & Copyright */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start sm:items-end border-t border-white/10 pt-8 sm:pt-12">
        {/* Contact Links */}
        <div className="md:col-span-7 flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm font-mono tracking-widest text-[#888888] uppercase">
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
        <div className="md:col-span-5 flex flex-col md:items-end gap-1 text-[11px] font-mono text-[#666666]">
          <span className="text-[#CCCCCC] font-bold tracking-wider">MOHAMMED MAHROOF TM</span>
          <span>&copy; {new Date().getFullYear()} SENIOR VIDEO EDITOR & MEDIA PRODUCTION SPECIALIST.</span>
        </div>
      </div>
    </footer>
  );
}
