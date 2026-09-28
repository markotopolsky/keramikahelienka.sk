"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { diela, type Dielo } from "@/content/diela";
import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";

const COLUMNS = 4;
// Every column gets one tall, one medium and one square photo in a different order,
// so the columns end level while the grid still looks hand-arranged.
const shapes = [
  ["aspect-[3/4]", "aspect-[4/5]", "aspect-square"],
  ["aspect-square", "aspect-[3/4]", "aspect-[4/5]"],
  ["aspect-[4/5]", "aspect-square", "aspect-[3/4]"],
  ["aspect-[3/4]", "aspect-square", "aspect-[4/5]"],
];

export function DielaGrid() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // Even columns drift against the scroll for a gentle, gallery-wall parallax
  const drift = useTransform(scrollYProgress, [0, 1], [70, -70]);

  const columns = Array.from({ length: COLUMNS }, (_, c) => diela.filter((_, i) => i % COLUMNS === c));

  return (
    <section ref={ref} className="bg-mint pb-40 pt-32">
      <div className="site-container">
        <div className="mb-20 flex items-end justify-between gap-10">
          <Reveal>
            <p className="eyebrow mb-5 text-drift">Z ateliéru</p>
            <h2 className="text-h2 text-deep">Každý kus existuje len raz</h2>
          </Reveal>
          <Reveal delay={0.1} className="flex max-w-[24rem] flex-col items-end gap-6 text-right">
            <p className="text-[15px] leading-relaxed text-drift">
              Misy, vázy, lampy a art objekty. Každý výrobok je robený ručne, čo mu dáva výnimočný charakter.
            </p>
            <ButtonLink href="/obchod" variant="deep">
              Celý obchod
            </ButtonLink>
          </Reveal>
        </div>

        <div className="grid grid-cols-4 items-start gap-5">
          {columns.map((items, c) => (
            <motion.ul key={c} style={c % 2 === 1 ? { y: drift } : undefined} className="flex flex-col gap-8">
              {items.map((dielo, row) => (
                <Reveal as="li" key={dielo.foto} delay={c * 0.08}>
                  <DieloCard dielo={dielo} shape={shapes[c][row]} />
                </Reveal>
              ))}
            </motion.ul>
          ))}
        </div>
      </div>
    </section>
  );
}

function DieloCard({ dielo, shape }: { dielo: Dielo; shape: string }) {
  return (
    <Link href="/obchod" className="group block">
      <div className={`relative overflow-hidden rounded-card bg-sage ${shape}`}>
        <Image
          src={dielo.foto}
          alt={dielo.nazov}
          fill
          sizes="330px"
          style={dielo.fokus ? { objectPosition: dielo.fokus } : undefined}
          className="object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.05]"
        />
        <span className="absolute bottom-3 right-3 translate-y-2 rounded-full bg-sand/95 px-3 py-1.5 text-[13px] text-deep opacity-0 transition duration-500 ease-soft group-hover:translate-y-0 group-hover:opacity-100">
          Pozrieť v obchode
        </span>
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-4 px-0.5">
        <div>
          <p className="eyebrow text-[11px] text-drift">{dielo.kategoria}</p>
          <p className="mt-1 font-serif text-[22px] leading-tight text-ink">{dielo.nazov}</p>
        </div>
        <p className="shrink-0 text-[15px] text-deep">{dielo.cena}</p>
      </div>
    </Link>
  );
}
