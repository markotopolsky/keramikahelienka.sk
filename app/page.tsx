import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Hero } from "@/components/home/hero";
import { Intro } from "@/components/home/intro";
import { KurzyStack } from "@/components/home/kurzy-stack";
import { DielaGrid } from "@/components/home/diela-grid";
import { OMne } from "@/components/home/o-mne";
import { Recenzie } from "@/components/home/recenzie";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Intro />
        <KurzyStack />
        <DielaGrid />
        <OMne />
        <Recenzie />
      </main>
      <SiteFooter />
    </>
  );
}
