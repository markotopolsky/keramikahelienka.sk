import { formatPrice, type Locale } from "@/lib/i18n";
import { cislo, filled, getContent, getTerminy, slots } from "@/lib/content";
import { getLang } from "@/lib/i18n-server";
import { formular } from "@/content/atelier";
import { ButtonLink } from "@/components/ui/button-link";
import { LocaleLink } from "@/components/ui/locale-link";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

/** "156" from /admin as "156 €"; anything that is not a number is shown as typed */
function cena(value: string, lang: Locale) {
  const n = cislo(value);
  return n === null ? value : formatPrice(n, lang);
}

// The price list used to be only an image. As text it can be read aloud and found by search engines.
// Sign-up goes to the form on /kontakt (it only looks real for now); paid booking on the site is phase 5.
export async function Cennik() {
  const lang = await getLang();
  const [c, terminy] = await Promise.all([getContent("cennik", lang), getTerminy(lang)]);
  const t = (pole: string) => c[`cennik.${pole}`] ?? "";
  // A row shows once its first column is filled in
  const cennikDospeli = slots(c, "cennik.dospeli", "rozsah").map((n) => ({
    rozsah: t(`dospeli${n}_rozsah`),
    pravidelne: cena(t(`dospeli${n}_pravidelne`), lang),
    nepravidelne: cena(t(`dospeli${n}_nepravidelne`), lang),
  }));
  const cennikDeti = slots(c, "cennik.deti", "vek").map((n) => ({ vek: t(`deti${n}_vek`), cena: t(`deti${n}_cena`) }));

  return (
    <section id="cennik" className="bg-mint py-24 md:py-36">
      <div className="site-container">
        <SectionHeading eyebrow={t("eyebrow")} title={t("nadpis")} aside={t("aside")} />

        <Reveal className="rounded-card bg-deep p-5 text-sand sm:p-8 lg:p-12">
          <div className="grid gap-10 lg:grid-cols-[1fr_15rem_15rem] lg:gap-12">
            <div>
              <h3 className="text-[26px] leading-none tracking-[-0.02em] md:text-[30px]">{t("mesacny")}</h3>
              <table className="mt-6 w-full text-left">
                <thead>
                  <tr className="eyebrow text-[11px] tracking-[0.02em] text-aqua sm:tracking-[0.08em]">
                    <th scope="col" className="pb-3 pr-3 font-medium">
                      {t("rozsah")}
                    </th>
                    <th scope="col" className="pb-3 pr-3 text-right font-medium">
                      {t("pravidelny")}
                    </th>
                    <th scope="col" className="pb-3 text-right font-medium">
                      {t("nepravidelny")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cennikDospeli.map((riadok) => (
                    <tr key={riadok.rozsah} className="border-t border-sand/15">
                      <th scope="row" className="whitespace-nowrap py-3.5 pr-3 text-[15px] font-normal md:text-base">
                        {riadok.rozsah}
                      </th>
                      <td className="py-3.5 pr-3 text-right font-display text-[22px] leading-none tracking-[-0.02em] sm:text-[26px]">
                        {riadok.pravidelne}
                      </td>
                      <td className="py-3.5 text-right font-display text-[22px] leading-none tracking-[-0.02em] text-sand/75 sm:text-[26px]">
                        {riadok.nepravidelne}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <PriceList
              title={t("deti")}
              rows={cennikDeti.map((r) => [r.vek, `${cena(r.cena, lang)}${filled(r.cena) ? t("hod") : ""}`])}
              note={t("sprievod")}
            />
            <PriceList
              title={t("terminy")}
              rows={terminy.map((termin) => [termin.den, termin.cas])}
              note={t("vikend")}
            />
          </div>

          <div className="mt-10 flex flex-col items-start gap-6 border-t border-sand/15 pt-8 md:mt-12 md:flex-row md:items-center md:justify-between">
            <ButtonLink href={formular.kurzy}>{t("prihlaska")}</ButtonLink>
            <p className="max-w-[28rem] text-[15px] leading-relaxed text-sand/80 md:text-right">
              {t("zaplatit")}{" "}
              <LocaleLink href={formular.firmy} className="text-sand underline decoration-aqua underline-offset-4 hover:text-aqua">
                {t("napiste")}
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
