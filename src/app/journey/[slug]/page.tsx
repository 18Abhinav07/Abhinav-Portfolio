import Link from "next/link";
import { notFound } from "next/navigation";
import { episodes, getEpisode } from "@/content/episodes";
import { Reveal } from "@/components/Reveal";

export function generateStaticParams() {
  return episodes.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = getEpisode(slug);
  if (!e) return {};
  return { title: `${e.title} · Journey`, description: e.excerpt };
}

export default async function EpisodePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = getEpisode(slug);
  if (!e) notFound();

  const idx = episodes.findIndex((x) => x.slug === e.slug);
  const next = episodes[(idx + 1) % episodes.length];

  return (
    <article>
      <header className="px-6 md:px-[80px] pt-[120px] pb-stack-xl brutalist-rule-b">
        <div className="grid md:grid-cols-12 gap-column-gap">
          <div className="md:col-span-3 font-mono text-label-mono uppercase tracking-[0.18em] text-on-surface font-bold">
            {e.index} · {e.category}
            <div className="mt-stack-md text-on-surface-variant">
              {e.era}
              <br />
              {e.date}
            </div>
          </div>
          <div className="md:col-span-9 max-w-3xl">
            <h1 className="font-display text-display-lg-mobile md:text-display-lg leading-[0.95] tracking-[-0.02em] text-on-surface mb-stack-md">
              {e.title}
            </h1>
            <p className="font-display italic text-headline-md text-on-surface-variant leading-[1.3]">
              {e.subtitle}
            </p>
          </div>
        </div>
      </header>

      <section className="px-6 md:px-[80px] py-[120px]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-column-gap">
          <div className="md:col-span-3 hidden md:block">
            <div className="sticky top-[120px] font-mono text-label-mono uppercase tracking-[0.18em] text-on-surface-variant">
              <div className="inline-block bg-primary text-on-surface px-2 py-0.5 rounded font-bold">Episode {e.index}</div>
              <div className="mt-stack-sm font-bold">{e.date}</div>
            </div>
          </div>

          <div className="md:col-span-9 max-w-3xl">
            {e.body.map((b, i) => {
              if (b.kind === "h2") {
                return (
                  <Reveal key={i} as="h2" y={24}
                    className="font-display text-headline-md tracking-[-0.01em] text-on-surface mt-stack-xl mb-stack-md"
                  >
                    {b.text}
                  </Reveal>
                );
              }
              if (b.kind === "phase") {
                return (
                  <Reveal key={i} y={16}
                    className="mt-stack-xl mb-stack-md brutalist-rule-t pt-stack-md"
                  >
                    <span className={`inline-block font-mono text-label-mono uppercase tracking-[0.18em] text-on-surface font-bold bg-primary px-2 py-0.5 rounded`}>
                      {b.text}
                    </span>
                  </Reveal>
                );
              }
              if (b.kind === "quote") {
                return (
                  <Reveal key={i} y={32}
                    className="my-stack-xl -mx-stack-md md:-mx-stack-xl px-stack-md md:px-stack-xl py-stack-lg border-l-4 border-primary bg-surface-container-low"
                  >
                    <p className="font-display italic text-headline-md leading-[1.3] text-on-surface">
                      “{b.text}”
                    </p>
                  </Reveal>
                );
              }
              return (
                <Reveal key={i} as="p" y={20}
                  className={`editorial-text text-on-surface-variant mb-stack-md ${i === 0 ? "drop-cap" : ""}`}
                >
                  {b.text}
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <nav className="px-6 md:px-[80px] py-[120px] brutalist-rule-t">
        <Link href={`/journey/${next.slug}`} className="group flex items-end justify-between">
          <div>
            <div className="font-mono text-label-mono uppercase tracking-[0.18em] text-on-surface font-bold mb-stack-sm">
              Next episode · {next.index}
            </div>
            <div className="font-display text-headline-lg tracking-[-0.02em] text-on-surface group-hover:opacity-80 transition-opacity">
              {next.title}
            </div>
          </div>
          <div className="font-mono text-label-mono uppercase tracking-[0.18em] text-on-surface-variant group-hover:text-on-surface transition-colors font-bold">
            →
          </div>
        </Link>
      </nav>
    </article>
  );
}
