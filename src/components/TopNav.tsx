import Link from "next/link";
import { site } from "@/content/site";

export function TopNav() {
  return (
    <header className="sticky top-0 z-40 w-full bg-surface-container-lowest/80 backdrop-blur-md brutalist-rule-b">
      <div className="flex items-center justify-between px-6 md:px-[80px] py-5">
        <Link href="/" className="font-mono text-label-mono uppercase tracking-[0.2em] text-on-surface hover:text-primary transition-colors">
          {site.wordmark}
        </Link>
        <nav className="hidden md:flex items-center gap-stack-xl">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-mono text-label-mono uppercase tracking-[0.18em] text-on-surface-variant hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-stack-sm font-mono text-label-mono uppercase tracking-[0.18em] text-on-surface-variant">
          <span className="inline-block h-1.5 w-1.5 rounded-pill bg-secondary pulse-dot" />
          <span className="hidden sm:inline">Available</span>
        </div>
      </div>
    </header>
  );
}
