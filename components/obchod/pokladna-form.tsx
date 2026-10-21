"use client";

import { useId, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/use-cart";
import { useLang } from "@/components/locale-provider";
import { formatPrice, localizeHref, type Localized } from "@/lib/i18n";
import type { Produkt } from "@/lib/produkty-zaklad";
import { Checkbox, Choice, Field } from "@/components/ui/form-fields";
import { ButtonLink } from "@/components/ui/button-link";
import { Doplnit } from "@/components/ui/doplnit";
import { LocaleLink } from "@/components/ui/locale-link";
import { odoslatObjednavku } from "@/lib/objednavka-akcia";

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
  // Button wording for an order that creates an obligation to pay (zákon č. 108/2024 Z. z.)
  objednat: { sk: "Objednať s povinnosťou platby", en: "Order with obligation to pay" },
  odosiela: { sk: "Odosielam objednávku…", en: "Sending the order…" },
  poznamka: {
    sk: "Platbu kartou cez Comgate zapojíme pred spustením obchodu. Zatiaľ sa objednávka iba uloží a kúsky vám podržíme 30 minút.",
    en: "Card payment through Comgate is connected before the shop opens. For now the order is only saved and we hold the pieces for 30 minutes.",
  },
  chybaUdaje: { sk: "Skontrolujte, prosím, meno, e-mail a telefón.", en: "Please check your name, email and phone." },
  chybaNedostupne: {
    sk: "Tieto kúsky medzitým objednal niekto iný: {nazvy}. Odstránili sme ich z košíka. Skontrolujte súhrn a odošlite objednávku znova.",
    en: "Someone else has just ordered these pieces: {nazvy}. We removed them from your cart. Please check the summary and send the order again.",
  },
  chybaLimit: {
    sk: "Z tohto e-mailu už na platbu čakajú tri objednávky. Dokončite ich, alebo nám napíšte.",
    en: "Three orders from this email are already awaiting payment. Please complete them or write to us.",
  },
  chybaServer: {
    sk: "Objednávku sa nepodarilo odoslať. Skúste to o chvíľu znova, alebo nám napíšte.",
    en: "The order could not be sent. Please try again in a moment or write to us.",
  },
} satisfies Record<string, Localized>;

/** Where the thank-you page (components/obchod/objednavka-hotovo.tsx) reads the confirmed order */
export const KLUC_OBJEDNAVKY = "kh-objednavka";

/**
 * Pokladňa. Pošle košík na server (lib/objednavka-akcia.ts). Ceny a sklad overí databáza, zamkne
 * kusy a vytvorí objednávku v stave „čaká na platbu“. Platba cez Comgate a potvrdenie e-mailom
 * prídu neskôr (ZAZNAMNIK.md §13 a fáza 6).
 */
export function PokladnaForm({ produkty, ulica }: { produkty: Produkt[]; ulica: string }) {
  const lang = useLang();
  const router = useRouter();
  const { polozky, vyprazdnit, odobrat } = useCart();
  const id = useId();
  const [odosiela, setOdosiela] = useState(false);
  const [chyba, setChyba] = useState<string | null>(null);

  const riadky = polozky.map((polozka) => {
    const produkt = produkty.find((p) => p.slug === polozka.slug);
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setOdosiela(true);
    setChyba(null);

    let vysledok: Awaited<ReturnType<typeof odoslatObjednavku>>;
    try {
      vysledok = await odoslatObjednavku({
        jazyk: lang,
        meno: String(data.get("meno") ?? ""),
        email: String(data.get("email") ?? ""),
        telefon: String(data.get("telefon") ?? ""),
        doprava: "osobny-odber",
        suhlas: data.get("suhlas") !== null,
        polozky: platneRiadky.map((r) => ({ slug: r.polozka.slug, variant: r.polozka.variant, pocet: r.polozka.mnozstvo })),
        web: String(data.get("web") ?? ""),
      });
    } catch {
      vysledok = { ok: false, chyba: "server" };
    }

    if (vysledok.ok) {
      try {
        localStorage.setItem(KLUC_OBJEDNAVKY, JSON.stringify(vysledok.objednavka));
      } catch {
        // Zakázané úložisko – stránka "hotovo" potom ukáže náhradnú správu.
      }
      vyprazdnit();
      router.push(localizeHref("/pokladna/hotovo", lang));
      return;
    }

    if (vysledok.chyba === "nedostupne") {
      const prec = vysledok.nedostupne ?? [];
      const nazvy = platneRiadky.filter((r) => prec.includes(r.polozka.slug)).map((r) => r.produkt!.nazov[lang]);
      for (const r of riadky) if (prec.includes(r.polozka.slug)) odobrat(r.polozka.slug, r.polozka.variant);
      setChyba(texty.chybaNedostupne[lang].replace("{nazvy}", [...new Set(nazvy)].join(", ")));
      // Fresh products from the server, so the cart and the shop show these pieces as sold out
      router.refresh();
    } else {
      setChyba(
        { udaje: texty.chybaUdaje, limit: texty.chybaLimit, server: texty.chybaServer }[vysledok.chyba][lang],
      );
    }
    setOdosiela(false);
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
            { value: "osobny-odber", label: `${texty.osobnyOdber[lang]} (${ulica})` },
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

      {/* Honeypot: hidden from people and screen readers, bots fill it in */}
      <input type="text" name="web" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

      <p className="text-[13px] leading-relaxed text-drift">{texty.poznamka[lang]}</p>

      {chyba && (
        <p role="alert" className="rounded-card bg-note p-4 text-[14px] leading-relaxed text-ink">
          {chyba}
        </p>
      )}

      <button
        type="submit"
        disabled={odosiela}
        className="w-full rounded-full bg-deep px-6 py-3.5 text-[15px] font-medium tracking-[-0.01em] text-sand transition-colors duration-300 hover:bg-ink disabled:opacity-60 sm:w-auto"
      >
        {odosiela ? texty.odosiela[lang] : `${texty.objednat[lang]} · ${formatPrice(spolu, lang)}`}
      </button>
    </form>
  );
}
