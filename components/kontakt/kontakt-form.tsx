"use client";

import { Suspense, useEffect, useId, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import type { Localized } from "@/lib/i18n";
import type { TypDopytu } from "@/content/atelier";
import type { Kurz, Termin } from "@/lib/content";
import { useLang } from "@/components/locale-provider";
import { Doplnit } from "@/components/ui/doplnit";
import { Choice, Field, Label, Select, fieldClasses } from "@/components/ui/form-fields";
import { LocaleLink } from "@/components/ui/locale-link";

const typy: { id: TypDopytu; label: Localized }[] = [
  { id: "firmy", label: { sk: "Firmy", en: "Companies" } },
  { id: "kurzy", label: { sk: "Kurzy", en: "Classes" } },
  { id: "otazka", label: { sk: "Otázka", en: "Question" } },
];

const odoslat: Record<TypDopytu, Localized> = {
  firmy: { sk: "Poslať dopyt", en: "Send enquiry" },
  kurzy: { sk: "Odoslať prihlášku", en: "Send sign-up" },
  otazka: { sk: "Odoslať", en: "Send" },
};

const texty = {
  typ: { sk: "S čím prichádzate?", en: "What brings you here?" },
  meno: { sk: "Meno", en: "Name" },
  telefon: { sk: "Telefón", en: "Phone" },
  email: { sk: "E-mail", en: "Email" },
  kurz: { sk: "Kurz", en: "Class" },
  termin: { sk: "Termín", en: "Time" },
  nepravidelne: { sk: "Nepravidelne, podľa dohody", en: "Irregular, by arrangement" },
  pocetOsob: { sk: "Počet osôb", en: "Number of people" },
  firma: { sk: "Firma", en: "Company" },
  pocetLudi: { sk: "Počet ľudí", en: "Number of people" },
  kde: { sk: "Kde?", en: "Where?" },
  kdeAtelier: { sk: "V ateliéri v Dúbravke", en: "At the studio in Dúbravka" },
  kdeFirma: { sk: "U vás vo firme", en: "At your company" },
  ako: { sk: "Ako chcete tvoriť?", en: "How would you like to work?" },
  akoSpolocne: { sk: "Spoločné dielo", en: "One shared piece" },
  akoKazdy: { sk: "Každý vlastné", en: "A piece for everyone" },
  akoNevieme: { sk: "Ešte nevieme", en: "Not sure yet" },
  kedy: { sk: "Predbežný termín", en: "Preferred date" },
  kedyPriklad: { sk: "napríklad november, piatok poobede", en: "for example November, a Friday afternoon" },
  otazka: { sk: "Vaša otázka", en: "Your question" },
  poznamka: { sk: "Poznámka", en: "Note" },
  vyberte: { sk: "Vyberte", en: "Choose" },
  povinne: { sk: "povinné polia", en: "required fields" },
  zavazna: {
    sk: "Prihláška je záväzná až po zaplatení, najneskôr 7 dní pred kurzom.",
    en: "The sign-up is binding once paid, at the latest 7 days before the class.",
  },
  ponuka: { sk: "Pripravíme vám cenovú ponuku na mieru.", en: "We will prepare a custom quote for you." },
  ochrana: { sk: "Ochrana osobných údajov", en: "Privacy policy" },
  prototyp: {
    sk: "Prototyp: formulár zatiaľ správy neodosiela. Napíšte nám na {email} alebo zavolajte.",
    en: "Prototype: the form does not send messages yet. Write to {email} or call us.",
  },
} satisfies Record<string, Localized>;

function isTyp(value: string | null): value is TypDopytu {
  return typy.some((typ) => typ.id === value);
}

/**
 * The form on the site. With `typ` it is fixed to that kind (the sign-up on /kurzy, the enquiry on /pre-firmy);
 * without it a switch picks companies (teambuilding), course sign-up or a question (the homepage and /kontakt),
 * and the fields follow the choice. Links from `formular` in content/atelier.ts open the right one.
 * The fields are a first draft from the meeting notes (ZAZNAMNIK.md section 12) and will be refined (question 15).
 * TODO: phase 5 sends the message by e-mail. Before that, Helena supplies the privacy notice text for the form.
 */
type KontaktFormProps = {
  /** Fixed kind of form, without the switch */
  typ?: TypDopytu;
  /** Slug of the course chosen at first in the sign-up (on /kurzy/<slug>); ?kurz=<slug> in the URL wins */
  kurz?: string;
  /** Course names and class times for the sign-up tab, from /admin */
  kurzy: Kurz[];
  terminy: Termin[];
  email: string;
};

export function KontaktForm({ typ: pevnyTyp, kurz, kurzy, terminy, email }: KontaktFormProps) {
  const lang = useLang();
  const [typ, setTyp] = useState<TypDopytu>(pevnyTyp ?? "otazka");
  const [kurzSlug, setKurzSlug] = useState(kurz);
  const zvolenyKurz = kurzy.find((k) => k.slug === kurzSlug)?.nazov ?? "";
  const [sent, setSent] = useState(false);
  const id = useId();

  function chooseTyp(next: TypDopytu) {
    setTyp(next);
    setSent(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
      {/* Reading the URL must not hold back the prerendered form, so it sits in its own Suspense boundary */}
      <Suspense fallback={null}>
        <ZUrl onTyp={pevnyTyp ? undefined : setTyp} onKurz={setKurzSlug} />
      </Suspense>

      {pevnyTyp ? (
        <input type="hidden" name="typ" value={pevnyTyp} />
      ) : (
        <>
          <fieldset className="sm:col-span-2">
            <legend className="text-[14px] font-medium text-ink">{texty.typ[lang]}</legend>
            <div className="mt-2 grid grid-cols-3 gap-1 rounded-full border border-sage bg-(--field) p-1">
              {typy.map((t) => (
                <label
                  key={t.id}
                  className="cursor-pointer rounded-full px-2 py-2.5 text-center text-[15px] font-medium text-deep transition-colors duration-300 hover:bg-sage/50 has-checked:bg-deep has-checked:text-sand has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-sea"
                >
                  <input
                    type="radio"
                    name="typ"
                    value={t.id}
                    checked={typ === t.id}
                    onChange={() => chooseTyp(t.id)}
                    className="sr-only"
                  />
                  {t.label[lang]}
                </label>
              ))}
            </div>
          </fieldset>
        </>
      )}

      <Field id={`${id}-meno`} label={texty.meno[lang]} name="meno" autoComplete="name" required />
      <Field id={`${id}-telefon`} label={texty.telefon[lang]} name="telefon" type="tel" autoComplete="tel" required />
      <Field
        id={`${id}-email`}
        label={texty.email[lang]}
        name="email"
        type="email"
        autoComplete="email"
        required={typ !== "otazka"}
        className="sm:col-span-2"
      />

      {/* Keyed by the choice, so the new fields fade in when the switch changes */}
      <div key={typ} className="grid gap-5 sm:col-span-2 sm:grid-cols-2 motion-safe:animate-fade-in">
        {typ === "kurzy" && (
          <>
            {/* Keyed by the course, so a course from the URL is chosen once it has been read */}
            <Select
              key={zvolenyKurz}
              id={`${id}-kurz`}
              label={texty.kurz[lang]}
              placeholder={texty.vyberte[lang]}
              name="kurz"
              options={kurzy.map((k) => k.nazov)}
              defaultValue={zvolenyKurz}
              required
            />
            <Select
              id={`${id}-termin`}
              label={texty.termin[lang]}
              placeholder={texty.vyberte[lang]}
              name="termin"
              options={[...terminy.map((t) => `${t.den} ${t.cas}`.trim()), texty.nepravidelne[lang]]}
              required
            />
            <Field
              id={`${id}-pocet`}
              label={texty.pocetOsob[lang]}
              name="pocet"
              type="number"
              min={1}
              max={8}
              defaultValue="1"
              required
            />
          </>
        )}

        {typ === "firmy" && (
          <>
            <Field id={`${id}-firma`} label={texty.firma[lang]} name="firma" autoComplete="organization" required />
            <Field id={`${id}-ludia`} label={texty.pocetLudi[lang]} name="pocet" type="number" min={1} required />
            <Choice
              label={texty.kde[lang]}
              name="miesto"
              options={[
                { value: "atelier", label: texty.kdeAtelier[lang] },
                { value: "firma", label: texty.kdeFirma[lang] },
              ]}
            />
            <Choice
              label={texty.ako[lang]}
              name="vysledok"
              options={[
                { value: "spolocne", label: texty.akoSpolocne[lang] },
                { value: "kazdy", label: texty.akoKazdy[lang] },
                { value: "nevieme", label: texty.akoNevieme[lang] },
              ]}
            />
            <Field
              id={`${id}-kedy`}
              label={texty.kedy[lang]}
              name="termin"
              placeholder={texty.kedyPriklad[lang]}
              className="sm:col-span-2"
            />
          </>
        )}

        <div className="sm:col-span-2">
          <Label htmlFor={`${id}-sprava`} required={typ === "otazka"}>
            {typ === "otazka" ? texty.otazka[lang] : texty.poznamka[lang]}
          </Label>
          <textarea
            id={`${id}-sprava`}
            name="sprava"
            rows={typ === "otazka" ? 5 : 3}
            required={typ === "otazka"}
            className={`${fieldClasses} resize-y`}
          />
        </div>
      </div>

      <p className="text-[13px] leading-relaxed text-drift sm:col-span-2">
        <Doplnit>poučenie o spracovaní osobných údajov pri formulári – text dodá Helenka</Doplnit>{" "}
        <LocaleLink href="/ochrana-osobnych-udajov" className="underline underline-offset-4 hover:text-deep">
          {texty.ochrana[lang]}
        </LocaleLink>
      </p>

      <div className="flex flex-col items-start gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] leading-relaxed text-drift">
          <span aria-hidden>* </span>
          {texty.povinne[lang]}
          {typ === "kurzy" && (
            <>
              <br />
              {texty.zavazna[lang]}
            </>
          )}
          {typ === "firmy" && (
            <>
              <br />
              {texty.ponuka[lang]}
            </>
          )}
        </p>
        <button
          type="submit"
          className="shrink-0 rounded-full bg-deep px-6 py-3 text-[15px] font-medium tracking-[-0.01em] text-sand transition-colors duration-300 hover:bg-ink"
        >
          {odoslat[typ][lang]}
        </button>
      </div>

      <p aria-live="polite" className="min-h-5 text-[14px] leading-relaxed text-deep sm:col-span-2">
        {sent ? texty.prototyp[lang].replace("{email}", email) : ""}
      </p>
    </form>
  );
}

/**
 * Applies the URL: ?typ= switches the tab (e.g. /kontakt?typ=kurzy), ?kurz=<slug> chooses the course,
 * also when only the query changes. The callbacks must be stable (state setters), or the effects
 * would undo every click on the switch. Without `onTyp` (a fixed form) ?typ= is ignored.
 */
function ZUrl({ onTyp, onKurz }: { onTyp?: (typ: TypDopytu) => void; onKurz: (slug: string) => void }) {
  const params = useSearchParams();
  const typ = params.get("typ");
  const kurz = params.get("kurz");
  useEffect(() => {
    if (onTyp && isTyp(typ)) onTyp(typ);
  }, [typ, onTyp]);
  useEffect(() => {
    if (kurz) onKurz(kurz);
  }, [kurz, onKurz]);
  return null;
}
