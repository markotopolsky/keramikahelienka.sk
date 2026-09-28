"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { kurzy, type Kurz } from "@/content/kurzy";
import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";
import { useMediaQuery } from "@/lib/use-media-query";

// Where the cards stick, per breakpoint (read by KurzCard):
// --stack-top  distance below the top of the viewport, clear of the fixed header
// --stack-step how much lower each following card sits, so the edges of the pile stay visible
// --stack-gap  scroll distance between two cards
const stackVars =
  "[--stack-top:5.5rem] [--stack-step:0.875rem] [--stack-gap:4rem] md:[--stack-top:7rem] md:[--stack-step:1.125rem] md:[--stack-gap:6rem] lg:[--stack-top:8rem] lg:[--stack-step:1.375rem] lg:[--stack-gap:8.75rem]";

export function KurzyStack() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // A stuck card must fit on screen. On a phone held sideways it would not, so there the cards simply scroll.
  const stacked = useMediaQuery("(min-height: 30rem)", true);

  return (
    <section className="bg-sand pb-24 pt-20 md:pb-36 md:pt-28">
      <div className="site-container">
        <div className="mb-12 flex flex-col gap-5 md:mb-20 md:flex-row md:items-end md:justify-between md:gap-10">
          <Reveal>
            <h2 className="text-h2 text-deep">Kurzy keramiky</h2>
          </Reveal>
          <Reveal delay={0.1} className="max-w-[22rem] text-[15px] leading-relaxed text-drift md:text-right">
            Pre dospelých aj deti, jednorazovo alebo pravidelne. V ateliéri Na vrátkach 1K v Dúbravke.
          </Reveal>
        </div>

        <div ref={ref} className={`relative ${stackVars}`}>
          {kurzy.map((kurz, i) => (
            <KurzCard
              key={kurz.nazov}
              kurz={kurz}
              index={i}
              total={kurzy.length}
              progress={scrollYProgress}
              stacked={stacked}
            />
          ))}
        </div>

        <Reveal className="mt-12 flex flex-col items-center gap-6 text-center md:mt-16">
          <p className="text-[15px] text-drift">Teambuilding a firemné workshopy pripravíme na mieru.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <ButtonLink href="/kurzy#rezervacia" variant="deep">
              Rezervovať kurz
            </ButtonLink>
            <ButtonLink href="/kurzy#cennik" variant="outline" className="text-deep">
              Celý cenník
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

type KurzCardProps = {
  kurz: Kurz;
  index: number;
  total: number;
  progress: MotionValue<number>;
  stacked: boolean;
};

function KurzCard({ kurz, index, total, progress, stacked }: KurzCardProps) {
  // Once a card is covered by the next one, it shrinks a little and dims,
  // so the pile reads as depth rather than a hard overlap.
  const start = index / total;
  const scale = useTransform(progress, [start, 1], [1, 1 - (total - 1 - index) * 0.035]);
  const shade = useTransform(progress, [start, 1], [0, (total - 1 - index) * 0.12]);

  return (
    <div
      className={`md:h-[480px] lg:h-[520px] ${stacked ? "sticky" : ""}`}
      style={{
        top: `calc(var(--stack-top) + ${index} * var(--stack-step))`,
        marginBottom: index === total - 1 ? 0 : "var(--stack-gap)",
      }}
    >
      {/* Phones: text above the photo. From 768px: text beside the photo, as on the template. */}
      <motion.article
        style={{ scale: stacked ? scale : 1 }}
        className="relative mx-auto flex max-w-[62rem] origin-top flex-col gap-6 overflow-hidden rounded-card bg-deep p-3 text-sand shadow-[0_24px_60px_-30px_rgb(30_43_46/0.45)] md:grid md:h-[440px] md:grid-cols-[1fr_17rem] md:p-4 lg:h-[480px] lg:grid-cols-[1fr_24rem] lg:gap-8"
      >
        <div className="flex flex-col justify-between gap-6 px-2 pt-3 md:py-5 md:pl-5 md:pr-0">
          <div>
            <h3 className="text-h3">{kurz.nazov}</h3>
            <p className="mt-3 text-[15px] text-sand/70 md:mt-4 md:text-base">{kurz.rozsah}</p>
          </div>
          <div>
            <p className="max-w-[26rem] text-[15px] leading-relaxed text-sand/90 md:text-base">{kurz.popis}</p>
            <div className="mt-5 flex items-center gap-4 md:mt-7">
              <span className="rounded-full bg-sand px-3 py-1 text-[13px] text-deep">{kurz.stitok}</span>
              <span className="font-serif text-[28px] leading-none md:text-[32px]">{kurz.cena}</span>
            </div>
          </div>
        </div>
        <div className="relative aspect-[3/2] overflow-hidden rounded-[10px] md:aspect-auto">
          <Image
            src={kurz.foto}
            alt={kurz.fotoAlt}
            fill
            sizes="(min-width: 64rem) 384px, (min-width: 48rem) 272px, calc(100vw - 4rem)"
            className="object-cover"
          />
        </div>
        <motion.div aria-hidden style={{ opacity: stacked ? shade : 0 }} className="pointer-events-none absolute inset-0 bg-ink" />
      </motion.article>
    </div>
  );
}
