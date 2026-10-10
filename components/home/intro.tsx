import { Reveal } from "@/components/ui/reveal";
import { TornEdge } from "@/components/ui/torn-edge";
import { BowlIcon, ClayIcon, FingerprintIcon } from "@/components/ui/value-icons";

// The heading's three parts, each with Helenka's own words from the original homepage and O nás page
const hodnoty = [
  {
    Icon: ClayIcon,
    nazov: "Z hliny",
    text: "Je to úžasný pocit, keď hlina dostáva tvar a prostredníctvom vzduchu a ohňa sa mení v trvácu podobu.",
  },
  {
    Icon: FingerprintIcon,
    nazov: "Rukami",
    text: "Každé dielo vzniká ručne. Obsahuje kúsok duše tvorcu, ktorý ho s láskou vytvoril.",
  },
  {
    Icon: BowlIcon,
    nazov: "Bez kruhu",
    text: "Misy, vázy, dekorácie aj lampy modelujem bez hrnčiarskeho kruhu. Každý kúsok má neopakovateľný tvar a svoj príbeh.",
  },
];

export function Intro() {
  return (
    <section className="bg-deep text-sand">
      <div className="site-container pb-24 pt-24 md:pb-36 md:pt-36">
        <div className="flex flex-col items-center text-center">
          <Reveal>
            <h2 className="text-display">Z hliny, rukami, bez kruhu.</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-[38rem] text-lead text-sand/90 md:mt-8">
              Mojou veľkou vášňou sú dizajnové kúsky pre domov.
            </p>
          </Reveal>
        </div>

        <ul className="mt-16 grid gap-14 md:mt-24 md:grid-cols-3 md:gap-0 md:divide-x md:divide-sand/15">
          {hodnoty.map(({ Icon, nazov, text }, i) => (
            <Reveal as="li" key={nazov} delay={0.1 * i} className="flex flex-col items-center text-center md:px-8 lg:px-12">
              <Icon className="size-16 text-aqua md:size-20" />
              <h3 className="mt-6 text-[1.625rem] leading-tight tracking-[-0.02em] md:text-[1.75rem]">{nazov}</h3>
              <p className="mt-3 max-w-[21rem] text-[15px] leading-relaxed text-sand/90 md:text-base">{text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
      <TornEdge className="-mb-px text-sand" />
    </section>
  );
}
