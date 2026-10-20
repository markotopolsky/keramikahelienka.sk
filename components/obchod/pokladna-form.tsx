"use client";

import { useId, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/use-cart";
import { useLang } from "@/components/locale-provider";
import { kontakt } from "@/content/atelier";
import { formatPrice, localizeHref, type Localized } from "@/lib/i18n";
import { najdiProdukt } from "@/lib/produkty";
import { Checkbox, Choice, Field } from "@/components/ui/form-fields";
import { ButtonLink } from "@/components/ui/button-link";
import { Doplnit } from "@/components/ui/doplnit";
import { LocaleLink } from "@/components/ui/locale-link";

const texty = {
  prazdny: { sk: "Košík je prázdny, nie je čo zaplatiť.", en: "Your cart is empty, there is nothing to pay." },
  doObchodu: { sk: "Prejsť do obchodu", en: "Go to the shop" },
  udaje: { sk: "Vaše údaje", en: "Your details" },
  meno: { sk: "Meno a priezvisko", en: "Full name" },
  telefon: { sk: "Telefón", en: "Phone" },
  email: { sk: "E-mail", en: "Email" },
  doprava: { sk: "Doprava", en: "Delivery" },
  osobnyOdber: { sk: "Osobný odber v ateliéri – zadarmo", en: "Pickup at the studio – free" },
  kurier: { sk: "Doručenie kurérom", en: "Courier delivery" },
  suhrn: { sk: "Súhrn objednávky", en: "Order summary" },
  spolu: { sk: "Spolu", en: "Total" },
  suhlas: { sk: "Súhlasím s ", en: "I agree to the " },
  podmienky: { sk: "obchodnými podmienkami", en: "terms and conditions" },
  zaplatit: { sk: "Zaplatiť", en: "Pay" },
  poznamka: {
    sk: "Platobná brána zatiaľ nie je zapojená – po odoslaní objednávky vás budeme kontaktovať na dohodnutie platby.",
    en: "The payment gateway is not connected yet – after you submit the order we will contact you to arrange payment.",
  },
} satisfies Record<string, Localized>;

function vygenerujCisloObjednavky() {
  const den = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const kod = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `OBJ-${den}-${kod}`;
}

/**
 * Pokladňa. Vytvorí objednávku v stave "čaká na platbu" – iba v tomto prehliadači (localStorage),
 * nikam sa neodosiela. Reálna rezervácia kusov a e-mail prídu s backendom (ZAZNAMNIK.md fáza 3),
 * platba cez Comgate "až nakoniec" (ZAZNAMNIK.md §13).
 */
export function PokladnaForm() {
  const lang = useLang();
  const router = useRouter();
  const { polozky, vyprazdnit } = useCart();
  const id = useId();
  const [odosiela, setOdosiela] = useState(false);

  const riadky = polozky.map((polozka) => {
    const produkt = najdiProdukt(polozka.slug);
    const variant = produkt && polozka.variant !== null ? produkt.varianty[polozka.variant] : undefined;
    const jednotkovaCena = variant ? variant.cena : produkt?.cena ?? 0;
    return { polozka, produkt, variant, jednotkovaCena };
  });
  const platneRiadky = riadky.filter((r) => r.produkt && !r.produkt.vypredane);
  const spolu = platneRiadky.reduce((suma, r) => suma + r.jednotkovaCena * r.polozka.mnozstvo, 0);

  if (platneRiadky.length === 0) {
    return (
      <div className="py-4">
        <p className="text-[15px] text-ink/80">{texty.prazdny[lang]}</p>
        <ButtonLink href="/obchod" variant="deep" className="mt-6">
          {texty.doObchodu[lang]}
        </ButtonLink>
      </div>
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const objednavka = {
      cislo: vygenerujCisloObjednavky(),
      vytvorene: new Date().toISOString(),
      stav: "čaká na platbu" as const,
      meno: String(data.get("meno") ?? ""),
      telefon: String(data.get("telefon") ?? ""),
      email: String(data.get("email") ?? ""),
      doprava: "osobny-odber" as const,
      polozky: platneRiadky.map((r) => ({
        nazov: r.produkt!.nazov[lang],
        variant: r.variant?.nazov[lang],
        mnozstvo: r.polozka.mnozstvo,
        cena: r.jednotkovaCena,
      })),
      spolu,
    };
    try {
      localStorage.setItem("kh-posledna-objednavka", JSON.stringify(objednavka));
    } catch {
      // Zakázané úložisko – stránka "hotovo" potom ukáže náhradnú správu.
    }
    setOdosiela(true);
    vyprazdnit();
    router.push(localizeHref("/pokladna/hotovo", lang));
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8">
      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="mb-1 text-[15px] font-medium text-deep sm:col-span-2">{texty.udaje[lang]}</legend>
        <Field id={`${id}-meno`} label={texty.meno[lang]} name="meno" autoComplete="name" required className="sm:col-span-2" />
        <Field id={`${id}-telefon`} label={texty.telefon[lang]} name="telefon" type="tel" autoComplete="tel" required />
        <Field id={`${id}-email`} label={texty.email[lang]} name="email" type="email" autoComplete="email" required />
      </fieldset>

      <div>
        <Choice
          label={texty.doprava[lang]}
          name="doprava"
          defaultValue="osobny-odber"
          options={[
            { value: "osobny-odber", label: `${texty.osobnyOdber[lang]} (${kontakt.ulica})` },
            { value: "kurier", label: texty.kurier[lang], disabled: true },
          ]}
        />
        <p className="mt-2 text-[13px] text-drift">
          <Doplnit>ceny a spôsoby dopravy kurérom – otázka 2</Doplnit>
        </p>
      </div>

      <div>
        <p className="text-[15px] font-medium text-deep">{texty.suhrn[lang]}</p>
        <ul className="mt-3 divide-y divide-sage border-y border-sage text-[14px]">
          {platneRiadky.map((r, i) => (
            <li key={`${r.polozka.slug}-${r.polozka.variant}-${i}`} className="flex items-baseline justify-between gap-4 py-3">
              <span className="text-ink">
                {r.produkt!.nazov[lang]}
                {r.variant && <span className="text-drift"> · {r.variant.nazov[lang]}</span>}
                <span className="text-drift"> × {r.polozka.mnozstvo}</span>
              </span>
              <span className="shrink-0 text-deep">{formatPrice(r.jednotkovaCena * r.polozka.mnozstvo, lang)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 flex items-baseline justify-between font-display text-[20px]">
          <span className="text-deep">{texty.spolu[lang]}</span>
          <span className="text-ink">{formatPrice(spolu, lang)}</span>
        </p>
      </div>

      <Checkbox id={`${id}-suhlas`} name="suhlas" required>
        {texty.suhlas[lang]}
        <LocaleLink href="/obchodne-podmienky" className="underline decoration-current/50 underline-offset-4 hover:decoration-current">
          {texty.podmienky[lang]}
        </LocaleLink>
      </Checkbox>

      <p className="text-[13px] leading-relaxed text-drift">{texty.poznamka[lang]}</p>

      <button
        type="submit"
        disabled={odosiela}
        className="w-full rounded-full bg-deep px-6 py-3.5 text-[15px] font-medium tracking-[-0.01em] text-sand transition-colors duration-300 hover:bg-ink disabled:opacity-60 sm:w-auto"
      >
        {texty.zaplatit[lang]} · {formatPrice(spolu, lang)}
      </button>
    </form>
  );
}
