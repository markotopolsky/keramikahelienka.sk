import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { bindShortWords, type Localized } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { pageMetadata } from "@/lib/metadata";
import { filled, getContent, getKurzy, slots } from "@/lib/content";
import { kurzSekciaPreSlug } from "@/lib/content-defaults";
import { kurzyStranky } from "@/content/atelier";
import { PageHero, PageHeroImage } from "@/components/page-hero";
import { RichText } from "@/components/rich-text";
import { KontaktSekcia } from "@/components/kontakt/kontakt-sekcia";
import { Cennik } from "@/components/kurzy/cennik";
import { Fotky } from "@/components/kurzy/fotky";
import { Priebeh } from "@/components/kurzy/priebeh";
import { CasteOtazky, getOtazky } from "@/components/kurzy/caste-otazky";
import { ButtonLink } from "@/components/ui/button-link";
import { LocaleLink } from "@/components/ui/locale-link";
import { Reveal } from "@/components/ui/reveal";

const texty = {
  cena: { sk: "Cena", en: "Price" },
  rozsah: { sk: "Rozsah", en: "Length" },
  dalsie: { sk: "Ďalšie kurzy", en: "Other classes" },
  vsetky: { sk: "Všetky kurzy a cenník", en: "All classes and prices" },
} satisfies Record<string, Localized>;

export function generateStaticParams() {
  return kurzyStranky.map((k) => ({ slug: k.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/[lang]/kurzy/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const lang = await getLang();
  const sekcia = kurzSekciaPreSlug(slug);
  const [kurzy, c] = await Promise.all([getKurzy(lang), getContent(sekcia, lang)]);
  const kurz = kurzy.find((k) => k.slug === slug);
  if (!kurz) return {};
  return pageMetadata({ path: `/kurzy/${slug}`, title: kurz.nazov, description: c[`${sekcia}.meta_popis`], obrazok: kurz.foto });
}

/**
 * Subpage of one course card. Name, price, length and the opening photo come from the card
 * (section "kurzy_ponuka"), everything else from the course's own section in /admin.
 */
export default async function KurzPage({ params }: PageProps<"/[lang]/kurzy/[slug]">) {
  const { slug } = await params;
  const lang = await getLang();
  const sekcia = kurzSekciaPreSlug(slug);
  const [kurzy, c, stranka] = await Promise.all([getKurzy(lang), getContent(sekcia, lang), getContent("kurzy_stranka", lang)]);
  const kurz = kurzy.find((k) => k.slug === slug);
  // A card cleared in /admin takes its subpage with it
  if (!kurz) notFound();

  const t = (pole: string) => c[`${sekcia}.${pole}`] ?? "";
  const fakty = [
    { nazov: texty.cena[lang], text: kurz.cena },
    { nazov: texty.rozsah[lang], text: kurz.rozsah },
    ...slots(c, `${sekcia}.fakt`, "nazov").map((n) => ({ nazov: t(`fakt${n}_nazov`), text: t(`fakt${n}_text`) })),
  ].filter((fakt) => filled(fakt.text));
  const odkaz = filled(t("odkaz_text")) && filled(t("odkaz_href")) ? { text: t("odkaz_text"), href: t("odkaz_href") } : null;
  const sCennikom = kurzyStranky.find((k) => k.slug === slug)?.cennik ?? false;
  const otazky = getOtazky(c, sekcia);
  const ostatne = kurzy.filter((k) => k.slug && k.slug !== slug);
  const prihlasit = stranka["kurzy_stranka.tlacidlo_prihlasit"];

  return (
    <>
      <PageHero
        eyebrow={kurz.nazov}
        title={t("nadpis")}
        lead={t("lead")}
        actions={
          <>
            <ButtonLink href="#formular" variant="deep">
              {prihlasit}
            </ButtonLink>
            {odkaz && (
              <ButtonLink href={odkaz.href} variant="outline" external={odkaz.href.startsWith("http")}>
                {odkaz.text}
              </ButtonLink>
            )}
          </>
        }
        aside={<PageHeroImage src={kurz.foto} alt={kurz.fotoAlt} />}
      />

      <section className="bg-sand py-24 md:py-36">
        <div className="site-container grid gap-12 lg:grid-cols-[1fr_22rem] lg:gap-20 xl:grid-cols-[1fr_24rem]">
          <Reveal>
            <h2 className="text-h2 text-deep">{bindShortWords(t("popis_nadpis"))}</h2>
            <RichText value={t("popis_text")} className="mt-8 max-w-[40rem] space-y-5 text-[17px] leading-relaxed text-ink/85 md:mt-10" />
          </Reveal>
          <Reveal delay={0.1} className="self-start rounded-card bg-mint p-6 md:p-8">
            <dl className="divide-y divide-deep/15">
              {fakty.map((fakt, i) => (
                <div key={fakt.nazov} className="flex items-baseline justify-between gap-6 py-4 first:pt-0">
                  <dt className="text-[14px] text-drift">{fakt.nazov}</dt>
                  <dd
                    className={`text-right text-deep ${i === 0 ? "font-display text-[28px] leading-none tracking-[-0.02em]" : "text-[16px]"}`}
                  >
                    {fakt.text}
                  </dd>
                </div>
              ))}
            </dl>
            <ButtonLink href="#formular" variant="deep" className="mt-4 w-full justify-center">
              {prihlasit}
            </ButtonLink>
          </Reveal>
        </div>
      </section>

      <Priebeh obsah={c} sekcia={sekcia} />
      <Fotky obsah={c} sekcia={sekcia} />
      {sCennikom && <Cennik />}

      {/* Sand and mint keep alternating after the gallery (sand) or the price list (mint) */}
      <section className={`${sCennikom ? "bg-sand" : "bg-mint"} py-24 md:py-36`}>
        <div className="site-container grid gap-14 lg:grid-cols-[1fr_22rem] lg:gap-20 xl:grid-cols-[1fr_24rem]">
          {otazky.length > 0 ? <CasteOtazky nadpis={t("otazky_nadpis")} otazky={otazky} /> : <div />}
          <Reveal delay={0.1} as="article" className="self-start rounded-card bg-deep p-6 text-sand md:p-8">
            <h2 className="text-[26px] leading-none tracking-[-0.02em] md:text-[30px]">{texty.dalsie[lang]}</h2>
            <ul className="mt-6 border-b border-sand/15">
              {ostatne.map((k) => (
                <li key={k.slug} className="border-t border-sand/15">
                  <LocaleLink
                    href={`/kurzy/${k.slug}`}
                    className="flex min-h-11 items-baseline justify-between gap-4 py-3.5 text-[16px] transition-colors hover:text-aqua"
                  >
                    {k.nazov}
                    <span className="text-[14px] text-sand/70">{k.cena}</span>
                  </LocaleLink>
                </li>
              ))}
            </ul>
            <ButtonLink href="/kurzy" variant="light" className="mt-6">
              {texty.vsetky[lang]}
            </ButtonLink>
          </Reveal>
        </div>
      </section>

      <KontaktSekcia tone={sCennikom ? "mint" : "sand"} typ="kurzy" kurz={slug} />
    </>
  );
}
