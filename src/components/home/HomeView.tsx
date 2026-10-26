"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DEVTO_URL, type Project } from "@/content/projects";
import type { Trip } from "@/content/trips";
import { SCENES, pickScene, rememberScene, runPixelFooter, sceneSVG, sceneTrip, type Footer } from "./scenes";
import { Media, projectLinks } from "./Media";
import { MoreWork } from "./MoreWork";
import { ProjectSheet } from "./ProjectSheet";
import { Balloon } from "./Balloon";
import { runPixelMe } from "./pixelMe";
import "./home.css";
import "./balloon.css";

export type HomeSite = {
  name: string;
  headline: string;
  heroLine: string;
  email: string;
  location: string;
  replyWindow: string;
  status: string[];
  about: { lead: string; body: string };
  socials: { label: string; url: string }[];
};

// The newest work gets the full row; everything after continues as a compact list.
const LARGE = 7;
const COUNT_WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen"];
const ELSEWHERE = ["GitHub", "LinkedIn", "Twitter / X", "dev.to"];

type Tone = [string, string, string, string];
const BASE_TONES: Record<string, Tone> = {
  paper: ["#f3f0e8", "#16171a", "#6b6a66", "rgba(22,23,26,.12)"],
  ink: ["#0f1013", "#ece9e1", "#8a877f", "rgba(255,255,255,.10)"],
  sand: ["#e8e0cf", "#1d1b17", "#6e6656", "rgba(29,27,23,.14)"],
};

const slugFromPath = (path: string) => path.match(/^\/work\/([^/]+)\/?$/)?.[1] ?? null;

export function HomeView({
  site,
  projects,
  trips,
  initialSlug,
}: {
  site: HomeSite;
  projects: Project[];
  trips: Trip[];
  initialSlug?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const heroSvg = useRef<SVGSVGElement>(null);
  const veil = useRef<HTMLDivElement>(null);
  const pixel = useRef<HTMLCanvasElement>(null);
  const forge = useRef<HTMLCanvasElement>(null);
  const forgeLabel = useRef<HTMLSpanElement>(null);
  const footer = useRef<Footer | null>(null);
  const [scene, setScene] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  // The sheet: `shown` is the project on screen, `open` drives the slide. They differ while it animates out.
  const [shown, setShown] = useState<string | null>(initialSlug ?? null);
  const [open, setOpen] = useState(!!initialSlug);
  const [instant, setInstant] = useState(!!initialSlug);
  const pushed = useRef(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // The personal side: closed, open, or animating back to the page.
  const [door, setDoor] = useState<"closed" | "open" | "closing">("closed");

  const large = projects.slice(0, LARGE);
  const more = projects.slice(LARGE);
  const countWord = COUNT_WORDS[projects.length] ?? String(projects.length);
  const S = scene ? SCENES[scene] : null;
  const shownProject = shown ? projects.find((p) => p.slug === shown) : undefined;
  const nextProject = shownProject ? projects[(projects.indexOf(shownProject) + 1) % projects.length] : undefined;

  useEffect(() => {
    const k = pickScene();
    rememberScene(k);
    setScene(k);
    const id = setTimeout(() => setReady(true), 150);
    return () => clearTimeout(id);
  }, []);

  // Paint the hero, wire parallax, and start the footer for the current scene.
  useEffect(() => {
    if (!S || !heroSvg.current || !pixel.current) return;
    heroSvg.current.innerHTML = sceneSVG(S, "h");
    if (veil.current) veil.current.style.background = `linear-gradient(180deg,rgba(10,10,20,.32) 0%,rgba(10,10,20,0) 18%,rgba(10,10,20,0) 34%,rgba(10,10,20,${Math.max(S.veil, 0.5) * 0.75}) 62%,rgba(10,10,20,${Math.max(S.veil + 0.2, 0.68)}) 100%)`;
    const layers = [...heroSvg.current.querySelectorAll<SVGElement>(".layer")];
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const onScroll = () => {
      const y = scrollY;
      if (y < innerHeight * 1.2) layers.forEach((l) => (l.style.transform = `translateY(${-y * Number(l.dataset.depth) * 1.6}px)`));
    };
    if (!reduce) addEventListener("scroll", onScroll, { passive: true });
    footer.current = runPixelFooter(pixel.current, S.foot, reduce);
    return () => {
      removeEventListener("scroll", onScroll);
      footer.current?.stop();
      footer.current = null;
    };
  }, [S]);

  // The pixel me in About, forging something new each round.
  useEffect(() => {
    if (!forge.current) return;
    return runPixelMe(forge.current, (label) => {
      if (forgeLabel.current) forgeLabel.current.textContent = label;
    });
  }, []);

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
      el.dataset.tone = t;
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


  /* ---------- Sheet ---------- */

  const show = useCallback((slug: string) => {
    clearTimeout(hideTimer.current);
    setInstant(false);
    setShown(slug);
    // Mount first, then slide, so the transition has a start state.
    requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true)));
  }, []);

  const hide = useCallback(() => {
    setOpen(false);
    setInstant(false);
    hideTimer.current = setTimeout(() => setShown(null), 700);
  }, []);

  const openProject = (slug: string) => {
    history.pushState({ sheet: slug }, "", `/work/${slug}`);
    pushed.current = true;
    show(slug);
  };

  // Back from a sheet we opened returns to the page; a visitor who landed on /work/<slug> stays on the site.
  const closeProject = useCallback(() => {
    if (pushed.current) {
      pushed.current = false;
      history.back();
    } else {
      history.replaceState(null, "", "/");
      hide();
    }
  }, [hide]);

  const nextFromSheet = (slug: string) => {
    history.replaceState({ sheet: slug }, "", `/work/${slug}`);
    setShown(slug);
  };

  useEffect(() => {
    const onPop = () => {
      const slug = slugFromPath(location.pathname);
      if (slug && projects.some((p) => p.slug === slug)) {
        pushed.current = false;
        show(slug);
      } else {
        pushed.current = false;
        hide();
      }
    };
    addEventListener("popstate", onPop);
    return () => removeEventListener("popstate", onPop);
  }, [projects, show, hide]);

  useEffect(() => {
    if (!shown) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeProject();
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [shown, closeProject]);

  // Lock the page under the sheet and the balloon; the page keeps its scroll position.
  useEffect(() => {
    const lock = !!shown || door !== "closed";
    document.documentElement.style.overflow = lock ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [shown, door]);

  /* ---------- Door ---------- */

  const goOutside = () => {
    if (door !== "closed") return;
    footer.current?.leave();
    setTimeout(() => setDoor("open"), 450);
  };

  const backToWork = () => {
    setDoor("closing");
    setTimeout(() => {
      setDoor("closed");
      footer.current?.comeBack();
    }, 1200);
  };

  const shuffle = () => {
    const k = pickScene(scene ?? undefined);
    rememberScene(k);
    setScene(k);
  };

  const socials = ELSEWHERE.map((l) => site.socials.find((s) => s.label === l)).filter((s): s is { label: string; url: string } => !!s);
  const [h1a, h1b] = site.headline.split(", ");
  const leadTrip = scene ? Math.max(0, trips.findIndex((t) => t.loc.startsWith(sceneTrip(scene)))) : 0;

  return (
    <div ref={root} className={`pv${ready ? " ready" : ""}${door === "open" ? " away" : ""}`}>
      <div className="page">
        <nav className="top mono">
          <a href="#top">{site.name}</a>
          <div className="links">
            <a href="#work">Work</a>
            <a href="#about">About</a>
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
              <div className="reveal about-copy">
                <p className="lead">{site.about.lead}</p>
                <p>{site.about.body}</p>
              </div>
              <figure className="forge reveal">
                <canvas ref={forge} width={160} height={90} role="img" aria-label="A pixel-art version of me at a desk, coding on a laptop and a second monitor, shipping each build up into the cloud" />
                <figcaption className="mono">
                  Shipping: <span ref={forgeLabel}>a web app</span>
                </figcaption>
              </figure>
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
              {large.map((p) => (
                <article key={p.slug} className="proj reveal">
                  <div className="num">{p.index}</div>
                  <div>
                    <h3>
                      <a href={`/work/${p.slug}`} onClick={(e) => (e.preventDefault(), openProject(p.slug))}>
                        {p.name}
                      </a>
                    </h3>
                    <p className="tag">{p.tagline}</p>
                    <div className="meta">
                      <span className="chip">{p.domain}</span>
                      <span className="chip">{p.role}</span>
                      {p.embed && <span className="chip">Interactive</span>}
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
                      <a className="deep" href={`/work/${p.slug}`} onClick={(e) => (e.preventDefault(), openProject(p.slug))}>
                        Deep dive →
                      </a>
                      {projectLinks(p).map(([l, href]) => (
                        <a key={l} href={href} target="_blank" rel="noreferrer">
                          {l} ↗
                        </a>
                      ))}
                    </div>
                  </div>
                  <Media p={p} />
                </article>
              ))}
              <MoreWork projects={more} onOpen={openProject} />
            </div>
          </section>

          <section className="sec" id="writing" data-tone="paper">
            <div className="wrap">
              <div className="sec-head reveal">
                <div className="mono">03 · Writing</div>
                <h2>
                  Notes from <em>the build.</em>
                </h2>
              </div>
              <a className="devto reveal" href={DEVTO_URL} target="_blank" rel="noreferrer">
                <span className="mono muted">dev.to/abhinav_pangaria</span>
                <span className="t">
                  Everything I write lives on dev.to <span className="arr">↗</span>
                </span>
              </a>
            </div>
          </section>

          <footer id="contact" data-tone="night">
            <div className="wrap">
              <div className="mono reveal muted">04 · Contact</div>
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
                  <a href="#about">About</a>
                  <a href={DEVTO_URL} target="_blank" rel="noreferrer">
                    Writing
                  </a>
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

          <button
            type="button"
            className="door"
            onClick={goOutside}
            style={S ? { background: S.foot.sky[0], color: S.foot.fg } : undefined}
          >
            <span>
              <span className="mono muted">05 · Outside the terminal</span>
              <span className="t">
                The rest of the time, <em>I&apos;m usually somewhere with no signal.</em>
              </span>
            </span>
            <span className="go">
              <span className="mono">Come along</span>
              <b />
            </span>
          </button>
        </main>
      </div>

      {door !== "closed" && S && (
        <Balloon trips={trips} lead={leadTrip} foot={S.foot} shown={door === "open"} onBack={backToWork} />
      )}

      {shownProject && nextProject && (
        <ProjectSheet
          project={shownProject}
          next={nextProject}
          open={open}
          instant={instant}
          onClose={closeProject}
          onNext={nextFromSheet}
        />
      )}
    </div>
  );
}
