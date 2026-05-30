"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { site } from "@/content/site";
import { StaggerGroup, StaggerItem, TextReveal } from "./Reveal";
import { Hero3D } from "./Hero3D";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Smooth parallax on the content layer as user scrolls down
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={sectionRef} className="relative min-h-[100svh] w-full overflow-hidden flex items-end pb-16 md:pb-24 pt-[140px] px-6 md:px-[80px]">
      {/* 3D Canvas Background - Full Bleed */}
      <div className="absolute inset-0 z-0">
         <Hero3D />
         
         {/* Fade gradients to blend the 3D scene smoothly into the white page flow */}
         <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-bg to-transparent pointer-events-none z-10" />
         <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-bg/60 to-transparent pointer-events-none z-10" />
      </div>

      {/* Overlay Content */}
      <motion.div 
        style={reduceMotion ? undefined : { y: contentY, opacity: contentOpacity }}
        className="relative z-20 w-full grid md:grid-cols-12 gap-column-gap"
      >
        <StaggerGroup className="md:col-span-10 flex flex-col gap-6">
          <StaggerItem>
            <div className="font-mono text-label-mono uppercase tracking-[0.3em] text-on-surface-variant flex items-center gap-3">
              <span className="h-[1px] w-8 bg-on-surface/20" />
              <span>Live transmission</span>
            </div>
          </StaggerItem>

          <StaggerItem>
            <h1 className="font-display text-display-lg leading-[0.85] tracking-[-0.04em] text-on-surface">
              <TextReveal text="Builder of" className="block" delay={0.1} />
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.8 }}
                className="inline-block bg-primary text-on-surface px-4 py-1 rounded-lg italic mr-2"
              >
                resilient
              </motion.span>
              <TextReveal text="systems." delay={0.4} />
            </h1>
          </StaggerItem>

          <div className="grid md:grid-cols-2 gap-8 mt-6">
            <StaggerItem>
              <p className="text-body-lg text-on-surface-variant leading-[1.6] max-w-md pointer-events-auto font-medium">
                {site.longBio}
              </p>
            </StaggerItem>

            <StaggerItem>
              <div className="flex flex-wrap gap-x-4 gap-y-3 mt-2 md:mt-0 pointer-events-auto">
                {site.chips.map((c) => (
                  <div
                    key={c}
                    className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.12em] text-on-surface hover:text-bg hover:bg-on-surface transition-colors cursor-default px-5 py-2.5 rounded-full border border-on-surface/20 bg-bg/60 shadow-[0_2px_10px_rgba(0,0,0,0.04)]"
                  >
                    /{c}/
                  </div>
                ))}
              </div>
            </StaggerItem>
          </div>
        </StaggerGroup>
      </motion.div>
    </section>
  );
}
