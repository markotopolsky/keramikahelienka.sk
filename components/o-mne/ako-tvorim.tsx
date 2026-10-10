import Image from "next/image";
import { bloky, citatProces } from "@/content/o-mne";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { VaseIcon } from "@/components/ui/vase-icon";

export function AkoTvorim() {
  return (
    <section className="bg-mint py-24 md:py-36">
      <div className="site-container">
        <SectionHeading
          eyebrow="Krása a úžitok"
          title="Ako tvorím"
          aside="Bez hrnčiarskeho kruhu u mňa vznikajú misy, vázy, dekorácie a pokojne aj lampy."
        />

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <Reveal as="figure" className="flex flex-col justify-between gap-12 rounded-card bg-deep p-6 text-sand md:col-span-2 md:p-8 lg:col-span-1">
            <VaseIcon className="h-16 w-auto self-start text-aqua" />
            <div>
              <blockquote className="font-display text-[24px] leading-[1.3] tracking-[-0.02em] md:text-[28px]">
                „{citatProces}“
              </blockquote>
              <figcaption className="mt-5 text-[14px] text-aqua">Z blogu Proces výroby keramiky</figcaption>
            </div>
          </Reveal>

          {bloky.map((blok, i) => (
            <Reveal as="article" key={blok.nazov} delay={(i + 1) * 0.08}>
              <div className="relative aspect-[8/9] overflow-hidden rounded-card bg-sage">
                <Image
                  src={blok.foto}
                  alt={blok.alt}
                  fill
                  sizes="(min-width: 90rem) 440px, (min-width: 64rem) 31vw, (min-width: 48rem) 47vw, calc(100vw - 2.5rem)"
                  className="object-cover"
                />
              </div>
              <h3 className="mt-6 text-[26px] leading-none tracking-[-0.02em] text-deep md:text-[30px]">{blok.nazov}</h3>
              <p className="mt-3 max-w-[26rem] text-[15px] leading-relaxed text-ink/80 md:text-base">{blok.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
