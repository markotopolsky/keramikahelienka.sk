import Image from "next/image";
import type { Localized } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";

// Helena wants corporate teambuilding visible, but low-key (ZAZNAMNIK.md section 12).
// The button opens the contact form with team building preselected (step 7, looks only).
// TODO: question 15. Does she want that form for HR, or is contact enough?
const moznosti: { nazov: Localized; text: Localized }[] = [
  {
    nazov: { sk: "Miesto", en: "Place" },
    text: { sk: "V ateliéri v Dúbravke, alebo prídeme k vám do firmy.", en: "In the studio in Dúbravka, or we come to your company." },
  },
  {
    nazov: { sk: "Tvorba", en: "Making" },
    text: { sk: "Jedno spoločné dielo celého tímu, alebo každý svoj kúsok.", en: "One shared piece by the whole team, or a piece for everyone." },
  },
  {
    nazov: { sk: "Cena", en: "Price" },
    text: { sk: "Ponuku pripravíme na mieru podľa počtu ľudí.", en: "We prepare a custom quote based on the number of people." },
  },
];

const texty = {
  alt: { sk: "Veľký art objekt s lávovou glazúrou v rukách", en: "Large art object with a lava glaze held in hands" },
  eyebrow: { sk: "Pre firmy", en: "For companies" },
  nadpis: { sk: "Teambuilding s hlinou", en: "Team building with clay" },
  text: {
    sk: "Workshop pre váš tím pripravíme na mieru. Termín aj program dohodneme spolu.",
    en: "We tailor a workshop to your team. We agree on the date and programme together.",
  },
  napisat: { sk: "Napísať o ponuku", en: "Ask for a quote" },
} satisfies Record<string, Localized>;

export async function Teambuilding() {
  const lang = await getLang();

  return (
    <section id="teambuilding" className="bg-sand py-24 md:py-36">
      <div className="site-container">
        <Reveal className="grid overflow-hidden rounded-card bg-mint md:grid-cols-[2fr_3fr]">
          <div className="relative aspect-[3/2] md:aspect-auto">
            <Image
              src="/images/diela/art-object-lava.jpg"
              alt={texty.alt[lang]}
              fill
              sizes="(min-width: 90rem) 544px, (min-width: 48rem) 40vw, calc(100vw - 2.5rem)"
              className="object-cover"
            />
          </div>
          <div className="p-6 sm:p-8 lg:p-14">
            <p className="eyebrow text-drift">{texty.eyebrow[lang]}</p>
            <h2 className="mt-5 text-h3 text-deep">{texty.nadpis[lang]}</h2>
            <p className="mt-5 max-w-[32rem] text-base leading-relaxed text-ink/80 md:text-[17px]">{texty.text[lang]}</p>
            <dl className="mt-8 space-y-4">
              {moznosti.map((m) => (
                <div key={m.nazov.sk} className="flex flex-col gap-1 sm:flex-row sm:gap-6">
                  <dt className="eyebrow shrink-0 pt-1 text-[11px] text-drift sm:w-16">{m.nazov[lang]}</dt>
                  <dd className="text-[15px] leading-relaxed text-ink md:text-base">{m.text[lang]}</dd>
                </div>
              ))}
            </dl>
            <ButtonLink href="/kontakt?typ=teambuilding#sprava" variant="deep" className="mt-10">
              {texty.napisat[lang]}
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
