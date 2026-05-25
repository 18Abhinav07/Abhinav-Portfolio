"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import type { Project } from "@/content/projects";

export function ProjectRow({ project }: { project: Project }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
    <Link
      href={`/work/${project.slug}`}
      className="project-row group relative grid grid-cols-12 gap-column-gap items-center py-stack-lg px-stack-md brutalist-rule-b transition-colors duration-500 hover:bg-surface-variant/30"
    >
      <div className="col-span-2 md:col-span-1 font-mono text-label-mono text-on-surface-variant">
        {project.index}
      </div>
      <div className="col-span-10 md:col-span-4 flex flex-col gap-1">
        <h3 className="font-display text-headline-md tracking-[-0.01em] text-on-surface group-hover:text-secondary transition-colors duration-500">
          {project.name}
        </h3>
        <p className="text-body-sm text-on-surface-variant">{project.tagline}</p>
      </div>
      <div className="hidden md:flex col-span-3 flex-wrap gap-1.5">
        {project.stack.slice(0, 3).map((t) => (
          <span
            key={t}
            className="font-mono text-[10px] uppercase tracking-[0.15em] px-2 py-0.5 border border-outline-variant rounded-pill text-on-surface-variant"
          >
            {t}
          </span>
        ))}
      </div>
      <div className="hidden md:block col-span-2 font-mono text-label-mono uppercase tracking-[0.18em] text-on-surface-variant">
        {project.ecosystem}
      </div>
      <div className="col-span-12 md:col-span-2 flex justify-end font-mono text-label-mono uppercase tracking-[0.18em] text-primary opacity-0 group-hover:opacity-100 transition-opacity">
        Open →
      </div>

      <div className="pointer-events-none absolute right-stack-md top-1/2 -translate-y-1/2 w-48 aspect-video overflow-hidden brutalist-rule-t brutalist-rule-b brutalist-rule-l brutalist-rule-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden lg:block">
        <Image
          src={project.heroImage}
          alt={project.name}
          fill
          className="object-cover"
          sizes="192px"
        />
      </div>
    </Link>
    </motion.div>
  );
}
