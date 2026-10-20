"use client";

import { useState } from "react";
import { formatPrice, type Localized } from "@/lib/i18n";
import type { Variant } from "@/content/produkty";
import { kosik } from "@/content/atelier";
import { useCart } from "@/lib/use-cart";
import { useLang } from "@/components/locale-provider";
import { LocaleLink } from "@/components/ui/locale-link";

const texty = {
  variant: { sk: "Vyberte variant", en: "Choose an option" },
  doKosika: { sk: "Pridať do košíka", en: "Add to cart" },
  pridane: { sk: "Pridané do košíka.", en: "Added to cart." },
  zobrazitKosik: { sk: "Zobraziť košík", en: "View cart" },
} satisfies Record<string, Localized>;

/** Variant choice and the cart button. */
export function DoKosika({ slug, varianty }: { slug: string; varianty: Variant[] }) {
  const lang = useLang();
  const { pridat } = useCart();
  const [variant, setVariant] = useState(0);
  const [klik, setKlik] = useState(false);

  return (
    <div>
      {varianty.length > 0 && (
        <fieldset className="mb-6">
          <legend className="eyebrow mb-3 text-[11px] text-drift">{texty.variant[lang]}</legend>
          <div className="grid gap-2">
            {varianty.map((v, i) => (
              <label
                key={v.nazov.sk}
                className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-sage px-4 py-3 text-[15px] transition-colors hover:border-sea has-checked:border-deep has-checked:bg-mint"
              >
                <span className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="variant"
                    checked={variant === i}
                    onChange={() => setVariant(i)}
                    className="size-4 accent-deep"
                  />
                  {v.nazov[lang]}
                </span>
                <span className="text-deep">{formatPrice(v.cena, lang)}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <button
        type="button"
        onClick={() => {
          pridat(slug, varianty.length > 0 ? variant : null);
          setKlik(true);
        }}
        className="w-full rounded-full bg-deep px-6 py-3.5 text-[15px] font-medium tracking-[-0.01em] text-sand transition-colors duration-300 hover:bg-ink sm:w-auto"
      >
        {texty.doKosika[lang]}
        {varianty.length > 0 && ` · ${formatPrice(varianty[variant].cena, lang)}`}
      </button>
      <p aria-live="polite" className="mt-3 min-h-5 text-[14px] leading-relaxed text-deep">
        {klik && (
          <>
            {texty.pridane[lang]}{" "}
            <LocaleLink href={kosik} className="underline decoration-current/50 underline-offset-4 hover:decoration-current">
              {texty.zobrazitKosik[lang]}
            </LocaleLink>
          </>
        )}
      </p>
    </div>
  );
}
