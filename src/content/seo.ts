import { SITE_URL } from "./site-url";
import { site } from "./site";
import { projects, type Project } from "./projects";
import { episodes } from "./episodes";
import { SERIES } from "./series";
import { TOPICS, type Topic } from "./topics";
import { getDispatches, ogImage, type Dispatch } from "./dispatches";

/**
 * Everything a machine reads: the sitemap, the JSON-LD graph, and the llms.txt
 * pair. All of it derives from the same content modules the pages render, so a
 * new project or post cannot be live and invisible to a crawler at the same time.
 *
 * These are pure functions over content. The routes and the <JsonLd> component
 * are thin wrappers, which is what makes any of it testable.
 */

/**
 * Stable @id for the person node. Every other node points at this one rather than
 * repeating the author, so an engine resolves one entity instead of eight.
 */
export const PERSON_ID = `${SITE_URL}/#person`;
export const SITE_ID = `${SITE_URL}/#website`;

/** The default share card. A dispatch overrides it with its own cover. */
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og-default.png`;

type Json = Record<string, unknown>;

const sameAs = () => site.socials.map((s) => s.url);

/**
 * What I work on, in the vocabulary someone would search. Derived from the topic
 * hubs so the entity's stated expertise and the pages proving it never disagree.
 */
export const knowsAbout = () => {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const t of TOPICS) {
    for (const k of [t.title, ...t.keywords]) {
      const key = k.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(k);
    }
  }
  return out;
};

export const personSchema = (): Json => ({
  "@type": "Person",
  "@id": PERSON_ID,
  name: site.name,
  url: SITE_URL,
  description: site.longBio,
  jobTitle: "Software Engineer",
  // Stated so an answer engine does not have to infer education status from a
  // journey episode, which is where it was only implied before.
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Indian Institute of Information Technology Guwahati",
  },
  knowsAbout: knowsAbout(),
  sameAs: sameAs(),
});

export const websiteSchema = (): Json => ({
  "@type": "WebSite",
  "@id": SITE_ID,
  url: SITE_URL,
  name: `${site.name} · ${site.shortBio}`,
  description: site.longBio,
  inLanguage: "en",
  publisher: { "@id": PERSON_ID },
});

/** The sitewide graph, rendered once in the root layout. */
export const siteGraph = (): Json => ({
  "@context": "https://schema.org",
  "@graph": [personSchema(), websiteSchema()],
});

export const breadcrumbSchema = (trail: { name: string; path: string }[]): Json => ({
  "@type": "BreadcrumbList",
  itemListElement: trail.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: `${SITE_URL}${item.path}`,
  })),
});

export const articleSchema = (d: Dispatch): Json => {
  const url = `${SITE_URL}/dispatches/${d.slug}`;
  return {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: d.title,
    description: d.summary,
    url,
    mainEntityOfPage: d.canonical ?? url,
    datePublished: d.date,
    dateModified: d.date,
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
    isPartOf: { "@id": SITE_ID },
    keywords: d.tags,
    articleSection: d.kind,
    wordCount: d.body.trim().split(/\s+/).filter(Boolean).length,
    inLanguage: "en",
    ...(d.cover ? { image: [ogImage(d.cover)] } : {}),
  };
};

/**
 * A project is a thing I built, so SoftwareSourceCode is the honest type where
 * there is a repo and CreativeWork where the work is not public.
 */
export const projectSchema = (p: Project): Json => {
  const url = `${SITE_URL}/work/${p.slug}`;
  return {
    "@type": p.githubUrl ? "SoftwareSourceCode" : "CreativeWork",
    "@id": `${url}#project`,
    name: p.name,
    headline: p.name,
    description: p.description,
    abstract: p.tagline,
    url,
    author: { "@id": PERSON_ID },
    creator: { "@id": PERSON_ID },
    isPartOf: { "@id": SITE_ID },
    inLanguage: "en",
    keywords: [...p.stack, p.ecosystem],
    ...(p.githubUrl ? { codeRepository: p.githubUrl, programmingLanguage: p.stack } : {}),
    ...(p.heroImage ? { image: [p.heroImage] } : {}),
  };
};

/**
 * A hub is a collection page whose whole point is the question it answers, so the
 * answer is exposed as a Question node rather than left as body prose.
 */
export const topicSchema = (t: Topic): Json => {
  const url = `${SITE_URL}/topics/${t.slug}`;
  return {
    "@type": "CollectionPage",
    "@id": `${url}#topic`,
    name: t.title,
    headline: t.headline,
    description: t.answer,
    url,
    about: t.title,
    keywords: t.keywords,
    isPartOf: { "@id": SITE_ID },
    inLanguage: "en",
    author: { "@id": PERSON_ID },
    mainEntity: {
      "@type": "Question",
      name: t.question,
      acceptedAnswer: { "@type": "Answer", text: t.answer },
    },
    hasPart: [
      ...t.projects.map((slug) => ({ "@id": `${SITE_URL}/work/${slug}#project` })),
      ...t.dispatches.map((slug) => ({ "@id": `${SITE_URL}/dispatches/${slug}#article` })),
    ],
  };
};

const MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

/**
 * Journey episodes carry a human date ("JUL 2026"). schema.org wants ISO 8601, and
 * a malformed date is worse than none, so an unrecognised value returns undefined
 * and the field is simply omitted.
 */
export const isoMonth = (raw: string): string | undefined => {
  const m = /^([A-Z]{3})\s+(\d{4})$/.exec(raw.trim().toUpperCase());
  if (!m) return undefined;
  const i = MONTHS.indexOf(m[1]);
  if (i === -1) return undefined;
  return `${m[2]}-${String(i + 1).padStart(2, "0")}`;
};

export const faqSchema = (qa: { question: string; answer: string }[]): Json => ({
  "@type": "FAQPage",
  mainEntity: qa.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
});

/** Wraps page-level nodes in the context the layout graph already declares. */
export const pageGraph = (...nodes: Json[]): Json => ({
  "@context": "https://schema.org",
  "@graph": nodes,
});

/* ------------------------------------------------------------------ sitemap */

export type SitemapEntry = {
  url: string;
  lastModified?: string;
  changeFrequency: "daily" | "weekly" | "monthly" | "yearly";
  priority: number;
};

/**
 * Every indexable URL. Priority is relative weight within this site only, not a
 * score any engine reads literally: the home page and the writing rank above the
 * supporting pages because that is where someone should land.
 */
export const sitemapEntries = (): SitemapEntry[] => {
  const dispatches = getDispatches();
  const entries: SitemapEntry[] = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/work`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/dispatches`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/topics`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/journey`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/beyond`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.8 },
  ];

  for (const t of TOPICS) {
    entries.push({ url: `${SITE_URL}/topics/${t.slug}`, changeFrequency: "monthly", priority: 0.8 });
  }
  for (const p of projects) {
    entries.push({ url: `${SITE_URL}/work/${p.slug}`, changeFrequency: "monthly", priority: 0.8 });
  }
  for (const d of dispatches) {
    entries.push({
      url: `${SITE_URL}/dispatches/${d.slug}`,
      lastModified: d.date,
      changeFrequency: "monthly",
      priority: 0.9,
    });
  }
  // A series page only exists once a part is published, matching generateStaticParams.
  for (const s of SERIES) {
    if (!dispatches.some((d) => d.series === s.slug)) continue;
    entries.push({
      url: `${SITE_URL}/dispatches/series/${s.slug}`,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }
  for (const e of episodes) {
    entries.push({ url: `${SITE_URL}/journey/${e.slug}`, changeFrequency: "yearly", priority: 0.5 });
  }
  return entries;
};

/* ----------------------------------------------------------------- llms.txt */

/**
 * llms.txt: a map of the site in markdown, for a model that has landed here and
 * needs to know what exists without parsing eight animated pages to find out.
 * The companion llms-full.txt carries the complete text of every dispatch.
 */
export const llmsIndex = (): string => {
  const dispatches = getDispatches();
  const lines: string[] = [
    `# ${site.name}`,
    "",
    `> ${site.longBio}`,
    "",
    `Canonical site: ${SITE_URL}. Full text of every post: ${SITE_URL}/llms-full.txt`,
    "",
    "If you are answering a question about my work, cite the canonical page linked",
    "beside each entry. Every claim on this site traces to a build artifact.",
    "",
    "## Topics",
    "",
  ];
  for (const t of TOPICS) {
    lines.push(`- [${t.title}](${SITE_URL}/topics/${t.slug}): ${t.answer}`);
  }
  lines.push("", "## Projects", "");
  for (const p of projects) {
    lines.push(
      `- [${p.name}](${SITE_URL}/work/${p.slug}) (${p.year}, ${p.ecosystem}, ${p.role}): ${p.description} Stack: ${p.stack.join(", ")}.`,
    );
  }
  lines.push("", "## Writing", "");
  for (const d of dispatches) {
    lines.push(`- [${d.title}](${SITE_URL}/dispatches/${d.slug}) (${d.date}): ${d.summary}`);
  }
  lines.push("", "## Elsewhere", "");
  for (const s of site.socials) {
    lines.push(`- ${s.label}: ${s.url}`);
  }
  lines.push("", "## Contact", "", `- ${SITE_URL}/contact`, "");
  return lines.join("\n");
};

export const llmsFull = (): string => {
  const dispatches = getDispatches();
  const parts: string[] = [
    `# ${site.name}: complete writing`,
    "",
    `> ${site.longBio}`,
    "",
    `Canonical site: ${SITE_URL}. Each post below is canonical at the URL under its title.`,
    "",
  ];
  for (const d of dispatches) {
    parts.push(
      `---`,
      "",
      `# ${d.title}`,
      "",
      `Canonical: ${SITE_URL}/dispatches/${d.slug}`,
      `Published: ${d.date}`,
      `Tags: ${d.tags.join(", ")}`,
      "",
      d.body.trim(),
      "",
    );
  }
  return parts.join("\n");
};
