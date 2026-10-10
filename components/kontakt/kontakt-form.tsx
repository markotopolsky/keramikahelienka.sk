"use client";

import { useSearchParams } from "next/navigation";
import { useId, useState, type FormEvent, type ReactNode } from "react";
import type { Localized } from "@/lib/i18n";
import { kontakt } from "@/content/atelier";
import { useLang } from "@/components/locale-provider";
import { Doplnit } from "@/components/ui/doplnit";
import { LocaleLink } from "@/components/ui/locale-link";

type Typ = "otazka" | "teambuilding";

const texty = {
  typ: { sk: "Čo potrebujete?", en: "What can we help with?" },
  otazka: { sk: "Otázka", en: "A question" },
  teambuilding: { sk: "Teambuilding pre firmy", en: "Team building for companies" },
  meno: { sk: "Meno", en: "Name" },
  telefon: { sk: "Telefón", en: "Phone" },
  email: { sk: "E-mail", en: "Email" },
  firma: { sk: "Firma", en: "Company" },
  miesto: { sk: "Miesto", en: "Place" },
  miestoAtelier: { sk: "V ateliéri v Dúbravke", en: "At the studio in Dúbravka" },
  miestoFirma: { sk: "V priestoroch firmy", en: "At your company" },
  pocet: { sk: "Počet ľudí", en: "Number of people" },
  tvorba: { sk: "Tvorba", en: "Making" },
  tvorbaSpolocne: { sk: "Spoločné dielo", en: "One shared piece" },
  tvorbaKazdy: { sk: "Každý vlastný kúsok", en: "A piece for everyone" },
  termin: { sk: "Predbežný termín", en: "Preferred date" },
  sprava: { sk: "Vaša správa", en: "Your message" },
  spravaTeambuilding: { sk: "Čokoľvek ďalšie, čo by sme mali vedieť", en: "Anything else we should know" },
  povinne: { sk: "povinné polia", en: "required fields" },
  odoslat: { sk: "Odoslať", en: "Send" },
  ochrana: { sk: "Ochrana osobných údajov", en: "Privacy policy" },
  prototyp: {
    sk: `Prototyp: formulár zatiaľ správy neodosiela. Napíšte nám na ${kontakt.email} alebo zavolajte.`,
    en: `Prototype: the form does not send messages yet. Write to ${kontakt.email} or call us.`,
  },
} satisfies Record<string, Localized>;

/**
 * Reads ?typ=teambuilding, which the team building section on /kurzy links to.
 * useSearchParams needs a Suspense boundary on a static page; the page uses <KontaktForm /> as the fallback.
 */
export function KontaktFormZUrl() {
  const typ: Typ = useSearchParams().get("typ") === "teambuilding" ? "teambuilding" : "otazka";
  return <KontaktForm key={typ} predvolenyTyp={typ} />;
}

// Fields from the contact form on the original homepage, plus the team building questions
// from Helena's notes (ZAZNAMNIK.md section 12). Looks only: phase 5 sends it by e-mail.
// TODO: question 15. Does Helena want the team building fields at all?
export function KontaktForm({ predvolenyTyp = "otazka" }: { predvolenyTyp?: Typ }) {
  const lang = useLang();
  const [typ, setTyp] = useState<Typ>(predvolenyTyp);
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
      <fieldset className="sm:col-span-2">
        <legend className="mb-3 text-[14px] font-medium text-ink">{texty.typ[lang]}</legend>
        <div className="grid grid-cols-2 gap-1 rounded-full border border-sage bg-sand p-1">
          {(["otazka", "teambuilding"] as const).map((t) => (
            <label
              key={t}
              className="cursor-pointer rounded-full px-3 py-2.5 text-center text-[14px] leading-tight text-deep transition-colors hover:bg-mint has-checked:bg-deep has-checked:text-sand has-focus-visible:outline-2 has-focus-visible:outline-sea sm:text-[15px]"
            >
              <input type="radio" name="typ" value={t} checked={typ === t} onChange={() => setTyp(t)} className="sr-only" />
              {texty[t][lang]}
            </label>
          ))}
        </div>
      </fieldset>

      <Field label={texty.meno[lang]} name="meno" autoComplete="name" required />
      <Field label={texty.telefon[lang]} name="telefon" type="tel" autoComplete="tel" required />
      <Field label={texty.email[lang]} name="email" type="email" autoComplete="email" className="sm:col-span-2" />

      {typ === "teambuilding" && (
        <>
          <Field label={texty.firma[lang]} name="firma" autoComplete="organization" className="sm:col-span-2" />
          <Volby
            legend={texty.miesto[lang]}
            name="miesto"
            moznosti={[
              { value: "atelier", label: texty.miestoAtelier[lang] },
              { value: "firma", label: texty.miestoFirma[lang] },
            ]}
          />
          <Volby
            legend={texty.tvorba[lang]}
            name="tvorba"
            moznosti={[
              { value: "spolocne", label: texty.tvorbaSpolocne[lang] },
              { value: "kazdy", label: texty.tvorbaKazdy[lang] },
            ]}
          />
          <Field label={texty.pocet[lang]} name="pocet" type="number" min={1} />
          <Field label={texty.termin[lang]} name="termin" />
        </>
      )}

      <TextArea label={typ === "teambuilding" ? texty.spravaTeambuilding[lang] : texty.sprava[lang]} />

      <p className="text-[13px] leading-relaxed text-drift sm:col-span-2">
        <Doplnit>poučenie o spracovaní osobných údajov pri formulári – text dodá Helenka</Doplnit>{" "}
        <LocaleLink href="/ochrana-osobnych-udajov" className="underline underline-offset-4 hover:text-deep">
          {texty.ochrana[lang]}
        </LocaleLink>
      </p>

      <div className="flex flex-col items-start gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] text-drift">
          <span aria-hidden>* </span>
          {texty.povinne[lang]}
        </p>
        <button
          type="submit"
          className="rounded-full bg-deep px-6 py-3 text-[15px] font-medium tracking-[-0.01em] text-sand transition-colors duration-300 hover:bg-ink"
        >
          {texty.odoslat[lang]}
        </button>
      </div>

      <p aria-live="polite" className="min-h-5 text-[14px] leading-relaxed text-deep sm:col-span-2">
        {sent ? texty.prototyp[lang] : ""}
      </p>
    </form>
  );
}

const inputClass =
  "mt-2 block w-full rounded-xl border border-sage bg-sand px-4 py-3 text-base text-ink transition-colors hover:border-sea focus:border-deep focus:outline-none";

type FieldProps = {
  label: string;
  name: string;
  type?: "text" | "tel" | "email" | "number";
  autoComplete?: string;
  required?: boolean;
  min?: number;
  className?: string;
};

function Field({ label, name, type = "text", autoComplete, required = false, min, className = "" }: FieldProps) {
  const id = `sprava-${name}`;
  return (
    <div className={className}>
      <label htmlFor={id} className="text-[14px] font-medium text-ink">
        {label}
        {required && <span aria-hidden> *</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        min={min}
        inputMode={type === "number" ? "numeric" : undefined}
        className={inputClass}
      />
    </div>
  );
}

function TextArea({ label }: { label: string }) {
  return (
    <div className="sm:col-span-2">
      <label htmlFor="sprava-text" className="text-[14px] font-medium text-ink">
        {label}
      </label>
      <textarea id="sprava-text" name="sprava" rows={5} className={`${inputClass} resize-y`} />
    </div>
  );
}

function Volby({ legend, name, moznosti }: { legend: string; name: string; moznosti: { value: string; label: ReactNode }[] }) {
  const id = useId();
  return (
    <fieldset>
      <legend className="text-[14px] font-medium text-ink">{legend}</legend>
      <div className="mt-2 grid gap-2">
        {moznosti.map((m) => (
          <label
            key={m.value}
            htmlFor={`${id}-${m.value}`}
            className="flex cursor-pointer items-center gap-3 rounded-xl border border-sage bg-sand px-4 py-3 text-[15px] text-ink transition-colors hover:border-sea has-checked:border-deep"
          >
            <input id={`${id}-${m.value}`} type="radio" name={name} value={m.value} className="size-4 accent-deep" />
            {m.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
