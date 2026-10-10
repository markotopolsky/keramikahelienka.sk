"use client";

import type { ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { plural, type Localized } from "@/lib/i18n";
import type { KategoriaSlug } from "@/content/produkty";
import { useLang } from "@/components/locale-provider";
import { ProduktKarta, type KartaProduktu } from "@/components/obchod/produkt-karta";

export type PolozkaObchodu = KartaProduktu & {
  kategorie: KategoriaSlug[];
  cenaCislo: number;
  poradie: number;
};

export type FilterKategorie = { slug: KategoriaSlug; nazov: string; pocet: number };

const zoradenia = ["najnovsie", "cena-vzostupne", "cena-zostupne"] as const;
type Zoradenie = (typeof zoradenia)[number];

const texty = {
  filter: { sk: "Kategória", en: "Category" },
  vsetko: { sk: "Všetko", en: "All" },
  zoradit: { sk: "Zoradiť", en: "Sort by" },
  najnovsie: { sk: "Najnovšie", en: "Newest" },
  "cena-vzostupne": { sk: "Cena od najnižšej", en: "Price: low to high" },
  "cena-zostupne": { sk: "Cena od najvyššej", en: "Price: high to low" },
  vypredane: { sk: "Vypredané", en: "Sold out" },
  vypredaneText: {
    sk: "Tieto kúsky už majú nový domov. Ostávajú tu ako galéria.",
    en: "These pieces have found a new home. They stay here as a gallery.",
  },
} satisfies Record<string, Localized>;

type ObchodZoznamProps = {
  produkty: PolozkaObchodu[];
  filtre: FilterKategorie[];
};

/**
 * Category and sort order live in the URL (?kategoria=vazy&zoradenie=cena-vzostupne), so a filtered
 * list can be shared. useSearchParams needs a Suspense boundary on a static page: the page renders
 * <ObchodZoznamPredvolene /> as its fallback, so the full list is in the HTML for search engines.
 */
export function ObchodZoznam(props: ObchodZoznamProps) {
  const params = useSearchParams();
  const kategoria = props.filtre.find((f) => f.slug === params.get("kategoria"))?.slug ?? null;
  const zoradenie = zoradenia.find((z) => z === params.get("zoradenie")) ?? "najnovsie";
  return <Zoznam {...props} kategoria={kategoria} zoradenie={zoradenie} />;
}

export function ObchodZoznamPredvolene(props: ObchodZoznamProps) {
  return <Zoznam {...props} kategoria={null} zoradenie="najnovsie" />;
}

function nastavUrl(kategoria: KategoriaSlug | null, zoradenie: Zoradenie) {
  const params = new URLSearchParams();
  if (kategoria) params.set("kategoria", kategoria);
  if (zoradenie !== "najnovsie") params.set("zoradenie", zoradenie);
  const query = params.toString();
  // Next.js syncs useSearchParams with history.replaceState, without a request to the server
  window.history.replaceState(null, "", query ? `?${query}` : window.location.pathname);
}

function Zoznam({
  produkty,
  filtre,
  kategoria,
  zoradenie,
}: ObchodZoznamProps & { kategoria: KategoriaSlug | null; zoradenie: Zoradenie }) {
  const lang = useLang();

  const vybrane = produkty
    .filter((p) => !kategoria || p.kategorie.includes(kategoria))
    .sort((a, b) => {
      if (zoradenie === "cena-vzostupne") return a.cenaCislo - b.cenaCislo || a.poradie - b.poradie;
      if (zoradenie === "cena-zostupne") return b.cenaCislo - a.cenaCislo || a.poradie - b.poradie;
      return a.poradie - b.poradie;
    });
  const dostupne = vybrane.filter((p) => !p.vypredane);
  const vypredane = vybrane.filter((p) => p.vypredane);

  const pocet = (n: number) => plural(n, lang, { sk: ["kúsok", "kúsky", "kúskov"], en: ["piece", "pieces"] });

  return (
    <div>
      <div className="flex flex-col gap-6 border-b border-sage pb-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Below 1024px the chips scroll sideways and run to the screen edges, like the reviews */}
        <ul
          aria-label={texty.filter[lang]}
          className="-mx-gutter flex gap-2 overflow-x-auto px-gutter pb-1 [scrollbar-width:none] lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0 lg:pb-0"
        >
          <li className="shrink-0">
            <Chip aktivny={kategoria === null} onClick={() => nastavUrl(null, zoradenie)}>
              {texty.vsetko[lang]} <span className="opacity-60">{produkty.length}</span>
            </Chip>
          </li>
          {filtre.map((f) => (
            <li key={f.slug} className="shrink-0">
              <Chip aktivny={kategoria === f.slug} onClick={() => nastavUrl(f.slug, zoradenie)}>
                {f.nazov} <span className="opacity-60">{f.pocet}</span>
              </Chip>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between gap-4 lg:justify-end">
          <p aria-live="polite" className="text-[14px] text-drift">
            {pocet(vybrane.length)}
          </p>
          <label className="flex items-center gap-3 text-[14px] text-ink">
            <span className="text-drift">{texty.zoradit[lang]}</span>
            <span className="relative">
              <select
                value={zoradenie}
                onChange={(e) => nastavUrl(kategoria, e.target.value as Zoradenie)}
                className="appearance-none rounded-full border border-sage bg-sand py-2 pl-4 pr-9 text-[14px] text-ink transition-colors hover:border-sea focus:border-deep focus:outline-none"
              >
                {zoradenia.map((z) => (
                  <option key={z} value={z}>
                    {texty[z][lang]}
                  </option>
                ))}
              </select>
              <svg viewBox="0 0 10 6" aria-hidden className="pointer-events-none absolute right-4 top-1/2 h-1.5 w-2.5 -translate-y-1/2 text-deep">
                <path d="m1 1 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </label>
        </div>
      </div>

      {dostupne.length > 0 && (
        <ul className="mt-10 grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4 md:gap-y-14">
          {dostupne.map((p, i) => (
            <li key={p.slug}>
              <ProduktKarta produkt={p} preload={i < 4} />
            </li>
          ))}
        </ul>
      )}

      {vypredane.length > 0 && (
        <section aria-labelledby="vypredane" className="mt-20 md:mt-28">
          <div className="flex flex-col gap-2 border-t border-sage pt-8 md:flex-row md:items-baseline md:justify-between md:gap-10">
            <h2 id="vypredane" className="text-h3 text-deep">
              {texty.vypredane[lang]}
            </h2>
            <p className="max-w-[24rem] text-[15px] text-drift md:text-right">{texty.vypredaneText[lang]}</p>
          </div>
          <ul className="mt-10 grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4 md:gap-y-14">
            {vypredane.map((p) => (
              <li key={p.slug}>
                <ProduktKarta produkt={p} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function Chip({ aktivny, onClick, children }: { aktivny: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={aktivny}
      onClick={onClick}
      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-sage px-4 py-2 text-[14px] text-deep transition-colors hover:border-deep aria-pressed:border-deep aria-pressed:bg-deep aria-pressed:text-sand"
    >
      {children}
    </button>
  );
}
