import type { Metadata } from "next";
import { Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import { TopNav } from "@/components/TopNav";
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
    "Web3 engineer working across payments, privacy, on-chain credit, and agent infrastructure. PayZoll, Tesseract, OpenAssets, Kredio, Clear Sky.",
  metadataBase: new URL("https://abhinavpangaria.com"),
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Abhinav Pangaria · Builder of resilient systems.",
    description: "Systems that hold together on the worst day. PayZoll · Tesseract · OpenAssets · Kredio · Clear Sky.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${hanken.variable} ${jetbrains.variable}`}>
      <head>
        {/* Clash Display — geometric display face via Fontshare CDN (exposed as --font-display in globals.css) */}
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Symbols+Outlined"
          rel="stylesheet"
        />
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
