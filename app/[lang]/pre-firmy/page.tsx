import { bindShortWords } from "@/lib/i18n";
import { getContent } from "@/lib/content";
import { getLang } from "@/lib/i18n-server";
import { pageMetadata } from "@/lib/metadata";
import { formular } from "@/content/atelier";
import { PageHero, PageHeroImage } from "@/components/page-hero";
import { KontaktSekcia } from "@/components/kontakt/kontakt-sekcia";
import { CasteOtazky, getOtazky } from "@/components/kurzy/caste-otazky";
import { Fotky } from "@/components/kurzy/fotky";
import { Priebeh } from "@/components/kurzy/priebeh";
import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export async function generateMetadata() {
  const c = await getContent("pre_firmy", await getLang());
  return pageMetadata({ path: "/pre-firmy", title: c["pre_firmy.meta_titulok"], description: c["pre_firmy.meta_popis"] });
}

export default async function PreFirmyPage() {
  const lang = await getLang();
  const c = await getContent("pre_firmy", lang);
  const t = (pole: string) => c[`pre_firmy.${pole}`];
  const otazky = getOtazky(c, "pre_firmy");

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("nadpis")}
        lead={t("lead")}
        actions={
          <ButtonLink href={formular.firmy} variant="deep">
            {t("tlacidlo")}
          </ButtonLink>
        }
        aside={<PageHeroImage src={t("foto")} alt={t("foto_alt")} position="50% 30%" />}
      />

      <section className="bg-sand py-24 md:py-36">
        <div className="site-container">
          <SectionHeading eyebrow={t("ponuka")} title={t("nadpis")} aside={t("ponuka_aside")} />

          <div className="grid gap-6 md:grid-cols-3">
            <Karta nadpis={t("miesto_nadpis")} text={t("miesto_text")} />
            <Karta nadpis={t("tvorba_nadpis")} text={t("tvorba_text")} />
            <Karta nadpis={t("cena_nadpis")} text={t("cena_text")} />
          </div>

          <Reveal className="mt-14 flex justify-center md:mt-20">
            <ButtonLink href={formular.firmy} variant="deep">
              {t("tlacidlo")}
            </ButtonLink>
          </Reveal>
        </div>
      </section>

      <Priebeh obsah={c} sekcia="pre_firmy" />
      <Fotky obsah={c} sekcia="pre_firmy" />

      {otazky.length > 0 && (
        <section className="bg-mint py-24 md:py-36">
          <div className="site-container">
            <div className="max-w-[60rem]">
              <CasteOtazky nadpis={t("otazky_nadpis")} otazky={otazky} />
            </div>
          </div>
        </section>
      )}

      <KontaktSekcia tone={otazky.length > 0 ? "sand" : "mint"} typ="firmy" />
    </>
  );
}

function Karta({ nadpis, text }: { nadpis: string; text: string }) {
  return (
    <Reveal className="rounded-card bg-mint p-8">
      <h3 className="text-h3 text-deep">{bindShortWords(nadpis)}</h3>
      <p className="mt-3 text-[15px] leading-relaxed text-ink/80">{text}</p>
    </Reveal>
  );
}
