import { bindShortWords, type Localized } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { pageMetadata } from "@/lib/metadata";
import { oMneUvod, zaujalo } from "@/content/o-mne";
import { PageHero, PageHeroImage } from "@/components/page-hero";
import { Pribeh } from "@/components/o-mne/pribeh";
import { AkoTvorim } from "@/components/o-mne/ako-tvorim";
import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";

const texty = {
  eyebrow: { sk: "Kto som?", en: "Who am I?" },
  nadpis: { sk: "Som Helenka", en: "I am Helenka" },
  alt: { sk: "Helena Sochnová s vázou plnou kvetov", en: "Helena Sochnová with a vase full of flowers" },
  zaujalo: { sk: "Zaujalo vás niečo?", en: "Did something catch your eye?" },
  najdete: { sk: "Tu ma nájdete", en: "Where to find me" },
  obchod: { sk: "Obchod", en: "Shop" },
  kurzy: { sk: "Kurzy", en: "Classes" },
} satisfies Record<string, Localized>;

export function generateMetadata() {
  return pageMetadata({
    path: "/o-mne",
    title: { sk: "O mne", en: "About me" },
    description: {
      sk: "Som Helenka. Od roku 2020 mám vlastný keramický ateliér v Bratislave-Dúbravke, tvorím misy, vázy a lampy a vediem kurzy keramiky.",
      en: "I am Helenka. Since 2020 I have had my own ceramics studio in Bratislava-Dúbravka, where I make bowls, vases and lamps and teach pottery classes.",
    },
  });
}

export default async function OMnePage() {
  const lang = await getLang();

  return (
    <>
      <PageHero
        eyebrow={texty.eyebrow[lang]}
        title={texty.nadpis[lang]}
        lead={oMneUvod[lang]}
        aside={<PageHeroImage src="/images/helena/helena-kvety.jpg" alt={texty.alt[lang]} position="50% 0%" />}
      />
      <Pribeh />
      <AkoTvorim />

      <section className="bg-sand py-24 md:py-36">
        <Reveal className="site-container flex flex-col items-center text-center">
          <h2 className="text-h2 text-deep">{bindShortWords(texty.zaujalo[lang])}</h2>
          <p className="mt-6 max-w-[34rem] text-lead text-ink/80">{zaujalo[lang]}</p>
          {/* The original "Tu ma nájdete" button led nowhere; now it opens the contact page */}
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/kontakt" variant="deep">
              {texty.najdete[lang]}
            </ButtonLink>
            <ButtonLink href="/obchod" variant="outline" className="text-deep">
              {texty.obchod[lang]}
            </ButtonLink>
            <ButtonLink href="/kurzy" variant="outline" className="text-deep">
              {texty.kurzy[lang]}
            </ButtonLink>
          </div>
        </Reveal>
      </section>
    </>
  );
}
