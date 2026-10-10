import { kontakt } from "@/content/atelier";
import { prihlaska } from "@/content/kurzy";
import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { TornEdge } from "@/components/ui/torn-edge";

// Sign-up still runs through Helena's Google form. Booking on the site is a later, separate project
// (ZAZNAMNIK.md section 15, phase 5).
const kroky = [
  {
    nazov: "Vyplňte prihlášku",
    text: "Prihláška je online formulár. Prihlásiť sa môžete aj priamo v ateliéri.",
  },
  {
    nazov: "Zaplaťte kurz",
    text: "Kurz zaplaťte najneskôr 7 dní pred začiatkom, rezervácia platí dňom úhrady. Zaplatiť môžete prevodom na účet, v hotovosti alebo darčekovou poukážkou.",
  },
  {
    nazov: "Príďte do ateliéru",
    text: `${kontakt.ulica}, Bratislava-Dúbravka. Hlina a nástroje budú pripravené.`,
  },
];

export function Rezervacia() {
  return (
    <section id="rezervacia" className="bg-deep text-sand">
      <TornEdge className="-mt-px rotate-180 text-sand" seed={23} />
      <div className="site-container pb-24 pt-16 md:pb-36 md:pt-24">
        <SectionHeading
          tone="dark"
          eyebrow="Prihláška"
          title="Ako sa prihlásiť na kurz"
          aside="Bez zaplatenia je prihláška nezáväzná."
        />

        <ol className="grid gap-10 md:grid-cols-3 md:gap-8 lg:gap-12">
          {kroky.map((krok, i) => (
            <Reveal as="li" key={krok.nazov} delay={i * 0.08} className="border-t border-sand/20 pt-6">
              <p aria-hidden className="font-display text-[44px] leading-none tracking-[-0.03em] text-aqua md:text-[56px]">
                {i + 1}
              </p>
              <h3 className="mt-5 text-[24px] leading-tight tracking-[-0.02em] md:text-[28px]">{krok.nazov}</h3>
              <p className="mt-3 max-w-[22rem] text-[15px] leading-relaxed text-sand/80 md:text-base">{krok.text}</p>
            </Reveal>
          ))}
        </ol>

        <Reveal className="mt-14 flex flex-col items-start gap-8 border-t border-sand/20 pt-10 md:mt-20 md:flex-row md:items-center md:justify-between">
          <ButtonLink href={prihlaska} external>
            Vyplniť prihlášku
          </ButtonLink>
          <p className="max-w-[30rem] text-[15px] leading-relaxed text-sand/80 md:text-right">
            Máte otázky? Zavolajte na{" "}
            <a href={kontakt.telefonHref} className="whitespace-nowrap text-sand underline decoration-aqua underline-offset-4 hover:text-aqua">
              {kontakt.telefon}
            </a>{" "}
            alebo napíšte na{" "}
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
