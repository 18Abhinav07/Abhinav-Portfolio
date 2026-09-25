/**
 * Join hard-wrapped paragraph lines back into one line each.
 *
 * The dispatch sources wrap prose at about 88 columns. The portfolio renderer
 * treats a single newline as a space, but dev.to renders it as a <br>, so every
 * wrapped paragraph comes out broken into short lines there.
 *
 * Code fences, headings, tables, images, rules and HTML are left alone. List
 * items and blockquotes keep their marker and absorb their continuation lines.
 * A line ending in two spaces or a backslash is an intentional break and stays.
 */

const FENCE = /^\s*(```|~~~)/;
// Lines that open a new block and must never be glued onto the line above.
const BLOCK_START = /^\s*(#{1,6}\s|[-*+]\s|\d+[.)]\s|>|\||!\[|<|(-{3,}|\*{3,}|_{3,})\s*$)/;
// Lines that must never absorb the line below.
const NO_CONTINUE = /^\s*(#{1,6}\s|\||!\[.*\)\s*$|<|(-{3,}|\*{3,}|_{3,})\s*$)/;

export function unwrapMarkdown(body) {
  const out = [];
  let inFence = false;

  for (const line of body.split("\n")) {
    if (FENCE.test(line)) {
      inFence = !inFence;
      out.push(line);
      continue;
    }
    if (inFence || line.trim() === "") {
      out.push(line);
      continue;
    }

    const prev = out.length ? out[out.length - 1] : "";
    const prevOpen =
      prev.trim() !== "" && !NO_CONTINUE.test(prev) && !/( {2}|\\)$/.test(prev) && !isFenceClose(out);

    // "> a" followed by "> b" is one quoted paragraph.
    if (/^\s*>/.test(line) && /^\s*>\s*\S/.test(prev) && prevOpen && !/^\s*>\s*\*\*\w+:\*\*\s*$/.test(prev)) {
      const text = line.replace(/^\s*>\s?/, "").trim();
      if (text && !BLOCK_START.test(text)) {
        out[out.length - 1] = `${prev.trimEnd()} ${text}`;
        continue;
      }
    }

    if (prevOpen && !BLOCK_START.test(line)) {
      out[out.length - 1] = `${prev.trimEnd()} ${line.trim()}`;
      continue;
    }

    out.push(line);
  }

  return out.join("\n");
}

// The closing ``` of a fence must not swallow the prose line after it.
function isFenceClose(out) {
  return out.length > 0 && FENCE.test(out[out.length - 1]);
}
