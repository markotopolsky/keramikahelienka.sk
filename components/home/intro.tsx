import { Reveal } from "@/components/ui/reveal";
import { TornEdge } from "@/components/ui/torn-edge";
import { VaseIcon } from "@/components/ui/vase-icon";

export function Intro() {
  return (
    <section className="bg-deep text-sand">
      <div className="site-container flex flex-col items-center pb-40 pt-36 text-center">
        <Reveal>
          <VaseIcon className="h-24 w-auto text-aqua" />
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-10 text-display">Z hliny, rukami, bez kruhu.</h2>
        </Reveal>
        <Reveal delay={0.2} className="mt-10 max-w-[38rem] space-y-5 text-lead text-sand/90">
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
