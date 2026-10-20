import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Localized } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { pageMetadata } from "@/lib/metadata";
import { pravneStranky, type Blok } from "@/content/pravne";
import { PageHero } from "@/components/page-hero";
import { Doplnit } from "@/components/ui/doplnit";

const texty = {
  eyebrow: { sk: "Právne informácie", en: "Legal information" },
  vzor: { sk: "Návrh podľa platných zákonov – pred spustením ho skontroluje právnik", en: "Draft based on current Slovak law – a lawyer checks it before launch" },
  vzorDetail: {
    sk: "Údaje v žltom ešte chýbajú, doplní ich Helenka.",
    en: "Data highlighted in yellow is still missing; Helena will supply it.",
  },
} satisfies Record<string, Localized>;

function najdi(slug: string) {
  const stranka = pravneStranky.find((s) => s.slug === slug);
  if (!stranka) notFound();
  return stranka;
}

export async function pravnaMetadata(slug: string): Promise<Metadata> {
  const stranka = najdi(slug);
  return {
    ...(await pageMetadata({ path: `/${slug}`, title: stranka.nazov, description: stranka.uvod })),
    // Sample text must not end up in search results
    robots: { index: false, follow: true },
  };
}

/** Renders "[[IČO]]" in a text as a visible "doplniť" gap */
function Text({ children }: { children: string }) {
  return children.split(/\[\[(.+?)\]\]/).map((cast, i) => (i % 2 === 1 ? <Doplnit key={i}>{cast}</Doplnit> : cast));
}

function BlokTextu({ blok }: { blok: Blok }) {
  if (typeof blok === "string")
    return (
      <p>
        <Text>{blok}</Text>
      </p>
    );
  return (
    <ul className="list-disc space-y-2 pl-5 marker:text-sea">
      {blok.zoznam.map((polozka) => (
        <li key={polozka}>
          <Text>{polozka}</Text>
        </li>
      ))}
    </ul>
  );
}

/** One legal page: title, the "sample text" bar and numbered sections. */
export async function PravnaStrankaObsah({ slug }: { slug: string }) {
  const lang = await getLang();
  const stranka = najdi(slug);

  return (
    <>
      <PageHero eyebrow={texty.eyebrow[lang]} title={stranka.nazov[lang]} lead={stranka.uvod[lang]} />

      <div role="note" className="border-y border-drift/30 bg-note">
        <div className="site-container flex flex-col gap-1 py-4 text-ink sm:flex-row sm:items-baseline sm:gap-4">
          <p className="font-medium">{texty.vzor[lang]}</p>
          <p className="text-[14px] text-ink/75">{texty.vzorDetail[lang]}</p>
        </div>
      </div>

      <article className="bg-sand py-16 md:py-24">
        <div className="site-container">
          <ol className="max-w-[52rem] space-y-12 md:space-y-14">
            {stranka.sekcie[lang].map((sekcia, i) => (
              <li key={sekcia.nadpis} className="grid gap-4 md:grid-cols-[3rem_1fr] md:gap-6">
                <span aria-hidden className="font-display text-[28px] leading-none tracking-[-0.02em] text-sea">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h2 className="text-[26px] leading-tight tracking-[-0.02em] text-deep md:text-[30px]">{sekcia.nadpis}</h2>
                  <div className="mt-4 space-y-4 text-base leading-relaxed text-ink/85 md:text-[17px]">
                    {sekcia.bloky.map((blok, j) => (
                      <BlokTextu key={j} blok={blok} />
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </article>
    </>
  );
}
