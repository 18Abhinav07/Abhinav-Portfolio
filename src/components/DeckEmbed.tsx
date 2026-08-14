export function DeckEmbed({ url, title }: { url: string; title: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open presentation: ${title}`}
      className="group relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border border-outline-variant/30 bg-[radial-gradient(circle_at_20%_20%,rgba(0,196,159,0.14),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(140,120,255,0.14),transparent_55%)] bg-surface-variant/10 transition-colors duration-500 hover:border-primary/60"
    >
      <div className="relative z-10 flex flex-col items-center gap-stack-md text-center px-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-on-surface shadow-lg transition-transform duration-500 group-hover:scale-110">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="14" rx="2" />
            <path d="M3 16l4.5-4.5a2 2 0 0 1 2.83 0L14 15" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="16" cy="9" r="1.5" fill="currentColor" stroke="none" />
            <path d="M9 20h6" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <div className="font-mono text-label-mono uppercase tracking-[0.18em] text-on-surface font-bold">
            {title}
          </div>
          <div className="mt-1 font-mono text-label-mono uppercase tracking-[0.18em] text-on-surface-variant">
            View deck on Canva →
          </div>
        </div>
      </div>
    </a>
  );
}
