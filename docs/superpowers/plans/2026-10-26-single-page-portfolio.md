# Single-page Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Studio and Index views with one page at `/` (hero, About, Work, Writing link, Contact, personal door), project deep dives as a sheet at `/work/<slug>`, and the balloon personal side.

**Architecture:** `PlainView` becomes `HomeView` at `/`; `/work/[slug]` renders the same view with `initialSlug` so the sheet is open on first paint. The sheet is a client component that pushes and pops history. The balloon is a client component ported from the prototype, mounted lazily when the door opens. Every other route is deleted and redirected through `public/_redirects`.

**Tech Stack:** Next.js 15 App Router, React 19 rc, plain CSS scoped under `.pv`, vitest, Cloudinary, Cloudflare Pages via next-on-pages.

**Spec:** `docs/superpowers/specs/2026-10-26-single-page-portfolio-design.md`

## Global Constraints

- No em dash or en dash anywhere; `grep -rn $'—\|–' src/ scripts/ *.md` returns nothing.
- Evidence rule: every project number and claim comes from its README, repo, or live site.
- Gates: dash grep, `npm run lint`, `npm test`, `npm run build`, `npx @cloudflare/next-on-pages`, 390px with no horizontal overflow, every linked live URL returns 200.
- Commit and push only on Abhinav's ok. Trailer: `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Respect `prefers-reduced-motion` in the sheet and the balloon.
- Project order: sieve, voluntas, dart, loom, guardiankane, agentops, zidd, pods, veil, kredio, openassets, payzoll, tesseract.

## Review Focus

- A visitor lands directly on `/work/<slug>` and presses Back or Esc: the sheet closes to `/` without leaving the site.
- An unknown `/work/<slug>` returns 404, not an empty sheet.
- At 390px the sheet, embeds, and balloon polaroids never overflow horizontally.
- A project with no media (no video, screenshots, or embed) still renders a complete sheet.
- Trip media that fails to load never leaves the gallery blank (crossfade only after load).

---

### Task 1: Content: three new projects, order, embeds, dev.to links

**Files:**
- Modify: `src/content/data.json` (projects array), `src/content/projects.ts`
- Test: `src/content/projects.test.ts`

**Interfaces:**
- Produces: `Project.embed?: { src: string; title: string; ratio?: string }`, `Project.posts?: { title: string; url: string }[]`, `PROJECT_ORDER` honored by array order in data.json, `DEVTO_URL = "https://dev.to/abhinav_pangaria"` exported from `projects.ts`.

- [ ] Test: `orders the newest work first` asserts the first seven slugs equal `["sieve","voluntas","dart","loom","guardiankane","agentops","zidd"]`; `embeds and links are absolute https` for every `embed.src` (allowing `/embeds/` paths), `liveUrl`, `githubUrl`, `presentationUrl`; `guardiankane lists its five dev.to posts`.
- [ ] Run `npx vitest run src/content/projects.test.ts`: FAIL.
- [ ] Add sieve, voluntas, dart entries (metrics from the spec table), reorder, re-index `index` as two-digit order, add `posts` to guardiankane from the five dev.to URLs, add `embed` for sieve (live site), voluntas (presentation), dart (`/embeds/dart/index.html`). Covers: headless screenshots uploaded to `portfolio/projects/<slug>`.
- [ ] Run tests: PASS. Commit.

### Task 2: Dart embed copy

**Files:**
- Create: `public/embeds/dart/*` copied from `~/Documents/dart-application/site/`

- [ ] Copy the site; delete the Application tab button and `#v-application` section; move the forge canvas block into `#v-findings`; rewrite Dart-addressed brand line, "Why this matters for Dart", meta description, footer; reframe Stage 2 as "What I'd do next".
- [ ] Verify: `grep -n "application\|for Dart" public/embeds/dart/index.html` shows no application tab and no Dart-addressed copy; the page loads in a headless browser with the forge animating and no console errors.
- [ ] Commit.

### Task 3: Home view and project sheet

**Files:**
- Create: `src/components/home/HomeView.tsx` (from `PlainView.tsx`), `src/components/home/ProjectSheet.tsx`, `src/components/home/home.css` (from `plain.css`), move `scenes.ts`
- Modify: `src/app/page.tsx` (new), `src/app/work/[slug]/page.tsx` (new)

**Interfaces:**
- Produces: `HomeView({ site, projects, initialSlug?: string })`; `ProjectSheet({ project, onClose })`; `sceneTrip(sceneKey: string): string` (trip location prefix) exported from `scenes.ts`.

- [ ] Sections: hero, 01 About, 02 Work (first seven as large rows, rest compact with hover image), 03 Writing (one line plus `DEVTO_URL`), 04 Contact footer, 05 door band. Nav: Work, About, Writing, Contact.
- [ ] Opening a row calls `history.pushState({sheet:slug}, "", "/work/slug")`; `popstate` and Esc close; landing with `initialSlug` closing uses `history.replaceState` to `/`. Body scroll locks while open; scroll position restored.
- [ ] Sheet order: title and links, primary media (embed iframe lazy with "Open full site", else video, else screenshots), description, metrics, stack, posts, secondary media.
- [ ] `generateStaticParams` over projects, `dynamicParams = false`, metadata and JSON-LD per project as today.
- [ ] Verify in a headless browser at 1440 and 390: open and close each kind of sheet, no horizontal overflow.

### Task 4: Balloon personal side

**Files:**
- Create: `src/components/home/Balloon.tsx`, `src/components/home/balloon.css`

**Interfaces:**
- Consumes: `travels` from data.json, `sceneTrip`, current scene's `foot` palette.
- Produces: `Balloon({ trips, lead, palette, kidSprite, onClose })`.

- [ ] Port the prototype mechanics faithfully (door hop, blur and wipe, rise, pendulum polaroids, threads canvas, wheel and touch lift, FLIP fly-out gallery with keys, sink on Back to work). Lead trip in the middle slot. Fix 390px overlap. Reduced motion: no rise animation, static polaroids.
- [ ] Verify headless at 1440 and 390: open, click a polaroid, next, Esc, Back to work; screenshots show no overlap.

### Task 5: Remove old routes, redirects, SEO, docs

**Files:**
- Delete: `src/app/(studio)`, `src/app/plain`, `src/app/api`, `src/app/llms-full.txt`, unused components, `episodes.ts`, `topics.ts`, `topics.json`, `series.ts` consumers that break, `ViewChooser.tsx` and their tests
- Create: `public/_redirects`
- Modify: `src/content/seo.ts`, `seo.test.ts`, `site.test.ts`, `src/app/layout.tsx`, `CLAUDE.md`

- [ ] Tests: sitemap is exactly `/` plus every `/work/<slug>`; llms.txt links every project and the dev.to account; `_redirects` maps each of the five dispatch slugs to its dev.to URL and every old top-level path to `/`.
- [ ] Implement, keep `dispatches.ts`, its test, markdown, and `sync-devto.mjs`.
- [ ] Gates from Global Constraints. Report to Abhinav; commit only on his ok.
