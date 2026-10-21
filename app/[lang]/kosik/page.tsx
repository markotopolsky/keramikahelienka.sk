import type { Localized } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { pageMetadata } from "@/lib/metadata";
import { getProdukty } from "@/lib/produkty";
import { PageHero } from "@/components/page-hero";
import { KosikZoznam } from "@/components/obchod/kosik-zoznam";

const texty = {
  eyebrow: { sk: "Obchod", en: "Shop" },
  nadpis: { sk: "Košík", en: "Cart" },
} satisfies Record<string, Localized>;

export function generateMetadata() {
  return pageMetadata({
    path: "/kosik",
    title: { sk: "Košík", en: "Cart" },
    description: {
      sk: "Vaše vybrané kúsky z obchodu Keramika He-lienka.",
      en: "Your selected pieces from the Keramika He-lienka shop.",
    },
  });
}

export default async function KosikPage() {
  const lang = await getLang();

  return (
    <>
      <PageHero eyebrow={texty.eyebrow[lang]} title={texty.nadpis[lang]} />
      <section className="bg-sand py-16 md:py-20">
        <div className="site-container max-w-[48rem]">
          <KosikZoznam produkty={await getProdukty()} />
        </div>
      </section>
    </>
  );
}
