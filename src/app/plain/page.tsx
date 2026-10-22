import type { Metadata } from "next";
import { PlainView } from "@/components/plain/PlainView";
import { site } from "@/content/site";
import { projects } from "@/content/projects";
import { episodes } from "@/content/episodes";
import { formatDate, getListedDispatches } from "@/content/dispatches";
import { SITE_URL } from "@/content/site-url";

export const metadata: Metadata = {
  title: "Abhinav Pangaria · Index",
  description: site.heroLine,
  alternates: { canonical: `${SITE_URL}/plain` },
};

// The Index view: the same content as the Studio, on one quiet scroll.
export default function PlainPage() {
  const posts = getListedDispatches()
    .slice(0, 3)
    .map((d) => ({ slug: d.slug, title: d.title, kind: d.kind, date: formatDate(d.date), readTime: d.readTime }));
  return <PlainView site={site} projects={projects} episodes={episodes} posts={posts} />;
}
