"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { Project } from "@/content/projects";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/Reveal";
import { ProjectLoader } from "@/components/ProjectLoader";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import { DeckEmbed } from "@/components/DeckEmbed";

interface ProjectContentProps {
  project: Project;
  nextProject: Project;
}

export function ProjectContent({ project, nextProject }: ProjectContentProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState(0);
  const [individualLoads, setIndividualLoads] = useState<Record<string, boolean>>({});
  const totalImages = project.screenshots.length;

  useEffect(() => {
    // Body Lock
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isLoading]);

  const handleImageLoad = (src: string) => {
    if (!individualLoads[src]) {
      setIndividualLoads(prev => ({ ...prev, [src]: true }));
      setLoadedImages((prev) => prev + 1);
    }
  };

  const handleImageError = () => {
    // Treat errors as "loaded" so we don't hang the UI forever
    setLoadedImages((prev) => prev + 1);
  };

  useEffect(() => {
    if (loadedImages >= totalImages) {
      // Artificial delay for that "Sync" feel, similar to Beyond
      const timer = setTimeout(() => setIsLoading(false), 800);
      return () => clearTimeout(timer);
    }
  }, [loadedImages, totalImages]);

  // Fail-safe: if images take too long or fail
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isLoading && <ProjectLoader project={project} progress={totalImages > 0 ? Math.min(100, Math.floor((loadedImages / totalImages) * 100)) : 0} />}
      </AnimatePresence>

      <motion.article 
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.6 }}
      >
        <header className="px-6 md:px-[80px] pt-[120px] pb-stack-xl">
          <div className="grid md:grid-cols-12 gap-column-gap">
            <div className="md:col-span-3 font-mono text-label-mono uppercase tracking-[0.18em] text-on-surface font-bold">
              {project.index} · {project.ecosystem}
              <div className="mt-stack-md text-on-surface-variant">
                {project.role}
                <br />
                {project.year}
              </div>
            </div>
            <div className="md:col-span-9 max-w-3xl">
              <h1 className="font-display text-display-lg-mobile md:text-display-lg leading-[0.95] tracking-[-0.02em] text-on-surface mb-stack-md">
                {project.name}.
              </h1>
              <p className="font-display italic text-headline-md text-on-surface-variant leading-[1.3]">
                {project.tagline}
              </p>
            </div>
          </div>
        </header>

        <Reveal className="px-6 md:px-[80px] mb-[120px]" y={48}>
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-variant/10">
            <AnimatePresence mode="wait">
              {!individualLoads[project.heroImage] && (
                <motion.div 
                  key="skeleton"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 bg-surface-container-highest animate-pulse z-10"
                />
              )}
            </AnimatePresence>
            <Image
              src={project.heroImage}
              alt={project.name}
              fill
              className={`object-cover transition-opacity duration-700 ${individualLoads[project.heroImage] ? 'opacity-100' : 'opacity-0'}`}
              sizes="(min-width: 768px) calc(100vw - 160px), 100vw"
              onLoad={() => handleImageLoad(project.heroImage)}
              priority
            />
          </div>
        </Reveal>

        <section className="px-6 md:px-[80px] mb-[120px]">
          <div className="grid md:grid-cols-12 gap-column-gap">
            <div className="md:col-span-3 font-mono text-label-mono uppercase tracking-[0.18em] text-on-surface font-bold">
              Brief
            </div>
            <div className="md:col-span-9 max-w-3xl">
              <p className="editorial-text text-on-surface drop-cap">
                {project.description}
              </p>
            </div>
          </div>
        </section>

        <section className="px-6 md:px-[80px] mb-[120px] grid md:grid-cols-12 gap-column-gap">
          <div className="md:col-span-3 font-mono text-label-mono uppercase tracking-[0.18em] text-on-surface font-bold mb-stack-md md:mb-0">
            Metrics
          </div>
          <StaggerGroup className="md:col-span-9 grid grid-cols-2 md:grid-cols-4 gap-stack-md">
            {project.metrics.map((m) => (
              <StaggerItem key={m.label} className="border-t border-outline-variant/40 pt-stack-md">
                <div className="font-display text-headline-md text-on-surface tracking-[-0.01em]">
                  {m.value}
                </div>
                <div className="font-mono text-label-mono uppercase tracking-[0.18em] text-on-surface-variant mt-1">
                  {m.label}
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </section>

        <section className="px-6 md:px-[80px] mb-[120px] grid md:grid-cols-12 gap-column-gap">
          <div className="md:col-span-3 font-mono text-label-mono uppercase tracking-[0.18em] text-on-surface font-bold mb-stack-md md:mb-0">
            Stack
          </div>
          <div className="md:col-span-9 flex flex-wrap gap-stack-sm">
            {project.stack.map((t) => (
              <span
                key={t}
                className="font-mono text-label-mono uppercase tracking-[0.18em] px-stack-sm py-1.5 border border-outline-variant rounded-pill text-on-surface-variant"
              >
                {t}
              </span>
            ))}
          </div>
        </section>

        {project.screenshots.length > 1 && (
          <section className="px-6 md:px-[80px] mb-[120px]">
            <div className="font-mono text-label-mono uppercase tracking-[0.18em] text-on-surface font-bold mb-stack-lg">
              Surface · {project.screenshots.length.toString().padStart(2, "0")} frames
            </div>
            <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
              {project.screenshots.slice(1).map((s, i) => (
                <StaggerItem key={s.src} className="relative">
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-variant/10">
                    <AnimatePresence mode="wait">
                      {!individualLoads[s.src] && (
                        <motion.div 
                          key="skeleton"
                          initial={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.6 }}
                          className="absolute inset-0 bg-surface-container-highest animate-pulse z-10"
                        />
                      )}
                    </AnimatePresence>
                    <Image
                      src={s.src}
                      alt={s.caption || `${project.name} frame ${i + 2}`}
                      fill
                      className={`object-cover transition-opacity duration-700 ${individualLoads[s.src] ? 'opacity-100' : 'opacity-0'}`}
                      sizes="(min-width: 768px) 50vw, 100vw"
                      onLoad={() => handleImageLoad(s.src)}
                      onError={handleImageError}
                    />
                  </div>
                  {s.caption && (
                    <div className="mt-stack-sm font-mono text-label-mono uppercase tracking-[0.18em] text-on-surface-variant">
                      {s.caption}
                    </div>
                  )}
                </StaggerItem>
              ))}
            </StaggerGroup>
          </section>
        )}

        {project.videos && project.videos.length > 0 && (
          <section className="px-6 md:px-[80px] mb-[120px]">
            <StaggerGroup className="grid grid-cols-1 gap-stack-lg">
              {project.videos.map((v) => (
                <StaggerItem key={v.youtubeId}>
                  {v.title && (
                    <div className="font-mono text-label-mono uppercase tracking-[0.18em] text-on-surface font-bold mb-stack-lg">
                      {v.title}
                    </div>
                  )}
                  <YouTubeEmbed youtubeId={v.youtubeId} title={v.title || project.name} />
                </StaggerItem>
              ))}
            </StaggerGroup>
          </section>
        )}

        {project.presentationUrl && (
          <section className="px-6 md:px-[80px] mb-[120px]">
            <div className="font-mono text-label-mono uppercase tracking-[0.18em] text-on-surface font-bold mb-stack-lg">
              Presentation Deck
            </div>
            <DeckEmbed url={project.presentationUrl} title={`${project.name} Deck`} />
          </section>
        )}

        {(project.liveUrl || project.githubUrl || project.docsUrl) && (
          <section className="px-6 md:px-[80px] mb-[120px] flex flex-wrap gap-stack-md">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-label-mono uppercase tracking-[0.18em] px-stack-md py-3 bg-primary text-on-surface font-bold rounded-pill hover:bg-secondary hover:text-on-surface transition-colors"
              >
                Live site →
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-label-mono uppercase tracking-[0.18em] px-stack-md py-3 border border-outline-variant rounded-pill text-on-surface hover:border-primary hover:text-on-surface font-bold transition-colors"
              >
                Source →
              </a>
            )}
            {project.docsUrl && (
              <a
                href={project.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-label-mono uppercase tracking-[0.18em] px-stack-md py-3 border border-outline-variant rounded-pill text-on-surface hover:border-primary hover:text-on-surface font-bold transition-colors"
              >
                Docs →
              </a>
            )}
          </section>
        )}

        <nav className="px-6 md:px-[80px] py-[120px] brutalist-rule-t">
          <Link
            href={`/work/${nextProject.slug}`}
            className="group flex items-end justify-between"
          >
            <div>
              <div className="font-mono text-label-mono uppercase tracking-[0.18em] text-on-surface font-bold mb-stack-sm">
                Next · {nextProject.index}
              </div>
              <div className="font-display text-headline-lg tracking-[-0.02em] text-on-surface group-hover:opacity-80 transition-opacity">
                {nextProject.name}.
              </div>
            </div>
            <div className="font-mono text-label-mono uppercase tracking-[0.18em] text-on-surface-variant group-hover:text-on-surface font-bold transition-colors">
              →
            </div>
          </Link>
        </nav>
      </motion.article>
    </>
  );
}
