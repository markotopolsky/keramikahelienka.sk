"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import type { Localized } from "@/lib/i18n";
import { useLang } from "@/components/locale-provider";
import { ButtonLink } from "@/components/ui/button-link";

const texty = {
  headline: { sk: ["Krása", "a", "úžitok"], en: ["Beauty", "and", "purpose"] } satisfies Localized<string[]>,
  alt: {
    sk: "Ručne modelovaná misa v tvare mušle s tyrkysovou glazúrou v rukách",
    en: "Hand-built shell-shaped bowl with a turquoise glaze, held in hands",
  },
  atelier: { sk: "Keramický ateliér", en: "Ceramics studio" },
  odRoku: { sk: "od roku 2020", en: "since 2020" },
  lead: {
    sk: "Misy, vázy, lampy a objekty modelované ručne, bez hrnčiarskeho kruhu. A kurzy, na ktorých si to vyskúšate sami.",
    en: "Bowls, vases, lamps and objects built by hand, without a potter’s wheel. And classes where you can try it yourself.",
  },
  kurzy: { sk: "Kurzy keramiky", en: "Pottery classes" },
  obchod: { sk: "Obchod", en: "Shop" },
  original: { sk: "Každý kus je originál. Žiadne dva nie sú rovnaké.", en: "Every piece is an original. No two are the same." },
};

export function Hero() {
  const lang = useLang();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // Photo drifts slower than the page, headline slightly faster: a shallow parallax
  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

  return (
    <section ref={ref} data-hero className="bg-deep">
      <div className="relative h-svh min-h-[36rem] overflow-hidden rounded-b-frame bg-ink md:min-h-[760px]">
        <motion.div className="absolute inset-0 motion-safe:animate-settle" style={{ y: photoY }}>
          <Image
            src="/images/hero-musla.jpg"
            alt={texty.alt[lang]}
            fill
            preload
            sizes="100vw"
            className="object-cover object-[50%_40%]"
          />
        </motion.div>

        {/* Shade the top for the headline and the bottom for the copy */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(30_43_46/0.62)_0%,rgb(30_43_46/0.18)_38%,rgb(30_43_46/0.05)_55%,rgb(30_43_46/0.6)_100%)]" />

        <motion.div style={{ y: titleY }} className="site-container relative flex flex-col items-center pt-28 text-center text-sand md:pt-36">
          {/* Wraps on narrow phones: the English headline is longer */}
          <h1 className="flex flex-wrap justify-center gap-x-[0.22em] text-hero">
            {texty.headline[lang].map((word, i) => (
              <span key={word} className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em]">
                <span
                  className="inline-block motion-safe:animate-word-up"
                  style={{ animationDelay: `${0.15 + i * 0.12}s` }}
                >
                  {word}
                </span>
              </span>
            ))}
          </h1>
          <p className="eyebrow mt-6 text-balance text-sand/90 motion-safe:animate-fade-in md:mt-8" style={{ animationDelay: "0.8s" }}>
            {/* Lines may only break after a dot, never inside "Bratislava-Dúbravka" */}
            {texty.atelier[lang]}&nbsp;· <span className="whitespace-nowrap">Bratislava-Dúbravka</span>&nbsp;· {texty.odRoku[lang]}
          </p>
        </motion.div>

        <div
          className="site-container absolute inset-x-0 bottom-8 flex items-end justify-between gap-10 text-sand motion-safe:animate-rise md:bottom-12"
          style={{ animationDelay: "0.9s" }}
        >
          <div className="max-w-[34rem]">
            <p className="text-lead">{texty.lead[lang]}</p>
            <div className="mt-6 flex flex-wrap gap-3 md:mt-7">
              <ButtonLink href="/kurzy">{texty.kurzy[lang]}</ButtonLink>
              <ButtonLink href="/obchod" variant="outline">
                {texty.obchod[lang]}
              </ButtonLink>
            </div>
          </div>
          <p className="eyebrow max-w-[16rem] text-right text-sand/80 max-md:hidden">{texty.original[lang]}</p>
        </div>
      </div>
    </section>
  );
}
