import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { plural, type Localized } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { pageMetadata } from "@/lib/metadata";
import { cenaProduktu, najdiProdukt, podobneProdukty, polozkaObchodu, produkty } from "@/lib/produkty";
import { formular, kontakt } from "@/content/atelier";
import { kategorie } from "@/content/produkty";
import { Galeria } from "@/components/obchod/galeria";
import { DoKosika } from "@/components/obchod/do-kosika";
import { ProduktKarta } from "@/components/obchod/produkt-karta";
import { ButtonLink } from "@/components/ui/button-link";
import { Doplnit } from "@/components/ui/doplnit";
import { LocaleLink } from "@/components/ui/locale-link";

const texty = {
  obchod: { sk: "Obchod", en: "Shop" },
  navigacia: { sk: "Omrvinková navigácia", en: "Breadcrumb" },
  skladom: { sk: "Skladom", en: "In stock" },
  vypredane: { sk: "Vypredané", en: "Sold out" },
  vypredaneText: {
    sk: "Tento kúsok už má nový domov. Ostáva tu ako galéria. Ak sa vám páči, opýtajte sa na podobný.",
    en: "This piece has found a new home and stays here as a gallery. If you like it, ask about a similar one.",
  },
  opytat: { sk: "Opýtať sa na kúsok", en: "Ask about this piece" },
  opytatPodobny: { sk: "Opýtať sa na podobný", en: "Ask about a similar piece" },
  doprava: { sk: "Doprava", en: "Delivery" },
  odber: { sk: "Osobný odber", en: "Pickup" },
  odberText: {
    sk: `V ateliéri, ${kontakt.ulica}, Bratislava. Zadarmo.`,
    en: `At the studio, ${kontakt.ulica}, Bratislava. Free.`,
  },
  dalsie: { sk: "Ďalšie kúsky", en: "More pieces" },
  celyObchod: { sk: "Celý obchod", en: "Whole shop" },
} satisfies Record<string, Localized>;

export function generateStaticParams() {
  return produkty.map((p) => ({ slug: p.slug }));
}

// Any other value is a 404 (app/global-not-found.tsx)
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/[lang]/obchod/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const produkt = najdiProdukt(slug);
  if (!produkt) return {};
  const nazov = produkt.nazov;
  return pageMetadata({
    path: `/obchod/${slug}`,
    title: nazov,
    description: {
      sk: produkt.popis.sk[0] ?? `${nazov.sk} – ručne robená keramika z ateliéru Keramika He-lienka v Bratislave.`,
      en: produkt.popis.en[0] ?? `${nazov.en} – handmade ceramics from the Keramika He-lienka studio in Bratislava.`,
    },
  });
}

export default async function ProduktPage({ params }: PageProps<"/[lang]/obchod/[slug]">) {
  const { slug } = await params;
  const produkt = najdiProdukt(slug);
  if (!produkt) notFound();
  const lang = await getLang();

  const nazov = produkt.nazov[lang];
  const sklad = produkt.vypredane
    ? texty.vypredane[lang]
    : produkt.pocetKusov
      ? `${texty.skladom[lang]}, ${plural(produkt.pocetKusov, lang, { sk: ["kus", "kusy", "kusov"], en: ["piece", "pieces"] })}`
      : texty.skladom[lang];
  const podobne = podobneProdukty(produkt).map((p) => polozkaObchodu(p, lang));
  const hlavnaKategoria = produkt.kategorie[0];

  return (
    <>
      <section className="bg-sand pb-20 pt-24 md:pb-28 md:pt-32">
        <div className="site-container">
          <nav aria-label={texty.navigacia[lang]} className="mb-8 text-[14px] text-drift md:mb-10">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <LocaleLink href="/obchod" className="hover:text-deep">
                  {texty.obchod[lang]}
                </LocaleLink>
              </li>
              {hlavnaKategoria && (
                <li className="flex items-center gap-2">
                  <span aria-hidden>/</span>
                  <LocaleLink href={`/obchod?kategoria=${hlavnaKategoria}`} className="hover:text-deep">
                    {kategorie[hlavnaKategoria][lang]}
                  </LocaleLink>
                </li>
              )}
            </ol>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16 xl:gap-24">
            <Galeria fotky={produkt.fotky} nazov={nazov} vypredane={produkt.vypredane} />

            <div className="lg:pt-4">
              <p className="eyebrow text-drift">{produkt.kategorie.map((k) => kategorie[k][lang]).join(" · ")}</p>
              <h1 className="mt-4 text-h2 text-deep">{nazov}</h1>

              <div className="mt-6 flex flex-wrap items-baseline gap-x-5 gap-y-2">
                <p className={`font-display text-[32px] leading-none tracking-[-0.02em] ${produkt.vypredane ? "text-drift" : "text-ink"}`}>
                  {cenaProduktu(produkt, lang)}
                </p>
                <p className={`flex items-center gap-2 text-[14px] ${produkt.vypredane ? "text-drift" : "text-deep"}`}>
                  <span aria-hidden className={`size-2 rounded-full ${produkt.vypredane ? "bg-drift/50" : "bg-sea"}`} />
                  {sklad}
                </p>
              </div>
              {/* The old shop said "vrát. DPH" but charged no VAT in the cart (question 1) */}
              <p className="mt-3 text-[13px] text-drift">
                <Doplnit>cena s DPH alebo bez DPH – otázka 1</Doplnit>
              </p>

              <div className="mt-8 border-t border-sage pt-8">
                {produkt.vypredane ? (
                  <div className="flex flex-col items-start gap-5">
                    <p className="max-w-[30rem] text-[15px] leading-relaxed text-ink/80">{texty.vypredaneText[lang]}</p>
                    <ButtonLink href={formular.otazka} variant="deep">
                      {texty.opytatPodobny[lang]}
                    </ButtonLink>
                  </div>
                ) : (
                  <>
                    <DoKosika varianty={produkt.varianty} />
                    <LocaleLink
                      href={formular.otazka}
                      className="mt-2 inline-block text-[15px] text-deep underline decoration-sage underline-offset-4 hover:decoration-deep"
                    >
                      {texty.opytat[lang]}
                    </LocaleLink>
                  </>
                )}
              </div>

              {produkt.popis[lang].length > 0 && (
                <div className="mt-10 max-w-[36rem] space-y-4 text-base leading-relaxed text-ink/85 md:text-[17px]">
                  {produkt.popis[lang].map((odsek, i) => (
                    <p key={i}>{odsek}</p>
                  ))}
                </div>
              )}

              <dl className="mt-10 divide-y divide-sage border-y border-sage text-[15px]">
                <div className="flex flex-col gap-1 py-4 sm:flex-row sm:gap-6">
                  <dt className="eyebrow shrink-0 pt-1 text-[11px] text-drift sm:w-28">{texty.odber[lang]}</dt>
                  <dd className="text-ink">{texty.odberText[lang]}</dd>
                </div>
                <div className="flex flex-col gap-1 py-4 sm:flex-row sm:gap-6">
                  <dt className="eyebrow shrink-0 pt-1 text-[11px] text-drift sm:w-28">{texty.doprava[lang]}</dt>
                  <dd className="text-ink">
                    <Doplnit>spôsoby a ceny dopravy – otázka 2</Doplnit>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {podobne.length > 0 && (
        <section className="bg-mint py-20 md:py-28">
          <div className="site-container">
            <div className="mb-10 flex flex-col gap-5 md:mb-14 md:flex-row md:items-end md:justify-between">
              <h2 className="text-h3 text-deep">{texty.dalsie[lang]}</h2>
              <ButtonLink href="/obchod" variant="deep">
                {texty.celyObchod[lang]}
              </ButtonLink>
            </div>
            <ul className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 lg:grid-cols-4">
              {podobne.map((p) => (
                <li key={p.slug}>
                  <ProduktKarta produkt={p} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
