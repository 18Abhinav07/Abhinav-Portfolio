import { describe, it, expect } from "vitest";
import {
  getDispatches,
  getDispatch,
  readingTime,
  renderMarkdown,
  formatDate,
} from "./dispatches";
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
    expect(html).toContain("<h2>");
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
});
