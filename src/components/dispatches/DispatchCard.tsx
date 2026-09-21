import Link from "next/link";

export type DispatchCardData = {
  href: string;
  title: string;
  summary: string;
  cover?: string;
  coverAlt?: string;
  /** Small label above the title: the kind, or "Series" for a parent card. */
  eyebrow: string;
  /** Right-aligned badge on the image, e.g. "Part 02" or "6 parts". */
  badge?: string;
  meta: string[];
  tags: string[];
  draft?: boolean;
  /** Parent series cards span wider and get a stacked-paper edge. */
  variant?: "post" | "series";
};

/**
 * One card for every place a dispatch or series is listed. Plain server component:
 * the hover motion is CSS only, so a grid of these ships no JavaScript.
 */
export function DispatchCard({ data, priority = false }: { data: DispatchCardData; priority?: boolean }) {
  const series = data.variant === "series";
  return (
    <Link href={data.href} className="group block h-full" aria-label={data.title}>
      <article
        className={
          series
            ? "relative h-full flex flex-col md:grid md:grid-cols-12 md:gap-x-12 md:items-center"
            : "relative h-full flex flex-col"
        }
      >
        <div className={series ? "relative md:col-span-7" : "relative"}>
        {series && (
          <>
            {/* Two offset sheets behind the cover read as "more than one piece" at a glance. */}
            <div aria-hidden className="absolute inset-x-8 -top-4 h-8 rounded-xl border border-outline bg-surface-container" />
            <div aria-hidden className="absolute inset-x-4 -top-2 h-8 rounded-xl border border-outline bg-surface-container-lowest" />
          </>
        )}
        <div className="relative double-bezel-outer group-hover:ring-primary/40 transition-premium">
          <div className="relative double-bezel-inner overflow-hidden aspect-[1600/672] bg-on-surface">
            {data.cover ? (
              // Plain img on purpose: covers are already sized and compressed by Cloudinary
              // (f_auto,q_auto), and next/image is unoptimized on this deploy target anyway.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.cover}
                alt={data.coverAlt ?? ""}
                loading={priority ? "eager" : "lazy"}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.03]"
              />
            ) : (
              <div className="absolute inset-0 p-6 md:p-8 flex items-end bg-[radial-gradient(90%_120%_at_85%_0%,rgba(191,255,0,0.25),transparent_60%)]">
                <span className="font-display text-headline-sm text-white leading-tight line-clamp-3">{data.title}</span>
              </div>
            )}
            <div className="absolute top-4 left-4 flex gap-2">
              {data.draft && (
                <span className="px-2 py-1 rounded-sm bg-secondary text-on-surface font-mono font-bold text-[10px] uppercase tracking-[0.2em]">
                  Draft
                </span>
              )}
            </div>
            {data.badge && (
              <span className="absolute top-4 right-4 px-3 py-1.5 rounded-full border border-white/20 bg-on-surface/70 backdrop-blur-md font-mono text-[10px] text-white uppercase tracking-[0.2em]">
                {data.badge}
              </span>
            )}
          </div>
        </div>
        </div>

        <div className={`mt-6 px-1 flex-1 flex flex-col ${series ? "md:col-span-5 md:mt-0" : ""}`}>
          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em]">
            <span className={series ? "bg-primary text-on-surface font-bold px-2 py-0.5 rounded-sm" : "text-on-surface font-bold"}>
              {data.eyebrow}
            </span>
            <span className="text-on-surface-variant">{data.meta.join(" · ")}</span>
          </div>
          <h3
            className={`mt-3 font-display text-on-surface tracking-[-0.01em] decoration-primary decoration-[3px] underline-offset-[6px] group-hover:underline ${
              series ? "text-headline-md" : "text-headline-sm"
            }`}
          >
            {data.title}
          </h3>
          <p className="mt-3 text-body-md text-on-surface-variant line-clamp-3">{data.summary}</p>
          <div className="mt-auto pt-5 flex items-end justify-between gap-4">
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {data.tags.slice(0, 3).map((t) => (
                <span key={t} className="font-mono font-semibold text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">
                  #{t.replace(/\s+/g, "")}
                </span>
              ))}
            </div>
            <span className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border border-outline text-on-surface group-hover:border-primary group-hover:bg-primary transition-all duration-500 text-[10px] uppercase font-mono tracking-widest font-semibold">
              {series ? "Open series" : "Read"}
              <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-500">↗</span>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
