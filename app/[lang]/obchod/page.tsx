import { Suspense } from "react";
import { getLang } from "@/lib/i18n-server";
import { pageMetadata } from "@/lib/metadata";
import { getContent } from "@/lib/content";
import { KATEGORIE, getNazvyKategorii, getProdukty, polozkaObchodu } from "@/lib/produkty";
import { PageHero } from "@/components/page-hero";
import { ObchodZoznam, ObchodZoznamPredvolene, type FilterKategorie } from "@/components/obchod/obchod-zoznam";

export async function generateMetadata() {
  const c = await getContent("obchod", await getLang());
  return pageMetadata({ path: "/obchod", title: c["obchod.meta_titulok"], description: c["obchod.meta_popis"] });
}

export default async function ObchodPage() {
  const lang = await getLang();
  const [c, produkty, nazvy] = await Promise.all([getContent("obchod", lang), getProdukty(), getNazvyKategorii(lang)]);
  const polozky = produkty.map((p) => polozkaObchodu(p, lang, nazvy));
  const filtre: FilterKategorie[] = KATEGORIE.map((slug) => ({
    slug,
    nazov: nazvy[slug],
    pocet: produkty.filter((p) => p.kategorie.includes(slug)).length,
  }));

  return (
    <>
      <PageHero eyebrow={c["obchod.eyebrow"]} title={c["obchod.nadpis"]} lead={c["obchod.lead"]} />
      <section className="bg-sand pb-24 pt-10 md:pb-36 md:pt-16">
        <div className="site-container">
          <Suspense fallback={<ObchodZoznamPredvolene produkty={polozky} filtre={filtre} />}>
            <ObchodZoznam produkty={polozky} filtre={filtre} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
