"use client";

import { useEffect, useMemo, useState } from "react";
import { DispatchCard, type DispatchCardData } from "./DispatchCard";

export type IndexPost = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  dateLabel: string;
  minutes: number;
  readTime: string;
  kind: string;
  tags: string[];
  cover?: string;
  coverAlt?: string;
  draft: boolean;
  series?: { slug: string; title: string; part: number };
};

export type IndexSeries = {
  slug: string;
  title: string;
  tagline: string;
  cover: string;
  coverAlt: string;
};

type Sort = "newest" | "oldest" | "shortest" | "longest";

const SORTS: { value: Sort; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "shortest", label: "Quick reads" },
  { value: "longest", label: "Long reads" },
];

/** A row in the grid: either one post, or a series collapsed into its parent card. */
type Entry =
  | { type: "post"; date: string; minutes: number; post: IndexPost }
  | { type: "series"; date: string; minutes: number; series: IndexSeries; parts: IndexPost[] };

const pad = (n: number) => String(n).padStart(2, "0");

const postCard = (p: IndexPost, showSeries: boolean): DispatchCardData => ({
  href: `/dispatches/${p.slug}`,
  title: p.title,
  summary: p.summary,
  cover: p.cover,
  coverAlt: p.coverAlt,
  eyebrow: p.kind,
  badge: p.series ? `Part ${pad(p.series.part)}` : undefined,
  meta: [p.dateLabel, p.readTime, ...(showSeries && p.series ? [p.series.title] : [])],
  tags: p.tags,
  draft: p.draft,
});

const seriesCard = (s: IndexSeries, parts: IndexPost[]): DispatchCardData => {
  const minutes = parts.reduce((n, p) => n + p.minutes, 0);
  return {
    href: `/dispatches/series/${s.slug}`,
    title: s.title,
    summary: s.tagline,
    cover: s.cover,
    coverAlt: s.coverAlt,
    eyebrow: "Series",
    badge: `${parts.length} parts`,
    meta: [parts[parts.length - 1]?.dateLabel ?? "", `${minutes} min total`],
    tags: [...new Set(parts.flatMap((p) => p.tags))],
    draft: parts.every((p) => p.draft),
    variant: "series",
  };
};

const readParams = () => {
  if (typeof window === "undefined") return new URLSearchParams();
  return new URLSearchParams(window.location.search);
};

export function DispatchIndex({
  posts,
  series,
  topics,
  kinds,
}: {
  posts: IndexPost[];
  series: IndexSeries[];
  topics: { name: string; count: number }[];
  kinds: string[];
}) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<string | null>(null);
  const [kind, setKind] = useState<string | null>(null);
  const [sort, setSort] = useState<Sort>("newest");

  // Filters live in the URL so a topic view is linkable (?topic=Testing). Read once
  // on mount rather than through useSearchParams, which would force this static
  // page into client-side rendering.
  useEffect(() => {
    const p = readParams();
    setQuery(p.get("q") ?? "");
    setTopic(p.get("topic"));
    setKind(p.get("kind"));
    const s = p.get("sort") as Sort | null;
    if (s && SORTS.some((x) => x.value === s)) setSort(s);
  }, []);

  useEffect(() => {
    const p = new URLSearchParams();
    if (query) p.set("q", query);
    if (topic) p.set("topic", topic);
    if (kind) p.set("kind", kind);
    if (sort !== "newest") p.set("sort", sort);
    const qs = p.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [query, topic, kind, sort]);

  const filtering = Boolean(query.trim() || topic || kind);

  const entries = useMemo<Entry[]>(() => {
    const q = query.trim().toLowerCase();
    const matches = posts.filter((p) => {
      if (topic && !p.tags.includes(topic)) return false;
      if (kind && p.kind !== kind) return false;
      if (!q) return true;
      return [p.title, p.summary, p.tags.join(" "), p.series?.title ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });

    let list: Entry[];
    if (filtering) {
      // A search is looking for a piece, not a collection: show matching parts directly.
      list = matches.map((post) => ({ type: "post", date: post.date, minutes: post.minutes, post }));
    } else {
      const bySeries = new Map<string, IndexPost[]>();
      list = [];
      for (const post of matches) {
        if (post.series) {
          bySeries.set(post.series.slug, [...(bySeries.get(post.series.slug) ?? []), post]);
        } else {
          list.push({ type: "post", date: post.date, minutes: post.minutes, post });
        }
      }
      for (const s of series) {
        const parts = (bySeries.get(s.slug) ?? []).sort((a, b) => a.series!.part - b.series!.part);
        if (!parts.length) continue;
        list.push({
          type: "series",
          series: s,
          parts,
          date: parts.map((p) => p.date).sort().at(-1)!,
          minutes: parts.reduce((n, p) => n + p.minutes, 0),
        });
      }
    }

    const cmp: Record<Sort, (a: Entry, b: Entry) => number> = {
      newest: (a, b) => b.date.localeCompare(a.date),
      oldest: (a, b) => a.date.localeCompare(b.date),
      shortest: (a, b) => a.minutes - b.minutes,
      longest: (a, b) => b.minutes - a.minutes,
    };
    return list.sort(cmp[sort]);
  }, [posts, series, query, topic, kind, sort, filtering]);

  const reset = () => {
    setQuery("");
    setTopic(null);
    setKind(null);
  };

  const chip = (active: boolean) =>
    `px-3 py-1.5 rounded-full border font-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${
      active
        ? "bg-on-surface text-white border-on-surface"
        : "border-outline text-on-surface-variant hover:border-on-surface hover:text-on-surface"
    }`;

  return (
    <div>
      <div className="grid md:grid-cols-12 gap-column-gap gap-y-8 mb-12">
        <div className="md:col-span-8 flex flex-col sm:flex-row gap-3">
          <label className="relative flex-1">
            <span className="sr-only">Search dispatches</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search titles, summaries, topics"
              className="w-full rounded-full border border-outline bg-white px-5 py-3 text-body-md text-on-surface placeholder:text-on-surface-variant/70 focus:border-on-surface focus:ring-0"
            />
          </label>
          <label className="relative">
            <span className="sr-only">Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="w-full sm:w-auto rounded-full border border-outline bg-white pl-5 pr-10 py-3 font-mono text-[12px] uppercase tracking-[0.14em] text-on-surface focus:border-on-surface focus:ring-0"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="md:col-span-4 flex flex-wrap items-center gap-2 md:justify-end">
          <button type="button" className={chip(!kind)} onClick={() => setKind(null)}>
            All
          </button>
          {kinds.map((k) => (
            <button key={k} type="button" className={chip(kind === k)} onClick={() => setKind(kind === k ? null : k)}>
              {k}
            </button>
          ))}
        </div>

        <div className="md:col-span-12">
          <div className="font-mono text-label-mono uppercase tracking-[0.18em] text-on-surface-variant mb-3">
            Topics I have written about
          </div>
          <div className="flex flex-wrap gap-2">
            {topics.map((t) => (
              <button
                key={t.name}
                type="button"
                className={chip(topic === t.name)}
                onClick={() => setTopic(topic === t.name ? null : t.name)}
              >
                {t.name} <span className="opacity-60">{t.count}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-outline pt-6 mb-10 font-mono text-label-mono uppercase tracking-[0.18em] text-on-surface-variant">
        <span>
          {filtering
            ? `${entries.length} ${entries.length === 1 ? "match" : "matches"}`
            : `${entries.length} ${entries.length === 1 ? "entry" : "entries"}`}
          {topic && <span className="text-on-surface"> · {topic}</span>}
        </span>
        {filtering && (
          <button type="button" onClick={reset} className="text-on-surface hover:underline">
            Clear filters
          </button>
        )}
      </div>

      {entries.length === 0 ? (
        <p className="py-16 text-body-lg text-on-surface-variant">
          Nothing matches that yet.{" "}
          <button type="button" onClick={reset} className="text-on-surface underline underline-offset-4">
            Show everything
          </button>
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-x-column-gap gap-y-16">
          {entries.map((e, i) =>
            e.type === "series" ? (
              <div key={e.series.slug} className="md:col-span-2 pt-3">
                <DispatchCard data={seriesCard(e.series, e.parts)} priority={i === 0} />
              </div>
            ) : (
              <DispatchCard key={e.post.slug} data={postCard(e.post, filtering)} priority={i < 2} />
            ),
          )}
        </div>
      )}
    </div>
  );
}
