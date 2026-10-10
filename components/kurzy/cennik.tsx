import { formatPrice, type Localized } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { cennikDeti, cennikDospeli, cennikOstatne, terminy, vCene } from "@/content/kurzy";
import { CheckIcon } from "@/components/ui/check-icon";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

const texty = {
  eyebrow: { sk: "Cenník 2026", en: "Prices 2026" },
  nadpis: { sk: "Koľko kurz stojí", en: "What a class costs" },
  aside: {
    sk: "V cene je všetok materiál, pomôcky, dva výpaly v peci aj malé občerstvenie.",
    en: "The price includes all materials, tools, two kiln firings and light refreshments.",
  },
  mesacny: { sk: "Mesačný kurz pre dospelých", en: "Monthly course for adults" },
  lekcie: { sk: "4 lekcie za mesiac", en: "4 lessons a month" },
  rozsah: { sk: "Rozsah", en: "Length" },
  pravidelny: { sk: "Pravidelný čas", en: "Regular time" },
  nepravidelny: { sk: "Nepravidelný čas", en: "Irregular time" },
  terminy: { sk: "Termíny v ateliéri", en: "Studio times" },
  vikend: {
    sk: "Skupinové workshopy robíme v termíne podľa dohody, aj cez víkend.",
    en: "Group workshops take place on a date we agree on, weekends included.",
  },
  vCene: { sk: "V cene kurzu", en: "Included in the price" },
  deti: { sk: "Deti", en: "Children" },
  detiPodtitul: { sk: "Cena za hodinu podľa veku", en: "Price per hour by age" },
  hod: { sk: " / hod.", en: " / hour" },
  sprievod: { sk: "Deti do 10 rokov len v sprievode platiaceho rodiča.", en: "Children under 10 only with a paying parent." },
  workshopy: { sk: "Workshopy a jednorazovo", en: "Workshops and one-off visits" },
} satisfies Record<string, Localized>;

// The price list used to be only an image. As text it can be read aloud and found by search engines.
export async function Cennik() {
  const lang = await getLang();

  return (
    <section id="cennik" className="bg-sand py-24 md:py-36">
      <div className="site-container">
        <SectionHeading eyebrow={texty.eyebrow[lang]} title={texty.nadpis[lang]} aside={texty.aside[lang]} />

        <Reveal className="rounded-card bg-deep p-5 text-sand sm:p-8 lg:grid lg:grid-cols-[1fr_20rem] lg:gap-16 lg:p-12 xl:grid-cols-[1fr_24rem]">
          <div>
            <h3 className="text-h3">{texty.mesacny[lang]}</h3>
            <p className="mt-3 text-[15px] text-sand/75 md:text-base">{texty.lekcie[lang]}</p>

            <table className="mt-8 w-full text-left md:mt-10">
              <thead>
                <tr className="eyebrow text-[10px] tracking-[0.04em] text-aqua sm:text-[11px] sm:tracking-[0.08em]">
                  <th scope="col" className="pb-3 pr-3 font-medium">
                    {texty.rozsah[lang]}
                  </th>
                  <th scope="col" className="pb-3 pr-3 text-right font-medium">
                    {texty.pravidelny[lang]}
                  </th>
                  <th scope="col" className="pb-3 text-right font-medium">
                    {texty.nepravidelny[lang]}
                  </th>
                </tr>
              </thead>
              <tbody>
                {cennikDospeli.map((riadok) => (
                  <tr key={riadok.rozsah.sk} className="border-t border-sand/15">
                    <th scope="row" className="whitespace-nowrap py-4 pr-3 text-[15px] font-normal md:py-5 md:text-[17px]">
                      {riadok.rozsah[lang]}
                    </th>
                    <td className="py-4 pr-3 text-right font-display text-[22px] leading-none tracking-[-0.02em] sm:text-[24px] md:py-5 md:text-[32px]">
                      {formatPrice(riadok.pravidelne, lang)}
                    </td>
                    <td className="py-4 text-right font-display text-[22px] leading-none tracking-[-0.02em] sm:text-[24px] text-sand/80 md:py-5 md:text-[32px]">
                      {formatPrice(riadok.nepravidelne, lang)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-10 border-t border-sand/15 pt-8 lg:mt-0 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-1">
            <h4 className="eyebrow text-[11px] text-aqua">{texty.terminy[lang]}</h4>
            <ul className="mt-5 space-y-3">
              {terminy.map((termin) => (
                <li key={termin.cas} className="flex items-baseline justify-between gap-4 text-[15px] md:text-base">
                  <span>{termin.den[lang]}</span>
                  <span className="text-sand/80 tabular-nums">{termin.cas}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[14px] leading-relaxed text-sand/70">{texty.vikend[lang]}</p>

            <h4 className="eyebrow mt-10 text-[11px] text-aqua">{texty.vCene[lang]}</h4>
            <ul className="mt-5 space-y-2.5 text-[15px]">
              {vCene[lang].map((polozka) => (
                <li key={polozka} className="flex items-center gap-2.5">
                  <CheckIcon className="size-4" />
                  {polozka}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <div className="mt-5 grid gap-5 lg:grid-cols-[22rem_1fr] xl:grid-cols-[26rem_1fr]">
          <Reveal className="rounded-card border border-sage p-5 sm:p-8">
            <h3 className="text-[28px] leading-none tracking-[-0.02em] text-deep md:text-[32px]">{texty.deti[lang]}</h3>
            <p className="mt-3 text-[15px] text-drift">{texty.detiPodtitul[lang]}</p>
            <ul className="mt-6">
              {cennikDeti.map((riadok) => (
                <li key={riadok.vek.sk} className="flex items-baseline justify-between gap-4 border-t border-sage py-3.5">
                  <span className="text-[15px] md:text-base">{riadok.vek[lang]}</span>
                  <span className="font-display text-[22px] leading-none tracking-[-0.02em] text-deep">
                    {formatPrice(riadok.cena, lang)}
                    <span className="text-[14px] tracking-normal text-drift">{texty.hod[lang]}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[14px] leading-relaxed text-drift">{texty.sprievod[lang]}</p>
          </Reveal>

          <Reveal delay={0.1} className="rounded-card border border-sage p-5 sm:p-8">
            <h3 className="text-[28px] leading-none tracking-[-0.02em] text-deep md:text-[32px]">{texty.workshopy[lang]}</h3>
            <ul className="mt-6">
              {cennikOstatne.map((polozka) => (
                <li
                  key={polozka.nazov.sk}
                  className="flex items-start justify-between gap-6 border-t border-sage py-4 first:border-t-0 first:pt-0 md:py-5"
                >
                  <div>
                    <p className="text-base font-medium text-ink md:text-[17px]">{polozka.nazov[lang]}</p>
                    <p className="mt-1 max-w-[30rem] text-[14px] leading-relaxed text-drift md:text-[15px]">{polozka.rozsah[lang]}</p>
                  </div>
                  <p className="shrink-0 font-display text-[22px] leading-none tracking-[-0.02em] text-deep md:text-[26px]">
                    {polozka.cena[lang]}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
