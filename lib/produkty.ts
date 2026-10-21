// The shop reads its products from the Supabase `produkty` table, edited in /admin.
// While the database is not set up, fails or is still empty, it shows the products from the
// original site (predvoleneProdukty in lib/produkty-zaklad.ts), so the shop never goes blank.
import { unstable_cache } from "next/cache";
import type { Locale } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import { getContent } from "@/lib/content";
import { KATEGORIE, predvoleneProdukty, zRiadku, type NazvyKategorii, type Produkt } from "@/lib/produkty-zaklad";

export * from "@/lib/produkty-zaklad";

async function nacitajProdukty(): Promise<Produkt[]> {
  if (!supabase) return predvoleneProdukty;

  const { data, error } = await supabase.from("produkty").select("*").order("poradie");

  if (error) {
    console.error("getProdukty() failed:", error.message);
    return predvoleneProdukty;
  }
  if (!data || data.length === 0) return predvoleneProdukty;
  return data.map(zRiadku);
}

const cachedProdukty = unstable_cache(nacitajProdukty, ["produkty"], {
  // Fallback only: /api/revalidate busts the "produkty" tag on every admin save
  revalidate: 3600,
  tags: ["produkty"],
});

/** Published products in shop order */
export async function getProdukty(): Promise<Produkt[]> {
  const produkty = await cachedProdukty();
  return produkty.filter((p) => p.zverejneny);
}

export async function najdiProdukt(slug: string) {
  return (await getProdukty()).find((p) => p.slug === slug);
}

export async function getNazvyKategorii(lang: Locale): Promise<NazvyKategorii> {
  const content = await getContent("kategorie", lang);
  return Object.fromEntries(KATEGORIE.map((k) => [k, content[`kategorie.${k}`]])) as NazvyKategorii;
}
