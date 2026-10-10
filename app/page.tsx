import { Hero } from "@/components/home/hero";
import { Intro } from "@/components/home/intro";
import { KurzyStack } from "@/components/home/kurzy-stack";
import { DielaGrid } from "@/components/home/diela-grid";
import { OMne } from "@/components/home/o-mne";
import { Recenzie } from "@/components/home/recenzie";
import { KontaktSekcia } from "@/components/kontakt/kontakt-sekcia";

export default function Home() {
  return (
    <>
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
