import { cennikDeti, cennikDospeli, cennikOstatne, terminy, vCene } from "@/content/kurzy";
import { CheckIcon } from "@/components/ui/check-icon";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

// The price list used to be only an image. As text it can be read aloud and found by search engines.
export function Cennik() {
  return (
    <section id="cennik" className="bg-sand py-24 md:py-36">
      <div className="site-container">
        <SectionHeading
          eyebrow="Cenník 2026"
          title="Koľko kurz stojí"
          aside="V cene je všetok materiál, pomôcky, dva výpaly v peci aj malé občerstvenie."
        />

        <Reveal className="rounded-card bg-deep p-5 text-sand sm:p-8 lg:grid lg:grid-cols-[1fr_20rem] lg:gap-16 lg:p-12 xl:grid-cols-[1fr_24rem]">
          <div>
            <h3 className="text-h3">Mesačný kurz pre dospelých</h3>
            <p className="mt-3 text-[15px] text-sand/75 md:text-base">4 lekcie za mesiac</p>

            <table className="mt-8 w-full text-left md:mt-10">
              <thead>
                <tr className="eyebrow text-[10px] tracking-[0.04em] text-aqua sm:text-[11px] sm:tracking-[0.08em]">
                  <th scope="col" className="pb-3 pr-3 font-medium">
                    Rozsah
                  </th>
                  <th scope="col" className="pb-3 pr-3 text-right font-medium">
                    Pravidelný čas
                  </th>
                  <th scope="col" className="pb-3 text-right font-medium">
                    Nepravidelný čas
                  </th>
                </tr>
              </thead>
              <tbody>
                {cennikDospeli.map((riadok) => (
                  <tr key={riadok.rozsah} className="border-t border-sand/15">
                    <th scope="row" className="whitespace-nowrap py-4 pr-3 text-[15px] font-normal md:py-5 md:text-[17px]">
                      {riadok.rozsah}
                    </th>
                    <td className="py-4 pr-3 text-right font-display text-[22px] leading-none tracking-[-0.02em] sm:text-[24px] md:py-5 md:text-[32px]">
                      {riadok.pravidelne}
                    </td>
                    <td className="py-4 text-right font-display text-[22px] leading-none tracking-[-0.02em] sm:text-[24px] text-sand/80 md:py-5 md:text-[32px]">
                      {riadok.nepravidelne}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-10 border-t border-sand/15 pt-8 lg:mt-0 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-1">
            <h4 className="eyebrow text-[11px] text-aqua">Termíny v ateliéri</h4>
            <ul className="mt-5 space-y-3">
              {terminy.map((termin) => (
                <li key={termin.den} className="flex items-baseline justify-between gap-4 text-[15px] md:text-base">
                  <span>{termin.den}</span>
                  <span className="text-sand/80 tabular-nums">{termin.cas}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[14px] leading-relaxed text-sand/70">
              Skupinové workshopy robíme v termíne podľa dohody, aj cez víkend.
            </p>

            <h4 className="eyebrow mt-10 text-[11px] text-aqua">V cene kurzu</h4>
            <ul className="mt-5 space-y-2.5 text-[15px]">
              {vCene.map((polozka) => (
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
            <h3 className="text-[28px] leading-none tracking-[-0.02em] text-deep md:text-[32px]">Deti</h3>
            <p className="mt-3 text-[15px] text-drift">Cena za hodinu podľa veku</p>
            <ul className="mt-6">
              {cennikDeti.map((riadok) => (
                <li key={riadok.vek} className="flex items-baseline justify-between gap-4 border-t border-sage py-3.5">
                  <span className="text-[15px] md:text-base">{riadok.vek}</span>
                  <span className="font-display text-[22px] leading-none tracking-[-0.02em] text-deep">
                    {riadok.cena}
                    <span className="text-[14px] tracking-normal text-drift"> / hod.</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[14px] leading-relaxed text-drift">Deti do 10 rokov len v sprievode platiaceho rodiča.</p>
          </Reveal>

          <Reveal delay={0.1} className="rounded-card border border-sage p-5 sm:p-8">
            <h3 className="text-[28px] leading-none tracking-[-0.02em] text-deep md:text-[32px]">Workshopy a jednorazovo</h3>
            <ul className="mt-6">
              {cennikOstatne.map((polozka) => (
                <li
                  key={polozka.nazov}
                  className="flex items-start justify-between gap-6 border-t border-sage py-4 first:border-t-0 first:pt-0 md:py-5"
                >
                  <div>
                    <p className="text-base font-medium text-ink md:text-[17px]">{polozka.nazov}</p>
                    <p className="mt-1 max-w-[30rem] text-[14px] leading-relaxed text-drift md:text-[15px]">{polozka.rozsah}</p>
                  </div>
                  <p className="shrink-0 font-display text-[22px] leading-none tracking-[-0.02em] text-deep md:text-[26px]">
                    {polozka.cena}
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
