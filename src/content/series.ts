import seriesData from "./series.json";

/**
 * A series groups dispatches that read as one argument. The index collapses a
 * series into a single parent card, and each part links back to its siblings.
 *
 * The registry is JSON rather than TS so scripts/sync-devto.mjs can read the same
 * titles without a TypeScript toolchain: dev.to groups articles by series title.
 */
export type Series = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  cover: string;
  coverAlt: string;
  /** Slug of the related /work/[slug] case study, if any. */
  project?: string;
  repo?: string;
};

export const SERIES: Series[] = seriesData;

export const getSeries = (slug: string): Series | undefined =>
  SERIES.find((s) => s.slug === slug);
