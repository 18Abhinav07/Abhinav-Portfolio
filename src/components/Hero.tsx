"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { site } from "@/content/site";
import { Reveal, StaggerGroup, StaggerItem } from "./Reveal";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const canvasY = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const canvasScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);
  const labelY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);

  return (
    <section
      ref={sectionRef}
      className="relative px-6 md:px-[80px] pt-[120px] pb-[120px] overflow-hidden"
    >
      <div className="grid md:grid-cols-12 gap-column-gap items-end">
        <div className="md:col-span-7 relative">
          <motion.div
            style={{ y: canvasY, scale: canvasScale }}
            className="aspect-[4/5] w-full bg-surface-container-low brutalist-rule-t brutalist-rule-b brutalist-rule-l brutalist-rule-r relative overflow-hidden will-change-transform"
          >
            <div className="absolute inset-0 grid-paper opacity-30" />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.3 }}
                className="font-mono text-label-mono uppercase tracking-[0.2em] text-on-surface-variant"
              >
                [ Spline · bust ]
              </motion.div>
            </div>
            <motion.div
              style={{ y: labelY }}
              className="absolute top-stack-md left-stack-md font-mono text-label-mono uppercase tracking-[0.18em] text-primary"
            >
              Subject · 001
            </motion.div>
            <motion.div
              style={{ y: labelY }}
              className="absolute bottom-stack-md right-stack-md font-mono text-label-mono uppercase tracking-[0.18em] text-on-surface-variant"
            >
              28.6139° N
            </motion.div>
          </motion.div>
        </div>

        <StaggerGroup className="md:col-span-5 flex flex-col gap-stack-lg">
          <StaggerItem>
            <div className="font-mono text-label-mono uppercase tracking-[0.18em] text-primary">
              01 / Hero · Live transmission
            </div>
          </StaggerItem>
          <StaggerItem>
            <h1 className="font-display text-display-lg-mobile md:text-display-lg leading-[0.95] tracking-[-0.02em] text-on-surface">
              Builder of <em className="italic text-primary">resilient systems.</em>
            </h1>
          </StaggerItem>
          <StaggerItem>
            <p className="text-body-lg text-on-surface-variant max-w-md">
              {site.longBio}
            </p>
          </StaggerItem>
          <StaggerItem>
            <div className="flex flex-wrap gap-stack-sm">
              {site.chips.map((c, i) => (
                <motion.span
                  key={c}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  className="font-mono text-label-mono uppercase tracking-[0.18em] px-stack-sm py-1.5 rounded-pill border border-outline-variant text-on-surface-variant"
                >
                  {c}
                </motion.span>
              ))}
            </div>
          </StaggerItem>
        </StaggerGroup>
      </div>

      <Reveal className="sr-only" as="span" once>
        anchor
      </Reveal>
    </section>
  );
}
