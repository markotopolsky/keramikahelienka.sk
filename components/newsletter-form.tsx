"use client";

import { useState, type FormEvent } from "react";

// TODO: connect to Mailchimp. The current WordPress site collects subscribers with mc4wp (Mailchimp for WP).
export function NewsletterForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[26rem]">
      <label htmlFor="newsletter-email" className="sr-only">
        E-mail
      </label>
      <div className="flex items-center rounded-full border border-sand/40 p-1.5 pl-5 transition-colors focus-within:border-sand">
        <input
          id="newsletter-email"
          type="email"
          required
          placeholder="Váš e-mail"
          className="min-w-0 flex-1 bg-transparent text-[15px] text-sand placeholder:text-sand/60 focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-full bg-sand px-4 py-2 text-[14px] font-medium text-deep transition-colors hover:bg-aqua hover:text-ink"
        >
          Odoberať
        </button>
      </div>
      <p aria-live="polite" className="mt-3 min-h-5 text-[13px] text-sand/70">
        {sent ? "Prototyp: odber zatiaľ nie je napojený na Mailchimp." : ""}
      </p>
    </form>
  );
}
