import { Suspense } from "react";
import type { Localized } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { pageMetadata } from "@/lib/metadata";
import { polozkaObchodu, produkty } from "@/lib/produkty";
import { kategorie, type KategoriaSlug } from "@/content/produkty";
import { PageHero } from "@/components/page-hero";
import { ObchodZoznam, ObchodZoznamPredvolene, type FilterKategorie } from "@/components/obchod/obchod-zoznam";

const texty = {
  eyebrow: { sk: "Obchod", en: "Shop" },
  nadpis: { sk: "Každý kus existuje len raz", en: "Every piece exists only once" },
  // "O procese" block from the original homepage (ZAZNAMNIK.md section 5.1)
  lead: {
    sk: "Každý výrobok je robený ručne, čo mu dáva výnimočný charakter a autentickosť. Obsahuje kúsok duše jeho tvorcu, ktorý ho s láskou vytvoril.",
    en: "Every piece is made by hand, which gives it a unique character and authenticity. It holds a bit of the soul of the maker who created it with love.",
  },
} satisfies Record<string, Localized>;

export function generateMetadata() {
  return pageMetadata({
    path: "/obchod",
    title: { sk: "Obchod", en: "Shop" },
    description: {
      sk: "Ručne modelované vázy, misy, lampy, šálky a šperky z keramického ateliéru v Bratislave. Každý kus je originál.",
      en: "Hand-built vases, bowls, lamps, cups and jewellery from a ceramics studio in Bratislava. Every piece is an original.",
    },
  });
}

export default async function ObchodPage() {
  const lang = await getLang();
  const polozky = produkty.map((p) => polozkaObchodu(p, lang));
  const filtre: FilterKategorie[] = (Object.keys(kategorie) as KategoriaSlug[]).map((slug) => ({
    slug,
    nazov: kategorie[slug][lang],
    pocet: produkty.filter((p) => p.kategorie.includes(slug)).length,
  }));

  return (
    <>
      <PageHero eyebrow={texty.eyebrow[lang]} title={texty.nadpis[lang]} lead={texty.lead[lang]} />
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
