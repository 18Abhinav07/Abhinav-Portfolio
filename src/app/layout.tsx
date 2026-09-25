import type { Metadata } from "next";
import { Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import { TopNav } from "@/components/TopNav";
import { SITE_URL } from "@/content/site-url";
import { siteGraph, DEFAULT_OG_IMAGE } from "@/content/seo";
import { JsonLd } from "@/components/JsonLd";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Preloader } from "@/components/Preloader";
import "@/styles/globals.css";

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Abhinav Pangaria · Builder of resilient systems.",
  description:
    "Engineer building agent orchestration and verification harnesses, applied cryptography, and settlement backends that cannot afford to be wrong. Rust, Go, Python, TypeScript, Kubernetes, AWS. Formerly JP Morgan Chase and co-founder at PayZoll. Guardian Kane, AgentOps, Tesseract, VEIL, Kredio, OpenAssets, Pods.",
  metadataBase: new URL(SITE_URL),
  // Every page below sets its own canonical. This is the fallback so no route
  // ever ships without one, which is how a query string becomes a duplicate page.
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": "/dispatches/rss.xml" },
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
    title: "Abhinav Pangaria · Builder of resilient systems.",
    description:
      "Systems that hold together on the worst day. PayZoll · Tesseract · VEIL · OpenAssets · Kredio · AgentOps · Guardian Kane.",
    url: SITE_URL,
    siteName: "Abhinav Pangaria",
    locale: "en_US",
    type: "website",
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: "Abhinav Pangaria" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Abhinav Pangaria · Builder of resilient systems.",
    description:
      "Engineer across agent orchestration, automated verification, applied cryptography, and systems that move value.",
    creator: "@abhinavpangaria",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${hanken.variable} ${jetbrains.variable}`}>
      <head>
        {/* Clash Display: geometric display face via Fontshare CDN (exposed as --font-display in globals.css) */}
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Symbols+Outlined"
          rel="stylesheet"
        />
        {/* The person and site entity, once, so every other page's nodes can point at it. */}
        <JsonLd data={siteGraph()} />
      </head>
      <body className="font-sans bg-bg text-on-surface antialiased pb-[64px] md:pb-0">
        <Preloader />
        <SmoothScroll />
        <TopNav />
        <main>{children}</main>
        <Footer />
        <MobileBottomNav />
      </body>
    </html>
  );
}
