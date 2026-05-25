export type Episode = {
  slug: string;
  index: string;
  title: string;
  subtitle: string;
  era: string;
  date: string;
  category: string;
  excerpt: string;
  aspect: string;
  accent: "primary" | "secondary";
  locked?: boolean;
  body: { kind: "p" | "h2" | "quote" | "phase"; text: string }[];
};

export const episodes: Episode[] = [
  {
    slug: "college-foundations",
    index: "01",
    title: "College Foundations.",
    subtitle: "Where curiosity became a craft.",
    era: "S01 · 2021 — 2022",
    date: "AUG 2021",
    category: "Origins",
    excerpt:
      "First-year. A laptop, a CS curriculum, and a stubborn refusal to write throwaway code. Algorithms in the day, half-broken side projects at night.",
    aspect: "aspect-[3/4]",
    accent: "primary",
    body: [
      { kind: "p", text: "Most of what mattered in college wasn't in the syllabus. It was the long detours: writing a malloc from scratch to see what segfaults looked like up close, scraping campus portals before there was a polite reason to, debugging Linux network stacks at 2am because the textbook example didn't match the wire." },
      { kind: "phase", text: "Phase 01 / Apprenticeship" },
      { kind: "h2", text: "The shape of a builder." },
      { kind: "p", text: "I learned early that taste comes from quantity. The path from first-year to mainnet isn't a leap — it's a thousand boring repetitions until you stop being surprised by your own bugs." },
    ],
  },
  {
    slug: "hackathon-arc",
    index: "02",
    title: "The Hackathon Arc.",
    subtitle: "48-hour ships became a posture.",
    era: "S01 · 2022 — 2023",
    date: "FEB 2023",
    category: "Velocity",
    excerpt: "Twenty-some hackathons later, the lessons compounded: ship something working, ship it fast, ship it honest.",
    aspect: "aspect-square",
    accent: "secondary",
    body: [
      { kind: "p", text: "Hackathons taught me a posture before they taught me anything technical. Build with a clock. Build with a partner who disagrees. Build something a stranger can use without your help in the room." },
      { kind: "phase", text: "Phase 02 / Compounding" },
      { kind: "h2", text: "Velocity is a craft." },
      { kind: "quote", text: "If you cannot ship in 48 hours, you cannot ship in 48 weeks. The constraints don't change — only the scope." },
      { kind: "p", text: "The arc gave me the muscle for everything that came after: a default mode of shipping rather than planning, prototyping rather than discussing." },
    ],
  },
  {
    slug: "founding-payzoll",
    index: "03",
    title: "Founding PayZoll.",
    subtitle: "The decision to build a company.",
    era: "S01 · 2024",
    date: "MAR 2024",
    category: "Inflection",
    excerpt:
      "Payment infrastructure that actually clears. No vaporware, no abstract protocols — institutional-grade engineering for capital that needs to move now.",
    aspect: "aspect-video",
    accent: "primary",
    body: [
      { kind: "p", text: "PayZoll began the way most real companies do: a problem we could not stop thinking about. Capital moves slowly between borders and blockchains. The friction is not theoretical — it's a stack of legacy rails, opaque counterparties, and protocols that prioritize narratives over throughput." },
      { kind: "phase", text: "Phase 03 / Conviction" },
      { kind: "h2", text: "Engineering as a thesis." },
      { kind: "p", text: "We chose Rust and Go because they are languages of operators, not narratives. We chose Solana SVM and Stellar because they clear. Y-Combinator backed the thesis. The $100K SCF grant validated it. Ten million in volume processed turned it into something other than a deck." },
    ],
  },
  {
    slug: "evm-to-mainnet",
    index: "04",
    title: "EVM to Mainnet.",
    subtitle: "Lessons from production-grade Web3.",
    era: "S01 · 2024",
    date: "OCT 24, 2024",
    category: "Architecture",
    excerpt: "What changes when the contract you wrote is irrevocable and the bridge you maintain holds someone else's payroll.",
    aspect: "aspect-square",
    accent: "secondary",
    body: [
      { kind: "p", text: "There is a particular silence when you push a Solidity contract to mainnet for the first time and the deploy completes. No rollback. No staging gate. No second take. The code you just wrote is now law for everyone who calls it." },
      { kind: "phase", text: "Phase 02 / Synchronization" },
      { kind: "h2", text: "The Subgraph Paradigm." },
      { kind: "p", text: "Mainnet teaches you that observability is not a nice-to-have. It is the entire product, dressed up in different clothes. Indexers, subgraphs, replay logs — these are how you sleep at night." },
      { kind: "quote", text: "The first deploy is the easy part. The fourteenth incident response at 3am is when you find out whether you actually built something durable." },
      { kind: "p", text: "I came out of the EVM season with a much narrower set of opinions and a much wider set of scars. Both compound." },
    ],
  },
  {
    slug: "tesseract-and-zk",
    index: "05",
    title: "Tesseract & ZK.",
    subtitle: "Building privacy infrastructure on Stellar.",
    era: "S01 · 2025",
    date: "MAY 2025",
    category: "Cryptography",
    excerpt:
      "Deposit, wait, withdraw — a Distributor severs the link between depositors and recipients. Temporal decorrelation as a primitive.",
    aspect: "aspect-[3/4]",
    accent: "primary",
    body: [
      { kind: "p", text: "Privacy as a feature is marketing. Privacy as a primitive is architecture. Tesseract makes that distinction concrete: a Deposit → Wait → Withdraw mechanism where a detached Distributor handles outflow, breaking the on-chain link between depositor and recipient." },
      { kind: "phase", text: "Phase 04 / Primitives" },
      { kind: "h2", text: "Temporal decorrelation." },
      { kind: "p", text: "Channel-account rotation, hybrid encryption, BullMQ-backed scheduling — every layer designed so that the most boring path through the system is also the most private one." },
    ],
  },
  {
    slug: "whats-next",
    index: "06",
    title: "What's Next.",
    subtitle: "Unlock final chapter.",
    era: "S01 · Forthcoming",
    date: "TBD",
    category: "Forthcoming",
    excerpt: "The next surface is being built quietly. Check back when it's worth your time.",
    aspect: "aspect-video",
    accent: "secondary",
    locked: true,
    body: [
      { kind: "p", text: "The next chapter is being written in commits. Check back when the work is closer to launch." },
    ],
  },
];

export const getEpisode = (slug: string) => episodes.find((e) => e.slug === slug);
