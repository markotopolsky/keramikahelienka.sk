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
    <section ref={ref} className="bg-sand">
      <div className="site-container pt-32 text-center">
        <Reveal>
          <p className="eyebrow text-drift">O mne</p>
          <h2 className="mx-auto mt-5 max-w-[48rem] text-h2 text-deep">Som Helenka a z hliny tvorím krásu a drobné radosti.</h2>
        </Reveal>
      </div>

      <div className="relative mt-16">
        {/* Lower half of the portrait sits on the teal band */}
        <div className="absolute inset-x-0 bottom-0 top-1/2 bg-deep" />

        <motion.div
          className="relative z-10 mx-auto h-[500px] w-[360px] overflow-hidden rounded-[50%] border-[6px] border-sand shadow-[0_30px_80px_-40px_rgb(30_43_46/0.6)]"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "0px 0px -15% 0px" }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image src="/images/helena-2.jpg" alt="Helena Sochnová v ateliéri" fill sizes="360px" className="object-cover object-[50%_30%]" />
        </motion.div>

        <motion.div
          style={{ y: leftY, rotate: leftRotate }}
          className="absolute bottom-10 left-[12%] z-10 size-44 overflow-hidden rounded-full border-4 border-sand/80"
        >
          <Image src="/images/variabilna.jpg" alt="" fill sizes="176px" className="scale-125 object-cover" />
        </motion.div>
        <motion.div
          style={{ y: rightY, rotate: rightRotate }}
          className="absolute bottom-0 right-[13%] z-10 h-52 w-36 overflow-hidden rounded-[45%] border-4 border-sand/80"
        >
          <Image src="/images/diela/raku-nadoba.jpg" alt="" fill sizes="144px" className="object-cover" />
        </motion.div>
      </div>

      <div className="bg-deep pb-32 pt-12 text-sand">
        <div className="site-container flex flex-col items-center text-center">
          <Reveal>
            <p className="font-serif text-[44px] leading-none tracking-[-0.03em]">Helena Sochnová</p>
            <p className="eyebrow mt-3 text-aqua">Keramikárka a lektorka</p>
          </Reveal>
          <Reveal delay={0.1}>
            <blockquote className="mx-auto mt-12 max-w-[52rem] font-serif text-[40px] leading-[1.15] tracking-[-0.02em] text-balance">
              „Je to úžasný pocit, keď pod mojimi rukami hlina dostáva tvar a prostredníctvom vzduchu a ohňa sa mení
              v trvácu podobu.“
            </blockquote>
          </Reveal>
          <Reveal delay={0.2} className="mt-12 flex flex-col items-center gap-10">
            <ul className="flex gap-8 text-[15px] text-sand/90">
              {fakty.map((fakt) => (
                <li key={fakt} className="flex items-center gap-2.5">
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
