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
                EDIT · 2026-09-25
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
                A verification loop wrapped around a coding agent: twelve
                phases, 460 unit tests, a scope guard, a bug memory keyed by
                similarity, and a real browser driving the feature before any
                task is allowed to advance. A policy firewall deciding what an
                autonomous agent may spend before its key ever signs, with the
                decision anchored where nobody can revise it. Shielded note
                pools and channel-account rotation, so the most boring path
                through a payment system is also the most private one. Credit
                scored across two runtimes and carried between parachains with
                no oracle in the risk path. Cross-border payroll formed and
                swapped along a payment path, where a retry is theft. Different
                problems, one bias: toward the boring,
                exhausting middle of the stack.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <p>
                Sole builder on two of these, lead architect and engineer on the
                rest, and sole technical owner of the payment infrastructure at
                the one that became a company. A summer inside JP Morgan Chase,
                asset and wealth management, where the problem was retrieval
                rather than consensus and the fix was a Python service that took
                bug triage from a week to a day. Stellar SCF grantee, open campus
                incubation, five hackathon wins. The shape of the work is the
                same every time: own it from the protocol or the contract up
                through the service layer to the dashboard someone actually looks
                at, then write up what it taught from the artifacts the build
                left behind rather than from memory. A ninth system is in active
                development.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
