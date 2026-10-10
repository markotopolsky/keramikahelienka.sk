// The shop reads the products exported from the original site (docs/povodny-web/produkty.json)
// until the phase 3 CMS replaces it. Photos were downloaded to public/images/produkty/<slug>-<n>.<ext>.
import data from "@/docs/povodny-web/produkty.json";
import { formatPrice, type Locale, type Localized } from "@/lib/i18n";
import { kategorie, povodneKategorie, textyProduktov, type KategoriaSlug, type Variant } from "@/content/produkty";
import type { PolozkaObchodu } from "@/components/obchod/obchod-zoznam";

export type Produkt = {
  slug: string;
  /** Position in the original shop, newest first */
  poradie: number;
  nazov: Localized;
  popis: Localized<string[]>;
  /** Lowest price; products with variants start at this price */
  cena: number;
  varianty: Variant[];
  vypredane: boolean;
  /** null when the original shop did not track the count */
  pocetKusov: number | null;
  kategorie: KategoriaSlug[];
  fotky: string[];
};

function lokalnaFotka(slug: string, url: string, i: number) {
  const ext = (url.split("?")[0].match(/\.\w+$/)?.[0] ?? ".jpg").toLowerCase().replace(".jpeg", ".jpg");
  return `/images/produkty/${slug}-${i + 1}${ext}`;
}

export const produkty: Produkt[] = data.produkty.map((p, poradie) => {
  const text = textyProduktov[p.slug];
  if (!text) throw new Error(`content/produkty.ts has no texts for product "${p.slug}"`);
  const slugyKategorii =
    text.kategorie ?? p.kategorie.map((k) => povodneKategorie[k]).filter((k): k is KategoriaSlug => Boolean(k));

  return {
    slug: p.slug,
    poradie,
    nazov: text.nazov,
    popis: text.popis,
    cena: p.cena_eur,
    varianty: text.varianty ?? [],
    vypredane: !p.na_sklade,
    pocetKusov: p.pocet_kusov,
    kategorie: [...new Set(slugyKategorii)],
    fotky: p.fotky.map((url, i) => lokalnaFotka(p.slug, url, i)),
  };
});

export function najdiProdukt(slug: string) {
  return produkty.find((p) => p.slug === slug);
}

/** "75 €", or "od 39 €" for a cup that comes with or without a lid */
export function cenaProduktu(p: Produkt, lang: Locale) {
  const cena = formatPrice(p.cena, lang);
  if (p.varianty.length === 0) return cena;
  return lang === "sk" ? `od ${cena}` : `from ${cena}`;
}

const vypredaneText: Localized = { sk: "Vypredané", en: "Sold out" };

/** Card data for the shop list, in one language only */
export function polozkaObchodu(p: Produkt, lang: Locale): PolozkaObchodu {
  return {
    slug: p.slug,
    nazov: p.nazov[lang],
    kategoria: p.kategorie.map((k) => kategorie[k][lang]).join(" · "),
    cena: cenaProduktu(p, lang),
    foto: p.fotky[0],
    vypredane: p.vypredane,
    vypredaneText: vypredaneText[lang],
    kategorie: p.kategorie,
    cenaCislo: p.cena,
    poradie: p.poradie,
  };
}

/** Up to `pocet` other available pieces, from the same category first */
export function podobneProdukty(produkt: Produkt, pocet = 4) {
  const ostatne = produkty.filter((p) => p.slug !== produkt.slug && !p.vypredane);
  const rovnaka = ostatne.filter((p) => p.kategorie.some((k) => produkt.kategorie.includes(k)));
  const ine = ostatne.filter((p) => !rovnaka.includes(p));
  return [...rovnaka, ...ine].slice(0, pocet);
}
