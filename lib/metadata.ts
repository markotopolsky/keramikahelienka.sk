import type { Metadata } from "next";
import { getLang } from "@/lib/i18n-server";
import { localizeHref, type Localized } from "@/lib/i18n";

type PageMetadata = {
  /** Slovak path of the page, e.g. "/kurzy" */
  path: string;
  title?: Localized;
  description: Localized;
};

/**
 * Title and description in the page language, plus links to the other language version
 * (hreflang), so search engines show Slovak visitors /kurzy and English ones /en/kurzy.
 */
export async function pageMetadata({ path, title, description }: PageMetadata): Promise<Metadata> {
  const lang = await getLang();
  return {
    ...(title && { title: title[lang] }),
    description: description[lang],
    alternates: {
      canonical: localizeHref(path, lang),
      languages: { sk: path, en: localizeHref(path, "en"), "x-default": path },
    },
  };
}
