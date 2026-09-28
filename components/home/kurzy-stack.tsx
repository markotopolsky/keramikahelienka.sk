"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { kurzy, type Kurz } from "@/content/kurzy";
import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";

const STICKY_TOP = 128; // px below the fixed header
const STEP = 22; // px each following card sits lower, so the stack edges stay visible

export function KurzyStack() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <section className="bg-sand pb-36 pt-28">
      <div className="site-container">
        <div className="mb-20 flex items-end justify-between gap-10">
          <Reveal>
            <h2 className="text-h2 text-deep">Kurzy keramiky</h2>
          </Reveal>
          <Reveal delay={0.1} className="max-w-[22rem] text-right text-[15px] leading-relaxed text-drift">
            Pre dospelých aj deti, jednorazovo alebo pravidelne. V ateliéri Na vrátkach 1K v Dúbravke.
          </Reveal>
        </div>

        <div ref={ref} className="relative">
          {kurzy.map((kurz, i) => (
            <KurzCard key={kurz.nazov} kurz={kurz} index={i} total={kurzy.length} progress={scrollYProgress} />
          ))}
        </div>

        <Reveal className="mt-16 flex flex-col items-center gap-6 text-center">
          <p className="text-[15px] text-drift">Teambuilding a firemné workshopy pripravíme na mieru.</p>
          <div className="flex gap-3">
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
};

function KurzCard({ kurz, index, total, progress }: KurzCardProps) {
  // Once a card is covered by the next one, it shrinks a little and dims,
  // so the pile reads as depth rather than a hard overlap.
  const start = index / total;
  const scale = useTransform(progress, [start, 1], [1, 1 - (total - 1 - index) * 0.035]);
  const shade = useTransform(progress, [start, 1], [0, (total - 1 - index) * 0.12]);

  return (
    <div className="sticky h-[520px]" style={{ top: STICKY_TOP + index * STEP, marginBottom: index === total - 1 ? 0 : 140 }}>
      <motion.article
        style={{ scale }}
        className="relative mx-auto grid h-[480px] max-w-[62rem] origin-top grid-cols-[1fr_24rem] gap-8 overflow-hidden rounded-card bg-deep p-4 text-sand shadow-[0_24px_60px_-30px_rgb(30_43_46/0.45)]"
      >
        <div className="flex flex-col justify-between py-5 pl-5">
          <div>
            <h3 className="text-h3">{kurz.nazov}</h3>
            <p className="mt-4 text-sand/70">{kurz.rozsah}</p>
          </div>
          <div>
            <p className="max-w-[26rem] leading-relaxed text-sand/90">{kurz.popis}</p>
            <div className="mt-7 flex items-center gap-4">
              <span className="rounded-full bg-sand px-3 py-1 text-[13px] text-deep">{kurz.stitok}</span>
              <span className="font-serif text-[32px] leading-none">{kurz.cena}</span>
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-[10px]">
          <Image src={kurz.foto} alt={kurz.fotoAlt} fill sizes="384px" className="object-cover" />
        </div>
        <motion.div aria-hidden style={{ opacity: shade }} className="pointer-events-none absolute inset-0 bg-ink" />
      </motion.article>
    </div>
  );
}
