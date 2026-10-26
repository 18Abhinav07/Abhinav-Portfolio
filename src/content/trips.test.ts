import { describe, it, expect } from "vitest";
import { trips } from "./trips";

describe("trips", () => {
  it("has the five places", () => {
    expect(trips.map((t) => t.loc.split(",")[0])).toEqual(["Dawki", "Shillong", "Goa", "Champawat", "Mawsynram"]);
  });

  it("serves every cover and video as a sized mp4, never the original file", () => {
    for (const t of trips) {
      expect(t.cover).toMatch(/\/upload\/w_360,[^/]*\/.*\.mp4$/);
      expect(t.poster).toMatch(/\.jpg$/);
      for (const m of t.media) {
        expect(m.src).not.toContain("fl_original");
        expect(m.thumb).toContain("w_240");
        if (m.type === "video") expect(m.src).toMatch(/\.mp4$/);
      }
    }
  });
});
