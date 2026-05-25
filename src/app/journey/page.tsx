import { episodes } from "@/content/episodes";
import { EpisodeCard } from "@/components/EpisodeCard";
import { Reveal } from "@/components/Reveal";

export const metadata = {
  title: "Journey · Abhinav Pangaria",
  description: "Six episodes. Origins, hackathons, founding, mainnet, ZK, and what comes next.",
};

export default function JourneyPage() {
  return (
    <section className="px-6 md:px-[80px] py-[120px]">
      <div className="grid md:grid-cols-12 gap-column-gap mb-stack-xl">
        <Reveal className="md:col-span-3 font-mono text-label-mono uppercase tracking-[0.18em] text-primary" y={20}>
          04 / Journey · Series 01
          <div className="mt-stack-md text-on-surface-variant">
            {episodes.length.toString().padStart(2, "0")} episodes
          </div>
        </Reveal>
        <Reveal className="md:col-span-9 max-w-2xl" y={28} delay={0.1}>
          <h1 className="font-display text-headline-lg leading-[1.05] tracking-[-0.02em] text-on-surface mb-stack-md">
            Six episodes. <em className="italic text-primary">One throughline.</em>
          </h1>
          <p className="text-body-md text-on-surface-variant">
            The mosaic below is read left-to-right, top-to-bottom. Each card
            opens into a long-form essay.
          </p>
        </Reveal>
      </div>

      <Reveal className="grid grid-cols-1 md:grid-cols-12 gap-px bg-outline-variant" y={40}>
        {episodes.map((e) => (
          <EpisodeCard key={e.slug} episode={e} />
        ))}
      </Reveal>
    </section>
  );
}
