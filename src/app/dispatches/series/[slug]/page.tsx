import Link from "next/link";
import { notFound } from "next/navigation";
import { getSeriesParts, formatDate } from "@/content/dispatches";
import { SERIES, getSeries } from "@/content/series";
import { getProject } from "@/content/projects";
import { SITE_URL } from "@/content/site-url";
import { Reveal } from "@/components/Reveal";

const pad = (n: number) => String(n).padStart(2, "0");

// Only series with at least one published part get a page in production.
export function generateStaticParams() {
  return SERIES.filter((s) => getSeriesParts(s.slug).length > 0).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getSeries(slug);
  if (!s) return {};
  const url = `${SITE_URL}/dispatches/series/${s.slug}`;
  return {
    title: `${s.title} · Abhinav Pangaria`,
    description: s.tagline,
    alternates: { canonical: url },
    openGraph: { title: s.title, description: s.tagline, url, type: "website", images: [{ url: s.cover, width: 1600, height: 672, alt: s.coverAlt }] },
    twitter: { card: "summary_large_image", title: s.title, description: s.tagline, images: [s.cover], creator: "@abhinavpangaria" },
  };
}

export default async function SeriesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getSeries(slug);
  if (!s) notFound();
  const parts = getSeriesParts(s.slug, { listed: true });
  if (!parts.length) notFound();

  const project = s.project ? getProject(s.project) : undefined;
  const minutes = parts.reduce((n, p) => n + (parseInt(p.readTime, 10) || 1), 0);
  const topics = [...new Set(parts.flatMap((p) => p.tags))];

  return (
    <section className="px-6 md:px-[80px] py-[120px]">
      <nav className="font-mono text-label-mono uppercase tracking-[0.18em] text-on-surface-variant mb-12">
        <Link href="/dispatches" className="text-on-surface font-bold hover:text-on-surface-variant transition-colors">
          ← Dispatches
        </Link>
        <span className="mx-2">/</span>
        <span>Series</span>
      </nav>

      <div className="grid md:grid-cols-12 gap-column-gap gap-y-10 mb-16">
        <Reveal className="md:col-span-3 font-mono text-label-mono uppercase tracking-[0.18em] text-on-surface-variant" y={20}>
          <span className="inline-block bg-primary text-on-surface font-bold px-2 py-0.5 rounded-sm">Series</span>
          <div className="mt-stack-md">{pad(parts.length)} parts</div>
          <div className="mt-1">{minutes} min total</div>
          <div className="mt-1">Since {formatDate(parts[0].date)}</div>
          <div className="mt-stack-lg flex flex-col gap-2">
            {project && (
              <Link href={`/work/${project.slug}`} className="text-on-surface hover:underline underline-offset-4">
                Case study: {project.name} →
              </Link>
            )}
            {s.repo && (
              <a href={s.repo} target="_blank" rel="noreferrer" className="text-on-surface hover:underline underline-offset-4">
                Source on GitHub ↗
              </a>
            )}
          </div>
        </Reveal>
        <Reveal className="md:col-span-9 max-w-3xl" y={28} delay={0.1}>
          <h1 className="font-display text-display-lg text-on-surface">{s.title}</h1>
          <p className="mt-stack-lg text-body-lg text-on-surface">{s.tagline}</p>
          <p className="mt-stack-md text-body-md text-on-surface-variant">{s.description}</p>
          <div className="mt-stack-lg flex flex-wrap gap-2">
            {topics.map((t) => (
              <Link
                key={t}
                href={`/dispatches?topic=${encodeURIComponent(t)}`}
                className="px-3 py-1.5 rounded-full border border-outline font-mono text-[11px] uppercase tracking-[0.14em] text-on-surface-variant hover:border-on-surface hover:text-on-surface transition-colors"
              >
                {t}
              </Link>
            ))}
          </div>
          <Link
            href={`/dispatches/${parts[0].slug}`}
            className="mt-stack-xl inline-flex items-center gap-3 px-6 py-3 rounded-full bg-on-surface text-white font-mono text-[12px] uppercase tracking-[0.18em] hover:bg-primary hover:text-on-surface transition-colors"
          >
            Start with part 01 <span>→</span>
          </Link>
        </Reveal>
      </div>

      <div className="double-bezel-outer mb-24">
        <div className="double-bezel-inner overflow-hidden aspect-[1600/672] bg-on-surface">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={s.cover} alt={s.coverAlt} className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="font-mono text-label-mono uppercase tracking-[0.18em] text-on-surface-variant mb-8">
        The parts, in reading order
      </div>
      <ol className="border-t border-outline">
        {parts.map((p) => (
          <li key={p.slug} className="border-b border-outline">
            <Link href={`/dispatches/${p.slug}`} className="group grid md:grid-cols-12 gap-column-gap gap-y-5 py-10 md:items-center">
              <div className="md:col-span-1 font-display text-headline-lg text-on-surface group-hover:text-on-surface-variant transition-colors">
                {pad(p.seriesPart ?? 0)}
              </div>
              <div className="md:col-span-4">
                <div className="double-bezel-outer group-hover:ring-primary/40 transition-premium">
                  <div className="double-bezel-inner overflow-hidden aspect-[1600/672] bg-on-surface">
                    {p.cover && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.cover}
                        alt={p.coverAlt ?? ""}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="md:col-span-7 md:pl-6">
                <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-on-surface-variant">
                  {p.draft && <span className="mr-3 bg-secondary text-on-surface font-bold px-2 py-0.5 rounded-sm">Draft</span>}
                  {formatDate(p.date)} · {p.readTime}
                </div>
                <h2 className="mt-3 font-display text-headline-sm text-on-surface decoration-primary decoration-[3px] underline-offset-[6px] group-hover:underline">
                  {p.title}
                </h2>
                <p className="mt-3 text-body-md text-on-surface-variant max-w-2xl">{p.summary}</p>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
