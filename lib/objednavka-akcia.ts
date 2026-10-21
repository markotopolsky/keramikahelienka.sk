"use server";

import { updateTag } from "next/cache";
import { getContent } from "@/lib/content";
import { pravnaSekciaPreSlug } from "@/lib/content-defaults";
import type { Locale } from "@/lib/i18n";
import { supabaseAdmin } from "@/lib/supabase-admin";

export type VstupObjednavky = {
  jazyk: Locale;
  meno: string;
  email: string;
  telefon: string;
  doprava: "osobny-odber";
  suhlas: boolean;
  polozky: { slug: string; variant: number | null; pocet: number }[];
  /** Hidden field; people leave it empty, form-filling bots do not */
  web: string;
};

export type PotvrdenaObjednavka = {
  cislo: string;
  spolu: number;
  rezervovaneDo: string;
  polozky: { kod: string; nazov: string; variant: string | null; cenaZaKus: number; pocet: number }[];
};

export type VysledokObjednavky =
  | { ok: true; objednavka: PotvrdenaObjednavka }
  | { ok: false; chyba: "udaje" | "nedostupne" | "limit" | "server"; nedostupne?: string[] };

/** The terms the customer agrees to with the checkbox, as shown on the site right now */
async function aktualnePodmienky(lang: Locale) {
  const casti = await Promise.all(
    ["obchodne-podmienky", "reklamacny-poriadok"].map(async (slug) => {
      const sekcia = pravnaSekciaPreSlug(slug);
      const c = await getContent(sekcia, lang);
      return [`# ${c[`${sekcia}.nazov`]}`, c[`${sekcia}.uvod`], c[`${sekcia}.text`]].join("\n\n");
    }),
  );
  return casti.join("\n\n");
}

function platnyVstup(v: VstupObjednavky) {
  return (
    (v.jazyk === "sk" || v.jazyk === "en") &&
    typeof v.meno === "string" &&
    typeof v.email === "string" &&
    typeof v.telefon === "string" &&
    v.doprava === "osobny-odber" &&
    v.suhlas === true &&
    Array.isArray(v.polozky) &&
    v.polozky.length > 0 &&
    v.polozky.length <= 30 &&
    v.polozky.every(
      (p) =>
        typeof p.slug === "string" &&
        Number.isInteger(p.pocet) &&
        p.pocet >= 1 &&
        p.pocet <= 10 &&
        (p.variant === null || (Number.isInteger(p.variant) && p.variant >= 0 && p.variant < 100)),
    )
  );
}

/**
 * Checkout (components/obchod/pokladna-form.tsx). Server Actions are reachable by a direct POST,
 * so nothing from the browser is trusted: the input is checked here and again in the database,
 * and public.vytvor_objednavku (supabase/schema.sql) takes prices and stock from the database,
 * locks the pieces and gives the order its number. Payment through Comgate comes later
 * (ZAZNAMNIK.md §13); until then the order waits for payment and its reservation runs out.
 */
export async function odoslatObjednavku(vstup: VstupObjednavky): Promise<VysledokObjednavky> {
  if (!platnyVstup(vstup)) return { ok: false, chyba: "udaje" };
  if (vstup.web) return { ok: false, chyba: "udaje" };
  if (!supabaseAdmin) {
    console.error("odoslatObjednavku: SUPABASE_SERVICE_ROLE_KEY is not set");
    return { ok: false, chyba: "server" };
  }

  const { data, error } = await supabaseAdmin.rpc("vytvor_objednavku", {
    p_jazyk: vstup.jazyk,
    p_meno: vstup.meno,
    p_email: vstup.email,
    p_telefon: vstup.telefon,
    p_doprava: vstup.doprava,
    p_polozky: vstup.polozky.map(({ slug, variant, pocet }) => ({ slug, variant, pocet })),
    p_podmienky: await aktualnePodmienky(vstup.jazyk),
  });

  if (error) {
    if (error.message === "KH_UDAJE") return { ok: false, chyba: "udaje" };
    if (error.message === "KH_LIMIT") return { ok: false, chyba: "limit" };
    if (error.message === "KH_NEDOSTUPNE") {
      return { ok: false, chyba: "nedostupne", nedostupne: (error.details ?? "").split(",").filter(Boolean) };
    }
    console.error("vytvor_objednavku failed:", error.message);
    return { ok: false, chyba: "server" };
  }

  // Pieces were reserved: the shop shows them as sold out right away
  updateTag("produkty");

  const o = data as {
    cislo: string;
    spolu: number;
    rezervovane_do: string;
    polozky: { kod: string; nazov: string; variant: string | null; cena_za_kus: number; pocet: number }[];
  };
  return {
    ok: true,
    objednavka: {
      cislo: o.cislo,
      spolu: Number(o.spolu),
      rezervovaneDo: o.rezervovane_do,
      polozky: o.polozky.map((p) => ({
        kod: p.kod,
        nazov: p.nazov,
        variant: p.variant,
        cenaZaKus: Number(p.cena_za_kus),
        pocet: p.pocet,
      })),
    },
  };
}
