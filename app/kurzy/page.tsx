import type { Metadata } from "next";
import { PageHero, PageHeroImage } from "@/components/page-hero";
import { ButtonLink } from "@/components/ui/button-link";
import { OKurze } from "@/components/kurzy/o-kurze";
import { Postup } from "@/components/kurzy/postup";
import { Cennik } from "@/components/kurzy/cennik";
import { Rezervacia } from "@/components/kurzy/rezervacia";
import { Teambuilding } from "@/components/kurzy/teambuilding";

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
        lead="Pre dospelých aj deti, v malej skupine v ateliéri v Dúbravke. Modelujeme ručne, na hrnčiarskom kruhu netočíme. Kurzy bežia na jeseň a na jar."
        actions={
          <>
            <ButtonLink href="#rezervacia">Prihlásiť sa</ButtonLink>
            <ButtonLink href="#cennik" variant="outline">
              Cenník
            </ButtonLink>
          </>
        }
        aside={<PageHeroImage src="/images/diela/strip-img_3193.jpg" alt="Ruky držia vlnitú misu s reliéfom" />}
      />
      <OKurze />
      <Postup />
      <Cennik />
      <Rezervacia />
      <Teambuilding />
    </>
  );
}
