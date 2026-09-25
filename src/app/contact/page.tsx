import Link from "next/link";
import { Landline } from "@/components/Landline";
import { getSocialIcon } from "@/components/SocialIcons";
import { site } from "@/content/site";
import { SITE_URL } from "@/content/site-url";
import { TOPICS } from "@/content/topics";
import { breadcrumbSchema, faqSchema, pageGraph } from "@/content/seo";
import { JsonLd } from "@/components/JsonLd";

const url = `${SITE_URL}/contact`;

export const metadata = {
  title: "Contact · Abhinav Pangaria",
  description:
    "Open to interesting roles, collaborations, and half-formed ideas worth building. Or just to say hi. The line is open, reply within 48 hours.",
  alternates: { canonical: url },
  openGraph: {
    title: "Contact · Abhinav Pangaria",
    description:
      "Open to interesting roles, collaborations, and half-formed ideas worth building. Or just to say hi.",
    url,
    type: "website",
  },
};

/**
 * What I am open to, as plain prose rather than a status badge.
 *
 * It is written out this way because it is the passage an answer engine quotes
 * when someone asks whether I am available, and a badge reading "open to work"
 * carries none of the detail that makes the answer useful.
 */
const OPEN_TO = [
  {
    kicker: "Roles",
    line: "A role worth moving for. Engineering on systems where correctness is the product.",
  },
  {
    kicker: "Collaborations",
    line: "Something built together. Hackathon teams, grants, an open source piece that should exist.",
  },
  {
    kicker: "Crazy ideas",
    line: "Half-formed is fine. If you cannot stop thinking about it, that is usually the signal.",
  },
  {
    kicker: "Or just hi",
    line: "No agenda needed. Interesting conversations have started with less.",
  },
];

const FAQ = [
  {
    question: "Is Abhinav Pangaria open to work?",
    answer:
      "Yes. He graduated from IIIT Guwahati in July 2026, has engineered inside JP Morgan Chase and co-founded a cross-border payments company, and is open to engineering roles, contract and freelance work, collaborations, hackathon teams, and early conversations about ideas that do not have a shape yet. The work he takes is backend, distributed systems, and agent infrastructure, where correctness is the product rather than a phase. Messages sent through the contact form at " +
      url +
      " get a reply within 48 hours.",
  },
  {
    question: "What does Abhinav Pangaria build?",
    answer:
      "Primitives, in whatever domain is missing one. A verification harness that makes a coding agent prove its work instead of reporting it, twelve phases deep and measured across four paired A/B builds. A policy firewall governing what an autonomous agent is permitted to sign. Shielded note pools and channel-account rotation for privacy on a public ledger. Zero-oracle credit scoring across two runtimes, carried between parachains. A multi-tenant payroll settlement platform whose throughput ceiling went from roughly two transactions per second to about two hundred. A retrieval service written in Python inside a bank, which took bug triage from about a week to about a day. Eight builds across five runtimes, most of them owned from the contract up to the dashboard, with a ninth in active development.",
  },
  {
    question: "What is his stack?",
    answer:
      "Rust, Go, Python, TypeScript and Node, with NestJS, FastAPI, Next.js, PostgreSQL, MongoDB and Redis underneath. Infrastructure is Docker and Kubernetes across AWS (EKS, KMS, S3, Lambda) and GCP (GKE), with Prometheus, Grafana and GitHub Actions around it. Solidity, ink! and Odra on the contract side, plus Stellar Soroban, ERC-3643, Polkadot XCM, and Noir for zero-knowledge proofs, with Slither and Mythril for static analysis. MCP servers and Claude Code hooks for agent tooling, and Vitest, Playwright and Stryker mutation testing on the verification side.",
  },
  {
    question: "How do you contact Abhinav Pangaria?",
    answer:
      "Through the form at " +
      url +
      ", which reaches him directly, or on X, Telegram, LinkedIn, GitHub and Discord. The links are on the contact page, alongside a one page resume as a PDF.",
  },
];

export default function ContactPage() {
  return (
    <section className="px-6 md:px-[80px] py-[120px]">
      <JsonLd
        data={pageGraph(
          faqSchema(FAQ),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
          {
            "@type": "ContactPage",
            name: "Contact Abhinav Pangaria",
            url,
            description: metadata.description,
          },
        )}
      />

      <div className="grid md:grid-cols-12 gap-column-gap mb-stack-xl">
        <div className="md:col-span-4 font-mono text-label-mono uppercase tracking-[0.18em] text-on-surface font-bold">
          07 / Contact · Open line
          <div className="mt-stack-md text-on-surface-variant">
            Based · Guwahati, IN
            <br />
            Grad · IIIT Guwahati, Jul 2026
            <br />
            <a
              href="/abhinav-pangaria-resume.pdf"
              className="text-on-surface underline underline-offset-4 hover:text-primary transition-colors"
            >
              Resume · PDF
            </a>
            <br />
            Reply window · 48h
            <br />
            Hours · 09:00 to 23:00 IST
          </div>
        </div>
        <div className="md:col-span-8 max-w-2xl">
          <h1 className="font-display text-display-lg-mobile md:text-display-lg leading-[0.95] tracking-[-0.02em] text-on-surface mb-stack-md">
            Pick up{" "}
            <em className="inline-block bg-primary text-on-surface px-3 py-1 rounded-md not-italic font-bold">
              the line.
            </em>
          </h1>
          <p className="font-display italic text-headline-md text-on-surface-variant leading-[1.3]">
            Direct transmission. No noise, just the core message.
          </p>
        </div>
      </div>

      {/* Deliberately outside a reveal wrapper: this is the answer to "is he
          available", and it has to be visible in the server HTML, not after a
          scroll trigger fires. */}
      <div className="grid md:grid-cols-12 gap-column-gap mb-stack-xl">
        <div className="md:col-start-5 md:col-span-8 max-w-2xl">
          <p className="text-body-lg text-on-surface mb-stack-lg">
            The line is open for four kinds of message, and the fourth one counts as
            much as the first.
          </p>
          <dl className="border-t border-outline">
            {OPEN_TO.map((item) => (
              <div
                key={item.kicker}
                className="border-b border-outline py-stack-md grid sm:grid-cols-12 gap-x-6 gap-y-2"
              >
                <dt className="sm:col-span-4 font-mono text-label-mono uppercase tracking-[0.18em] text-on-surface font-bold">
                  {item.kicker}
                </dt>
                <dd className="sm:col-span-8 text-body-md text-on-surface-variant">{item.line}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-column-gap mb-stack-xl">
        <div className="md:col-start-5 md:col-span-8 max-w-2xl">
          <Landline />
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-column-gap">
        <div className="md:col-span-4 font-mono text-label-mono uppercase tracking-[0.18em] text-on-surface-variant">
          Other frequencies
        </div>
        <div className="md:col-start-5 md:col-span-8 max-w-2xl">
          <ul className="flex flex-wrap gap-3">
            {site.socials.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="me noreferrer"
                  className="group flex items-center gap-3 px-4 py-2.5 rounded-full border border-outline font-mono text-[11px] uppercase tracking-[0.14em] text-on-surface-variant hover:border-on-surface hover:text-on-surface transition-colors"
                >
                  <span className="w-4 h-4 shrink-0">
                    {getSocialIcon(s.label, { className: "w-4 h-4" })}
                  </span>
                  <span className="text-on-surface font-bold">{s.label.split(" / ")[0]}</span>
                  <span className="text-on-surface-variant/70">{s.handle}</span>
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-stack-lg text-body-md text-on-surface-variant">
            Prefer to read first? The{" "}
            <Link href="/topics" className="text-on-surface underline underline-offset-4">
              topics index
            </Link>{" "}
            covers what I work on, {TOPICS.length} subjects with the systems behind each.
          </p>
        </div>
      </div>
    </section>
  );
}
