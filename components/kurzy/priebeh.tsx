import { bindShortWords } from "@/lib/i18n";
import { slots, type ContentMap } from "@/lib/content";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

/**
 * Numbered steps of a course subpage or /pre-firmy, from /admin ("krok1_nazov", "krok1_text" …
 * in the page's section). A step shows once its title is filled in; with none, nothing renders.
 */
export function Priebeh({ obsah, sekcia }: { obsah: ContentMap; sekcia: string }) {
  const t = (pole: string) => obsah[`${sekcia}.${pole}`] ?? "";
  const kroky = slots(obsah, `${sekcia}.krok`, "nazov").map((n) => ({ nazov: t(`krok${n}_nazov`), text: t(`krok${n}_text`) }));
  if (kroky.length === 0) return null;

  return (
    <section className="bg-mint py-24 md:py-36">
      <div className="site-container">
        <SectionHeading title={t("priebeh_nadpis")} aside={t("priebeh_aside")} />

        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {kroky.map((krok, i) => (
            <Reveal as="li" key={krok.nazov} delay={i * 0.08} className="flex flex-col gap-10 rounded-card bg-sand p-6 md:p-8">
              <span aria-hidden className="font-display text-[44px] leading-none tracking-[-0.03em] text-sea">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-[22px] leading-tight tracking-[-0.02em] text-deep md:text-[24px]">{bindShortWords(krok.nazov)}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink/80">{krok.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
