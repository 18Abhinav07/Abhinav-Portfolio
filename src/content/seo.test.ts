import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import {
  PERSON_ID,
  SITE_ID,
  breadcrumbSchema,
  knowsAbout,
  llmsFull,
  llmsIndex,
  profilePageSchema,
  projectSchema,
  workListSchema,
  siteGraph,
  sitemapEntries,
} from "./seo";
import { SITE_URL } from "./site-url";
import { DEVTO_URL, projects } from "./projects";
import { TOPICS, resolveTopic } from "./topics";

const urls = sitemapEntries().map((e) => e.url);

describe("sitemap", () => {
  it("is the home page plus one deep dive per project", () => {
    expect(urls).toEqual([SITE_URL, ...projects.map((p) => `${SITE_URL}/work/${p.slug}`)]);
  });

  it("lists each project's screenshot as an absolute image url", () => {
    for (const e of sitemapEntries()) for (const i of e.images ?? []) expect(i).toMatch(/^https:\/\//);
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

  it("every project emits a node with a url and a name", () => {
    for (const p of projects) {
      const n = projectSchema(p) as Record<string, unknown>;
      expect(["SoftwareSourceCode", "CreativeWork"]).toContain(n["@type"]);
      expect(n.name).toBe(p.name);
      expect(n.url).toBe(`${SITE_URL}/work/${p.slug}`);
    }
  });

  it("home is a ProfilePage about the person, with the work in display order", () => {
    const pp = profilePageSchema() as Record<string, unknown>;
    expect(pp["@type"]).toBe("ProfilePage");
    expect(pp.mainEntity).toEqual({ "@id": PERSON_ID });
    const list = workListSchema() as Record<string, unknown>;
    const items = list.itemListElement as Record<string, unknown>[];
    expect(items.map((i) => i.url)).toEqual(projects.map((p) => `${SITE_URL}/work/${p.slug}`));
  });

  it("breadcrumbs number their items from one", () => {
    const b = breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Work", path: "/work" },
    ]) as Record<string, unknown>;
    const items = b.itemListElement as Record<string, unknown>[];
    expect(items.map((i) => i.position)).toEqual([1, 2]);
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

  it("opens with the site as an h1", () => {
    expect(index.startsWith("# Abhinav Pangaria")).toBe(true);
  });

  it("links every project and the dev.to account", () => {
    for (const p of projects) expect(index).toContain(`${SITE_URL}/work/${p.slug}`);
    expect(index).toContain(DEVTO_URL);
  });

  it("points at the full-text companion", () => {
    expect(index).toContain(`${SITE_URL}/llms-full.txt`);
  });

  it("full text carries the about section and every project in full", () => {
    const full = llmsFull();
    expect(full).toContain("## About");
    for (const p of projects) {
      expect(full).toContain(`### ${p.name}`);
      expect(full).toContain(p.description);
    }
  });

  it("uses no em dash or en dash", () => {
    // Literals are built by code point so this file does not trip house-style.test.ts.
    const dashes = new RegExp(`[${String.fromCharCode(0x2014)}${String.fromCharCode(0x2013)}]`);
    expect(dashes.test(index + llmsFull())).toBe(false);
  });
});

describe("redirects", () => {
  const r = readFileSync("public/_redirects", "utf8");

  it("sends every old dispatch to its dev.to copy", () => {
    for (const slug of [
      "agent-shipped-a-broken-chart",
      "the-requirement-nobody-wrote",
      "who-verifies-the-verifier",
      "the-second-build-was-mostly-wiring",
      "making-verification-visible",
    ]) {
      expect(r).toMatch(new RegExp(`^/dispatches/${slug} ${DEVTO_URL}/\\S+ 301$`, "m"));
    }
  });

  it("sends every retired page home", () => {
    for (const path of ["/plain", "/journey", "/beyond", "/contact", "/topics", "/dispatches", "/work"]) {
      expect(r).toMatch(new RegExp(`^${path} / 301$`, "m"));
    }
  });
});
