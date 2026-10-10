import Image from "next/image";
import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/reveal";
import { TornEdge } from "@/components/ui/torn-edge";

type PageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  /** Buttons under the lead */
  actions?: ReactNode;
  /** Right-hand column from 1024px, below the text on smaller screens: a photo or a short list */
  aside?: ReactNode;
};

/**
 * Dark teal opening of a subpage. The header stays transparent over it (`data-hero`),
 * and a torn-paper edge leads into the sand page below.
 */
export function PageHero({ eyebrow, title, lead, actions, aside }: PageHeroProps) {
  return (
    <section data-hero className="bg-deep text-sand">
      <div
        className={`site-container pb-14 pt-32 md:pb-20 md:pt-44 ${
          aside ? "grid gap-12 md:gap-16 lg:grid-cols-[1fr_24rem] lg:items-end xl:grid-cols-[1fr_28rem]" : ""
        }`}
      >
        <div>
          <Reveal>
            <p className="eyebrow text-aqua">{eyebrow}</p>
            <h1 className="mt-5 max-w-[52rem] text-display md:mt-6">{title}</h1>
          </Reveal>
          {lead && (
            <Reveal delay={0.1} className="mt-7 max-w-[36rem] text-lead text-sand/90 md:mt-9">
              {lead}
            </Reveal>
          )}
          {actions && (
            <Reveal delay={0.2} className="mt-8 flex flex-wrap gap-3 md:mt-10">
              {actions}
            </Reveal>
          )}
        </div>
        {aside && <Reveal delay={0.15}>{aside}</Reveal>}
      </div>
      <TornEdge className="-mb-px text-sand" />
    </section>
  );
}

type PageHeroImageProps = {
  src: string;
  alt: string;
  /** CSS object-position, to keep a face or a piece in frame */
  position?: string;
};

/** Photo for the `aside` of PageHero: landscape on phones, portrait beside the text on desktop */
export function PageHeroImage({ src, alt, position }: PageHeroImageProps) {
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-sea sm:aspect-[3/2] lg:aspect-[4/5]">
      <Image
        src={src}
        alt={alt}
        fill
        preload
        sizes="(min-width: 80rem) 448px, (min-width: 64rem) 384px, calc(100vw - 2.5rem)"
        style={position ? { objectPosition: position } : undefined}
        className="object-cover"
      />
    </div>
  );
}
