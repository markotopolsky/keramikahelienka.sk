import { Reveal } from "@/components/ui/reveal";
import { TornEdge } from "@/components/ui/torn-edge";
import { VaseIcon } from "@/components/ui/vase-icon";

export function Intro() {
  return (
    <section className="bg-deep text-sand">
      <div className="site-container flex flex-col items-center pb-24 pt-24 text-center md:pb-40 md:pt-36">
        <Reveal>
          <VaseIcon className="h-20 w-auto text-aqua md:h-24" />
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-8 text-display md:mt-10">Z hliny, rukami, bez kruhu.</h2>
        </Reveal>
        <Reveal delay={0.2} className="mt-8 max-w-[38rem] space-y-5 text-lead text-sand/90 md:mt-10">
          <p>
            Mojou veľkou vášňou sú dizajnové kúsky pre domov. Bez hrnčiarskeho kruhu u mňa vznikajú misy, vázy,
            dekorácie a pokojne aj lampy.
          </p>
          <p>Každý kúsok je jedinečný. Každý má neopakovateľný tvar a svoj príbeh.</p>
        </Reveal>
      </div>
      <TornEdge className="-mb-px text-sand" />
    </section>
  );
}
