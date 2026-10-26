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

  it("orders the newest work first", () => {
    expect(projects.slice(0, 7).map((p) => p.slug)).toEqual([
      "sieve",
      "voluntas",
      "dart",
      "loom",
      "guardiankane",
      "agentops",
      "zidd",
    ]);
  });

  it("numbers projects in display order", () => {
    projects.forEach((p, i) => expect(p.index).toBe(String(i + 1).padStart(2, "0")));
  });

  it("uses absolute https links, or a self-hosted embed path", () => {
    for (const p of projects) {
      for (const u of [p.liveUrl, p.githubUrl, p.presentationUrl, p.docsUrl, p.blogUrl, p.apiUrl]) {
        if (u) expect(u).toMatch(/^https:\/\//);
      }
      if (p.embed) expect(p.embed.src).toMatch(/^(https:\/\/|\/embeds\/)/);
      for (const post of p.posts ?? []) expect(post.url).toMatch(/^https:\/\/dev\.to\/abhinav_pangaria\//);
    }
  });

  it("lists Guardian Kane's five posts", () => {
    expect(getProject("guardiankane")?.posts).toHaveLength(5);
  });
});
