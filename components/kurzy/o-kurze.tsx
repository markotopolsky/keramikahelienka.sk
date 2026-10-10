import Image from "next/image";
import { quote, type Localized } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { popisKurzu, zakladneInfo } from "@/content/kurzy";
import { recenzie } from "@/content/atelier";
import { Reveal } from "@/components/ui/reveal";

const recenziaKurzu = recenzie.find((r) => r.tema === "kurz");

const texty = {
  eyebrow: { sk: "O kurze", en: "About the course" },
  nadpis: { sk: "Reliéf, miska, hrnček, váza", en: "Relief, bowl, mug, vase" },
  alt: { sk: "Guľatá váza s krátermi v rukách", en: "Round vase with craters held in hands" },
} satisfies Record<string, Localized>;

export async function OKurze() {
  const lang = await getLang();
  const [prvy, ...dalsie] = popisKurzu[lang];

  return (
    <section className="bg-sand pb-24 pt-16 md:pb-36 md:pt-24">
      <div className="site-container grid gap-14 lg:grid-cols-[1fr_26rem] lg:gap-20 xl:grid-cols-[1fr_30rem]">
        <div>
          <Reveal>
            <p className="eyebrow text-drift">{texty.eyebrow[lang]}</p>
            <h2 className="mt-5 max-w-[40rem] text-h2 text-deep">{texty.nadpis[lang]}</h2>
          </Reveal>
          <Reveal delay={0.1} className="mt-8 max-w-[40rem] space-y-5 md:mt-10">
            <p className="text-lead text-ink">{prvy}</p>
            {dalsie.map((odsek) => (
              <p key={odsek} className="text-base leading-relaxed text-ink/80 md:text-[17px]">
                {odsek}
              </p>
            ))}
          </Reveal>

          {recenziaKurzu && (
            <Reveal as="figure" delay={0.1} className="mt-12 max-w-[40rem] border-l-2 border-aqua pl-6 md:mt-16 md:pl-8">
              <blockquote className="font-display text-[20px] leading-[1.4] tracking-[-0.01em] text-deep md:text-[22px]">
                {quote(recenziaKurzu.text[lang], lang)}
              </blockquote>
              <figcaption className="mt-4 text-[14px] text-drift">
                {recenziaKurzu.meno}, {recenziaKurzu.miesto[lang]}
              </figcaption>
            </Reveal>
          )}
        </div>

        <div className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
          <Reveal className="relative aspect-[4/3] overflow-hidden rounded-card bg-sage lg:aspect-[4/5]">
            <Image
              src="/images/diela/strip-img_2218.jpg"
              alt={texty.alt[lang]}
              fill
              sizes="(min-width: 80rem) 480px, (min-width: 64rem) 416px, calc(100vw - 2.5rem)"
              className="object-cover"
            />
          </Reveal>
          <Reveal delay={0.1}>
            <dl className="divide-y divide-sage rounded-card border border-sage">
              {zakladneInfo.map((info) => (
                <div key={info.nazov.sk} className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:gap-6">
                  <dt className="eyebrow shrink-0 pt-1 text-[11px] text-drift sm:w-20">{info.nazov[lang]}</dt>
                  <dd className="text-[15px] leading-relaxed text-ink">{info.text[lang]}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
