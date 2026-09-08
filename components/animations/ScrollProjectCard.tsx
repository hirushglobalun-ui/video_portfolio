"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";

interface ScrollProjectCardProps {
  children: React.ReactNode;
  index: number;
  className?: string;
}

// Predefined intentional 3D entrance angles matching specification
const PROJECT_ANGLES = [
  { x: 4, y: -10, z: -5, translateY: 70, scale: 0.94 }, // Project 01
  { x: -4, y: 10, z: 6, translateY: 70, scale: 0.94 },  // Project 02
  { x: 3, y: -8, z: 5, translateY: 60, scale: 0.95 },   // Project 03
  { x: -3, y: 9, z: -5, translateY: 60, scale: 0.95 },  // Project 04
  { x: 4, y: -7, z: -4, translateY: 60, scale: 0.95 },  // Project 05
  { x: -4, y: 8, z: 4, translateY: 60, scale: 0.95 },   // Project 06
];

export default function ScrollProjectCard({
  children,
  index,
  className = "",
}: ScrollProjectCardProps) {
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

  const angleConfig = PROJECT_ANGLES[index % PROJECT_ANGLES.length];

  // Continuous scroll tracking for the specific card
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  // Intensity factor (desktop: 1.0, tablet: 0.55, mobile: 0)
  const factor = shouldReduceMotion || isMobile ? 0 : 1;

  // Transforms:
  // 0.0 -> card just entering bottom of screen
  // 0.45 - 0.55 -> card in viewport center
  // 1.0 -> card leaving top of screen
  const rawRotateX = useTransform(
    scrollYProgress,
    [0, 0.48, 1],
    [angleConfig.x * factor, 0, -angleConfig.x * 0.4 * factor]
  );
  const rawRotateY = useTransform(
    scrollYProgress,
    [0, 0.48, 1],
    [angleConfig.y * factor, 0, -angleConfig.y * 0.5 * factor]
  );
  const rawRotateZ = useTransform(
    scrollYProgress,
    [0, 0.48, 1],
    [angleConfig.z * factor, 0, -angleConfig.z * 0.4 * factor]
  );
  const rawTranslateY = useTransform(
    scrollYProgress,
    [0, 0.45, 1],
    [angleConfig.translateY * factor, 0, -30 * factor]
  );
  const rawScale = useTransform(
    scrollYProgress,
    [0, 0.45, 1],
    [angleConfig.scale, 1, 0.98]
  );
  const rawOpacity = useTransform(
    scrollYProgress,
    [0, 0.25, 0.85, 1],
    [0.4, 1, 1, 0.5]
  );

  // Smooth with useSpring to prevent harsh jumps
  const springConfig = { stiffness: 90, damping: 22, mass: 0.8 };
  const rotateX = useSpring(rawRotateX, springConfig);
  const rotateY = useSpring(rawRotateY, springConfig);
  const rotateZ = useSpring(rawRotateZ, springConfig);
  const translateY = useSpring(rawTranslateY, springConfig);
  const scale = useSpring(rawScale, springConfig);
  const opacity = useSpring(rawOpacity, { stiffness: 120, damping: 25 });

  return (
    <div
      ref={cardRef}
      className={`relative h-full [perspective:1200px] ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      <motion.div
        style={{
          rotateX: shouldReduceMotion || isMobile ? 0 : rotateX,
          rotateY: shouldReduceMotion || isMobile ? 0 : rotateY,
          rotateZ: shouldReduceMotion || isMobile ? 0 : rotateZ,
          y: shouldReduceMotion || isMobile ? 0 : translateY,
          scale: shouldReduceMotion || isMobile ? 1 : scale,
          opacity: shouldReduceMotion ? 1 : opacity,
          transformStyle: "preserve-3d",
        }}
        whileHover={{
          scale: 1.015,
          y: -2,
          transition: { duration: 0.3, ease: "easeOut" },
        }}
        className="h-full w-full will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
}
