import { Reveal } from "./Reveal";

const updates = [
  {
    date: "JUN 2026",
    title: "Technical Writing · Coming Soon",
    category: "Announcements",
    note: "Transitioning research notes into long-form technical audits and architectural breakdowns."
  },
  {
    date: "MAY 2026",
    title: "Stellar Mainnet Transition",
    category: "Production",
    note: "Hardening the liquidity bridge for PayZoll. Real-time settlement for cross-border rails."
  }
];

export function Updates() {
  return (
    <section className="px-6 md:px-[80px] py-[120px] bg-surface-container-low overflow-hidden">
      <div className="grid md:grid-cols-12 gap-column-gap">
        <Reveal className="md:col-span-3 font-mono text-label-mono uppercase tracking-[0.18em] text-primary" y={20}>
          06 / Updates & Log
        </Reveal>
        <div className="md:col-span-9 flex flex-col gap-stack-xl">
          {updates.map((update, i) => (
            <Reveal key={update.title} className="group" delay={i * 0.1}>
              <div className="flex flex-col md:flex-row md:items-baseline gap-stack-md md:gap-column-gap brutalist-rule-t pt-stack-md">
                <span className="font-mono text-label-mono text-on-surface-variant min-w-[100px]">
                  {update.date}
                </span>
                <div className="flex-grow">
                  <h3 className="font-display italic text-headline-sm text-on-surface mb-2">
                    {update.title}
                  </h3>
                  <p className="text-body-md text-on-surface-variant max-w-xl">
                    {update.note}
                  </p>
                </div>
                <span className="font-mono text-label-mono uppercase tracking-[0.18em] text-secondary">
                  [{update.category}]
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
