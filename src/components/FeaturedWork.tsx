import { projects } from "@/content/projects";
import { ProjectCard } from "./ProjectCard";
import { Reveal } from "./Reveal";
import Link from "next/link";

export function FeaturedWork() {
  // Select top 2 systems as featured
  const featured = projects.slice(0, 2);

  return (
    <section className="px-6 md:px-[80px] py-[120px] md:py-[160px] bg-surface relative overflow-hidden">
      {/* Subtle Grid Accent */}
      <div className="absolute inset-0 grid-paper opacity-10 pointer-events-none" />

      {/* Floating Gradient Mesh Orb */}
      <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] rounded-full bg-gradient-to-tr from-secondary/5 to-primary/5 blur-[120px] pointer-events-none animate-float-orb z-0" />

      <div className="relative z-10">
        <div className="grid md:grid-cols-12 gap-column-gap mb-20 md:mb-28">
          <Reveal className="md:col-span-3 font-mono text-label-mono uppercase tracking-[0.18em]" y={20}>
            <span className="bg-primary text-on-surface px-2 py-0.5 rounded font-bold">03 / Featured · Selected Rails</span>
          </Reveal>
          <Reveal className="md:col-span-9 max-w-2xl" y={28} delay={0.1}>
            <h2 className="font-display text-headline-lg leading-[1.05] tracking-[-0.02em] text-on-surface mb-stack-md">
              Selected rails. <em className="inline-block bg-primary text-on-surface px-3 py-1 rounded-md not-italic font-bold">From Demos to Mainnet</em>
            </h2>
            <p className="text-body-md text-on-surface-variant leading-relaxed">
              A brief preview of live financial systems, compliant RWA primitives, and privacy layers running in production.
            </p>
          </Reveal>
        </div>

        {/* Asymmetric Editorial Grid: Items hang at different widths and offsets */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-24 md:gap-y-40 items-start">
          {featured.map((p, idx) => (
            <div 
              key={p.slug} 
              className={idx === 0 
                ? "md:col-span-7" 
                : "md:col-span-5 md:col-start-8 md:mt-32"
              }
            >
              <ProjectCard project={p} />
            </div>
          ))}
        </div>

        {/* Call to Action to view all work */}
        <Reveal className="mt-20 md:mt-28 flex justify-center" y={20}>
          <Link
            href="/work"
            className="group flex items-center gap-3 px-6 py-3.5 rounded-full border border-outline bg-surface-container-high/40 text-on-surface hover:border-primary hover:bg-primary hover:text-on-surface hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] uppercase font-mono text-[10px] tracking-widest font-semibold"
          >
            <span>View all production rails</span>
            <div className="w-5 h-5 rounded-full bg-on-surface/[0.04] group-hover:bg-white/40 flex items-center justify-center text-[10px] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-500">
              ↗
            </div>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
