"use client";

import Image from "next/image";
import { useCart } from "@/lib/use-cart";
import { useLang } from "@/components/locale-provider";
import { formatPrice, type Localized } from "@/lib/i18n";
import type { Produkt } from "@/lib/produkty-zaklad";
import { ButtonLink } from "@/components/ui/button-link";
import { LocaleLink } from "@/components/ui/locale-link";

const texty = {
  prazdny: { sk: "Košík je prázdny.", en: "Your cart is empty." },
  doObchodu: { sk: "Prejsť do obchodu", en: "Go to the shop" },
  odobrat: { sk: "Odobrať z košíka", en: "Remove from cart" },
  znizit: { sk: "Znížiť množstvo", en: "Decrease quantity" },
  zvysit: { sk: "Zvýšiť množstvo", en: "Increase quantity" },
  vypredane: { sk: "Tento kúsok sa už predal. Odoberte ho z košíka.", en: "This piece has sold. Please remove it from your cart." },
  nenajdene: { sk: "Tento kúsok sa už v obchode nenachádza. Odoberte ho z košíka.", en: "This piece is no longer in the shop. Please remove it from your cart." },
  spolu: { sk: "Spolu", en: "Total" },
  kPokladni: { sk: "Prejsť k pokladni", en: "Go to checkout" },
} satisfies Record<string, Localized>;

/**
 * Obsah košíka. Číta položky z `useCart()` a pre každú si dotiahne aktuálne dáta produktu
 * (cena, foto, sklad) – košík si pamätá iba slug, variant a množstvo, nie samotnú cenu.
 */
export function KosikZoznam({ produkty }: { produkty: Produkt[] }) {
  const lang = useLang();
  const { polozky, zmenitMnozstvo, odobrat } = useCart();

  const riadky = polozky.map((polozka) => {
    const produkt = produkty.find((p) => p.slug === polozka.slug);
    const variant = polozka.variant !== null ? produkt?.varianty[polozka.variant] : undefined;
    const jednotkovaCena = variant ? variant.cena : produkt?.cena ?? 0;
    return { polozka, produkt, variant, jednotkovaCena };
  });

  const platneRiadky = riadky.filter((r) => r.produkt && !r.produkt.vypredane);
  const spolu = platneRiadky.reduce((suma, r) => suma + r.jednotkovaCena * r.polozka.mnozstvo, 0);

  if (riadky.length === 0) {
    return (
      <div className="py-4">
        <p className="text-[15px] text-ink/80">{texty.prazdny[lang]}</p>
        <ButtonLink href="/obchod" variant="deep" className="mt-6">
          {texty.doObchodu[lang]}
        </ButtonLink>
      </div>
    );
  }

  return (
    <div>
      <ul className="divide-y divide-sage border-y border-sage">
        {riadky.map(({ polozka, produkt, variant, jednotkovaCena }, i) => {
          const problem = !produkt ? texty.nenajdene[lang] : produkt.vypredane ? texty.vypredane[lang] : null;
          return (
            <li key={`${polozka.slug}-${polozka.variant}-${i}`} className="flex gap-4 py-5 sm:gap-6">
              <LocaleLink
                href={produkt ? `/obchod/${produkt.slug}` : "/obchod"}
                className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-sage sm:size-24"
              >
                {produkt?.fotky[0] && (
                  <Image src={produkt.fotky[0]} alt={produkt.nazov[lang]} fill sizes="96px" className="object-cover" />
                )}
              </LocaleLink>

              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <p className="font-display text-[17px] leading-tight text-ink">{produkt?.nazov[lang] ?? polozka.slug}</p>
                {variant && <p className="text-[14px] text-drift">{variant.nazov[lang]}</p>}

                {problem ? (
                  <p className="mt-1 text-[14px] text-drift">{problem}</p>
                ) : (
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex items-center rounded-full border border-sage">
                      <button
                        type="button"
                        aria-label={texty.znizit[lang]}
                        onClick={() => zmenitMnozstvo(polozka.slug, polozka.variant, polozka.mnozstvo - 1)}
                        className="flex size-8 items-center justify-center text-deep hover:text-ink touch:size-11"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-[15px] text-ink">{polozka.mnozstvo}</span>
                      <button
                        type="button"
                        aria-label={texty.zvysit[lang]}
                        onClick={() => zmenitMnozstvo(polozka.slug, polozka.variant, polozka.mnozstvo + 1)}
                        className="flex size-8 items-center justify-center text-deep hover:text-ink touch:size-11"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-[15px] text-deep">{formatPrice(jednotkovaCena * polozka.mnozstvo, lang)}</p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => odobrat(polozka.slug, polozka.variant)}
                  className="mt-1 self-start text-[13px] text-drift underline decoration-drift/50 underline-offset-4 hover:text-deep hover:decoration-deep touch:mt-0 touch:min-h-11"
                >
                  {texty.odobrat[lang]}
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-8 flex flex-col items-end gap-5">
        <p className="font-display text-[22px] text-deep">
          {texty.spolu[lang]} <span className="text-ink">{formatPrice(spolu, lang)}</span>
        </p>
        {platneRiadky.length > 0 && (
          <ButtonLink href="/pokladna" variant="deep">
            {texty.kPokladni[lang]}
          </ButtonLink>
        )}
      </div>
    </div>
  );
}
