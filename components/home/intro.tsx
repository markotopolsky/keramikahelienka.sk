import { bindShortWords } from "@/lib/i18n";
import { getContent } from "@/lib/content";
import { getLang } from "@/lib/i18n-server";
import { Reveal } from "@/components/ui/reveal";
import { TornEdge } from "@/components/ui/torn-edge";
import { BowlIcon, ClayIcon, FingerprintIcon } from "@/components/ui/value-icons";

// The heading's three parts, each with Helenka's own words from the original homepage and O nás page
const ikony = [ClayIcon, FingerprintIcon, BowlIcon];

export async function Intro() {
  const lang = await getLang();
  const c = await getContent("intro", lang);
  const hodnoty = ikony.map((Icon, i) => ({ Icon, nazov: c[`intro.hodnota${i + 1}_nazov`], text: c[`intro.hodnota${i + 1}_text`] }));

  return (
    <section className="bg-aqua text-ink">
      <div className="site-container pb-24 pt-24 md:pb-36 md:pt-36">
        <div className="flex flex-col items-center text-center">
          <Reveal>
            <h2 className="text-display">{bindShortWords(c["intro.nadpis"])}</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-[38rem] text-lead text-ink/85 md:mt-8">{c["intro.lead"]}</p>
          </Reveal>
        </div>

        <ul className="mt-16 grid gap-14 md:mt-24 md:grid-cols-3 md:gap-0 md:divide-x md:divide-ink/15">
          {hodnoty.map(({ Icon, nazov, text }, i) => (
            <Reveal as="li" key={i} delay={0.1 * i} className="flex flex-col items-center text-center md:px-8 lg:px-12">
              <Icon className="size-16 text-deep md:size-20" />
              <h3 className="mt-6 text-[1.625rem] leading-tight tracking-[-0.02em] md:text-[1.75rem]">{nazov}</h3>
              <p className="mt-3 max-w-[21rem] text-[15px] leading-relaxed text-ink/85 md:text-base">{text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
      <TornEdge className="-mb-px text-sand" />
    </section>
  );
}
