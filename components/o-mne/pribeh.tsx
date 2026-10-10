import Image from "next/image";
import { pribeh } from "@/content/o-mne";
import { Reveal } from "@/components/ui/reveal";

export function Pribeh() {
  const [prvy, ...dalsie] = pribeh;

  return (
    <section className="bg-sand pb-24 pt-16 md:pb-36 md:pt-24">
      <div className="site-container grid gap-12 md:grid-cols-[5fr_6fr] md:items-center md:gap-14 lg:gap-24">
        <Reveal className="relative aspect-[8/9] overflow-hidden rounded-card bg-sage max-md:max-w-[28rem]">
          <Image
            src="/images/helena-more.jpg"
            alt="Helena Sochnová sedí na skalách"
            fill
            sizes="(min-width: 90rem) 580px, (min-width: 48rem) 42vw, (min-width: 28rem) 448px, calc(100vw - 2.5rem)"
            className="object-cover"
          />
        </Reveal>

        <div>
          <Reveal>
            <p className="eyebrow text-drift">Môj príbeh</p>
            <h2 className="mt-5 text-display text-deep">Krása.</h2>
          </Reveal>
          <Reveal delay={0.1} className="mt-8 max-w-[36rem] space-y-5 md:mt-10">
            <p className="font-display text-[24px] leading-[1.3] tracking-[-0.02em] text-deep md:text-[28px]">{prvy}</p>
            {dalsie.map((odsek) => (
              <p key={odsek} className="text-base leading-relaxed text-ink/80 md:text-[17px]">
                {odsek}
              </p>
            ))}
          </Reveal>
          <Reveal delay={0.2} className="mt-10 border-t border-sage pt-6">
            <p className="font-display text-[26px] leading-none tracking-[-0.02em] text-deep">Helena Sochnová</p>
            <p className="eyebrow mt-2 text-drift">Keramikárka a lektorka</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
