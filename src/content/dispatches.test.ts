import { describe, it, expect } from "vitest";
import {
  getDispatches,
  getDispatch,
  readingTime,
  renderMarkdown,
  formatDate,
  KINDS,
  getListedDispatches,
  getAllDispatches,
  getSeriesParts,
  getTopics,
  extractHeadings,
  slugifyHeading,
} from "./dispatches";
import { SERIES } from "./series";
import { projects } from "./projects";

describe("dispatches content", () => {
  it("parses every file without throwing on required frontmatter", () => {
    expect(() => getDispatches()).not.toThrow();
  });

  it("excludes drafts from the published list", () => {
    expect(getDispatches().every((d) => !d.draft)).toBe(true);
  });

  it("has unique slugs", () => {
    const slugs = getDispatches().map((d) => d.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("is sorted newest first", () => {
    const dates = getDispatches().map((d) => d.date);
    expect([...dates].sort().reverse()).toEqual(dates);
  });

  it("uses ISO dates so sorting and RSS pubDate are correct", () => {
    for (const d of getDispatches()) {
      expect(d.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(Date.parse(d.date))).toBe(false);
    }
  });

  it("only references projects that exist", () => {
    const slugs = new Set(projects.map((p) => p.slug));
    for (const d of getDispatches()) {
      if (d.project) expect(slugs.has(d.project)).toBe(true);
    }
  });

  it("getDispatch returns undefined for an unknown slug", () => {
    expect(getDispatch("__nope__")).toBeUndefined();
  });

  it("readingTime never returns zero minutes", () => {
    expect(readingTime("one word")).toBe("1 min read");
  });

  it("renders markdown to html", async () => {
    const html = await renderMarkdown("## Heading\n\nSome **bold** text.");
    expect(html).toContain("<h2 id=\"heading\">");
    expect(html).toContain("<strong>");
  });

  it("highlights fenced code blocks", async () => {
    const html = await renderMarkdown("```ts\nconst x = 1;\n```");
    expect(html).toContain("<pre");
    expect(html).toContain("shiki");
  });

  it("formats dates in UTC so they never shift a day", () => {
    expect(formatDate("2026-09-24")).toBe("Sep 24, 2026");
  });

  it("never lists drafts outside development", () => {
    // Vitest runs with NODE_ENV=test, so this exercises the production branch.
    expect(process.env.NODE_ENV).not.toBe("development");
    expect(getListedDispatches().every((d) => !d.draft)).toBe(true);
    expect(getListedDispatches()).toEqual(getDispatches());
  });

  it("gives every dispatch a known kind", () => {
    for (const d of getDispatches()) {
      expect(KINDS).toContain(d.kind);
    }
  });

  it("only syndicates to known targets", () => {
    for (const d of getDispatches()) {
      for (const target of d.syndicate) {
        expect(target).toBe("devto");
      }
    }
  });

  it("never syndicates an essay to dev.to", () => {
    for (const d of getDispatches()) {
      if (d.kind === "essay") expect(d.syndicate).not.toContain("devto");
    }
  });
});

describe("series and structure", () => {
  // Drafts included: a whole series can sit in draft, and it still has to be valid.
  const all = getAllDispatches();

  it("gives every series part a unique, contiguous part number", () => {
    for (const s of SERIES) {
      const parts = all.filter((d) => d.series === s.slug).map((d) => d.seriesPart);
      expect([...parts].sort((a, b) => a! - b!)).toEqual(parts.map((_, i) => i + 1));
    }
  });

  it("only points series at projects that exist", () => {
    const slugs = new Set(projects.map((p) => p.slug));
    for (const s of SERIES) if (s.project) expect(slugs.has(s.project)).toBe(true);
    for (const d of all) if (d.project) expect(slugs.has(d.project)).toBe(true);
  });

  it("uses absolute cover URLs with alt text, so dev.to can render them", () => {
    for (const d of all) {
      if (!d.cover) continue;
      expect(d.cover).toMatch(/^https:\/\//);
      expect(d.coverAlt).toBeTruthy();
    }
    for (const s of SERIES) expect(s.cover).toMatch(/^https:\/\//);
  });

  it("keeps dev.to tag limits: at most 4 tags", () => {
    for (const d of all) if (d.syndicate.includes("devto")) expect(d.tags.length).toBeLessThanOrEqual(4);
  });

  it("returns series parts in reading order", () => {
    const parts = getSeriesParts("your-agent-might-lie");
    expect(parts.map((p) => p.seriesPart)).toEqual([...parts.map((p) => p.seriesPart)].sort());
  });

  it("counts topics across dispatches", () => {
    const topics = getTopics([
      { tags: ["A", "B"] },
      { tags: ["A"] },
    ] as Parameters<typeof getTopics>[0]);
    expect(topics).toEqual([
      { name: "A", count: 2 },
      { name: "B", count: 1 },
    ]);
  });

  it("gives headings ids that match the table of contents", async () => {
    const body = "## The setup\n\ntext\n\n## What `kane-cli` said\n\n```md\n## not a heading\n```\n\n## The setup";
    const headings = extractHeadings(body);
    expect(headings.map((h) => h.id)).toEqual(["the-setup", "what-kane-cli-said", "the-setup-1"]);
    const html = await renderMarkdown(body);
    for (const h of headings) expect(html).toContain(`id="${h.id}"`);
  });

  it("slugifies like GitHub and dev.to", () => {
    expect(slugifyHeading("Three strikes, then a human")).toBe("three-strikes-then-a-human");
  });

  it("renders GitHub-style callouts", async () => {
    const html = await renderMarkdown("> [!NOTE]\n> The log has no summary text.");
    expect(html).toContain('class="callout callout-note"');
    expect(html).not.toContain("[!NOTE]");
    expect(html).toContain("The log has no summary text.");
  });

  it("never turns a double hyphen into a dash", async () => {
    const html = await renderMarkdown("run it with --author");
    expect(html).toContain("--author");
  });
});
