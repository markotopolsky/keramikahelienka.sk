import { recenzie } from "@/content/atelier";
import { Reveal } from "@/components/ui/reveal";

export function Recenzie() {
  return (
    <section className="bg-sand py-32">
      <div className="site-container">
        <div className="mb-16 flex items-end justify-between gap-10">
          <Reveal>
            <h2 className="text-h2 text-deep">Čo hovoria ľudia</h2>
          </Reveal>
          <Reveal delay={0.1} className="max-w-[22rem] text-right text-[15px] leading-relaxed text-drift">
            Od tých, ktorí si kúpili kúsok domov, aj od tých, ktorí u mňa tvorili.
          </Reveal>
        </div>

        <ul className="grid grid-cols-3 items-stretch gap-5">
          {recenzie.map((r, i) => {
            const featured = i === 1;
            return (
              <Reveal
                as="li"
                key={r.meno}
                delay={i * 0.1}
                className={`flex flex-col justify-between gap-12 rounded-card p-8 ${
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
                  <blockquote className={`mt-6 text-[17px] leading-relaxed ${featured ? "text-sand/90" : "text-ink/85"}`}>
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
