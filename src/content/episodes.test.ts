import { describe, it, expect } from "vitest";
import { episodes, getEpisode } from "./episodes";

describe("episodes content", () => {
  it("has 8 episodes", () => {
    expect(episodes.length).toBe(8);
  });

  it("has unique slugs", () => {
    const slugs = episodes.map((e) => e.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("indices are sequential and zero-padded", () => {
    episodes.forEach((e, i) => {
      expect(e.index).toBe(String(i + 1).padStart(2, "0"));
    });
  });

  it("unlocked episodes have non-empty body", () => {
    for (const e of episodes) {
      if (!e.locked) {
        expect(e.body.length).toBeGreaterThan(0);
      }
    }
  });

  it("getEpisode returns matching episode", () => {
    expect(getEpisode(episodes[0].slug)?.slug).toBe(episodes[0].slug);
  });
});
