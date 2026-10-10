import { quote, type Localized } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { recenzie, temaRecenzie } from "@/content/atelier";
import { Reveal } from "@/components/ui/reveal";

const texty = {
  nadpis: { sk: "Čo hovoria ľudia", en: "What people say" },
  aside: {
    sk: "Od tých, ktorí si kúpili kúsok domov, aj od tých, ktorí u mňa tvorili.",
    en: "From those who took a piece home, and from those who made things with me.",
  },
  zoznam: { sk: "Recenzie", en: "Reviews" },
  preklad: { sk: "", en: "Translated from Slovak" },
} satisfies Record<string, Localized>;

export async function Recenzie() {
  const lang = await getLang();
  return (
    <section className="bg-sand py-20 md:py-32">
      <div className="site-container">
        <div className="mb-10 flex flex-col gap-5 md:mb-16 md:flex-row md:items-end md:justify-between md:gap-10">
          <Reveal>
            <h2 className="text-h2 text-deep">{texty.nadpis[lang]}</h2>
          </Reveal>
          <Reveal delay={0.1} className="max-w-[22rem] text-[15px] leading-relaxed text-drift md:text-right">
            {texty.aside[lang]}
            {texty.preklad[lang] && <span className="mt-2 block text-[13px] italic">{texty.preklad[lang]}</span>}
          </Reveal>
        </div>

        {/* Below 1024px the cards become a swipeable row that runs to the screen edges; the next card peeks in */}
        <ul
          aria-label={texty.zoznam[lang]}
          className="-mx-gutter flex snap-x snap-mandatory scroll-px-gutter gap-4 overflow-x-auto px-gutter pb-4 [scrollbar-color:var(--color-sage)_transparent] [scrollbar-width:thin] lg:mx-0 lg:grid lg:grid-cols-3 lg:items-stretch lg:gap-5 lg:overflow-visible lg:px-0 lg:pb-0"
        >
          {recenzie.map((r, i) => {
            const featured = i === 1;
            return (
              <Reveal
                as="li"
                key={r.meno}
                delay={i * 0.1}
                className={`flex w-[min(85%,24rem)] shrink-0 snap-start flex-col justify-between gap-10 rounded-card p-6 md:p-8 lg:w-auto lg:gap-12 ${
                  featured ? "bg-deep text-sand" : "border border-sage bg-sand text-ink"
                }`}
              >
                <div>
                  <span
                    className={`eyebrow inline-block rounded-full px-3 py-1.5 text-[11px] ${
                      featured ? "bg-sand text-deep" : "bg-mint text-deep"
                    }`}
                  >
                    {temaRecenzie[r.tema][lang]}
                  </span>
                  <blockquote
                    className={`mt-6 text-base leading-relaxed md:text-[17px] ${featured ? "text-sand/90" : "text-ink/85"}`}
                  >
                    {quote(r.text[lang], lang)}
                  </blockquote>
                </div>
                <div>
                  <p className="font-display text-[26px] leading-none">{r.meno}</p>
                  <p className={`mt-1.5 text-[14px] ${featured ? "text-aqua" : "text-drift"}`}>{r.miesto[lang]}</p>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
