import type { Metadata } from "next";
import { formular } from "@/content/atelier";
import { PageHero, PageHeroImage } from "@/components/page-hero";
import { ButtonLink } from "@/components/ui/button-link";
import { KurzyStack } from "@/components/home/kurzy-stack";
import { Cennik } from "@/components/kurzy/cennik";

export const metadata: Metadata = {
  title: "Kurzy keramiky",
  description:
    "Príďte sa dotýkať hliny a tvorivo relaxovať. Kurzy keramiky pre dospelých aj deti v ateliéri v Bratislave-Dúbravke: mesačné kurzy, workshopy a teambuilding.",
};

export default function KurzyPage() {
  return (
    <>
      <PageHero
        eyebrow="Kurzy keramiky"
        title="Príďte sa dotýkať hliny a tvorivo relaxovať"
        lead="Pre dospelých aj deti, v ateliéri v Dúbravke. Modelujeme ručne, bez hrnčiarskeho kruhu."
        actions={
          <>
            <ButtonLink href={formular.kurzy}>Prihlásiť sa</ButtonLink>
            <ButtonLink href="#cennik" variant="outline">
              Cenník
            </ButtonLink>
          </>
        }
        aside={<PageHeroImage src="/images/diela/strip-img_2212.jpg" alt="Modrá váza s reliéfom v rukách" />}
      />
      <KurzyStack
        title="Vyberte si kurz"
        aside="Kurzy bežia na jeseň a na jar, v malej skupine najviac 8 ľudí."
        links={false}
      />
      <Cennik />
    </>
  );
}
