"use client";

import { useState, type FormEvent } from "react";
import type { Localized } from "@/lib/i18n";
import { useLang } from "@/components/locale-provider";

const texty = {
  email: { sk: "E-mail", en: "Email" },
  placeholder: { sk: "Váš e-mail", en: "Your email" },
  odoberat: { sk: "Odoberať", en: "Subscribe" },
  prototyp: {
    sk: "Prototyp: odber zatiaľ nie je napojený na Mailchimp.",
    en: "Prototype: the subscription is not connected to Mailchimp yet.",
  },
} satisfies Record<string, Localized>;

// TODO: connect to Mailchimp. The current WordPress site collects subscribers with mc4wp (Mailchimp for WP).
export function NewsletterForm() {
  const lang = useLang();
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[26rem]">
      <label htmlFor="newsletter-email" className="sr-only">
        {texty.email[lang]}
      </label>
      <div className="flex items-center rounded-full border border-sand/40 p-1.5 pl-5 transition-colors focus-within:border-sand touch:p-1 touch:pl-5">
        <input
          id="newsletter-email"
          type="email"
          required
          placeholder={texty.placeholder[lang]}
          className="min-w-0 flex-1 self-stretch bg-transparent text-[15px] text-sand placeholder:text-sand/60 focus:outline-none touch:text-base"
        />
        <button
          type="submit"
          className="shrink-0 rounded-full bg-sand px-4 py-2 text-[14px] font-medium text-deep transition-colors hover:bg-aqua hover:text-ink touch:min-h-11"
        >
          {texty.odoberat[lang]}
        </button>
      </div>
      <p aria-live="polite" className="mt-3 min-h-5 text-[13px] text-sand/70">
        {sent ? texty.prototyp[lang] : ""}
      </p>
    </form>
  );
}
