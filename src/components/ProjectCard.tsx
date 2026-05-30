"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import type { Project } from "@/content/projects";
import { KineticReveal } from "./Reveal";

export function ProjectCard({ project }: { project: Project }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { damping: 25, stiffness: 180 });
  const mouseYSpring = useSpring(y, { damping: 25, stiffness: 180 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoaded) setIsLoaded(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, [isLoaded]);

  return (
    <KineticReveal>
      <Link 
        href={`/work/${project.slug}`} 
        className="block group"
        aria-label={`View project details for ${project.name}: ${project.tagline}`}
      >
        {/* Outer Shell Double-Bezel with Kinetic Feedback */}
        <div className="double-bezel-outer aspect-[16/10] w-full group-hover:ring-primary/25 transition-premium">
          <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }}
            className="relative w-full h-full"
          >
            {/* Sibling 1: Image & Loader */}
            <div className="absolute inset-0 double-bezel-inner overflow-hidden z-0 pointer-events-none bg-surface-dim">
              <AnimatePresence>
                {!isLoaded && (
                  <motion.div 
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0 bg-on-surface/10 animate-pulse z-40"
                  />
                )}
              </AnimatePresence>

              {!hasError ? (
                <Image
                  src={project.heroImage}
                  alt="" // Decorative since we have the aria-label on Link
                  fill
                  onLoad={() => setIsLoaded(true)}
                  onError={() => {
                    setHasError(true);
                    setIsLoaded(true);
                  }}
                  className={`object-cover transition-all duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.05] group-hover:blur-[2px] z-0 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={project.index === "01"}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-surface-variant/20 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant/40">
                  Image Unavailable
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-bg/95 via-bg/20 to-transparent opacity-40 group-hover:opacity-30 transition-opacity duration-700 z-10" />
            </div>

            {/* Tag: always visible on mobile (no hover on touch), hover-only on desktop */}
            <div 
              style={{ transform: "translateZ(30px)" }}
              className="absolute top-6 right-6 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 scale-100 md:scale-90 md:group-hover:scale-100 z-30 pointer-events-none"
            >
              <span className="px-3 py-1.5 rounded-full border border-on-surface/10 bg-white/40 backdrop-blur-md font-mono text-[9px] text-on-surface tracking-[0.2em] uppercase shadow-lg">
                {project.index} {" // "} {project.year.split(" · ")[0]}
              </span>
            </div>

            <div 
              style={{ transform: "translateZ(40px)", transformStyle: "preserve-3d" }}
              className="absolute bottom-6 left-6 right-6 z-30 pointer-events-none"
            >
              <span className="inline-block bg-primary text-on-surface font-mono font-bold text-[9px] uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm mb-2 shadow-sm">
                {project.ecosystem}
              </span>
              <h3 className="font-display italic text-headline-sm md:text-headline-md tracking-tight text-on-surface drop-shadow-sm break-words line-clamp-2">
                {project.name}
              </h3>
            </div>
          </motion.div>
        </div>

        {/* Content Footer with Kinetic Interaction */}
        <div className="mt-6 px-1 flex justify-between items-start">
          <div className="max-w-[70%]">
            <p className="text-body-sm text-on-surface-variant line-clamp-2 leading-relaxed font-medium break-words">
              {project.tagline}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {project.stack.slice(0, 3).map((s) => (
                <span key={s} className="font-mono font-semibold text-[9px] uppercase tracking-[0.2em] text-on-surface-variant">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Kinetic Arrow: Translates diagonally on hover/active */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-full border border-outline bg-on-surface/[0.02] text-on-surface group-hover:border-primary group-hover:bg-primary group-active:scale-95 transition-all duration-500 text-[10px] uppercase font-mono tracking-widest font-semibold">
            <span className="hidden md:inline">Project</span>
            <div className="w-5 h-5 rounded-full bg-on-surface/[0.04] group-hover:bg-white/40 flex items-center justify-center text-[10px] group-hover:translate-x-1 group-hover:-translate-y-1 group-active:translate-x-1 group-active:-translate-y-1 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
              ↗
            </div>
          </div>
        </div>
      </Link>
    </KineticReveal>
  );
}
