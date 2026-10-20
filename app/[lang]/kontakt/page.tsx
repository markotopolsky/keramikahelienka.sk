import { bindShortWords, type Localized } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { pageMetadata } from "@/lib/metadata";
import { kontakt, mapa } from "@/content/atelier";
import { PageHero } from "@/components/page-hero";
import { KontaktSekcia } from "@/components/kontakt/kontakt-sekcia";
import { Mapa } from "@/components/kontakt/mapa";
import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";

const texty = {
  eyebrow: { sk: "Kontakt", en: "Contact" },
  nadpis: { sk: "Zostaňme v kontakte", en: "Let’s stay in touch" },
  lead: {
    sk: "Radi vám pripravíme ponuku našich výrobkov, kurzov, workshopov a teambuildingu na mieru podľa vašich požiadaviek.",
    en: "We are happy to prepare an offer of our pieces, classes, workshops and team building tailored to your wishes.",
  },
  telefon: { sk: "Telefón", en: "Phone" },
  email: { sk: "E-mail", en: "Email" },
  atelier: { sk: "Ateliér", en: "Studio" },
  kde: { sk: "Kde nás nájdete", en: "Where to find us" },
  atelierNadpis: { sk: "Ateliér v Dúbravke", en: "Studio in Dúbravka" },
  trasa: { sk: "Naplánovať trasu", en: "Get directions" },
} satisfies Record<string, Localized>;

export function generateMetadata() {
  return pageMetadata({
    path: "/kontakt",
    title: { sk: "Kontakt", en: "Contact" },
    description: {
      sk: "Keramika He-lienka, Na vrátkach 1K, 841 01 Bratislava-Dúbravka. Telefón 0903 394 212, e-mail info@keramikahelienka.sk.",
      en: "Keramika He-lienka, Na vrátkach 1K, 841 01 Bratislava-Dúbravka. Phone +421 903 394 212, email info@keramikahelienka.sk.",
    },
  });
}

export default async function KontaktPage() {
  const lang = await getLang();

  // TODO: question 3 for Helena. Which address is the main one, info@ or her gmail?
  const kanaly = [
    { nazov: texty.telefon[lang], hodnota: kontakt.telefon, href: kontakt.telefonHref },
    { nazov: texty.email[lang], hodnota: kontakt.email, href: `mailto:${kontakt.email}` },
    { nazov: texty.atelier[lang], hodnota: `${kontakt.ulica}, ${kontakt.mesto}`, href: "#mapa" },
  ];

  return (
    <>
      <PageHero
        eyebrow={texty.eyebrow[lang]}
        title={texty.nadpis[lang]}
        lead={texty.lead[lang]}
        aside={
          <dl className="divide-y divide-sand/15 border-y border-sand/15">
            {kanaly.map((kanal) => (
              <div key={kanal.href} className="py-5 touch:pb-3.5">
                <dt className="eyebrow text-[11px] text-aqua">{kanal.nazov}</dt>
                <dd className="mt-2 touch:mt-0.5">
                  <a
                    href={kanal.href}
                    className="font-display text-[20px] leading-tight tracking-[-0.02em] transition-colors hover:text-aqua sm:text-[24px] touch:inline-flex touch:min-h-11 touch:items-center"
                  >
                    {kanal.hodnota}
                  </a>
                </dd>
              </div>
            ))}
          </dl>
        }
      />

      <KontaktSekcia />

      <section id="mapa" className="bg-mint py-24 md:py-36">
        <div className="site-container grid gap-12 lg:grid-cols-[1fr_2fr] lg:items-end lg:gap-16">
          <Reveal>
            <p className="eyebrow text-drift">{texty.kde[lang]}</p>
            <h2 className="mt-5 text-h2 text-deep">{bindShortWords(texty.atelierNadpis[lang])}</h2>
            <address className="mt-6 text-lead not-italic text-ink/80">
              {kontakt.nazov}
              <br />
              {kontakt.ulica}
              <br />
              {kontakt.mesto}
            </address>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={mapa.trasa} variant="deep" external>
                {texty.trasa[lang]}
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
