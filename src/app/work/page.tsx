import { projects } from "@/content/projects";
import { ProjectCard } from "@/components/ProjectCard";
import { Reveal } from "@/components/Reveal";

export const metadata = {
  title: "Work · Abhinav Pangaria",
  description: "Five production systems across Stellar, Mantle, Polkadot, and EVM networks.",
};

export default function WorkPage() {
  return (
    <section className="px-6 md:px-[80px] py-[120px]">
      <div className="grid md:grid-cols-12 gap-column-gap mb-24 md:mb-32">
        <Reveal className="md:col-span-3 font-mono text-label-mono uppercase tracking-[0.18em] text-primary" y={20}>
          03 / Work · Index
          <div className="mt-stack-md text-on-surface-variant">
            {projects.length.toString().padStart(2, "0")} entries
          </div>
        </Reveal>
        <Reveal className="md:col-span-9 max-w-2xl" y={28} delay={0.1}>
          <h1 className="font-display text-headline-lg leading-[1.05] tracking-[-0.02em] text-on-surface mb-stack-md">
            Five rails. <em className="italic text-primary">From Demos to Mainnet</em>
          </h1>
          <p className="text-body-md text-on-surface-variant">
            Systems that clear. Hover to explore the architecture, the metrics, and the code.
          </p>
        </Reveal>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20 md:gap-y-32">
        {projects.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
    </section>
  );
}
