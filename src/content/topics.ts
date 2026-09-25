import topicsData from "./topics.json";
import { getProject, type Project } from "./projects";
import { getDispatches, type Dispatch } from "./dispatches";

/**
 * A topic hub is one canonical page per subject I can be linked with.
 *
 * The reason it exists: the writing is all about one subject (every dispatch is a
 * Guardian Kane teardown) while the breadth lives in the projects. A search for
 * "on-chain credit" has nothing to land on, because the only page that mentions it
 * is a project card. A hub collects the projects and the posts behind a subject,
 * opens with a direct answer to the question people actually type, and gives every
 * other page on that subject something to link to.
 *
 * The registry is JSON so a hub can be reviewed as content rather than as code.
 * Slugs in `projects` and `dispatches` are resolved at build time and a bad one
 * fails the build, which is the only way this stays honest as posts are added.
 */
export type Topic = {
  slug: string;
  /** Two digit ordinal, matching the section numbering used across the site. */
  index: string;
  title: string;
  headline: string;
  /** The question the hub answers, phrased the way someone would ask it. */
  question: string;
  /** The answer, first thing on the page. This is the passage an engine quotes. */
  answer: string;
  keywords: string[];
  projects: string[];
  dispatches: string[];
  related: string[];
};

export const TOPICS: Topic[] = topicsData;

export const getTopic = (slug: string): Topic | undefined =>
  TOPICS.find((t) => t.slug === slug);

export type ResolvedTopic = Topic & {
  projectEntries: Project[];
  dispatchEntries: Dispatch[];
  relatedTopics: Topic[];
};

/**
 * A hub with its references resolved. Throws on an unknown slug rather than
 * silently rendering a hub with a missing project, which would read as a gap in
 * the work rather than as the typo it is.
 */
export const resolveTopic = (topic: Topic): ResolvedTopic => {
  const published = getDispatches();
  return {
    ...topic,
    projectEntries: topic.projects.map((slug) => {
      const p = getProject(slug);
      if (!p) throw new Error(`Topic "${topic.slug}" names unknown project "${slug}".`);
      return p;
    }),
    // Drafts are filtered out rather than thrown on: a hub may legitimately list a
    // post that is still being written, and it simply does not appear until it ships.
    dispatchEntries: topic.dispatches
      .map((slug) => published.find((d) => d.slug === slug))
      .filter((d): d is Dispatch => Boolean(d)),
    relatedTopics: topic.related.map((slug) => {
      const t = getTopic(slug);
      if (!t) throw new Error(`Topic "${topic.slug}" names unknown related topic "${slug}".`);
      return t;
    }),
  };
};

/** Hubs that mention this project, for the cross-link on a case study. */
export const topicsForProject = (slug: string): Topic[] =>
  TOPICS.filter((t) => t.projects.includes(slug));

/** Hubs that list this dispatch, for the cross-link at the end of a post. */
export const topicsForDispatch = (slug: string): Topic[] =>
  TOPICS.filter((t) => t.dispatches.includes(slug));
