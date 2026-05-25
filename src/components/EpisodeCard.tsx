import Link from "next/link";
import type { Episode } from "@/content/episodes";

const colSpan: Record<string, string> = {
  "aspect-[3/4]": "md:col-span-4",
  "aspect-square": "md:col-span-4",
  "aspect-video": "md:col-span-8",
};

export function EpisodeCard({ episode }: { episode: Episode }) {
  const accent = episode.accent === "primary" ? "border-primary" : "border-secondary";
  const accentText = episode.accent === "primary" ? "text-primary" : "text-secondary";
  const span = colSpan[episode.aspect] ?? "md:col-span-4";

  const inner = (
    <div className={`relative h-full ${episode.aspect} bg-surface-container-low overflow-hidden group`}>
      <div className="absolute inset-0 grid-paper opacity-20 grayscale-[0.4] group-hover:grayscale-0 transition-all duration-700" />

      <div className={`absolute inset-stack-md glass-panel border-l-2 ${accent} p-stack-md flex flex-col justify-between`}>
        <div className="flex items-start justify-between">
          <span className={`font-mono text-label-mono uppercase tracking-[0.18em] ${accentText}`}>
            {episode.index} · {episode.category}
          </span>
          <span className="font-mono text-label-mono uppercase tracking-[0.18em] text-on-surface-variant">
            {episode.date}
          </span>
        </div>

        <div>
          <h3 className="font-display text-headline-md leading-[1.05] tracking-[-0.01em] text-on-surface mb-stack-sm">
            {episode.title}
          </h3>
          <p className="font-display italic text-body-md text-on-surface-variant mb-stack-md">
            {episode.subtitle}
          </p>
          <p className="text-body-sm text-on-surface-variant line-clamp-3">
            {episode.excerpt}
          </p>
        </div>

        <div className="flex items-center justify-between font-mono text-label-mono uppercase tracking-[0.18em]">
          <span className="text-on-surface-variant">{episode.era}</span>
          <span className={accentText}>
            {episode.locked ? "Locked ▣" : "Read →"}
          </span>
        </div>
      </div>
    </div>
  );

  if (episode.locked) {
    return <div className={`${span} opacity-60 cursor-not-allowed`}>{inner}</div>;
  }

  return (
    <Link href={`/journey/${episode.slug}`} className={span}>
      {inner}
    </Link>
  );
}
