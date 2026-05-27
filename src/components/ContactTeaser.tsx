import Link from "next/link";
import { site } from "@/content/site";
import { Reveal, StaggerGroup, StaggerItem } from "./Reveal";

export function ContactTeaser() {
  return (
    <section className="px-6 md:px-[80px] py-[120px]">
      <div className="grid md:grid-cols-12 gap-column-gap items-center">
        <Reveal className="md:col-span-5" y={40}>
          <div className="aspect-square w-full bg-surface-container-low brutalist-rule-t brutalist-rule-b brutalist-rule-l brutalist-rule-r relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 grid-paper opacity-30" />
            <div className="relative z-10 flex flex-col items-center justify-center">
               {/* Minimalist Radar / Target reticle design */}
               <div className="w-[120px] h-[120px] rounded-full border-[1px] border-outline-variant relative flex items-center justify-center">
                  <div className="absolute inset-0 radar-sweep" />
                  <div className="w-[60px] h-[60px] rounded-full border-[1px] border-outline-variant flex items-center justify-center relative z-10">
                     <div className="w-[8px] h-[8px] rounded-full bg-secondary pulse-dot" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center rotate-45 z-10">
                     <div className="w-full h-[1px] bg-outline-variant/30" />
                     <div className="h-full w-[1px] bg-outline-variant/30 absolute" />
                  </div>
               </div>
               <div className="mt-stack-lg font-mono text-label-mono uppercase tracking-[0.2em] text-on-surface-variant">
                  Awaiting signal
               </div>
            </div>
            
            <div className="absolute top-stack-md left-stack-md font-mono text-label-mono uppercase tracking-[0.18em] text-secondary z-20">
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
              Have something to build? <em className="italic text-primary">Pick up the line.</em>
            </h2>
          </StaggerItem>
          <StaggerItem>
            <p className="text-body-md text-on-surface-variant max-w-lg">
              Direct transmission. The line is open between 09:00 and 23:00 IST.
              For everything else, the digital route still works.
            </p>
          </StaggerItem>
          <StaggerItem className="flex flex-wrap gap-stack-md">
            <Link
              href="/contact"
              className="btn-primary"
            >
              Open the line →
            </Link>
            <Link
              href={`mailto:${site.email}`}
              className="btn-secondary"
            >
              {site.email}
            </Link>
          </StaggerItem>
        </StaggerGroup>
      </div>
    </section>
  );
}
