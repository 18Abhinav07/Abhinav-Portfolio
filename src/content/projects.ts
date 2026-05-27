import data from "./data.json";

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

export const projects = data.projects as Project[];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
