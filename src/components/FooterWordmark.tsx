"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

export function FooterWordmark() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });
  
  // A very subtle, slow pan across the bottom, completely replacing the staggered letters.
  const x = useTransform(scrollYProgress, [0, 1], ["-2%", "1%"]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="relative overflow-hidden bg-[#0A0908] border-t border-[#4d4639]"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 40%, rgba(230,196,121,0.5), transparent 55%), radial-gradient(circle at 70% 60%, rgba(189,245,50,0.32), transparent 60%)",
        }}
      />

      <div className="relative pt-[4rem] pb-[3rem]">
        <motion.h2
          style={{ x }}
          className="font-fraunces font-black text-[#f4ead8] opacity-[0.08] text-center whitespace-nowrap leading-[0.8] tracking-[-0.02em] select-none"
        >
          <span className="text-[clamp(4rem,12vw,10rem)]">ABHINAV PANGARIA</span>
        </motion.h2>
      </div>

      <div className="relative flex justify-between items-center px-6 md:px-[80px] pb-stack-md font-mono text-[10px] uppercase tracking-[0.28em] text-on-surface-variant/40">
        <span>· Editorial Index ·</span>
        <span>N 26.85 / E 75.81</span>
        <span>· MMXXVI ·</span>
      </div>
    </div>
  );
}
