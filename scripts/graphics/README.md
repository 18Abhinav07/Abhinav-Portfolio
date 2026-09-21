# Dispatch graphics

How every cover and diagram in the dispatches is made. Follow this for any new post
so the visuals stay consistent across the portfolio, dev.to, and X.

## Why HTML, not a chart library

Each graphic is a small HTML page, screenshotted to PNG by headless Chrome, then
hosted on Cloudinary. The same markdown is syndicated to dev.to, which renders no
Mermaid and no on-page JS charts. A PNG at an absolute URL looks identical on the
portfolio, on dev.to, in link previews, and attached to an X post.

## Workflow

1. Add an entry to `graphics` in `templates.mjs`: `{ name, width, height, html }`.
   Reuse `cover({ series, part, title, motif, height })` for covers (`series` is `S1` or `S2`; `part: 0` prints "A series in N parts") (height defaults to 672; pass 900 for an X card) and `diagram(width, height, body)`
   for diagrams. Motifs and diagrams are inline SVG.
2. Render: `node scripts/graphics/render.mjs` (all) or `node scripts/graphics/render.mjs cover-s1`
   (names containing that string). PNGs land in `scripts/graphics/out/`, which is gitignored.
3. Open the PNG and look at it. Check text fits, nothing clips, fonts loaded.
4. Upload: `node scripts/upload-image.mjs dispatches/<series-or-slug> scripts/graphics/out/<name>.png`.
   It prints markdown with the Cloudinary URL.
5. Paste the URL into the post: `cover:` in frontmatter, or `![alt](url)` in the body.

Each series is a constant like `const S2 = { label: "...", parts: 2 }`. For a new series,
add one and pass it as `series`. A series-index cover uses `seriesTiles([...])` as its
motif: one stacked tile per part (lead tile in lime), sized for 2 or 3 tiles (more needs a smaller tile height). Name covers
`cover-s<series>` for the index and `cover-s<series>-<part>` for each part, and X cards
`x-thread-<series>` (so `x-thread-1` is the S1 thread card, `x-thread-2` the S2 one). The render filter is a plain substring, not a regex. Keep the tokens below.

## Screenshots and GIFs

Real captures of a build (dashboards, apps, terminal runs) are never generated.
They come from the user's own files (for GuardianKane:
`../../Project Screenshots/GuardianKane`, or the repo's demo recordings).

- Name them by what they show, with a prefix: `dash-<panel>` for dashboard
  captures, `<build>-<n>` for app captures (`orbital-kane-1`), a plain name for a
  GIF (`kane-verify-fail.gif`).
- Upload with the same `upload-image.mjs` command into the post's folder. Keep the
  original resolution; Cloudinary scales it down.
- Crop out anything private (tokens, emails, local paths outside the repo) before
  upload. The caption under the image says what build and which moment it is.
- A GIF stays a `.gif` URL. On X it attaches as a GIF, not through `f_png`.

## Series

A series is two places that must agree:

1. `src/content/series.json`: one entry with `slug`, `title`, `tagline`,
   `description`, `cover` (the `cover-s<N>` URL), `coverAlt`, `project`, `repo`.
   The page is `/dispatches/series/<slug>`.
2. Each part's frontmatter: `series: "<slug>"`, `seriesPart: <n>`, and its own
   `cover` (`cover-s<N>-<part>`) with `coverAlt`.

Each part ends with an italic line: `*Part n of N.*`, a link to the previous or
next part by slug, and the repo link. Every linked slug must exist; `npm test`
and `npm run build` catch a dangling one only if the page is generated, so check
by hand too.

## Visual system

| Token | Value | Use |
|---|---|---|
| Ink | `#07090F` | cover background, diagram text |
| Lime | `#BFFF00` | the one accent: highlighted title words, "pass", the path that matters |
| Cream | `#FAF9F6` | diagram background (matches the site) |
| Muted | `#9CA3AF` | labels, footers |
| Fail | `#FF6B5B` | failures only |
| Warn | `#FFB020` | retries, partial states |
| Human | `#A78BFA` | anything a person did |

Fonts: Clash Display for titles, Hanken Grotesk for body, JetBrains Mono for
labels, code, and numbers. One lime highlight per cover title (the `<em>` words).

## Sizes

| Graphic | Size | Why |
|---|---|---|
| Cover | 1600x672 | 2.38:1, the dev.to cover ratio (1000x420), so dev.to never crops it |
| Diagram | 1600 wide, height to fit | readable on retina, scales down on mobile |
| X card (optional) | 1600x900 | 16:9, shown uncropped in the X timeline. Name it `x-thread-<series>` and reuse the cover with `height: 900` |

## Content rules

- Every number in a graphic comes from a real artifact (log, test output, tracker,
  repo file). Same evidence rule as the prose. Anything illustrative is labeled so.
- Diagrams carry a small "Source:" footer naming the artifact.
- No em dashes or en dashes in any graphic text. Ranges are "8 to 10".
- Alt text describes what the graphic shows and the point it makes, in a full
  sentence. Never "diagram" or "image".

## Where the images work

**Portfolio.** Rendered by markdown-it with click to zoom. The OG card reuses the
cover: `opengraph-image.tsx` swaps `f_auto,q_auto` for `f_png` because the OG
renderer cannot decode AVIF or WebP, then letterboxes it to 1200x630.

**dev.to.** `sync-devto.mjs` sends `cover` as `main_image`. Body images are
absolute Cloudinary URLs, so they render on dev.to unchanged. Never use a relative
path in a dispatch; dev.to cannot resolve it.

**X.** Attach the PNG directly (download it from Cloudinary with `f_png` in the
URL). Up to 4 images per post. The 1600x672 covers show fine as a single image,
but X crops multi-image posts toward 16:9 or square, so for a thread or a
multi-image post render a 1600x900 variant. Diagrams with a key number near the
center survive cropping best. A link to the post also unfurls with the OG card,
so a link-only post still gets the cover.

## X posts: which image goes where

The graphics above are also the X images. Nothing is made just for X except the
1600x900 thread cards.

- One Post gets one image: the diagram or capture that proves its claim, or the
  part's cover when the claim is about the whole piece.
- A Thread gets one image per tweet, except the last (link) tweet, which stays
  bare so the link card renders.
- The image is recorded in Notion, not in this repo: the Inbox row's `Image`
  column holds the `f_auto,q_auto` URL, and a thread row's page holds an "Images,
  tweet by tweet" table. growth-run downloads each as PNG (`f_png`) into
  `~/Documents/Brain/10-Projects/content-engine/engine/state/x-media/` and attaches
  it in the composer (`references/chrome.md` "Attach an image").

## Asset inventory

Everything in `portfolio/dispatches/agents-lie/` (both GuardianKane series share
this folder), reusable for new posts and replies:

| Kind | Names |
|---|---|
| Covers | `cover-s1`, `cover-s1-1..3`, `cover-s2`, `cover-s2-1..2` |
| X cards | `x-thread-1`, `x-thread-2` |
| Diagrams | `diagram-loop`, `diagram-grilling`, `diagram-scoreboard`, `diagram-orbital-trail`, `diagram-reread`, `diagram-state-machine`, `diagram-eras`, `diagram-ownership`, `diagram-bridge` |
| Dashboard | `dash-gaps-drift`, `dash-activity-escalation`, `dash-focus-selection`, `dash-memory-history`, `dash-code-graph`, `dash-prd-claims` |
| App captures | `orbital-kane-1`, `orbital-kane-3`, `orbital-baseline-1`; `broken-chart/orbital-baseline-2` |
| GIF | `kane-verify-fail.gif` |

Get the exact versioned URL from the post that uses it (`grep -rn <name> src/content`).

## Cloudinary conventions

- Folder: `portfolio/dispatches/<series-or-slug>/` (the two GuardianKane series predate this and share `agents-lie/`; a new project gets its own folder)
- Delivery: `.../upload/f_auto,q_auto/v<version>/...` in markdown
- Re-uploading the same name makes a new version number; update the URL in the post
  or the old image keeps serving from cache.
