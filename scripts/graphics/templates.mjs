/**
 * Source for every cover and diagram in the "Your Agent Might Actually Lie to You"
 * series. Each entry is a self-contained HTML page that render.mjs screenshots with
 * headless Chrome.
 *
 * Why HTML rendered to PNG rather than Mermaid or an on-page chart library: the same
 * markdown is syndicated to dev.to, which renders neither. A PNG on Cloudinary looks
 * identical on the portfolio, on dev.to, and in a link preview.
 *
 * Every number drawn here comes from the GuardianKane repo (SCOREBOARD.md, JOURNEY.md,
 * the ORBITAL kane-activity.log audit trail). Nothing is illustrative unless labelled.
 */

const INK = "#07090F";
const LIME = "#BFFF00";
const CREAM = "#FAF9F6";
const MUTED = "#9CA3AF";
const FAIL = "#FF6B5B";
const WARN = "#FFB020";
const HUMAN = "#A78BFA";

const FONTS = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://api.fontshare.com/v2/css?f[]=clash-display@500,600,700&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">`;

const page = (width, height, body, extraCss = "") => `<!doctype html>
<html><head><meta charset="utf-8">${FONTS}
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: ${width}px; height: ${height}px; overflow: hidden; }
  body { font-family: "Hanken Grotesk", system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
  .display { font-family: "Clash Display", "Hanken Grotesk", sans-serif; }
  .mono { font-family: "JetBrains Mono", ui-monospace, monospace; }
  ${extraCss}
</style></head><body>${body}</body></html>`;

/* ------------------------------------------------------------------ covers */

// Two series share the GuardianKane covers. S1 is the hackathon gate, S2 the full build.
const S1 = { label: "Your agent might actually lie to you", parts: 3 };
const S2 = { label: "GuardianKane: it will not let your agent lie", parts: 2 };
const WORDS = ["zero", "one", "two", "three", "four", "five"];

const coverCss = `
  .cover { position: relative; width: 1600px; height: 100vh; background: ${INK}; color: #fff; overflow: hidden; }
  .grid { position: absolute; inset: 0;
    background-image: linear-gradient(rgba(191,255,0,0.07) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(191,255,0,0.07) 1px, transparent 1px);
    background-size: 48px 48px; mask-image: radial-gradient(80% 90% at 70% 50%, #000 30%, transparent 80%); }
  .glow { position: absolute; width: 900px; height: 900px; right: -220px; top: -260px;
    background: radial-gradient(circle, rgba(191,255,0,0.22) 0%, transparent 60%); }
  .left { position: absolute; left: 80px; top: 72px; bottom: 72px; width: 860px; display: flex; flex-direction: column; }
  .kicker { font-size: 20px; letter-spacing: 0.2em; text-transform: uppercase; color: ${LIME}; font-weight: 700; }
  .part { margin-top: 10px; font-size: 18px; letter-spacing: 0.2em; color: ${MUTED}; text-transform: uppercase; }
  .title { margin-top: auto; font-size: 76px; line-height: 1.02; letter-spacing: -0.02em; font-weight: 600; }
  .title em { font-style: normal; background: ${LIME}; color: ${INK}; padding: 0 14px; border-radius: 8px;
    box-decoration-break: clone; -webkit-box-decoration-break: clone; }
  .foot { margin-top: 36px; font-size: 18px; letter-spacing: 0.14em; text-transform: uppercase; color: ${MUTED}; }
  .motif { position: absolute; right: 70px; top: 50%; transform: translateY(-50%); width: 540px; height: 460px; }
`;

const cover = ({ series = S1, part, title, motif, height = 672 }) =>
  page(
    1600,
    height,
    `<div class="cover"><div class="grid"></div><div class="glow"></div>
      <div class="left">
        <div class="kicker mono">${series.label}</div>
        <div class="part mono">${part ? `Part ${String(part).padStart(2, "0")} of ${String(series.parts).padStart(2, "0")}` : `A series in ${WORDS[series.parts]} parts`}</div>
        <div class="title display">${title}</div>
        <div class="foot mono">GuardianKane &middot; Kane CLI &middot; Claude Code</div>
      </div>
      <div class="motif">${motif}</div>
    </div>`,
    coverCss,
  );

const chip = (x, y, text, { fill = "rgba(255,255,255,0.06)", stroke = "rgba(255,255,255,0.18)", color = "#fff", size = 18, w } = {}) => {
  const width = w ?? text.length * size * 0.62 + 32;
  return `<g transform="translate(${x},${y})">
    <rect width="${width}" height="${size * 2.2}" rx="${size * 0.55}" fill="${fill}" stroke="${stroke}"/>
    <text x="16" y="${size * 1.45}" font-family="JetBrains Mono" font-size="${size}" fill="${color}">${text}</text>
  </g>`;
};

// One tile per part, stacked. The lead tile is lime.
const seriesTiles = (tiles) => {
  const h = tiles.length === 2 ? 170 : 130;
  const pitch = h + 22;
  const top = (460 - (tiles.length * pitch - 22)) / 2;
  return `<svg viewBox="0 0 540 460" width="540" height="460">
    ${tiles
      .map(([n, label, sub], i) => {
        const lead = i === 0;
        return `<g transform="translate(10,${top + i * pitch})">
          <rect width="520" height="${h}" rx="16" fill="${lead ? "rgba(191,255,0,0.12)" : "rgba(255,255,255,0.04)"}" stroke="${lead ? LIME : "rgba(255,255,255,0.16)"}"/>
          <text x="28" y="${h / 2 + 18}" font-family="Clash Display" font-weight="600" font-size="54" fill="${LIME}">${n}</text>
          <text x="120" y="${h / 2 - 4}" font-family="Clash Display" font-weight="600" font-size="28" fill="#fff">${label}</text>
          <text x="120" y="${h / 2 + 28}" font-family="JetBrains Mono" font-size="15" fill="rgba(255,255,255,0.6)">${sub}</text>
        </g>`;
      })
      .join("")}
  </svg>`;
};

const motifs = {
  chart: `<svg viewBox="0 0 540 460" width="540" height="460">
    <rect x="10" y="20" width="520" height="400" rx="20" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.12)"/>
    ${[100, 180, 260, 340].map((y) => `<line x1="40" x2="500" y1="${y}" y2="${y}" stroke="rgba(255,255,255,0.07)"/>`).join("")}
    <polyline points="40,320 110,290 170,300 230,230 300,250 360,180 430,200 500,120" fill="none" stroke="#fff" stroke-width="7" stroke-linejoin="round" opacity="0.9"/>
    <polyline points="40,330 110,297 170,311 230,236 300,262 360,186 430,211 500,128" fill="none" stroke="${MUTED}" stroke-width="3" stroke-linejoin="round"/>
    <polyline points="40,340 110,325 170,330 230,300 300,305 360,275 430,280 500,250" fill="none" stroke="${LIME}" stroke-width="3" stroke-dasharray="10 9"/>
    ${chip(40, 44, "status: CLAIMED_DONE", { stroke: LIME, color: LIME })}
    <text x="40" y="400" font-family="JetBrains Mono" font-size="16" fill="${FAIL}">same series, drawn twice</text>
  </svg>`,

  wiring: `<svg viewBox="0 0 540 460" width="540" height="460">
    <defs><marker id="a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${LIME}"/></marker></defs>
    <path d="M150,100 C300,40 390,60 430,150" fill="none" stroke="${LIME}" stroke-width="3" marker-end="url(#a)"/>
    <path d="M450,230 C470,320 400,380 300,390" fill="none" stroke="${LIME}" stroke-width="3" marker-end="url(#a)"/>
    <path d="M210,390 C100,380 50,300 70,200" fill="none" stroke="${LIME}" stroke-width="3" marker-end="url(#a)"/>
    ${chip(20, 70, "Claude Code", { w: 200, size: 20 })}
    ${chip(330, 166, "Stop hook", { w: 190, size: 20, stroke: LIME, color: LIME })}
    ${chip(170, 370, "kane-cli", { w: 170, size: 20 })}
    ${chip(10, 150, "verdict", { w: 150, size: 18, stroke: "rgba(255,255,255,0.3)", color: MUTED })}
    <text x="190" y="250" font-family="Clash Display" font-weight="600" font-size="46" fill="#fff">done?</text>
    <text x="192" y="290" font-family="JetBrains Mono" font-size="16" fill="${MUTED}">prove it in a browser</text>
  </svg>`,

  prd: `<svg viewBox="0 0 540 460" width="540" height="460">
    <rect x="70" y="20" width="400" height="420" rx="18" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.16)"/>
    <text x="100" y="72" font-family="JetBrains Mono" font-size="18" fill="${MUTED}">PRD.md</text>
    <text x="100" y="118" font-family="JetBrains Mono" font-size="17" fill="#fff">## 3. Priority badge</text>
    ${[150, 180, 210].map((y, i) => `<rect x="100" y="${y}" width="${[320, 280, 300][i]}" height="10" rx="5" fill="rgba(255,255,255,0.14)"/>`).join("")}
    <text x="100" y="262" font-family="JetBrains Mono" font-size="16" fill="#fff">New tasks default to Medium.</text>
    <rect x="96" y="290" width="340" height="86" rx="12" fill="rgba(191,255,0,0.08)" stroke="${LIME}" stroke-width="2" stroke-dasharray="8 7"/>
    <text x="118" y="326" font-family="JetBrains Mono" font-size="16" fill="${LIME}">How does a task become</text>
    <text x="118" y="354" font-family="JetBrains Mono" font-size="16" fill="${LIME}">High or Low?  (unwritten)</text>
    <rect x="100" y="400" width="200" height="10" rx="5" fill="rgba(255,255,255,0.14)"/>
  </svg>`,

  nullresult: `<svg viewBox="0 0 540 460" width="540" height="460">
    ${["kane-gated", "baseline"]
      .map(
        (label, i) => `<g transform="translate(0,${40 + i * 190})">
      <text x="0" y="0" font-family="JetBrains Mono" font-size="17" fill="${MUTED}">${label}</text>
      <line x1="0" x2="520" y1="22" y2="22" stroke="rgba(255,255,255,0.1)"/>
      <rect x="0" y="40" width="250" height="64" rx="10" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.25)"/>
      <text x="18" y="80" font-family="JetBrains Mono" font-size="17" fill="#fff">10:00 to 11:00</text>
      <rect x="256" y="40" width="250" height="64" rx="10" fill="rgba(191,255,0,0.12)" stroke="${LIME}"/>
      <text x="274" y="80" font-family="JetBrains Mono" font-size="17" fill="${LIME}">11:00 to 12:00</text>
      <text x="0" y="140" font-family="JetBrains Mono" font-size="15" fill="${MUTED}">touching, not overlapping: allowed</text>
    </g>`,
      )
      .join("")}
    <text x="0" y="440" font-family="JetBrains Mono" font-size="19" fill="#fff">confirmed divergences: <tspan fill="${LIME}">0</tspan></text>
  </svg>`,

  verifier: `<svg viewBox="0 0 540 460" width="540" height="460">
    ${chip(30, 60, "status: failed", { w: 300, size: 22, stroke: FAIL, color: FAIL })}
    ${chip(60, 140, "verdict.confirmed: false", { w: 400, size: 22 })}
    ${chip(90, 220, "family: automation_bug", { w: 400, size: 22 })}
    ${chip(120, 300, "confidence: 0.88", { w: 300, size: 22, stroke: LIME, color: LIME })}
    <circle cx="430" cy="360" r="62" fill="none" stroke="#fff" stroke-width="10"/>
    <line x1="474" y1="404" x2="522" y2="452" stroke="#fff" stroke-width="14" stroke-linecap="round"/>
    <text x="410" y="378" font-family="Clash Display" font-weight="600" font-size="54" fill="${LIME}">?</text>
  </svg>`,

  strikes: `<svg viewBox="0 0 540 460" width="540" height="460">
    ${[0, 1, 2]
      .map(
        (i) => `<g transform="translate(${20 + i * 120},90)">
      <rect width="100" height="100" rx="16" fill="rgba(255,107,91,0.1)" stroke="${FAIL}" stroke-width="2"/>
      <path d="M32,32 L68,68 M68,32 L32,68" stroke="${FAIL}" stroke-width="8" stroke-linecap="round"/>
      <text x="22" y="134" font-family="JetBrains Mono" font-size="15" fill="${MUTED}">try ${i + 1}/3</text>
    </g>`,
      )
      .join("")}
    <path d="M190,260 C190,320 300,320 330,330" fill="none" stroke="${LIME}" stroke-width="3"/>
    <circle cx="410" cy="330" r="62" fill="rgba(167,139,250,0.14)" stroke="${HUMAN}" stroke-width="3"/>
    <circle cx="410" cy="310" r="17" fill="${HUMAN}"/>
    <path d="M378,360 C380,334 440,334 442,360" fill="${HUMAN}"/>
    ${chip(170, 404, "BLOCKED_NEEDS_HUMAN", { w: 320, size: 20, stroke: HUMAN, color: HUMAN })}
  </svg>`,

  phases: `<svg viewBox="0 0 540 460" width="540" height="460">
    ${["PRD tool", "Stop-hook gate", "12-phase loop"]
      .map((label, i) => {
        const y = 10 + i * 128;
        const on = i === 2;
        return `<g transform="translate(${20 + i * 40},${y})">
          <rect width="${300 + i * 60}" height="100" rx="16" fill="${on ? "rgba(191,255,0,0.12)" : "rgba(255,255,255,0.04)"}" stroke="${on ? LIME : "rgba(255,255,255,0.16)"}"/>
          <text x="22" y="40" font-family="JetBrains Mono" font-size="15" fill="${MUTED}">ERA ${i + 1}</text>
          <text x="22" y="76" font-family="Clash Display" font-weight="600" font-size="30" fill="${on ? LIME : "#fff"}">${label}</text>
        </g>`;
      })
      .join("")}
    ${Array.from({ length: 13 }, (_, i) => `<rect x="${118 + i * 28}" y="420" width="20" height="20" rx="4" fill="${LIME}" opacity="${0.35 + i * 0.05}"/>`).join("")}
    <text x="20" y="436" font-family="JetBrains Mono" font-size="15" fill="${MUTED}">P0..P12</text>
  </svg>`,

  graph: `<svg viewBox="0 0 540 460" width="540" height="460">
    ${[
      [120, 110, 250, 200], [250, 200, 400, 110], [250, 200, 400, 300], [250, 200, 130, 330],
      [400, 110, 480, 220], [400, 300, 480, 220], [130, 330, 260, 400], [260, 400, 400, 300],
    ]
      .map(([x1, y1, x2, y2]) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="rgba(255,255,255,0.22)" stroke-width="2"/>`)
      .join("")}
    <circle cx="250" cy="200" r="30" fill="${LIME}"/>
    <circle cx="120" cy="110" r="18" fill="#fff"/>
    <circle cx="400" cy="110" r="18" fill="#fff"/>
    <circle cx="400" cy="300" r="22" fill="none" stroke="${LIME}" stroke-width="4"/>
    <circle cx="480" cy="220" r="16" fill="${FAIL}"/>
    <circle cx="130" cy="330" r="18" fill="#fff"/>
    <circle cx="260" cy="400" r="16" fill="${FAIL}"/>
    ${chip(20, 20, "code · feature · claim", { size: 17, stroke: LIME, color: LIME })}
    ${chip(300, 400, "14 gaps", { w: 140, size: 17, stroke: FAIL, color: FAIL })}
  </svg>`,

};

/* ---------------------------------------------------------------- diagrams */

const diagramCss = `
  body { background: ${CREAM}; color: ${INK}; }
  .wrap { padding: 64px 72px; }
  .eyebrow { font-size: 16px; letter-spacing: 0.2em; text-transform: uppercase; color: #4B5563; font-weight: 700; }
  h1 { margin-top: 10px; font-size: 44px; line-height: 1.1; letter-spacing: -0.02em; font-weight: 600; }
  .sub { margin-top: 10px; font-size: 20px; color: #4B5563; max-width: 1200px; }
  .box { background: #fff; border: 1.5px solid rgba(7,9,15,0.14); border-radius: 16px; padding: 18px 20px; }
  .box h3 { font-family: "Clash Display"; font-size: 24px; font-weight: 600; }
  .box p { margin-top: 6px; font-size: 16px; color: #4B5563; line-height: 1.4; }
  .code { font-family: "JetBrains Mono"; font-size: 13.5px; background: #F3F4F6; border-radius: 6px; padding: 3px 7px; display: inline-block; margin-top: 8px; color: ${INK}; }
  .lime { background: ${LIME}; border-color: ${INK}; }
  .ink { background: ${INK}; color: #fff; border-color: ${INK}; }
  .ink p { color: #D1D5DB; }
  .fail { border-color: ${FAIL}; background: #FFF1EF; }
  .human { border-color: ${HUMAN}; background: #F4F0FF; }
  .warn { border-color: ${WARN}; background: #FFF7E6; }
  .arrow { font-family: "JetBrains Mono"; font-size: 30px; color: ${INK}; display: flex; align-items: center; justify-content: center; }
  .src { position: absolute; left: 72px; bottom: 28px; font-family: "JetBrains Mono"; font-size: 13px; color: #6B7280; }
`;

const diagram = (width, height, body) =>
  page(width, height, `<div class="wrap">${body}</div>`, diagramCss + "body{position:relative}");

const loopDiagram = diagram(
  1600,
  860,
  `<div class="eyebrow mono">GuardianKane &middot; the loop</div>
  <h1 class="display">Where Kane CLI sits inside a Claude Code session</h1>
  <div class="sub">Before any code: the PRD is grilled and every use case is reviewed. After every claim of done: the Stop hook makes Kane check it in a real browser.</div>
  <div style="display:grid;grid-template-columns:1fr 40px 1fr 40px 1fr 40px 1fr;gap:10px;margin-top:40px;align-items:stretch">
    <div class="box"><h3>PRD.md</h3><p>The written spec. Nothing else is trusted as a requirement.</p></div>
    <div class="arrow">&rarr;</div>
    <div class="box"><h3>Grilling</h3><p>Q&amp;A over the PRD. Every ambiguity becomes a decision.</p><span class="code">kane-cli context extract</span></div>
    <div class="arrow">&rarr;</div>
    <div class="box lime"><h3>Review gate</h3><p style="color:${INK}">Each use case and test is approved before it counts.</p><span class="code">context review --approve</span></div>
    <div class="arrow">&rarr;</div>
    <div class="box"><h3>task-tracker.md</h3><p>Tasks, PRD line ranges, generated tests, state.</p><span class="code">design tests</span></div>
  </div>
  <div style="display:flex;justify-content:flex-end;padding-right:150px"><div class="arrow" style="height:44px">&darr;</div></div>
  <div style="display:grid;grid-template-columns:1fr 40px 1.25fr 40px 1fr;gap:10px;align-items:stretch">
    <div class="box" style="display:flex;flex-direction:column;gap:12px">
      <div><h3 style="color:#1f7a3a">KANE_VERIFIED</h3><p>Scripted test and sweep both clean. Next task.</p></div>
      <div class="fail box" style="padding:12px 14px"><h3 style="font-size:20px">KANE_FAILED</h3><p>Denied with the reason. Back to IN_PROGRESS.</p></div>
      <div class="human box" style="padding:12px 14px"><h3 style="font-size:20px">BLOCKED_NEEDS_HUMAN</h3><p>Third failure. Stop guessing, ask a person.</p></div>
    </div>
    <div class="arrow">&larr;</div>
    <div class="box ink"><h3>Stop hook</h3><p>Fires every time Claude tries to end its turn with a task at CLAIMED_DONE.</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:16px">
        <div class="box" style="background:#11151f;border-color:#2a3040"><h3 style="font-size:19px;color:${LIME}">1. Scripted replay</h3><p>The generated test, exactly as authored.</p><span class="code" style="background:#1d2230;color:#fff">kane-cli testmd run</span></div>
        <div class="box" style="background:#11151f;border-color:#2a3040"><h3 style="font-size:19px;color:${LIME}">2. Defect sweep</h3><p>Unscripted look at the live page against the PRD section.</p><span class="code" style="background:#1d2230;color:#fff">kane-cli run --bug-detection stop</span></div>
      </div>
    </div>
    <div class="arrow">&larr;</div>
    <div class="box"><h3>Claude implements</h3><p>Writes the code, marks the task CLAIMED_DONE, tries to stop.</p><span class="code">state: CLAIMED_DONE</span></div>
  </div>
  <div class="src">Source: adventures-with-kane README.md and lib/kane.js</div>`,
);

const erasDiagram = diagram(
  1600,
  600,
  `<div class="eyebrow mono">GuardianKane &middot; how it got here</div>
  <h1 class="display">Three shapes, one repo</h1>
  <div style="display:grid;grid-template-columns:1fr 1.15fr 1.6fr;gap:20px;margin-top:40px">
    <div class="box"><div class="mono" style="font-size:14px;color:#6B7280">ERA 1 &middot; AUG 20, MORNING</div><h3 style="margin-top:6px">A PRD tool</h3>
      <p>PRD in, task-tracker.md out, through a Claude Code skill and a thin kane-cli wrapper. No verification at all.</p>
      <span class="code">f2a3c59</span> <span class="code">664259f</span> <span class="code">cea4ae2</span> <span class="code">bd19e0d</span></div>
    <div class="box lime"><div class="mono" style="font-size:14px">ERA 2 &middot; AUG 20 TO 21</div><h3 style="margin-top:6px">The Stop-hook gate</h3>
      <p style="color:${INK}">A Stop hook that refuses to let Claude finish until Kane replays the task in a real browser. Bug memory, one-command install, four paired A/B experiments.</p>
      <span class="code">896bc57</span> <span class="code">b05fc4a</span></div>
    <div class="box ink"><div class="mono" style="font-size:14px;color:${LIME}">ERA 3 &middot; AUG 26 ONWARD</div><h3 style="margin-top:6px">A phased, reviewed loop</h3>
      <p>Rebuilt across twelve numbered phases, each with its own design spec and plan:</p>
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px">
        ${[
          "0 review gate",
          "1 per-AC evidence",
          "2 phase model",
          "3 context injection",
          "4 scope guard",
          "5 gaps panel",
          "6 review card",
          "7 reconcile sync",
          "8 trace",
          "9 stuck tasks",
          "10 file lock",
          "11 security gate",
          "12 browser review",
        ]
          .map((p) => `<span class="mono" style="font-size:13px;border:1px solid #2a3040;border-radius:999px;padding:5px 10px;color:#fff">${p}</span>`)
          .join("")}
      </div></div>
  </div>
  <div class="src">Source: adventures-with-kane JOURNEY.md, commit hashes as recorded there</div>`,
);

const grillDiagram = diagram(
  1600,
  650,
  `<div class="eyebrow mono">Experiment 1 &middot; todo app</div>
  <h1 class="display">One unwritten requirement, two builds</h1>
  <div style="display:grid;grid-template-columns:1fr 40px 1fr 40px 1fr;gap:10px;margin-top:40px">
    <div class="box"><div class="mono" style="font-size:14px;color:#6B7280">PRD.md, section 3</div><h3 style="margin-top:6px">Default priority: Medium</h3><p>It never says how a task becomes High or Low.</p></div>
    <div class="arrow">&rarr;</div>
    <div class="box lime"><div class="mono" style="font-size:14px">Grilling asks</div><h3 style="margin-top:6px">"How do you set High/Low priority?"</h3><p style="color:${INK}">Resolved into a testable convention: a <b>!high</b> / <b>!low</b> title suffix, tested under task T5.</p></div>
    <div class="arrow">&rarr;</div>
    <div class="box"><div class="mono" style="font-size:14px;color:#6B7280">Kane generates</div><h3 style="margin-top:6px">A test for explicit priority</h3><p>Gates T5 until the build handles it.</p></div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:28px">
    <div class="box" style="border-color:#1f7a3a"><div class="mono" style="font-size:14px;color:#1f7a3a">todo-kane</div><h3 style="margin-top:6px">KANE_VERIFIED</h3><p>Built through the loop, so T5 existed and had to pass.</p></div>
    <div class="box fail"><div class="mono" style="font-size:14px;color:#b03636">todo-baseline &middot; confirmed: true &middot; severity: major</div><h3 style="margin-top:6px">"The high-priority task is displayed with a MEDIUM badge instead of High."</h3><p>No way to set a non-default priority exists anywhere in the app.</p></div>
  </div>
  <div class="src">Source: adventures-with-kane docs/SCOREBOARD.md</div>`,
);

const scoreboardDiagram = diagram(
  1600,
  700,
  `<div class="eyebrow mono">Four paired experiments &middot; same PRD, two builds</div>
  <h1 class="display">The gap grew with the density of the PRD</h1>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:18px;margin-top:40px">
    ${[
      ["01", "Todo app", "Low", "Baseline passed 5 of 6 replayed checks (one in substance). It failed the one nobody wrote down: explicit High/Low priority.", ""],
      ["02", "Room booking", "Medium", "No confirmed divergence. Both got the touching-interval trap right. Baseline completed 6 of 12 tests before kane-cli hangs ran out the clock.", "lime"],
      ["03", "Booking studio", "High", "Gated build: 8 of 10 requirement groups verified. Baseline header sat flush to the viewport edge; the PRD says 16px padding.", ""],
      ["04", "ORBITAL", "Very high", "Baseline: a doubled performance chart, a two-column alert list the PRD never asked for, uneven panel spacing.", "ink"],
    ]
      .map(
        ([n, name, density, text, cls]) => `<div class="box ${cls}" style="min-height:340px;display:flex;flex-direction:column">
        <div class="display" style="font-size:56px;font-weight:600;${cls === "ink" ? `color:${LIME}` : ""}">${n}</div>
        <h3 style="margin-top:8px">${name}</h3>
        <div class="mono" style="font-size:13px;margin-top:6px;${cls === "ink" ? "color:#D1D5DB" : "color:#6B7280"}">PRD density: ${density}</div>
        <p style="margin-top:18px;font-size:17px;${cls === "lime" ? `color:${INK}` : ""}">${text}</p>
      </div>`,
      )
      .join("")}
  </div>
  <div class="src">Source: adventures-with-kane docs/SCOREBOARD.md and OBSERVATIONS-AND-REPORTINGS.md</div>`,
);

const TRAIL = [
  ["T0", "Scaffold", "infra", "2 infra errors, stale reset, sweep clean"],
  ["T1", "Navigation", "retry", "Assertion timing mismatch, passed on retry"],
  ["T2", "Performance chart", "override", "3 of 3 failed, triage: automation_bug"],
  ["T3", "Allocation donut", "override", "Test script missed a hover step"],
  ["T4", "Holdings table", "override", "Stale replay baselines, re-recorded"],
  ["T5", "Risk monitor", "clean", "2 of 2 first try"],
  ["T6", "Market rows", "clean", "2 of 2 first try"],
  ["T7", "Alerts", "caught", "Tests passed, sweep flagged the panel. 43 min of fixes, then clean."],
  ["T8", "Activity feed", "clean", "2 of 2 first try"],
  ["T9", "Export flow", "override", "Batch marked failed, all members passed"],
  ["T10", "Layout", "override", "Final re-check step stalled"],
  ["T11", "Profile popover", "override", "Re-verification loop oscillated"],
  ["T12", "Global search", "clean", "Build complete"],
];

const TRAIL_STYLE = {
  clean: ["#EAF7EE", "#1f7a3a", "clean"],
  retry: ["#EAF7EE", "#1f7a3a", "fixed on retry"],
  infra: ["#FFF7E6", "#8a5a00", "infra recovered"],
  override: ["#F4F0FF", "#5b3fb0", "human override"],
  caught: [LIME, INK, "sweep caught it"],
};

const trailDiagram = diagram(
  1600,
  780,
  `<div class="eyebrow mono">ORBITAL &middot; kane-activity.log, task by task</div>
  <h1 class="display">12 of 12 verified. One sweep catch. Six overrides.</h1>
  <div class="sub">What the Stop hook's own append-only log recorded over roughly eight hours of wall clock. Every override came with kane-cli's bug-triage verdict attached.</div>
  <div style="display:grid;grid-template-columns:repeat(13,1fr);gap:8px;margin-top:36px">
    ${TRAIL.map(([id, name, kind]) => {
      const [bg, fg] = TRAIL_STYLE[kind];
      return `<div style="background:${bg};border:1.5px solid ${kind === "caught" ? INK : "rgba(7,9,15,0.1)"};border-radius:12px;height:150px;padding:12px 10px;display:flex;flex-direction:column;justify-content:space-between">
        <div class="display" style="font-size:28px;font-weight:600;color:${fg}">${id}</div>
        <div style="font-size:13.5px;line-height:1.25;color:${fg};font-weight:600">${name}</div>
      </div>`;
    }).join("")}
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;grid-template-rows:repeat(7,auto);grid-auto-flow:column;gap:10px 28px;margin-top:28px">
    ${TRAIL.map(([id, , kind, note]) => {
      const [bg, fg, label] = TRAIL_STYLE[kind];
      return `<div style="display:flex;gap:12px;align-items:baseline;font-size:16.5px">
        <span class="mono" style="font-weight:700;width:38px">${id}</span>
        <span class="mono" style="font-size:12px;background:${bg};color:${fg};border-radius:999px;padding:3px 9px;white-space:nowrap">${label}</span>
        <span style="color:#374151">${note}</span></div>`;
    }).join("")}
  </div>
  <div class="src">Source: orbital-kane/.testmuai/kane-activity.log, transcribed in docs/demo/kane-audit-trail.html</div>`,
);

const rereadDiagram = diagram(
  1600,
  760,
  `<div class="eyebrow mono">Re-reading my own evidence</div>
  <h1 class="display">What my write-up said vs. what the log said</h1>
  <div style="display:grid;grid-template-columns:110px 1fr 1fr;gap:12px;margin-top:36px;font-size:18px">
    <div></div>
    <div class="mono" style="font-size:14px;letter-spacing:0.14em;color:#6B7280">MY BUILD NOTES</div>
    <div class="mono" style="font-size:14px;letter-spacing:0.14em;color:#6B7280">THE RAW ACTIVITY LOG</div>
    ${[
      ["T2", "The sweep caught a real chart lock-state defect.", "3 scripted failures, each on a different step. Triage: confirmed:false, automation_bug, 0.76 to 0.93. Human override."],
      ["T3", "Sweep-caught issue on the allocation donut.", "The authored test never hovered the segment before asserting the hover state. Triage: automation_bug, 0.9."],
      ["T4", "Sweep-caught issue on the holdings table.", "A legitimate popover fix invalidated recorded replay baselines. Re-recorded with --author: 8 of 8 pass."],
      ["T9", "Export flow raced its own success toast.", "All four export toasts were confirmed true. A redundant final step stalled. Triage: agent_misstep, 0.88."],
    ]
      .map(
        ([id, said, log]) => `<div class="display" style="font-size:34px;font-weight:600;padding-top:14px">${id}</div>
      <div class="box fail" style="text-decoration:line-through;text-decoration-color:rgba(176,54,54,0.5)"><p style="color:${INK};font-size:18px;margin:0">${said}</p></div>
      <div class="box"><p style="color:${INK};font-size:18px;margin:0">${log}</p></div>`,
      )
      .join("")}
  </div>
  <div class="src">Source: OBSERVATIONS-AND-REPORTINGS.md section 2.6 against orbital-kane/.testmuai/kane-activity.log</div>`,
);

const stateDiagram = diagram(
  1600,
  620,
  `<div class="eyebrow mono">The state machine the Stop hook enforces</div>
  <h1 class="display">No path from "proven broken" back to "done"</h1>
  <div style="display:grid;grid-template-columns:1fr 36px 1fr 36px 1fr 36px 1.1fr 36px 1fr;gap:8px;margin-top:48px;align-items:center">
    <div class="box"><h3 style="font-size:20px">PLANNED</h3></div><div class="arrow">&rarr;</div>
    <div class="box"><h3 style="font-size:20px">IN_PROGRESS</h3></div><div class="arrow">&rarr;</div>
    <div class="box"><h3 style="font-size:20px">CLAIMED_DONE</h3><p>Claude says it is finished.</p></div><div class="arrow">&rarr;</div>
    <div class="box ink"><h3 style="font-size:20px">KANE_VERIFYING</h3><p>Replay, then sweep. Stale after 5 min: reset.</p></div><div class="arrow">&rarr;</div>
    <div class="box lime"><h3 style="font-size:20px">KANE_VERIFIED</h3><p style="color:${INK}">Both clean.</p></div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:18px;margin-top:40px">
    <div class="box fail"><h3>KANE_FAILED</h3><p>Attempts under 3. The denial carries the failure summary and any bug-memory match. Always routes back to IN_PROGRESS: the agent has to touch the code again.</p></div>
    <div class="box human"><h3>BLOCKED_NEEDS_HUMAN</h3><p>The third consecutive failure, three secret-scan failures, or one case of test tampering (a passing test that lost an @verifies assertion). The hook stops asking the agent to guess.</p></div>
    <div class="box warn"><h3>State untouched</h3><p>kane-cli exits 2 or 3 (infra, auth, timeout). The hook allows the stop with a warning and never counts it against the app.</p></div>
  </div>
  <div class="src">Source: .claude/hooks/guardian-kane-stop.js (MAX_ATTEMPTS = 3, STALE_MS = 5 min) and README state machine</div>`,
);

const ownershipDiagram = diagram(
  1600,
  700,
  `<div class="eyebrow mono">GuardianKane &middot; who owns what</div>
  <h1 class="display">Who owns what after the rebuild</h1>
  <div class="sub">The Kane-native plan narrowed GuardianKane to orchestration. Most of the twelve phases wired up data that Kane CLI or my own hooks already produced.</div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:32px">
    <div class="box ink"><div class="mono" style="font-size:14px;color:${LIME}">KANE CLI OWNS</div>
      <p style="margin-top:10px;font-size:17px">The claim graph, review, coverage and gaps, reconcile, and the recorded reasoning behind every generated test.</p>
      <span class="code" style="background:#1d2230;color:#fff">context review --approve</span> <span class="code" style="background:#1d2230;color:#fff">cover gaps --json</span> <span class="code" style="background:#1d2230;color:#fff">maintain reconcile --plan</span> <span class="code" style="background:#1d2230;color:#fff">context explain</span></div>
    <div class="box lime"><div class="mono" style="font-size:14px">GUARDIANKANE OWNS</div>
      <p style="margin-top:10px;font-size:17px;color:${INK}">Tasks, phases, the Stop-hook gate, the file-touch record, and the dashboard that makes all of it visible.</p>
      <span class="code">task-tracker.md</span> <span class="code">Stop hook</span> <span class="code">PostToolUse hook</span> <span class="code">dashboard</span></div>
  </div>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:22px">
    <div class="box"><h3>Gate</h3><p>0 review gate &middot; 1 per-AC evidence &middot; 11 secret scan</p></div>
    <div class="box"><h3>Knowledge</h3><p>3 context injection &middot; 7 reconcile sync</p></div>
    <div class="box"><h3>Guardrails</h3><p>2 phase model &middot; 4 scope guard &middot; 10 file lock</p></div>
    <div class="box"><h3>Visibility</h3><p>5 gaps &middot; 6 review card &middot; 8 trace &middot; 9 stuck tasks &middot; 12 browser review</p></div>
  </div>
  <div style="display:flex;gap:14px;margin-top:22px;align-items:center">
    <div class="mono" style="font-size:15px;color:#4B5563">Unit tests, as recorded in the phase specs and a fresh run:</div>
    <span class="code" style="font-size:16px">241 after Phase 1</span><span class="arrow" style="font-size:22px">&rarr;</span>
    <span class="code" style="font-size:16px">387 after Phase 11</span><span class="arrow" style="font-size:22px">&rarr;</span>
    <span class="code lime" style="font-size:16px;background:${LIME}">460 of 460 today</span>
  </div>
  <div class="src">Source: adventures-with-kane JOURNEY.md, docs/superpowers specs, vitest run on the repo</div>`,
);

const bridgeDiagram = diagram(
  1600,
  720,
  `<div class="eyebrow mono">GuardianKane &middot; the chat bridge</div>
  <h1 class="display">How the dashboard talks to a live Claude Code session</h1>
  <div class="sub">The dashboard is a child process of the session. Messages go in through an undocumented local socket; replies come back from the Stop hook, not from the agent remembering to answer.</div>
  <div style="display:grid;grid-template-columns:1fr 40px 1fr 40px 1fr;gap:10px;margin-top:36px;align-items:stretch">
    <div class="box"><h3>Dashboard chat</h3><p>You type into "Ask GuardianKane". The server writes a pending-reply marker.</p><span class="code">/api/chat/send</span> <span class="code">chat-pending.json</span></div>
    <div class="arrow">&rarr;</div>
    <div class="box ink"><h3>Messaging socket</h3><p>An auth line with the session token, then a user message, written to the socket the session exposes to its children.</p><span class="code" style="background:#1d2230;color:#fff">CLAUDE_CODE_MESSAGING_SOCKET</span></div>
    <div class="arrow">&rarr;</div>
    <div class="box"><h3>Claude Code</h3><p>Reads it as a user turn. Works, claims done, tries to stop.</p></div>
  </div>
  <div style="display:flex;justify-content:flex-end;padding-right:150px"><div class="arrow" style="height:44px">&darr;</div></div>
  <div style="display:grid;grid-template-columns:1fr 40px 1fr 40px 1fr;gap:10px;align-items:stretch">
    <div class="box"><h3>Four tabs</h3><p>Code graph, Memory graph, PRD graph, Kane activity. Panels poll JSON written by the hooks and the graph build.</p><span class="code">graph-status.json</span> <span class="code">scope-status.json</span></div>
    <div class="arrow">&larr;</div>
    <div class="box lime"><h3>Reply posted</h3><p style="color:${INK}">If a marker is pending, the hook posts the verdict text it already computed.</p><span class="code">/api/chat/reply</span></div>
    <div class="arrow">&larr;</div>
    <div class="box ink"><h3>Stop hook</h3><p>Runs the gate as always, then checks for a pending chat marker.</p><span class="code" style="background:#1d2230;color:#fff">lib/dashboard-reply.js</span></div>
  </div>
  <div class="src">Source: adventures-with-kane dashboard/lib/agent-bridge.js, commit b2356c4</div>`,
);

const s1Tiles = seriesTiles([
  ["01", "The broken chart", "the gate, and why it exists"],
  ["02", "The unasked question", "four experiments, one pattern"],
  ["03", "Who checks the checker", "the verifier, the log, the cap"],
]);
const s2Tiles = seriesTiles([
  ["01", "The rebuild", "PRD tool, gate, twelve phases"],
  ["02", "The visual layer", "graphs, activity, live chat"],
]);

export const graphics = [
  { name: "cover-s1", width: 1600, height: 672, html: cover({ part: 0, title: "Your agent might <em>actually lie</em> to you", motif: s1Tiles }) },
  { name: "cover-s1-1", width: 1600, height: 672, html: cover({ part: 1, title: "My agent shipped a <em>broken chart</em> and told me it was done", motif: motifs.chart }) },
  { name: "cover-s1-2", width: 1600, height: 672, html: cover({ part: 2, title: "The requirement <em>nobody wrote</em>", motif: motifs.prd }) },
  { name: "cover-s1-3", width: 1600, height: 672, html: cover({ part: 3, title: "Who verifies <em>the verifier?</em>", motif: motifs.verifier }) },
  { name: "cover-s2", width: 1600, height: 672, html: cover({ series: S2, part: 0, title: "GuardianKane: it will not let your agent <em>lie</em>", motif: s2Tiles }) },
  { name: "cover-s2-1", width: 1600, height: 672, html: cover({ series: S2, part: 1, title: "The second build was mostly <em>wiring</em>", motif: motifs.phases }) },
  { name: "cover-s2-2", width: 1600, height: 672, html: cover({ series: S2, part: 2, title: "Making verification <em>visible</em>", motif: motifs.graph }) },
  { name: "x-thread-1", width: 1600, height: 900, html: cover({ part: 0, height: 900, title: "Your agent might <em>actually lie</em> to you", motif: s1Tiles }) },
  { name: "x-thread-2", width: 1600, height: 900, html: cover({ series: S2, part: 0, height: 900, title: "From a Stop hook to a <em>twelve-phase</em> loop", motif: motifs.phases }) },
  { name: "diagram-ownership", width: 1600, height: 700, html: ownershipDiagram },
  { name: "diagram-bridge", width: 1600, height: 720, html: bridgeDiagram },
  { name: "diagram-loop", width: 1600, height: 860, html: loopDiagram },
  { name: "diagram-eras", width: 1600, height: 600, html: erasDiagram },
  { name: "diagram-grilling", width: 1600, height: 650, html: grillDiagram },
  { name: "diagram-scoreboard", width: 1600, height: 700, html: scoreboardDiagram },
  { name: "diagram-orbital-trail", width: 1600, height: 780, html: trailDiagram },
  { name: "diagram-reread", width: 1600, height: 760, html: rereadDiagram },
  { name: "diagram-state-machine", width: 1600, height: 620, html: stateDiagram },
];
