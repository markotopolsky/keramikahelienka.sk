"use client";

import { useEffect, useId, useState, useSyncExternalStore } from "react";
import type { Localized } from "@/lib/i18n";
import {
  analytika,
  analytikaZapnuta,
  marketingZapnuty,
  nacitajSuhlas,
  otvoritNastaveniaEvent,
  pouziSuhlas,
  ulozSuhlas,
  zmazAnalytickeCookies,
  type Suhlas,
} from "@/lib/analytika";
import { useLang } from "@/components/locale-provider";
import { LocaleLink } from "@/components/ui/locale-link";

const texty = {
  nadpis: { sk: "Súhlas s cookies", en: "Cookie consent" },
  text: {
    sk: "Analytické cookies nám ukážu, ako web používate, aby sme ho mohli zlepšovať. Zapneme ich iba s vaším súhlasom. Voľbu môžete kedykoľvek zmeniť v pätičke cez „Nastavenia cookies“.",
    en: "Analytics cookies show us how you use the website so we can improve it. We only turn them on with your consent. You can change your choice at any time with “Cookie settings” in the footer.",
  },
  viac: { sk: "Viac o cookies", en: "More about cookies" },
  prijat: { sk: "Prijať všetko", en: "Accept all" },
  odmietnut: { sk: "Odmietnuť", en: "Reject" },
  nastavenia: { sk: "Nastavenia", en: "Settings" },
  ulozit: { sk: "Uložiť výber", en: "Save choice" },
  nevyhnutne: { sk: "Nevyhnutné", en: "Necessary" },
  nevyhnutneText: {
    sk: "Košík, objednávka a vaša voľba cookies. Bez nich web nefunguje, preto sú vždy zapnuté.",
    en: "The cart, your order and your cookie choice. The website does not work without them, so they are always on.",
  },
  analyticke: { sk: "Analytické", en: "Analytics" },
  analytickeText: {
    sk: "Návštevnosť, kliknutia a pohyb po stránke, bez mena a e-mailu",
    en: "Visits, clicks and movement on the page, without your name or email",
  },
  marketingove: { sk: "Marketingové", en: "Marketing" },
  marketingoveText: {
    sk: "Meranie a cielenie reklám, ak ich ateliér pridá do Google Tag Manager.",
    en: "Measuring and targeting ads, if the studio adds them to Google Tag Manager.",
  },
} satisfies Record<string, Localized>;

const ziadny: Suhlas = { analyticke: false, marketingove: false };
const vsetko: Suhlas = { analyticke: true, marketingove: marketingZapnuty };

// Stored consent: undefined until first read (and always on the server), null when the visitor has not chosen yet.
// Read once and kept, the same pattern as lib/use-cart.ts, so useSyncExternalStore gets a stable value.
let ulozeny: Suhlas | null | undefined;
const odberatelia = new Set<() => void>();

function getSnapshot() {
  if (ulozeny === undefined) ulozeny = nacitajSuhlas();
  return ulozeny;
}

function getServerSnapshot() {
  return undefined;
}

function subscribe(odber: () => void) {
  odberatelia.add(odber);
  return () => odberatelia.delete(odber);
}

/**
 * Cookie bar. Shows until the visitor chooses; "Accept all" and "Reject" are equally prominent.
 * The footer link reopens it in settings mode. Renders nothing when no analytics ID is set.
 */
export function CookieLista() {
  const lang = useLang();
  const id = useId();
  const suhlas = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [nastavenia, setNastavenia] = useState(false);
  const [volba, setVolba] = useState<Suhlas>(ziadny);

  // A returning visitor's earlier consent loads the allowed services on the first page
  useEffect(() => {
    const ulozena = getSnapshot();
    if (analytikaZapnuta && ulozena) pouziSuhlas(ulozena);
  }, []);

  useEffect(() => {
    function otvor() {
      setVolba(getSnapshot() ?? ziadny);
      setNastavenia(true);
    }
    window.addEventListener(otvoritNastaveniaEvent, otvor);
    return () => window.removeEventListener(otvoritNastaveniaEvent, otvor);
  }, []);

  function potvrdit(novy: Suhlas) {
    const predtym = getSnapshot();
    ulozSuhlas(novy);
    ulozeny = novy;
    odberatelia.forEach((odber) => odber());
    setNastavenia(false);

    // Scripts that already run cannot be unloaded, so withdrawing consent clears their cookies and reloads
    const odvolany = predtym && ((predtym.analyticke && !novy.analyticke) || (predtym.marketingove && !novy.marketingove));
    if (odvolany) {
      window.clarity?.("consent", false);
      zmazAnalytickeCookies();
      location.reload();
      return;
    }
    pouziSuhlas(novy);
  }

  if (!analytikaZapnuta || suhlas === undefined || (suhlas !== null && !nastavenia)) return null;

  const sluzby = [analytika.ga4 && "Google Analytics", analytika.clarity && "Microsoft Clarity", analytika.gtm && "Google Tag Manager"]
    .filter(Boolean)
    .join(", ");

  return (
    <section
      role="dialog"
      aria-labelledby={`${id}-nadpis`}
      className="fixed inset-x-4 bottom-4 z-50 max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl bg-deep p-5 text-sand shadow-[0_24px_60px_-20px_rgb(0_0_0/0.55)] sm:left-6 sm:right-auto sm:w-[28rem] sm:p-6"
    >
      <h2 id={`${id}-nadpis`} className="font-display text-[22px] leading-tight tracking-[-0.02em]">
        {texty.nadpis[lang]}
      </h2>
      <p className="mt-3 text-[14px] leading-relaxed text-sand/85">
        {texty.text[lang]}{" "}
        <LocaleLink href="/cookies" className="underline decoration-sand/40 underline-offset-4 hover:decoration-sand">
          {texty.viac[lang]}
        </LocaleLink>
      </p>

      {nastavenia && (
        <fieldset className="mt-5 space-y-4 border-t border-sand/15 pt-5">
          <Volba id={`${id}-nevyhnutne`} nazov={texty.nevyhnutne[lang]} text={texty.nevyhnutneText[lang]} zapnuta zamknuta />
          <Volba
            id={`${id}-analyticke`}
            nazov={texty.analyticke[lang]}
            text={`${texty.analytickeText[lang]} (${sluzby}).`}
            zapnuta={volba.analyticke}
            onChange={(analyticke) => setVolba((v) => ({ ...v, analyticke }))}
          />
          {marketingZapnuty && (
            <Volba
              id={`${id}-marketingove`}
              nazov={texty.marketingove[lang]}
              text={texty.marketingoveText[lang]}
              zapnuta={volba.marketingove}
              onChange={(marketingove) => setVolba((v) => ({ ...v, marketingove }))}
            />
          )}
        </fieldset>
      )}

      <div className="mt-5 grid grid-cols-2 gap-2">
        <button type="button" onClick={() => potvrdit(vsetko)} className={tlacidlo}>
          {texty.prijat[lang]}
        </button>
        <button type="button" onClick={() => potvrdit(ziadny)} className={tlacidlo}>
          {texty.odmietnut[lang]}
        </button>
      </div>
      {nastavenia ? (
        <button type="button" onClick={() => potvrdit(volba)} className={`${tlacidloObrys} mt-2 w-full`}>
          {texty.ulozit[lang]}
        </button>
      ) : (
        <button type="button" onClick={() => setNastavenia(true)} className={`${tlacidloObrys} mt-2 w-full`}>
          {texty.nastavenia[lang]}
        </button>
      )}
    </section>
  );
}

// Accept and reject share one style, so neither choice is pushed harder
const tlacidlo = "rounded-full bg-sand px-4 py-3 text-[15px] font-medium text-deep transition-colors duration-300 hover:bg-aqua hover:text-ink";
const tlacidloObrys =
  "rounded-full border border-sand/40 px-4 py-2.5 text-[14px] text-sand transition-colors duration-300 hover:border-sand hover:bg-sand/10";

function Volba({
  id,
  nazov,
  text,
  zapnuta,
  zamknuta = false,
  onChange,
}: {
  id: string;
  nazov: string;
  text: string;
  zapnuta: boolean;
  zamknuta?: boolean;
  onChange?: (zapnuta: boolean) => void;
}) {
  return (
    <label htmlFor={id} className={`flex items-start gap-3 ${zamknuta ? "" : "cursor-pointer"}`}>
      <input
        id={id}
        type="checkbox"
        checked={zapnuta}
        disabled={zamknuta}
        onChange={(e) => onChange?.(e.target.checked)}
        className="mt-1 size-4 shrink-0 accent-aqua"
      />
      <span>
        <span className="block text-[15px] font-medium">{nazov}</span>
        <span className="mt-0.5 block text-[13px] leading-relaxed text-sand/75">{text}</span>
      </span>
    </label>
  );
}

/** Footer link that reopens the cookie bar; absent when the site has no analytics */
export function NastaveniaCookies({ className = "" }: { className?: string }) {
  const lang = useLang();
  if (!analytikaZapnuta) return null;
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(otvoritNastaveniaEvent))} className={className}>
      {lang === "sk" ? "Nastavenia cookies" : "Cookie settings"}
    </button>
  );
}
