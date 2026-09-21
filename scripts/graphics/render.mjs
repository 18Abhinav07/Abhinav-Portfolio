#!/usr/bin/env node
/**
 * Render every graphic in templates.mjs to PNG with headless Chrome.
 *
 *   node scripts/graphics/render.mjs            render all
 *   node scripts/graphics/render.mjs cover-2    render the ones whose name contains "cover-2"
 *
 * Output lands in scripts/graphics/out/ (gitignored). Upload with
 *   node scripts/upload-image.mjs dispatches/agents-lie scripts/graphics/out/*.png
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { graphics } from "./templates.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, "out");
const html = join(out, "html");
mkdirSync(html, { recursive: true });

const CHROME =
  process.env.CHROME_BIN ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const filter = process.argv[2];
const selected = graphics.filter((g) => !filter || g.name.includes(filter));
if (!selected.length) {
  console.error(`No graphic matches "${filter}".`);
  process.exit(1);
}

for (const g of selected) {
  const src = join(html, `${g.name}.html`);
  const png = join(out, `${g.name}.png`);
  writeFileSync(src, g.html);
  execFileSync(
    CHROME,
    [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      "--force-device-scale-factor=1",
      `--window-size=${g.width},${g.height}`,
      // Web fonts load over the network; give them time before the capture.
      "--virtual-time-budget=8000",
      `--screenshot=${png}`,
      pathToFileURL(src).href,
    ],
    { stdio: "ignore" },
  );
  console.log(`${g.name}.png  ${g.width}x${g.height}`);
}
