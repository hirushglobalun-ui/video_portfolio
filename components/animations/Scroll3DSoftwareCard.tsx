"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";

interface Scroll3DSoftwareCardProps {
  children: React.ReactNode;
  variant: "davinci" | "premiere" | "ae" | "capcut" | "photoshop" | "lightroom" | "standard";
  className?: string;
}

const TOOL_TRANSFORMS = {
  davinci: {
    start: { rx: 7, ry: -10, rz: -5, scale: 0.96 },
    end: { rx: -4, ry: 6, rz: 3, scale: 0.98 },
  },
  premiere: {
    start: { rx: -6, ry: 10, rz: 5, scale: 0.96 },
    end: { rx: 4, ry: -6, rz: -3, scale: 0.98 },
  },
  ae: {
    start: { rx: 0, ry: 0, rz: -4, scale: 0.97 },
    end: { rx: 0, ry: 0, rz: 2, scale: 0.99 },
  },
  capcut: {
    start: { rx: 0, ry: 0, rz: 4, scale: 0.97 },
    end: { rx: 0, ry: 0, rz: -2, scale: 0.99 },
  },
  photoshop: {
    start: { rx: 0, ry: 0, rz: -3, scale: 0.97 },
    end: { rx: 0, ry: 0, rz: 1.5, scale: 0.99 },
  },
  lightroom: {
    start: { rx: 0, ry: 0, rz: 3, scale: 0.97 },
    end: { rx: 0, ry: 0, rz: -1.5, scale: 0.99 },
  },
  standard: {
    start: { rx: 0, ry: 0, rz: 0, scale: 0.98 },
    end: { rx: 0, ry: 0, rz: 0, scale: 1 },
  },
};

export default function Scroll3DSoftwareCard({
  children,
  variant,
  className = "",
}: Scroll3DSoftwareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const config = TOOL_TRANSFORMS[variant] || TOOL_TRANSFORMS.standard;

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  const factor = shouldReduceMotion || isMobile ? 0 : 1;

  const rawRotateX = useTransform(
    scrollYProgress,
    [0, 0.45, 1],
    [config.start.rx * factor, 0, config.end.rx * factor]
  );
  const rawRotateY = useTransform(
    scrollYProgress,
    [0, 0.45, 1],
    [config.start.ry * factor, 0, config.end.ry * factor]
  );
  const rawRotateZ = useTransform(
    scrollYProgress,
    [0, 0.45, 1],
    [config.start.rz * factor, 0, config.end.rz * factor]
  );
  const rawScale = useTransform(
    scrollYProgress,
    [0, 0.45, 1],
    [config.start.scale, 1, config.end.scale]
  );
  const rawOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.9, 1],
    [0.5, 1, 1, 0.6]
  );

  const springConfig = { stiffness: 90, damping: 22, mass: 0.8 };
  const rotateX = useSpring(rawRotateX, springConfig);
  const rotateY = useSpring(rawRotateY, springConfig);
  const rotateZ = useSpring(rawRotateZ, springConfig);
  const scale = useSpring(rawScale, springConfig);
  const opacity = useSpring(rawOpacity, { stiffness: 120, damping: 25 });

  return (
    <div
      ref={cardRef}
      className={`relative [perspective:1200px] ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      <motion.div
        style={{
          rotateX: shouldReduceMotion || isMobile ? 0 : rotateX,
          rotateY: shouldReduceMotion || isMobile ? 0 : rotateY,
          rotateZ: shouldReduceMotion || isMobile ? 0 : rotateZ,
          scale: shouldReduceMotion || isMobile ? 1 : scale,
          opacity: shouldReduceMotion ? 1 : opacity,
          transformStyle: "preserve-3d",
        }}
        className="h-full w-full will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
}
