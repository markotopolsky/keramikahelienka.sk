import { unstable_cache } from "next/cache";
import type { Locale } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import { optimizedImageUrl } from "@/lib/cloudinary";
import { DEFAULTS, isEnglishKey, isImageKey, isSwitchOn, isTranslatedKey } from "@/lib/content-defaults";
import { kontakt as kontaktVKode, kurzyStranky } from "@/content/atelier";

export type ContentMap = Record<string, string>;

/** Defaults with the database rows of one section on top, both languages, as stored */
async function fetchSection(section: string): Promise<ContentMap> {
  const result: ContentMap = { ...(DEFAULTS[section] ?? {}) };
  if (!supabase) return result;

  const { data, error } = await supabase.from("content").select("key, value").eq("section", section);

  if (error) {
    console.error(`getContent("${section}") failed:`, error.message);
    return result;
  }

  for (const row of data ?? []) {
    // A cleared photo falls back to the default one instead of leaving a hole
    if (isImageKey(row.key) && !row.value) continue;
    result[row.key] = row.value ?? "";
  }
  return result;
}

/**
 * A content value ready to show, or "" when it is still an „xxx …" authoring placeholder
 * or blank. Lets a component show its "doplniť" gap or skip an empty slot.
 */
export function filled(value: string | undefined): string {
  const text = (value ?? "").trim();
  return /^xxx\b/i.test(text) ? "" : text;
}

const cachedSection = (section: string) =>
  unstable_cache(() => fetchSection(section), ["content", section], {
    // Fallback only: /api/revalidate busts the "content" tag on every admin save,
    // so this window just bounds staleness if that ping is missed.
    revalidate: 3600,
    tags: ["content", `content:${section}`],
  })();

/**
 * The texts of one section in the page language, keyed "<section>.<field>". For English the
 * "_en" twin is used; while it is empty or a placeholder, the Slovak text shows instead of a gap.
 * Photo URLs from Cloudinary come back with c_limit, q_auto and f_auto.
 */
export async function getContent(section: string, lang: Locale): Promise<ContentMap> {
  const raw = await cachedSection(section);
  const result: ContentMap = {};

  for (const [key, value] of Object.entries(raw)) {
    if (isEnglishKey(key)) continue;
    if (isImageKey(key)) {
      result[key] = optimizedImageUrl(value);
    } else if (lang === "en" && isTranslatedKey(key)) {
      result[key] = filled(raw[`${key}_en`]) ? raw[`${key}_en`] : value;
    } else {
      result[key] = value;
    }
  }
  return result;
}

/** Numbered slots ("recenzia1_…", "recenzia2_…") that have their first field filled in */
export function slots(content: ContentMap, prefix: string, first: string): number[] {
  const numbers: number[] = [];
  for (const key of Object.keys(content)) {
    const match = new RegExp(`^${prefix.replace(".", "\\.")}(\\d+)_${first}$`).exec(key);
    if (match && filled(content[key])) numbers.push(Number(match[1]));
  }
  return numbers.sort((a, b) => a - b);
}

/** Paragraphs of a multi-line text, split on blank lines */
export function odseky(text: string): string[] {
  return text
    .split(/\n(?:[ \t]*\n)+/)
    .map((odsek) => odsek.trim())
    .filter(Boolean);
}

/** A price typed in the admin ("156", "7,90") as a number, or null when it is not one */
export function cislo(value: string): number | null {
  const n = Number(value.replace(/\s|€/g, "").replace(",", "."));
  return value.trim() !== "" && Number.isFinite(n) ? n : null;
}

export type Kontakt = typeof kontaktVKode;

/** "0903 394 212" → "tel:+421903394212" */
function telefonHref(telefon: string) {
  const cislice = telefon.replace(/[^\d+]/g, "");
  return `tel:${cislice.startsWith("0") ? `+421${cislice.slice(1)}` : cislice}`;
}

/** Contact details edited in /admin (section "kontakt"), in the shape of `kontakt` in content/atelier.ts */
export async function getKontakt(): Promise<Kontakt> {
  const c = await getContent("kontakt", "sk");
  return {
    nazov: kontaktVKode.nazov,
    ulica: c["kontakt.ulica"],
    mesto: c["kontakt.mesto"],
    telefon: c["kontakt.telefon"],
    telefonHref: telefonHref(c["kontakt.telefon"]),
    email: c["kontakt.email"],
    instagram: c["kontakt.instagram"],
    facebook: c["kontakt.facebook"],
    youtube: c["kontakt.youtube"],
    linkedin: c["kontakt.linkedin"],
  };
}

export type InfoListaData = {
  zobrazit: boolean;
  /** Visitors who closed the bar see it again once this changes */
  verzia: string;
  /** "" shows a visible "doplniť" gap */
  text: string;
  odkaz: { href: string; text: string } | null;
};

export async function getInfoLista(lang: Locale): Promise<InfoListaData> {
  const c = await getContent("info_lista", lang);
  const odkazText = filled(c["info_lista.odkaz_text"]);
  const odkazHref = filled(c["info_lista.odkaz_href"]);
  return {
    zobrazit: isSwitchOn(c["info_lista.zobrazit"]),
    verzia: c["info_lista.verzia"],
    text: filled(c["info_lista.text"]),
    odkaz: odkazText && odkazHref ? { href: odkazHref, text: odkazText } : null,
  };
}

export type Kurz = {
  /** Address of its subpage /kurzy/<slug>; "" for a card without one */
  slug: string;
  nazov: string;
  popis: string;
  rozsah: string;
  cena: string;
  stitok: string;
  foto: string;
  fotoAlt: string;
};

/** Course cards from /admin (section "kurzy_ponuka"); a card shows once its name is filled in */
export async function getKurzy(lang: Locale): Promise<Kurz[]> {
  const c = await getContent("kurzy_ponuka", lang);
  return slots(c, "kurzy_ponuka.kurz", "nazov").map((n) => {
    const k = (pole: string) => c[`kurzy_ponuka.kurz${n}_${pole}`] ?? "";
    return {
      slug: kurzyStranky[n - 1]?.slug ?? "",
      nazov: k("nazov"),
      popis: k("popis"),
      rozsah: k("rozsah"),
      cena: k("cena"),
      stitok: k("stitok"),
      foto: k("foto"),
      fotoAlt: k("foto_alt"),
    };
  });
}

export type Termin = { den: string; cas: string };

/** Class times from the price list (section "cennik"); a time shows once its day is filled in */
export async function getTerminy(lang: Locale): Promise<Termin[]> {
  const c = await getContent("cennik", lang);
  return slots(c, "cennik.termin", "den").map((n) => ({
    den: c[`cennik.termin${n}_den`],
    cas: c[`cennik.termin${n}_cas`] ?? "",
  }));
}
