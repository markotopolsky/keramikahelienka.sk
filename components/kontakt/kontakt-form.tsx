"use client";

import { useState, type FormEvent } from "react";
import { kontakt } from "@/content/atelier";

// Fields from the contact form on the original homepage.
// TODO: phase 5 sends the message by e-mail. Before that, Helena supplies the privacy notice text for the form.
export function KontaktForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
      <Field label="Meno" name="meno" autoComplete="name" required />
      <Field label="Telefón" name="telefon" type="tel" autoComplete="tel" required />
      <Field label="E-mail" name="email" type="email" autoComplete="email" className="sm:col-span-2" />
      <div className="sm:col-span-2">
        <label htmlFor="sprava-text" className="text-[14px] font-medium text-ink">
          Vaša správa
        </label>
        <textarea
          id="sprava-text"
          name="sprava"
          rows={5}
          className="mt-2 block w-full resize-y rounded-xl border border-sage bg-sand px-4 py-3 text-base text-ink transition-colors placeholder:text-drift/70 hover:border-sea focus:border-deep focus:outline-none"
        />
      </div>

      <div className="flex flex-col items-start gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] text-drift">
          <span aria-hidden>* </span>povinné polia
        </p>
        <button
          type="submit"
          className="rounded-full bg-deep px-6 py-3 text-[15px] font-medium tracking-[-0.01em] text-sand transition-colors duration-300 hover:bg-ink"
        >
          Odoslať
        </button>
      </div>

      <p aria-live="polite" className="min-h-5 text-[14px] leading-relaxed text-deep sm:col-span-2">
        {sent ? `Prototyp: formulár zatiaľ správy neodosiela. Napíšte nám na ${kontakt.email} alebo zavolajte.` : ""}
      </p>
    </form>
  );
}

type FieldProps = {
  label: string;
  name: string;
  type?: "text" | "tel" | "email";
  autoComplete?: string;
  required?: boolean;
  className?: string;
};

function Field({ label, name, type = "text", autoComplete, required = false, className = "" }: FieldProps) {
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
        className="mt-2 block w-full rounded-xl border border-sage bg-sand px-4 py-3 text-base text-ink transition-colors hover:border-sea focus:border-deep focus:outline-none"
      />
    </div>
  );
}
