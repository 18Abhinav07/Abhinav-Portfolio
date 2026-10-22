"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SCENES, handOffScene, pickScene, sceneSVG } from "./plain/scenes";
import "./plain/plain.css";

const VIEW_KEY = "ap-view";

export function setView(v: "studio" | "index") {
  try {
    sessionStorage.setItem(VIEW_KEY, v);
  } catch {}
}

/**
 * First visit of a session: offer the two ways into the same work. It sits just
 * under the Preloader, so it is revealed as the loader slides away.
 */
export function ViewChooser({ headline, heroLine, name }: { headline: string; heroLine: string; name: string }) {
  const router = useRouter();
  const svg = useRef<SVGSVGElement>(null);
  const [state, setState] = useState<"none" | "open" | "closing">("none");
  const [scene, setScene] = useState<string | null>(null);

  useEffect(() => {
    let chosen: string | null = null;
    try {
      chosen = sessionStorage.getItem(VIEW_KEY);
    } catch {}
    if (chosen) return;
    setScene(pickScene());
    setState("open");
  }, []);

  useEffect(() => {
    if (scene && svg.current) svg.current.innerHTML = sceneSVG(SCENES[scene], "c");
  }, [scene, state]);

  // Keep the Studio page from scrolling underneath while the chooser is up.
  useEffect(() => {
    if (state !== "open") return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [state]);

  if (state === "none") return null;

  const pickStudio = () => {
    setView("studio");
    setState("closing");
    setTimeout(() => setState("none"), 700);
  };
  const pickIndex = () => {
    setView("index");
    if (scene) handOffScene(scene);
    router.push("/plain");
  };
  const [a, b] = headline.split(", ");

  return (
    <div className={`vc${state === "closing" ? " hidden" : ""}`} data-lenis-prevent role="dialog" aria-modal="true" aria-label="Choose a view">
      <div className="vc-inner">
        <div className="vc-head">
          <h1>
            Two ways in.
            <br />
            <em>Same work.</em>
          </h1>
          <p>
            The index is quiet and fast, every detail on one scroll. The studio is the full, animated experience. You can switch any
            time from the footer.
          </p>
        </div>
        <div className="vc-grid">
          <button type="button" className="vc-card" onClick={pickIndex}>
            <div className="vc-preview">
              <div className="inner vc-idx">
                <svg ref={svg} viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true" />
                <div className="txt">
                  <div className="mono">{name} · Engineer</div>
                  <h4>
                    {a}, <em>{b}</em>
                  </h4>
                </div>
              </div>
            </div>
            <div className="vc-meta">
              <div>
                <h3>Index</h3>
                <p>Minimal, quick to scan, all the detail</p>
              </div>
              <div className="vc-go">→</div>
            </div>
          </button>
          <button type="button" className="vc-card" onClick={pickStudio}>
            <div className="vc-preview">
              <div className="inner vc-studio">
                <div className="pill" />
                <div className="eyebrow">LIVE TRANSMISSION</div>
                <h4>
                  Builder of
                  <br />
                  <i>resilient</i> systems.
                </h4>
                <p>{heroLine}</p>
              </div>
            </div>
            <div className="vc-meta">
              <div>
                <h3>Studio</h3>
                <p>Bold, animated, the full story</p>
              </div>
              <div className="vc-go">↗</div>
            </div>
          </button>
        </div>
        <div className="vc-foot mono">{scene ? `Today's scene: ${SCENES[scene].name}` : ""}</div>
      </div>
    </div>
  );
}
