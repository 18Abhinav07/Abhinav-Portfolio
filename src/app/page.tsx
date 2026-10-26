import { HomeView } from "@/components/home/HomeView";
import { JsonLd } from "@/components/JsonLd";
import { site } from "@/content/site";
import { projects } from "@/content/projects";
import { trips } from "@/content/trips";
import { pageGraph, profilePageSchema, workListSchema } from "@/content/seo";

export default function HomePage() {
  return (
    <>
      <JsonLd data={pageGraph(profilePageSchema(), workListSchema())} />
      <HomeView site={site} projects={projects} trips={trips} />
    </>
  );
}
