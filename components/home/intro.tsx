import type { Localized } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { Reveal } from "@/components/ui/reveal";
import { TornEdge } from "@/components/ui/torn-edge";
import { VaseIcon } from "@/components/ui/vase-icon";

const texty = {
  nadpis: { sk: "Z hliny, rukami, bez kruhu.", en: "From clay, by hand, no wheel." },
  odseky: {
    sk: [
      "Mojou veľkou vášňou sú dizajnové kúsky pre domov. Bez hrnčiarskeho kruhu u mňa vznikajú misy, vázy, dekorácie a pokojne aj lampy.",
      "Každý kúsok je jedinečný. Každý má neopakovateľný tvar a svoj príbeh.",
    ],
    en: [
      "My great passion is design pieces for the home. Without a potter’s wheel I make bowls, vases, decorations and even lamps.",
      "Every piece is unique. Each has a shape that cannot be repeated, and its own story.",
    ],
  } satisfies Localized<string[]>,
};

export async function Intro() {
  const lang = await getLang();

  return (
    <section className="bg-deep text-sand">
      <div className="site-container flex flex-col items-center pb-24 pt-24 text-center md:pb-40 md:pt-36">
        <Reveal>
          <VaseIcon className="h-20 w-auto text-aqua md:h-24" />
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-8 text-display md:mt-10">{texty.nadpis[lang]}</h2>
        </Reveal>
        <Reveal delay={0.2} className="mt-8 max-w-[38rem] space-y-5 text-lead text-sand/90 md:mt-10">
          {texty.odseky[lang].map((odsek) => (
            <p key={odsek}>{odsek}</p>
          ))}
        </Reveal>
      </div>
      <TornEdge className="-mb-px text-sand" />
    </section>
  );
}
