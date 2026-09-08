"use client";

import React, { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface ScrollRevealCardProps {
  children: React.ReactNode;
  direction?: "left" | "right" | "up";
  delay?: number;
  distance?: number;
  className?: string;
}

export default function ScrollRevealCard({
  children,
  direction = "left",
  delay = 0,
  distance,
  className = "",
}: ScrollRevealCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const [deviceScale, setDeviceScale] = useState<"desktop" | "tablet" | "mobile">("desktop");

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setDeviceScale("mobile");
      } else if (width < 1024) {
        setDeviceScale("tablet");
      } else {
        setDeviceScale("desktop");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Determine effective distance based on viewport width
  const getEffectiveDistance = () => {
    if (distance !== undefined) {
      if (deviceScale === "mobile") return Math.min(distance * 0.45, 35);
      if (deviceScale === "tablet") return distance * 0.75;
      return distance;
    }

    if (direction === "up") {
      return deviceScale === "mobile" ? 25 : 40;
    }

    // Default horizontal distance
    if (deviceScale === "mobile") return 30;
    if (deviceScale === "tablet") return 55;
    return 80;
  };

  const effectiveDistance = getEffectiveDistance();

  // Directional offsets
  let initialX: number = 0;
  let initialY: number = 0;
  let initialRotateY: number = 0;

  if (direction === "left") {
    initialX = -effectiveDistance;
    initialRotateY = deviceScale === "mobile" || shouldReduceMotion ? 0 : -4;
  } else if (direction === "right") {
    initialX = effectiveDistance;
    initialRotateY = deviceScale === "mobile" || shouldReduceMotion ? 0 : 4;
  } else if (direction === "up") {
    initialY = effectiveDistance;
    initialRotateY = 0;
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: shouldReduceMotion ? 0 : initialX,
        y: shouldReduceMotion ? 0 : initialY,
        scale: shouldReduceMotion ? 1 : 0.96,
        rotateY: initialRotateY,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotateY: 0,
      }}
      viewport={{
        once: false,
        amount: 0.2,
      }}
      transition={{
        duration: 0.75,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        transformStyle: "preserve-3d",
      }}
      className={`h-full w-full will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
}
