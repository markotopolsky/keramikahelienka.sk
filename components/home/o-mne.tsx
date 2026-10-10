import Image from "next/image";
import { oMneDomov } from "@/content/o-mne";
import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";

// Portrait beside a short, centred story with a signature, after muoiatelier.com/en/o-nas
export function OMne() {
  return (
    <section className="bg-mint py-24 md:py-36">
      <div className="site-container grid items-center gap-12 md:grid-cols-2 md:gap-14 lg:gap-24">
        <Reveal className="relative mx-auto aspect-[3/4] w-full max-w-[28rem] overflow-hidden rounded-card bg-sage md:max-w-none lg:aspect-[2/3]">
          {/* The photo is cropped close above her head, so it stays anchored to the top */}
          <Image
            src="/images/helena-kvety.jpg"
            alt="Helena Sochnová s vázou plnou kvetov"
            fill
            sizes="(min-width: 90rem) 620px, (min-width: 48rem) 45vw, (min-width: 28rem) 448px, calc(100vw - 2.5rem)"
            className="object-cover object-top"
          />
        </Reveal>

        <div className="flex flex-col items-center text-center">
          <Reveal>
            <p className="eyebrow text-drift">O mne</p>
            <h2 className="mt-5 text-h2 text-deep">Moja cesta s hlinou</h2>
            <span aria-hidden className="mx-auto mt-7 block h-[3px] w-16 rounded-full bg-sea" />
          </Reveal>

          <Reveal delay={0.1} className="mt-8 max-w-[32rem] space-y-5 text-base leading-[1.75] text-ink/80 md:mt-10 md:text-[17px]">
            {oMneDomov.map((odsek) => (
              <p key={odsek}>{odsek}</p>
            ))}
          </Reveal>

          <Reveal delay={0.2} className="mt-10 flex flex-col items-center md:mt-12">
            <p className="font-display text-[26px] leading-none tracking-[-0.02em] text-deep md:text-[30px]">Helena Sochnová</p>
            <p className="eyebrow mt-3 text-drift">Keramikárka a lektorka</p>
            <ButtonLink href="/o-mne" variant="deep" className="mt-8">
              Viac o mne
            </ButtonLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
