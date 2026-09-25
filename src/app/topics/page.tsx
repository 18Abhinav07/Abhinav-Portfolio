import Link from "next/link";
import { TOPICS, resolveTopic } from "@/content/topics";
import { SITE_URL } from "@/content/site-url";
import { breadcrumbSchema, pageGraph } from "@/content/seo";
import { JsonLd } from "@/components/JsonLd";
import { Reveal } from "@/components/Reveal";

const url = `${SITE_URL}/topics`;

export const metadata = {
  title: "Topics · Abhinav Pangaria",
  description:
    "Nine subjects I build in, each with the systems and the writing behind it: agent verification, agent spend policy, Stellar, on-chain privacy, RWA, credit, payroll, backend, Claude Code.",
  alternates: { canonical: url },
  openGraph: {
    title: "Topics · Abhinav Pangaria",
    description: "Nine subjects, each with the systems and the writing behind it.",
    url,
    type: "website",
  },
};

export default function TopicsPage() {
  const topics = TOPICS.map(resolveTopic);

  return (
    <section className="px-6 md:px-[80px] py-[120px]">
      <JsonLd
        data={pageGraph(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Topics", path: "/topics" },
          ]),
          {
            "@type": "CollectionPage",
            name: "Topics",
            url,
            description: metadata.description,
            hasPart: TOPICS.map((t) => ({ "@id": `${SITE_URL}/topics/${t.slug}#topic` })),
          },
        )}
      />

      <div className="grid md:grid-cols-12 gap-column-gap mb-16 md:mb-24">
        <Reveal
          className="md:col-span-3 font-mono text-label-mono uppercase tracking-[0.18em] text-on-surface font-bold"
          y={20}
        >
          06 / Topics · Index
          <div className="mt-stack-md text-on-surface-variant font-normal">
            {topics.length.toString().padStart(2, "0")} subjects
          </div>
        </Reveal>
        <Reveal className="md:col-span-9 max-w-2xl" y={28} delay={0.1}>
          <h1 className="font-display text-headline-lg leading-[1.05] tracking-[-0.02em] text-on-surface mb-stack-md">
            What I build in.{" "}
            <em className="inline-block bg-primary text-on-surface px-3 py-1 rounded-md not-italic font-bold">
              And what proves it.
            </em>
          </h1>
          <p className="text-body-md text-on-surface-variant">
            One page per subject. Each opens with the question it answers, then the
            systems and the writing standing behind the answer.
          </p>
        </Reveal>
      </div>

      <ol className="border-t border-outline">
        {topics.map((t) => (
          <li key={t.slug} className="border-b border-outline">
            <Link
              href={`/topics/${t.slug}`}
              className="group grid md:grid-cols-12 gap-column-gap gap-y-4 py-10"
            >
              <div className="md:col-span-1 font-display text-headline-lg text-on-surface group-hover:text-on-surface-variant transition-colors">
                {t.index}
              </div>
              <div className="md:col-span-11 max-w-3xl">
                <h2 className="font-display text-headline-sm text-on-surface decoration-primary decoration-[3px] underline-offset-[6px] group-hover:underline">
                  {t.title}
                </h2>
                <p className="mt-3 text-body-md text-on-surface-variant">{t.question}</p>
                <div className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-on-surface-variant">
                  {t.projectEntries.length} {t.projectEntries.length === 1 ? "system" : "systems"}
                  {t.dispatchEntries.length > 0 && ` · ${t.dispatchEntries.length} written`}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
