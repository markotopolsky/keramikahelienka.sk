"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import type { Localized } from "@/lib/i18n";
import { formular } from "@/content/atelier";
import { kurzy, type Kurz } from "@/content/kurzy";
import { useLang } from "@/components/locale-provider";
import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";
import { useMediaQuery } from "@/lib/use-media-query";

// Where the cards stick, per breakpoint (read by KurzCard):
// --stack-top  distance below the top of the viewport, clear of the fixed header
// --stack-step how much lower each following card sits, so the edges of the pile stay visible
// --stack-gap  scroll distance between two cards
const stackVars =
  "[--stack-top:5.5rem] [--stack-step:0.875rem] [--stack-gap:4rem] md:[--stack-top:7rem] md:[--stack-step:1.125rem] md:[--stack-gap:6rem] lg:[--stack-top:8rem] lg:[--stack-step:1.375rem] lg:[--stack-gap:8.75rem]";

const texty = {
  nadpis: { sk: "Kurzy keramiky", en: "Pottery classes" },
  aside: {
    sk: "Pre dospelých aj deti, jednorazovo alebo pravidelne. V ateliéri Na vrátkach 1K v Dúbravke.",
    en: "For adults and children, one-off or regular. In the studio at Na vrátkach 1K in Dúbravka.",
  },
  teambuilding: { sk: "Teambuilding a firemné workshopy pripravíme na mieru.", en: "We tailor team building and company workshops to you." },
  rezervovat: { sk: "Rezervovať kurz", en: "Book a class" },
  cennik: { sk: "Celý cenník", en: "Full price list" },
} satisfies Record<string, Localized>;

type KurzyStackProps = {
  title?: Localized;
  aside?: Localized;
  /** The links to the price list under the cards; off on /kurzy, where the price list follows right away */
  links?: boolean;
};

export function KurzyStack({ title = texty.nadpis, aside = texty.aside, links = true }: KurzyStackProps) {
  const lang = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // A stuck card must fit on screen. On a phone held sideways it would not, so there the cards simply scroll.
  const stacked = useMediaQuery("(min-height: 30rem)", true);

  return (
    <section className="bg-sand pb-24 pt-20 md:pb-36 md:pt-28">
      <div className="site-container">
        <div className="mb-12 flex flex-col gap-5 md:mb-20 md:flex-row md:items-end md:justify-between md:gap-10">
          <Reveal>
            <h2 className="text-h2 text-deep">{title[lang]}</h2>
          </Reveal>
          <Reveal delay={0.1} className="max-w-[22rem] text-[15px] leading-relaxed text-drift md:text-right">
            {aside[lang]}
          </Reveal>
        </div>

        <div ref={ref} className={`relative ${stackVars}`}>
          {kurzy.map((kurz, i) => (
            <KurzCard
              key={kurz.foto}
              kurz={kurz}
              index={i}
              total={kurzy.length}
              progress={scrollYProgress}
              stacked={stacked}
            />
          ))}
        </div>

        {links && (
          <Reveal className="mt-12 flex flex-col items-center gap-6 text-center md:mt-16">
            <p className="text-[15px] text-drift">{texty.teambuilding[lang]}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <ButtonLink href={formular.kurzy} variant="deep">
                {texty.rezervovat[lang]}
              </ButtonLink>
              <ButtonLink href="/kurzy#cennik" variant="outline" className="text-deep">
                {texty.cennik[lang]}
              </ButtonLink>
            </div>
          </Reveal>
        )}
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
  const lang = useLang();
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
            <h3 className="text-h3">{kurz.nazov[lang]}</h3>
            <p className="mt-3 text-[15px] text-sand/70 md:mt-4 md:text-base">{kurz.rozsah[lang]}</p>
          </div>
          <div>
            <p className="max-w-[26rem] text-[15px] leading-relaxed text-sand/90 md:text-base">{kurz.popis[lang]}</p>
            <div className="mt-5 flex items-center gap-4 md:mt-7">
              <span className="rounded-full bg-sand px-3 py-1 text-[13px] text-deep">{kurz.stitok[lang]}</span>
              <span className="font-display text-[28px] leading-none md:text-[32px]">{kurz.cena[lang]}</span>
            </div>
          </div>
        </div>
        <div className="relative aspect-[3/2] overflow-hidden rounded-[10px] md:aspect-auto">
          <Image
            src={kurz.foto}
            alt={kurz.fotoAlt[lang]}
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
