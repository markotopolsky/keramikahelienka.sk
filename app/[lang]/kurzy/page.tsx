import type { Localized } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { pageMetadata } from "@/lib/metadata";
import { formular } from "@/content/atelier";
import { PageHero, PageHeroImage } from "@/components/page-hero";
import { ButtonLink } from "@/components/ui/button-link";
import { KurzyStack } from "@/components/home/kurzy-stack";
import { Cennik } from "@/components/kurzy/cennik";

const texty = {
  eyebrow: { sk: "Kurzy keramiky", en: "Pottery classes" },
  nadpis: { sk: "Príďte sa dotýkať hliny a tvorivo relaxovať", en: "Come and touch clay and relax creatively" },
  lead: {
    sk: "Pre dospelých aj deti, v ateliéri v Dúbravke. Modelujeme ručne, bez hrnčiarskeho kruhu.",
    en: "For adults and children, in the studio in Dúbravka. We build by hand, without a potter’s wheel.",
  },
  prihlasit: { sk: "Prihlásiť sa", en: "Sign up" },
  cennik: { sk: "Cenník", en: "Prices" },
  alt: { sk: "Modrá váza s reliéfom v rukách", en: "Blue vase with a relief held in hands" },
  vyberte: { sk: "Vyberte si kurz", en: "Choose a class" },
  sezona: {
    sk: "Kurzy bežia na jeseň a na jar, v malej skupine najviac 8 ľudí.",
    en: "Classes run in autumn and spring, in a small group of at most 8 people.",
  },
} satisfies Record<string, Localized>;

export function generateMetadata() {
  return pageMetadata({
    path: "/kurzy",
    title: { sk: "Kurzy keramiky", en: "Pottery classes" },
    description: {
      sk: "Príďte sa dotýkať hliny a tvorivo relaxovať. Kurzy keramiky pre dospelých aj deti v ateliéri v Bratislave-Dúbravke: mesačné kurzy, workshopy a teambuilding.",
      en: "Come and touch clay and relax creatively. Pottery classes for adults and children in a studio in Bratislava-Dúbravka: monthly courses, workshops and team building.",
    },
  });
}

export default async function KurzyPage() {
  const lang = await getLang();

  return (
    <>
      <PageHero
        eyebrow={texty.eyebrow[lang]}
        title={texty.nadpis[lang]}
        lead={texty.lead[lang]}
        actions={
          <>
            <ButtonLink href={formular.kurzy}>{texty.prihlasit[lang]}</ButtonLink>
            <ButtonLink href="#cennik" variant="outline">
              {texty.cennik[lang]}
            </ButtonLink>
          </>
        }
        aside={<PageHeroImage src="/images/diela/strip-img_2212.jpg" alt={texty.alt[lang]} />}
      />
      <KurzyStack title={texty.vyberte} aside={texty.sezona} links={false} />
      <Cennik />
    </>
  );
}
