import type { Metadata } from "next";
import { getLang } from "@/lib/i18n-server";
import { localizeHref, type Locale, type Localized } from "@/lib/i18n";
import { cloudinaryUrl } from "@/lib/cloudinary";
import { kontakt } from "@/content/atelier";

export const webUrl = "https://www.keramikahelienka.sk";

/** Photo shown when a page is shared on Facebook, WhatsApp etc. (the original site used Helena's portrait) */
const predvolenyObrazok = "/images/helena/helena-portret.jpg";

/**
 * Open Graph fields every page shares. Next.js replaces the whole openGraph object of the layout
 * when a page sets its own, so pages spread this instead of relying on the layout.
 */
export function zakladOpenGraph(lang: Locale, obrazok = predvolenyObrazok): NonNullable<Metadata["openGraph"]> {
  return {
    type: "website",
    siteName: kontakt.nazov,
    locale: lang === "sk" ? "sk_SK" : "en_GB",
    images: [{ url: cloudinaryUrl(obrazok, ["c_fill", "g_auto", "w_1200", "h_630", "f_jpg", "q_auto"]), width: 1200, height: 630 }],
  };
}

type PageMetadata = {
  /** Slovak path of the page, e.g. "/kurzy" */
  path: string;
  /** A text in the page language (from /admin), or both languages */
  title?: Localized | string;
  description: Localized | string;
  /** "/images/..." photo for sharing; Helena's portrait when left out */
  obrazok?: string;
};

/**
 * Title and description in the page language, plus links to the other language version
 * (hreflang), so search engines show Slovak visitors /kurzy and English ones /en/kurzy.
 */
export async function pageMetadata({ path, title, description, obrazok }: PageMetadata): Promise<Metadata> {
  const lang = await getLang();
  const titulok = typeof title === "string" ? title : title?.[lang];
  const popis = typeof description === "string" ? description : description[lang];
  return {
    ...(titulok && { title: titulok }),
    description: popis,
    alternates: {
      canonical: localizeHref(path, lang),
      languages: { sk: path, en: localizeHref(path, "en"), "x-default": path },
    },
    openGraph: {
      ...zakladOpenGraph(lang, obrazok),
      ...(titulok && { title: titulok }),
      description: popis,
      url: localizeHref(path, lang),
    },
  };
}
