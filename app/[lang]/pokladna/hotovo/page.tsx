import type { Localized } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { pageMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/page-hero";
import { ObjednavkaHotovo } from "@/components/obchod/objednavka-hotovo";

const texty = {
  eyebrow: { sk: "Obchod", en: "Shop" },
  nadpis: { sk: "Objednávka prijatá", en: "Order received" },
} satisfies Record<string, Localized>;

export function generateMetadata() {
  return pageMetadata({
    path: "/pokladna/hotovo",
    title: { sk: "Objednávka prijatá", en: "Order received" },
    description: {
      sk: "Potvrdenie objednávky z obchodu Keramika He-lienka.",
      en: "Order confirmation from the Keramika He-lienka shop.",
    },
  });
}

export default async function PokladnaHotovoPage() {
  const lang = await getLang();

  return (
    <>
      <PageHero eyebrow={texty.eyebrow[lang]} title={texty.nadpis[lang]} />
      <section className="bg-sand py-16 md:py-20">
        <div className="site-container max-w-[40rem]">
          <ObjednavkaHotovo />
        </div>
      </section>
    </>
  );
}
