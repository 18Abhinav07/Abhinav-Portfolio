import { ImageResponse } from "next/og";
import { getDispatch, getDispatches } from "@/content/dispatches";
import { SITE_HOST } from "@/content/site-url";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Dispatch by Abhinav Pangaria";

export function generateStaticParams() {
  return getDispatches().map((d) => ({ slug: d.slug }));
}

/**
 * The card an X or LinkedIn link renders. A dispatch link without this is a dead link,
 * so this is generated at build time for every post.
 */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = getDispatch(slug);

  // A post with a cover shares the cover, letterboxed on ink to the 1200x630 card.
  // Satori cannot decode webp or avif, so ask Cloudinary for a PNG explicitly.
  if (d?.cover) {
    const src = d.cover.replace("/f_auto,q_auto/", "/f_png/");
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#07090F",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} width={1200} height={504} alt="" />
        </div>
      ),
      size,
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#FAF9F6",
          padding: "72px",
          // Neon-green edge, matching the site's High-Energy Light accent.
          borderLeft: "24px solid #BFFF00",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 24,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#4B5563",
          }}
        >
          Dispatch
        </div>

        <div
          style={{
            display: "flex",
            fontSize: d && d.title.length > 60 ? 62 : 76,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "#07090F",
            fontWeight: 600,
          }}
        >
          {d?.title ?? "Abhinav Pangaria"}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 26,
            color: "#4B5563",
          }}
        >
          <div style={{ display: "flex", color: "#07090F", fontWeight: 600 }}>
            {SITE_HOST}
          </div>
          <div style={{ display: "flex" }}>{d?.readTime ?? ""}</div>
        </div>
      </div>
    ),
    size,
  );
}
