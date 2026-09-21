import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";
import Shiki from "@shikijs/markdown-it";
import { getSeries } from "./series";

/**
 * Dispatches: the canonical home for long-form technical writing.
 *
 * Posts are plain markdown files in src/content/dispatches/. Everything here runs at
 * build time only (generateStaticParams + static rendering), so `fs` is safe even on
 * an edge deploy target.
 */

/**
 * What a piece is. Dispatches is the home for everything written, so this only
 * sets the reader's expectation on the index and decides where a piece is
 * allowed to be syndicated.
 */
export type DispatchKind = "teardown" | "product" | "essay";

export const KINDS: DispatchKind[] = ["teardown", "product", "essay"];

/** Platforms a piece may be syndicated to. Opt-in: omitting this keeps it home. */
export type Syndication = "devto";

export type Dispatch = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  kind: DispatchKind;
  /**
   * Where this piece may be syndicated. Empty means portfolio-only. An essay
   * has no business on dev.to, and the sync script refuses anything not listed.
   */
  syndicate: Syndication[];
  /** Slug of the related /work/[slug] case study, if any. */
  project?: string;
  /** Set only when this post was published elsewhere first. Normally omitted. */
  canonical?: string;
  /** Absolute image URL (Cloudinary), 1600x672 so the same file works as the dev.to cover. */
  cover?: string;
  coverAlt?: string;
  /** Slug of a series in series.json. Parts are ordered by seriesPart, not by date. */
  series?: string;
  seriesPart?: number;
  /** Draft posts are excluded from the index, RSS, and static params. */
  draft: boolean;
  readTime: string;
  /** Raw markdown body, without frontmatter. */
  body: string;
};

const DISPATCH_DIR = path.join(process.cwd(), "src", "content", "dispatches");

const WORDS_PER_MINUTE = 220;

export const readingTime = (body: string) => {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / WORDS_PER_MINUTE))} min read`;
};

const parse = (fileName: string): Dispatch => {
  const slug = fileName.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(DISPATCH_DIR, fileName), "utf8");
  const { data, content } = matter(raw);

  for (const key of ["title", "date", "summary"] as const) {
    if (!data[key]) {
      throw new Error(`Dispatch "${slug}" is missing required frontmatter: ${key}`);
    }
  }

  // Defaults to "teardown" so existing posts keep working, but a typo should
  // fail the build rather than quietly mislabel the piece on the index.
  const kind: DispatchKind = data.kind ?? "teardown";
  if (!KINDS.includes(kind)) {
    throw new Error(
      `Dispatch "${slug}" has unknown kind "${kind}". Expected one of: ${KINDS.join(", ")}`,
    );
  }

  const syndicate: Syndication[] = data.syndicate ?? [];
  for (const target of syndicate) {
    if (target !== "devto") {
      throw new Error(`Dispatch "${slug}" lists unknown syndication target "${target}".`);
    }
  }

  if (data.cover && !/^https:\/\//.test(data.cover)) {
    // dev.to renders the same cover on its own domain, so a relative path would break there.
    throw new Error(`Dispatch "${slug}" cover must be an absolute https URL.`);
  }
  if (data.cover && !data.coverAlt) {
    throw new Error(`Dispatch "${slug}" has a cover but no coverAlt.`);
  }

  if (data.series !== undefined) {
    if (!getSeries(data.series)) {
      throw new Error(`Dispatch "${slug}" names unknown series "${data.series}".`);
    }
    if (!Number.isInteger(data.seriesPart) || data.seriesPart < 1) {
      throw new Error(`Dispatch "${slug}" is in a series but has no positive integer seriesPart.`);
    }
  }

  return {
    slug,
    title: data.title,
    date: data.date,
    summary: data.summary,
    tags: data.tags ?? [],
    kind,
    syndicate,
    project: data.project,
    canonical: data.canonical,
    cover: data.cover,
    coverAlt: data.coverAlt,
    series: data.series,
    seriesPart: data.series ? data.seriesPart : undefined,
    draft: data.draft === true,
    readTime: data.readTime ?? readingTime(content),
    body: content,
  };
};

const readAll = (): Dispatch[] => {
  if (!fs.existsSync(DISPATCH_DIR)) return [];
  const all = fs
    .readdirSync(DISPATCH_DIR)
    .filter((f) => f.endsWith(".md"))
    .map(parse)
    // Same-day posts (a series launched together) fall back to part order, so
    // "newest first" never shows part 3 above part 1 by accident of filename.
    .sort(
      (a, b) =>
        b.date.localeCompare(a.date) || (b.seriesPart ?? 0) - (a.seriesPart ?? 0),
    );

  const seen = new Set<string>();
  for (const d of all) {
    if (!d.series) continue;
    const key = `${d.series}#${d.seriesPart}`;
    if (seen.has(key)) {
      throw new Error(`Two dispatches claim part ${d.seriesPart} of series "${d.series}".`);
    }
    seen.add(key);
  }
  return all;
};

/** Every dispatch including drafts. For tests and build-time checks, never for rendering lists. */
export const getAllDispatches = (): Dispatch[] => readAll();

/** Published dispatches, newest first. Drafts excluded. */
export const getDispatches = (): Dispatch[] => readAll().filter((d) => !d.draft);

/**
 * What the dispatches index renders.
 *
 * In development this includes drafts, so work in progress is visible in the place
 * it will actually appear rather than only by guessing its direct URL. Production
 * always excludes them. The point is that nobody ever needs to flip `draft: false`
 * just to preview a layout, which is how an unfinished post gets shipped by accident.
 */
export const getListedDispatches = (): Dispatch[] =>
  process.env.NODE_ENV === "development" ? readAll() : getDispatches();

/** Includes drafts. Used only so a draft is still previewable by direct URL in dev. */
export const getDispatch = (slug: string): Dispatch | undefined =>
  readAll().find((d) => d.slug === slug);

/**
 * Parts of a series in reading order. `listed` follows getListedDispatches, so a
 * draft part is visible in dev and absent in production.
 */
export const getSeriesParts = (series: string, { listed = false } = {}): Dispatch[] =>
  (listed ? getListedDispatches() : getDispatches())
    .filter((d) => d.series === series)
    .sort((a, b) => (a.seriesPart ?? 0) - (b.seriesPart ?? 0));

/** Every tag with how many listed dispatches carry it, most used first. */
export const getTopics = (dispatches: Dispatch[]) => {
  const counts = new Map<string, number>();
  for (const d of dispatches) for (const t of d.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
};

/**
 * GitHub-style heading slug. dev.to generates its own anchors the same way, so an
 * in-post link like (#the-setup) works on both sites.
 */
export const slugifyHeading = (text: string) =>
  text
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");

const stripInlineMarkdown = (text: string) =>
  text.replace(/`([^`]+)`/g, "$1").replace(/[*_]/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

/** The h2 outline of a post, for the table of contents. Ignores fenced code. */
export const extractHeadings = (body: string) => {
  const headings: { id: string; text: string }[] = [];
  const used = new Map<string, number>();
  let fenced = false;
  for (const line of body.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) fenced = !fenced;
    if (fenced) continue;
    const m = /^##\s+(.+?)\s*#*\s*$/.exec(line);
    if (!m) continue;
    const text = stripInlineMarkdown(m[1]);
    headings.push({ id: uniqueId(slugifyHeading(text), used), text });
  }
  return headings;
};

const uniqueId = (base: string, used: Map<string, number>) => {
  const n = used.get(base) ?? 0;
  used.set(base, n + 1);
  return n === 0 ? base : `${base}-${n}`;
};

const CALLOUT = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/i;

/**
 * Two small markdown-it rules:
 * - every heading gets the same id extractHeadings computes, so the TOC resolves;
 * - a blockquote starting with [!NOTE] (GitHub alert syntax) becomes a callout.
 *   The sync script rewrites the marker for dev.to, which does not support it.
 */
const structurePlugin = (md: ReturnType<typeof MarkdownIt>) => {
  md.core.ruler.push("dispatch_structure", (state) => {
    const used = new Map<string, number>();
    const tokens = state.tokens;
    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i];
      if (t.type === "heading_open") {
        const inline = tokens[i + 1];
        const text = stripInlineMarkdown(inline.content);
        t.attrSet("id", uniqueId(slugifyHeading(text), used));
      }
      if (t.type === "blockquote_open") {
        const inline = tokens.slice(i + 1).find((x) => x.type === "inline");
        const m = inline && CALLOUT.exec(inline.content);
        if (!inline || !m) continue;
        const kind = m[1].toLowerCase();
        t.attrJoin("class", `callout callout-${kind}`);
        t.attrSet("data-callout", kind);
        inline.content = inline.content.replace(CALLOUT, "");
        const first = inline.children?.[0];
        if (first?.type === "text") {
          first.content = first.content.replace(CALLOUT, "");
          if (!first.content && inline.children?.[1]?.type === "softbreak") {
            inline.children.splice(0, 2);
          }
        }
      }
    }
  });
};

let renderer: Promise<ReturnType<typeof MarkdownIt>> | null = null;

const getRenderer = () => {
  renderer ??= (async () => {
    // typographer is off on purpose: it turns "--" into a dash, and dashes are
    // banned house style. Straight quotes are an acceptable cost.
    const md = MarkdownIt({ html: true, linkify: true, typographer: false });
    md.use(structurePlugin);
    md.use(
      await Shiki({
        // Single light theme: the site has no dark mode, and a second theme would
        // ship CSS variables nothing reads.
        theme: "github-light",
      }),
    );
    return md;
  })();
  return renderer;
};

export const renderMarkdown = async (body: string): Promise<string> => {
  const md = await getRenderer();
  return md.render(body);
};

export const formatDate = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
