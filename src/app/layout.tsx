import type { Metadata } from "next";
import localFont from "next/font/local";
import { SITE_URL } from "@/content/site-url";
import { siteGraph, DEFAULT_OG_IMAGE } from "@/content/seo";
import { JsonLd } from "@/components/JsonLd";
import "@/styles/globals.css";

// Self-hosted (latin, variable where the face has one) so the build never fetches
// from Google: the Cloudflare build host got an unparseable font URL back once.
const hanken = localFont({
  src: "./fonts/hanken-normal.woff2",
  variable: "--font-hanken",
  display: "swap",
  weight: "300 700",
});

const jetbrains = localFont({
  src: "./fonts/jetbrains-mono-normal.woff2",
  variable: "--font-jetbrains",
  display: "swap",
  weight: "400 600",
});

// The home page's faces.
const instrument = localFont({
  src: [
    { path: "./fonts/instrument-serif-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/instrument-serif-italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-instrument",
  display: "swap",
});

const inter = localFont({
  src: "./fonts/inter-normal.woff2",
  variable: "--font-inter",
  display: "swap",
  weight: "400 600",
});

export const metadata: Metadata = {
  title: "Abhinav Pangaria · Software Engineer building resilient systems",
  description:
    "Engineer building agent orchestration and verification harnesses, applied cryptography, and settlement backends that cannot afford to be wrong. Rust, Go, Python, TypeScript, Kubernetes, AWS. Formerly JP Morgan Chase and co-founder at PayZoll. Sieve, Voluntas, Dart, Loom, Guardian Kane, AgentOps, Zidd, Pods, VEIL, Kredio, OpenAssets, Tesseract.",
  metadataBase: new URL(SITE_URL),
  // Every page below sets its own canonical. This is the fallback so no route
  // ever ships without one, which is how a query string becomes a duplicate page.
  alternates: {
    canonical: "/",
    // A plain-text map of the site for crawlers and agents that do not run scripts.
    types: { "text/plain": [{ url: "/llms.txt", title: "llms.txt" }, { url: "/llms-full.txt", title: "llms-full.txt" }] },
  },
  authors: [{ name: "Abhinav Pangaria", url: SITE_URL }],
  creator: "Abhinav Pangaria",
  icons: {
    icon: "/favicon.svg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Abhinav Pangaria · Software Engineer building resilient systems",
    description:
      "Systems that hold together on the worst day. Sieve · Voluntas · Dart · Loom · Guardian Kane · AgentOps · Zidd · PayZoll.",
    url: SITE_URL,
    siteName: "Abhinav Pangaria",
    locale: "en_US",
    type: "website",
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: "Abhinav Pangaria" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Abhinav Pangaria · Software Engineer building resilient systems",
    description:
      "Engineer across agent orchestration, automated verification, applied cryptography, and systems that move value.",
    creator: "@abhinavpangaria",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${hanken.variable} ${jetbrains.variable} ${instrument.variable} ${inter.variable}`}>
      <head>
        {/* The person and site entity, once, so every other page's nodes can point at it. */}
        <JsonLd data={siteGraph()} />
      </head>
      <body className="font-sans bg-bg text-on-surface antialiased">{children}</body>
    </html>
  );
}
