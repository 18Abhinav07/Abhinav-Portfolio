import { notFound } from "next/navigation";
import { HomeView } from "@/components/home/HomeView";
import { JsonLd } from "@/components/JsonLd";
import { getProject, projects } from "@/content/projects";
import { site } from "@/content/site";
import { trips } from "@/content/trips";
import { SITE_URL } from "@/content/site-url";
import { breadcrumbSchema, pageGraph, projectSchema } from "@/content/seo";

// Every deep dive is prerendered; anything else is a 404, never an empty sheet.
export const dynamicParams = false;

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

// The home page with this project's sheet already open, so a shared link lands on the deep dive.
export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  return (
    <>
      <JsonLd
        data={pageGraph(
          projectSchema(p),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: p.name, path: `/work/${p.slug}` },
          ]),
        )}
      />
      <HomeView site={site} projects={projects} trips={trips} initialSlug={p.slug} />
    </>
  );
}
