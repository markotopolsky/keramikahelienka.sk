import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { formatDate, type Localized } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { pageMetadata } from "@/lib/metadata";
import { clanky } from "@/content/blog";
import { PageHero } from "@/components/page-hero";
import { Video } from "@/components/blog/video";
import { ButtonLink } from "@/components/ui/button-link";
import { LocaleLink } from "@/components/ui/locale-link";

const texty = {
  autor: { sk: "Helenka", en: "Helenka" },
  vsetky: { sk: "Všetky články", en: "All posts" },
  dalsi: { sk: "Ďalší článok", en: "Next post" },
  vyskusat: { sk: "Vyskúšajte si to v ateliéri", en: "Try it in the studio" },
  vyskusatText: {
    sk: "Lepšie je raz vidieť ako raz počuť. Príďte si to vyskúšať na vlastnej koži v našom ateliéri.",
    en: "Seeing is better than hearing. Come and try it yourself in our studio.",
  },
  kurzy: { sk: "Kurzy keramiky", en: "Pottery classes" },
} satisfies Record<string, Localized>;

export function generateStaticParams() {
  return clanky.map((c) => ({ slug: c.slug }));
}

// Any other value is a 404 (app/global-not-found.tsx)
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/[lang]/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const clanok = clanky.find((c) => c.slug === slug);
  if (!clanok) return {};
  return pageMetadata({ path: `/blog/${slug}`, title: clanok.nazov, description: clanok.popis });
}

export default async function ClanokPage({ params }: PageProps<"/[lang]/blog/[slug]">) {
  const { slug } = await params;
  const clanok = clanky.find((c) => c.slug === slug);
  if (!clanok) notFound();
  const lang = await getLang();
  const dalsi = clanky.find((c) => c.slug !== slug);

  return (
    <>
      <PageHero
        eyebrow={`${formatDate(clanok.datum, lang)} · ${texty.autor[lang]}`}
        title={clanok.nazov[lang]}
      />

      <article className="bg-sand py-16 md:py-24">
        <div className="site-container">
          <div className="mx-auto max-w-[44rem]">
            {clanok.video ? (
              <Video id={clanok.video} nazov={clanok.nazov[lang]} />
            ) : (
              <div className="relative aspect-[3/2] overflow-hidden rounded-card bg-sage">
                <Image
                  src={clanok.foto}
                  alt={clanok.fotoAlt[lang]}
                  fill
                  preload
                  sizes="(min-width: 48rem) 704px, calc(100vw - 2.5rem)"
                  className="object-cover"
                />
              </div>
            )}

            <div className="mt-10 space-y-5 text-base leading-relaxed text-ink/85 md:mt-14 md:text-[18px] md:leading-[1.7]">
              {clanok.odseky[lang].map((odsek, i) => (
                <p key={i} className={i === 0 ? "font-display text-[22px] leading-[1.4] tracking-[-0.01em] text-deep md:text-[26px]" : ""}>
                  {odsek}
                </p>
              ))}
            </div>

            <nav className="mt-14 flex flex-col gap-4 border-t border-sage pt-8 text-[15px] sm:flex-row sm:items-center sm:justify-between">
              <LocaleLink href="/blog" className="text-deep underline decoration-sage underline-offset-4 hover:decoration-deep">
                {texty.vsetky[lang]}
              </LocaleLink>
              {dalsi && (
                <LocaleLink href={`/blog/${dalsi.slug}`} className="text-deep sm:text-right">
                  <span className="eyebrow block text-[11px] text-drift">{texty.dalsi[lang]}</span>
                  <span className="mt-1 block font-display text-[20px] leading-tight tracking-[-0.01em] hover:underline">
                    {dalsi.nazov[lang]}
                  </span>
                </LocaleLink>
              )}
            </nav>
          </div>
        </div>
      </article>

      <section className="bg-mint py-20 md:py-28">
        <div className="site-container flex flex-col items-center text-center">
          <h2 className="text-h2 text-deep">{texty.vyskusat[lang]}</h2>
          <p className="mt-5 max-w-[32rem] text-lead text-ink/80">{texty.vyskusatText[lang]}</p>
          <ButtonLink href="/kurzy" variant="deep" className="mt-8">
            {texty.kurzy[lang]}
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
