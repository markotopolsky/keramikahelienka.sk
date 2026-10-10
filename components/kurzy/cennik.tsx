import { formatPrice, type Localized } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { formular } from "@/content/atelier";
import { cennikDeti, cennikDospeli, terminy } from "@/content/kurzy";
import { ButtonLink } from "@/components/ui/button-link";
import { LocaleLink } from "@/components/ui/locale-link";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

const texty = {
  eyebrow: { sk: "Cenník 2026", en: "Prices 2026" },
  nadpis: { sk: "Cenník a prihláška", en: "Prices and sign-up" },
  aside: {
    sk: "V cene je materiál, pomôcky, dva výpaly v peci aj malé občerstvenie.",
    en: "The price includes materials, tools, two kiln firings and light refreshments.",
  },
  mesacny: { sk: "Mesačný kurz, 4 lekcie", en: "Monthly course, 4 lessons" },
  rozsah: { sk: "Rozsah", en: "Length" },
  pravidelny: { sk: "Pravidelný čas", en: "Regular time" },
  nepravidelny: { sk: "Nepravidelný čas", en: "Irregular time" },
  deti: { sk: "Deti", en: "Children" },
  hod: { sk: " / hod.", en: " / hour" },
  sprievod: { sk: "Do 10 rokov v sprievode platiaceho rodiča.", en: "Under 10 with a paying parent." },
  terminy: { sk: "Termíny", en: "Times" },
  vikend: {
    sk: "Skupinové workshopy podľa dohody, aj cez víkend.",
    en: "Group workshops by arrangement, weekends included.",
  },
  prihlaska: { sk: "Vyplniť prihlášku", en: "Fill in the sign-up form" },
  zaplatit: {
    sk: "Kurz zaplaťte najneskôr 7 dní vopred. Teambuilding pre firmy pripravíme na mieru,",
    en: "Please pay for the course at least 7 days in advance. We tailor team building for companies,",
  },
  napiste: { sk: "napíšte nám", en: "write to us" },
} satisfies Record<string, Localized>;

// The price list used to be only an image. As text it can be read aloud and found by search engines.
// Sign-up goes to the form on /kontakt (it only looks real for now); paid booking on the site is phase 5.
export async function Cennik() {
  const lang = await getLang();

  return (
    <section id="cennik" className="bg-mint py-24 md:py-36">
      <div className="site-container">
        <SectionHeading eyebrow={texty.eyebrow[lang]} title={texty.nadpis[lang]} aside={texty.aside[lang]} />

        <Reveal className="rounded-card bg-deep p-5 text-sand sm:p-8 lg:p-12">
          <div className="grid gap-10 lg:grid-cols-[1fr_15rem_15rem] lg:gap-12">
            <div>
              <h3 className="text-[26px] leading-none tracking-[-0.02em] md:text-[30px]">{texty.mesacny[lang]}</h3>
              <table className="mt-6 w-full text-left">
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
                      <th scope="row" className="whitespace-nowrap py-3.5 pr-3 text-[15px] font-normal md:text-base">
                        {riadok.rozsah[lang]}
                      </th>
                      <td className="py-3.5 pr-3 text-right font-display text-[22px] leading-none tracking-[-0.02em] sm:text-[26px]">
                        {formatPrice(riadok.pravidelne, lang)}
                      </td>
                      <td className="py-3.5 text-right font-display text-[22px] leading-none tracking-[-0.02em] text-sand/75 sm:text-[26px]">
                        {formatPrice(riadok.nepravidelne, lang)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <PriceList
              title={texty.deti[lang]}
              rows={cennikDeti.map((r) => [r.vek[lang], `${formatPrice(r.cena, lang)}${texty.hod[lang]}`])}
              note={texty.sprievod[lang]}
            />
            <PriceList
              title={texty.terminy[lang]}
              rows={terminy.map((t) => [t.den[lang], t.cas])}
              note={texty.vikend[lang]}
            />
          </div>

          <div className="mt-10 flex flex-col items-start gap-6 border-t border-sand/15 pt-8 md:mt-12 md:flex-row md:items-center md:justify-between">
            <ButtonLink href={formular.kurzy}>{texty.prihlaska[lang]}</ButtonLink>
            <p className="max-w-[28rem] text-[15px] leading-relaxed text-sand/80 md:text-right">
              {texty.zaplatit[lang]}{" "}
              <LocaleLink href={formular.firmy} className="text-sand underline decoration-aqua underline-offset-4 hover:text-aqua">
                {texty.napiste[lang]}
              </LocaleLink>
              .
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function PriceList({ title, rows, note }: { title: string; rows: [string, string][]; note: string }) {
  return (
    <div>
      <h3 className="text-[26px] leading-none tracking-[-0.02em] md:text-[30px]">{title}</h3>
      {/* From 1024px the first row lines up with the first row of the table beside it */}
      <ul className="mt-6 border-b border-sand/15 lg:mt-[2.375rem]">
        {rows.map(([label, value]) => (
          <li key={label} className="flex items-baseline justify-between gap-4 border-t border-sand/15 py-3.5 text-[15px]">
            <span>{label}</span>
            <span className="tabular-nums text-sand/80">{value}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[13px] leading-relaxed text-sand/70">{note}</p>
    </div>
  );
}
