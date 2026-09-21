/**
 * The canonical origin for this site. The single source of truth.
 *
 * Every absolute URL the site emits (canonical tags, OpenGraph, RSS, the dev.to
 * canonical_url) resolves from here. It was previously hardcoded in five files,
 * which is how they drifted apart.
 *
 * Override with NEXT_PUBLIC_SITE_URL when a custom domain goes live. That is the
 * only change needed, and scripts/sync-devto.mjs reads the same variable.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://abhinavpangaria.pages.dev"
).replace(/\/$/, "");

/** Host only, for display. e.g. "abhinavpangaria.pages.dev" */
export const SITE_HOST = SITE_URL.replace(/^https?:\/\//, "");

/** Absolute URL for a dispatch. */
export const dispatchUrl = (slug: string) => `${SITE_URL}/dispatches/${slug}`;
