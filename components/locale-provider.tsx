"use client";

import { createContext, useContext, type ReactNode } from "react";
import { defaultLocale, type Locale } from "@/lib/i18n";

const LocaleContext = createContext<Locale>(defaultLocale);

/** Hands the page language from the root layout to Client Components. */
export function LocaleProvider({ lang, children }: { lang: Locale; children: ReactNode }) {
  return <LocaleContext value={lang}>{children}</LocaleContext>;
}

export function useLang() {
  return useContext(LocaleContext);
}
