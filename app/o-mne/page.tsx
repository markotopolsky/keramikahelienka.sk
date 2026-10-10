import type { Metadata } from "next";
import { oMneUvod, zaujalo } from "@/content/o-mne";
import { PageHero, PageHeroImage } from "@/components/page-hero";
import { Pribeh } from "@/components/o-mne/pribeh";
import { AkoTvorim } from "@/components/o-mne/ako-tvorim";
import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "O mne",
  description:
    "Som Helenka. Od roku 2020 mám vlastný keramický ateliér v Bratislave-Dúbravke, tvorím misy, vázy a lampy a vediem kurzy keramiky.",
};

export default function OMnePage() {
  return (
    <>
      <PageHero
        eyebrow="Kto som?"
        title="Som Helenka"
        lead={oMneUvod}
        aside={
          <PageHeroImage src="/images/helena-kvety.jpg" alt="Helena Sochnová s vázou plnou kvetov" position="50% 0%" />
        }
      />
      <Pribeh />
      <AkoTvorim />

      <section className="bg-sand py-24 md:py-36">
        <Reveal className="site-container flex flex-col items-center text-center">
          <h2 className="text-h2 text-deep">Zaujalo vás niečo?</h2>
          <p className="mt-6 max-w-[34rem] text-lead text-ink/80">{zaujalo}</p>
          {/* The original "Tu ma nájdete" button led nowhere; now it opens the contact page */}
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/kontakt" variant="deep">
              Tu ma nájdete
            </ButtonLink>
            <ButtonLink href="/obchod" variant="outline" className="text-deep">
              Obchod
            </ButtonLink>
            <ButtonLink href="/kurzy" variant="outline" className="text-deep">
              Kurzy
            </ButtonLink>
          </div>
        </Reveal>
      </section>
    </>
  );
}
