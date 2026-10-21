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
  doprava: "osobny-odber" | "dorucenie";
  /** Only for delivery; Slovakia only for now (ZAZNAMNIK.md, question 2) */
  adresa: { ulica: string; mesto: string; psc: string; krajina: "SK" } | null;
  suhlas: boolean;
  polozky: { slug: string; variant: number | null; pocet: number }[];
  /** Hidden field; people leave it empty, form-filling bots do not */
  web: string;
};

export type PotvrdenaObjednavka = {
  cislo: string;
  /** "caka_na_platbu" for pickup, "caka_na_cenu_dopravy" for a delivery request */
  stav: "caka_na_platbu" | "caka_na_cenu_dopravy";
  spolu: number;
  rezervovaneDo: string;
  polozky: { kod: string; nazov: string; variant: string | null; cenaZaKus: number; pocet: number }[];
};

export type VysledokObjednavky =
  | { ok: true; objednavka: PotvrdenaObjednavka }
  | { ok: false; chyba: "udaje" | "nedostupne" | "odber" | "limit" | "server"; nedostupne?: string[] };

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

function platnaAdresa(a: VstupObjednavky["adresa"]) {
  return (
    jeObjekt(a) &&
    typeof a.ulica === "string" &&
    typeof a.mesto === "string" &&
    typeof a.psc === "string" &&
    a.krajina === "SK"
  );
}

function jeObjekt(a: unknown): a is NonNullable<VstupObjednavky["adresa"]> {
  return typeof a === "object" && a !== null;
}

function platnyVstup(v: VstupObjednavky) {
  return (
    (v.jazyk === "sk" || v.jazyk === "en") &&
    typeof v.meno === "string" &&
    typeof v.email === "string" &&
    typeof v.telefon === "string" &&
    (v.doprava === "osobny-odber" ? v.adresa === null : platnaAdresa(v.adresa)) &&
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
 * locks the pieces and gives the order its number. Pickup orders wait 30 minutes for payment;
 * delivery is a non-binding request that Helena answers with a price offer (potvrditPonuku).
 * Payment through Comgate comes later (ZAZNAMNIK.md §13).
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
    p_adresa: vstup.adresa,
    p_polozky: vstup.polozky.map(({ slug, variant, pocet }) => ({ slug, variant, pocet })),
    p_podmienky: await aktualnePodmienky(vstup.jazyk),
  });

  if (error) {
    if (error.message === "KH_UDAJE") return { ok: false, chyba: "udaje" };
    if (error.message === "KH_LIMIT") return { ok: false, chyba: "limit" };
    if (error.message === "KH_NEDOSTUPNE" || error.message === "KH_ODBER") {
      return {
        ok: false,
        chyba: error.message === "KH_ODBER" ? "odber" : "nedostupne",
        nedostupne: (error.details ?? "").split(",").filter(Boolean),
      };
    }
    console.error("vytvor_objednavku failed:", error.message);
    return { ok: false, chyba: "server" };
  }

  // Pieces were reserved: the shop shows them as sold out right away
  updateTag("produkty");

  const o = data as {
    cislo: string;
    stav: PotvrdenaObjednavka["stav"];
    spolu: number;
    rezervovane_do: string;
    polozky: { kod: string; nazov: string; variant: string | null; cena_za_kus: number; pocet: number }[];
  };
  return {
    ok: true,
    objednavka: {
      cislo: o.cislo,
      stav: o.stav,
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

export type VysledokPotvrdenia =
  | { ok: true; cislo: string; spolu: number; rezervovaneDo: string }
  | { ok: false; chyba: "ponuka" | "server" };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * The customer confirms Helena's delivery offer on /objednavka/<token> (app/[lang]/objednavka).
 * Only now does the order become binding, with the full price including delivery known, so the
 * terms are agreed to again here. "ponuka" = the offer expired, was cancelled or is confirmed already.
 */
export async function potvrditPonuku(token: string, jazyk: Locale, suhlas: boolean): Promise<VysledokPotvrdenia> {
  if (typeof token !== "string" || !UUID.test(token) || (jazyk !== "sk" && jazyk !== "en") || suhlas !== true) {
    return { ok: false, chyba: "ponuka" };
  }
  if (!supabaseAdmin) return { ok: false, chyba: "server" };

  const { data, error } = await supabaseAdmin.rpc("potvrd_ponuku", {
    p_token: token,
    p_podmienky: await aktualnePodmienky(jazyk),
  });
  if (error) {
    console.error("potvrd_ponuku failed:", error.message);
    return { ok: false, chyba: "server" };
  }
  if (!data) return { ok: false, chyba: "ponuka" };

  const o = data as { cislo: string; spolu: number; rezervovane_do: string };
  return { ok: true, cislo: o.cislo, spolu: Number(o.spolu), rezervovaneDo: o.rezervovane_do };
}
