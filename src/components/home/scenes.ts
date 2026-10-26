/**
 * Painted hero scenes for the home page. Each one is drawn as SVG from a few
 * numbers, and each is paired with an 8-bit footer scene that matches its mood:
 * dusk lake to a night camp, snowy peaks to falling snow and an igloo, and so on.
 */

type Ridge = {
  b: number;
  a: number;
  f: number;
  ph: number;
  c: [string, string];
  jag?: boolean;
  caps?: string;
  trees?: string;
  mesas?: [number, number, number][];
};
type Layer = Ridge & { d: number };

export type Foot = {
  label: string;
  sky: [string, string, string];
  fg: string;
  mu: string;
  li: string;
  legal?: string;
  moon: "crescent" | "full" | "sun" | "setsun" | null;
  stars: boolean;
  far: string;
  farJag?: boolean;
  near: string;
  nearCliff?: boolean;
  tree: string | null;
  trees: "pine" | "snowpine" | "cactus" | null;
  ground: string;
  gdot: string;
  prop: "campfire" | "igloo" | "tent" | "tumbleweed" | "lighthouse";
  fx?: "snow" | "fireflies";
};

export type Scene = {
  name: string;
  veil: number;
  sky: [string, string, string, string];
  sun: { x: number; y: number; r: number; core: string; glow: string };
  clouds?: string;
  stars?: boolean;
  snow?: boolean;
  mist?: string;
  layers: Layer[];
  water?: { y: number; c: [string, string]; glint: string };
  fore: Ridge & { tips?: string };
  extra?: "cacti" | "lighthouse";
  foot: Foot;
};

export const SCENES: Record<string, Scene> = {
  dusk: {
    name: "Dusk lake",
    veil: 0.45,
    sky: ["#2d3561", "#8c6a8f", "#e3a07f", "#f6cf96"],
    sun: { x: 1060, y: 560, r: 46, core: "#fff4dc", glow: "#ffd9a0" },
    clouds: "#f2c6b0",
    layers: [
      { b: 540, a: 45, f: 0.004, ph: 1, c: ["#b98a9a", "#d9a68f"], d: 0.05 },
      { b: 640, a: 40, f: 0.005, ph: 3, c: ["#7a5f82", "#a77a86"], d: 0.12 },
      { b: 735, a: 35, f: 0.006, ph: 5, c: ["#48416a", "#6a5577"], d: 0.2 },
    ],
    water: { y: 800, c: ["#e8b38c", "#3a3560"], glint: "#fff1d2" },
    fore: { b: 885, a: 28, f: 0.005, ph: 2, c: ["#262744", "#1a1b33"] },
    foot: {
      label: "Night camp",
      sky: ["#161833", "#3b2f5c", "#6b4a6e"],
      fg: "#ecebf5", mu: "#9c9ab8", li: "rgba(255,255,255,.12)",
      moon: "crescent", stars: true,
      far: "#4a3d6e", near: "#2c2550", tree: "#1d1838", trees: "pine",
      ground: "#1a1530", gdot: "#2a2346", prop: "campfire",
    },
  },
  desert: {
    name: "Desert sundown",
    veil: 0.5,
    sky: ["#2f3866", "#9a6a86", "#e8956a", "#f6c88a"],
    sun: { x: 1120, y: 610, r: 58, core: "#ffe2b0", glow: "#ffb070" },
    clouds: "#f4b896",
    layers: [
      {
        b: 640, a: 6, f: 0.004, ph: 1, c: ["#b8708a", "#c98a8a"], d: 0.05,
        mesas: [[120, 420, 150], [700, 820, 95], [1300, 1560, 175]],
      },
      { b: 700, a: 30, f: 0.0032, ph: 2.5, c: ["#d98a62", "#e3a074"], d: 0.12 },
      { b: 785, a: 36, f: 0.0036, ph: 4, c: ["#a85a3c", "#bf6e48"], d: 0.2 },
    ],
    fore: { b: 885, a: 30, f: 0.003, ph: 1.4, c: ["#4a2618", "#2c160e"] },
    extra: "cacti",
    foot: {
      label: "Desert dusk",
      sky: ["#2b2a55", "#8a4f6c", "#e98a5c"],
      fg: "#f6ece2", mu: "#d6b6a8", li: "rgba(255,255,255,.14)",
      moon: "setsun", stars: true,
      far: "#a35c5a", near: "#6e3a32", tree: "#2c3b2c", trees: "cactus",
      ground: "#4a2a22", gdot: "#5e382c", prop: "tumbleweed",
    },
  },
  snow: {
    name: "Alpine morning",
    veil: 0.55,
    snow: true,
    sky: ["#6f8bb0", "#b3c6da", "#e6ecf1", "#f4efe8"],
    sun: { x: 1150, y: 380, r: 38, core: "#fffaf0", glow: "#ffffff" },
    clouds: "#ffffff",
    layers: [
      { b: 600, a: 250, f: 0.006, ph: 0.4, jag: true, caps: "#f7f9fb", c: ["#8ea2bc", "#aab9cb"], d: 0.05 },
      { b: 720, a: 190, f: 0.008, ph: 2, jag: true, caps: "#eef3f7", c: ["#5f748d", "#7a8da4"], d: 0.12 },
      { b: 800, a: 30, f: 0.005, ph: 3, c: ["#e9eef3", "#d3dde7"], d: 0.2 },
    ],
    fore: { b: 900, a: 22, f: 0.004, ph: 1, c: ["#24364a", "#152231"], trees: "#1b2b3c", tips: "#eef3f8" },
    foot: {
      label: "Snow night",
      sky: ["#1e2a44", "#34466a", "#5b7096"],
      fg: "#eef2f8", mu: "#9fb0c8", li: "rgba(255,255,255,.12)", legal: "#5b7096",
      moon: "full", stars: true,
      far: "#7b8fb0", farJag: true, near: "#dfe7f0", tree: "#22314a", trees: "snowpine",
      ground: "#f2f6fa", gdot: "#d0dbe6", prop: "igloo", fx: "snow",
    },
  },
  forest: {
    name: "Misty dawn",
    veil: 0.5,
    sky: ["#f2c2a0", "#f6dcc3", "#dfe6d6", "#c9d7c4"],
    sun: { x: 800, y: 520, r: 60, core: "#fff3df", glow: "#ffe1bd" },
    mist: "#f4efe4",
    layers: [
      { b: 560, a: 35, f: 0.004, ph: 1, c: ["#a9bca3", "#bccab4"], d: 0.05, trees: "#9db29a" },
      { b: 650, a: 40, f: 0.005, ph: 2.2, c: ["#7f9a80", "#93ab92"], d: 0.12, trees: "#6e8a72" },
      { b: 745, a: 35, f: 0.006, ph: 4, c: ["#4f6b57", "#62806a"], d: 0.2, trees: "#3f5a48" },
    ],
    fore: { b: 880, a: 28, f: 0.005, ph: 1, c: ["#22332a", "#17241d"], trees: "#17241d" },
    foot: {
      label: "Forest dusk",
      sky: ["#1d2a2a", "#2f4a42", "#5d6f55"],
      fg: "#eaf0e6", mu: "#9fb3a2", li: "rgba(255,255,255,.12)",
      moon: null, stars: true,
      far: "#3d5a4b", near: "#263d33", tree: "#162720", trees: "pine",
      ground: "#15221c", gdot: "#22352b", prop: "tent", fx: "fireflies",
    },
  },
  sea: {
    name: "Moonlit coast",
    veil: 0.35,
    stars: true,
    sky: ["#0b1430", "#1b2a55", "#3b4f80", "#6a7aa8"],
    sun: { x: 1100, y: 330, r: 54, core: "#f3f0dd", glow: "#c9d3f2" },
    clouds: "#5a6a99",
    layers: [{ b: 660, a: 10, f: 0.006, ph: 1, c: ["#33426e", "#3f4f7f"], d: 0.05 }],
    water: { y: 680, c: ["#4a5a8c", "#0e1733"], glint: "#e9ecff" },
    fore: { b: 900, a: 14, f: 0.004, ph: 2, c: ["#0d1328", "#080c1c"] },
    extra: "lighthouse",
    foot: {
      label: "Lighthouse",
      sky: ["#0b1430", "#1b2a55", "#34477a"],
      fg: "#e9ecff", mu: "#97a2c8", li: "rgba(255,255,255,.12)",
      moon: "full", stars: true,
      far: "#26355f", near: "#0c1226", nearCliff: true, tree: null, trees: null,
      ground: "#14214a", gdot: "#3d5590", prop: "lighthouse",
    },
  },
};

export const SCENE_KEYS = Object.keys(SCENES);

const LAST_KEY = "ap-scene-last";

/** A random scene, never the one this viewer saw last. Storage can be missing or blocked. */
export function pickScene(exclude?: string): string {
  let prev: string | null = null;
  try {
    prev = localStorage.getItem(LAST_KEY);
  } catch {}
  const pool = SCENE_KEYS.filter((k) => k !== prev && k !== exclude);
  return pool[Math.floor(Math.random() * pool.length)];
}

export function rememberScene(k: string) {
  try {
    localStorage.setItem(LAST_KEY, k);
  } catch {}
}

/** The trip that matches a scene's mood leads the balloon. Desert has no match, so Dawki. */
const SCENE_TRIP: Record<string, string> = { dusk: "Dawki", desert: "Dawki", snow: "Champawat", forest: "Shillong", sea: "Goa" };
export function sceneTrip(k: string): string {
  return SCENE_TRIP[k] ?? "Dawki";
}

/* ---------- SVG painter ---------- */

function hAt(l: Ridge, x: number): number {
  if (l.jag) {
    const s = Math.abs(Math.sin(x * l.f + l.ph));
    return l.b - Math.pow(1 - s, 1.4) * l.a - Math.sin(x * l.f * 4.1 + l.ph * 2) * l.a * 0.06 - Math.sin(x * 0.05) * 4;
  }
  let h = l.b + Math.sin(x * l.f + l.ph) * l.a + Math.sin(x * l.f * 2.3 + l.ph * 1.7) * l.a * 0.4;
  // Flat-topped buttes with steep, slightly eroded sides.
  for (const [x0, x1, top] of l.mesas ?? []) {
    const edge = Math.min(x - x0, x1 - x) / 46;
    if (edge > -1) h -= top * Math.min(1, Math.max(0, edge + 1) ** 1.6) + (edge > 0 ? Math.sin(x * 0.21) * 3 : 0);
  }
  return h;
}

function ridgeD(l: Ridge): string {
  let d = "M0 1000";
  for (let x = 0; x <= 1600; x += 12) d += ` L${x} ${hAt(l, x).toFixed(1)}`;
  return d + " L1600 1000Z";
}

function pines(l: Ridge, color: string, tips: string | undefined, step: number, size: number): string {
  let g = "";
  for (let x = 6; x < 1600; x += step) {
    const jitter = (Math.sin(x * 12.9898) * 43758.5453) % 1;
    const h = size * (0.7 + Math.abs(jitter) * 0.6);
    const y = hAt(l, x) + 4;
    g += `<path d="M${x} ${y - h} L${x + h * 0.32} ${y} L${x - h * 0.32} ${y}Z" fill="${color}"/>`;
    if (tips) g += `<path d="M${x} ${y - h} L${x + h * 0.12} ${y - h * 0.62} L${x - h * 0.12} ${y - h * 0.62}Z" fill="${tips}"/>`;
  }
  return g;
}

/** SVG markup for a 1600x1000 scene. `p` prefixes every id so two copies can share a page. */
export function sceneSVG(S: Scene, p: string): string {
  const st = S.sky.map((c, i) => `<stop offset="${[0, 0.42, 0.68, 0.85][i]}" stop-color="${c}"/>`).join("");
  let defs = `<linearGradient id="${p}sky" x1="0" y1="0" x2="0" y2="1">${st}</linearGradient>
  <radialGradient id="${p}glow"><stop offset="0" stop-color="${S.sun.glow}" stop-opacity=".95"/><stop offset=".3" stop-color="${S.sun.glow}" stop-opacity=".45"/><stop offset="1" stop-color="${S.sun.glow}" stop-opacity="0"/></radialGradient>
  <filter id="${p}brush" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".012 .04" numOctaves="3" seed="4"/><feDisplacementMap in="SourceGraphic" scale="14"/></filter>
  <filter id="${p}soft" x="-50%" y="-300%" width="200%" height="700%"><feGaussianBlur stdDeviation="18"/></filter>`;
  let body = `<rect width="1600" height="1000" fill="url(#${p}sky)"/>`;
  if (S.stars) {
    for (let i = 0; i < 90; i++) {
      const x = (i * 397) % 1600, y = (i * 233) % 520, r = i % 7 ? 1 : 1.8;
      body += `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" opacity="${0.3 + (i % 5) / 8}"/>`;
    }
  }
  body += `<circle cx="${S.sun.x}" cy="${S.sun.y}" r="${S.sun.r * 6}" fill="url(#${p}glow)"/><circle cx="${S.sun.x}" cy="${S.sun.y}" r="${S.sun.r}" fill="${S.sun.core}"/>`;
  if (S.clouds)
    body += `<g opacity=".5" filter="url(#${p}soft)"><ellipse cx="420" cy="300" rx="260" ry="24" fill="${S.clouds}"/><ellipse cx="1240" cy="220" rx="320" ry="20" fill="${S.clouds}"/></g>`;
  S.layers.forEach((l, i) => {
    defs += `<linearGradient id="${p}l${i}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${l.c[0]}"/><stop offset="1" stop-color="${l.c[1]}"/></linearGradient>`;
    let g = `<path filter="url(#${p}brush)" fill="url(#${p}l${i})" d="${ridgeD(l)}"/>`;
    if (l.caps) {
      // Snow follows each peak with a ragged lower edge.
      const line = l.b - l.a * 0.62;
      let top = "", bot = "";
      for (let x = 0; x <= 1600; x += 8) {
        const h = hAt(l, x);
        const lo = Math.max(h, line + Math.sin(x * 0.09) * 12 + Math.sin(x * 0.031 + i) * 16 + Math.sin(x * 0.27) * 5);
        top += `${top ? " L" : "M"}${x} ${h.toFixed(1)}`;
        bot = ` L${x} ${lo.toFixed(1)}` + bot;
      }
      g += `<path filter="url(#${p}brush)" fill="${l.caps}" d="${top}${bot}Z"/>`;
    }
    if (l.trees) g += pines(l, l.trees, undefined, 22, 26 + i * 10);
    body += `<g class="layer" data-depth="${l.d}">${g}</g>`;
    if (S.mist)
      body += `<rect class="layer" data-depth="${l.d}" y="${l.b + 10}" width="1600" height="60" fill="${S.mist}" opacity=".55" filter="url(#${p}soft)"/>`;
  });
  if (S.water) {
    defs += `<linearGradient id="${p}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${S.water.c[0]}"/><stop offset="1" stop-color="${S.water.c[1]}"/></linearGradient>`;
    let g = `<rect y="${S.water.y}" width="1600" height="${1000 - S.water.y}" fill="url(#${p}w)" opacity=".92"/>`;
    for (let k = 0; k < 6; k++)
      g += `<ellipse cx="${S.sun.x}" cy="${S.water.y + 18 + k * 22}" rx="${80 - k * 11}" ry="${4 - k * 0.4}" fill="${S.water.glint}" opacity="${0.75 - k * 0.1}"/>`;
    body += `<g class="layer" data-depth=".26">${g}</g>`;
  }
  const f = S.fore;
  defs += `<linearGradient id="${p}f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${f.c[0]}"/><stop offset="1" stop-color="${f.c[1]}"/></linearGradient>`;
  let fg = `<path filter="url(#${p}brush)" fill="url(#${p}f)" d="${ridgeD(f)}"/>`;
  if (f.trees) fg += pines(f, f.trees, f.tips, 16, 70);
  if (S.extra === "cacti")
    for (const [x, h] of [[980, 70], [1360, 120], [1440, 70]]) {
      const y = hAt(f, x) + 6;
      fg += `<g fill="${f.c[1]}"><rect x="${x - 7}" y="${y - h}" width="14" height="${h}" rx="7"/><rect x="${x - 24}" y="${y - h * 0.7}" width="10" height="${h * 0.35}" rx="5"/><rect x="${x - 24}" y="${y - h * 0.4}" width="20" height="9" rx="4"/><rect x="${x + 14}" y="${y - h * 0.8}" width="10" height="${h * 0.3}" rx="5"/><rect x="${x + 4}" y="${y - h * 0.55}" width="20" height="9" rx="4"/></g>`;
    }
  if (S.extra === "lighthouse") {
    defs += `<linearGradient id="${p}beam" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#fff4c2" stop-opacity=".28"/><stop offset="1" stop-color="#fff4c2" stop-opacity="0"/></linearGradient>`;
    fg += `<path fill="${f.c[1]}" d="M1240 1000 L1270 830 L1330 780 L1460 770 L1520 800 L1600 790 L1600 1000Z"/>
    <polygon points="1388,780 1412,780 1406,650 1394,650" fill="#e9e4d8"/><rect x="1392" y="700" width="17" height="14" fill="#b5483f"/><rect x="1394" y="740" width="15" height="14" fill="#b5483f"/>
    <rect x="1390" y="632" width="20" height="18" fill="#2a2f45"/><circle cx="1400" cy="641" r="7" fill="#fff4c2"/><circle cx="1400" cy="641" r="60" fill="url(#${p}glow)" opacity=".8"/>
    <polygon points="1400,641 520,540 520,720" fill="url(#${p}beam)"/>`;
  }
  body += `<g class="layer" data-depth=".34">${fg}</g>`;
  if (S.snow) {
    for (let i = 0; i < 70; i++) {
      const x = (i * 211) % 1600, d = 6 + (i % 5) * 2, r = 1 + (i % 3);
      body += `<circle cx="${x}" cy="-10" r="${r}" fill="#fff" opacity=".8"><animate attributeName="cy" from="-10" to="1010" dur="${d}s" begin="-${((i * 0.37) % d).toFixed(2)}s" repeatCount="indefinite"/><animate attributeName="cx" values="${x};${x + 18};${x}" dur="${d / 2}s" repeatCount="indefinite"/></circle>`;
    }
  }
  return `<defs>${defs}</defs>${body}`;
}

/* ---------- 8-bit footer ---------- */

const W = 320, H = 96;
// A 10x12 me for the footer and the balloon basket: curly hair, shades, stubble, brown fleece.
export const MINI_PAL: Record<string, string> = {
  H: "#15131d", h: "#3a3548", S: "#c68a63", G: "#07070b", B: "#5a3d2b", J: "#7a5238", j: "#563823", T: "#1c1c22", P: "#2c3140", K: "#0e0e12",
};
export const F1 = ["..hHHhH...", ".HHHHHHH..", ".HHSSSSH..", ".HSGGSGG..", "..SSSSSS..", "..SBBBB...", ".JJJTTJJ..", "JjJJTTJJj.", "SjJJTTJJS.", "..PPPPPP..", "..PP..PP..", ".KK....KK."];
export const F2 = ["..hHHhH...", ".HHHHHHH..", ".HHSSSSH..", ".HSGGSGG..", "..SSSSSS..", "..SBBBB...", ".JJJTTJJ..", "JjJJTTJJj.", "SjJJTTJJS.", "..PPPPPP..", "...PPPP...", "..KK..KK.."];

function ridge(base: number, amp: number, f: number, ph: number, jag?: boolean): number[] {
  return Array.from({ length: W }, (_, x) => {
    if (jag) {
      const s = Math.abs(Math.sin(x * f + ph));
      return Math.round(base - Math.pow(1 - s, 1.3) * amp * 2.2 + amp);
    }
    return Math.round(base + Math.sin(x * f + ph) * amp + Math.sin(x * f * 2.7 + ph * 2) * amp * 0.45);
  });
}

export type Footer = { stop: () => void; leave: () => void; comeBack: () => void };

/** Runs the footer scene on a 320x96 canvas. `leave` sends the character up and out of frame. */
export function runPixelFooter(cv: HTMLCanvasElement, F: Foot, still = false): Footer {
  const cx = cv.getContext("2d");
  if (!cx) return { stop: () => {}, leave: () => {}, comeBack: () => {} };
  let seed = 11;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const stars = Array.from({ length: 46 }, () => [Math.floor(rnd() * W), Math.floor(rnd() * 48), rnd()]);
  let far = ridge(F.farJag ? 60 : 56, F.farJag ? 10 : 7, F.farJag ? 0.05 : 0.035, 1, F.farJag);
  const near = F.nearCliff
    ? Array.from({ length: W }, (_, x) => (x > 232 ? Math.round(70 - Math.min(8, (x - 232) * 0.6)) : H))
    : ridge(68, 5, 0.06, 3);
  if (F.nearCliff) far = far.map((h) => Math.max(h, 74));
  const parts =
    F.fx === "snow"
      ? Array.from({ length: 110 }, () => ({ x: rnd() * W, y: rnd() * H, v: 0.15 + rnd() * 0.35, p: rnd() * 6 }))
      : F.fx === "fireflies"
        ? Array.from({ length: 16 }, () => ({ x: rnd() * W, y: 50 + rnd() * 30, v: 0, p: rnd() * 6 }))
        : [];
  let t = 0, hx = 60, dir = 1, frame = 0, jumpV = 0, jy = 0, tw = -20, raf = 0, leaving = false;

  const px = (x: number, y: number, c: string) => { cx.fillStyle = c; cx.fillRect(x, y, 1, 1); };
  const disc = (mx: number, my: number, r: number, c: string) => {
    cx.fillStyle = c;
    for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) if (x * x + y * y <= r * r) cx.fillRect(mx + x, my + y, 1, 1);
  };
  const pine = (x: number, b: number, c: string, snow: boolean) => {
    cx.fillStyle = c;
    for (let i = 0; i < 8; i++) cx.fillRect(x - Math.floor(i / 2), b - 10 + i, 1 + Math.floor(i / 2) * 2, 1);
    cx.fillRect(x, b - 2, 1, 2);
    if (snow) for (const [dx, dy] of [[0, -10], [-1, -7], [1, -7], [-2, -5], [2, -5]]) px(x + dx, b + dy, "#f2f6fa");
  };
  const cactus = (x: number, b: number, c: string) => {
    cx.fillStyle = c;
    cx.fillRect(x, b - 13, 3, 13); cx.fillRect(x - 3, b - 9, 1, 4); cx.fillRect(x - 3, b - 6, 3, 1);
    cx.fillRect(x + 4, b - 11, 1, 4); cx.fillRect(x + 3, b - 8, 2, 1);
  };

  const drawProp = () => {
    const P = F.prop;
    if (P === "campfire") {
      const fx = 220, fl = ["#ffd36e", "#ff9d4a", "#e2725b"];
      for (let i = 0; i < 5; i++) px(fx - 2 + i, 83, "#6b4a3a");
      for (let i = 0; i < 4; i++) {
        const h = 2 + (((t >> 2) + i * 3) % 3);
        for (let k = 0; k < h; k++) px(fx - 1 + (i % 3), 82 - k, fl[(k + i) % 3]);
      }
    }
    if (P === "igloo") {
      const ix = 170, iy = 84, r = 12;
      for (let y = -r; y <= 0; y++)
        for (let x = -r; x <= r; x++)
          if (x * x + y * y <= r * r) px(ix + x, iy + y, y % 4 === 0 || ((x + (y >> 2) * 3) % 6 === 0 && y < 0) ? "#c9d6e3" : "#f4f8fb");
      for (let y = -5; y <= 0; y++) for (let x = -3; x <= 3; x++) if (x * x + (y + 1) * (y + 1) <= 12) px(ix + x + 8, iy + y, "#2b3550");
      if ((t >> 4) % 2) px(ix + 8, iy - 3, "#ffd36e");
    }
    if (P === "tent") {
      const tx = 212, ty = 84;
      for (let i = 0; i < 14; i++) {
        cx.fillStyle = "#d9784a"; cx.fillRect(tx - i, ty - 14 + i, i + 1, 1);
        cx.fillStyle = "#b65e37"; cx.fillRect(tx + 1, ty - 14 + i, i, 1);
      }
      for (let i = 0; i < 6; i++) {
        cx.fillStyle = (t >> 5) % 2 ? "#ffd36e" : "#2a1d16";
        cx.fillRect(tx - Math.floor(i / 2), ty - 6 + i, 1 + Math.floor(i / 2) * 2, 1);
      }
    }
    if (P === "tumbleweed") {
      tw += 0.6;
      if (tw > W + 10) tw = -20;
      const by = 80 + Math.round(Math.abs(Math.sin(tw * 0.12)) * -4), r = 3;
      for (let y = -r; y <= r; y++)
        for (let x = -r; x <= r; x++)
          if (x * x + y * y <= r * r && (x + y + Math.floor(tw)) % 2 === 0) px(Math.round(tw) + x, by + y, "#b08850");
    }
    if (P === "lighthouse") {
      const lx = 270, base = near[lx];
      cx.fillStyle = "#e9e4d8";
      for (let y = 0; y < 20; y++) { const w = 4 - Math.floor(y / 10); cx.fillRect(lx - w, base - y, w * 2, 1); }
      cx.fillStyle = "#b5483f"; cx.fillRect(lx - 4, base - 6, 8, 3); cx.fillRect(lx - 3, base - 14, 6, 3);
      cx.fillStyle = "#2a2f45"; cx.fillRect(lx - 3, base - 24, 6, 4);
      px(lx, base - 22, "#fff4c2"); px(lx - 1, base - 22, "#fff4c2");
      const a = Math.sin(t * 0.02) * 0.5 - 0.1;
      cx.save(); cx.globalAlpha = 0.16; cx.fillStyle = "#fff4c2"; cx.beginPath();
      cx.moveTo(lx, base - 22);
      cx.lineTo(lx - 220 * Math.cos(a), base - 22 - 220 * Math.sin(a) - 14);
      cx.lineTo(lx - 220 * Math.cos(a), base - 22 - 220 * Math.sin(a) + 14);
      cx.closePath(); cx.fill(); cx.restore();
    }
  };

  const draw = () => {
    t++;
    const g = cx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, F.sky[0]); g.addColorStop(0.7, F.sky[1]); g.addColorStop(1, F.sky[2]);
    cx.fillStyle = g; cx.fillRect(0, 0, W, H);
    if (F.stars) for (const [x, y, p] of stars) if (Math.sin(t * 0.05 + p * 10) > -0.3) px(x, y, p > 0.8 ? "#fff" : "#b9b6dc");
    if (F.moon === "crescent") { disc(258, 14, 5, "#f3e6c4"); disc(260, 13, 4, F.sky[0]); }
    if (F.moon === "full") { disc(258, 16, 6, "#f1eedc"); px(256, 14, "#d9d4bd"); px(259, 18, "#d9d4bd"); px(261, 15, "#d9d4bd"); }
    if (F.moon === "sun") { disc(60, 18, 9, "#fff6c9"); disc(60, 18, 7, "#fffbe6"); }
    // A low sun sinking behind the far ridge.
    if (F.moon === "setsun") { disc(236, 58, 12, "#f6b26b"); disc(236, 58, 9, "#ffd9a0"); }
    far.forEach((h, x) => { cx.fillStyle = F.far; cx.fillRect(x, h, 1, H - h); });
    if (F.farJag) far.forEach((h, x) => { if (h < 56) { cx.fillStyle = "#e8eef5"; cx.fillRect(x, h, 1, Math.min(3, 56 - h)); } });
    near.forEach((h, x) => { cx.fillStyle = F.near; cx.fillRect(x, h, 1, H - h); });
    if (F.tree && (F.trees === "pine" || F.trees === "snowpine"))
      for (const x of [18, 40, 46, 97, 150, 157, 262, 270, 300]) pine(x, near[x], F.tree, F.trees === "snowpine");
    if (F.tree && F.trees === "cactus") for (const x of [40, 120, 268]) cactus(x, near[x] + 1, F.tree);
    cx.fillStyle = F.ground; cx.fillRect(0, 84, W, 12);
    for (let x = 0; x < W; x += 4) px(x + ((t >> 3) % 4), 86 + ((x >> 2) % 3 === 0 ? 3 : 0), F.gdot);
    drawProp();
    if (jumpV || jy) { jy += jumpV; jumpV += leaving ? -0.05 : 0.18; if (!leaving && jy >= 0) { jy = 0; jumpV = 0; } }
    if (!leaving) {
      hx += 0.35 * dir;
      if (hx > W - 14) dir = -1;
      if (hx < 4) dir = 1;
      if (t % 10 === 0) frame ^= 1;
    }
    if (jy > -120) (frame ? F1 : F2).forEach((row, y) =>
      [...row].forEach((c, x) => { if (c !== ".") px(Math.round(hx) + (dir > 0 ? x : 9 - x), 72 + y + Math.round(jy), MINI_PAL[c]); }),
    );
    if (F.fx === "snow")
      for (const s of parts) {
        s.y += s.v; s.x += Math.sin(t * 0.02 + s.p) * 0.15;
        if (s.y > H) { s.y = 0; s.x = Math.random() * W; }
        px(Math.round(s.x), Math.round(s.y), "#ffffff");
      }
    if (F.fx === "fireflies")
      for (const s of parts) {
        s.x += Math.sin(t * 0.01 + s.p) * 0.2; s.y += Math.cos(t * 0.013 + s.p) * 0.1;
        if (Math.sin(t * 0.06 + s.p * 3) > 0.2) px(Math.round(s.x), Math.round(s.y), "#e8f57a");
      }
    if (!still && visible) raf = requestAnimationFrame(draw);
  };

  // Only animate while the footer is on screen; paint one frame up front either way.
  let visible = false;
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    cancelAnimationFrame(raf);
    if (visible && !still) raf = requestAnimationFrame(draw);
  });
  io.observe(cv);
  const jump = () => { if (jy === 0 && !leaving) jumpV = -2.6; };
  cv.addEventListener("click", jump);
  draw();
  return {
    stop: () => { io.disconnect(); cancelAnimationFrame(raf); cv.removeEventListener("click", jump); },
    leave: () => { leaving = true; jumpV = -3.2; if (still) { jy = -200; draw(); } },
    comeBack: () => { leaving = false; jy = 0; jumpV = 0; if (still) draw(); },
  };
}
