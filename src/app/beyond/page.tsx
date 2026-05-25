import Link from "next/link";
import { coordinates, dispatches, signals } from "@/content/site";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/Reveal";

export const metadata = {
  title: "Beyond · Abhinav Pangaria",
  description: "Coordinates, dispatches, signals. What I'm reading, where I'm going, what I'm thinking.",
};

export default function BeyondPage() {
  return (
    <>
      <section className="px-6 md:px-[80px] pt-[120px] pb-stack-xl">
        <div className="grid md:grid-cols-12 gap-column-gap">
          <Reveal className="md:col-span-3 font-mono text-label-mono uppercase tracking-[0.18em] text-primary" y={20}>
            05 / Beyond · Field notes
          </Reveal>
          <Reveal className="md:col-span-9 max-w-3xl" y={32} delay={0.1}>
            <h1 className="font-display text-display-lg-mobile md:text-display-lg leading-[0.95] tracking-[-0.02em] text-on-surface">
              The rest <em className="italic text-primary">of the world.</em>
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="py-[120px] brutalist-rule-t brutalist-rule-b">
        <Reveal className="px-6 md:px-[80px] mb-stack-xl flex items-end justify-between" y={24}>
          <div>
            <div className="font-mono text-label-mono uppercase tracking-[0.18em] text-primary mb-stack-sm">
              Coordinates
            </div>
            <h2 className="font-display text-headline-lg tracking-[-0.02em] text-on-surface">
              Places I keep returning to.
            </h2>
          </div>
          <div className="hidden md:block font-mono text-label-mono uppercase tracking-[0.18em] text-on-surface-variant">
            {coordinates.length.toString().padStart(2, "0")} stations
          </div>
        </Reveal>
        <div className="hide-scrollbar overflow-x-auto snap-x snap-mandatory">
          <StaggerGroup className="flex gap-stack-md px-6 md:px-[80px] pb-stack-md">
            {coordinates.map((c) => (
              <StaggerItem
                key={c.city}
                className="snap-start shrink-0 w-[280px] md:w-[360px] aspect-[3/4] bg-surface-container-low brutalist-rule-t brutalist-rule-b brutalist-rule-l brutalist-rule-r relative overflow-hidden group"
              >
                <div className="absolute inset-0 grid-paper opacity-20" />
                <div className="absolute inset-stack-md flex flex-col justify-between">
                  <div className="font-mono text-label-mono uppercase tracking-[0.18em] text-primary">
                    {c.coord}
                  </div>
                  <div>
                    <h3 className="font-display text-headline-md text-on-surface mb-stack-sm">
                      {c.city}
                    </h3>
                    <p className="text-body-sm text-on-surface-variant">{c.note}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <section className="px-6 md:px-[80px] py-[120px] brutalist-rule-b">
        <div className="grid md:grid-cols-12 gap-column-gap mb-stack-xl">
          <Reveal className="md:col-span-3 font-mono text-label-mono uppercase tracking-[0.18em] text-primary" y={20}>
            Dispatches
          </Reveal>
          <Reveal className="md:col-span-9" y={28} delay={0.1}>
            <h2 className="font-display text-headline-lg tracking-[-0.02em] text-on-surface">
              Long reads, infrequently.
            </h2>
          </Reveal>
        </div>
        <StaggerGroup>
          {dispatches.map((d) => (
            <StaggerItem key={d.title}>
              <Link
                href={d.href}
                className="group grid grid-cols-12 gap-column-gap items-center py-stack-md brutalist-rule-t"
              >
                <span className="col-span-3 md:col-span-2 font-mono text-label-mono uppercase tracking-[0.18em] text-on-surface-variant">
                  {d.date}
                </span>
                <span className="col-span-6 md:col-span-8 font-display text-headline-md tracking-[-0.01em] text-primary group-hover:text-secondary transition-colors">
                  {d.title}
                </span>
                <span className="col-span-3 md:col-span-2 text-right font-mono text-label-mono uppercase tracking-[0.18em] text-on-surface-variant">
                  {d.readTime}
                </span>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      <section className="px-6 md:px-[80px] py-[120px]">
        <div className="grid md:grid-cols-12 gap-column-gap mb-stack-xl">
          <Reveal className="md:col-span-3 font-mono text-label-mono uppercase tracking-[0.18em] text-primary" y={20}>
            Signals
          </Reveal>
          <Reveal className="md:col-span-9" y={28} delay={0.1}>
            <h2 className="font-display text-headline-lg tracking-[-0.02em] text-on-surface">
              Short broadcasts.
            </h2>
          </Reveal>
        </div>
        <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-stack-md">
          {signals.map((s, i) => (
            <StaggerItem
              key={i}
              className="border border-outline-variant p-stack-md flex flex-col gap-stack-md hover:border-primary transition-colors"
            >
              <span className="material-symbols-outlined text-primary text-base">
                {s.icon}
              </span>
              <p className="editorial-text text-on-surface text-body-md">{s.text}</p>
              <span className="font-mono text-label-mono uppercase tracking-[0.18em] text-on-surface-variant mt-auto">
                {s.time}
              </span>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>
    </>
  );
}
