#!/usr/bin/env node
/**
 * Post-deploy check: every URL the sitemap claims exists must return 200, and the
 * machine-readable surfaces (robots, sitemap, llms.txt, the JSON-LD on a page)
 * must actually be there. A canonical that 404s is worse than no canonical, and
 * the only place that can be proven is the deployed origin.
 *
 *   npm run seo:check                      checks the live site
 *   npm run seo:check -- http://localhost:3000
 */
const base = (process.argv[2] || "https://abhinavpangaria.pages.dev").replace(/\/$/, "");
const swap = (u) => u.replace("https://abhinavpangaria.pages.dev", base);

const failures = [];
const note = (msg) => failures.push(msg);

const get = async (url) => {
  try {
    const res = await fetch(url, { redirect: "manual" });
    return { status: res.status, body: res.status === 200 ? await res.text() : "" };
  } catch (err) {
    return { status: 0, body: "", error: String(err) };
  }
};

// The page list comes from the deployed sitemap, not from the source, so this
// checks what the crawler will actually be handed.
const sitemap = await get(`${base}/sitemap.xml`);
if (sitemap.status !== 200) {
  console.error(`sitemap.xml returned ${sitemap.status || sitemap.error}. Nothing else can be checked.`);
  process.exit(1);
}
const pages = [...sitemap.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => swap(m[1]));
console.log(`Checking ${pages.length} pages on ${base}\n`);

let ok = 0;
for (const url of pages) {
  const { status, error } = await get(url);
  if (status === 200) {
    ok += 1;
  } else {
    note(`${status || error} ${url}`);
    console.log(`  FAIL ${status || "network"}  ${url}`);
  }
}
console.log(`\n${ok}/${pages.length} pages returned 200`);

const surfaces = [
  ["/robots.txt", (b) => b.includes("Sitemap:") && b.includes("GPTBot")],
  ["/sitemap.xml", (b) => b.includes("<urlset") && b.includes("/topics/")],
  ["/llms.txt", (b) => b.startsWith("# Abhinav Pangaria")],
  ["/llms-full.txt", (b) => b.length > 20000],
  ["/dispatches/rss.xml", (b) => b.includes("<rss")],
  ["/", (b) => b.includes('application/ld+json') && b.includes('"@type":"Person"')],
];

console.log("");
for (const [path, valid] of surfaces) {
  const { status, body } = await get(base + path);
  const good = status === 200 && valid(body);
  console.log(`  ${good ? "ok  " : "FAIL"}  ${path}`);
  if (!good) note(`surface ${path} (status ${status})`);
}

if (failures.length) {
  console.log(`\n${failures.length} problem(s):`);
  for (const f of failures) console.log(`  - ${f}`);
  process.exit(1);
}
console.log("\nAll good.");
