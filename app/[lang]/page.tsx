import { getLang } from "@/lib/i18n-server";
import { pageMetadata } from "@/lib/metadata";
import { getContent, getKontakt, getKurzy } from "@/lib/content";
import { atelierData } from "@/lib/strukturovane-data";
import { JsonLd } from "@/components/json-ld";
import { Hero } from "@/components/home/hero";
import { Intro } from "@/components/home/intro";
import { KurzyStack } from "@/components/home/kurzy-stack";
import { DielaGrid } from "@/components/home/diela-grid";
import { OMne } from "@/components/home/o-mne";
import { Recenzie } from "@/components/home/recenzie";
import { KontaktSekcia } from "@/components/kontakt/kontakt-sekcia";

export async function generateMetadata() {
  const seo = await getContent("seo", await getLang());
  return pageMetadata({ path: "/", description: seo["seo.popis"] });
}

export default async function Home() {
  const lang = await getLang();
  const [hero, kurzyDomov, ponuka, kurzy, kontakt] = await Promise.all([
    getContent("hero", lang),
    getContent("kurzy_domov", lang),
    getContent("kurzy_ponuka", lang),
    getKurzy(lang),
    getKontakt(),
  ]);
  return (
    <>
      <JsonLd data={atelierData(lang, kontakt)} />
      <Hero obsah={hero} />
      <Intro />
      {/* Helena's own work comes first, courses second (ZAZNAMNIK.md section 12) */}
      <DielaGrid />
      <KurzyStack
        kurzy={kurzy}
        title={kurzyDomov["kurzy_domov.nadpis"]}
        aside={kurzyDomov["kurzy_domov.aside"]}
        viac={ponuka["kurzy_ponuka.viac"]}
        links={{
          teambuilding: kurzyDomov["kurzy_domov.teambuilding"],
          rezervovat: kurzyDomov["kurzy_domov.tlacidlo_rezervovat"],
          cennik: kurzyDomov["kurzy_domov.tlacidlo_cennik"],
        }}
      />
      <OMne />
      <Recenzie />
      <KontaktSekcia tone="mint" kanaly />
    </>
  );
}
