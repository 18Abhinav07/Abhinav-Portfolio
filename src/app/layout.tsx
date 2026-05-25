import type { Metadata } from "next";
import { Playfair_Display, Geist, Geist_Mono, Fraunces } from "next/font/google";
import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { SmoothScroll } from "@/components/SmoothScroll";
import "@/styles/globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Abhinav Pangaria · Builder of resilient systems.",
  description:
    "Web3 engineer working across payments, privacy, on-chain credit, and agent infrastructure. PayZoll, Tesseract, OpenAssets, Kredio, Clear Sky.",
  metadataBase: new URL("https://abhinavpangaria.com"),
  openGraph: {
    title: "Abhinav Pangaria · Builder of resilient systems.",
    description: "Systems that hold together on the worst day. PayZoll · Tesseract · OpenAssets · Kredio · Clear Sky.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${fraunces.variable} ${geist.variable} ${geistMono.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Symbols+Outlined"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans bg-surface text-on-surface antialiased pb-[64px] md:pb-0">
        <SmoothScroll />
        <TopNav />
        <main>{children}</main>
        <Footer />
        <MobileBottomNav />
      </body>
    </html>
  );
}
