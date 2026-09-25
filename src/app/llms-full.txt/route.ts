import { llmsFull } from "@/content/seo";

export const dynamic = "force-static";

/** Every published dispatch as plain markdown, canonical URL attached to each. */
export function GET() {
  return new Response(llmsFull(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
