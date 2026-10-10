import Image from "next/image";
import { LocaleLink } from "@/components/ui/locale-link";

/** Card data already in the page language, so the client-side shop list gets no other language */
export type KartaProduktu = {
  slug: string;
  nazov: string;
  kategoria: string;
  cena: string;
  foto: string;
  vypredane: boolean;
  vypredaneText: string;
};

/** One piece in the shop grid. Sold-out pieces stay as a gallery, softly greyed (ZAZNAMNIK.md section 12). */
export function ProduktKarta({ produkt, preload = false }: { produkt: KartaProduktu; preload?: boolean }) {
  return (
    <LocaleLink href={`/obchod/${produkt.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-sage">
        <Image
          src={produkt.foto}
          alt={produkt.nazov}
          fill
          preload={preload}
          sizes="(min-width: 90rem) 330px, (min-width: 64rem) 23vw, (min-width: 48rem) 31vw, 47vw"
          className={`object-cover transition duration-700 ease-soft group-hover:scale-[1.05] ${
            produkt.vypredane ? "opacity-70 grayscale" : ""
          }`}
        />
        {produkt.vypredane && (
          <span className="absolute left-3 top-3 rounded-full bg-sand/95 px-3 py-1.5 text-[12px] font-medium text-drift">
            {produkt.vypredaneText}
          </span>
        )}
      </div>
      {/* Two columns on a phone are too narrow for name and price side by side */}
      <div className="mt-3 flex flex-col gap-1 px-0.5 md:flex-row md:items-baseline md:justify-between md:gap-4">
        <div className="min-w-0">
          <p className="eyebrow text-[11px] text-drift">{produkt.kategoria}</p>
          <p
            className={`mt-1 font-display text-[17px] leading-tight md:text-[20px] ${produkt.vypredane ? "text-ink/60" : "text-ink"}`}
          >
            {produkt.nazov}
          </p>
        </div>
        <p className={`shrink-0 text-[15px] ${produkt.vypredane ? "text-drift" : "text-deep"}`}>
          {produkt.cena}
        </p>
      </div>
    </LocaleLink>
  );
}
