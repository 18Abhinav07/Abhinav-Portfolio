import { describe, it, expect } from "vitest";
import { site, coordinates, dispatches, signals } from "./site";

describe("site content", () => {
  it("nav has 4 entries", () => {
    expect(site.nav.length).toBe(4);
  });

  it("nav hrefs start with /", () => {
    for (const n of site.nav) {
      expect(n.href.startsWith("/")).toBe(true);
    }
  });

  it("coordinates non-empty", () => {
    expect(coordinates.length).toBeGreaterThan(0);
  });

  it("dispatches non-empty", () => {
    expect(dispatches.length).toBeGreaterThan(0);
  });

  it("signals use known icons", () => {
    const allowed = new Set(["chat_bubble", "repeat", "favorite"]);
    for (const s of signals) {
      expect(allowed.has(s.icon)).toBe(true);
    }
  });
});
