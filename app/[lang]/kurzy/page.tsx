import type { Localized } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { pageMetadata } from "@/lib/metadata";
import { PageHero, PageHeroImage } from "@/components/page-hero";
import { ButtonLink } from "@/components/ui/button-link";
import { OKurze } from "@/components/kurzy/o-kurze";
import { Postup } from "@/components/kurzy/postup";
import { Cennik } from "@/components/kurzy/cennik";
import { Rezervacia } from "@/components/kurzy/rezervacia";
import { Teambuilding } from "@/components/kurzy/teambuilding";

const texty = {
  eyebrow: { sk: "Kurzy keramiky", en: "Pottery classes" },
  nadpis: { sk: "Príďte sa dotýkať hliny a tvorivo relaxovať", en: "Come and touch clay and relax creatively" },
  lead: {
    sk: "Pre dospelých aj deti, v malej skupine v ateliéri v Dúbravke. Modelujeme ručne, na hrnčiarskom kruhu netočíme. Kurzy bežia na jeseň a na jar.",
    en: "For adults and children, in a small group in the studio in Dúbravka. We build by hand and do not use the potter’s wheel. Classes run in autumn and spring.",
  },
  prihlasit: { sk: "Prihlásiť sa", en: "Sign up" },
  cennik: { sk: "Cenník", en: "Prices" },
  alt: { sk: "Ruky držia vlnitú misu s reliéfom", en: "Hands holding a wavy bowl with a relief" },
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
            <ButtonLink href="#rezervacia">{texty.prihlasit[lang]}</ButtonLink>
            <ButtonLink href="#cennik" variant="outline">
              {texty.cennik[lang]}
            </ButtonLink>
          </>
        }
        aside={<PageHeroImage src="/images/diela/strip-img_3193.jpg" alt={texty.alt[lang]} />}
      />
      <OKurze />
      <Postup />
      <Cennik />
      <Rezervacia />
      <Teambuilding />
    </>
  );
}
