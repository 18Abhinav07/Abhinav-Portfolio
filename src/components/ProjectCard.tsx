"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "motion/react";
import type { Project } from "@/content/projects";

export function ProjectCard({ project }: { project: Project }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

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
    const timer = setTimeout(() => setIsLoaded(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <Link href={`/work/${project.slug}`} className="block">
        <motion.div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          className="relative aspect-[16/10] w-full rounded-xl bg-surface-variant/20 overflow-hidden transition-all duration-500 ease-out group-hover:bg-surface-variant/40"
        >
          {/* Skeleton Loader */}
          <AnimatePresence>
            {!isLoaded && (
              <motion.div 
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 bg-surface-container-highest animate-pulse z-10"
              />
            )}
          </AnimatePresence>

          {/* Subtle Glow */}
          <div 
            style={{ transform: "translateZ(20px)" }}
            className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-20" 
          />

          <Image
            src={project.heroImage}
            alt={project.name}
            fill
            onLoad={() => setIsLoaded(true)}
            className={`object-cover transition-all duration-700 ease-out group-hover:scale-105 z-0 ${isLoaded ? 'opacity-80 group-hover:opacity-100' : 'opacity-0'}`}
            sizes="(max-width: 768px) 100vw, 50vw"
          />

          {/* Video Overlay Hint */}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500 z-10" />

          {/* Catchy Tagline Overlay */}
          <div 
            style={{ transform: "translateZ(60px)" }}
            className="absolute bottom-6 left-6 right-6 z-30"
          >
            <div className="overflow-hidden">
               <motion.p 
                initial={{ y: "100%" }}
                whileInView={{ y: 0 }}
                className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary mb-2 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100"
              >
                {project.ecosystem}
              </motion.p>
            </div>
            <h3 className="font-display text-headline-sm md:text-headline-md tracking-tight text-white drop-shadow-2xl">
              {project.name}
            </h3>
          </div>

          {/* Detailed Surface Tag */}
          <div 
            style={{ transform: "translateZ(40px)" }}
            className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100 z-30"
          >
            <span className="px-4 py-1.5 rounded-full border border-white/20 bg-black/40 backdrop-blur-md font-mono text-[10px] text-white tracking-widest uppercase">
              {project.index} / {project.year.split(" · ")[0]}
            </span>
          </div>
        </motion.div>

        <div className="mt-6 flex justify-between items-start">
          <div className="max-w-[80%]">
            <p className="text-body-sm text-on-surface-variant line-clamp-2 leading-relaxed">
              {project.tagline}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.stack.slice(0, 3).map((s) => (
                <span key={s} className="font-mono text-[9px] uppercase tracking-wider text-on-surface-variant/60">
                  #{s}
                </span>
              ))}
            </div>
          </div>
          <div className="font-mono text-[11px] text-primary group-hover:translate-x-1 transition-transform">
            OPEN →
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
