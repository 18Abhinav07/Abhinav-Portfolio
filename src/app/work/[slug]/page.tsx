import { notFound } from "next/navigation";
import { getProject, projects } from "@/content/projects";
import { ProjectContent } from "@/components/ProjectContent";

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

  return <ProjectContent project={p} nextProject={next} />;
}
