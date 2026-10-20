"use client";

import { useSyncExternalStore } from "react";
import { useLang } from "@/components/locale-provider";
import { formatPrice, type Localized } from "@/lib/i18n";
import { ButtonLink } from "@/components/ui/button-link";

type Objednavka = {
  cislo: string;
  stav: string;
  meno: string;
  email: string;
  telefon: string;
  polozky: { nazov: string; variant?: string; mnozstvo: number; cena: number }[];
  spolu: number;
};

// Jednorazové čítanie z localStorage, uložené po prvom prečítaní – rovnaký vzor ako
// hydratácia v lib/use-cart.ts, nech useSyncExternalStore nevracia pri každom volaní nový objekt.
let nacitana: Objednavka | null | undefined;

function getSnapshot() {
  if (nacitana === undefined) {
    try {
      const ulozena = localStorage.getItem("kh-posledna-objednavka");
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
  poznamka: {
    sk: "Toto je zatiaľ prototyp webu: objednávka sa uložila len v tomto prehliadači, nikam sa neodoslala. Platobná brána a potvrdenie e-mailom prídu neskôr – do vybavenia vás budeme kontaktovať na uvedenom telefóne alebo e-maile.",
    en: "This is still a website prototype: the order was saved only in this browser and was not sent anywhere. The payment gateway and email confirmation come later – until then we will contact you by phone or email.",
  },
  spolu: { sk: "Spolu", en: "Total" },
  napatDomov: { sk: "Späť na domovskú stránku", en: "Back to the homepage" },
} satisfies Record<string, Localized>;

/** Číta poslednú objednávku uloženú pokladňou (`components/obchod/pokladna-form.tsx`) z localStorage. */
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
              <span className="text-drift"> × {p.mnozstvo}</span>
            </span>
            <span className="shrink-0 text-deep">{formatPrice(p.cena * p.mnozstvo, lang)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 flex items-baseline justify-between border-t border-sage pt-3 font-display text-[20px]">
        <span className="text-deep">{texty.spolu[lang]}</span>
        <span className="text-ink">{formatPrice(objednavka.spolu, lang)}</span>
      </p>

      <p className="mt-8 text-[14px] leading-relaxed text-drift">{texty.poznamka[lang]}</p>

      <ButtonLink href="/" variant="deep" className="mt-8">
        {texty.napatDomov[lang]}
      </ButtonLink>
    </div>
  );
}
