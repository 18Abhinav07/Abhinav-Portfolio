#!/usr/bin/env node
/**
 * Print stats for every dev.to article on the account.
 *
 *   node scripts/devto-stats.mjs [--json]
 *
 * Reads DEVTO_API_KEY from .env locally or the environment in CI. The key is only
 * sent to dev.to and never printed. Used by growth-run review for the weekly
 * Scoreboard row.
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), "..", ".env"), quiet: true });

const apiKey = process.env.DEVTO_API_KEY;
if (!apiKey) {
  console.error("DEVTO_API_KEY is not set.");
  process.exit(1);
}

const res = await fetch("https://dev.to/api/articles/me/all?per_page=1000", {
  headers: { "api-key": apiKey, Accept: "application/vnd.forem.api-v1+json" },
});

if (!res.ok) {
  console.error(`dev.to API ${res.status}: ${await res.text()}`);
  process.exit(1);
}

const articles = (await res.json()).map((a) => ({
  title: a.title,
  url: a.url,
  published: a.published,
  publishedAt: a.published_at,
  views: a.page_views_count ?? 0,
  reactions: a.public_reactions_count ?? 0,
  comments: a.comments_count ?? 0,
  canonical: a.canonical_url,
}));

const totals = articles.reduce(
  (t, a) => ({ views: t.views + a.views, reactions: t.reactions + a.reactions, comments: t.comments + a.comments }),
  { views: 0, reactions: 0, comments: 0 },
);

if (process.argv.includes("--json")) {
  console.log(JSON.stringify({ totals, articles }, null, 2));
} else {
  for (const a of articles) {
    console.log(`${a.published ? "live " : "draft"}  ${String(a.views).padStart(6)} views  ${String(a.reactions).padStart(4)} reactions  ${String(a.comments).padStart(3)} comments  ${a.title}`);
  }
  console.log(`total  ${totals.views} views, ${totals.reactions} reactions, ${totals.comments} comments, ${articles.length} articles`);
}
