"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

interface TextRevealProps {
  lines: Array<{
    text: string;
    highlight?: boolean;
    className?: string;
  }>;
  className?: string;
}

export default function TextReveal({ lines, className = "" }: TextRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.18,
        delayChildren: 0.1,
      },
    },
  };

  const lineItem = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 35,
      clipPath: shouldReduceMotion ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
    },
    visible: {
      opacity: 1,
      y: 0,
      clipPath: "inset(0 0 0% 0)",
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.25 }}
      className={className}
    >
      {lines.map((line, idx) => (
        <div key={idx} className="overflow-hidden">
          <motion.div variants={lineItem} className={line.className}>
            {line.highlight ? (
              <span className="text-[#FF3B1F]">{line.text}</span>
            ) : (
              line.text
            )}
          </motion.div>
        </div>
      ))}
    </motion.div>
  );
}
