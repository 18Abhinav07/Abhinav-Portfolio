export type Project = {
  slug: string;
  index: string;
  name: string;
  tagline: string;
  description: string;
  year: string;
  ecosystem: string;
  role: string;
  stack: string[];
  metrics: { label: string; value: string }[];
  liveUrl?: string;
  githubUrl?: string;
  heroImage: string;
  screenshots: { src: string; caption: string }[];
  accent: "primary" | "secondary";
};

export const projects: Project[] = [
  {
    slug: "payzoll",
    index: "01",
    name: "PayZoll",
    tagline: "Cross-border payroll and treasury, built for crypto-native teams.",
    description:
      "Payroll, vendor payouts, and treasury operations moving across Solana and Stellar with the reliability of legacy rails and the settlement speed of crypto. Built end to end: contracts, indexers, dashboards, and the boring middleware that keeps capital arriving on time.",
    year: "2024 · Present",
    ecosystem: "Solana / Stellar",
    role: "Co-founder · Lead Engineer",
    stack: ["Rust", "Go", "Solana SVM", "Stellar", "NestJS", "PostgreSQL"],
    metrics: [
      { label: "Grant", value: "$100K SCF" },
      { label: "Cohort", value: "Y-Combinator Alum" },
      { label: "Volume Processed", value: "10M+" },
    ],
    liveUrl: "https://payzoll.in",
    heroImage: "/images/projects/payzoll/PayZoll-Stellar-Home.png",
    screenshots: [
      { src: "/images/projects/payzoll/PayZoll-Stellar-Home.png", caption: "Stellar dashboard · home" },
      { src: "/images/projects/payzoll/PayZoll-Stellar-Features-1.png", caption: "Feature surface I" },
      { src: "/images/projects/payzoll/PayZoll-Stellar-Features-2.png", caption: "Feature surface II" },
      { src: "/images/projects/payzoll/PZ-Pharos-Home.png", caption: "Pharos console" },
    ],
    accent: "primary",
  },
  {
    slug: "openassets",
    index: "02",
    name: "OpenAssets",
    tagline: "The Mantle-native gateway bridging the RWA liquidity gap.",
    description:
      "Tokenize and invest in real-world invoices, leverage mETH for capital-efficient purchases, and access universal credit via an Open Access ID. Built ERC-3643 compliant on Mantle for the 2026 hackathon.",
    year: "2026",
    ecosystem: "Mantle Network",
    role: "Architect · Builder",
    stack: ["EVM", "ERC-3643", "Solidity", "TypeScript", "Node.js"],
    metrics: [
      { label: "Origin", value: "Mantle Hackathon 2026" },
      { label: "Compliance", value: "ERC-3643" },
      { label: "Surfaces", value: "Trade · Loan · P2P" },
    ],
    liveUrl: "https://www.openassets.xyz",
    githubUrl: "https://github.com/TheOpenAssets",
    heroImage: "/images/projects/openassets/Hero.png",
    screenshots: [
      { src: "/images/projects/openassets/Hero.png", caption: "Landing surface" },
      { src: "/images/projects/openassets/Marketplace.png", caption: "RWA marketplace" },
      { src: "/images/projects/openassets/Trade.png", caption: "Trade desk" },
      { src: "/images/projects/openassets/Trade-Chart.png", caption: "Trade charts" },
      { src: "/images/projects/openassets/Loan.png", caption: "Loan flow" },
      { src: "/images/projects/openassets/Auction.png", caption: "Auction engine" },
      { src: "/images/projects/openassets/ActiveBids.png", caption: "Active bids" },
      { src: "/images/projects/openassets/Positions.png", caption: "Positions ledger" },
      { src: "/images/projects/openassets/InterestChart.png", caption: "Interest curve" },
      { src: "/images/projects/openassets/P2P.png", caption: "P2P matchmaking" },
      { src: "/images/projects/openassets/SwapChart.png", caption: "Swap surface" },
      { src: "/images/projects/openassets/METH-buy.png", caption: "mETH purchase" },
      { src: "/images/projects/openassets/USDC-buy.png", caption: "USDC on-ramp" },
      { src: "/images/projects/openassets/MyAssets.png", caption: "Portfolio view" },
      { src: "/images/projects/openassets/Realfi.png", caption: "RealFi gateway" },
      { src: "/images/projects/openassets/Faucet.png", caption: "Faucet" },
      { src: "/images/projects/openassets/Features.png", caption: "Capability matrix" },
      { src: "/images/projects/openassets/ExpandedRow.png", caption: "Asset row detail" },
      { src: "/images/projects/openassets/Notifcations.png", caption: "Signals tray" },
      { src: "/images/projects/openassets/Footer.png", caption: "Footer composition" },
    ],
    accent: "secondary",
  },
  {
    slug: "tesseract",
    index: "03",
    name: "Tesseract",
    tagline: "Privacy-preserving payment & identity mixing on Stellar.",
    description:
      "Deposit, wait, withdraw. Withdrawals routed by a detached Distributor, breaking the on-chain link between depositor and recipient. Anonymous payments through temporal decorrelation and layered hybrid encryption.",
    year: "2024 · 2026",
    ecosystem: "Stellar · Soroban",
    role: "Backend Server Builder",
    stack: ["NestJS", "TypeScript", "Stellar SDK", "Soroban", "MongoDB", "Redis", "BullMQ", "Docker"],
    metrics: [
      { label: "Primitives", value: "Temporal Decorrelation" },
      { label: "Rotation", value: "Channel Accounts" },
      { label: "Crypto", value: "Hybrid Encryption" },
    ],
    liveUrl: "https://tesseractprotocol.xyz",
    githubUrl: "https://github.com/The-Tesseract-Protocol",
    heroImage: "/images/projects/tesseract/Tess-Hero.png",
    screenshots: [
      { src: "/images/projects/tesseract/Tess-Hero.png", caption: "Protocol landing" },
      { src: "/images/projects/tesseract/Tess-Private.png", caption: "Private payment flow" },
      { src: "/images/projects/tesseract/Tess-Batch.png", caption: "Batch settlement" },
      { src: "/images/projects/tesseract/Tess-Details.png", caption: "Transaction details" },
      { src: "/images/projects/tesseract/Tess-Info.png", caption: "Info surface" },
    ],
    accent: "primary",
  },
  {
    slug: "kredio",
    index: "04",
    name: "Kredio",
    tagline: "DeFi with memory. On-chain credit scoring on Polkadot.",
    description:
      "A tamper-proof ink! contract scores every borrower against on-chain history (repayments, volume, tenure), unlocking lower collateral and rates. Live on Polkadot Asset Hub Paseo testnet; phases 1 through 3 shipped.",
    year: "2024 · 2026",
    ecosystem: "Polkadot Asset Hub",
    role: "Lead Builder",
    stack: ["ink! Wasm", "Solidity", "Polkadot XCM", "PVM AI Layer"],
    metrics: [
      { label: "Status", value: "Paseo Testnet · Live" },
      { label: "Shipped", value: "Phases 1–3" },
      { label: "Layers", value: "ink! + EVM" },
    ],
    liveUrl: "https://kredio-gamma.vercel.app",
    githubUrl: "https://github.com/18Abhinav07/Kredio",
    heroImage: "/images/projects/kredio/Kredio-Hero.png",
    screenshots: [
      { src: "/images/projects/kredio/Kredio-Hero.png", caption: "Landing surface" },
      { src: "/images/projects/kredio/Kredio-Working-Model.png", caption: "Scoring model" },
      { src: "/images/projects/kredio/Kredio-Tiers.png", caption: "Borrower tiers" },
      { src: "/images/projects/kredio/Kredio-Swap.png", caption: "Swap surface" },
      { src: "/images/projects/kredio/Kredio-Docs.png", caption: "Docs surface" },
      { src: "/images/projects/kredio/Kredio-Footer.png", caption: "Footer composition" },
    ],
    accent: "secondary",
  },
  {
    slug: "clearsky",
    index: "05",
    name: "Clear Sky",
    tagline: "The trust layer for climate data. DePIN meets verifiable IP.",
    description:
      "Environmental sensor readings (AQI, CO₂, temperature) become cryptographic intellectual property. ECDSA-signed payloads minted as IP on Story Protocol, anchored by Coinbase Smart Wallet, preventing fake data and unlocking monetization.",
    year: "2026",
    ecosystem: "Base · Story Protocol",
    role: "Builder",
    stack: ["Next.js", "TypeScript", "Tailwind", "Story Protocol", "Solidity", "IPFS", "Coinbase Smart Wallet"],
    metrics: [
      { label: "Signing", value: "ECDSA" },
      { label: "IP Layer", value: "Story Protocol" },
      { label: "Status", value: "Phase 1 Foundation" },
    ],
    liveUrl: "https://docs.clearsky.network",
    heroImage: "/images/projects/clearsky/CS-Hero.png",
    screenshots: [
      { src: "/images/projects/clearsky/CS-Hero.png", caption: "Landing surface" },
      { src: "/images/projects/clearsky/CS-Features.png", caption: "Capability matrix" },
    ],
    accent: "primary",
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
