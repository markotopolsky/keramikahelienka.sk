import Image from "next/image";
import { formatDate, type Localized } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { pageMetadata } from "@/lib/metadata";
import { clanky } from "@/content/blog";
import { PageHero } from "@/components/page-hero";
import { LocaleLink } from "@/components/ui/locale-link";
import { Reveal } from "@/components/ui/reveal";

const texty = {
  eyebrow: { sk: "Blog", en: "Blog" },
  nadpis: { sk: "Z ateliéru", en: "From the studio" },
  lead: {
    sk: "Ako vzniká keramika, krok za krokom. Píše Helenka.",
    en: "How ceramics come to life, step by step. Written by Helenka.",
  },
  citat: { sk: "Čítať", en: "Read" },
  video: { sk: "Video", en: "Video" },
} satisfies Record<string, Localized>;

export function generateMetadata() {
  return pageMetadata({
    path: "/blog",
    title: { sk: "Blog", en: "Blog" },
    description: {
      sk: "Články a videá z keramického ateliéru He-lienka: ako vzniká keramika a ako si vyrobiť šálku odlievaním.",
      en: "Posts and videos from the He-lienka ceramics studio: how ceramics are made and how to make a slip-cast cup.",
    },
  });
}

export default async function BlogPage() {
  const lang = await getLang();

  return (
    <>
      <PageHero eyebrow={texty.eyebrow[lang]} title={texty.nadpis[lang]} lead={texty.lead[lang]} />
      <section className="bg-sand py-16 md:py-28">
        <ul className="site-container grid gap-12 md:grid-cols-2 md:gap-8 lg:gap-12">
          {clanky.map((clanok, i) => (
            <Reveal as="li" key={clanok.slug} delay={i * 0.08}>
              <LocaleLink href={`/blog/${clanok.slug}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-sage">
                  <Image
                    src={clanok.foto}
                    alt={clanok.fotoAlt[lang]}
                    fill
                    preload={i === 0}
                    sizes="(min-width: 90rem) 660px, (min-width: 48rem) 46vw, calc(100vw - 2.5rem)"
                    className="object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.04]"
                  />
                  {clanok.video && (
                    <span className="absolute left-4 top-4 rounded-full bg-sand/95 px-3 py-1.5 text-[12px] font-medium text-deep">
                      {texty.video[lang]}
                    </span>
                  )}
                </div>
                <p className="eyebrow mt-6 text-drift">
                  <time dateTime={clanok.datum}>{formatDate(clanok.datum, lang)}</time>
                </p>
                <h2 className="mt-3 text-h3 text-deep">{clanok.nazov[lang]}</h2>
                <p className="mt-4 max-w-[34rem] text-base leading-relaxed text-ink/80 md:text-[17px]">{clanok.popis[lang]}</p>
                <span className="mt-5 inline-block text-[15px] font-medium text-deep underline decoration-sage underline-offset-4 transition-colors group-hover:decoration-deep">
                  {texty.citat[lang]}
                </span>
              </LocaleLink>
            </Reveal>
          ))}
        </ul>
      </section>
    </>
  );
}
