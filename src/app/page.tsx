import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { Identity } from "@/components/Identity";
import { FeaturedWork } from "@/components/FeaturedWork";
import { SITE_URL } from "@/content/site-url";
import { JsonLd } from "@/components/JsonLd";
import { PERSON_ID, SITE_ID, pageGraph } from "@/content/seo";

// The layout's canonical already points here, but an explicit one keeps a
// query string or a trailing variant from becoming a second home page.
export const metadata: Metadata = {
  alternates: { canonical: SITE_URL },
};

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={pageGraph({
          "@type": "ProfilePage",
          "@id": `${SITE_URL}/#homepage`,
          url: SITE_URL,
          name: "Abhinav Pangaria · Builder of resilient systems.",
          isPartOf: { "@id": SITE_ID },
          about: { "@id": PERSON_ID },
          mainEntity: { "@id": PERSON_ID },
        })}
      />
      <Hero />
      <Identity />
      <FeaturedWork />
    </>
  );
}
