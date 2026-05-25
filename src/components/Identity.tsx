import { Reveal } from "./Reveal";

export function Identity() {
  return (
    <section className="relative bg-surface-dim px-6 md:px-[80px] py-[120px] brutalist-rule-t brutalist-rule-b overflow-hidden">
      <div className="absolute inset-0 grid-paper opacity-20 pointer-events-none" />
      <div className="relative grid md:grid-cols-12 gap-column-gap">
        <Reveal className="md:col-span-3 font-mono text-label-mono uppercase tracking-[0.18em] text-primary" y={20}>
          02 / Identity
          <div className="mt-stack-md text-on-surface-variant">
            File · ap-002.md
            <br />
            Edit · 2026-05-25
          </div>
        </Reveal>
        <div className="md:col-span-9 max-w-3xl">
          <Reveal as="p" y={40} className="font-display italic text-headline-md text-on-surface leading-[1.3] mb-stack-lg drop-cap">
            I do not write code to chase trends. I write systems that outlive
            the cycles they were deployed in. Software that holds together on
            the worst day, not the best one.
          </Reveal>
          <div className="grid md:grid-cols-2 gap-stack-xl text-body-md text-on-surface-variant">
            <Reveal as="p" delay={0.1}>
              The work spans five ecosystems: Solana, Stellar, Mantle,
              Polkadot, and Base. Payments rails, privacy primitives,
              on-chain credit, RWA infrastructure, and the agent systems that
              sit on top. Different problems, the same bias toward the boring,
              exhausting middle of the stack.
            </Reveal>
            <Reveal as="p" delay={0.2}>
              Co-founder and lead engineer at PayZoll. Stellar SCF grantee.
              Y-Combinator alum. Author of the Tesseract privacy protocol.
              Builder of Kredio on-chain credit. Most of what I am proud of
              is in production, clearing every day without my name attached.
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
