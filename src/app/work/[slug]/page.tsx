import { notFound } from "next/navigation";
import { getProject, projects } from "@/content/projects";
import { ProjectContent } from "@/components/ProjectContent";
import { getDispatches } from "@/content/dispatches";
import { SERIES } from "@/content/series";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: `${p.name} · Abhinav Pangaria`,
    description: p.tagline,
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

  return (
    <ProjectContent
      project={p}
      nextProject={next}
      writing={writing}
      series={series.map((s) => ({ slug: s.slug, title: s.title }))}
    />
  );
}
