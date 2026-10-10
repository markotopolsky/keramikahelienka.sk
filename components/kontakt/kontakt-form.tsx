"use client";

import { Suspense, useEffect, useId, useState, type FormEvent, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { kontakt, type TypDopytu } from "@/content/atelier";
import { kurzy, terminy } from "@/content/kurzy";

const typy: { id: TypDopytu; label: string }[] = [
  { id: "firmy", label: "Firmy" },
  { id: "kurzy", label: "Kurzy" },
  { id: "otazka", label: "Otázka" },
];

const odoslat: Record<TypDopytu, string> = {
  firmy: "Poslať dopyt",
  kurzy: "Odoslať prihlášku",
  otazka: "Odoslať",
};

function isTyp(value: string | null): value is TypDopytu {
  return typy.some((typ) => typ.id === value);
}

/**
 * The one form on the site: a switch for companies (teambuilding), course sign-up or a question,
 * then the fields that choice needs. Links from `formular` in content/atelier.ts open it on the right tab.
 * The fields are a first draft from the meeting notes (ZAZNAMNIK.md section 12) and will be refined.
 * TODO: phase 5 sends the message by e-mail. Before that, Helena supplies the privacy notice text for the form.
 */
export function KontaktForm({ typ: defaultTyp = "otazka" }: { typ?: TypDopytu }) {
  const [typ, setTyp] = useState<TypDopytu>(defaultTyp);
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
      {/* Reading ?typ= must not hold back the prerendered form, so it sits in its own Suspense boundary */}
      <Suspense fallback={null}>
        <TypFromUrl onTyp={setTyp} />
      </Suspense>

      <fieldset className="sm:col-span-2">
        <legend className="text-[14px] font-medium text-ink">S čím prichádzate?</legend>
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
              {t.label}
            </label>
          ))}
        </div>
      </fieldset>

      <Field id={`${id}-meno`} label="Meno" name="meno" autoComplete="name" required />
      <Field id={`${id}-telefon`} label="Telefón" name="telefon" type="tel" autoComplete="tel" required />
      <Field
        id={`${id}-email`}
        label="E-mail"
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
            <Select id={`${id}-kurz`} label="Kurz" name="kurz" options={kurzy.map((k) => k.nazov)} required />
            <Select
              id={`${id}-termin`}
              label="Termín"
              name="termin"
              options={[...terminy.map((t) => `${t.den} ${t.cas}`), "Nepravidelne, podľa dohody"]}
              required
            />
            <Field id={`${id}-pocet`} label="Počet osôb" name="pocet" type="number" min={1} max={8} defaultValue="1" required />
          </>
        )}

        {typ === "firmy" && (
          <>
            <Field id={`${id}-firma`} label="Firma" name="firma" autoComplete="organization" required />
            <Field id={`${id}-ludia`} label="Počet ľudí" name="pocet" type="number" min={1} required />
            <Choice label="Kde?" name="miesto" options={["V ateliéri v Dúbravke", "U vás vo firme"]} />
            <Choice label="Ako chcete tvoriť?" name="vysledok" options={["Spoločné dielo", "Každý vlastné", "Ešte nevieme"]} />
            <Field
              id={`${id}-kedy`}
              label="Predbežný termín"
              name="termin"
              placeholder="napríklad november, piatok poobede"
              className="sm:col-span-2"
            />
          </>
        )}

        <div className="sm:col-span-2">
          <Label htmlFor={`${id}-sprava`} required={typ === "otazka"}>
            {typ === "otazka" ? "Vaša otázka" : "Poznámka"}
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

      <div className="flex flex-col items-start gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] leading-relaxed text-drift">
          <span aria-hidden>* </span>povinné polia
          {typ === "kurzy" && (
            <>
              <br />
              Prihláška je záväzná až po zaplatení, najneskôr 7 dní pred kurzom.
            </>
          )}
          {typ === "firmy" && (
            <>
              <br />
              Pripravíme vám cenovú ponuku na mieru.
            </>
          )}
        </p>
        <button
          type="submit"
          className="shrink-0 rounded-full bg-deep px-6 py-3 text-[15px] font-medium tracking-[-0.01em] text-sand transition-colors duration-300 hover:bg-ink"
        >
          {odoslat[typ]}
        </button>
      </div>

      <p aria-live="polite" className="min-h-5 text-[14px] leading-relaxed text-deep sm:col-span-2">
        {sent ? `Prototyp: formulár zatiaľ správy neodosiela. Napíšte nám na ${kontakt.email} alebo zavolajte.` : ""}
      </p>
    </form>
  );
}

/**
 * Switches the form to the tab named in the URL, e.g. /kontakt?typ=kurzy, also when only the query changes.
 * `onTyp` must be stable (a state setter), or the effect would undo every click on the switch.
 */
function TypFromUrl({ onTyp }: { onTyp: (typ: TypDopytu) => void }) {
  const typ = useSearchParams().get("typ");
  useEffect(() => {
    if (isTyp(typ)) onTyp(typ);
  }, [typ, onTyp]);
  return null;
}

// Inputs take their background from --field, set by the card around the form
const fieldClasses =
  "mt-2 block w-full rounded-xl border border-sage bg-(--field) px-4 py-3 text-base text-ink transition-colors placeholder:text-drift/70 hover:border-sea focus:border-deep focus:outline-none";

function Label({ htmlFor, required, children }: { htmlFor?: string; required?: boolean; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="text-[14px] font-medium text-ink">
      {children}
      {required && <span aria-hidden> *</span>}
    </label>
  );
}

type FieldProps = {
  id: string;
  label: string;
  name: string;
  type?: "text" | "tel" | "email" | "number";
  autoComplete?: string;
  required?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  defaultValue?: string;
  className?: string;
};

function Field({ id, label, className = "", required = false, ...input }: FieldProps) {
  return (
    <div className={className}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <input id={id} required={required} {...input} className={fieldClasses} />
    </div>
  );
}

type SelectProps = { id: string; label: string; name: string; options: string[]; required?: boolean };

function Select({ id, label, name, options, required = false }: SelectProps) {
  return (
    <div>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <div className="relative">
        <select id={id} name={name} required={required} defaultValue="" className={`${fieldClasses} appearance-none pr-10`}>
          <option value="" disabled>
            Vyberte
          </option>
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <svg
          viewBox="0 0 12 8"
          aria-hidden
          className="pointer-events-none absolute right-4 top-1/2 mt-1 h-2 w-3 -translate-y-1/2 text-deep"
        >
          <path d="m1 1.5 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

/** A short set of radio pills for questions with two or three answers */
function Choice({ label, name, options }: { label: string; name: string; options: string[] }) {
  return (
    <fieldset>
      <legend className="text-[14px] font-medium text-ink">{label}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => (
          <label
            key={option}
            className="cursor-pointer rounded-full border border-sage bg-(--field) px-4 py-2 text-[15px] text-deep transition-colors duration-300 hover:border-sea has-checked:border-deep has-checked:bg-deep has-checked:text-sand has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-sea"
          >
            <input type="radio" name={name} value={option} className="sr-only" />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
