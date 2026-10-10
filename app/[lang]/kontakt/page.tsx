import { Suspense } from "react";
import type { Localized } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { pageMetadata } from "@/lib/metadata";
import { kontakt, mapa } from "@/content/atelier";
import { PageHero } from "@/components/page-hero";
import { KontaktForm, KontaktFormZUrl } from "@/components/kontakt/kontakt-form";
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
  napiste: { sk: "Napíšte nám", en: "Write to us" },
  otazky: { sk: "Máte otázky?", en: "Any questions?" },
  otazkyText: {
    sk: "Ozvite sa telefonicky, e-mailom alebo cez formulár. Radi poradíme s kurzom, darčekom aj dielom na mieru.",
    en: "Get in touch by phone, email or the form. We are glad to help with a class, a gift or a custom piece.",
  },
  sledujte: { sk: "Sledujte nás", en: "Follow us" },
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

const siete = [
  { nazov: "Instagram", href: kontakt.instagram },
  { nazov: "Facebook", href: kontakt.facebook },
  { nazov: "YouTube", href: kontakt.youtube },
  { nazov: "LinkedIn", href: kontakt.linkedin },
];

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
              <div key={kanal.href} className="py-5">
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
              <p className="eyebrow text-drift">{texty.napiste[lang]}</p>
              <h2 className="mt-5 text-h2 text-deep">{texty.otazky[lang]}</h2>
              <p className="mt-6 max-w-[28rem] text-lead text-ink/80">{texty.otazkyText[lang]}</p>
            </Reveal>
            <Reveal delay={0.1} className="mt-12">
              <p className="eyebrow text-drift">{texty.sledujte[lang]}</p>
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
            <Suspense fallback={<KontaktForm />}>
              <KontaktFormZUrl />
            </Suspense>
          </Reveal>
        </div>
      </section>

      <section id="mapa" className="bg-mint py-24 md:py-36">
        <div className="site-container grid gap-12 lg:grid-cols-[1fr_2fr] lg:items-end lg:gap-16">
          <Reveal>
            <p className="eyebrow text-drift">{texty.kde[lang]}</p>
            <h2 className="mt-5 text-h2 text-deep">{texty.atelierNadpis[lang]}</h2>
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
