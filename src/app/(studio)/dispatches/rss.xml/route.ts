import { getDispatches } from "@/content/dispatches";
import { SITE_URL } from "@/content/site-url";

export const dynamic = "force-static";

const SITE = SITE_URL;

const escape = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/**
 * How developer-audience readers actually subscribe. Summary-only by design;
 * the full piece lives on the canonical page.
 */
export function GET() {
  const dispatches = getDispatches();

  const items = dispatches
    .map(
      (d) => `    <item>
      <title>${escape(d.title)}</title>
      <link>${SITE}/dispatches/${d.slug}</link>
      <guid isPermaLink="true">${SITE}/dispatches/${d.slug}</guid>
      <pubDate>${new Date(`${d.date}T00:00:00Z`).toUTCString()}</pubDate>
      <description>${escape(d.summary)}</description>
${d.tags.map((t) => `      <category>${escape(t)}</category>`).join("\n")}
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Dispatches · Abhinav Pangaria</title>
    <link>${SITE}/dispatches</link>
    <description>Technical dispatches on agent verification, autonomous spend governance, and proving AI agents are actually done.</description>
    <language>en</language>
    <atom:link href="${SITE}/dispatches/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
