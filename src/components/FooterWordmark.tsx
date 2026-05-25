"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

const LETTERS = ["A", "B", "H", "I", "N", "A", "V"];
const DEPTHS = [40, 12, 28, 6, 24, 16, 36];
const EASE = [0.22, 1, 0.36, 1] as const;

export function FooterWordmark() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });
  const xSolid = useTransform(scrollYProgress, [0, 1], ["-4%", "3%"]);
  const opacitySolid = useTransform(scrollYProgress, [0, 0.4, 1], [0.0, 0.7, 1]);
  const xGhost = useTransform(scrollYProgress, [0, 1], ["4%", "-3%"]);
  const opacityGhost = useTransform(scrollYProgress, [0, 0.4, 1], [0.0, 0.15, 0.22]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="relative overflow-hidden bg-[#0A0908] border-t border-[#4d4639]"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 40%, rgba(230,196,121,0.5), transparent 55%), radial-gradient(circle at 70% 60%, rgba(189,245,50,0.32), transparent 60%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-screen"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(244,234,216,0.6) 0px, rgba(244,234,216,0.6) 1px, transparent 1px, transparent 3px)",
        }}
      />

      <div className="relative pt-[clamp(2.5rem,7vw,6rem)] pb-[clamp(2rem,6vw,5rem)]">
        <Wordmark
          x={xGhost}
          opacity={opacityGhost}
          progress={scrollYProgress}
          parallax={false}
          className="absolute inset-x-0 top-[clamp(2.5rem,7vw,6rem)] text-transparent"
          style={{ WebkitTextStroke: "1px rgba(230,196,121,0.55)" }}
        />
        <Wordmark
          x={xSolid}
          opacity={opacitySolid}
          progress={scrollYProgress}
          parallax
          className="relative text-[#f4ead8]"
        />
      </div>

      <div className="relative flex justify-between items-center px-6 md:px-[80px] pb-stack-md font-mono text-[10px] uppercase tracking-[0.28em] text-on-surface-variant/60">
        <span>· Editorial Index ·</span>
        <span>N 26.85 / E 75.81</span>
        <span>· MMXXVI ·</span>
      </div>
    </div>
  );
}

function Wordmark({
  x,
  opacity,
  progress,
  parallax,
  className = "",
  style,
}: {
  x: MotionValue<string>;
  opacity: MotionValue<number>;
  progress: MotionValue<number>;
  parallax: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <motion.h2
      style={{
        x,
        opacity,
        fontSize: "clamp(5.5rem, 24vw, 22rem)",
        fontVariationSettings: "'SOFT' 30, 'WONK' 0, 'opsz' 144",
        ...style,
      }}
      className={`font-fraunces font-black leading-[0.82] tracking-[-0.055em] whitespace-nowrap text-center py-2 ${className}`}
    >
      {LETTERS.map((ch, i) => (
        <LetterCell key={`${ch}-${i}`} ch={ch} i={i} progress={progress} parallax={parallax} />
      ))}
    </motion.h2>
  );
}

function LetterCell({
  ch,
  i,
  progress,
  parallax,
}: {
  ch: string;
  i: number;
  progress: MotionValue<number>;
  parallax: boolean;
}) {
  const depth = DEPTHS[i] ?? 20;
  const y = useTransform(progress, [0, 1], [`${depth}%`, `-${depth * 0.6}%`]);

  return (
    <motion.span
      initial={{ y: "60%", opacity: 0, filter: "blur(14px)", rotateX: 32 }}
      whileInView={{ y: "0%", opacity: 1, filter: "blur(0px)", rotateX: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 1.2, ease: EASE, delay: 0.07 * i }}
      className="inline-block will-change-transform"
      style={{ transformOrigin: "50% 100%" }}
    >
      <motion.span style={parallax ? { y } : undefined} className="inline-block">
        {ch}
      </motion.span>
    </motion.span>
  );
}
