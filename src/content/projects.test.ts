import { describe, it, expect } from "vitest";
import { projects, getProject } from "./projects";

describe("projects content", () => {
  it("has at least one project", () => {
    expect(projects.length).toBeGreaterThan(0);
  });

  it("has unique slugs", () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("every project has required fields", () => {
    for (const p of projects) {
      expect(p.slug).toBeTruthy();
      expect(p.name).toBeTruthy();
      expect(p.tagline).toBeTruthy();
      expect(p.ecosystem).toBeTruthy();
      expect(Array.isArray(p.stack)).toBe(true);
    }
  });

  it("getProject returns matching project", () => {
    const first = projects[0];
    expect(getProject(first.slug)?.slug).toBe(first.slug);
  });

  it("getProject returns undefined for unknown slug", () => {
    expect(getProject("__nope__")).toBeUndefined();
  });
});
