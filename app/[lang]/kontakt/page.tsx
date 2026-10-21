import { bindShortWords } from "@/lib/i18n";
import { getContent, getKontakt } from "@/lib/content";
import { getLang } from "@/lib/i18n-server";
import { pageMetadata } from "@/lib/metadata";
import { mapa } from "@/content/atelier";
import { PageHero } from "@/components/page-hero";
import { KontaktSekcia } from "@/components/kontakt/kontakt-sekcia";
import { Mapa } from "@/components/kontakt/mapa";
import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";

export async function generateMetadata() {
  const c = await getContent("kontakt_stranka", await getLang());
  return pageMetadata({ path: "/kontakt", title: c["kontakt_stranka.meta_titulok"], description: c["kontakt_stranka.meta_popis"] });
}

export default async function KontaktPage() {
  const lang = await getLang();
  const [c, kontakt] = await Promise.all([getContent("kontakt_stranka", lang), getKontakt()]);
  const t = (pole: string) => c[`kontakt_stranka.${pole}`];

  // TODO: question 3 for Helena. Which address is the main one, info@ or her gmail?
  const kanaly = [
    { nazov: t("telefon"), hodnota: kontakt.telefon, href: kontakt.telefonHref },
    { nazov: t("email"), hodnota: kontakt.email, href: `mailto:${kontakt.email}` },
    { nazov: t("atelier"), hodnota: `${kontakt.ulica}, ${kontakt.mesto}`, href: "#mapa" },
  ];

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("nadpis")}
        lead={t("lead")}
        aside={
          <dl className="divide-y divide-ink/15 border-y border-ink/15">
            {kanaly.map((kanal) => (
              <div key={kanal.href} className="py-5 touch:pb-3.5">
                <dt className="eyebrow text-[11px] text-ink/85">{kanal.nazov}</dt>
                <dd className="mt-2 touch:mt-0.5">
                  <a
                    href={kanal.href}
                    className="font-display text-[20px] leading-tight tracking-[-0.02em] underline-offset-4 hover:underline sm:text-[24px] touch:inline-flex touch:min-h-11 touch:items-center"
                  >
                    {kanal.hodnota}
                  </a>
                </dd>
              </div>
            ))}
          </dl>
        }
      />

      <KontaktSekcia />

      <section id="mapa" className="bg-mint py-24 md:py-36">
        <div className="site-container grid gap-12 lg:grid-cols-[1fr_2fr] lg:items-end lg:gap-16">
          <Reveal>
            <p className="eyebrow text-drift">{t("kde")}</p>
            <h2 className="mt-5 text-h2 text-deep">{bindShortWords(t("atelier_nadpis"))}</h2>
            <address className="mt-6 text-lead not-italic text-ink/80">
              {kontakt.nazov}
              <br />
              {kontakt.ulica}
              <br />
              {kontakt.mesto}
            </address>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={mapa.trasa} variant="deep" external>
                {t("trasa")}
              </ButtonLink>
              <ButtonLink href={mapa.odkaz} variant="outline" className="text-deep" external>
                Google Maps
              </ButtonLink>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <Mapa />
          </Reveal>
        </div>
      </section>
    </>
  );
}
