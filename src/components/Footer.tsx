import Link from "next/link";
import { site } from "@/content/site";
import { FooterWordmark } from "./FooterWordmark";

const columns = [
  {
    heading: "Sitemap",
    links: [
      { label: "Work", href: "/work" },
      { label: "Journey", href: "/journey" },
      { label: "Beyond", href: "/beyond" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Channels",
    links: site.socials.map((s) => ({ label: s.label, href: s.url })),
  },
  {
    heading: "Direct",
    links: [
      { label: site.email, href: `mailto:${site.email}` },
      { label: "PGP key", href: "#" },
      { label: "Signal", href: "#" },
    ],
  },
  {
    heading: "Colophon",
    links: [
      { label: "Built with Next 15", href: "https://nextjs.org" },
      { label: "Hosted on Vercel", href: "https://vercel.com" },
      { label: "Type · Fraunces · Geist", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-surface-container-lowest brutalist-rule-t">
      <div className="px-6 md:px-[80px] py-[120px]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-stack-xl mb-[120px]">
          {columns.map((col) => (
            <div key={col.heading}>
              <h4 className="font-mono text-label-mono uppercase tracking-[0.18em] text-primary mb-stack-md">
                {col.heading}
              </h4>
              <ul className="space-y-stack-sm">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-stack-md md:flex-row md:items-end md:justify-between font-mono text-label-mono uppercase tracking-[0.18em] text-on-surface-variant brutalist-rule-t pt-stack-lg">
          <span>© {new Date().getFullYear()} · Abhinav Pangaria · All work assembled by hand.</span>
          <span>Last edit · {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase()}</span>
        </div>
      </div>

      <FooterWordmark />
    </footer>
  );
}
