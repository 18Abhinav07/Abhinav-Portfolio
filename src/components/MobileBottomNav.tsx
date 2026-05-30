"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const items = [
  { label: "Hero", href: "/", glyph: "◆" },
  { label: "Work", href: "/work", glyph: "▦" },
  { label: "Journey", href: "/journey", glyph: "◐" },
  { label: "Connect", href: "/contact", glyph: "✉" },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-bg/90 backdrop-blur-xl border-t border-on-surface/5 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
      <ul className="grid grid-cols-4">
        {items.map((it) => {
          const isActive = pathname === it.href || (it.href !== "/" && pathname?.startsWith(it.href));
          return (
            <li key={it.href} className="border-r border-on-surface/5 last:border-r-0">
              <Link
                href={it.href}
                className={`flex flex-col items-center gap-1.5 py-4 font-mono text-[9px] uppercase tracking-[0.15em] transition-all relative ${isActive ? 'text-on-surface' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="nav-pill"
                    className="absolute inset-x-2 inset-y-2 bg-primary/20 rounded-lg -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className={`text-lg leading-none transition-transform duration-300 ${isActive ? 'scale-110' : 'scale-100'}`}>{it.glyph}</span>
                <span className="font-bold">{it.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
