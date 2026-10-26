"use client";

import { useEffect, useRef, useState } from "react";
import type { Project } from "@/content/projects";

const shotsOf = (p: Project) => {
  const real = p.screenshots.filter((s) => !s.src.includes("img.youtube.com")).map((s) => s.src);
  return real.length ? real.slice(0, 5) : p.heroImage ? [p.heroImage] : [];
};

/** One smaller project: its screens cycle while the card is on screen, faster under the pointer. */
function Card({ p, delay, onOpen }: { p: Project; delay: number; onOpen: (slug: string) => void }) {
  const shots = shotsOf(p);
  const box = useRef<HTMLAnchorElement>(null);
  const [seen, setSeen] = useState(false);
  const [hot, setHot] = useState(false);
  const [i, setI] = useState(0);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([x]) => setSeen(x.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!seen || shots.length < 2 || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let id: ReturnType<typeof setInterval>;
    // Staggered starts, so the grid never flips all at once.
    const start = setTimeout(() => {
      setI((n) => (n + 1) % shots.length);
      id = setInterval(() => setI((n) => (n + 1) % shots.length), hot ? 1300 : 3200);
    }, hot ? 250 : delay);
    return () => (clearTimeout(start), clearInterval(id));
  }, [seen, hot, delay, shots.length]);

  return (
    <a
      ref={box}
      className="mcard"
      href={`/work/${p.slug}`}
      onClick={(e) => (e.preventDefault(), onOpen(p.slug))}
      onMouseEnter={() => setHot(true)}
      onMouseLeave={() => setHot(false)}
    >
      <div className="shot">
        {shots.map((src, n) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={src} src={src} alt="" loading="lazy" className={n === i ? "on" : ""} />
        ))}
        {p.videos?.length ? <span className="badge mono">Video</span> : null}
        {shots.length > 1 && (
          <div className="ticks">
            {shots.map((src, n) => (
              <i key={src} className={n === i ? "on" : ""} />
            ))}
          </div>
        )}
      </div>
      <div className="body">
        <div className="top mono">
          <span>{p.index}</span>
          <span>
            {p.year} · {p.domain}
          </span>
        </div>
        <h5>
          {p.name} <span className="arr">↗</span>
        </h5>
        <p>{p.tagline}</p>
      </div>
    </a>
  );
}

export function MoreWork({ projects, onOpen }: { projects: Project[]; onOpen: (slug: string) => void }) {
  return (
    <div className="more reveal">
      <h4 className="mono">More work</h4>
      <div className="mgrid">
        {projects.map((p, n) => (
          <Card key={p.slug} p={p} delay={900 + n * 650} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
}
