import { describe, it, expect } from "vitest";
import { site } from "./site";

describe("site content", () => {
  it("has a name, an email, and a bio", () => {
    expect(site.name).toBeTruthy();
    expect(site.email).toMatch(/@/);
    expect(site.longBio.length).toBeGreaterThan(80);
  });

  it("links every social profile over https", () => {
    for (const s of site.socials) expect(s.url).toMatch(/^https:\/\//);
  });
});
