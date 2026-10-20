"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type AnimationPlaybackControls,
  type Variants,
} from "motion/react";
import type { Localized } from "@/lib/i18n";
import { useLang } from "@/components/locale-provider";
import { ButtonLink } from "@/components/ui/button-link";

const texty = {
  headline: { sk: ["Krása", "a", "úžitok"], en: ["Beauty", "and", "purpose"] } satisfies Localized<string[]>,
  slider: { sk: "Fotky z ateliéru", en: "Studio photos" },
  fotka: { sk: "Fotka", en: "Photo" },
  z: { sk: "z", en: "of" },
  predosla: { sk: "Predošlá fotka", en: "Previous photo" },
  dalsia: { sk: "Ďalšia fotka", en: "Next photo" },
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

const slides = [
  {
    src: "/images/hero/hero-helena-chodnik.jpg",
    pozicia: "object-[55%_60%]",
    alt: {
      sk: "Helena sedí na drevenom chodníku v tráve pri svojich ručne modelovaných vázach",
      en: "Helena sitting on a wooden boardwalk in tall grass beside her hand-built vases",
    },
  },
  {
    src: "/images/hero/hero-nadoby-chodnik.jpg",
    pozicia: "object-[45%_65%]",
    alt: {
      sk: "Tri ručne modelované vázy na drevenom chodníku medzi trávou",
      en: "Three hand-built vases on a wooden boardwalk in tall grass",
    },
  },
  {
    src: "/images/hero/hero-helena-terasa.jpg",
    pozicia: "object-[40%_60%]",
    alt: {
      sk: "Helena sedí na terase pred domom a ukladá svoje vázy na schod",
      en: "Helena sitting on a terrace by the house, arranging her vases on a step",
    },
  },
  {
    src: "/images/hero/hero-sklenik.jpg",
    pozicia: "object-[50%_70%]",
    alt: {
      sk: "Rad ručne modelovaných váz a mís na drevenej podlahe pred skleníkom",
      en: "A row of hand-built vases and bowls on a wooden deck in front of a greenhouse",
    },
  },
  {
    src: "/images/hero/hero-biela-vaza.jpg",
    pozicia: "object-[32%_70%]",
    alt: {
      sk: "Biela zvlnená váza na drevenom schode v jesennom slnku",
      en: "A white wavy vase on a wooden step in autumn sunlight",
    },
  },
] satisfies { src: string; pozicia: string; alt: Localized }[];

// Swipes shorter than this count as taps
const SWIPE_PX = 50;
// Seconds each photo stays on screen
const INTERVAL_S = 7;
const WIPE = { duration: 1.6, ease: [0.76, 0, 0.24, 1] } as const;

/*
 * The incoming photo wipes in from the side it comes from while the outgoing one slides a little the
 * other way underneath, so the change reads as a page being turned. With reduced motion: a plain crossfade.
 */
const slideVariants: Variants = {
  enter: ({ smer, reduced }) =>
    reduced ? { opacity: 0 } : { clipPath: smer > 0 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)" },
  center: { zIndex: 2, opacity: 1, clipPath: "inset(0% 0% 0% 0%)", x: "0%", transition: WIPE },
  exit: ({ smer, reduced }) =>
    reduced ? { zIndex: 1, opacity: 0, transition: WIPE } : { zIndex: 1, x: smer > 0 ? "-12%" : "12%", transition: WIPE },
};

export function Hero() {
  const lang = useLang();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // Photo drifts slower than the page, headline slightly faster: a shallow parallax
  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

  const reduced = useReducedMotion() ?? false;
  // smer: 1 when moving forward, -1 when going back; picks the side the next photo wipes in from
  const [[aktivna, smer], setSlide] = useState<[number, 1 | -1]>([0, 1]);
  const posun = (o: 1 | -1) => setSlide(([i]) => [(i + o + slides.length) % slides.length, o]);
  const ukaz = (i: number) => setSlide((s) => (i === s[0] ? s : [i, i > s[0] ? 1 : -1]));

  // Autoplay holds while the visitor uses the controls or tabs through the hero
  const [pauza, setPauza] = useState(false);
  const swipeX = useRef<number | null>(null);

  // Drives both the active progress bar and the autoplay; runs regardless of reduced motion, which only tones down the transition
  const progress = useMotionValue(0);
  const autoplay = useRef<AnimationPlaybackControls | null>(null);
  useEffect(() => {
    progress.set(0);
    const a = animate(progress, 1, {
      duration: INTERVAL_S,
      ease: "linear",
      onComplete: () => setSlide(([i]) => [(i + 1) % slides.length, 1]),
    });
    autoplay.current = a;
    return () => a.stop();
  }, [aktivna, progress]);
  useEffect(() => {
    if (pauza) autoplay.current?.pause();
    else autoplay.current?.play();
  }, [pauza, aktivna]);

  const slide = slides[aktivna];
  const dalsia = slides[(aktivna + 1) % slides.length];

  return (
    <section ref={ref} data-hero className="bg-aqua">
      {/* Fills the first screen below the info bar; on a short screen (a phone held sideways) it grows with the text instead of covering it */}
      <div className="relative flex min-h-[max(calc(100svh_-_var(--info-vyska,0px)),36rem)] flex-col overflow-hidden rounded-b-frame bg-ink md:min-h-[max(calc(100svh_-_var(--info-vyska,0px)),760px)]">
        <motion.div
          // isolate: at scroll 0 the parallax transform is "none", so without it the slides' zIndex would rise above the text
          className="absolute inset-0 isolate touch-pan-y motion-safe:animate-settle"
          style={{ y: photoY }}
          aria-roledescription="carousel"
          aria-label={texty.slider[lang]}
          onPointerDown={(e) => {
            if (e.pointerType !== "mouse") swipeX.current = e.clientX;
          }}
          onPointerUp={(e) => {
            if (swipeX.current === null) return;
            const dx = e.clientX - swipeX.current;
            swipeX.current = null;
            if (Math.abs(dx) > SWIPE_PX) posun(dx < 0 ? 1 : -1);
          }}
          onPointerCancel={() => (swipeX.current = null)}
        >
          <AnimatePresence initial={false} custom={{ smer, reduced }}>
            <motion.div
              key={slide.src}
              custom={{ smer, reduced }}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              role="group"
              aria-roledescription="slide"
              aria-label={`${aktivna + 1} ${texty.z[lang]} ${slides.length}`}
              className="absolute inset-0 overflow-hidden"
            >
              {/* Starts zoomed in and settles while the photo is on screen */}
              <motion.div
                className="absolute inset-0"
                initial={{ scale: 1.18 }}
                animate={{ scale: 1 }}
                transition={{ duration: INTERVAL_S + 1, ease: [0.16, 1, 0.3, 1] }}
              >
                <Image
                  src={slide.src}
                  alt={slide.alt[lang]}
                  fill
                  preload={aktivna === 0}
                  sizes="100vw"
                  className={`object-cover ${slide.pozicia}`}
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Loads the next photo ahead of time so the wipe never reveals an empty frame */}
          <Image src={dalsia.src} alt="" aria-hidden fill loading="eager" sizes="100vw" className="-z-10 opacity-0" />
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

        {/* Phones: copy, buttons and then the slider bars across the full width. From 768px: copy left, controls right. */}
        <div
          className="site-container relative mt-auto flex flex-col gap-3 pb-5 pt-10 text-sand motion-safe:animate-rise md:flex-row md:items-end md:justify-between md:gap-10 md:pb-12"
          style={{ animationDelay: "0.9s" }}
        >
          <div className="max-w-[34rem]">
            <p className="text-lead">{texty.lead[lang]}</p>
            <div className="mt-6 flex flex-wrap gap-3 md:mt-7">
              <ButtonLink href="/kurzy" variant="deep">{texty.kurzy[lang]}</ButtonLink>
              <ButtonLink href="/obchod" variant="outline">
                {texty.obchod[lang]}
              </ButtonLink>
            </div>
          </div>
          <div className="flex shrink-0 flex-col gap-5 md:items-end">
            <p className="eyebrow max-w-[16rem] text-right text-sand/80 max-md:hidden">{texty.original[lang]}</p>
            <div
              className="flex items-center gap-3"
              onPointerEnter={() => setPauza(true)}
              onPointerLeave={() => setPauza(false)}
              onFocus={() => setPauza(true)}
              onBlur={() => setPauza(false)}
            >
              <SipkaButton smer={-1} label={texty.predosla[lang]} onClick={() => posun(-1)} />
              <div className="flex gap-1.5 max-md:flex-1">
                {slides.map((slide, i) => (
                  <button
                    key={slide.src}
                    type="button"
                    onClick={() => ukaz(i)}
                    aria-label={`${texty.fotka[lang]} ${i + 1} ${texty.z[lang]} ${slides.length}`}
                    aria-current={i === aktivna}
                    // A tall invisible hit area around the thin bar; on phones the bars share the full width
                    className="group py-5 max-md:flex-1"
                  >
                    <span className="relative block h-0.5 overflow-hidden rounded-full bg-sand/35 transition-colors group-hover:bg-sand/60 md:w-8 lg:w-12">
                      {i === aktivna && (
                        <motion.span className="absolute inset-0 origin-left bg-sand" style={{ scaleX: progress }} />
                      )}
                    </span>
                  </button>
                ))}
              </div>
              <SipkaButton smer={1} label={texty.dalsia[lang]} onClick={() => posun(1)} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SipkaButton({ smer, label, onClick }: { smer: 1 | -1; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid size-10 place-items-center rounded-full border border-sand/40 text-sand transition-colors hover:border-sand hover:bg-sand/10 max-md:hidden"
    >
      <svg viewBox="0 0 16 10" aria-hidden className={`h-2.5 w-4 ${smer === -1 ? "rotate-180" : ""}`}>
        <path d="M0 5h14M10 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </button>
  );
}
