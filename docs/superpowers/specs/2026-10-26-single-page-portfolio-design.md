# Single-page portfolio: design

Date: 2026-10-26. Status: ready for Abhinav's review.

## Intent

A hiring engineer should be able to scan the site in one to two minutes and come away knowing
what Abhinav builds, how he builds it, and where the source and live links are. Once the
professional part ends, a visitor who wants to can open a personal side that shows he has a
life and a personality outside tech, and that he would be good to work with.

The look is the current Index view (`/plain`): painted scene hero, Instrument Serif headings
with italic second lines, section tones that ease as you scroll, and the pixel footer. Abhinav
called that design good and everything else on the site not right for a technical audience.
The target feel is minimal, calm, high end, and impressive, with polished scroll motion.

## Goals

- One page. Sections: hero, About, Work, Writing (a link out), Contact footer, then the
  personal door.
- Work handles any number of projects. Each project opens into a deep dive that shows
  everything the project has.
- Add three new projects: sieve, Voluntas, and the Dart research.
- Projects in this order, newest first: sieve, Voluntas, Dart, Loom, Guardian Kane, AgentOps,
  Zidd, then the rest in their current order (Pods, Veil, Kredio, OpenAssets, Payzoll,
  Tesseract).
- The personal side is the balloon experience from the approved prototype (see below).

## Non-goals

- No Journey section and no timeline.
- No on-site writing pages. Writing is one link to `https://dev.to/abhinav_pangaria`.
  Canonical URLs are no longer used, so dropping the dispatch pages is fine.
- No Studio view, no view chooser, no 3D hero.

## Anti-goals (a failure even if it works)

- Every project rendered as the same card. The deep dive adapts to what each project has.
- Anything that reads busy, gimmicky, or templated on the professional side. The motion
  should feel smooth and expensive, not loud.
- Invented claims. Every number and statement on a project comes from its README, repo, or
  live site (CLAUDE.md evidence rule). If there is no artifact, leave it out.
- Any em dash or en dash anywhere (CLAUDE.md writing rule).

## Constraints

- Next.js 15 App Router on Cloudflare Pages through `@cloudflare/next-on-pages`. The build
  must pass `npx @cloudflare/next-on-pages` locally. Fonts are self-hosted in `src/app/fonts`.
- Gates before any push: dash grep clean, `npm run lint`, `npm test`, `npm run build`, mobile
  at 390px with no horizontal overflow, every live URL returns 200.
- Commit and push only on Abhinav's ok. Commit trailer per the session's attribution rule.
- `node_modules` is currently missing; run `npm install` first.
- Images go to Cloudinary through `node scripts/upload-image.mjs <folder> <files>` (folder
  `portfolio/projects/<slug>`), then are referenced by delivery URL.

## Decided with Abhinav

### Page

- Built from the existing `PlainView` and `plain.css`, which become the home page at `/`.
- Sections: hero (painted scene, unchanged behavior), 01 About, 02 Work, 03 Writing (a short
  line plus the dev.to link), 04 Contact footer with the pixel character, then the door.
- Journey is removed.

### Projects

- Ordered as listed under Goals.
- No fixed template. Whatever a project has gets shown: a video if it has one, screenshots if
  it has them, a live site or interactive embed if it has one, source links always when the
  repo is public.

The three new projects:

| Project | What it is (from its README) | Links |
|---|---|---|
| sieve (slug `sieve`) | From-scratch Rust vector search engine after Exa's described architecture. 113.5M passages on one 24 GB laptop at R@10 0.909, 4.8 ms p50; 1B vectors at 420 QPS. | Results site `https://18abhinav07.github.io/A-Game-Of-Vectors/`, source `https://github.com/18Abhinav07/A-Game-Of-Vectors` |
| Voluntas | Rust order-book collector for Kalshi and Polymarket. About 550k tokens at 41k to 43k updates/s; 118.2M snapshots replayed, 0 mismatches. | Presentation `https://18abhinav07.github.io/Voluntas-Challenge/`, source `https://github.com/18Abhinav07/Voluntas-Challenge` |
| Dart research | Local inference vs. the browser compositor. Capping llama.cpp prefill batch at 64 takes a GPU-heavy page from 64% to 1.3% dropped frames for +9 to 11% TTFT. | Source `https://github.com/18Abhinav07/DiggingOnDart` |

Source repos are at `~/Documents/exa`, `~/Documents/Voluntas-Challenge`,
`~/Documents/dart-application`. Read their READMEs and docs for the deep-dive copy and metrics.

sieve is titled "sieve" only; Exa is not in its title or tagline, and its URL is
`/work/sieve`. (Claude's call: the body credits the architecture once, as the README does,
because claiming it unattributed would be wrong.)

### Dart deep dive

The Dart findings site (`~/Documents/dart-application/site/`, deployed at
`prefill-and-the-frame.pages.dev`) is brought into the portfolio so the UI runs inside the
project deep dive. The Application tab and its content are removed, and the copy is made neutral research
(decided with Abhinav): the "for Dart" brand line, the "Why this matters for Dart" block,
the Dart-addressed meta description and footer line are rewritten or removed. Stage 2 stays,
reframed as "what I'd do next". "Open full site" points to the cleaned copy hosted in the
portfolio, not to `prefill-and-the-frame.pages.dev`, and that separate deployment is not
touched. The pixel-art forge
animation (`forge.js`, Abhinav hammering a Chromium block into a Dart window) currently lives
on the Application tab; keep it and move it into the findings view.

### Personal side (approved prototype)

The prototype is at `docs/superpowers/specs/assets/2026-10-26-balloon-prototype.html`
(one self-contained file; open it in a browser). Abhinav called it perfect. Port it
faithfully:

- A band after the footer: "06 · Outside the terminal" with a "Come along" control.
- Clicking it: the footer pixel character hops out of frame, the page blurs and sinks, the
  sky wipes up, and a hot air balloon rises from the bottom with the pixel character in the
  basket.
- Five polaroids hang from the basket on threads, one per trip (Dawki, Shillong, Goa,
  Champawat, Mawsynram), each playing its video cover muted. They behave as damped
  pendulums, react to the balloon's motion and lean away from the cursor. Scrolling lifts the
  balloon.
- Clicking a polaroid unclips it and flies it to the center into the trip gallery (all media,
  thumbnails, arrows and arrow keys, location, date, coordinates, note). Esc or Close flies it
  back onto its thread.
- "Back to work" sinks the balloon and returns to the page.
- Trip media already lives on Cloudinary in `data.json` under `travels`.
- The trip that matches the hero's scene leads (hangs in the middle, lowest). Mapping:
  Dusk lake to Dawki; Alpine morning to Champawat; Misty dawn to Shillong; Moonlit coast to
  Goa; Desert sundown has no match, so default to Dawki. The sky colors follow the current
  scene's footer palette.
- Fix the mobile overlap seen in the prototype at 390px.
- The two lines of placeholder copy in the prototype ("The rest of the time, I'm usually
  somewhere with no signal" and "Five places, no laptop") were written by Claude, not taken
  from Abhinav's material. Keep them only if Abhinav approves them on review.

## Claude's calls (Abhinav did not decide these; flag on review)

1. **How a project deep dive opens:** a full-screen sheet that slides up over the page. Esc or
   Back closes it and returns to the same scroll position. Opening it pushes `/work/<slug>`,
   so each project has a shareable URL. `/work/<slug>` is prerendered as the same single page
   with that sheet open, which also keeps the existing project URLs working.
2. **Work list layout:** the first screen of Work shows the newest projects as large rows with
   name, one-line tagline, two or three metrics, and link chips. Older projects continue as
   compact rows. A row's hover shows its image, as `/plain` does now. Every row opens the
   sheet.
3. **Sheet contents, in order:** title block (name, year, domain, role, links), the project's
   primary media (live embed, video, or screenshot carousel), the problem and what was built
   (from the existing `description` or the README), metrics, stack, then any secondary media.
4. **Embeds:** sieve's results site and Voluntas' presentation are shown as a lazy-loaded iframe
   in the sheet, with an "Open full site" link. The Dart site is copied into
   `public/embeds/dart/` (Application tab removed, forge moved in) and loaded the same way.
   GitHub Pages and a self-hosted copy both allow framing.
5. **Cover images** for the three new projects: screenshots of their live pages, taken
   headlessly and uploaded to Cloudinary.
6. **Removed routes:** everything except `/` and `/work/<slug>`: Studio home, `/plain`,
   `/journey`, `/beyond`, `/contact`, `/topics`, `/dispatches`, and `/api/contact`.
   Each old path redirects to `/` (or to `/work/<slug>` where one exists) via
   `public/_redirects`. `sitemap.ts`, `llms.txt`, JSON-LD and SEO metadata are updated to
   match. Unused components and content modules are deleted, with their tests.
7. **The view chooser and `localStorage` view preference are removed.**
8. **Dispatches:** the `/dispatches/<slug>` pages go, but each old URL redirects to its own
   dev.to article (not to `/`), so the canonical on the five live dev.to posts still lands on
   the same piece. No writes to dev.to. The markdown in `src/content/dispatches/` and
   `scripts/sync-devto.mjs` stay as the source for future dev.to posts. CLAUDE.md's content
   model and playbook are updated to say posts live on dev.to and the site links out. The
   Guardian Kane deep dive lists its five posts, linking to dev.to.

## Left to the builder

- Component structure, animation implementation, and how the prototype code is turned into
  React.
- Exact copy for the new projects' taglines and descriptions, within the evidence rule.
- Which metrics to show per project (pick the strongest three or four with an artifact
  behind them).
- Reduced-motion behavior (respect `prefers-reduced-motion` everywhere).
