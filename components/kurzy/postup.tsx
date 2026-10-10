import Image from "next/image";
import type { Localized } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { postup } from "@/content/kurzy";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

const texty = {
  eyebrow: { sk: "Od hliny po hotový kúsok", en: "From clay to a finished piece" },
  nadpis: { sk: "Ako vzniká vaša keramika", en: "How your ceramics come to life" },
  aside: {
    sk: "Je to trocha zdĺhavejší proces, ale taká už keramika býva… uvidíte, že sa oplatí čakať.",
    en: "It is a slightly longer process, but that is how ceramics are… you will see it is worth the wait.",
  },
  alt: { sk: "Misa z hnedej hliny pred prvým výpalom", en: "Brown clay bowl before the first firing" },
} satisfies Record<string, Localized>;

export async function Postup() {
  const lang = await getLang();
  return (
    <section className="bg-mint py-24 md:py-36">
      <div className="site-container">
        <SectionHeading
          eyebrow={texty.eyebrow[lang]}
          title={texty.nadpis[lang]}
          aside={texty.aside[lang]}
        />

        <div className="grid gap-12 lg:grid-cols-[20rem_1fr] lg:gap-16 xl:grid-cols-[24rem_1fr] xl:gap-24">
          <Reveal className="relative aspect-[3/2] overflow-hidden rounded-card bg-sage max-lg:max-w-[36rem] lg:sticky lg:top-28 lg:aspect-[8/9] lg:self-start">
            <Image
              src="/images/proces-hneda-misa.jpg"
              alt={texty.alt[lang]}
              fill
              sizes="(min-width: 80rem) 384px, (min-width: 64rem) 320px, (min-width: 36rem) 576px, calc(100vw - 2.5rem)"
              className="object-cover"
            />
          </Reveal>

          <ol className="grid gap-x-10 gap-y-10 sm:grid-cols-2 md:gap-y-14">
            {postup.map((krok, i) => (
              <Reveal as="li" key={krok.nazov.sk} delay={(i % 2) * 0.08} className="border-t border-deep/20 pt-6">
                <p aria-hidden className="font-display text-[44px] leading-none tracking-[-0.03em] text-sea md:text-[56px]">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-5 text-[24px] leading-tight tracking-[-0.02em] text-deep md:text-[28px]">{krok.nazov[lang]}</h3>
                <p className="mt-3 max-w-[22rem] text-[15px] leading-relaxed text-ink/80 md:text-base">{krok.text[lang]}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
