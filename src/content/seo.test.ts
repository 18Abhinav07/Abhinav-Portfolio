import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import {
  PERSON_ID,
  SITE_ID,
  articleSchema,
  breadcrumbSchema,
  faqSchema,
  isoMonth,
  knowsAbout,
  llmsFull,
  llmsIndex,
  projectSchema,
  siteGraph,
  sitemapEntries,
  topicSchema,
} from "./seo";
import { SITE_URL } from "./site-url";
import { getDispatches } from "./dispatches";
import { projects } from "./projects";
import { TOPICS, resolveTopic } from "./topics";

const published = getDispatches();
const urls = sitemapEntries().map((e) => e.url);

describe("sitemap", () => {
  it("lists every published dispatch", () => {
    for (const d of published) {
      expect(urls).toContain(`${SITE_URL}/dispatches/${d.slug}`);
    }
  });

  it("lists every project and every topic hub", () => {
    for (const p of projects) expect(urls).toContain(`${SITE_URL}/work/${p.slug}`);
    for (const t of TOPICS) expect(urls).toContain(`${SITE_URL}/topics/${t.slug}`);
  });

  it("has no duplicate and no relative urls", () => {
    expect(new Set(urls).size).toBe(urls.length);
    for (const u of urls) expect(u.startsWith(`${SITE_URL}/`) || u === SITE_URL).toBe(true);
  });

  it("never points at an unpublished dispatch", () => {
    const live = new Set(published.map((d) => d.slug));
    for (const u of urls.filter((x) => x.includes("/dispatches/"))) {
      const slug = u.split("/dispatches/")[1];
      if (slug && !slug.startsWith("series/")) expect(live.has(slug)).toBe(true);
    }
  });
});

describe("robots.txt", () => {
  const robots = readFileSync("public/robots.txt", "utf8");

  it("points at the sitemap", () => {
    expect(robots).toContain(`Sitemap: ${SITE_URL}/sitemap.xml`);
  });

  it("allows the answer engines by name", () => {
    for (const bot of ["GPTBot", "OAI-SearchBot", "ClaudeBot", "PerplexityBot", "Googlebot"]) {
      expect(robots).toContain(`User-agent: ${bot}`);
    }
  });
});

describe("json-ld", () => {
  it("site graph carries one person and one website with stable ids", () => {
    const graph = siteGraph()["@graph"] as Record<string, unknown>[];
    expect(graph.map((n) => n["@id"])).toEqual([PERSON_ID, SITE_ID]);
  });

  it("every dispatch emits a valid BlogPosting", () => {
    for (const d of published) {
      const a = articleSchema(d) as Record<string, unknown>;
      expect(a["@type"]).toBe("BlogPosting");
      expect(a.headline).toBeTruthy();
      expect(a.datePublished).toMatch(/^\d{4}-\d{2}-\d{2}/);
      expect(a.author).toEqual({ "@id": PERSON_ID });
      expect(a["@id"]).toBe(`${SITE_URL}/dispatches/${d.slug}#article`);
    }
  });

  it("every project emits a node with a url and a name", () => {
    for (const p of projects) {
      const n = projectSchema(p) as Record<string, unknown>;
      expect(["SoftwareSourceCode", "CreativeWork"]).toContain(n["@type"]);
      expect(n.name).toBe(p.name);
      expect(n.url).toBe(`${SITE_URL}/work/${p.slug}`);
    }
  });

  it("every topic emits a CollectionPage with one answered question", () => {
    for (const t of TOPICS) {
      const n = topicSchema(t) as Record<string, unknown>;
      expect(n["@type"]).toBe("CollectionPage");
      const q = n.mainEntity as Record<string, unknown>;
      expect(q["@type"]).toBe("Question");
      expect((q.acceptedAnswer as Record<string, string>).text.length).toBeGreaterThan(80);
    }
  });

  it("breadcrumbs number their items from one", () => {
    const b = breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Work", path: "/work" },
    ]) as Record<string, unknown>;
    const items = b.itemListElement as Record<string, unknown>[];
    expect(items.map((i) => i.position)).toEqual([1, 2]);
  });

  it("faq schema keeps the question order", () => {
    const f = faqSchema([{ question: "a?", answer: "one" }]) as Record<string, unknown>;
    expect(f["@type"]).toBe("FAQPage");
    expect((f.mainEntity as unknown[]).length).toBe(1);
  });
});

describe("topics registry", () => {
  it("resolves every hub without a dangling reference", () => {
    for (const t of TOPICS) expect(() => resolveTopic(t)).not.toThrow();
  });

  it("has unique slugs and unique index numbers", () => {
    expect(new Set(TOPICS.map((t) => t.slug)).size).toBe(TOPICS.length);
    expect(new Set(TOPICS.map((t) => t.index)).size).toBe(TOPICS.length);
  });

  it("never files one dispatch under two hubs", () => {
    const seen = new Set<string>();
    for (const t of TOPICS) {
      for (const d of t.dispatches) {
        expect(seen.has(d)).toBe(false);
        seen.add(d);
      }
    }
  });

  it("feeds knowsAbout without duplicates", () => {
    const k = knowsAbout();
    expect(new Set(k).size).toBe(k.length);
    expect(k.length).toBeGreaterThan(TOPICS.length);
  });
});

describe("llms.txt", () => {
  const index = llmsIndex();
  const full = llmsFull();

  it("opens with the site as an h1", () => {
    expect(index.startsWith("# Abhinav Pangaria")).toBe(true);
  });

  it("links every published dispatch and every hub absolutely", () => {
    for (const d of published) expect(index).toContain(`${SITE_URL}/dispatches/${d.slug}`);
    for (const t of TOPICS) expect(index).toContain(`${SITE_URL}/topics/${t.slug}`);
  });

  it("carries the full body of every published dispatch", () => {
    for (const d of published) expect(full).toContain(d.title);
    // The body itself, not just the title. A size ratio against the index is not a
    // usable check: the index grows whenever a topic answer does.
    for (const d of published) expect(full).toContain(d.body.trim().slice(0, 200));
    expect(full.length).toBeGreaterThan(index.length);
  });

  it("uses no em dash or en dash", () => {
    // Literals are built by code point so this file does not trip house-style.test.ts.
    const dashes = new RegExp(`[${String.fromCharCode(0x2014)}${String.fromCharCode(0x2013)}]`);
    expect(dashes.test(index + full)).toBe(false);
  });
});

describe("isoMonth", () => {
  it("parses the journey date format", () => {
    expect(isoMonth("JUL 2026")).toBe("2026-07");
    expect(isoMonth("dec 2024")).toBe("2024-12");
  });

  it("returns undefined rather than a wrong date", () => {
    expect(isoMonth("Someday")).toBeUndefined();
    expect(isoMonth("13 2026")).toBeUndefined();
  });
});
