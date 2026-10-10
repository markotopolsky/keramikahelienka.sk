"use client";

import { useState } from "react";
import { formatPrice, type Localized } from "@/lib/i18n";
import type { Variant } from "@/content/produkty";
import { useLang } from "@/components/locale-provider";

const texty = {
  variant: { sk: "Vyberte variant", en: "Choose an option" },
  doKosika: { sk: "Pridať do košíka", en: "Add to cart" },
  prototyp: {
    sk: "Prototyp: košík zatiaľ nie je hotový. Kúsok si môžete objednať telefonicky alebo e-mailom.",
    en: "Prototype: the cart is not ready yet. You can order this piece by phone or email.",
  },
} satisfies Record<string, Localized>;

/** Variant choice and the cart button. Looks only for now: the cart comes in phase 4 (ZAZNAMNIK.md section 15). */
export function DoKosika({ varianty }: { varianty: Variant[] }) {
  const lang = useLang();
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
        onClick={() => setKlik(true)}
        className="w-full rounded-full bg-deep px-6 py-3.5 text-[15px] font-medium tracking-[-0.01em] text-sand transition-colors duration-300 hover:bg-ink sm:w-auto"
      >
        {texty.doKosika[lang]}
        {varianty.length > 0 && ` · ${formatPrice(varianty[variant].cena, lang)}`}
      </button>
      <p aria-live="polite" className="mt-3 min-h-5 text-[14px] leading-relaxed text-deep">
        {klik ? texty.prototyp[lang] : ""}
      </p>
    </div>
  );
}
