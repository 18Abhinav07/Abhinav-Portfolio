import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getDispatch,
  getDispatches,
  getSeriesParts,
  renderMarkdown,
  extractHeadings,
  formatDate,
  ogImage,
  type Dispatch,
} from "@/content/dispatches";
import { getSeries } from "@/content/series";
import { getProject } from "@/content/projects";
import { dispatchUrl } from "@/content/site-url";
import { topicsForDispatch } from "@/content/topics";
import { articleSchema, breadcrumbSchema, pageGraph } from "@/content/seo";
import { JsonLd } from "@/components/JsonLd";
import { ReadingProgress } from "@/components/dispatches/ReadingProgress";
import { TableOfContents } from "@/components/dispatches/TableOfContents";
import { ProseEnhancer } from "@/components/dispatches/ProseEnhancer";

const pad = (n: number) => String(n).padStart(2, "0");

export function generateStaticParams() {
  return getDispatches().map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = getDispatch(slug);
  if (!d) return {};

  const url = dispatchUrl(d.slug);

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
      images: d.cover ? [{ url: ogImage(d.cover), width: 1200, height: 630, alt: d.coverAlt ?? d.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: d.title,
      description: d.summary,
      creator: "@abhinavpangaria",
      images: d.cover ? [ogImage(d.cover)] : undefined,
    },
  };
}

const label = "font-mono text-label-mono uppercase tracking-[0.18em]";

/** A prev/next card at the foot of a post, with the neighbour's cover. */
function NeighbourCard({ d, direction }: { d: Dispatch; direction: "prev" | "next" }) {
  return (
    <Link href={`/dispatches/${d.slug}`} className={`group block ${direction === "next" ? "sm:text-right" : ""}`}>
      {d.cover && (
        <div className="double-bezel-outer mb-4 group-hover:ring-primary/40 transition-premium">
          <div className="double-bezel-inner overflow-hidden aspect-[1600/672] bg-on-surface">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={d.cover} alt="" loading="lazy" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]" />
          </div>
        </div>
      )}
      <span className={`${label} text-on-surface-variant`}>
        {direction === "prev" ? "← Previous" : "Next →"}
        {d.seriesPart ? ` · Part ${pad(d.seriesPart)}` : ""}
      </span>
      <span className="block mt-stack-sm font-display text-body-lg text-on-surface decoration-primary decoration-[3px] underline-offset-[6px] group-hover:underline">
        {d.title}
      </span>
    </Link>
  );
}

export default async function DispatchPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = getDispatch(slug);
  if (!d) notFound();

  const html = await renderMarkdown(d.body);
  const headings = extractHeadings(d.body);
  const project = d.project ? getProject(d.project) : undefined;
  const series = d.series ? getSeries(d.series) : undefined;
  const url = dispatchUrl(d.slug);

  // Inside a series, neighbours are the adjacent parts in reading order. Otherwise
  // they are the adjacent published posts by date. Drafts are only neighbours in
  // dev (listed), so production never links to a page that does not exist.
  let prev: Dispatch | undefined;
  let next: Dispatch | undefined;
  let parts: Dispatch[] = [];
  if (series) {
    parts = getSeriesParts(series.slug, { listed: true });
    const i = parts.findIndex((p) => p.slug === d.slug);
    prev = parts[i - 1];
    next = parts[i + 1];
  } else {
    const published = getDispatches();
    const i = published.findIndex((p) => p.slug === d.slug);
    prev = i >= 0 ? published[i + 1] : undefined;
    next = i > 0 ? published[i - 1] : undefined;
  }

  const shareText = encodeURIComponent(d.title);
  const shareUrl = encodeURIComponent(url);

  const topics = topicsForDispatch(d.slug);

  return (
    <article className="px-6 md:px-[80px] pt-[120px] pb-[120px]">
      <JsonLd
        data={pageGraph(
          articleSchema(d),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Dispatches", path: "/dispatches" },
            ...(series ? [{ name: series.title, path: `/dispatches/series/${series.slug}` }] : []),
            { name: d.title, path: `/dispatches/${d.slug}` },
          ]),
        )}
      />
      <ReadingProgress targetId="dispatch-body" />
      <ProseEnhancer />

      <header className="max-w-5xl">
        <nav className={`${label} text-on-surface-variant flex flex-wrap items-center gap-x-2 gap-y-1`}>
          <Link href="/dispatches" className="text-on-surface font-bold hover:text-on-surface-variant transition-colors">
            ← Dispatches
          </Link>
          {series && (
            <>
              <span>/</span>
              <Link href={`/dispatches/series/${series.slug}`} className="hover:text-on-surface transition-colors">
                {series.title}
              </Link>
              <span>/</span>
              <span className="text-on-surface">
                Part {pad(d.seriesPart ?? 0)} of {pad(parts.length)}
              </span>
            </>
          )}
        </nav>

        <div className={`${label} mt-stack-xl flex flex-wrap items-center gap-3 text-on-surface-variant`}>
          {d.draft && <span className="bg-secondary text-on-surface font-bold px-2 py-0.5 rounded-sm">Draft</span>}
          <span className="bg-primary text-on-surface font-bold px-2 py-0.5 rounded-sm">{d.kind}</span>
          <span>{formatDate(d.date)}</span>
          <span>·</span>
          <span>{d.readTime}</span>
        </div>

        <h1 className="mt-stack-lg font-display text-display-lg text-on-surface text-balance">{d.title}</h1>
        <p className="mt-stack-lg text-body-lg md:text-[1.3rem] md:leading-[1.55] text-on-surface-variant max-w-3xl">
          {d.summary}
        </p>

        <div className="mt-stack-lg flex flex-wrap items-center gap-2">
          {d.tags.map((t) => (
            <Link
              key={t}
              href={`/dispatches?topic=${encodeURIComponent(t)}`}
              className="px-3 py-1.5 rounded-full border border-outline font-mono text-[11px] uppercase tracking-[0.14em] text-on-surface-variant hover:border-on-surface hover:text-on-surface transition-colors"
            >
              {t}
            </Link>
          ))}
        </div>
      </header>

      {d.cover && (
        <figure className="mt-stack-xl double-bezel-outer">
          <div className="double-bezel-inner overflow-hidden aspect-[1600/672] bg-on-surface">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={d.cover} alt={d.coverAlt ?? ""} className="w-full h-full object-cover" />
          </div>
        </figure>
      )}

      <div className="mt-stack-xl grid lg:grid-cols-12 gap-column-gap">
        <aside className="hidden lg:block lg:col-span-3 order-2 lg:order-1">
          <div className="sticky top-32 flex flex-col gap-10 max-h-[calc(100vh-9rem)] overflow-y-auto pb-6 pr-2">
            <TableOfContents headings={headings} />

            {series && (
              <div>
                <div className={`${label} text-on-surface font-bold mb-4`}>In this series</div>
                <ol className="flex flex-col gap-2">
                  {parts.map((p) => (
                    <li key={p.slug}>
                      <Link
                        href={`/dispatches/${p.slug}`}
                        aria-current={p.slug === d.slug ? "page" : undefined}
                        className={`flex gap-3 text-body-sm leading-snug rounded-md px-2 py-1.5 -mx-2 transition-colors ${
                          p.slug === d.slug ? "bg-primary text-on-surface font-semibold" : "text-on-surface-variant hover:text-on-surface"
                        }`}
                      >
                        <span className="font-mono text-[11px] pt-0.5">{pad(p.seriesPart ?? 0)}</span>
                        <span>{p.title}</span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            <div>
              <div className={`${label} text-on-surface font-bold mb-3`}>Share</div>
              <div className="flex gap-2">
                <a
                  href={`https://x.com/intent/post?text=${shareText}&url=${shareUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-full border border-outline font-mono text-[11px] uppercase tracking-[0.14em] text-on-surface-variant hover:bg-primary hover:border-primary hover:text-on-surface transition-colors"
                >
                  X
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-full border border-outline font-mono text-[11px] uppercase tracking-[0.14em] text-on-surface-variant hover:bg-primary hover:border-primary hover:text-on-surface transition-colors"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </aside>

        <div id="dispatch-body" className="lg:col-span-9 order-1 lg:order-2 min-w-0">
          <div className="dispatch-prose" dangerouslySetInnerHTML={{ __html: html }} />

          {project && (
            <Link
              href={`/work/${project.slug}`}
              className="group mt-stack-xl flex items-center justify-between gap-6 rounded-xl border border-outline bg-white p-6 md:p-8 hover:border-on-surface transition-colors"
            >
              <div>
                <div className={`${label} text-on-surface-variant`}>The project behind this</div>
                <div className="mt-2 font-display text-headline-sm text-on-surface">{project.name}</div>
                <p className="mt-2 text-body-md text-on-surface-variant max-w-xl">{project.tagline}</p>
              </div>
              <span className="shrink-0 w-12 h-12 rounded-full border border-outline flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-colors">
                ↗
              </span>
            </Link>
          )}

          {(prev || next) && (
            <nav className="mt-stack-xl pt-stack-lg border-t border-outline grid sm:grid-cols-2 gap-stack-lg">
              {prev ? <NeighbourCard d={prev} direction="prev" /> : <span />}
              {next && <NeighbourCard d={next} direction="next" />}
            </nav>
          )}

          {series && (
            <Link
              href={`/dispatches/series/${series.slug}`}
              className={`${label} mt-stack-xl inline-block text-on-surface hover:underline underline-offset-4`}
            >
              All {parts.length} parts of {series.title} →
            </Link>
          )}

          {topics.length > 0 && (
            <div className="mt-stack-xl pt-stack-lg border-t border-outline">
              <div className={`${label} text-on-surface-variant mb-4`}>Part of</div>
              <div className="flex flex-wrap gap-3">
                {topics.map((t) => (
                  <Link
                    key={t.slug}
                    href={`/topics/${t.slug}`}
                    className="px-4 py-2 rounded-full border border-outline font-mono text-[11px] uppercase tracking-[0.14em] text-on-surface-variant hover:border-on-surface hover:text-on-surface transition-colors"
                  >
                    {t.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
