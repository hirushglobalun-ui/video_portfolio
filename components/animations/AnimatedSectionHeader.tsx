"use client";

import { motion } from "framer-motion";

interface AnimatedSectionHeaderProps {
  label: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export default function AnimatedSectionHeader({
  label,
  title,
  subtitle,
  action,
  className = "",
}: AnimatedSectionHeaderProps) {
  const words = title.split(" ");

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const wordVariants = {
    hidden: { y: "40%", opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <div className={`flex flex-col gap-3 mb-8 sm:mb-12 ${className}`}>
      {/* Label / Marker */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false, amount: 0.05 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-2"
      >
        <span className="w-2 h-2 rounded-full bg-[#FF3B1F]"></span>
        <span className="text-xs font-mono tracking-[0.25em] text-[#FF3B1F] uppercase font-bold">
          {label}
        </span>
      </motion.div>

      {/* Main Title + Action Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <motion.h2
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.05 }}
          className="font-display text-3xl sm:text-5xl md:text-6xl text-gray-950 uppercase tracking-tight font-bold flex flex-wrap gap-x-3 gap-y-1 overflow-hidden"
        >
          {words.map((word, index) => (
            <span key={index} className="inline-block overflow-hidden pb-1">
              <motion.span variants={wordVariants} className="inline-block">
                {word}
              </motion.span>
            </span>
          ))}
        </motion.h2>

        {action && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.05 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {action}
          </motion.div>
        )}
      </div>

      {/* Optional Subtitle */}
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.05 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xs sm:text-sm text-gray-600 font-mono max-w-xl leading-relaxed"
        >
          {subtitle}
        </motion.p>
      )}

      {/* Self-drawing accent underline */}
      <div className="w-full h-[1px] bg-gray-200 mt-3 relative overflow-hidden">
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 bg-gradient-to-r from-[#FF3B1F] via-[#FF3B1F]/60 to-transparent origin-left"
        />
      </div>
    </div>
  );
}
