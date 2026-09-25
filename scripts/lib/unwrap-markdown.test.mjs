import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";
import { unwrapMarkdown } from "./unwrap-markdown.mjs";

describe("unwrapMarkdown", () => {
  it("joins a wrapped paragraph into one line", () => {
    expect(unwrapMarkdown("one\ntwo\nthree")).toBe("one two three");
  });

  it("keeps paragraphs, headings and lists apart", () => {
    const src = "## Head\n\npara one\nstill one\n\n- item a\n  more a\n- item b\n\n1. first\n2. second";
    expect(unwrapMarkdown(src)).toBe("## Head\n\npara one still one\n\n- item a more a\n- item b\n\n1. first\n2. second");
  });

  it("leaves code fences and tables untouched", () => {
    const src = "```js\nconst a = 1;\nconst b = 2;\n```\nafter\n\n| a | b |\n|---|---|\n| 1 | 2 |";
    expect(unwrapMarkdown(src)).toBe(src);
  });

  it("joins a wrapped blockquote and keeps intentional breaks", () => {
    expect(unwrapMarkdown("> quoted\n> more")).toBe("> quoted more");
    expect(unwrapMarkdown("line  \nnext")).toBe("line  \nnext");
  });

  it("leaves no forced line breaks in any syndicated dispatch, and changes nothing on the site", () => {
    const soft = new MarkdownIt({ html: true });
    const devto = new MarkdownIt({ html: true, breaks: true });
    const norm = (h) => h.replace(/\s+/g, " ").replace(/> </g, "><").trim();
    const dir = path.join(process.cwd(), "src", "content", "dispatches");
    const posts = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".md"))
      .map((f) => matter(fs.readFileSync(path.join(dir, f), "utf8")))
      .filter(({ data }) => (data.syndicate ?? []).includes("devto"));
    expect(posts.length).toBeGreaterThan(0);
    for (const { content } of posts) {
      const out = unwrapMarkdown(content);
      expect(norm(soft.render(out))).toBe(norm(soft.render(content)));
      expect(devto.render(out)).not.toContain("<br>");
    }
  });
});
