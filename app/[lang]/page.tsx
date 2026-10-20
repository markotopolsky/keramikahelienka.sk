import { getLang } from "@/lib/i18n-server";
import { pageMetadata } from "@/lib/metadata";
import { atelierData } from "@/lib/strukturovane-data";
import { JsonLd } from "@/components/json-ld";
import { Hero } from "@/components/home/hero";
import { Intro } from "@/components/home/intro";
import { KurzyStack } from "@/components/home/kurzy-stack";
import { DielaGrid } from "@/components/home/diela-grid";
import { OMne } from "@/components/home/o-mne";
import { Recenzie } from "@/components/home/recenzie";
import { KontaktSekcia } from "@/components/kontakt/kontakt-sekcia";

export function generateMetadata() {
  return pageMetadata({
    path: "/",
    description: {
      sk: "Ručne modelované misy, vázy, lampy a art objekty z ateliéru v Bratislave-Dúbravke. Kurzy keramiky pre dospelých aj deti.",
      en: "Hand-built bowls, vases, lamps and art objects from a studio in Bratislava-Dúbravka. Pottery classes for adults and children.",
    },
  });
}

export default async function Home() {
  const lang = await getLang();
  return (
    <>
      <JsonLd data={atelierData(lang)} />
      <Hero />
      <Intro />
      {/* Helena's own work comes first, courses second (ZAZNAMNIK.md section 12) */}
      <DielaGrid />
      <KurzyStack />
      <OMne />
      <Recenzie />
      <KontaktSekcia tone="mint" kanaly />
    </>
  );
}
