import type { MetadataRoute } from "next";
import { sitemapEntries } from "@/content/seo";

/**
 * /sitemap.xml, built from the same content modules the pages render. Static, so
 * nothing runs at request time on Cloudflare Pages.
 */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapEntries().map((e) => ({
    url: e.url,
    changeFrequency: e.changeFrequency,
    priority: e.priority,
    ...(e.lastModified ? { lastModified: new Date(`${e.lastModified}T00:00:00Z`) } : {}),
  }));
}
