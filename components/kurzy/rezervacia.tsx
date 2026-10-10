import type { Localized } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { kontakt } from "@/content/atelier";
import { prihlaska } from "@/content/kurzy";
import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { TornEdge } from "@/components/ui/torn-edge";

// Sign-up still runs through Helena's Google form. Booking on the site is a later, separate project
// (ZAZNAMNIK.md section 15, phase 5).
const kroky: { nazov: Localized; text: Localized }[] = [
  {
    nazov: { sk: "Vyplňte prihlášku", en: "Fill in the sign-up form" },
    text: {
      sk: "Prihláška je online formulár. Prihlásiť sa môžete aj priamo v ateliéri.",
      en: "The sign-up form is online (in Slovak). You can also sign up in person at the studio.",
    },
  },
  {
    nazov: { sk: "Zaplaťte kurz", en: "Pay for the class" },
    text: {
      sk: "Kurz zaplaťte najneskôr 7 dní pred začiatkom, rezervácia platí dňom úhrady. Zaplatiť môžete prevodom na účet, v hotovosti alebo darčekovou poukážkou.",
      en: "Pay at least 7 days before the start; your place is booked on the day of payment. You can pay by bank transfer, in cash or with a gift voucher.",
    },
  },
  {
    nazov: { sk: "Príďte do ateliéru", en: "Come to the studio" },
    text: {
      sk: `${kontakt.ulica}, Bratislava-Dúbravka. Hlina a nástroje budú pripravené.`,
      en: `${kontakt.ulica}, Bratislava-Dúbravka. Clay and tools will be ready.`,
    },
  },
];

const texty = {
  eyebrow: { sk: "Prihláška", en: "Sign-up" },
  nadpis: { sk: "Ako sa prihlásiť na kurz", en: "How to sign up for a class" },
  aside: { sk: "Bez zaplatenia je prihláška nezáväzná.", en: "Until you pay, the sign-up is not binding." },
  vyplnit: { sk: "Vyplniť prihlášku", en: "Fill in the form" },
  otazky: { sk: "Máte otázky? Zavolajte na", en: "Questions? Call" },
  alebo: { sk: "alebo napíšte na", en: "or write to" },
} satisfies Record<string, Localized>;

export async function Rezervacia() {
  const lang = await getLang();

  return (
    <section id="rezervacia" className="bg-deep text-sand">
      <TornEdge className="-mt-px rotate-180 text-sand" seed={23} />
      <div className="site-container pb-24 pt-16 md:pb-36 md:pt-24">
        <SectionHeading tone="dark" eyebrow={texty.eyebrow[lang]} title={texty.nadpis[lang]} aside={texty.aside[lang]} />

        <ol className="grid gap-10 md:grid-cols-3 md:gap-8 lg:gap-12">
          {kroky.map((krok, i) => (
            <Reveal as="li" key={krok.nazov.sk} delay={i * 0.08} className="border-t border-sand/20 pt-6">
              <p aria-hidden className="font-display text-[44px] leading-none tracking-[-0.03em] text-aqua md:text-[56px]">
                {i + 1}
              </p>
              <h3 className="mt-5 text-[24px] leading-tight tracking-[-0.02em] md:text-[28px]">{krok.nazov[lang]}</h3>
              <p className="mt-3 max-w-[22rem] text-[15px] leading-relaxed text-sand/80 md:text-base">{krok.text[lang]}</p>
            </Reveal>
          ))}
        </ol>

        <Reveal className="mt-14 flex flex-col items-start gap-8 border-t border-sand/20 pt-10 md:mt-20 md:flex-row md:items-center md:justify-between">
          <ButtonLink href={prihlaska} external>
            {texty.vyplnit[lang]}
          </ButtonLink>
          <p className="max-w-[30rem] text-[15px] leading-relaxed text-sand/80 md:text-right">
            {texty.otazky[lang]}{" "}
            <a href={kontakt.telefonHref} className="whitespace-nowrap text-sand underline decoration-aqua underline-offset-4 hover:text-aqua">
              {kontakt.telefon}
            </a>{" "}
            {texty.alebo[lang]}{" "}
            <a href={`mailto:${kontakt.email}`} className="text-sand underline decoration-aqua underline-offset-4 hover:text-aqua">
              {kontakt.email}
            </a>
            .
          </p>
        </Reveal>
      </div>
    </section>
  );
}
