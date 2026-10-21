// Product types and conversions shared by the site, the admin (client side) and the seed script.
// No server-only imports here. Loading from the database lives in lib/produkty.ts.
import data from "@/docs/povodny-web/produkty.json";
import { formatPrice, type Locale, type Localized } from "@/lib/i18n";
import { kategorie, povodneKategorie, textyProduktov, type KategoriaSlug, type Variant } from "@/content/produkty";
import { dielaNaDomov } from "@/content/diela";
import type { PolozkaObchodu } from "@/components/obchod/obchod-zoznam";

export type Produkt = {
  /** Product code "KH-0001" from the database; missing on the defaults from the code */
  kod?: string;
  slug: string;
  /** Order in the shop, lowest first (the original shop listed the newest first) */
  poradie: number;
  nazov: Localized;
  popis: Localized<string[]>;
  /** Lowest price; products with variants start at this price */
  cena: number;
  varianty: Variant[];
  vypredane: boolean;
  /** null when the count is not tracked */
  pocetKusov: number | null;
  kategorie: KategoriaSlug[];
  /** "/images/..." paths from the code or res.cloudinary.com URLs uploaded in /admin */
  fotky: string[];
  /** Shown in the "Z ateliéru" grid on the homepage */
  naDomovskej: boolean;
  /** Large or fragile piece that is not shipped: the checkout offers only pickup */
  ibaOsobnyOdber: boolean;
  zverejneny: boolean;
};

/** One row of the Supabase `produkty` table (supabase/schema.sql) */
export type ProduktRow = {
  /** Set by the database; missing on a product that is not saved yet */
  id?: string;
  /** Product code "KH-0001", set by the database and never changed */
  kod?: string;
  slug: string;
  poradie: number;
  zverejneny: boolean;
  na_domovskej: boolean;
  /** Added later; missing until supabase/schema.sql runs again */
  iba_osobny_odber?: boolean;
  nazov_sk: string;
  nazov_en: string;
  /** Paragraphs separated by a blank line */
  popis_sk: string;
  popis_en: string;
  cena: number;
  varianty: { nazov_sk: string; nazov_en: string; cena: number }[];
  pocet_kusov: number | null;
  vypredane: boolean;
  kategorie: string[];
  fotky: string[];
};

export const KATEGORIE = Object.keys(kategorie) as KategoriaSlug[];

function lokalnaFotka(slug: string, url: string, i: number) {
  const ext = (url.split("?")[0].match(/\.\w+$/)?.[0] ?? ".jpg").toLowerCase().replace(".jpeg", ".jpg");
  return `/images/produkty/${slug}-${i + 1}${ext}`;
}

/**
 * The 48 products exported from the original site (docs/povodny-web/produkty.json) with the texts
 * from content/produkty.ts. The shop shows these while the database is not set up or empty, and
 * `npm run seed:produkty` copies them into it.
 */
export const predvoleneProdukty: Produkt[] = data.produkty.map((p, poradie) => {
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
    naDomovskej: dielaNaDomov.includes(p.slug),
    ibaOsobnyOdber: false,
    zverejneny: true,
  };
});

const odseky = (text: string) =>
  text
    .split(/\n(?:[ \t]*\n)+/)
    .map((o) => o.trim())
    .filter(Boolean);

export function zRiadku(row: ProduktRow): Produkt {
  return {
    kod: row.kod,
    slug: row.slug,
    poradie: row.poradie,
    nazov: { sk: row.nazov_sk, en: row.nazov_en || row.nazov_sk },
    popis: { sk: odseky(row.popis_sk ?? ""), en: odseky(row.popis_en || row.popis_sk || "") },
    cena: Number(row.cena),
    varianty: (row.varianty ?? []).map((v) => ({
      nazov: { sk: v.nazov_sk, en: v.nazov_en || v.nazov_sk },
      cena: Number(v.cena),
    })),
    vypredane: row.vypredane,
    pocetKusov: row.pocet_kusov,
    kategorie: (row.kategorie ?? []).filter((k): k is KategoriaSlug => (KATEGORIE as string[]).includes(k)),
    fotky: row.fotky ?? [],
    naDomovskej: row.na_domovskej,
    ibaOsobnyOdber: row.iba_osobny_odber ?? false,
    zverejneny: row.zverejneny,
  };
}

export function naRiadok(p: Produkt): ProduktRow {
  return {
    slug: p.slug,
    poradie: p.poradie,
    zverejneny: p.zverejneny,
    na_domovskej: p.naDomovskej,
    nazov_sk: p.nazov.sk,
    nazov_en: p.nazov.en,
    popis_sk: p.popis.sk.join("\n\n"),
    popis_en: p.popis.en.join("\n\n"),
    cena: p.cena,
    varianty: p.varianty.map((v) => ({ nazov_sk: v.nazov.sk, nazov_en: v.nazov.en, cena: v.cena })),
    pocet_kusov: p.pocetKusov,
    vypredane: p.vypredane,
    kategorie: p.kategorie,
    fotky: p.fotky,
  };
}

/** "75 €", or "od 39 €" for a cup that comes with or without a lid */
export function cenaProduktu(p: Produkt, lang: Locale) {
  const cena = formatPrice(p.cena, lang);
  if (p.varianty.length === 0) return cena;
  return lang === "sk" ? `od ${cena}` : `from ${cena}`;
}

const vypredaneText: Localized = { sk: "Vypredané", en: "Sold out" };

/** Category names in one language, edited in /admin (section "kategorie") */
export type NazvyKategorii = Record<KategoriaSlug, string>;

/** Card data for the shop list, in one language only */
export function polozkaObchodu(p: Produkt, lang: Locale, nazvy: NazvyKategorii): PolozkaObchodu {
  return {
    slug: p.slug,
    nazov: p.nazov[lang],
    kategoria: p.kategorie.map((k) => nazvy[k]).join(" · "),
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
export function podobneProdukty(produkty: Produkt[], produkt: Produkt, pocet = 4) {
  const ostatne = produkty.filter((p) => p.slug !== produkt.slug && !p.vypredane);
  const rovnaka = ostatne.filter((p) => p.kategorie.some((k) => produkt.kategorie.includes(k)));
  const ine = ostatne.filter((p) => !rovnaka.includes(p));
  return [...rovnaka, ...ine].slice(0, pocet);
}
