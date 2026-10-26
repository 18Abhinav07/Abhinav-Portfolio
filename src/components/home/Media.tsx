"use client";

import { useEffect, useState } from "react";
import type { Project } from "@/content/projects";

// Loom's only "screenshot" is its video thumbnail, which is not worth a second tab.
const realShots = (p: Project) => p.screenshots.filter((s) => !s.src.includes("img.youtube.com"));

export function Media({ p }: { p: Project }) {
  const video = p.videos?.[0];
  const real = realShots(p).slice(0, 5);
  // A project with no screens of its own still shows its cover.
  const shots = real.length || video || !p.heroImage ? real : [{ src: p.heroImage, caption: p.name }];
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

export function projectLinks(p: Project): [string, string][] {
  const out: [string, string][] = [];
  if (p.githubUrl) out.push(["Source", p.githubUrl]);
  if (p.docsUrl) out.push(["Docs", p.docsUrl]);
  if (p.blogUrl) out.push(["Write-up", p.blogUrl]);
  if (p.presentationUrl) out.push(["Deck", p.presentationUrl]);
  if (p.liveUrl) out.push(["Live", p.liveUrl]);
  if (p.apiUrl) out.push(["Live API", p.apiUrl]);
  return out;
}
