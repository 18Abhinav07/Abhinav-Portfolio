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
  accent: "primary" | "secondary";
};

export const projects = data.projects as Project[];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
