import Link from "next/link";
import type { Episode } from "@/content/episodes";

export function EpisodeCard({ episode }: { episode: Episode }) {
  const idx = parseInt(episode.index, 10);
  const isLast = idx === 5; // The 5th episode
  
  // 2-2-1 Format: span 6 for first four, span 12 for the fifth.
  const span = isLast ? "md:col-span-12" : "md:col-span-6";
  const aspectClass = isLast ? "md:aspect-[2.5/1] aspect-[4/3] min-h-[240px]" : "aspect-[4/3]";

  const inner = (
    <div className={`double-bezel-outer w-full ${aspectClass} group hover:ring-primary/20 transition-premium`}>
      <div className="double-bezel-inner relative w-full h-full bg-surface-container overflow-hidden flex flex-col justify-between">
        {/* Grid Background */}
        <div className="absolute inset-0 grid-paper opacity-5 pointer-events-none" />
        
        {/* Cinematic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-secondary/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        <div className="relative h-full p-6 md:p-8 flex flex-col justify-between z-10">
          <div className="flex items-start justify-between">
            <span className={`font-mono text-[10px] md:text-label-mono uppercase tracking-[0.2em] text-on-surface flex items-center gap-2 font-bold`}>
              <span className={`w-1.5 h-1.5 rounded-full ${episode.accent === "primary" ? "bg-primary" : "bg-secondary"} animate-pulse`} />
              EP {episode.index} · {episode.category}
            </span>
            <span className="font-mono text-[10px] md:text-label-mono uppercase tracking-[0.18em] text-on-surface-variant/60">
              {episode.date}
            </span>
          </div>

          <div className="w-full">
            <h3 className={`font-display italic leading-[1.05] tracking-[-0.01em] text-on-surface mb-stack-xs group-hover:opacity-80 transition-opacity duration-500 line-clamp-2 ${isLast ? 'text-headline-lg' : 'text-headline-md'}`}>
              {episode.title}
            </h3>
            <p className="font-display text-body-md text-on-surface font-medium mb-stack-sm line-clamp-1">
              {episode.subtitle}
            </p>
            <p className={`text-on-surface/80 leading-relaxed line-clamp-2 ${isLast ? 'text-body-md max-w-lg' : 'text-body-sm'}`}>
              {episode.excerpt}
            </p>
          </div>

          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em]">
            <span className="text-on-surface-variant font-bold">{episode.era}</span>
            <span className="text-on-surface flex items-center gap-2 font-bold bg-primary px-2 py-0.5 rounded">
              {episode.locked ? "Locked ▣" : (
                <>
                  <span>Transmission</span>
                  <span className="group-hover:translate-x-2 transition-transform duration-500 ease-out">→</span>
                </>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  if (episode.locked) {
    return <div className={`${span} opacity-40 cursor-not-allowed`}>{inner}</div>;
  }

  return (
    <Link href={`/journey/${episode.slug}`} className={`${span} block`}>
      {inner}
    </Link>
  );
}
