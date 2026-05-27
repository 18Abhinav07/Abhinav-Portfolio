import Link from "next/link";
import { site } from "@/content/site";
import { FooterWordmark } from "./FooterWordmark";
import { getSocialIcon } from "./SocialIcons";

export function Footer() {
  return (
    <footer className="bg-surface-container-lowest brutalist-rule-t">
      <div className="px-6 md:px-[80px] py-[120px]">
        <div className="grid md:grid-cols-12 gap-column-gap mb-[120px]">
          <div className="md:col-span-7">
            <h4 className="font-mono text-label-mono uppercase tracking-[0.18em] text-primary mb-stack-md">
              Channels
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-column-gap gap-y-stack-md">
              {site.socials.map((social) => (
                <Link
                  key={social.label}
                  href={social.url}
                  className="group flex items-center gap-stack-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  <div className="text-on-surface-variant group-hover:text-primary transition-colors">
                    {getSocialIcon(social.label, { className: "w-4 h-4" })}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">{social.label.split(" / ")[0]}</span>
                    <span className="text-[10px] uppercase tracking-wider opacity-60">{social.handle}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="md:col-start-9 md:col-span-4 mt-12 md:mt-0">
            <h4 className="font-mono text-label-mono uppercase tracking-[0.18em] text-primary mb-stack-md">
              Direct
            </h4>
            <ul className="space-y-stack-md">
              <li>
                <Link
                  href={`mailto:${site.email}`}
                  className="group flex flex-col gap-1 text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  <span className="font-mono text-[10px] uppercase tracking-wider opacity-60">Handset · Email</span>
                  <span className="font-medium underline underline-offset-4 decoration-outline-variant group-hover:decoration-primary">{site.email}</span>
                </Link>
              </li>
            </ul>
          </div>
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
