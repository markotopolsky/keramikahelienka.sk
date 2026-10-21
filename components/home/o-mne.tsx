import Image from "next/image";
import { bindShortWords } from "@/lib/i18n";
import { getContent } from "@/lib/content";
import { getLang } from "@/lib/i18n-server";
import { RichText } from "@/components/rich-text";
import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";

// Portrait beside a short, centred story with a signature, after muoiatelier.com/en/o-nas
export async function OMne() {
  const lang = await getLang();
  const c = await getContent("o_mne_domov", lang);

  return (
    <section className="bg-mint py-24 md:py-36">
      <div className="site-container grid items-center gap-12 md:grid-cols-2 md:gap-14 lg:gap-24">
        <Reveal className="relative mx-auto aspect-[3/4] w-full max-w-[28rem] overflow-hidden rounded-card bg-sage md:max-w-none lg:aspect-[2/3]">
          {/* The photo is cropped close above her head, so it stays anchored to the top */}
          <Image
            src={c["o_mne_domov.foto"]}
            alt={c["o_mne_domov.foto_alt"]}
            fill
            sizes="(min-width: 90rem) 620px, (min-width: 48rem) 45vw, (min-width: 28rem) 448px, calc(100vw - 2.5rem)"
            className="object-cover object-top"
          />
        </Reveal>

        <div className="flex flex-col items-center text-center">
          <Reveal>
            <p className="eyebrow text-drift">{c["o_mne_domov.eyebrow"]}</p>
            <h2 className="mt-5 text-h2 text-deep">{bindShortWords(c["o_mne_domov.nadpis"])}</h2>
            <span aria-hidden className="mx-auto mt-7 block h-[3px] w-16 rounded-full bg-sea" />
          </Reveal>

          <Reveal delay={0.1} className="mt-8 max-w-[32rem] md:mt-10">
            <RichText value={c["o_mne_domov.text"]} className="space-y-5 text-base leading-[1.75] text-ink/80 md:text-[17px]" />
          </Reveal>

          <Reveal delay={0.2} className="mt-10 flex flex-col items-center md:mt-12">
            <p className="font-display text-[26px] leading-none tracking-[-0.02em] text-deep md:text-[30px]">Helena Sochnová</p>
            <p className="eyebrow mt-3 text-drift">{c["o_mne_domov.rola"]}</p>
            <ButtonLink href="/o-mne" variant="deep" className="mt-8">
              {c["o_mne_domov.tlacidlo_viac"]}
            </ButtonLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
