import type { Localized } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { najdiProdukt, polozkaObchodu, type Produkt } from "@/lib/produkty";
import { dielaNaDomov } from "@/content/diela";
import { ProduktKarta } from "@/components/obchod/produkt-karta";
import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";

const texty = {
  eyebrow: { sk: "Z ateliéru", en: "From the studio" },
  nadpis: { sk: "Každý kus existuje len raz", en: "Every piece exists only once" },
  text: {
    sk: "Misy, vázy, lampy a art objekty. Každý výrobok je robený ručne, čo mu dáva výnimočný charakter.",
    en: "Bowls, vases, lamps and art objects. Every piece is made by hand, which gives it a unique character.",
  },
  obchod: { sk: "Celý obchod", en: "Whole shop" },
  vsetky: { sk: "Pozrieť všetky kúsky", en: "See all pieces" },
} satisfies Record<string, Localized>;

/** A selection from the shop, in the same cards as /obchod but at most three columns */
export async function DielaGrid() {
  const lang = await getLang();
  const polozky = dielaNaDomov
    .map(najdiProdukt)
    .filter((p): p is Produkt => p !== undefined && !p.vypredane)
    .map((p) => polozkaObchodu(p, lang));

  return (
    <section className="bg-mint pb-28 pt-20 md:pb-40 md:pt-32">
      <div className="site-container">
        <div className="mb-12 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between md:gap-10">
          <Reveal>
            <p className="eyebrow mb-5 text-drift">{texty.eyebrow[lang]}</p>
            <h2 className="text-h2 text-deep">{texty.nadpis[lang]}</h2>
          </Reveal>
          <Reveal delay={0.1} className="flex max-w-[24rem] flex-col items-start gap-6 md:items-end md:text-right">
            <p className="text-[15px] leading-relaxed text-drift">{texty.text[lang]}</p>
            <ButtonLink href="/obchod" variant="deep">
              {texty.obchod[lang]}
            </ButtonLink>
          </Reveal>
        </div>

        <ul className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:grid-cols-3 md:gap-x-6 md:gap-y-14">
          {polozky.map((p, i) => (
            <Reveal as="li" key={p.slug} delay={(i % 3) * 0.06}>
              <ProduktKarta produkt={p} sizes="(min-width: 90rem) 440px, (min-width: 48rem) 31vw, 47vw" />
            </Reveal>
          ))}
        </ul>

        <div className="mt-14 flex justify-center md:mt-20">
          <ButtonLink href="/obchod" variant="deep">
            {texty.vsetky[lang]}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
