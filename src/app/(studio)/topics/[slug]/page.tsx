import Link from "next/link";
import { notFound } from "next/navigation";
import { TOPICS, getTopic, resolveTopic } from "@/content/topics";
import { formatDate } from "@/content/dispatches";
import { SITE_URL } from "@/content/site-url";
import { breadcrumbSchema, pageGraph, topicSchema } from "@/content/seo";
import { JsonLd } from "@/components/JsonLd";
import { Reveal } from "@/components/Reveal";

export function generateStaticParams() {
  return TOPICS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = getTopic(slug);
  if (!t) return {};
  const url = `${SITE_URL}/topics/${t.slug}`;
  return {
    title: `${t.title} · Abhinav Pangaria`,
    description: t.answer,
    keywords: t.keywords,
    alternates: { canonical: url },
    openGraph: { title: t.headline, description: t.answer, url, type: "article" },
    twitter: {
      card: "summary_large_image",
      title: t.headline,
      description: t.answer,
      creator: "@abhinavpangaria",
    },
  };
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const base = getTopic(slug);
  if (!base) notFound();
  const t = resolveTopic(base);

  return (
    <section className="px-6 md:px-[80px] py-[120px]">
      <JsonLd
        data={pageGraph(
          topicSchema(base),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Topics", path: "/topics" },
            { name: t.title, path: `/topics/${t.slug}` },
          ]),
        )}
      />

      <nav className="font-mono text-label-mono uppercase tracking-[0.18em] text-on-surface-variant mb-12">
        <Link
          href="/topics"
          className="text-on-surface font-bold hover:text-on-surface-variant transition-colors"
        >
          ← Topics
        </Link>
        <span className="mx-2">/</span>
        <span>{t.index}</span>
      </nav>

      <div className="grid md:grid-cols-12 gap-column-gap gap-y-10 mb-20">
        <Reveal
          className="md:col-span-3 font-mono text-label-mono uppercase tracking-[0.18em] text-on-surface-variant"
          y={20}
        >
          <span className="inline-block bg-primary text-on-surface font-bold px-2 py-0.5 rounded-sm">
            Topic {t.index}
          </span>
          <div className="mt-stack-md">
            {t.projectEntries.length} {t.projectEntries.length === 1 ? "system" : "systems"}
          </div>
          {t.dispatchEntries.length > 0 && (
            <div className="mt-1">{t.dispatchEntries.length} dispatches</div>
          )}
        </Reveal>

        {/*
          The answer is plain text, first thing after the heading, and deliberately
          not inside a reveal that starts at opacity 0. This is the passage an
          answer engine lifts, so it renders visible in the server HTML.
        */}
        <div className="md:col-span-9 max-w-3xl">
          <h1 className="font-display text-display-lg-mobile md:text-display-lg leading-[0.95] tracking-[-0.02em] text-on-surface">
            {t.headline}
          </h1>
          <p className="mt-stack-lg font-display italic text-headline-md text-on-surface-variant leading-[1.3]">
            {t.question}
          </p>
          <p className="mt-stack-lg text-body-lg text-on-surface">{t.answer}</p>
        </div>
      </div>

      {t.projectEntries.length > 0 && (
        <>
          <div className="font-mono text-label-mono uppercase tracking-[0.18em] text-on-surface-variant mb-8">
            What I built
          </div>
          <ol className="border-t border-outline mb-24">
            {t.projectEntries.map((p) => (
              <li key={p.slug} className="border-b border-outline">
                <Link
                  href={`/work/${p.slug}`}
                  className="group grid md:grid-cols-12 gap-column-gap gap-y-4 py-10"
                >
                  <div className="md:col-span-3 font-mono text-[11px] uppercase tracking-[0.18em] text-on-surface-variant">
                    {p.year}
                    <br />
                    {p.ecosystem}
                  </div>
                  <div className="md:col-span-9 max-w-3xl">
                    <h3 className="font-display text-headline-sm text-on-surface decoration-primary decoration-[3px] underline-offset-[6px] group-hover:underline">
                      {p.name}
                    </h3>
                    <p className="mt-3 text-body-md text-on-surface-variant">{p.tagline}</p>
                    <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-on-surface-variant">
                      {p.stack.join(" · ")}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        </>
      )}

      {t.dispatchEntries.length > 0 && (
        <>
          <div className="font-mono text-label-mono uppercase tracking-[0.18em] text-on-surface-variant mb-8">
            What I wrote
          </div>
          <ol className="border-t border-outline mb-24">
            {t.dispatchEntries.map((d) => (
              <li key={d.slug} className="border-b border-outline">
                <Link
                  href={`/dispatches/${d.slug}`}
                  className="group grid md:grid-cols-12 gap-column-gap gap-y-4 py-10"
                >
                  <div className="md:col-span-3 font-mono text-[11px] uppercase tracking-[0.18em] text-on-surface-variant">
                    {formatDate(d.date)}
                    <br />
                    {d.readTime}
                  </div>
                  <div className="md:col-span-9 max-w-3xl">
                    <h3 className="font-display text-headline-sm text-on-surface decoration-primary decoration-[3px] underline-offset-[6px] group-hover:underline">
                      {d.title}
                    </h3>
                    <p className="mt-3 text-body-md text-on-surface-variant">{d.summary}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        </>
      )}

      <div className="font-mono text-label-mono uppercase tracking-[0.18em] text-on-surface-variant mb-6">
        Related
      </div>
      <div className="flex flex-wrap gap-3">
        {t.relatedTopics.map((r) => (
          <Link
            key={r.slug}
            href={`/topics/${r.slug}`}
            className="px-4 py-2 rounded-full border border-outline font-mono text-[11px] uppercase tracking-[0.14em] text-on-surface-variant hover:border-on-surface hover:text-on-surface transition-colors"
          >
            {r.title}
          </Link>
        ))}
      </div>
    </section>
  );
}
