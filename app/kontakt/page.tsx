import type { Metadata } from "next";
import { kontakt, mapa } from "@/content/atelier";
import { PageHero } from "@/components/page-hero";
import { KontaktForm } from "@/components/kontakt/kontakt-form";
import { Mapa } from "@/components/kontakt/mapa";
import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Keramika He-lienka, Na vrátkach 1K, 841 01 Bratislava-Dúbravka. Telefón 0903 394 212, e-mail info@keramikahelienka.sk.",
};

// TODO: question 3 for Helena. Which address is the main one, info@ or her gmail?
const kanaly = [
  { nazov: "Telefón", hodnota: kontakt.telefon, href: kontakt.telefonHref },
  { nazov: "E-mail", hodnota: kontakt.email, href: `mailto:${kontakt.email}` },
  { nazov: "Ateliér", hodnota: `${kontakt.ulica}, ${kontakt.mesto}`, href: "#mapa" },
];

const siete = [
  { nazov: "Instagram", href: kontakt.instagram },
  { nazov: "Facebook", href: kontakt.facebook },
  { nazov: "YouTube", href: kontakt.youtube },
  { nazov: "LinkedIn", href: kontakt.linkedin },
];

export default function KontaktPage() {
  return (
    <>
      <PageHero
        eyebrow="Kontakt"
        title="Zostaňme v kontakte"
        lead="Radi vám pripravíme ponuku našich výrobkov, kurzov, workshopov a teambuildingu na mieru podľa vašich požiadaviek."
        aside={
          <dl className="divide-y divide-sand/15 border-y border-sand/15">
            {kanaly.map((kanal) => (
              <div key={kanal.nazov} className="py-5">
                <dt className="eyebrow text-[11px] text-aqua">{kanal.nazov}</dt>
                <dd className="mt-2">
                  <a
                    href={kanal.href}
                    className="font-display text-[20px] leading-tight tracking-[-0.02em] transition-colors hover:text-aqua sm:text-[24px]"
                  >
                    {kanal.hodnota}
                  </a>
                </dd>
              </div>
            ))}
          </dl>
        }
      />

      <section id="sprava" className="bg-sand py-24 md:py-36">
        <div className="site-container grid gap-14 lg:grid-cols-[1fr_36rem] lg:gap-20 xl:grid-cols-[1fr_40rem]">
          <div>
            <Reveal>
              <p className="eyebrow text-drift">Napíšte nám</p>
              <h2 className="mt-5 text-h2 text-deep">Máte otázky?</h2>
              <p className="mt-6 max-w-[28rem] text-lead text-ink/80">
                Ozvite sa telefonicky, e-mailom alebo cez formulár. Radi poradíme s kurzom, darčekom aj dielom na mieru.
              </p>
            </Reveal>
            <Reveal delay={0.1} className="mt-12">
              <p className="eyebrow text-drift">Sledujte nás</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {siete.map((siet) => (
                  <li key={siet.nazov}>
                    <a
                      href={siet.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex rounded-full border border-sage px-4 py-2 text-[15px] text-deep transition-colors hover:border-deep hover:bg-deep hover:text-sand"
                    >
                      {siet.nazov}
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="rounded-card bg-mint p-5 sm:p-8 lg:p-10">
            <KontaktForm />
          </Reveal>
        </div>
      </section>

      <section id="mapa" className="bg-mint py-24 md:py-36">
        <div className="site-container grid gap-12 lg:grid-cols-[1fr_2fr] lg:items-end lg:gap-16">
          <Reveal>
            <p className="eyebrow text-drift">Kde nás nájdete</p>
            <h2 className="mt-5 text-h2 text-deep">Ateliér v Dúbravke</h2>
            <address className="mt-6 text-lead not-italic text-ink/80">
              {kontakt.nazov}
              <br />
              {kontakt.ulica}
              <br />
              {kontakt.mesto}
            </address>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={mapa.trasa} variant="deep" external>
                Naplánovať trasu
              </ButtonLink>
              <ButtonLink href={mapa.odkaz} variant="outline" className="text-deep" external>
                Google Maps
              </ButtonLink>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <Mapa />
          </Reveal>
        </div>
      </section>
    </>
  );
}
