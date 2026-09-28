"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";

const fakty = ["Vlastný ateliér od roku 2020", "Kurzy pre dospelých aj deti", "Tvorba bez hrnčiarskeho kruhu"];

export function OMne() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const leftY = useTransform(scrollYProgress, [0, 1], [120, -120]);
  const rightY = useTransform(scrollYProgress, [0, 1], [60, -180]);
  const leftRotate = useTransform(scrollYProgress, [0, 1], [-10, 6]);
  const rightRotate = useTransform(scrollYProgress, [0, 1], [8, -8]);

  return (
    <section ref={ref} className="overflow-x-clip bg-sand">
      <div className="site-container pt-20 text-center md:pt-32">
        <Reveal>
          <p className="eyebrow text-drift">O mne</p>
          <h2 className="mx-auto mt-5 max-w-[48rem] text-h2 text-deep">Som Helenka a z hliny tvorím krásu a drobné radosti.</h2>
        </Reveal>
      </div>

      <div className="relative mt-12 md:mt-16">
        {/* Lower half of the portrait sits on the teal band */}
        <div className="absolute inset-x-0 bottom-0 top-1/2 bg-deep" />

        <motion.div
          className="relative z-10 mx-auto aspect-[18/25] w-[min(360px,68vw)] overflow-hidden rounded-[50%] border-[6px] border-sand shadow-[0_30px_80px_-40px_rgb(30_43_46/0.6)]"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "0px 0px -15% 0px" }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src="/images/helena-2.jpg"
            alt="Helena Sochnová v ateliéri"
            fill
            sizes="(min-width: 33rem) 360px, 68vw"
            className="object-cover object-[50%_30%]"
          />
        </motion.div>

        {/* Two pieces float beside the portrait; on phones they shrink and overlap its edges */}
        <motion.div
          style={{ y: leftY, rotate: leftRotate }}
          className="absolute bottom-6 left-[3%] z-10 size-24 overflow-hidden rounded-full border-4 border-sand/80 sm:left-[8%] sm:size-32 md:bottom-10 lg:left-[12%] lg:size-44"
        >
          <Image src="/images/variabilna.jpg" alt="" fill sizes="(min-width: 64rem) 176px, 128px" className="scale-125 object-cover" />
        </motion.div>
        <motion.div
          style={{ y: rightY, rotate: rightRotate }}
          className="absolute bottom-0 right-[3%] z-10 h-32 w-[5.5rem] overflow-hidden rounded-[45%] border-4 border-sand/80 sm:right-[9%] sm:h-40 sm:w-28 lg:right-[13%] lg:h-52 lg:w-36"
        >
          <Image src="/images/diela/raku-nadoba.jpg" alt="" fill sizes="(min-width: 64rem) 144px, 112px" className="object-cover" />
        </motion.div>
      </div>

      <div className="bg-deep pb-24 pt-10 text-sand md:pb-32 md:pt-12">
        <div className="site-container flex flex-col items-center text-center">
          <Reveal>
            <p className="font-serif text-[36px] leading-none tracking-[-0.03em] md:text-[44px]">Helena Sochnová</p>
            <p className="eyebrow mt-3 text-aqua">Keramikárka a lektorka</p>
          </Reveal>
          <Reveal delay={0.1}>
            <blockquote className="mx-auto mt-10 max-w-[52rem] font-serif text-[26px] leading-[1.2] tracking-[-0.02em] text-balance md:mt-12 md:text-[34px] md:leading-[1.15] lg:text-[40px]">
              „Je to úžasný pocit, keď pod mojimi rukami hlina dostáva tvar a prostredníctvom vzduchu a ohňa sa mení
              v trvácu podobu.“
            </blockquote>
          </Reveal>
          <Reveal delay={0.2} className="mt-10 flex flex-col items-center gap-10 md:mt-12">
            <ul className="flex flex-col gap-3 text-left text-[15px] text-sand/90 md:flex-row md:flex-wrap md:justify-center md:gap-x-8">
              {fakty.map((fakt) => (
                <li key={fakt} className="flex items-center gap-2.5 md:whitespace-nowrap">
                  <CheckIcon />
                  {fakt}
                </li>
              ))}
            </ul>
            <ButtonLink href="/o-mne" variant="light">
              Viac o mne
            </ButtonLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden className="size-5 shrink-0">
      <circle cx="10" cy="10" r="10" className="fill-aqua" />
      <path d="m6 10.2 2.6 2.6L14 7.4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-ink" />
    </svg>
  );
}
