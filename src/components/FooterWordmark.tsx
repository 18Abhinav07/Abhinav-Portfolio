"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function FooterWordmark() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });

  const wordmarkY = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const wordmarkOpacity = useTransform(scrollYProgress, [0, 0.6], [0, 0.06]);
  const wordmarkScale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);
  
  // A subtle, slow pan across the bottom
  const x = useTransform(scrollYProgress, [0, 1], ["-2%", "1%"]);
  // Shifting background gradients for atmospheric depth
  const g1X = useTransform(scrollYProgress, [0, 1], ["30%", "20%"]);
  const g2X = useTransform(scrollYProgress, [0, 1], ["70%", "80%"]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="relative overflow-hidden pt-[10rem] pb-[4rem]"
    >
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{
          y: wordmarkY,
          backgroundImage: `
            radial-gradient(circle at var(--g1-x) 40%, rgba(191,255,0,0.4), transparent 60%), 
            radial-gradient(circle at var(--g2-x) 60%, rgba(250,255,0,0.3), transparent 65%)
          `,
          // @ts-expect-error - Framer Motion CSS variables mapping
          "--g1-x": g1X,
          "--g2-x": g2X,
        }}
      />

      <div className="relative">
        <motion.h2
          style={{ x, y: wordmarkY, opacity: wordmarkOpacity, scale: wordmarkScale }}
          className="font-display font-bold text-on-surface text-center whitespace-nowrap leading-[0.8] tracking-[-0.04em] select-none"
        >
          <span className="text-[clamp(4rem,14vw,12rem)]">ABHINAV</span>
        </motion.h2>
      </div>
    </div>
  );
}

