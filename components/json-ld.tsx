// Structured data for search engines (schema.org JSON-LD), rendered as recommended in
// node_modules/next/dist/docs/01-app/02-guides/json-ld.md. "<" is escaped so no text can close the tag.
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", ...data }).replace(/</g, "\\u003c") }}
    />
  );
}
