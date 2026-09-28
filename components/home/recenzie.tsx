import { recenzie } from "@/content/atelier";
import { Reveal } from "@/components/ui/reveal";

export function Recenzie() {
  return (
    <section className="bg-sand py-20 md:py-32">
      <div className="site-container">
        <div className="mb-10 flex flex-col gap-5 md:mb-16 md:flex-row md:items-end md:justify-between md:gap-10">
          <Reveal>
            <h2 className="text-h2 text-deep">Čo hovoria ľudia</h2>
          </Reveal>
          <Reveal delay={0.1} className="max-w-[22rem] text-[15px] leading-relaxed text-drift md:text-right">
            Od tých, ktorí si kúpili kúsok domov, aj od tých, ktorí u mňa tvorili.
          </Reveal>
        </div>

        {/* Below 1024px the cards become a swipeable row that runs to the screen edges; the next card peeks in */}
        <ul
          aria-label="Recenzie"
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
                    {r.tema}
                  </span>
                  <blockquote
                    className={`mt-6 text-base leading-relaxed md:text-[17px] ${featured ? "text-sand/90" : "text-ink/85"}`}
                  >
                    „{r.text}“
                  </blockquote>
                </div>
                <div>
                  <p className="font-serif text-[26px] leading-none">{r.meno}</p>
                  <p className={`mt-1.5 text-[14px] ${featured ? "text-aqua" : "text-drift"}`}>{r.miesto}</p>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
