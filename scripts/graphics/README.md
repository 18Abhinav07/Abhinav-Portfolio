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
   Reuse `cover({ part, title, motif })` for covers and `diagram(width, height, body)`
   for diagrams. Motifs and diagrams are inline SVG.
2. Render: `node scripts/graphics/render.mjs` (all) or `node scripts/graphics/render.mjs cover-7`
   (names containing that string). PNGs land in `scripts/graphics/out/`, which is gitignored.
3. Open the PNG and look at it. Check text fits, nothing clips, fonts loaded.
4. Upload: `node scripts/upload-image.mjs dispatches/<series-or-slug> scripts/graphics/out/<name>.png`.
   It prints markdown with the Cloudinary URL.
5. Paste the URL into the post: `cover:` in frontmatter, or `![alt](url)` in the body.

For a new series, copy the cover block and change `SERIES_LABEL`, or add a second
`cover` variant. Keep the tokens below.

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
| X card (optional) | 1600x900 | 16:9, shown uncropped in the X timeline |

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

## Cloudinary conventions

- Folder: `portfolio/dispatches/<series-or-slug>/`
- Delivery: `.../upload/f_auto,q_auto/v<version>/...` in markdown
- Re-uploading the same name makes a new version number; update the URL in the post
  or the old image keeps serving from cache.
