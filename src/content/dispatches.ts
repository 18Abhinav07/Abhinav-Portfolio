import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";
import Shiki from "@shikijs/markdown-it";

/**
 * Dispatches — the canonical home for long-form technical writing.
 *
 * Posts are plain markdown files in src/content/dispatches/. Everything here runs at
 * build time only (generateStaticParams + static rendering), so `fs` is safe even on
 * an edge deploy target.
 */

export type Dispatch = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  /** Slug of the related /work/[slug] case study, if any. */
  project?: string;
  /** Set only when this post was published elsewhere first. Normally omitted. */
  canonical?: string;
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

  return {
    slug,
    title: data.title,
    date: data.date,
    summary: data.summary,
    tags: data.tags ?? [],
    project: data.project,
    canonical: data.canonical,
    draft: data.draft === true,
    readTime: data.readTime ?? readingTime(content),
    body: content,
  };
};

const readAll = (): Dispatch[] => {
  if (!fs.existsSync(DISPATCH_DIR)) return [];
  return fs
    .readdirSync(DISPATCH_DIR)
    .filter((f) => f.endsWith(".md"))
    .map(parse)
    .sort((a, b) => b.date.localeCompare(a.date));
};

/** Published dispatches, newest first. Drafts excluded. */
export const getDispatches = (): Dispatch[] => readAll().filter((d) => !d.draft);

/** Includes drafts — used only so a draft is still previewable by direct URL in dev. */
export const getDispatch = (slug: string): Dispatch | undefined =>
  readAll().find((d) => d.slug === slug);

let renderer: Promise<ReturnType<typeof MarkdownIt>> | null = null;

const getRenderer = () => {
  renderer ??= (async () => {
    const md = MarkdownIt({ html: true, linkify: true, typographer: true });
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
