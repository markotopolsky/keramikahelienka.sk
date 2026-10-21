import { bindShortWords } from "@/lib/i18n";
import { getContent } from "@/lib/content";
import { getLang } from "@/lib/i18n-server";
import { getNazvyKategorii, getProdukty, polozkaObchodu } from "@/lib/produkty";
import { ProduktKarta } from "@/components/obchod/produkt-karta";
import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";

/** A selection from the shop, in the same cards as /obchod but at most three columns */
export async function DielaGrid() {
  const lang = await getLang();
  const [c, produkty, nazvy] = await Promise.all([getContent("diela_domov", lang), getProdukty(), getNazvyKategorii(lang)]);
  // Pieces ticked "na domovskej" in /admin; sold-out ones are skipped, so the grid only offers what can be bought
  const polozky = produkty.filter((p) => p.naDomovskej && !p.vypredane).map((p) => polozkaObchodu(p, lang, nazvy));

  return (
    <section className="bg-mint pb-28 pt-20 md:pb-40 md:pt-32">
      <div className="site-container">
        <div className="mb-12 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between md:gap-10">
          <Reveal>
            <p className="eyebrow mb-5 text-drift">{c["diela_domov.eyebrow"]}</p>
            <h2 className="text-h2 text-deep">{bindShortWords(c["diela_domov.nadpis"])}</h2>
          </Reveal>
          <Reveal delay={0.1} className="flex max-w-[24rem] flex-col items-start gap-6 md:items-end md:text-right">
            <p className="text-[15px] leading-relaxed text-drift">{c["diela_domov.text"]}</p>
            <ButtonLink href="/obchod" variant="deep">
              {c["diela_domov.tlacidlo_obchod"]}
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
            {c["diela_domov.tlacidlo_vsetky"]}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
