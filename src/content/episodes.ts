import data from "./data.json";

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

export const episodes = data.episodes as Episode[];

export const getEpisode = (slug: string) => episodes.find((e) => e.slug === slug);
