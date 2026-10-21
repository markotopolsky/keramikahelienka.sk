import type { Localized } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { pageMetadata } from "@/lib/metadata";
import { getKontakt } from "@/lib/content";
import { getProdukty } from "@/lib/produkty";
import { PageHero } from "@/components/page-hero";
import { PokladnaForm } from "@/components/obchod/pokladna-form";

const texty = {
  eyebrow: { sk: "Obchod", en: "Shop" },
  nadpis: { sk: "Pokladňa", en: "Checkout" },
} satisfies Record<string, Localized>;

export function generateMetadata() {
  return pageMetadata({
    path: "/pokladna",
    title: { sk: "Pokladňa", en: "Checkout" },
    description: {
      sk: "Dokončite objednávku z obchodu Keramika He-lienka.",
      en: "Complete your order from the Keramika He-lienka shop.",
    },
  });
}

export default async function PokladnaPage() {
  const lang = await getLang();

  return (
    <>
      <PageHero eyebrow={texty.eyebrow[lang]} title={texty.nadpis[lang]} />
      <section className="bg-sand py-16 md:py-20">
        <div className="site-container max-w-[40rem]">
          <PokladnaForm produkty={await getProdukty()} ulica={(await getKontakt()).ulica} />
        </div>
      </section>
    </>
  );
}
