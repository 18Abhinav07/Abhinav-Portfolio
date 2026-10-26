import data from "./data.json";

export type Project = {
  slug: string;
  index: string;
  name: string;
  tagline: string;
  description: string;
  year: string;
  ecosystem: string;
  /** Problem class this project belongs to. Shown on cards in place of the chain name. */
  domain: string;
  role: string;
  stack: string[];
  metrics: { label: string; value: string }[];
  liveUrl?: string;
  /** Public API base for a product whose backend is deployed on its own. */
  apiUrl?: string;
  githubUrl?: string;
  presentationUrl?: string;
  docsUrl?: string;
  /** Long-form write-up hosted off-site (dev.to), for projects without a dispatch. */
  blogUrl?: string;
  heroImage: string;
  screenshots: { src: string; caption: string }[];
  videos?: { title?: string; youtubeId: string }[];
  /** A live page shown inside the deep dive: a results site, a write-up, or a self-hosted copy under /embeds. */
  embed?: { src: string; title: string };
  /** Long-form writing about this project, on dev.to. */
  posts?: { title: string; url: string }[];
  accent: "primary" | "secondary";
};

export const projects = data.projects as Project[];

/** All writing lives on dev.to; the site links out rather than hosting posts. */
export const DEVTO_URL = "https://dev.to/abhinav_pangaria";

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
