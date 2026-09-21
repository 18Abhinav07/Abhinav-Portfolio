"use client";

import { useEffect, useState } from "react";

/** Sticky outline of the post's h2 sections, highlighting the one being read. */
export function TableOfContents({ headings }: { headings: { id: string; text: string }[] }) {
  const [active, setActive] = useState<string | null>(headings[0]?.id ?? null);

  useEffect(() => {
    const els = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!els.length) return;
    // A heading counts as current once it passes the upper third of the viewport.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) setActive(visible[0].target.id);
      },
      { rootMargin: "0px 0px -66% 0px" },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  if (!headings.length) return null;

  return (
    <nav aria-label="On this page">
      <div className="font-mono text-label-mono uppercase tracking-[0.18em] text-on-surface font-bold mb-4">
        On this page
      </div>
      <ol className="flex flex-col gap-1 border-l border-outline">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={`block -ml-px border-l-2 pl-4 py-1.5 text-body-sm leading-snug transition-colors ${
                active === h.id
                  ? "border-primary text-on-surface font-semibold"
                  : "border-transparent text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
