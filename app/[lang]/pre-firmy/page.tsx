import { bindShortWords, type Localized } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { pageMetadata } from "@/lib/metadata";
import { formular } from "@/content/atelier";
import { PageHero, PageHeroImage } from "@/components/page-hero";
import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

const texty = {
  eyebrow: { sk: "Pre firmy", en: "For companies" },
  nadpis: { sk: "Teambuilding s hlinou v rukách", en: "Team building with clay in your hands" },
  lead: {
    sk: "Keramický workshop pre kolegov – spoločný zážitok, na ktorý sa dá aj po rokoch zaspomínať. Pripravíme ho na mieru podľa vašich požiadaviek.",
    en: "A pottery workshop for colleagues – a shared experience worth remembering for years. We tailor it to your needs.",
  },
  napisat: { sk: "Napísať o ponuku", en: "Ask about a quote" },
  alt: { sk: "Skupina ľudí pri keramickom workshope", en: "A group of people at a pottery workshop" },
  ponuka: { sk: "Ako to prebieha", en: "How it works" },
  ponukaAside: {
    sk: "Robíme ho zvyčajne 1 – 2× do roka, podľa dohody.",
    en: "We usually run it once or twice a year, by arrangement.",
  },
  miestoNadpis: { sk: "Kde", en: "Where" },
  miestoText: {
    sk: "V ateliéri v Dúbravke, alebo prídeme s materiálom priamo k vám do firmy.",
    en: "At the studio in Dúbravka, or we bring the materials to your company.",
  },
  tvorbaNadpis: { sk: "Čo tvoríte", en: "What you make" },
  tvorbaText: {
    sk: "Jedno spoločné dielo, alebo si každý odnesie vlastný kúsok – vyberiete si.",
    en: "One shared piece, or everyone takes home their own – you choose.",
  },
  cenaNadpis: { sk: "Cena", en: "Price" },
  cenaText: {
    sk: "Pripravíme cenovú ponuku na mieru podľa počtu ľudí a miesta konania.",
    en: "We prepare a custom quote based on the number of people and the venue.",
  },
} satisfies Record<string, Localized>;

export function generateMetadata() {
  return pageMetadata({
    path: "/pre-firmy",
    title: { sk: "Pre firmy", en: "For companies" },
    description: {
      sk: "Teambuilding a firemné workshopy s keramikou v ateliéri v Bratislave-Dúbravke, alebo priamo u vás vo firme. Cenová ponuka na mieru.",
      en: "Team building and company pottery workshops in our studio in Bratislava-Dúbravka, or at your company. Custom quotes.",
    },
  });
}

export default async function PreFirmyPage() {
  const lang = await getLang();

  return (
    <>
      <PageHero
        eyebrow={texty.eyebrow[lang]}
        title={texty.nadpis[lang]}
        lead={texty.lead[lang]}
        actions={<ButtonLink href={formular.firmy}>{texty.napisat[lang]}</ButtonLink>}
        aside={<PageHeroImage src="/images/produkty/keramicky-workshop-3-2-hodiny-1.jpg" alt={texty.alt[lang]} />}
      />

      <section className="bg-sand py-24 md:py-36">
        <div className="site-container">
          <SectionHeading eyebrow={texty.ponuka[lang]} title={texty.nadpis[lang]} aside={texty.ponukaAside[lang]} />

          <div className="grid gap-6 md:grid-cols-3">
            <Karta nadpis={texty.miestoNadpis[lang]} text={texty.miestoText[lang]} />
            <Karta nadpis={texty.tvorbaNadpis[lang]} text={texty.tvorbaText[lang]} />
            <Karta nadpis={texty.cenaNadpis[lang]} text={texty.cenaText[lang]} />
          </div>

          <Reveal className="mt-14 flex justify-center md:mt-20">
            <ButtonLink href={formular.firmy} variant="deep">
              {texty.napisat[lang]}
            </ButtonLink>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function Karta({ nadpis, text }: { nadpis: string; text: string }) {
  return (
    <Reveal className="rounded-card bg-mint p-8">
      <h3 className="text-h3 text-deep">{bindShortWords(nadpis)}</h3>
      <p className="mt-3 text-[15px] leading-relaxed text-ink/80">{text}</p>
    </Reveal>
  );
}
