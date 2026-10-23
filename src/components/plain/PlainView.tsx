"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Project } from "@/content/projects";
import type { Episode } from "@/content/episodes";
import { SCENES, pickScene, rememberScene, runPixelFooter, sceneSVG, takeHandedOffScene } from "./scenes";
import { setView } from "../ViewChooser";
import "./plain.css";

export type PlainPost = { slug: string; title: string; kind: string; date: string; readTime: string };
export type PlainSite = {
  name: string;
  headline: string;
  heroLine: string;
  email: string;
  location: string;
  replyWindow: string;
  status: string[];
  about: { lead: string; body: string; facts: string[][] };
  socials: { label: string; url: string }[];
};

const FEATURED = ["loom", "zidd", "guardiankane", "agentops", "kredio"];
const COUNT_WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve"];
const ELSEWHERE = ["GitHub", "LinkedIn", "Twitter / X", "dev.to"];

type Tone = [string, string, string, string];
const BASE_TONES: Record<string, Tone> = {
  paper: ["#f3f0e8", "#16171a", "#6b6a66", "rgba(22,23,26,.12)"],
  ink: ["#0f1013", "#ece9e1", "#8a877f", "rgba(255,255,255,.10)"],
  sand: ["#e8e0cf", "#1d1b17", "#6e6656", "rgba(29,27,23,.14)"],
};

// Loom's only "screenshot" is its video thumbnail, which is not worth a second tab.
const realShots = (p: Project) => p.screenshots.filter((s) => !s.src.includes("img.youtube.com"));

function Media({ p }: { p: Project }) {
  const video = p.videos?.[0];
  const shots = realShots(p).slice(0, 5);
  const [tab, setTab] = useState<"video" | "shots">(video ? "video" : "shots");
  const [playing, setPlaying] = useState(false);
  const [shot, setShot] = useState(0);

  useEffect(() => {
    if (tab !== "shots" || shots.length < 2) return;
    const id = setInterval(() => setShot((i) => (i + 1) % shots.length), 2800);
    return () => clearInterval(id);
  }, [tab, shots.length]);

  if (!video && shots.length === 0) return null;
  return (
    <div>
      {video && shots.length > 0 && (
        <div className="tabs" role="tablist">
          <button type="button" role="tab" aria-selected={tab === "video"} className={tab === "video" ? "on" : ""} onClick={() => setTab("video")}>
            Video
          </button>
          <button type="button" role="tab" aria-selected={tab === "shots"} className={tab === "shots" ? "on" : ""} onClick={() => setTab("shots")}>
            Screens
          </button>
        </div>
      )}
      {tab === "video" && video ? (
        <div className="media m-video">
          {playing ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
              title={video.title ?? `${p.name} demo`}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <button type="button" className="vbtn" aria-label={`Play ${video.title ?? `${p.name} demo`}`} onClick={() => setPlaying(true)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                alt=""
                loading="lazy"
                // Not every upload has a max-res thumbnail; hqdefault always exists.
                // YouTube may answer with a 120px grey placeholder instead of an error.
                onError={(e) => {
                  const img = e.currentTarget;
                  if (!img.src.includes("hqdefault")) img.src = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;
                }}
                onLoad={(e) => {
                  const img = e.currentTarget;
                  if (img.naturalWidth <= 120 && !img.src.includes("hqdefault"))
                    img.src = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;
                }}
              />
              <span className="play" />
              <span className="cap mono">{video.title ?? "Demo"}</span>
            </button>
          )}
        </div>
      ) : (
        <div className="media m-shots">
          <div className="bar">
            <i />
            <i />
            <i />
            <span>{shots[shot]?.caption}</span>
          </div>
          <div className="stage">
            {shots.map((s, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={s.src} src={s.src} alt={s.caption} loading="lazy" className={i === shot ? "on" : ""} />
            ))}
            <div className="dots">
              {shots.map((s, i) => (
                <i key={s.src} className={i === shot ? "on" : ""} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function projectLinks(p: Project): [string, string][] {
  const out: [string, string][] = [];
  if (p.githubUrl) out.push(["Source", p.githubUrl]);
  if (p.docsUrl) out.push(["Docs", p.docsUrl]);
  if (p.blogUrl) out.push(["Write-up", p.blogUrl]);
  if (p.presentationUrl) out.push(["Deck", p.presentationUrl]);
  if (p.liveUrl) out.push(["Live", p.liveUrl]);
  if (p.apiUrl) out.push(["Live API", p.apiUrl]);
  return out;
}

export function PlainView({
  site,
  projects,
  episodes,
  posts,
}: {
  site: PlainSite;
  projects: Project[];
  episodes: Episode[];
  posts: PlainPost[];
}) {
  const root = useRef<HTMLDivElement>(null);
  const heroSvg = useRef<SVGSVGElement>(null);
  const veil = useRef<HTMLDivElement>(null);
  const pixel = useRef<HTMLCanvasElement>(null);
  const hov = useRef<HTMLDivElement>(null);
  const [scene, setScene] = useState<string | null>(null);
  const [hoverSrc, setHoverSrc] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const featured = FEATURED.map((s) => projects.find((p) => p.slug === s)).filter((p): p is Project => !!p);
  const more = projects.filter((p) => !FEATURED.includes(p.slug));
  const countWord = COUNT_WORDS[projects.length] ?? String(projects.length);
  const S = scene ? SCENES[scene] : null;

  // The chooser may have handed over the scene it previewed; otherwise pick a fresh one.
  useEffect(() => {
    const k = takeHandedOffScene() ?? pickScene();
    rememberScene(k);
    setScene(k);
    const id = setTimeout(() => setReady(true), 150);
    return () => clearTimeout(id);
  }, []);

  // Paint the hero, wire parallax, and start the footer for the current scene.
  useEffect(() => {
    if (!S || !heroSvg.current || !pixel.current) return;
    heroSvg.current.innerHTML = sceneSVG(S, "h");
    if (veil.current) veil.current.style.background = `linear-gradient(180deg,rgba(0,0,0,0) 40%,rgba(10,10,20,${S.veil}) 100%)`;
    const layers = [...heroSvg.current.querySelectorAll<SVGElement>(".layer")];
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const onScroll = () => {
      const y = scrollY;
      if (y < innerHeight * 1.2) layers.forEach((l) => (l.style.transform = `translateY(${-y * Number(l.dataset.depth) * 1.6}px)`));
    };
    if (!reduce) addEventListener("scroll", onScroll, { passive: true });
    const stop = runPixelFooter(pixel.current, S.foot, reduce);
    return () => {
      removeEventListener("scroll", onScroll);
      stop();
    };
  }, [S]);

  // Section tones: the page eases to whichever section owns the middle of the screen.
  useEffect(() => {
    if (!S || !root.current) return;
    const el = root.current;
    const tones: Record<string, Tone> = {
      ...BASE_TONES,
      hero: [S.fore.c[1], "#f3f0e8", "#a8a6b8", "rgba(255,255,255,.12)"],
      night: [S.foot.sky[0], S.foot.fg, S.foot.mu, S.foot.li],
    };
    const set = (t: string) => {
      const [bg, fg, mu, li] = tones[t] ?? tones.paper;
      el.style.setProperty("--bg", bg);
      el.style.setProperty("--fg", fg);
      el.style.setProperty("--muted", mu);
      el.style.setProperty("--line", li);
      document.body.style.backgroundColor = bg;
    };
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && set((e.target as HTMLElement).dataset.tone!)), {
      rootMargin: "-50% 0px -50% 0px",
    });
    el.querySelectorAll("[data-tone]").forEach((s) => io.observe(s));
    return () => {
      io.disconnect();
      document.body.style.backgroundColor = "";
    };
  }, [S]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12 },
    );
    el.querySelectorAll(".reveal").forEach((r) => io.observe(r));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!hov.current) return;
      hov.current.style.left = `${e.clientX + 180}px`;
      hov.current.style.top = `${e.clientY}px`;
    };
    addEventListener("mousemove", move);
    return () => removeEventListener("mousemove", move);
  }, []);

  const shuffle = () => {
    const k = pickScene(scene ?? undefined);
    rememberScene(k);
    setScene(k);
  };

  const socials = ELSEWHERE.map((l) => site.socials.find((s) => s.label === l)).filter((s): s is { label: string; url: string } => !!s);
  const [h1a, h1b] = site.headline.split(", ");

  return (
    <div ref={root} className={`pv${ready ? " ready" : ""}`}>
      <nav className="top mono">
        <a href="#top">{site.name}</a>
        <div className="links">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#journey">Journey</a>
          <a href="#writing">Writing</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      <main id="top">
        <header className="hero" data-tone="hero" style={{ background: S?.fore.c[1] ?? "#1c1d3a" }}>
          <div className="scene">
            <svg ref={heroSvg} viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true" />
          </div>
          <div className="grain" />
          <div className="veil" ref={veil} />
          <div className="hero-copy">
            <div className="wrap">
              <div className="mono">
                {site.name} · Software Engineer · {site.location}
              </div>
              <h1>
                <span className="line-in">
                  <span>{h1a?.split(" ").slice(0, -1).join(" ")}</span>
                </span>
                <span className="line-in">
                  <span>
                    {h1a?.split(" ").slice(-1)}, <em>{h1b?.split(" ").slice(0, 2).join(" ")}</em>
                  </span>
                </span>
                <span className="line-in">
                  <span>
                    <em>{h1b?.split(" ").slice(2).join(" ")}</em>
                  </span>
                </span>
              </h1>
              <div className="sub">
                <p>{site.heroLine}</p>
                <div className="status mono">
                  <i />
                  {site.status[0]}
                </div>
              </div>
            </div>
          </div>
          <div className="cue" />
        </header>

        <section className="sec" id="about" data-tone="paper">
          <div className="wrap about">
            <div className="mono reveal muted">01 · About</div>
            <div className="reveal">
              <p className="lead">{site.about.lead}</p>
              <p>{site.about.body}</p>
            </div>
            <div className="facts reveal">
              {site.about.facts.map(([k, v]) => (
                <div key={k}>
                  <span>{k}</span>
                  <span>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="sec" id="work" data-tone="ink">
          <div className="wrap">
            <div className="sec-head reveal">
              <div className="mono">02 · Selected work</div>
              <h2>
                {countWord} systems, <em>owned end to end.</em>
              </h2>
            </div>
            {featured.map((p) => (
              <article key={p.slug} className="proj reveal">
                <div className="num">{p.index}</div>
                <div>
                  <h3>{p.name}</h3>
                  <p className="tag">{p.tagline}</p>
                  <div className="meta">
                    <span className="chip">{p.domain}</span>
                    <span className="chip">{p.role}</span>
                  </div>
                  <div className="metrics">
                    {p.metrics.slice(0, 4).map((m) => (
                      <div key={m.label}>
                        <b>{m.value}</b>
                        <small>{m.label}</small>
                      </div>
                    ))}
                  </div>
                  <div className="links">
                    {projectLinks(p).map(([l, href]) => (
                      <a key={l} href={href} target="_blank" rel="noreferrer">
                        {l} ↗
                      </a>
                    ))}
                    <Link href={`/work/${p.slug}`}>Case study →</Link>
                  </div>
                </div>
                <Media p={p} />
              </article>
            ))}
            <div className="more reveal">
              <h4 className="mono">More work</h4>
              <div>
                {more.map((p) => (
                  <Link
                    key={p.slug}
                    className="mrow"
                    href={`/work/${p.slug}`}
                    onMouseEnter={() => setHoverSrc(p.heroImage || p.screenshots[0]?.src || null)}
                    onMouseLeave={() => setHoverSrc(null)}
                  >
                    <span className="n">{p.index}</span>
                    <span className="t">{p.name}</span>
                    <span className="d">{p.domain}</span>
                    <span className="d">{p.ecosystem}</span>
                    <span className="arr">↗</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="sec" id="journey" data-tone="sand">
          <div className="wrap">
            <div className="sec-head reveal">
              <div className="mono">03 · Journey</div>
              <h2>
                Four years, <em>one throughline.</em>
              </h2>
            </div>
            <div className="tl">
              <div />
              <div>
                {episodes.map((e) => (
                  <Link key={e.slug} href={`/journey/${e.slug}`} className="ep reveal">
                    <span className="when">{e.date}</span>
                    <div>
                      <h5>{e.title.replace(/\.$/, "")}</h5>
                      <p>{e.subtitle}</p>
                    </div>
                    <span className="k">{e.category}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {posts.length > 0 && (
          <section className="sec" id="writing" data-tone="paper">
            <div className="wrap">
              <div className="sec-head reveal">
                <div className="mono">04 · Writing</div>
                <h2>
                  Notes from <em>the build.</em>
                </h2>
              </div>
              <div className="posts">
                {posts.map((p) => (
                  <Link key={p.slug} className="post reveal" href={`/dispatches/${p.slug}`}>
                    <span className="mono k">{p.kind}</span>
                    <h5>{p.title}</h5>
                    <span className="mono k">
                      {p.date} · {p.readTime} →
                    </span>
                  </Link>
                ))}
              </div>
              <Link className="all reveal" href="/dispatches">
                All dispatches →
              </Link>
            </div>
          </section>
        )}

        <footer id="contact" data-tone="night">
          <div className="wrap">
            <div className="mono reveal muted">05 · Contact</div>
            <h2 className="contact-big reveal">
              Let&apos;s build
              <br />
              <em>something durable.</em>
            </h2>
            <a className="mail reveal" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            <div className="fcols reveal">
              <div>
                <h6>Elsewhere</h6>
                {socials.map((s) => (
                  <a key={s.label} href={s.url} target="_blank" rel="noreferrer">
                    {s.label}
                  </a>
                ))}
              </div>
              <div>
                <h6>Site</h6>
                <a href="#work">Work</a>
                <a href="#journey">Journey</a>
                <Link href="/dispatches">Writing</Link>
                <Link href="/" onClick={() => setView("studio")}>
                  Studio view
                </Link>
              </div>
              <div>
                <h6>Based</h6>
                <span>{site.location}</span>
                <span>{site.replyWindow}</span>
              </div>
              <div>
                <h6>Status</h6>
                {site.status.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
            </div>
          </div>
          <canvas ref={pixel} className="pixel" width={320} height={96} title="Click to make him jump" />
          <div className="legal wrap" style={{ color: S?.foot.legal ?? "rgba(255,255,255,.7)" }}>
            <span>© {new Date().getFullYear()} {site.name}</span>
            <button type="button" className="shuffle" onClick={shuffle} title="Paint a different scene">
              {S?.foot.label ?? ""} · shuffle
            </button>
          </div>
        </footer>
      </main>

      <div ref={hov} className={`hoverimg${hoverSrc ? " on" : ""}`} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {hoverSrc && <img src={hoverSrc} alt="" />}
      </div>
    </div>
  );
}
