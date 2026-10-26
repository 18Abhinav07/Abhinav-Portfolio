import { llmsFull } from "@/content/seo";

export const dynamic = "force-static";

/** The whole site as one markdown file: about, every project in full, and links. */
export function GET() {
  return new Response(llmsFull(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
