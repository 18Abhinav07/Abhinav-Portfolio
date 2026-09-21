import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

/**
 * House style is enforced, not merely documented. See CLAUDE.md.
 *
 * Em dashes and punctuating en dashes are banned everywhere in this project:
 * UI copy, dispatch prose, code comments, frontmatter, and syndicated output.
 * A doc-only rule regresses the first time anyone writes quickly; this does not.
 */

const EM = String.fromCharCode(0x2014); // literal is avoided so this file does not flag itself
const EN = String.fromCharCode(0x2013);

const ROOTS = ["src", "scripts"];
const EXTS = new Set([".ts", ".tsx", ".js", ".mjs", ".md", ".json", ".css"]);
const SKIP_DIRS = new Set(["node_modules", ".next", "dist"]);

const walk = (dir: string, out: string[] = []): string[] => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (EXTS.has(path.extname(entry.name))) out.push(full);
  }
  return out;
};

const files = ROOTS.filter((r) => fs.existsSync(r)).flatMap((r) => walk(r));

describe("house style", () => {
  it("finds files to check (guards against a silently empty sweep)", () => {
    expect(files.length).toBeGreaterThan(10);
  });

  it("uses no em dashes or punctuating en dashes anywhere", () => {
    const offenders: string[] = [];

    for (const file of files) {
      const lines = fs.readFileSync(file, "utf8").split("\n");
      lines.forEach((line, i) => {
        if (line.includes(EM) || line.includes(EN)) {
          offenders.push(`${file}:${i + 1}  ${line.trim().slice(0, 90)}`);
        }
      });
    }

    expect(
      offenders,
      `Em/en dashes are banned (CLAUDE.md). Use a comma, colon, semicolon, ` +
        `parentheses, or two sentences instead:\n${offenders.join("\n")}`,
    ).toEqual([]);
  });
});
