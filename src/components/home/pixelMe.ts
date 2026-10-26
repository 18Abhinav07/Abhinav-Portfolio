/* Pixel-art me at a desk, for the About section. The same sprite as the Dart forge
   (public/embeds/dart/forge.js), seated. Each cycle I code something on the laptop and the
   extended monitor, it builds, then ships up a pipeline into the cloud and joins the
   services orbiting it. The window sky turns from day to dusk to night and back.
   Drawn on a 160x90 canvas and scaled up with image-rendering: pixelated. */

const W = 160, H = 90, FLOOR = 80;

const PAL: Record<string, string> = {
  H: "#101018", h: "#2c2a3a", S: "#c68a63", s: "#9c6646", G: "#07070b", g: "#7d8cc0", B: "#4a3326",
  J: "#6e4a33", j: "#4e3324", k: "#8c6247", T: "#18181c", P: "#262a36", p: "#1b1e27", K: "#0e0e12",
};
// curly hair, square shades, stubble, brown fleece over a black tee: the top half, for sitting
const ME = [
  "......hhHHh.........", "....hHHHHHHHh.......", "...HHhHHHHhHHH......", "..HHHHHHHHHHHHH.....",
  "..HHhHHHHHHHhHHH....", "..HHHHHHHHHHHHHH....", "..HHHHSSSSSHHHH.....", "..HHHSSSSSSSSHH.....",
  "...HHSGGGGsGGGG.....", "...HSSGgGGsGgGG.....", "...HSSGGGSSSGGS.....", "...HSSSSSSSSSSS.....",
  "....sSSSSSSSSS......", "....BSSSSBBSSS......", "....BBSSSSSSBB......", ".....BBBBBBBB.......",
  "......sSSSs.........", "...kJJJTTTJJJk......", "..kJJJJTTTJJJJJ.....", ".kJJJJJTTTJJJJJj....",
  ".JJJJJJTTTJJJJJj....", ".JJjJJJTTTJJJjJj....", ".JJjJJJTTTJJJjJj....", ".JJjJJJTTTJJJjJj....",
  ".JJjJJJTTTJJJjJj....", "..jjJJJJJJJJj.......",
];
const HEAD_ROWS = 17; // the head and neck nod a pixel while he types
const MX = 30, MY = 34;
const DESK = { x: 46, y: 56, w: 62 };
const MON = { x: 78, y: 25, w: 26, h: 21 };
const LAP = { x: 52, y: 43, w: 17, h: 11 };
const WIN = { x: 5, y: 8, w: 24, h: 22 };
const CLOUD = { x: 130, y: 20 };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a: string, b: string, t: number) => {
  const A = hex(a), B = hex(b);
  return `#${A.map((v, i) => Math.round(lerp(v, B[i], Math.max(0, Math.min(1, t)))).toString(16).padStart(2, "0")).join("")}`;
};
const ease = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);
const clamp01 = (t: number) => Math.max(0, Math.min(1, t));

// What gets built and shipped, as tiny sprites. 'l' is a blinking status light.
const IP: Record<string, string> = {
  L: "#d6d7e0", W: "#f6f6f8", B: "#4B55DB", g: "#c9cbd6", r: "#ff6b6b", y: "#ffd36b", o: "#5ee38a", O: "#e3a07f",
  K: "#262a36", c: "#8ad0ff", T: "#9fb3ff", t: "#c9d4ff", D: "#4B55DB", d: "#6a74f0", e: "#3a43b8",
  S: "#3a3e4b", n: "#5a6072", m: "#e3b45e", P: "#22232c", u: "#6c7a96",
};
type Make = { label: string; art: string[] };
const MAKES: Make[] = [
  { label: "a web app", art: ["LLLLLLLLLLLL", "LrygLLLLLLLL", "WWWWWWWWWWWW", "WBBBBBBBWWWW", "WWWWWWWWWWWW", "WgggggggggWW", "WggggggWWWWW", "WWWWWWWWWWWW", "WgggggWBBBBW", "WWWWWWWWWWWW"] },
  { label: "a backend API", art: ["KKKKKKKKKKKK", "KKccKKKKccKK", "KKcKKKKKKcKK", "KKcKKKKKKcKK", "KcKKKooKKKcK", "KKcKKKKKKcKK", "KKcKKKKKKcKK", "KKccKKKKccKK", "KKKKKKKKKKKK"] },
  { label: "a database", art: ["..TTTTTTTT..", ".TttttttttT.", ".DTTTTTTTTD.", ".DdDDDDDDDD.", ".DdDDDDDDDD.", ".eeeeeeeeee.", ".DdDDDDDDDD.", ".DdDDDDDDDD.", ".eeeeeeeeee.", "..DDDDDDDD.."] },
  { label: "a server", art: ["SSSSSSSSSSSS", "SnnnnnnSSlmS", "SSSSSSSSSSSS", "SnnnnnnSSlmS", "SSSSSSSSSSSS", "SnnnnnnSSlmS", "SSSSSSSSSSSS", ".SS......SS."] },
  { label: "a dashboard", art: ["LLLLLLLLLLLL", "WWWWWWWWWWWW", "WWWWWWWWWOWW", "WWWWWBWWWOWW", "WWBWWBWWWOWW", "WWBWWBWBWOWW", "WBBWBBWBWOWW", "WBBWBBWBBOWW", "WWWWWWWWWWWW"] },
  { label: "a phone app", art: ["PPPPPPPP", "PWWWWWWP", "PBBBBBWP", "PWWWWWWP", "PggggWWP", "PgggggWP", "PWWWWWWP", "PggggWWP", "PWWWWWWP", "PPPgPPPP", "PPPPPPPP"] },
  { label: "a CLI tool", art: ["LLLLLLLLLLLL", "KKKKKKKKKKKK", "KoKKKKKKKKKK", "KKoKKKKKKKKK", "KoKKooooKKKK", "KKKKKKKKKKKK", "KuuuuuKKKKKK", "KuuuuuuuuKKK", "KKKKKKKKKKKK"] },
];

export function runPixelMe(cv: HTMLCanvasElement, onLabel: (label: string) => void): () => void {
  const c = cv.getContext("2d")!;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const px = (x: number, y: number, col: string) => { c.fillStyle = col; c.fillRect(Math.round(x), Math.round(y), 1, 1); };
  const rect = (x: number, y: number, w: number, h: number, col: string) => {
    c.fillStyle = col; c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  };
  const glow = (x: number, y: number, r: number, col: string, a: number) => {
    c.globalAlpha = a; c.fillStyle = col;
    c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill();
    c.globalAlpha = 1;
  };

  // Draws a make's sprite with its centre at (cx, cy). `from` hides rows above it, for the build reveal.
  function art(m: Make, cx: number, cy: number, now: number, from = 0) {
    const w = m.art[0].length, h = m.art.length, x0 = Math.round(cx - w / 2), y0 = Math.round(cy - h / 2);
    m.art.forEach((row, y) => {
      if (y < from) return;
      [...row].forEach((ch, x) => {
        if (ch === ".") return;
        const col = ch === "l" ? (Math.sin(now / 160 + y) > 0 ? "#5ee38a" : "#2f7a4a") : IP[ch];
        if (col) px(x0 + x, y0 + y, col);
      });
    });
  }

  /* ---------- the room ---------- */

  // Day, dusk, night, dawn: a slow loop independent of the work.
  const SKY = [["#9fd3f0", "#d9eef8"], ["#f0a87a", "#f8d9a8"], ["#232650", "#3d3a6e"], ["#e9b9c8", "#f6dcc0"]];
  function sky(now: number) {
    const k = (now / 14000) % SKY.length, i = Math.floor(k), f = ease(Math.min(1, (k - i) * 1.6));
    const a = SKY[i], b = SKY[(i + 1) % SKY.length];
    return { top: mix(a[0], b[0], f), low: mix(a[1], b[1], f), night: i === 2 ? 1 - f : i === 1 ? f : 0 };
  }

  function room(night: number) {
    const dim = night * 0.22;
    rect(0, 0, W, FLOOR, mix("#f1e6d2", "#8c7f74", dim));
    // a painted wainscot panel along the lower wall
    const wy = FLOOR - 24;
    rect(0, wy, W, FLOOR - wy, mix("#dcc7a6", "#7a6c5e", dim));
    rect(0, wy, W, 2, mix("#c8ae88", "#6f6256", dim)); rect(0, wy, W, 1, mix("#efdcbc", "#857767", dim));
    for (let x = 6; x < W; x += 16) rect(x, wy + 5, 1, FLOOR - wy - 9, mix("#cdb592", "#71645a", dim));
    rect(0, FLOOR - 3, W, 3, mix("#b89c76", "#64584d", dim));
    rect(0, FLOOR, W, H - FLOOR, mix("#a87a52", "#5e4433", dim));
    for (let x = 0; x < W; x += 18) rect(x, FLOOR + 1, 1, H - FLOOR, mix("#93683f", "#4e3828", dim));
    rect(0, FLOOR, W, 1, mix("#c2946a", "#6e5140", dim));
  }

  function windowSky(now: number) {
    const s = sky(now), { x, y, w, h } = WIN;
    for (let yy = 0; yy < h; yy++) rect(x, y + yy, w, 1, mix(s.top, s.low, yy / h));
    if (s.night > 0.3) for (let i = 0; i < 8; i++) {
      const sx = x + ((i * 7 + 3) % w), sy = y + ((i * 11 + 2) % (h - 6));
      if (Math.sin(now / 400 + i * 1.7) > -0.2) px(sx, sy, mix(s.top, "#fff7d6", s.night));
    } else for (let i = 0; i < 2; i++) {
      const cx = x + ((now / (220 + i * 140) + i * 13) % (w + 12)) - 8, cy = y + 5 + i * 8;
      for (let k = 0; k < 7; k++) if (cx + k >= x && cx + k < x + w) {
        px(cx + k, cy, "#ffffff"); if (k > 1 && k < 5) px(cx + k, cy - 1, "#ffffff");
      }
    }
    if (s.night > 0.3) rect(x + w - 7, y + 4, 3, 3, mix(s.top, "#fff2c8", s.night));
    else rect(x + 4, y + 3, 3, 3, mix(s.top, "#fff3a6", 1 - s.night));
    rect(x - 1, y - 1, w + 2, 1, "#7a5a3c"); rect(x - 1, y + h, w + 2, 2, "#7a5a3c");
    rect(x - 1, y, 1, h, "#7a5a3c"); rect(x + w, y, 1, h, "#7a5a3c");
    rect(x + w / 2, y, 1, h, "#8f6c4b"); rect(x, y + h / 2, w, 1, "#8f6c4b");
    rect(x - 3, y + h + 2, w + 6, 1, "#5e4430");
    // a plant on the sill, swaying a little
    const sway = Math.sin(now / 900);
    rect(x + 2, y + h - 4, 5, 4, "#b55a3c"); rect(x + 2, y + h - 4, 5, 1, "#cf7350");
    for (let i = 0; i < 5; i++) px(x + 4 + Math.round(sway * (i / 4)) + (i % 2 ? 1 : -1) * (i > 1 ? 1 : 0), y + h - 5 - i, i % 2 ? "#4f8a4a" : "#6aa95e");
    px(x + 2 + Math.round(sway), y + h - 8, "#6aa95e"); px(x + 7 + Math.round(sway), y + h - 7, "#4f8a4a");
  }

  function clock(now: number) {
    const cx = 46, cy = 14;
    for (let yy = -5; yy <= 5; yy++) for (let xx = -5; xx <= 5; xx++) {
      const d = Math.hypot(xx, yy);
      if (d <= 5.4) px(cx + xx, cy + yy, d > 4.4 ? "#5e4430" : "#fbf6ea");
    }
    const hand = (len: number, a: number, col: string) => {
      for (let i = 0; i <= len; i += 0.5) px(cx + Math.cos(a) * i, cy + Math.sin(a) * i, col);
    };
    hand(3, now / 6000 - Math.PI / 2, "#2b2b33"); hand(4, now / 500 - Math.PI / 2, "#c0442f");
  }

  // A fluffy cloud, with a green rim while a deploy lands.
  const PUFFS = [[-12, 2, 6], [-3, -3, 8], [8, -1, 7], [14, 3, 5], [1, 4, 7]];
  function cloud(night: number, flash: number, now: number) {
    const bob = reduce ? 0 : Math.round(Math.sin(now / 1400));
    const inside = (x: number, y: number, grow: number) => PUFFS.some(([dx, dy, r]) => Math.hypot(x - dx, y - dy) <= r + grow);
    for (let y = -13; y <= 12; y++) for (let x = -20; x <= 21; x++) {
      if (!inside(x, y, 1)) continue;
      const X = CLOUD.x + x, Y = CLOUD.y + y + bob;
      if (!inside(x, y, 0)) px(X, Y, mix(mix("#b7c3d9", "#5d6690", night), "#3fd17a", flash));
      else px(X, Y, y > 4 ? mix("#e3e9f5", "#8d94bd", night) : mix("#ffffff", "#b6bcdc", night));
    }
    if (flash > 0) { // a tick on the cloud
      [[-3, 1], [-2, 2], [-1, 3], [0, 2], [1, 1], [2, 0], [3, -1]].forEach(([x, y]) => px(CLOUD.x + x, CLOUD.y + y + bob, mix("#ffffff", "#2fae63", flash)));
    }
  }

  // The deploy pipeline: a curve from the top of the monitor into the cloud.
  const P0 = { x: MON.x + MON.w / 2, y: MON.y - 1 }, P1 = { x: MON.x + 8, y: -8 }, P2 = { x: CLOUD.x - 14, y: CLOUD.y + 2 };
  const along = (t: number) => ({
    x: (1 - t) ** 2 * P0.x + 2 * (1 - t) * t * P1.x + t * t * P2.x,
    y: (1 - t) ** 2 * P0.y + 2 * (1 - t) * t * P1.y + t * t * P2.y,
  });
  function pipeline(now: number, hot: number) {
    for (let i = 0; i < 10; i++) {
      const t = reduce ? i / 10 : (now / 1800 + i / 10) % 1, p = along(t);
      px(p.x, p.y, mix("#c9b9a0", "#4B55DB", 0.35 + hot * 0.65));
    }
  }

  function desk(now: number, night: number) {
    // the chair, behind him
    rect(MX - 3, MY + 6, 4, 22, "#3b3f4e"); rect(MX - 3, MY + 6, 4, 1, "#555a6c");
    rect(MX - 2, MY + 27, 18, 3, "#3b3f4e"); rect(MX + 6, MY + 30, 2, FLOOR - MY - 33, "#2a2d38");
    rect(MX, FLOOR - 3, 14, 1, "#2a2d38"); px(MX, FLOOR - 2, "#111111"); px(MX + 13, FLOOR - 2, "#111111");

    // the desk
    rect(DESK.x, DESK.y, DESK.w, 3, "#8a623f"); rect(DESK.x, DESK.y, DESK.w, 1, "#a57a52");
    rect(DESK.x + 4, DESK.y + 3, 2, FLOOR - DESK.y - 3, "#6e4e33"); rect(DESK.x + DESK.w - 6, DESK.y + 3, 2, FLOOR - DESK.y - 3, "#6e4e33");
    rect(DESK.x + DESK.w - 22, DESK.y + 3, 16, 9, "#7a5638"); rect(DESK.x + DESK.w - 15, DESK.y + 7, 3, 1, "#c9a46b");

    // a mug of coffee, still steaming
    const mx = DESK.x + 3, my = DESK.y - 5;
    rect(mx, my, 4, 5, "#d9584a"); rect(mx + 4, my + 1, 1, 3, "#d9584a"); rect(mx, my, 4, 1, "#3b2418");
    if (!reduce) for (let i = 0; i < 3; i++) {
      const k = (now / 1600 + i / 3) % 1;
      px(mx + 1 + Math.round(Math.sin(k * 7 + i) * 1.2), my - 1 - k * 8, mix("#ffffff", mix("#f1e6d2", "#8c7f74", night * 0.22), k));
    }

    // monitor glow on the wall, stronger at night
    glow(MON.x + MON.w / 2, MON.y + MON.h / 2, 22, "#8fa2ff", 0.06 + night * 0.12);
  }

  // Code lines that scroll as he types.
  const CODE = ["#8ad0ff", "#e3a07f", "#c9cbd6", "#5ee38a", "#c792ea"];
  function codeLines(x: number, y: number, w: number, h: number, scroll: number) {
    for (let r = 0; r < Math.floor(h / 2); r++) {
      const i = r + scroll, len = 3 + ((i * 37) % (w - 7)), ind = ((i * 13) % 3) * 2;
      rect(x + 1 + ind, y + 1 + r * 2, Math.min(len, w - 2 - ind), 1, CODE[i % CODE.length]);
      if (i % 3 === 0 && len + ind + 5 < w) rect(x + ind + len + 3, y + 1 + r * 2, 2, 1, CODE[(i + 2) % CODE.length]);
    }
  }

  const CODE_MS = 2800, BUILD_MS = 900, FLY = 1200, LAND = 600, REST = 600;
  const CYCLE = CODE_MS + FLY + LAND + REST;

  function screens(m: Make, now: number, T: number) {
    const typing = T < CODE_MS - BUILD_MS, built = clamp01((T - CODE_MS + BUILD_MS) / BUILD_MS);
    const scroll = reduce ? 0 : Math.floor(now / 220);
    // the extended monitor
    rect(MON.x - 1, MON.y - 1, MON.w + 2, MON.h + 2, "#1d1f27");
    rect(MON.x, MON.y, MON.w, MON.h, "#15171f");
    if (typing) codeLines(MON.x, MON.y, MON.w, MON.h, scroll);
    else if (T < CODE_MS) {
      // building: the thing renders in from the bottom while a progress bar fills
      art(m, MON.x + MON.w / 2, MON.y + 9, now, Math.round((1 - built) * m.art.length));
      rect(MON.x + 3, MON.y + MON.h - 4, MON.w - 6, 2, "#2a2d3a");
      rect(MON.x + 3, MON.y + MON.h - 4, (MON.w - 6) * built, 2, "#5ee38a");
    } else {
      // shipped: a green "deployed" line under the code
      codeLines(MON.x, MON.y, MON.w, MON.h - 5, scroll);
      rect(MON.x + 2, MON.y + MON.h - 5, 14, 4, "#1f3b2c");
      rect(MON.x + 3, MON.y + MON.h - 4, 2, 2, "#5ee38a"); rect(MON.x + 6, MON.y + MON.h - 3, 9, 1, "#5ee38a");
    }
    rect(MON.x + MON.w / 2 - 1, MON.y + MON.h + 1, 3, DESK.y - MON.y - MON.h - 1, "#2a2d38");
    rect(MON.x + MON.w / 2 - 5, DESK.y - 1, 11, 1, "#2a2d38");

    // the laptop
    rect(LAP.x - 1, LAP.y - 1, LAP.w + 2, LAP.h + 1, "#9aa0ad");
    rect(LAP.x, LAP.y, LAP.w, LAP.h - 1, "#15171f");
    codeLines(LAP.x, LAP.y, LAP.w, LAP.h - 1, typing ? scroll + 5 : 5);
    rect(LAP.x - 3, DESK.y - 2, LAP.w + 6, 2, "#b8bdc8"); rect(LAP.x - 3, DESK.y - 1, LAP.w + 6, 1, "#8a8f9b");
    return typing;
  }

  function me(now: number, typing: boolean, cheer: number) {
    const beat = now / 140;
    const bob = reduce || cheer > 0 ? 0 : typing && Math.sin(now / 300) > 0.7 ? 1 : 0;
    const lift = cheer > 0 ? -1 : 0;
    ME.forEach((row, y) => [...row].forEach((ch, x) => PAL[ch] && px(MX + x, MY + y + (y < HEAD_ROWS ? bob + lift : 0), PAL[ch])));
    // sitting: thighs out under the desk, shins down, shoes on the floor
    rect(MX + 3, MY + 26, 18, 4, PAL.P); rect(MX + 3, MY + 29, 18, 1, PAL.p);
    rect(MX + 17, MY + 30, 4, FLOOR - MY - 32, PAL.P);
    rect(MX + 16, FLOOR - 2, 7, 2, PAL.K);
    // two arms out to the keyboard, hands tapping
    const arm = (sx: number, sy: number, hx: number, hy: number, col: string) => {
      const n = Math.max(Math.abs(hx - sx), Math.abs(hy - sy));
      for (let i = 0; i <= n; i++) rect(lerp(sx, hx, i / n), lerp(sy, hy, i / n), 2, 3, col);
    };
    const tap = (k: number) => (typing && !reduce && Math.sin(beat + k) > 0 ? -1 : 0);
    arm(MX + 9, MY + 19, LAP.x + 2, DESK.y - 4 + tap(2), PAL.j);
    rect(LAP.x + 3, DESK.y - 4 + tap(2), 2, 2, PAL.s);
    arm(MX + 11, MY + 20, LAP.x + 8, DESK.y - 4 + tap(0), PAL.J);
    rect(LAP.x + 9, DESK.y - 4 + tap(0), 2, 2, PAL.S);
  }

  let lastLabel = "", raf = 0, visible = true;
  const start = performance.now();

  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    if (!visible) return;
    const elapsed = Math.max(0, now - start); // the first rAF stamp can predate `start`
    const t = reduce ? 0 : now;
    const round = reduce ? 3 : Math.floor(elapsed / CYCLE);
    const m = MAKES[round % MAKES.length];
    const T = reduce ? CODE_MS + FLY + LAND : elapsed % CYCLE;
    const flyT = clamp01((T - CODE_MS) / FLY), flying = T >= CODE_MS && T < CODE_MS + FLY;
    const landed = T >= CODE_MS + FLY, flash = reduce ? 0 : landed ? clamp01(1 - (T - CODE_MS - FLY) / LAND) : 0;
    if (m.label !== lastLabel) { lastLabel = m.label; onLabel(m.label); }

    const night = sky(t).night;
    room(night);
    windowSky(t);
    clock(t);

    // the lamp over the desk comes on as it gets dark
    const lx = 66, on = Math.min(1, night * 1.6);
    rect(lx, 0, 1, 7, "#3a3530"); rect(lx - 4, 7, 9, 3, "#2f4a44"); rect(lx - 5, 10, 11, 1, "#2f4a44");
    rect(lx - 1, 11, 3, 1, mix("#d8d2c4", "#fff2b0", on));
    if (on > 0) {
      c.globalAlpha = 0.14 * on; c.fillStyle = "#ffe7a3";
      c.beginPath(); c.moveTo(lx - 4, 11); c.lineTo(lx + 5, 11); c.lineTo(lx + 24, DESK.y); c.lineTo(lx - 22, DESK.y); c.closePath(); c.fill();
      c.globalAlpha = 1;
    }

    // services already live, orbiting the cloud; the back half passes behind it
    const done = round + (landed ? 1 : 0);
    const live = [1, 2, 3].map((k) => done - k).filter((i) => i >= 0).map((i) => MAKES[i % MAKES.length]);
    const orbit = live.map((mk, j) => {
      const a = (reduce ? 0.6 : now / 2600) + (j * Math.PI * 2) / 3;
      return { mk, x: CLOUD.x + Math.cos(a) * 22, y: CLOUD.y + 1 + Math.sin(a) * 8, front: Math.sin(a) > 0 };
    });
    orbit.filter((o) => !o.front).forEach((o) => art(o.mk, o.x, o.y, now));
    pipeline(now, flying ? 1 : 0);
    cloud(night, flash, now);
    orbit.filter((o) => o.front).forEach((o) => art(o.mk, o.x, o.y, now));

    desk(t, night);
    const typing = screens(m, now, T);
    me(now, typing || T > CODE_MS + FLY + LAND, flash);

    if (flying) {
      // the build rides the pipeline, leaving a short trail
      const e = ease(flyT);
      for (let k = 1; k <= 4; k++) { const q = along(Math.max(0, e - k * 0.035)); px(q.x, q.y, mix("#4B55DB", "#c9d4ff", k / 4)); }
      const p = along(e);
      art(m, p.x, p.y, now);
    }
  }

  // Only animate while it's on screen.
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
  io.observe(cv);
  raf = requestAnimationFrame(frame);
  return () => { cancelAnimationFrame(raf); io.disconnect(); };
}
