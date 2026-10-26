"use client";

import { useEffect, useRef, useState } from "react";
import type { Trip } from "@/content/trips";
import { F1, F2, MINI_PAL, type Foot } from "./scenes";

/**
 * The personal side. A hot air balloon rises with the footer's pixel character in the
 * basket. Once it settles, one thread per trip unspools from the basket and lowers a
 * polaroid into place. Each polaroid is a well damped pendulum; clicking one flies it to
 * the middle and opens that trip.
 */
export function Balloon({
  trips,
  lead,
  foot,
  shown,
  onBack,
}: {
  trips: Trip[];
  lead: number;
  foot: Foot;
  shown: boolean;
  onBack: () => void;
}) {
  const sky = useRef<HTMLDivElement>(null);
  const trip = useRef<HTMLDivElement>(null);
  const back = useRef(onBack);
  back.current = onBack;
  const [on, setOn] = useState(false);

  // Lead trip in the middle, the rest fanned out around it.
  const others = trips.map((_, i) => i).filter((i) => i !== lead);
  const placement = [others[0], others[1], lead, others[2], others[3]].filter((i) => i !== undefined);

  // Mount closed, then open, so the sky has a clip to wipe up from.
  useEffect(() => {
    if (!shown) return setOn(false);
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setOn(true)));
    return () => cancelAnimationFrame(id);
  }, [shown]);

  useEffect(() => {
    const skyEl = sky.current!, tripEl = trip.current!;
    const $ = <T extends Element>(root: Element, s: string) => root.querySelector(s) as T;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stc = $<HTMLCanvasElement>(skyEl, ".stars"), sc = stc.getContext("2d")!;
    const thc = $<HTMLCanvasElement>(skyEl, ".threads"), tc = thc.getContext("2d")!;
    const balloon = $<HTMLDivElement>(skyEl, ".balloon");
    const flame = $<SVGPathElement>(skyEl, ".flame"), glow = $<SVGCircleElement>(skyEl, ".flame-glow");
    const kid = $<HTMLCanvasElement>(skyEl, ".kid"), kc = kid.getContext("2d")!;
    const head = $<HTMLDivElement>(skyEl, ".sky-head");
    const clouds = [...skyEl.querySelectorAll<HTMLElement>(".clouds i")];
    const thumbs = $<HTMLDivElement>(tripEl, ".thumbs");

    let W = 0, H = 0, pw = 150, raf = 0;
    const starField = Array.from({ length: 140 }, () => [Math.random(), Math.random() * 0.7, Math.random(), Math.random() * 1.4 + 0.3]);
    clouds.forEach((c) => {
      c.style.top = `${10 + Math.random() * 70}%`;
      c.style.width = `${120 + Math.random() * 260}px`;
      c.dataset.v = String(0.04 + Math.random() * 0.08);
      c.dataset.x = String(Math.random() * 1.2);
    });

    // `drop` is when its thread starts to unspool; `grow` runs 0 to 1 as it lowers into place.
    type Pol = {
      el: HTMLElement; ti: number; slot: number; th: number; w: number; rest: number; L: number;
      x: number; y: number; detached: boolean; drop: number; grow: number;
    };
    const pols: Pol[] = [...skyEl.querySelectorAll<HTMLElement>(".pol")].map((el, slot) => ({
      el, ti: Number(el.dataset.ti), slot, th: 0, w: 0, rest: 0, L: 1, x: 0, y: 0, detached: false, drop: Infinity, grow: 0,
    }));

    const balloonTop = () => (W < 640 ? Math.max(H * 0.12, head.offsetHeight + 4) : H * 0.08);

    function layout() {
      const mobile = W < 640;
      const bw = balloon.offsetWidth, ay = balloonTop() + bw * (330 / 240) * 0.965;
      if (mobile) {
        // Three tiers (outer, inner, lead) must fit between the basket and the bottom edge.
        const room = H - ay - 24 - 20;
        pw = Math.max(64, Math.min(104, W * 0.26, (room - 28) / 3 - 27));
      } else pw = Math.min(168, Math.max(130, W * 0.11));
      skyEl.style.setProperty("--pw", `${pw}px`);
      const ph = pols[0]?.el.offsetHeight || pw * 1.4;
      const span = Math.min(W, 1400);
      const dxs = mobile ? [-0.34, -0.17, 0, 0.17, 0.34].map((v) => v * W) : [-0.29, -0.145, 0, 0.145, 0.29].map((v) => v * span);
      // On a phone neighbours overlap sideways, so each tier sits a full polaroid below the last.
      const step = ph + 14;
      const dys = mobile ? [20, 20 + step, 20 + step * 2, 20 + step, 20] : [0.13, 0.25, 0.31, 0.24, 0.12].map((v) => v * H);
      pols.forEach((p) => {
        const dx = dxs[p.slot], dy = dys[p.slot];
        p.rest = Math.atan2(dx, dy);
        p.L = Math.hypot(dx, dy);
      });
    }

    function size() {
      const dpr = Math.min(2, devicePixelRatio || 1);
      W = innerWidth;
      H = innerHeight;
      for (const c of [stc, thc]) {
        c.width = W * dpr;
        c.height = H * dpr;
      }
      sc.setTransform(dpr, 0, 0, dpr, 0, 0);
      tc.setTransform(dpr, 0, 0, dpr, 0, 0);
      layout();
      if (fly && tripEl.classList.contains("ready")) setBox(fly, bigRect());
    }

    const sprite = (F: string[], flip: boolean) =>
      F.forEach((r, y) => [...r].forEach((ch, x) => {
        if (ch !== ".") {
          kc.fillStyle = MINI_PAL[ch];
          kc.fillRect(flip ? 9 - x : x, y, 1, 1);
        }
      }));

    const t0 = performance.now();
    let riseStart = performance.now(), sinkStart = 0, openAt = 0, lift = 0, liftT = 0;
    let state: "rising" | "open" | "sinking" | "closed" = reduce ? "open" : "rising";
    let mx = -9999, my = -9999, lastBy = 0, lastAx = NaN, lastAy = 0, prevVx = 0, prevVy = 0;
    const RISE = 3400, DROP = 1100, STAGGER = 170, SINK = 1500;
    const ease = (x: number) => 1 - Math.pow(1 - x, 3);
    const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
    const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

    // Lead trip first, then outwards, so the fan opens from the middle.
    function dropAll(at: number) {
      [...pols].sort((a, b) => Math.abs(a.slot - 2) - Math.abs(b.slot - 2) || a.slot - b.slot).forEach((p, i) => {
        p.drop = at + i * STAGGER;
        p.th = p.rest;
        p.w = 0;
      });
    }

    function frame(now: number) {
      const t = (now - t0) / 1000;
      lift += (liftT - lift) * 0.06;
      sc.clearRect(0, 0, W, H);
      const starAlpha = foot.stars ? 1 : 0.35;
      for (const [x, y, p, r] of starField) {
        const a = 0.35 + 0.65 * Math.max(0, Math.sin(t * 1.3 + p * 12));
        sc.globalAlpha = a * (0.6 + lift * 0.4) * starAlpha;
        sc.fillStyle = "#fff";
        sc.beginPath();
        sc.arc(x * W, (y + lift * 0.08) * H, r * 0.7, 0, 7);
        sc.fill();
      }
      sc.globalAlpha = 1;
      clouds.forEach((c) => {
        const x = ((Number(c.dataset.x) + t * Number(c.dataset.v) * 0.1) % 1.4) - 0.2;
        c.style.transform = `translate(${x * W}px,${lift * 60}px)`;
      });

      const bw = balloon.offsetWidth, bh = (bw * 330) / 240;
      const targetY = balloonTop() - lift * H * 0.12;
      let by: number;
      if (state === "rising") {
        const k = clamp01((now - riseStart) / RISE);
        by = H + 60 + (targetY - (H + 60)) * easeInOut(k);
        if (k >= 1) {
          state = "open";
          openAt = now;
          dropAll(now + 120);
        }
      } else if (state === "sinking") {
        // The polaroids fade first, then the balloon eases down out of frame.
        const k = clamp01((now - sinkStart - 250) / SINK);
        by = lastBy + (H + 80 - lastBy) * easeInOut(k);
        if (k >= 1) {
          state = "closed";
          back.current();
        }
      } else if (state === "open") by = targetY;
      else by = H + 80;
      // The drift fades in after the rise so it never fights the climb.
      const calm = reduce ? 0 : state === "open" ? easeInOut(clamp01((now - openAt) / 2000)) : state === "sinking" ? 1 : 0;
      const bob = Math.sin(t * 0.8) * 6 * calm, sway = Math.sin(t * 0.37) * 12 * calm;
      const bx = W / 2 - bw / 2 + sway;
      by += bob;
      balloon.style.transform = `translate3d(${bx - W / 2}px,${by}px,0)`;
      if (state !== "sinking") lastBy = by;

      // Layered sines instead of noise: the flame breathes rather than strobes.
      const f = reduce ? 1 : 0.86 + Math.sin(t * 11) * 0.07 + Math.sin(t * 6.3 + 1) * 0.05;
      flame.setAttribute("transform", `translate(120 270) scale(1 ${f}) translate(-120 -270)`);
      glow.setAttribute("opacity", String(reduce ? 0.8 : 0.72 + Math.sin(t * 4.1) * 0.12));
      const s = bw / 240;
      Object.assign(kid.style, {
        width: `${10 * s * 2.3}px`, height: `${12 * s * 2.3}px`,
        left: `${120 * s - 5 * s * 2.3}px`, top: `${284 * s - 7.4 * s * 2.3}px`,
      });
      kc.clearRect(0, 0, 10, 12);
      sprite(!reduce && Math.floor(now / 400) % 2 ? F1 : F2, false);

      // The threads hang from the bottom of the basket and feel its motion.
      const ax = bx + bw / 2, ay = by + bh * 0.965;
      if (Number.isNaN(lastAx)) {
        lastAx = ax;
        lastAy = ay;
      }
      const vx = ax - lastAx, vy = ay - lastAy;
      lastAx = ax;
      lastAy = ay;
      // Clamped, so a resize or a dropped frame can't kick the polaroids into a spin.
      const accX = Math.max(-2, Math.min(2, vx - prevVx)), accY = Math.max(-2, Math.min(2, vy - prevVy));
      prevVx = vx;
      prevVy = vy;
      const fade = state === "sinking" ? 1 - clamp01((now - sinkStart) / 450) : 1;

      tc.clearRect(0, 0, W, H);
      pols.forEach((p, i) => {
        if (p.detached) return;
        p.grow = reduce ? 1 : ease(clamp01((now - p.drop) / DROP));
        if (p.grow <= 0) {
          p.el.style.opacity = "0";
          return;
        }
        const ang = p.th, L = Math.max(1, p.L * p.grow);
        // A stiffer spring with near critical damping: it settles in a swing or two instead of jangling.
        let a = -0.0045 * (ang - p.rest) - 0.11 * p.w - ((accX * Math.cos(ang)) / p.L) * 0.35 + ((accY * Math.sin(ang)) / p.L) * 0.2;
        if (!reduce) a += Math.sin(t * 0.6 + i * 1.7) * 0.00012;
        const ex = ax + Math.sin(ang) * L, ey = ay + Math.cos(ang) * L;
        const dx = ex - mx, dy = ey + pw * 0.6 - my, d = Math.hypot(dx, dy);
        if (!reduce && d < pw * 1.1 && state === "open" && p.grow >= 1) a += (dx > 0 ? 1 : -1) * 0.0004 * (1 - d / (pw * 1.1));
        if (reduce) {
          p.th = p.rest;
          p.w = 0;
        } else {
          p.w = Math.max(-0.02, Math.min(0.02, p.w + a));
          p.th += p.w;
        }
        p.x = ex;
        p.y = ey;
        const alpha = clamp01(p.grow * 1.8 - 0.4) * fade;
        const midx = (ax + ex) / 2 + Math.cos(ang) * 8, midy = (ay + ey) / 2 + Math.abs(Math.sin(ang)) * 14;
        tc.strokeStyle = `rgba(240,230,215,${0.55 * Math.min(1, p.grow * 3) * fade})`;
        tc.lineWidth = 1;
        tc.beginPath();
        tc.moveTo(ax + (p.slot - 2) * 3, ay);
        tc.quadraticCurveTo(midx, midy, ex, ey);
        tc.stroke();
        const rot = (ang - p.rest) * 0.6 * 57.3 + p.rest * 10;
        const sc = 0.82 + 0.18 * p.grow;
        p.el.style.opacity = String(alpha);
        p.el.style.transform = `translate3d(${ex - pw / 2}px,${ey}px,0) rotate(${rot}deg) scale(${sc})`;
      });
      raf = requestAnimationFrame(frame);
    }

    /* ---------- A trip ---------- */
    let cur: Pol | null = null, fly: HTMLDivElement | null = null, idx = 0;
    const mediaEl = (m: Trip["media"][number]) => {
      if (m.type === "video") {
        const v = document.createElement("video");
        Object.assign(v, { src: m.src, muted: true, loop: true, playsInline: true, autoplay: true, poster: m.thumb.replace("w_240", "w_1280") });
        return v;
      }
      const im = document.createElement("img");
      im.src = m.src;
      im.alt = "";
      return im;
    };
    const bigRect = () => {
      const m = W < 640;
      const h = m ? H * 0.46 : H * 0.56, w = m ? W - 32 : Math.min(W * 0.7, (h * 16) / 9);
      return { left: (W - w) / 2, top: m ? 64 : H * 0.07, width: w, height: h };
    };
    const setBox = (el: HTMLElement, r: { left: number; top: number; width: number; height: number }) =>
      Object.assign(el.style, { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });

    function show(i: number) {
      if (!cur || !fly) return;
      const t = trips[cur.ti];
      idx = (i + t.media.length) % t.media.length;
      // Keep what is showing until the next frame has loaded, then cross-fade.
      const el = mediaEl(t.media[idx]);
      Object.assign(el.style, { position: "absolute", inset: "0", opacity: "0", transition: "opacity .6s" });
      const box = fly;
      const onLoad = () => {
        if (fly !== box) return;
        box.appendChild(el);
        requestAnimationFrame(() => {
          el.style.opacity = "1";
          setTimeout(() => [...box.children].forEach((c) => c !== el && c.remove()), 650);
        });
      };
      if (el instanceof HTMLImageElement) {
        if (el.complete) onLoad();
        else el.onload = onLoad;
      } else el.addEventListener("loadeddata", onLoad, { once: true });
      [...thumbs.children].forEach((b, j) => b.classList.toggle("on", j === idx));
    }

    function openTrip(p: Pol) {
      if (state !== "open" || cur || p.grow < 1) return;
      cur = p;
      const t = trips[p.ti];
      const ph = $<HTMLElement>(p.el, ".ph").getBoundingClientRect();
      fly = document.createElement("div");
      fly.className = "fly";
      fly.style.transition = "none";
      setBox(fly, ph);
      fly.style.transform = `rotate(${(p.th - p.rest) * 0.6 * 57.3 + p.rest * 10}deg)`;
      const v = document.createElement("video");
      Object.assign(v, { src: t.cover, muted: true, loop: true, playsInline: true, autoplay: true, poster: t.poster });
      fly.appendChild(v);
      tripEl.appendChild(fly);
      p.detached = true;
      p.el.classList.add("gone");
      $<HTMLElement>(tripEl, ".t-meta").textContent = `${t.date} · ${t.coord} · ${t.media.length} frames`;
      $<HTMLElement>(tripEl, ".t-loc").textContent = t.loc;
      $<HTMLElement>(tripEl, ".t-note").textContent = t.note;
      thumbs.innerHTML = "";
      t.media.forEach((m, j) => {
        const b = document.createElement("button");
        b.type = "button";
        b.setAttribute("aria-label", `Frame ${j + 1}`);
        if (m.type === "video") b.className = "v";
        const im = document.createElement("img");
        im.src = m.thumb;
        im.alt = "";
        im.loading = "lazy";
        b.appendChild(im);
        b.onclick = () => show(j);
        thumbs.appendChild(b);
      });
      tripEl.classList.add("open");
      const f = fly;
      requestAnimationFrame(() => {
        f.style.transition = "";
        requestAnimationFrame(() => {
          setBox(f, bigRect());
          f.style.transform = "rotate(0deg)";
        });
      });
      setTimeout(() => {
        if (cur !== p) return;
        tripEl.classList.add("ready");
        show(0);
        $<HTMLElement>(tripEl, ".close").focus({ preventScroll: true });
      }, 850);
    }

    function closeTrip() {
      if (!cur || !fly) return;
      const p = cur, f = fly;
      tripEl.classList.remove("ready");
      // Fly back to wherever its thread is now.
      setBox(f, { left: p.x - pw / 2 + 8, top: p.y + 8, width: pw - 16, height: (pw - 16) * (W < 640 ? 1 : 1.25) });
      f.style.transform = `rotate(${p.rest * 10}deg)`;
      tripEl.classList.remove("open");
      cur = null;
      fly = null;
      setTimeout(() => {
        f.remove();
        p.detached = false;
        p.el.classList.remove("gone");
        p.w = (p.rest > 0 ? -1 : 1) * 0.006;
        p.el.focus({ preventScroll: true });
      }, 850);
    }

    function sink() {
      if (state === "sinking" || state === "closed") return;
      state = "sinking";
      sinkStart = performance.now();
    }

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    const onWheel = (e: WheelEvent) => {
      if (state === "open" && !cur) liftT = Math.max(0, Math.min(1, liftT + e.deltaY * 0.0008));
    };
    let touchY: number | null = null;
    const onTouchStart = (e: TouchEvent) => (touchY = e.touches[0].clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (state === "open" && !cur && touchY != null) {
        liftT = Math.max(0, Math.min(1, liftT + (touchY - e.touches[0].clientY) * 0.002));
        touchY = e.touches[0].clientY;
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (cur) {
        if (e.key === "Escape") closeTrip();
        if (e.key === "ArrowRight") show(idx + 1);
        if (e.key === "ArrowLeft") show(idx - 1);
      } else if (e.key === "Escape") sink();
    };

    const timers: ReturnType<typeof setTimeout>[] = [];
    pols.forEach((p, i) => {
      p.el.onclick = () => openTrip(p);
      p.el.onmouseenter = () => (p.w += (Math.random() > 0.5 ? 1 : -1) * 0.004);
      // Start the clip a beat before its card arrives.
      timers.push(setTimeout(() => p.el.querySelector("video")?.play().catch(() => {}), reduce ? 200 : RISE + 200 + i * STAGGER));
    });
    $<HTMLButtonElement>(skyEl, ".back").onclick = sink;
    $<HTMLButtonElement>(tripEl, ".close").onclick = closeTrip;
    $<HTMLDivElement>(tripEl, ".scrim").onclick = closeTrip;
    $<HTMLButtonElement>(tripEl, ".nav.l").onclick = () => show(idx - 1);
    $<HTMLButtonElement>(tripEl, ".nav.r").onclick = () => show(idx + 1);

    size();
    if (reduce) dropAll(0);
    riseStart = performance.now();
    raf = requestAnimationFrame(frame);
    addEventListener("resize", size);
    addEventListener("pointermove", onMove);
    addEventListener("wheel", onWheel, { passive: true });
    addEventListener("touchstart", onTouchStart, { passive: true });
    addEventListener("touchmove", onTouchMove, { passive: true });
    addEventListener("keydown", onKey);
    $<HTMLButtonElement>(skyEl, ".back").focus({ preventScroll: true });

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      fly?.remove();
      removeEventListener("resize", size);
      removeEventListener("pointermove", onMove);
      removeEventListener("wheel", onWheel);
      removeEventListener("touchstart", onTouchStart);
      removeEventListener("touchmove", onTouchMove);
      removeEventListener("keydown", onKey);
    };
  }, [trips, foot]);

  const vars = { "--s0": foot.sky[0], "--s1": foot.sky[1], "--s2": foot.sky[2] } as React.CSSProperties;

  return (
    <>
      <div ref={sky} className={`sky${on ? " on" : ""}`} style={vars} role="dialog" aria-modal="true" aria-label="Outside the terminal">
        <canvas className="stars" />
        <div className="clouds">
          {Array.from({ length: 7 }, (_, i) => (
            <i key={i} />
          ))}
        </div>
        <canvas className="threads" />
        <div className="balloon">
          <svg viewBox="0 0 240 330" aria-hidden="true">
            <defs>
              <radialGradient id="bl-env" cx="38%" cy="32%" r="75%">
                <stop offset="0" stopColor="#ffd9a0" />
                <stop offset=".55" stopColor="#e2876a" />
                <stop offset="1" stopColor="#7a3f52" />
              </radialGradient>
              <linearGradient id="bl-shade" x1="0" x2="1">
                <stop offset="0" stopColor="#000" stopOpacity="0" />
                <stop offset=".7" stopColor="#000" stopOpacity=".05" />
                <stop offset="1" stopColor="#000" stopOpacity=".35" />
              </linearGradient>
              <radialGradient id="bl-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0" stopColor="#ffd36e" stopOpacity=".55" />
                <stop offset="1" stopColor="#ffd36e" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle className="flame-glow" cx="120" cy="230" r="60" fill="url(#bl-glow)" />
            <path d="M120 6C56 6 14 54 14 112c0 52 38 88 72 120l10 22h48l10-22c34-32 72-68 72-120C226 54 184 6 120 6z" fill="url(#bl-env)" />
            <path d="M120 6C92 6 70 56 70 112c0 50 18 86 30 120l-4 22h12l-2-22c-4-36-12-72-12-120 0-56 12-106 26-106z" fill="#f6cf96" opacity=".35" />
            <path d="M120 6c28 0 50 50 50 106 0 48-8 84-12 120l-2 22h12l-4-22c12-34 30-70 30-120C194 56 148 6 120 6z" fill="#5a2c44" opacity=".25" />
            <path d="M120 6C56 6 14 54 14 112c0 52 38 88 72 120l10 22h48l10-22c34-32 72-68 72-120C226 54 184 6 120 6z" fill="url(#bl-shade)" />
            <path d="M22 132c40 14 156 14 196 0" stroke="#fff3e0" strokeOpacity=".35" strokeWidth="3" fill="none" />
            <path d="M96 254l-6 30M144 254l6 30M108 254l-2 30M132 254l2 30" stroke="#3a2a2a" strokeWidth="1.3" />
            <rect x="86" y="284" width="68" height="34" rx="3" fill="#7a5233" />
            <path d="M86 292h68M86 302h68M86 311h68" stroke="#5c3b24" strokeWidth="1.4" />
            <rect x="84" y="281" width="72" height="6" rx="2" fill="#94653f" />
            <path className="flame" d="M120 262c-5 6-6 11 0 16 6-5 5-10 0-16z" fill="#ffd36e" />
          </svg>
          <canvas className="kid" width={10} height={12} />
        </div>
        <div className="sky-head">
          <div className="hello">
            <span className="mono">Off the clock</span>
            <p>
              Five places, <em>no laptop.</em>
            </p>
            <small>Pick a photo. Each one opens the whole trip.</small>
          </div>
          <button className="back mono" type="button">
            ↓ Back to work
          </button>
        </div>
        {placement.map((ti) => {
          const t = trips[ti];
          return (
            <button key={t.loc} type="button" className="pol" data-ti={ti} aria-label={`Open ${t.loc}`}>
              <span className="clip" />
              <span className="ph">
                <video muted loop playsInline preload="metadata" poster={t.poster} src={t.cover} />
              </span>
              <span className="cap">
                <b>{t.loc.split(",")[0]}</b>
                <span>{t.date}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div ref={trip} className="trip">
        <div className="scrim" />
        <button className="back mono close" type="button">
          Close ✕
        </button>
        <button className="nav l" type="button" aria-label="Previous">
          ‹
        </button>
        <button className="nav r" type="button" aria-label="Next">
          ›
        </button>
        <div className="tinfo">
          <div className="mono t-meta" />
          <h3 className="t-loc" />
          <p className="t-note" />
          <div className="thumbs" />
        </div>
      </div>
    </>
  );
}
