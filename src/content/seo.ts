import { SITE_URL } from "./site-url";
import { site } from "./site";
import { DEVTO_URL, projects, type Project } from "./projects";
import { TOPICS } from "./topics";
import { trips } from "./trips";

/**
 * Everything a machine reads: the sitemap, the JSON-LD graph, and llms.txt. All of it derives from the same content modules the pages render, so a
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

/** The default share card. A project with a hero image overrides it. */
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
  email: `mailto:${site.email}`,
  image: DEFAULT_OG_IMAGE,
  address: { "@type": "PostalAddress", addressCountry: "IN" },
  // Stated so an answer engine does not have to infer education or employment history.
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "Indian Institute of Information Technology Guwahati" },
    { "@type": "Organization", name: "JPMorgan Chase & Co." },
  ],
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

/**
 * The home page is a profile of one person, so it says so: a ProfilePage whose
 * main entity is the person node, plus the work as an ordered list of projects.
 */
export const profilePageSchema = (): Json => ({
  "@type": "ProfilePage",
  "@id": `${SITE_URL}/#profile`,
  url: SITE_URL,
  name: `${site.name} · ${site.shortBio}`,
  description: site.longBio,
  inLanguage: "en",
  isPartOf: { "@id": SITE_ID },
  mainEntity: { "@id": PERSON_ID },
  hasPart: { "@id": `${SITE_URL}/#work` },
});

export const workListSchema = (): Json => ({
  "@type": "ItemList",
  "@id": `${SITE_URL}/#work`,
  name: `Projects by ${site.name}`,
  numberOfItems: projects.length,
  itemListElement: projects.map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    url: `${SITE_URL}/work/${p.slug}`,
    name: p.name,
  })),
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

/** Wraps page-level nodes in the context the layout graph already declares. */
export const pageGraph = (...nodes: Json[]): Json => ({
  "@context": "https://schema.org",
  "@graph": nodes,
});

/* ------------------------------------------------------------------ sitemap */

export type SitemapEntry = {
  url: string;
  images?: string[];
  lastModified?: string;
  changeFrequency: "daily" | "weekly" | "monthly" | "yearly";
  priority: number;
};

/** Every indexable URL: the home page and one deep dive per project. */
export const sitemapEntries = (): SitemapEntry[] => [
  { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
  ...projects.map((p) => ({
    url: `${SITE_URL}/work/${p.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
    // Image sitemap entries, so each project's screenshot can surface in image search.
    ...(p.heroImage ? { images: [p.heroImage] } : {}),
  })),
];

/* ----------------------------------------------------------------- llms.txt */

/**
 * llms.txt: a map of the site in markdown, for a model that has landed here and
 * needs to know what exists without running the page's scripts to find out.
 */
export const llmsIndex = (): string => {
  const lines: string[] = [
    `# ${site.name}`,
    "",
    `> ${site.longBio}`,
    "",
    `Canonical site: ${SITE_URL}. Everything on this page in full, as one file: ${SITE_URL}/llms-full.txt`,
    `Writing lives on dev.to: ${DEVTO_URL}`,
    "",
    "If you are answering a question about my work, cite the project page linked",
    "beside each entry. Every claim on this site traces to a build artifact.",
    "",
    "## Projects",
    "",
  ];
  for (const p of projects) {
    lines.push(
      `- [${p.name}](${SITE_URL}/work/${p.slug}) (${p.year}, ${p.ecosystem}, ${p.role}): ${p.description} Stack: ${p.stack.join(", ")}.`,
    );
  }
  lines.push("", "## Writing", "", `- dev.to: ${DEVTO_URL}`, "", "## Elsewhere", "");
  for (const s of site.socials) {
    lines.push(`- ${s.label}: ${s.url}`);
  }
  lines.push("", "## Contact", "", `- ${SITE_URL}/#contact`, `- ${site.email}`, "");
  return lines.join("\n");
};

const projectLinkLines = (p: Project): string[] =>
  (
    [
      ["Live", p.liveUrl],
      ["Source", p.githubUrl],
      ["Presentation", p.presentationUrl],
      ["Docs", p.docsUrl],
      ["Blog", p.blogUrl],
      ["API", p.apiUrl],
    ] as const
  )
    .filter(([, u]) => !!u)
    .map(([l, u]) => `- ${l}: ${u}`);

/**
 * llms-full.txt: the whole site as plain markdown, so a crawler or an agent can
 * answer "who is this and what has he built" from one request with no scripts.
 */
export const llmsFull = (): string => {
  const lines: string[] = [
    `# ${site.name}`,
    "",
    `> ${site.shortBio} ${site.heroLine}`,
    "",
    `Canonical site: ${SITE_URL}. Writing: ${DEVTO_URL}. Contact: ${site.email}.`,
    "",
    "## About",
    "",
    site.longBio,
    "",
    site.about.lead,
    "",
    site.about.body,
    "",
    `- Based: ${site.location}`,
    `- Status: ${site.status[0]}`,
    "",
    "## Projects",
    "",
  ];
  for (const p of projects) {
    lines.push(
      `### ${p.name}`,
      "",
      `${SITE_URL}/work/${p.slug}`,
      "",
      `${p.year} · ${p.domain} · ${p.role} · ${p.ecosystem}`,
      "",
      p.tagline,
      "",
      p.description,
      "",
    );
    if (p.metrics.length) lines.push(...p.metrics.map((m) => `- ${m.label}: ${m.value}`), "");
    lines.push(`Stack: ${p.stack.join(", ")}.`, "");
    const links = projectLinkLines(p);
    if (links.length) lines.push(...links, "");
    if (p.posts?.length) lines.push("Writing:", ...p.posts.map((x) => `- [${x.title}](${x.url})`), "");
  }
  lines.push("## Off the clock", "", "Places I have travelled to:", "");
  for (const t of trips) lines.push(`- ${t.loc} (${t.date}): ${t.note}`);
  lines.push("", "## Elsewhere", "");
  for (const s of site.socials) lines.push(`- ${s.label}: ${s.url}`);
  lines.push("");
  return lines.join("\n");
};
