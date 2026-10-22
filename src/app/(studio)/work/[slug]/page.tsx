import { notFound } from "next/navigation";
import { getProject, projects } from "@/content/projects";
import { ProjectContent } from "@/components/ProjectContent";
import { getDispatches } from "@/content/dispatches";
import { SERIES } from "@/content/series";
import { topicsForProject } from "@/content/topics";
import { SITE_URL } from "@/content/site-url";
import { breadcrumbSchema, pageGraph, projectSchema } from "@/content/seo";
import { JsonLd } from "@/components/JsonLd";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  const url = `${SITE_URL}/work/${p.slug}`;
  return {
    title: `${p.name} · Abhinav Pangaria`,
    description: p.description,
    keywords: [...p.stack, p.ecosystem, p.name],
    alternates: { canonical: url },
    openGraph: {
      title: `${p.name}: ${p.tagline}`,
      description: p.description,
      url,
      type: "article",
      ...(p.heroImage ? { images: [{ url: p.heroImage, alt: `${p.name} interface` }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${p.name}: ${p.tagline}`,
      description: p.tagline,
      creator: "@abhinavpangaria",
      ...(p.heroImage ? { images: [p.heroImage] } : {}),
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  const next = projects[(projects.findIndex((x) => x.slug === p.slug) + 1) % projects.length];

  // Writing about this project, grouped by series (in series.json order), each in part
  // order; posts outside a series come last, newest first.
  const posts = getDispatches().filter((d) => d.project === p.slug);
  const series = SERIES.filter((s) => s.project === p.slug);
  const rank = (slug?: string) => {
    const i = series.findIndex((s) => s.slug === slug);
    return i === -1 ? series.length : i;
  };
  const writing = posts
    .sort(
      (a, b) =>
        rank(a.series) - rank(b.series) ||
        (a.seriesPart ?? 99) - (b.seriesPart ?? 99) ||
        b.date.localeCompare(a.date),
    )
    .map((d) => ({ slug: d.slug, title: d.title, part: d.seriesPart, series: d.series }));

  // The hubs this project belongs to, so a case study is never a dead end for a
  // reader (or a crawler) following the subject rather than the project.
  const topics = topicsForProject(p.slug).map((t) => ({ slug: t.slug, title: t.title }));

  return (
    <>
    <JsonLd
      data={pageGraph(
        projectSchema(p),
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Work", path: "/work" },
          { name: p.name, path: `/work/${p.slug}` },
        ]),
      )}
    />
    <ProjectContent
      project={p}
      nextProject={next}
      writing={writing}
      series={series.map((s) => ({ slug: s.slug, title: s.title }))}
      topics={topics}
    />
    </>
  );
}
