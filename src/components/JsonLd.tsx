/**
 * Structured data, server rendered into the page HTML.
 *
 * It has to be in the markup rather than injected on the client: a crawler that
 * does not run JavaScript is exactly the reader this is for. Every page renders
 * at most one of these, with a @graph holding its nodes.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // The input is our own content modules, never user input, and JSON.stringify
      // output is escaped below for the one sequence that can close the tag early.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
