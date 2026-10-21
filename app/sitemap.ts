import type { MetadataRoute } from "next";
import { localizeHref, locales } from "@/lib/i18n";
import { webUrl } from "@/lib/metadata";
import { getProdukty } from "@/lib/produkty";
import { kurzyStranky, navigacia } from "@/content/atelier";
import { clanky } from "@/content/blog";

// Every page in both languages, each with a link to its other language version.
// Left out: the cart and checkout (robots.ts) and the legal pages, which are noindex
// while they are drafts (components/pravna-stranka.tsx).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const produkty = await getProdukty();
  const cesty = [
    "/",
    ...navigacia.map((polozka) => polozka.href),
    ...kurzyStranky.map((k) => `/kurzy/${k.slug}`),
    ...produkty.map((p) => `/obchod/${p.slug}`),
    ...clanky.map((c) => `/blog/${c.slug}`),
  ];

  return cesty.flatMap((cesta) => {
    const languages = Object.fromEntries(locales.map((lang) => [lang, webUrl + localizeHref(cesta, lang)]));
    return locales.map((lang) => ({ url: webUrl + localizeHref(cesta, lang), alternates: { languages } }));
  });
}
