import type { Metadata } from "next";
import { Playfair_Display, Fraunces, Inter } from "next/font/google";
import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Preloader } from "@/components/Preloader";
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

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
    <html lang="en" className={`${playfair.variable} ${fraunces.variable} ${inter.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Symbols+Outlined"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans bg-surface text-on-surface antialiased pb-[64px] md:pb-0">
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
