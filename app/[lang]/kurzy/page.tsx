import { getLang } from "@/lib/i18n-server";
import { pageMetadata } from "@/lib/metadata";
import { getContent, getKurzy } from "@/lib/content";
import { formular } from "@/content/atelier";
import { PageHero, PageHeroImage } from "@/components/page-hero";
import { ButtonLink } from "@/components/ui/button-link";
import { KurzyStack } from "@/components/home/kurzy-stack";
import { Cennik } from "@/components/kurzy/cennik";
import { KontaktSekcia } from "@/components/kontakt/kontakt-sekcia";

export async function generateMetadata() {
  const c = await getContent("kurzy_stranka", await getLang());
  return pageMetadata({ path: "/kurzy", title: c["kurzy_stranka.meta_titulok"], description: c["kurzy_stranka.meta_popis"] });
}

export default async function KurzyPage() {
  const lang = await getLang();
  const [c, ponuka, kurzy] = await Promise.all([getContent("kurzy_stranka", lang), getContent("kurzy_ponuka", lang), getKurzy(lang)]);

  return (
    <>
      <PageHero
        eyebrow={c["kurzy_stranka.eyebrow"]}
        title={c["kurzy_stranka.nadpis"]}
        lead={c["kurzy_stranka.lead"]}
        actions={
          <>
            <ButtonLink href={formular.kurzy} variant="deep">
              {c["kurzy_stranka.tlacidlo_prihlasit"]}
            </ButtonLink>
            <ButtonLink href="#cennik" variant="outline">
              {c["kurzy_stranka.tlacidlo_cennik"]}
            </ButtonLink>
          </>
        }
        aside={<PageHeroImage src={c["kurzy_stranka.foto"]} alt={c["kurzy_stranka.foto_alt"]} />}
      />
      <KurzyStack
        kurzy={kurzy}
        title={c["kurzy_stranka.vyberte"]}
        aside={c["kurzy_stranka.sezona"]}
        viac={ponuka["kurzy_ponuka.viac"]}
      />
      <Cennik />
      <KontaktSekcia typ="kurzy" />
    </>
  );
}
