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
    <section className="px-6 md:px-[80px] py-[120px] md:py-[160px] bg-surface-container-low relative overflow-hidden">
      {/* Floating radial gradient background orb */}
      <div className="absolute top-1/2 left-2/3 w-[35vw] h-[35vw] rounded-full bg-gradient-to-tr from-primary/5 to-secondary/5 blur-[120px] pointer-events-none animate-float-orb z-0" />

      <div className="grid md:grid-cols-12 gap-column-gap relative z-10">
        <Reveal className="md:col-span-3 font-mono text-label-mono uppercase tracking-[0.18em]" y={20}>
          <span className="bg-primary text-on-surface px-2 py-0.5 rounded font-bold">04 / Updates · Feed</span>
        </Reveal>
        
        <div className="md:col-span-9 relative flex flex-col gap-12 pl-6 md:pl-10 mt-12 md:mt-0">
          {/* Vertical Timeline axis */}
          <div className="absolute left-[3px] top-2 bottom-2 w-[1.5px] bg-outline-variant/30" />

          {updates.map((update, i) => (
            <Reveal key={update.title} className="group relative" delay={i * 0.1}>
              {/* Timeline dot */}
              <div className="absolute -left-[27px] md:-left-[43px] top-1.5 w-3 h-3 rounded-full border border-outline-variant/50 bg-surface-container-low group-hover:border-primary group-hover:scale-110 transition-all duration-500 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-outline-variant group-hover:bg-primary transition-colors duration-500" />
              </div>

              <div className="flex flex-col md:flex-row md:items-start gap-stack-md md:gap-column-gap">
                <span className="font-mono text-label-mono text-on-surface-variant group-hover:text-on-surface transition-colors min-w-[100px] mt-0.5">
                  {update.date}
                </span>
                
                <div className="flex-grow">
                  <h3 className="font-display italic text-headline-sm text-on-surface mb-2 group-hover:text-on-surface transition-colors duration-500">
                    {update.title}
                  </h3>
                  <p className="text-body-md text-on-surface/85 max-w-xl leading-relaxed">
                    {update.note}
                  </p>
                </div>
                
                <span className="font-mono text-label-mono uppercase tracking-[0.18em] text-on-surface font-bold mt-0.5">
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
