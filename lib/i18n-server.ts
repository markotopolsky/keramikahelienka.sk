import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "@/lib/i18n";

/** Language of the current page, for Server Components. Client Components use `useLang()`. */
export async function getLang(): Promise<Locale> {
  const value = await lang();
  // undefined under app/admin, the one root layout without a language
  if (!value || !hasLocale(value)) notFound();
  return value;
}
