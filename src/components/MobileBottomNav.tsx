import Link from "next/link";

const items = [
  { label: "Hero", href: "/", glyph: "◆" },
  { label: "Work", href: "/work", glyph: "▦" },
  { label: "Journey", href: "/journey", glyph: "◐" },
  { label: "Connect", href: "/contact", glyph: "✉" },
];

export function MobileBottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-container-lowest/95 backdrop-blur-md brutalist-rule-t">
      <ul className="grid grid-cols-4">
        {items.map((it) => (
          <li key={it.href} className="brutalist-rule-r last:border-r-0">
            <Link
              href={it.href}
              className="flex flex-col items-center gap-1 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="text-lg leading-none">{it.glyph}</span>
              <span>{it.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
