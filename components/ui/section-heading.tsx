import type { ReactNode } from "react";
import { bindShortWords } from "@/lib/i18n";
import { Reveal } from "@/components/ui/reveal";

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  /** Short note on the right from 768px, under the title on phones */
  aside?: ReactNode;
  /** "dark" for sections on the deep-teal background */
  tone?: "light" | "dark";
};

/** Eyebrow, H2 and a side note: the heading row every section of the site uses. */
export function SectionHeading({ eyebrow, title, aside, tone = "light" }: SectionHeadingProps) {
  const dark = tone === "dark";
  return (
    <div className="mb-12 flex flex-col gap-5 md:mb-16 md:flex-row md:items-end md:justify-between md:gap-10">
      <Reveal>
        {eyebrow && <p className={`eyebrow mb-5 ${dark ? "text-aqua" : "text-drift"}`}>{eyebrow}</p>}
        <h2 className={`max-w-[44rem] text-h2 ${dark ? "" : "text-deep"}`}>{typeof title === "string" ? bindShortWords(title) : title}</h2>
      </Reveal>
      {aside && (
        <Reveal
          delay={0.1}
          className={`max-w-[24rem] text-[15px] leading-relaxed md:text-right ${dark ? "text-sand/80" : "text-drift"}`}
        >
          {aside}
        </Reveal>
      )}
    </div>
  );
}
