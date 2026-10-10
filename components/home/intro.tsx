import type { Localized } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { Reveal } from "@/components/ui/reveal";
import { TornEdge } from "@/components/ui/torn-edge";
import { BowlIcon, ClayIcon, FingerprintIcon } from "@/components/ui/value-icons";

const texty = {
  nadpis: { sk: "Z hliny, rukami, bez kruhu.", en: "From clay, by hand, no wheel." },
  lead: { sk: "Mojou veľkou vášňou sú dizajnové kúsky pre domov.", en: "My great passion is design pieces for the home." },
} satisfies Record<string, Localized>;

// The heading's three parts, each with Helenka's own words from the original homepage and O nás page
const hodnoty: { Icon: typeof ClayIcon; nazov: Localized; text: Localized }[] = [
  {
    Icon: ClayIcon,
    nazov: { sk: "Z hliny", en: "From clay" },
    text: {
      sk: "Je to úžasný pocit, keď hlina dostáva tvar a prostredníctvom vzduchu a ohňa sa mení v trvácu podobu.",
      en: "It is a wonderful feeling when clay takes shape and, through air and fire, turns into something lasting.",
    },
  },
  {
    Icon: FingerprintIcon,
    nazov: { sk: "Rukami", en: "By hand" },
    text: {
      sk: "Každé dielo vzniká ručne. Obsahuje kúsok duše tvorcu, ktorý ho s láskou vytvoril.",
      en: "Every piece is made by hand. It holds a bit of the soul of the maker who created it with love.",
    },
  },
  {
    Icon: BowlIcon,
    nazov: { sk: "Bez kruhu", en: "No wheel" },
    text: {
      sk: "Misy, vázy, dekorácie aj lampy modelujem bez hrnčiarskeho kruhu. Každý kúsok má neopakovateľný tvar a svoj príbeh.",
      en: "I build bowls, vases, decorations and lamps without a potter’s wheel. Every piece has a shape that cannot be repeated, and its own story.",
    },
  },
];

export async function Intro() {
  const lang = await getLang();

  return (
    <section className="bg-deep text-sand">
      <div className="site-container pb-24 pt-24 md:pb-36 md:pt-36">
        <div className="flex flex-col items-center text-center">
          <Reveal>
            <h2 className="text-display">{texty.nadpis[lang]}</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-[38rem] text-lead text-sand/90 md:mt-8">{texty.lead[lang]}</p>
          </Reveal>
        </div>

        <ul className="mt-16 grid gap-14 md:mt-24 md:grid-cols-3 md:gap-0 md:divide-x md:divide-sand/15">
          {hodnoty.map(({ Icon, nazov, text }, i) => (
            <Reveal as="li" key={nazov.sk} delay={0.1 * i} className="flex flex-col items-center text-center md:px-8 lg:px-12">
              <Icon className="size-16 text-aqua md:size-20" />
              <h3 className="mt-6 text-[1.625rem] leading-tight tracking-[-0.02em] md:text-[1.75rem]">{nazov[lang]}</h3>
              <p className="mt-3 max-w-[21rem] text-[15px] leading-relaxed text-sand/90 md:text-base">{text[lang]}</p>
            </Reveal>
          ))}
        </ul>
      </div>
      <TornEdge className="-mb-px text-sand" />
    </section>
  );
}
