import { site } from "@/content/site";
import { Reveal, StaggerGroup, StaggerItem } from "./Reveal";

export function Identity() {
  const { statement, paragraphs } = site.identity;
  return (
    <section className="relative bg-bg px-6 md:px-[80px] py-[100px] md:py-[140px] brutalist-rule-t brutalist-rule-b overflow-hidden">
      <div className="absolute inset-0 grid-paper opacity-10 pointer-events-none" />
      
      <div className="relative grid md:grid-cols-12 gap-column-gap">
        <div className="md:col-span-3">
          <StaggerGroup className="flex flex-col gap-8">
            <StaggerItem>
              <div className="font-mono text-label-mono uppercase tracking-[0.25em] text-on-surface flex items-center gap-3">
                <span className="h-[1px] w-6 bg-primary" />
                <span className="bg-primary text-on-surface px-2 py-0.5 rounded font-bold">02 / Identity</span>
              </div>
            </StaggerItem>
          </StaggerGroup>
        </div>

        <div className="md:col-span-8 md:col-start-5 mt-12 md:mt-0">
          <Reveal as="h2" className="font-display italic text-headline-md md:text-headline-lg text-on-surface leading-[1.1] mb-stack-xl max-w-2xl drop-cap">
            {statement}
          </Reveal>

          <div className="grid md:grid-cols-2 gap-stack-xl text-body-md text-on-surface-variant font-medium leading-relaxed">
            {paragraphs.map((p, i) => (
              <Reveal key={i} delay={0.2 + i * 0.1}>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
