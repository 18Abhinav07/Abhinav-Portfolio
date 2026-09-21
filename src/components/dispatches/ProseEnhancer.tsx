"use client";

import { useEffect } from "react";
import mediumZoom from "medium-zoom";

/**
 * Client-side polish for rendered markdown, kept out of the markdown itself so the
 * same file stays portable to dev.to:
 * - every image zooms to full size on click (diagrams and screenshots are dense);
 * - images below the fold load lazily.
 */
export function ProseEnhancer({ selector = ".dispatch-prose" }: { selector?: string }) {
  useEffect(() => {
    const imgs = Array.from(document.querySelectorAll<HTMLImageElement>(`${selector} img`));
    imgs.forEach((img, i) => {
      if (i > 0) img.loading = "lazy";
      img.decoding = "async";
    });
    const zoom = mediumZoom(imgs, { margin: 24, background: "rgba(250, 249, 246, 0.96)" });
    return () => {
      zoom.detach();
    };
  }, [selector]);

  return null;
}
