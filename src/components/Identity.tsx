import { Reveal, StaggerGroup, StaggerItem } from "./Reveal";

export function Identity() {
  return (
    <section className="relative bg-bg px-6 md:px-[80px] py-[100px] md:py-[160px] brutalist-rule-t brutalist-rule-b overflow-hidden">
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
            <StaggerItem>
              <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-on-surface-variant font-medium leading-relaxed">
                FILE · AP-002.MD
                <br />
                EDIT · 2026-05-29
              </div>
            </StaggerItem>
          </StaggerGroup>
        </div>

        <div className="md:col-span-8 md:col-start-5 mt-12 md:mt-0">
          <Reveal as="h2" className="font-display italic text-headline-md md:text-headline-lg text-on-surface leading-[1.1] mb-stack-xl max-w-2xl drop-cap">
            I do not write code to chase trends. I write systems that outlive the cycles they were deployed in. Software that holds together on the worst day, not the best one.
          </Reveal>

          <div className="grid md:grid-cols-2 gap-stack-xl text-body-md text-on-surface-variant font-medium leading-relaxed">
            <Reveal delay={0.2}>
              <p>
                The work spans five ecosystems: Stellar, Mantle,
                Polkadot, and Base. Payments rails, privacy primitives,
                on-chain credit, RWA infrastructure, and the agent systems that
                sit on top. Different problems, the same bias toward the boring,
                exhausting middle of the stack.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <p>
                Co-founder and lead architect/engineer at PayZoll. Stellar SCF grantee.
                Open campus incubation. Author of the Tesseract privacy protocol.
                Builder of Kredio on-chain credit. Most of what I am proud of
                is in production, clearing every day without my name attached.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
