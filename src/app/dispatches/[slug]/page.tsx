import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getDispatch,
  getDispatches,
  renderMarkdown,
  formatDate,
} from "@/content/dispatches";
import { getProject } from "@/content/projects";

export function generateStaticParams() {
  return getDispatches().map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = getDispatch(slug);
  if (!d) return {};

  const url = `https://abhinavpangaria.com/dispatches/${d.slug}`;

  return {
    title: `${d.title} · Abhinav Pangaria`,
    description: d.summary,
    // Points home unless the piece genuinely originated elsewhere.
    alternates: { canonical: d.canonical ?? url },
    openGraph: {
      title: d.title,
      description: d.summary,
      type: "article",
      url,
      publishedTime: d.date,
      tags: d.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: d.title,
      description: d.summary,
      creator: "@abhinavpangaria",
    },
  };
}

export default async function DispatchPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = getDispatch(slug);
  if (!d) notFound();

  const html = await renderMarkdown(d.body);
  const project = d.project ? getProject(d.project) : undefined;

  return (
    <article className="px-6 md:px-[80px] py-[120px]">
      <div className="grid md:grid-cols-12 gap-column-gap">
        <div className="md:col-span-3 mb-stack-xl md:mb-0">
          <div className="md:sticky md:top-32 font-mono text-label-mono uppercase tracking-[0.18em] text-on-surface-variant">
            <Link href="/dispatches" className="text-on-surface font-bold hover:text-on-surface-variant transition-colors">
              ← Dispatches
            </Link>
            <div className="mt-stack-lg">{formatDate(d.date)}</div>
            <div className="mt-1">{d.readTime}</div>
            {project && (
              <Link
                href={`/work/${project.slug}`}
                className="mt-stack-lg block text-on-surface hover:text-on-surface-variant transition-colors"
              >
                Case study: {project.name} →
              </Link>
            )}
          </div>
        </div>

        <div className="md:col-span-9 max-w-3xl">
          <h1 className="font-display text-headline-lg leading-[1.1] tracking-[-0.02em] text-on-surface mb-stack-lg">
            {d.title}
          </h1>
          <p className="text-body-lg text-on-surface-variant mb-stack-xl pb-stack-lg border-b border-outline">
            {d.summary}
          </p>

          <div className="dispatch-prose" dangerouslySetInnerHTML={{ __html: html }} />

          <div className="mt-stack-xl pt-stack-lg border-t border-outline flex flex-wrap items-center gap-stack-md">
            <a
              href={`https://x.com/intent/post?text=${encodeURIComponent(d.title)}&url=${encodeURIComponent(`https://abhinavpangaria.com/dispatches/${d.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-label-mono uppercase tracking-[0.18em] text-on-surface border border-outline rounded-pill px-4 py-2 hover:bg-primary transition-colors"
            >
              Share on X
            </a>
            {project && (
              <Link
                href={`/work/${project.slug}`}
                className="font-mono text-label-mono uppercase tracking-[0.18em] text-on-surface-variant hover:text-on-surface transition-colors"
              >
                Read the {project.name} case study →
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
