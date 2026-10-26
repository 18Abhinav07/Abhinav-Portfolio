"use client";

import { useEffect, useRef, useState } from "react";
import type { Project } from "@/content/projects";
import { SITE_HOST } from "@/content/site-url";
import { Media, projectLinks } from "./Media";

/** A live page inside the sheet. The iframe only loads once the visitor asks for it or scrolls to it. */
function Embed({ p }: { p: Project }) {
  const e = p.embed!;
  const box = useRef<HTMLDivElement>(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([x]) => x.isIntersecting && setLoad(true), { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const host = e.src.startsWith("/") ? `${SITE_HOST}${e.src.replace(/index\.html$/, "")}` : e.src.replace(/^https:\/\//, "");
  return (
    <div className="media m-embed" ref={box}>
      <div className="bar">
        <i />
        <i />
        <i />
        <span>{host}</span>
        <a className="open mono" href={e.src} target="_blank" rel="noreferrer">
          Open full site ↗
        </a>
      </div>
      <div className="frame">
        {load ? (
          <iframe src={e.src} title={e.title} loading="lazy" />
        ) : (
          <button type="button" className="poster" onClick={() => setLoad(true)} aria-label={`Load ${e.title}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {p.heroImage && <img src={p.heroImage} alt="" />}
          </button>
        )}
      </div>
    </div>
  );
}

export function ProjectSheet({
  project: p,
  next,
  open,
  instant,
  onClose,
  onNext,
}: {
  project: Project;
  next: Project;
  open: boolean;
  instant: boolean;
  onClose: () => void;
  onNext: (slug: string) => void;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const hasOwnMedia = !!(p.videos?.length || p.screenshots.length);

  // A new project starts at the top, with focus on the way out.
  useEffect(() => {
    scroller.current?.scrollTo(0, 0);
    closeBtn.current?.focus({ preventScroll: true });
  }, [p.slug]);

  return (
    <div
      className={`sheet${open ? " open" : ""}${instant ? " instant" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={p.name}
    >
      <div className="sheet-scrim" onClick={onClose} />
      <div className="sheet-panel" ref={scroller}>
        <div className="sheet-bar">
          <span className="mono">
            {p.index} · {p.name}
          </span>
          <button ref={closeBtn} type="button" className="sheet-close mono" onClick={onClose}>
            Close ✕
          </button>
        </div>

        <div className="wrap sheet-body">
          <header className="sheet-head">
            <div className="mono muted">
              {p.year} · {p.domain} · {p.role}
            </div>
            <h1>{p.name}</h1>
            <p className="tag">{p.tagline}</p>
            <div className="links">
              {projectLinks(p).map(([l, href]) => (
                <a key={l} href={href} target="_blank" rel="noreferrer">
                  {l} ↗
                </a>
              ))}
            </div>
          </header>

          {/* Keyed so Next mounts a fresh iframe: changing a live iframe's src would add a browser history entry. */}
          <div className="sheet-media">{p.embed ? <Embed key={p.slug} p={p} /> : <Media key={p.slug} p={p} />}</div>

          <div className="sheet-grid">
            <div>
              <h6 className="mono muted">What it is</h6>
              <p className="desc">{p.description}</p>
              {p.posts && p.posts.length > 0 && (
                <div className="sheet-posts">
                  <h6 className="mono muted">Writing</h6>
                  {p.posts.map((post) => (
                    <a key={post.url} href={post.url} target="_blank" rel="noreferrer">
                      <span>{post.title}</span>
                      <span className="arr">↗</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
            <aside>
              {p.metrics.length > 0 && (
                <div className="metrics">
                  {p.metrics.map((m) => (
                    <div key={m.label}>
                      <b>{m.value}</b>
                      <small>{m.label}</small>
                    </div>
                  ))}
                </div>
              )}
              <h6 className="mono muted">Stack</h6>
              <div className="meta">
                {[p.ecosystem, ...p.stack].map((s) => (
                  <span key={s} className="chip">
                    {s}
                  </span>
                ))}
              </div>
            </aside>
          </div>

          {p.embed && hasOwnMedia && (
            <div className="sheet-media second">
              <Media key={p.slug} p={p} />
            </div>
          )}

          <button type="button" className="sheet-next" onClick={() => onNext(next.slug)}>
            <span className="mono muted">Next · {next.index}</span>
            <span className="t">
              {next.name} <span className="arr">→</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
