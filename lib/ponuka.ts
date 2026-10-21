import "server-only";
import { supabaseAdmin } from "@/lib/supabase-admin";

/** A delivery offer as the customer sees it on /objednavka/<token> (public.nacitaj_ponuku) */
export type Ponuka = {
  cislo: string;
  stav: "caka_na_cenu_dopravy" | "ponuka_odoslana" | "caka_na_platbu" | "zaplatena" | "vybavena" | "zrusena" | "odstupena";
  meno: string;
  ulica: string;
  mesto: string;
  psc: string;
  dopravaSposob: string;
  dopravaCena: number;
  medzisucet: number;
  spolu: number;
  rezervovaneDo: string | null;
  polozky: { kod: string; nazov: string; variant: string | null; cenaZaKus: number; pocet: number }[];
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** null for an unknown or malformed token */
export async function nacitajPonuku(token: string): Promise<Ponuka | null> {
  if (!UUID.test(token) || !supabaseAdmin) return null;

  const { data, error } = await supabaseAdmin.rpc("nacitaj_ponuku", { p_token: token });
  if (error) {
    console.error("nacitaj_ponuku failed:", error.message);
    return null;
  }
  if (!data) return null;

  const o = data as {
    cislo: string;
    stav: Ponuka["stav"];
    meno: string;
    ulica: string;
    mesto: string;
    psc: string;
    doprava_sposob: string;
    doprava_cena: number;
    medzisucet: number;
    spolu: number;
    rezervovane_do: string | null;
    polozky: { kod: string; nazov: string; variant: string | null; cena_za_kus: number; pocet: number }[];
  };
  return {
    cislo: o.cislo,
    stav: o.stav,
    meno: o.meno,
    ulica: o.ulica,
    mesto: o.mesto,
    psc: o.psc,
    dopravaSposob: o.doprava_sposob,
    dopravaCena: Number(o.doprava_cena),
    medzisucet: Number(o.medzisucet),
    spolu: Number(o.spolu),
    rezervovaneDo: o.rezervovane_do,
    polozky: o.polozky.map((p) => ({
      kod: p.kod,
      nazov: p.nazov,
      variant: p.variant,
      cenaZaKus: Number(p.cena_za_kus),
      pocet: p.pocet,
    })),
  };
}
