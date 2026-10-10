import Image from "next/image";
import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";

// Helena wants corporate teambuilding visible, but low-key (ZAZNAMNIK.md section 12).
// TODO: question 15. If she wants a form for HR, its fields are place, number of people
// and shared piece vs. one piece each.
const moznosti = [
  { nazov: "Miesto", text: "V ateliéri v Dúbravke, alebo prídeme k vám do firmy." },
  { nazov: "Tvorba", text: "Jedno spoločné dielo celého tímu, alebo každý svoj kúsok." },
  { nazov: "Cena", text: "Ponuku pripravíme na mieru podľa počtu ľudí." },
];

export function Teambuilding() {
  return (
    <section id="teambuilding" className="bg-sand py-24 md:py-36">
      <div className="site-container">
        <Reveal className="grid overflow-hidden rounded-card bg-mint md:grid-cols-[2fr_3fr]">
          <div className="relative aspect-[3/2] md:aspect-auto">
            <Image
              src="/images/diela/art-object-lava.jpg"
              alt="Veľký art objekt s lávovou glazúrou v rukách"
              fill
              sizes="(min-width: 90rem) 544px, (min-width: 48rem) 40vw, calc(100vw - 2.5rem)"
              className="object-cover"
            />
          </div>
          <div className="p-6 sm:p-8 lg:p-14">
            <p className="eyebrow text-drift">Pre firmy</p>
            <h2 className="mt-5 text-h3 text-deep">Teambuilding s hlinou</h2>
            <p className="mt-5 max-w-[32rem] text-base leading-relaxed text-ink/80 md:text-[17px]">
              Workshop pre váš tím pripravíme na mieru. Termín aj program dohodneme spolu.
            </p>
            <dl className="mt-8 space-y-4">
              {moznosti.map((m) => (
                <div key={m.nazov} className="flex flex-col gap-1 sm:flex-row sm:gap-6">
                  <dt className="eyebrow shrink-0 pt-1 text-[11px] text-drift sm:w-16">{m.nazov}</dt>
                  <dd className="text-[15px] leading-relaxed text-ink md:text-base">{m.text}</dd>
                </div>
              ))}
            </dl>
            <ButtonLink href="/kontakt#sprava" variant="deep" className="mt-10">
              Napísať o ponuku
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
