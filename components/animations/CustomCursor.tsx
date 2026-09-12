"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function CustomCursor() {
  const [cursorState, setCursorState] = useState<{
    visible: boolean;
    text: string;
  }>({
    visible: false,
    text: "VIEW",
  });

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth lerp follow with spring physics
  const springConfig = { damping: 20, stiffness: 220, mass: 0.15 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      // Check if target or ancestor has data-cursor attribute
      const target = e.target as HTMLElement | null;
      const cursorTarget = target?.closest("[data-cursor]") as HTMLElement | null;

      if (cursorTarget) {
        const text = cursorTarget.getAttribute("data-cursor") || "VIEW";
        setCursorState({ visible: true, text });
      } else {
        setCursorState((prev) => (prev.visible ? { ...prev, visible: false } : prev));
      }
    };

    const handleMouseLeave = () => {
      setCursorState((prev) => (prev.visible ? { ...prev, visible: false } : prev));
    };

    const handleScroll = () => {
      // Re-evaluate element under current cursor position
      const el = document.elementFromPoint(mouseX.get(), mouseY.get());
      const cursorTarget = el?.closest("[data-cursor]") as HTMLElement | null;
      if (cursorTarget) {
        const text = cursorTarget.getAttribute("data-cursor") || "VIEW";
        setCursorState({ visible: true, text });
      } else {
        setCursorState((prev) => (prev.visible ? { ...prev, visible: false } : prev));
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mouseX, mouseY]);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[9999] hidden md:flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
      style={{
        x: smoothX,
        y: smoothY,
      }}
    >
      <motion.div
        initial={false}
        animate={{
          scale: cursorState.visible ? 1 : 0,
          opacity: cursorState.visible ? 1 : 0,
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="w-20 h-20 rounded-full bg-[#FF3B1F] text-white font-display font-bold text-xs uppercase tracking-widest flex items-center justify-center shadow-xl shadow-[#FF3B1F]/30 backdrop-blur-sm select-none"
      >
        {cursorState.text}
      </motion.div>
    </motion.div>
  );
}
