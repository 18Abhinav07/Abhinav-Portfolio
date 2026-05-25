import Link from "next/link";
import { site } from "@/content/site";
import { Reveal, StaggerGroup, StaggerItem } from "./Reveal";

export function ContactTeaser() {
  return (
    <section className="px-6 md:px-[80px] py-[120px]">
      <div className="grid md:grid-cols-12 gap-column-gap items-center">
        <Reveal className="md:col-span-5" y={40}>
          <div className="aspect-square w-full bg-surface-container-low brutalist-rule-t brutalist-rule-b brutalist-rule-l brutalist-rule-r relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="font-mono text-label-mono uppercase tracking-[0.2em] text-on-surface-variant">
                [ Spline · landline ]
              </div>
            </div>
            <div className="absolute top-stack-md left-stack-md font-mono text-label-mono uppercase tracking-[0.18em] text-secondary">
              <span className="inline-block h-1.5 w-1.5 rounded-pill bg-secondary pulse-dot mr-2" />
              Line open
            </div>
          </div>
        </Reveal>
        <StaggerGroup className="md:col-span-7 flex flex-col gap-stack-lg">
          <StaggerItem>
            <div className="font-mono text-label-mono uppercase tracking-[0.18em] text-primary">
              05 / Contact · Pick up the line
            </div>
          </StaggerItem>
          <StaggerItem>
            <h2 className="font-display text-headline-lg leading-[1.05] tracking-[-0.02em] text-on-surface">
              Have something to build? <em className="italic text-primary">Speak into the handset.</em>
            </h2>
          </StaggerItem>
          <StaggerItem>
            <p className="text-body-md text-on-surface-variant max-w-lg">
              Voice or keyboard. The line is open between 09:00 and 23:00 IST.
              For everything else, the postal address still works.
            </p>
          </StaggerItem>
          <StaggerItem className="flex flex-wrap gap-stack-md">
            <Link
              href="/contact"
              className="font-mono text-label-mono uppercase tracking-[0.18em] px-stack-md py-3 bg-primary text-primary-on rounded-pill hover:bg-secondary hover:text-secondary-on transition-colors"
            >
              Open the line →
            </Link>
            <Link
              href={`mailto:${site.email}`}
              className="font-mono text-label-mono uppercase tracking-[0.18em] px-stack-md py-3 border border-outline-variant rounded-pill text-on-surface hover:border-primary hover:text-primary transition-colors"
            >
              {site.email}
            </Link>
          </StaggerItem>
        </StaggerGroup>
      </div>
    </section>
  );
}
