import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { bindShortWords, type Locale, type Localized } from "@/lib/i18n";
import { getContent } from "@/lib/content";
import { PRAVNE_SLUGY, pravnaSekciaPreSlug } from "@/lib/content-defaults";
import { getLang } from "@/lib/i18n-server";
import { pageMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/page-hero";
import { RichText } from "@/components/rich-text";

const texty = {
  eyebrow: { sk: "Právne informácie", en: "Legal information" },
  vzor: { sk: "Návrh podľa platných zákonov – pred spustením ho skontroluje právnik", en: "Draft based on current Slovak law – a lawyer checks it before launch" },
  vzorDetail: {
    sk: "Údaje v žltom ešte chýbajú, doplní ich Helenka.",
    en: "Data highlighted in yellow is still missing; Helena will supply it.",
  },
} satisfies Record<string, Localized>;

async function nacitaj(slug: string, lang: Locale) {
  if (!PRAVNE_SLUGY.includes(slug)) notFound();
  const sekcia = pravnaSekciaPreSlug(slug);
  const c = await getContent(sekcia, lang);
  return { nazov: c[`${sekcia}.nazov`], uvod: c[`${sekcia}.uvod`], text: c[`${sekcia}.text`] };
}

/** The legal text from /admin split into numbered sections: each "## heading" line starts one */
function rozdelit(text: string) {
  const [pred, ...casti] = text.split(/^## /m);
  return {
    pred: pred.trim(),
    sekcie: casti.map((cast) => {
      const [nadpis, ...telo] = cast.split("\n");
      return { nadpis: nadpis.trim(), telo: telo.join("\n").trim() };
    }),
  };
}

export async function pravnaMetadata(slug: string): Promise<Metadata> {
  const stranka = await nacitaj(slug, await getLang());
  return {
    ...(await pageMetadata({ path: `/${slug}`, title: stranka.nazov, description: stranka.uvod })),
    // Sample text must not end up in search results
    robots: { index: false, follow: true },
  };
}

const telo = "space-y-4 text-base leading-relaxed text-ink/85 md:text-[17px]";

/** One legal page: title, the "sample text" bar and numbered sections. */
export async function PravnaStrankaObsah({ slug }: { slug: string }) {
  const lang = await getLang();
  const stranka = await nacitaj(slug, lang);
  const { pred, sekcie } = rozdelit(stranka.text);

  return (
    <>
      <PageHero eyebrow={texty.eyebrow[lang]} title={stranka.nazov} lead={stranka.uvod} />

      <div role="note" className="border-y border-drift/30 bg-note">
        <div className="site-container flex flex-col gap-1 py-4 text-ink sm:flex-row sm:items-baseline sm:gap-4">
          <p className="font-medium">{texty.vzor[lang]}</p>
          <p className="text-[14px] text-ink/75">{texty.vzorDetail[lang]}</p>
        </div>
      </div>

      <article className="bg-sand py-16 md:py-24">
        <div className="site-container">
          {pred && <RichText value={pred} className={`mb-12 max-w-[52rem] ${telo}`} />}
          <ol className="max-w-[52rem] space-y-12 md:space-y-14">
            {sekcie.map((sekcia, i) => (
              <li key={i} className="grid gap-4 md:grid-cols-[3rem_1fr] md:gap-6">
                <span aria-hidden className="font-display text-[28px] leading-none tracking-[-0.02em] text-sea">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h2 className="text-[26px] leading-tight tracking-[-0.02em] text-deep md:text-[30px]">{bindShortWords(sekcia.nadpis)}</h2>
                  <RichText value={sekcia.telo} className={`mt-4 ${telo}`} />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </article>
    </>
  );
}
