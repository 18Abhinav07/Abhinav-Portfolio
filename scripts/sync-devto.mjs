#!/usr/bin/env node
/**
 * Syndicate one dispatch to dev.to, canonical pointing home.
 *
 *   node scripts/sync-devto.mjs <slug> [--publish]
 *   node scripts/sync-devto.mjs <slug> --dry-run     print the payload, send nothing
 *
 * Creates the article on first run and writes the returned id back into the post's
 * frontmatter as `devtoId`. Every later run updates that same article instead of
 * creating a duplicate. The id in frontmatter is the whole duplicate-prevention
 * mechanism, so the write-back must be committed.
 *
 * Defaults to creating a DRAFT on dev.to. Pass --publish to go live.
 * Requires DEVTO_API_KEY, from .env locally or the environment in CI
 * (dev.to, Settings, Extensions, DEV Community API Keys).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import dotenv from "dotenv";
import { unwrapMarkdown } from "./lib/unwrap-markdown.mjs";

// Local runs read DEVTO_API_KEY from .env; CI passes it as a real env var, which wins.
dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), "..", ".env"), quiet: true });

const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://abhinavpangaria.pages.dev").replace(/\/$/, "");
const API = "https://dev.to/api/articles";

const [, , slug, ...flags] = process.argv;
const publish = flags.includes("--publish");
// --dry-run prints the translated payload without a key or a network call.
const dryRun = flags.includes("--dry-run");

if (!slug) {
  console.error("usage: node scripts/sync-devto.mjs <slug> [--publish]");
  process.exit(1);
}

const apiKey = process.env.DEVTO_API_KEY;
if (!apiKey && !dryRun) {
  console.error("DEVTO_API_KEY is not set.");
  process.exit(1);
}

const file = path.join(process.cwd(), "src", "content", "dispatches", `${slug}.md`);
if (!fs.existsSync(file)) {
  console.error(`No dispatch at ${file}`);
  process.exit(1);
}

const raw = fs.readFileSync(file, "utf8");
const { data, content } = matter(raw);

if (data.draft === true && !dryRun) {
  console.error(
    `"${slug}" is still marked draft: true. Publish it on the portfolio first. ` +
      `canonical has to resolve before dev.to indexes the copy.`,
  );
  process.exit(1);
}

// Syndication is opt-in. Dispatches holds essays and product writing too, and
// those have no business on a developer community.
if (!(data.syndicate ?? []).includes("devto")) {
  console.error(
    `"${slug}" is not marked for dev.to. If it belongs there, add to its frontmatter:\n` +
      `  syndicate: ["devto"]\n` +
      `If it does not, that is the correct outcome, nothing to do.`,
  );
  process.exit(1);
}

// Series metadata lives in src/content/series.json, keyed by the post's `series`.
const seriesList = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "src", "content", "series.json"), "utf8"),
);
const series = data.series ? seriesList.find((s) => s.slug === data.series) : undefined;
if (data.series && !series) {
  console.error(`"${slug}" names series "${data.series}", which is not in series.json.`);
  process.exit(1);
}

/**
 * Translate portfolio markdown into what dev.to renders:
 *  - root-relative links become absolute, or they 404 on dev.to
 *  - GitHub alert callouts (> [!NOTE]) become a bold label, since dev.to has no alerts
 *  - hard-wrapped paragraphs are joined, since dev.to renders each newline as <br>
 *  - a footer points the reader home, with the series when there is one
 */
function toDevto(body) {
  let out = unwrapMarkdown(body)
    .replace(/\]\(\//g, `](${SITE}/`)
    .replace(/^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*$/gim, (_, kind) => {
      const label = kind[0].toUpperCase() + kind.slice(1).toLowerCase();
      return `> **${label}:**`;
    });

  const home = `${SITE}/dispatches/${slug}`;
  const footer = series
    ? `*Part ${data.seriesPart} of [${series.title}](${SITE}/dispatches/series/${series.slug}). ` +
      `The original, with the full series navigation, is [on my site](${home}).*`
    : `*Originally published [on my site](${home}).*`;
  out = `${out.trim()}\n\n---\n\n${footer}\n`;
  return out;
}

// dev.to tags: lowercase alphanumeric only, max 4.
const tags = (data.tags ?? [])
  .map((t) => String(t).toLowerCase().replace(/[^a-z0-9]/g, ""))
  .filter(Boolean)
  .slice(0, 4);

const article = {
  title: data.title,
  body_markdown: toDevto(content),
  published: publish,
  canonical_url: `${SITE}/dispatches/${slug}`,
  description: data.summary ?? "",
  tags,
  ...(data.cover ? { main_image: data.cover } : {}),
  // dev.to groups articles that share this exact string into a series.
  ...(series ? { series: series.title } : {}),
};

if (dryRun) {
  console.log(JSON.stringify({ ...article, body_markdown: `${article.body_markdown.slice(0, 400)}...` }, null, 2));
  console.log("\n--- footer ---\n" + article.body_markdown.slice(-400));
  process.exit(0);
}

const existingId = data.devtoId;
const res = await fetch(existingId ? `${API}/${existingId}` : API, {
  method: existingId ? "PUT" : "POST",
  headers: { "api-key": apiKey, "Content-Type": "application/json" },
  body: JSON.stringify({ article }),
});

if (!res.ok) {
  console.error(`dev.to API ${res.status}: ${await res.text()}`);
  process.exit(1);
}

const result = await res.json();

if (!existingId) {
  // Write the id back so the next run updates rather than duplicates.
  fs.writeFileSync(file, matter.stringify(content, { ...data, devtoId: result.id }));
  console.log(`Created dev.to article ${result.id}, devtoId written to ${slug}.md`);
  console.log("Commit that change, or the next run will create a duplicate.");
} else {
  console.log(`Updated dev.to article ${existingId}`);
}

console.log(`  url:       ${result.url}`);
console.log(`  canonical: ${article.canonical_url}`);
console.log(`  published: ${publish}`);
