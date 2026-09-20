#!/usr/bin/env node
/**
 * Syndicate one dispatch to dev.to, canonical pointing home.
 *
 *   node scripts/sync-devto.mjs <slug> [--publish]
 *
 * Creates the article on first run and writes the returned id back into the post's
 * frontmatter as `devtoId`. Every later run updates that same article instead of
 * creating a duplicate — the id in frontmatter is the whole duplicate-prevention
 * mechanism, so the write-back must be committed.
 *
 * Defaults to creating a DRAFT on dev.to. Pass --publish to go live.
 * Requires DEVTO_API_KEY (dev.to → Settings → Extensions → DEV Community API Keys).
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const SITE = "https://abhinavpangaria.com";
const API = "https://dev.to/api/articles";

const [, , slug, ...flags] = process.argv;
const publish = flags.includes("--publish");

if (!slug) {
  console.error("usage: node scripts/sync-devto.mjs <slug> [--publish]");
  process.exit(1);
}

const apiKey = process.env.DEVTO_API_KEY;
if (!apiKey) {
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

if (data.draft === true) {
  console.error(
    `"${slug}" is still marked draft: true. Publish it on the portfolio first — ` +
      `canonical has to resolve before dev.to indexes the copy.`,
  );
  process.exit(1);
}

// dev.to tags: lowercase alphanumeric only, max 4.
const tags = (data.tags ?? [])
  .map((t) => String(t).toLowerCase().replace(/[^a-z0-9]/g, ""))
  .filter(Boolean)
  .slice(0, 4);

const article = {
  title: data.title,
  body_markdown: content.trim(),
  published: publish,
  canonical_url: `${SITE}/dispatches/${slug}`,
  description: data.summary ?? "",
  tags,
};

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
  console.log(`Created dev.to article ${result.id} — devtoId written to ${slug}.md`);
  console.log("Commit that change, or the next run will create a duplicate.");
} else {
  console.log(`Updated dev.to article ${existingId}`);
}

console.log(`  url:       ${result.url}`);
console.log(`  canonical: ${article.canonical_url}`);
console.log(`  published: ${publish}`);
