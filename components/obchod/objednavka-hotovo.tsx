"use client";

import { useSyncExternalStore } from "react";
import { useLang } from "@/components/locale-provider";
import { formatPrice, type Localized } from "@/lib/i18n";
import type { PotvrdenaObjednavka } from "@/lib/objednavka-akcia";
import { ButtonLink } from "@/components/ui/button-link";
import { KLUC_OBJEDNAVKY } from "@/components/obchod/pokladna-form";

// Jednorazové čítanie z localStorage, uložené po prvom prečítaní – rovnaký vzor ako
// hydratácia v lib/use-cart.ts, nech useSyncExternalStore nevracia pri každom volaní nový objekt.
let nacitana: PotvrdenaObjednavka | null | undefined;

function getSnapshot() {
  if (nacitana === undefined) {
    try {
      const ulozena = localStorage.getItem(KLUC_OBJEDNAVKY);
      nacitana = ulozena ? JSON.parse(ulozena) : null;
    } catch {
      nacitana = null;
    }
  }
  return nacitana;
}

function getServerSnapshot() {
  return null;
}

function subscribe() {
  return () => {};
}

const texty = {
  ziadna: {
    sk: "Nenašli sme žiadnu nedávnu objednávku v tomto prehliadači.",
    en: "We could not find a recent order in this browser.",
  },
  doObchodu: { sk: "Prejsť do obchodu", en: "Go to the shop" },
  cislo: { sk: "Číslo objednávky", en: "Order number" },
  stavCakaNaPlatbu: { sk: "Čaká na platbu", en: "Awaiting payment" },
  rezervacia: { sk: "Kúsky vám držíme do {cas}.", en: "We hold the pieces for you until {cas}." },
  poznamka: {
    sk: "Platbu kartou cez Comgate a potvrdenie e-mailom zapojíme pred spustením obchodu. Zatiaľ sa objednávka iba uložila.",
    en: "Card payment through Comgate and the email confirmation are connected before the shop opens. For now the order has only been saved.",
  },
  spolu: { sk: "Spolu", en: "Total" },
  napatDomov: { sk: "Späť na domovskú stránku", en: "Back to the homepage" },
} satisfies Record<string, Localized>;

/**
 * Číta objednávku, ktorú server potvrdil pokladni (`components/obchod/pokladna-form.tsx`) a tá ju
 * uložila do localStorage. Návštevník databázu objednávok čítať nesmie.
 */
export function ObjednavkaHotovo() {
  const lang = useLang();
  const objednavka = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!objednavka) {
    return (
      <div className="py-4">
        <p className="text-[15px] text-ink/80">{texty.ziadna[lang]}</p>
        <ButtonLink href="/obchod" variant="deep" className="mt-6">
          {texty.doObchodu[lang]}
        </ButtonLink>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-sage pb-5">
        <div>
          <p className="eyebrow text-drift">{texty.cislo[lang]}</p>
          <p className="mt-1 font-display text-[22px] text-deep">{objednavka.cislo}</p>
        </div>
        <span className="rounded-full bg-mint px-4 py-1.5 text-[14px] font-medium text-deep">{texty.stavCakaNaPlatbu[lang]}</span>
      </div>

      <ul className="mt-5 divide-y divide-sage text-[14px]">
        {objednavka.polozky.map((p, i) => (
          <li key={i} className="flex items-baseline justify-between gap-4 py-3">
            <span className="text-ink">
              {p.nazov}
              {p.variant && <span className="text-drift"> · {p.variant}</span>}
              <span className="text-drift"> × {p.pocet}</span>
            </span>
            <span className="shrink-0 text-deep">{formatPrice(p.cenaZaKus * p.pocet, lang)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 flex items-baseline justify-between border-t border-sage pt-3 font-display text-[20px]">
        <span className="text-deep">{texty.spolu[lang]}</span>
        <span className="text-ink">{formatPrice(objednavka.spolu, lang)}</span>
      </p>

      <p className="mt-8 text-[15px] leading-relaxed text-ink">
        {texty.rezervacia[lang].replace(
          "{cas}",
          new Date(objednavka.rezervovaneDo).toLocaleTimeString(lang === "sk" ? "sk-SK" : "en-GB", {
            timeZone: "Europe/Bratislava",
            hour: "2-digit",
            minute: "2-digit",
          }),
        )}
      </p>
      <p className="mt-3 text-[14px] leading-relaxed text-drift">{texty.poznamka[lang]}</p>

      <ButtonLink href="/" variant="deep" className="mt-8">
        {texty.napatDomov[lang]}
      </ButtonLink>
    </div>
  );
}
