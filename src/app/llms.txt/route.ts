import { llmsIndex } from "@/content/seo";

export const dynamic = "force-static";

/** A markdown map of the site, for models that arrive without a crawl budget. */
export function GET() {
  return new Response(llmsIndex(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
