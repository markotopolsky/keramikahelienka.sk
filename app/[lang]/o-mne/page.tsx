import { bindShortWords } from "@/lib/i18n";
import { getContent } from "@/lib/content";
import { getLang } from "@/lib/i18n-server";
import { pageMetadata } from "@/lib/metadata";
import { PageHero, PageHeroImage } from "@/components/page-hero";
import { Pribeh } from "@/components/o-mne/pribeh";
import { AkoTvorim } from "@/components/o-mne/ako-tvorim";
import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";

export async function generateMetadata() {
  const c = await getContent("o_mne", await getLang());
  return pageMetadata({ path: "/o-mne", title: c["o_mne.meta_titulok"], description: c["o_mne.meta_popis"] });
}

export default async function OMnePage() {
  const lang = await getLang();
  const c = await getContent("o_mne", lang);
  const t = (pole: string) => c[`o_mne.${pole}`];

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("nadpis")}
        lead={t("lead")}
        aside={<PageHeroImage src={t("hero_foto")} alt={t("hero_foto_alt")} position="50% 0%" />}
      />
      <Pribeh obsah={c} />
      <AkoTvorim obsah={c} lang={lang} />

      <section className="bg-sand py-24 md:py-36">
        <Reveal className="site-container flex flex-col items-center text-center">
          <h2 className="text-h2 text-deep">{bindShortWords(t("zaujalo_nadpis"))}</h2>
          <p className="mt-6 max-w-[34rem] text-lead text-ink/80">{t("zaujalo_text")}</p>
          {/* The original "Tu ma nájdete" button led nowhere; now it opens the contact page */}
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/kontakt" variant="deep">
              {t("tlacidlo_najdete")}
            </ButtonLink>
            <ButtonLink href="/obchod" variant="outline" className="text-deep">
              {t("tlacidlo_obchod")}
            </ButtonLink>
            <ButtonLink href="/kurzy" variant="outline" className="text-deep">
              {t("tlacidlo_kurzy")}
            </ButtonLink>
          </div>
        </Reveal>
      </section>
    </>
  );
}
