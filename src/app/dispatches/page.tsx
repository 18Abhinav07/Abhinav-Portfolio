import Link from "next/link";
import { getDispatches, formatDate } from "@/content/dispatches";
import { Reveal } from "@/components/Reveal";

export const metadata = {
  title: "Dispatches · Abhinav Pangaria",
  description:
    "Technical dispatches on agent verification, autonomous spend governance, and the systems that prove AI agents are actually done.",
  alternates: {
    types: { "application/rss+xml": "/dispatches/rss.xml" },
  },
};

export default function DispatchesPage() {
  const dispatches = getDispatches();

  return (
    <section className="px-6 md:px-[80px] py-[120px]">
      <div className="grid md:grid-cols-12 gap-column-gap mb-24 md:mb-32">
        <Reveal
          className="md:col-span-3 font-mono text-label-mono uppercase tracking-[0.18em] text-on-surface font-bold"
          y={20}
        >
          05 / Dispatches
          <div className="mt-stack-md text-on-surface-variant font-normal">
            {dispatches.length.toString().padStart(2, "0")} entries
          </div>
          <a
            href="/dispatches/rss.xml"
            className="mt-stack-sm block text-on-surface-variant font-normal hover:text-on-surface transition-colors"
          >
            RSS →
          </a>
        </Reveal>
        <Reveal className="md:col-span-9 max-w-2xl" y={28} delay={0.1}>
          <h1 className="font-display text-headline-lg leading-[1.05] tracking-[-0.02em] text-on-surface mb-stack-md">
            Agents can&apos;t be trusted{" "}
            <em className="inline-block bg-primary text-on-surface px-3 py-1 rounded-md not-italic font-bold">
              until they&apos;re proven
            </em>
          </h1>
          <p className="text-body-md text-on-surface-variant">
            Teardowns from inside the build — verification loops, policy firewalls, and the
            failures that made them necessary. Written once, here.
          </p>
        </Reveal>
      </div>

      {dispatches.length === 0 ? (
        <p className="font-mono text-label-mono uppercase tracking-[0.18em] text-on-surface-variant">
          First dispatch lands shortly.
        </p>
      ) : (
        <ul className="border-t border-outline">
          {dispatches.map((d) => (
            <li key={d.slug} className="border-b border-outline">
              <Link
                href={`/dispatches/${d.slug}`}
                className="group grid md:grid-cols-12 gap-column-gap py-10 md:py-12 items-baseline"
              >
                <div className="md:col-span-3 font-mono text-label-mono uppercase tracking-[0.18em] text-on-surface-variant mb-stack-sm md:mb-0">
                  {formatDate(d.date)}
                  <span className="block mt-1">{d.readTime}</span>
                </div>
                <div className="md:col-span-9 max-w-3xl">
                  <h2 className="font-display text-headline-sm text-on-surface mb-stack-sm transition-colors group-hover:text-on-surface-variant">
                    {d.title}
                  </h2>
                  <p className="text-body-md text-on-surface-variant mb-stack-md">{d.summary}</p>
                  <div className="flex flex-wrap gap-2">
                    {d.tags.map((t) => (
                      <span
                        key={t}
                        className="font-mono text-label-mono uppercase tracking-[0.12em] text-on-surface-variant border border-outline rounded-pill px-3 py-1"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
