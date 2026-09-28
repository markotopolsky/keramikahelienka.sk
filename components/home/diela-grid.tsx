"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { diela, type Dielo } from "@/content/diela";
import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";
import { useMediaQuery } from "@/lib/use-media-query";

const T = "aspect-[3/4]"; // tall
const M = "aspect-[4/5]"; // medium
const S = "aspect-square";

// Every column gets the same mix of tall, medium and square photos in a different order,
// so the columns end level while the grid still looks hand-arranged.
// One layout per column count: 2 on phones, 3 on tablets, 4 on desktop.
const shapes: Record<number, string[][]> = {
  2: [
    [T, M, S, T, S, M],
    [M, S, T, S, M, T],
  ],
  3: [
    [T, M, S, M],
    [M, S, M, T],
    [S, M, T, M],
  ],
  4: [
    [T, M, S],
    [S, T, M],
    [M, S, T],
    [T, S, M],
  ],
};

export function DielaGrid() {
  const ref = useRef<HTMLElement>(null);
  const isTablet = useMediaQuery("(min-width: 48rem)", true);
  const isDesktop = useMediaQuery("(min-width: 64rem)", true);
  const count = isDesktop ? 4 : isTablet ? 3 : 2;

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // Even columns drift against the scroll for a gentle, gallery-wall parallax
  const range = count === 2 ? 40 : 70;
  const drift = useTransform(scrollYProgress, [0, 1], [range, -range]);

  const columns = Array.from({ length: count }, (_, c) => diela.filter((_, i) => i % count === c));

  return (
    <section ref={ref} className="bg-mint pb-28 pt-20 md:pb-40 md:pt-32">
      <div className="site-container">
        <div className="mb-12 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between md:gap-10">
          <Reveal>
            <p className="eyebrow mb-5 text-drift">Z ateliéru</p>
            <h2 className="text-h2 text-deep">Každý kus existuje len raz</h2>
          </Reveal>
          <Reveal delay={0.1} className="flex max-w-[24rem] flex-col items-start gap-6 md:items-end md:text-right">
            <p className="text-[15px] leading-relaxed text-drift">
              Misy, vázy, lampy a art objekty. Každý výrobok je robený ručne, čo mu dáva výnimočný charakter.
            </p>
            <ButtonLink href="/obchod" variant="deep">
              Celý obchod
            </ButtonLink>
          </Reveal>
        </div>

        <div className="grid items-start gap-3 sm:gap-5" style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}>
          {columns.map((items, c) => (
            <motion.ul key={c} style={c % 2 === 1 ? { y: drift } : undefined} className="flex flex-col gap-6 md:gap-8">
              {items.map((dielo, row) => (
                <Reveal as="li" key={dielo.foto} delay={c * 0.08}>
                  <DieloCard dielo={dielo} shape={shapes[count][c][row]} />
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
          sizes="(min-width: 90rem) 330px, (min-width: 64rem) 23vw, (min-width: 48rem) 31vw, 47vw"
          style={dielo.fokus ? { objectPosition: dielo.fokus } : undefined}
          className="object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.05]"
        />
        <span className="absolute bottom-3 right-3 translate-y-2 rounded-full bg-sand/95 px-3 py-1.5 text-[13px] text-deep opacity-0 transition duration-500 ease-soft group-hover:translate-y-0 group-hover:opacity-100">
          Pozrieť v obchode
        </span>
      </div>
      {/* Two columns on a phone are too narrow for name and price side by side */}
      <div className="mt-3 flex flex-col gap-1 px-0.5 md:flex-row md:items-baseline md:justify-between md:gap-4">
        <div>
          <p className="eyebrow text-[11px] text-drift">{dielo.kategoria}</p>
          <p className="mt-1 font-serif text-[19px] leading-tight text-ink md:text-[22px]">{dielo.nazov}</p>
        </div>
        <p className="shrink-0 text-[15px] text-deep">{dielo.cena}</p>
      </div>
    </Link>
  );
}
