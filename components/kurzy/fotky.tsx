import Image from "next/image";
import { slots, type ContentMap } from "@/lib/content";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

/**
 * Photo gallery of a course subpage or /pre-firmy, from /admin ("galeria1_foto", "galeria1_alt" …
 * in the page's section). A photo shows once it is uploaded; with none, nothing renders.
 */
export function Fotky({ obsah, sekcia }: { obsah: ContentMap; sekcia: string }) {
  const t = (pole: string) => obsah[`${sekcia}.${pole}`] ?? "";
  const fotky = slots(obsah, `${sekcia}.galeria`, "foto").map((n) => ({ src: t(`galeria${n}_foto`), alt: t(`galeria${n}_alt`) }));
  if (fotky.length === 0) return null;

  // Three columns from 1024px, two when that would leave a lone photo in the last row
  const tri = fotky.length > 2 && fotky.length !== 4;
  // On phones (two columns) an odd count lets the first photo take the whole row
  const prvaCelaSirka = fotky.length % 2 === 1;

  return (
    <section className="bg-sand py-24 md:py-36">
      <div className="site-container">
        <SectionHeading title={t("galeria_nadpis")} aside={t("galeria_aside")} />

        <div className={`grid grid-cols-2 gap-3 md:gap-5 ${tri ? "lg:grid-cols-3" : ""}`}>
          {fotky.map((fotka, i) => (
            <Reveal
              key={fotka.src}
              delay={(i % 3) * 0.08}
              className={`relative aspect-[4/3] overflow-hidden rounded-card bg-sage ${i === 0 && prvaCelaSirka ? "col-span-2 lg:col-span-1" : ""}`}
            >
              <Image
                src={fotka.src}
                alt={fotka.alt}
                fill
                sizes={tri ? "(min-width: 90rem) 440px, (min-width: 64rem) 31vw, 50vw" : "(min-width: 90rem) 670px, 50vw"}
                // Portrait photos keep the upper part, where faces usually are
                className="object-cover object-[50%_30%]"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
