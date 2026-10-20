import Image from "next/image";
import type { ReactNode } from "react";
import { bindShortWords } from "@/lib/i18n";
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
 * It animates in with CSS, not <Reveal>, so it shows before the page's JavaScript has loaded.
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
          <div className="motion-safe:animate-rise">
            <p className="eyebrow text-aqua">{eyebrow}</p>
            <h1 className="mt-5 max-w-[52rem] text-display md:mt-6">{typeof title === "string" ? bindShortWords(title) : title}</h1>
          </div>
          {lead && (
            <div className="mt-7 max-w-[36rem] text-lead text-sand/90 motion-safe:animate-rise md:mt-9" style={{ animationDelay: "0.1s" }}>
              {typeof lead === "string" ? bindShortWords(lead) : lead}
            </div>
          )}
          {actions && (
            <div className="mt-8 flex flex-wrap gap-3 motion-safe:animate-rise md:mt-10" style={{ animationDelay: "0.2s" }}>
              {actions}
            </div>
          )}
        </div>
        {aside && (
          <div className="motion-safe:animate-rise" style={{ animationDelay: "0.15s" }}>
            {aside}
          </div>
        )}
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
