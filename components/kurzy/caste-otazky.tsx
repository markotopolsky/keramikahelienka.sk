import { bindShortWords } from "@/lib/i18n";
import { slots, type ContentMap } from "@/lib/content";
import { RichText } from "@/components/rich-text";
import { Reveal } from "@/components/ui/reveal";

export type Otazka = { otazka: string; odpoved: string };

/** Questions from /admin ("otazka1_text", "otazka1_odpoved" … in the page's section); one shows once the question is filled in */
export function getOtazky(obsah: ContentMap, sekcia: string): Otazka[] {
  return slots(obsah, `${sekcia}.otazka`, "text").map((n) => ({
    otazka: obsah[`${sekcia}.otazka${n}_text`],
    odpoved: obsah[`${sekcia}.otazka${n}_odpoved`] ?? "",
  }));
}

/** Questions that open on click, without JavaScript (<details>). Answers are rich text with links. */
export function CasteOtazky({ nadpis, otazky }: { nadpis: string; otazky: Otazka[] }) {
  return (
    <div>
      <Reveal>
        <h2 className="text-h2 text-deep">{bindShortWords(nadpis)}</h2>
      </Reveal>
      <Reveal delay={0.1} className="mt-10 border-b border-deep/20 md:mt-14">
        {otazky.map((o) => (
          <details key={o.otazka} className="group border-t border-deep/20">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-6 py-5 text-[18px] leading-snug text-deep md:text-[20px] [&::-webkit-details-marker]:hidden">
              {bindShortWords(o.otazka)}
              <svg viewBox="0 0 14 14" aria-hidden className="size-3.5 shrink-0 transition-transform duration-300 group-open:rotate-45">
                <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </summary>
            <RichText value={o.odpoved} className="max-w-[40rem] space-y-3 pb-6 text-[15px] leading-relaxed text-ink/80 md:text-base" />
          </details>
        ))}
      </Reveal>
    </div>
  );
}
