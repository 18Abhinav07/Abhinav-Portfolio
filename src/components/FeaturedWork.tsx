"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { projects } from "@/content/projects";
import { ProjectCard } from "./ProjectCard";
import { Reveal } from "./Reveal";
import Link from "next/link";

const COUNT_WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve"];
const AUTOPLAY_MS = 5500;

export function FeaturedWork() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const reduceMotion = useReducedMotion();
  const countWord = COUNT_WORDS[projects.length] ?? String(projects.length);

  const slides = () => Array.from(trackRef.current?.children ?? []) as HTMLElement[];

  const goTo = useCallback((i: number) => {
    const track = trackRef.current;
    const items = slides();
    if (!track || items.length === 0) return;
    // Wrap both ways so the run of projects reads as one continuous loop.
    const next = (i + items.length) % items.length;
    track.scrollTo({ left: items[next].offsetLeft - items[0].offsetLeft, behavior: "smooth" });
  }, []);

  // The active slide is whichever card's left edge sits closest to the track's start.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const items = slides();
        if (items.length === 0) return;
        const origin = items[0].offsetLeft;
        let best = 0;
        let bestDist = Infinity;
        items.forEach((el, i) => {
          const dist = Math.abs(el.offsetLeft - origin - track.scrollLeft);
          if (dist < bestDist) {
            bestDist = dist;
            best = i;
          }
        });
        // At the far end the last cards can never reach the start edge, so snap the count to the end.
        if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 4) best = items.length - 1;
        setActive(best);
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Only autoplay while the carousel is on screen.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.4 });
    io.observe(track);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduceMotion || paused || !inView) return;
    const timer = setTimeout(() => goTo(active + 1), AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [active, paused, inView, reduceMotion, goTo]);

  const arrowClass =
    "w-11 h-11 rounded-full border border-outline bg-surface-container-high/40 text-on-surface flex items-center justify-center font-mono text-sm hover:border-primary hover:bg-primary active:scale-95 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]";

  return (
    <section className="px-6 md:px-[80px] py-[120px] md:py-[160px] bg-surface relative overflow-hidden">
      {/* Subtle Grid Accent */}
      <div className="absolute inset-0 grid-paper opacity-10 pointer-events-none" />

      {/* Floating Gradient Mesh Orb */}
      <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] rounded-full bg-gradient-to-tr from-secondary/5 to-primary/5 blur-[120px] pointer-events-none animate-float-orb z-0" />

      <div className="relative z-10">
        <div className="grid md:grid-cols-12 gap-column-gap mb-16 md:mb-20">
          <Reveal className="md:col-span-3 font-mono text-label-mono uppercase tracking-[0.18em]" y={20}>
            <span className="bg-primary text-on-surface px-2 py-0.5 rounded font-bold">03 / Featured · Selected Systems</span>
          </Reveal>
          <Reveal className="md:col-span-9 max-w-2xl" y={28} delay={0.1}>
            <h2 className="font-display text-headline-lg leading-[1.05] tracking-[-0.02em] text-on-surface mb-stack-md">
              {countWord} systems. <em className="inline-block bg-primary text-on-surface px-3 py-1 rounded-md not-italic font-bold">Owned end to end.</em>
            </h2>
            <p className="text-body-md text-on-surface-variant leading-relaxed">
              A shared graph that tells parallel coding agents when the code under them changed, a verification loop that makes an agent prove its work instead of reporting it, and a control plane that decides what an agent may spend before it pays. Then the rest of the range, one card at a time.
            </p>
          </Reveal>
        </div>

        <div className="flex items-center justify-between mb-8 md:mb-10">
          <div className="font-mono text-label-mono uppercase tracking-[0.18em] text-on-surface font-bold" aria-live="polite">
            {String(active + 1).padStart(2, "0")}
            <span className="text-on-surface-variant font-normal"> / {String(projects.length).padStart(2, "0")}</span>
            <span className="hidden md:inline text-on-surface-variant font-normal"> · {projects[active]?.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" aria-label="Previous project" onClick={() => goTo(active - 1)} className={arrowClass}>
              ←
            </button>
            <button type="button" aria-label="Next project" onClick={() => goTo(active + 1)} className={arrowClass}>
              →
            </button>
          </div>
        </div>

        {/* The track bleeds to the section edges so the next card always peeks in. */}
        <div
          ref={trackRef}
          role="region"
          aria-roledescription="carousel"
          aria-label="All projects"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          onPointerDown={() => setPaused(true)}
          className="-mx-6 md:-mx-[80px] px-6 md:px-[80px] scroll-px-6 md:scroll-px-[80px] flex gap-8 md:gap-12 overflow-x-auto snap-x snap-mandatory overscroll-x-contain pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {projects.map((p) => (
            <div key={p.slug} className="snap-start shrink-0 w-[84vw] sm:w-[62vw] md:w-[46vw] lg:w-[40vw]">
              <ProjectCard project={p} />
            </div>
          ))}
        </div>

        {/* Progress rail: one segment per project, each one a jump target. */}
        <div className="mt-8 flex gap-2" aria-hidden="true">
          {projects.map((p, i) => (
            <button
              key={p.slug}
              type="button"
              tabIndex={-1}
              onClick={() => goTo(i)}
              className="group flex-1 py-2"
            >
              <span
                className={`block h-[2px] rounded-full transition-colors duration-500 ${i === active ? "bg-on-surface" : "bg-outline-variant/50 group-hover:bg-outline"}`}
              />
            </button>
          ))}
        </div>

        {/* Call to Action to view all work */}
        <Reveal className="mt-16 md:mt-20 flex justify-center" y={20}>
          <Link
            href="/work"
            className="group flex items-center gap-3 px-6 py-3.5 rounded-full border border-outline bg-surface-container-high/40 text-on-surface hover:border-primary hover:bg-primary hover:text-on-surface hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] uppercase font-mono text-[10px] tracking-widest font-semibold"
          >
            <span>View all {countWord.toLowerCase()} systems</span>
            <div className="w-5 h-5 rounded-full bg-on-surface/[0.04] group-hover:bg-white/40 flex items-center justify-center text-[10px] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-500">
              ↗
            </div>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
