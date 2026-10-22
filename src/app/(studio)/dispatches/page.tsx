import { getListedDispatches, formatDate, getTopics, KINDS } from "@/content/dispatches";
import { SERIES, getSeries } from "@/content/series";
import { Reveal } from "@/components/Reveal";
import { DispatchIndex, type IndexPost } from "@/components/dispatches/DispatchIndex";

export const metadata = {
  title: "Dispatches · Abhinav Pangaria",
  description:
    "Technical teardowns, product thinking, and notes I'd have wanted to read earlier. Written once, here.",
  alternates: {
    types: { "application/rss+xml": "/dispatches/rss.xml" },
  },
};

export default function DispatchesPage() {
  // Includes drafts in dev only. See getListedDispatches.
  const dispatches = getListedDispatches();
  const topics = getTopics(dispatches);

  // Only what the client needs: the markdown body stays on the server.
  const posts: IndexPost[] = dispatches.map((d) => {
    const s = d.series ? getSeries(d.series) : undefined;
    return {
      slug: d.slug,
      title: d.title,
      summary: d.summary,
      date: d.date,
      dateLabel: formatDate(d.date),
      minutes: parseInt(d.readTime, 10) || 1,
      readTime: d.readTime,
      kind: d.kind,
      tags: d.tags,
      cover: d.cover,
      coverAlt: d.coverAlt,
      draft: d.draft,
      series: s && d.seriesPart ? { slug: s.slug, title: s.title, part: d.seriesPart } : undefined,
    };
  });
  const kinds = KINDS.filter((k) => dispatches.some((d) => d.kind === k));

  return (
    <section className="px-6 md:px-[80px] py-[120px]">
      <div className="grid md:grid-cols-12 gap-column-gap mb-16 md:mb-20">
        <Reveal
          className="md:col-span-3 font-mono text-label-mono uppercase tracking-[0.18em] text-on-surface font-bold"
          y={20}
        >
          05 / Dispatches
          <div className="mt-stack-md text-on-surface-variant font-normal">
            {dispatches.length.toString().padStart(2, "0")} pieces
            <span className="block mt-1">{topics.length.toString().padStart(2, "0")} topics</span>
          </div>
          <a
            href="/dispatches/rss.xml"
            className="mt-stack-sm block text-on-surface-variant font-normal hover:text-on-surface transition-colors"
          >
            RSS →
          </a>
        </Reveal>
        <Reveal className="md:col-span-9 max-w-2xl" y={28} delay={0.1}>
          <h1 className="font-display text-headline-lg leading-[1.05] tracking-[-0.02em] text-on-surface mb-stack-md">
            Everything I&apos;m still{" "}
            <em className="inline-block bg-primary text-on-surface px-3 py-1 rounded-md not-italic font-bold">
              working out in public
            </em>
          </h1>
          <p className="text-body-md text-on-surface-variant">
            Teardowns, product thinking, and notes I&apos;d have wanted to read earlier.
            Written once, here. Syndicated where it fits.
          </p>
        </Reveal>
      </div>

      {dispatches.length === 0 ? (
        <p className="font-mono text-label-mono uppercase tracking-[0.18em] text-on-surface-variant">
          First dispatch lands shortly.
        </p>
      ) : (
        <DispatchIndex posts={posts} series={SERIES} topics={topics} kinds={kinds} />
      )}
    </section>
  );
}
