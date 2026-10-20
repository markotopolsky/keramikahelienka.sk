// Languages of the site. Slovak lives at the root (/kurzy), English under /en (/en/kurzy),
// the same as on the original site. proxy.ts maps the root onto app/[lang] with lang "sk".
//
// Every text on the site is stored as a { sk, en } pair (type Localized), so a page cannot
// exist in one language only. The English texts were translated once with AI and saved in
// the files; nothing is translated at runtime.

export const locales = ["sk", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "sk";

export type Localized<T = string> = Record<Locale, T>;

export const languageNames: Localized = { sk: "Slovensky", en: "English" };

export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * Turns a Slovak site path into the path for the given language:
 * "/kurzy#cennik" → "/en/kurzy#cennik", "/" → "/en". External links, e-mail,
 * phone and in-page anchors are returned unchanged.
 */
export function localizeHref(href: string, lang: Locale) {
  if (lang === defaultLocale || !href.startsWith("/") || href.startsWith("//")) return href;
  const cut = href.search(/[?#]/);
  const path = cut === -1 ? href : href.slice(0, cut);
  const rest = cut === -1 ? "" : href.slice(cut);
  return `/${lang}${path === "/" ? "" : path}${rest}`;
}

/** Wraps a quotation in the language's quotation marks: „…“ in Slovak, “…” in English. */
export function quote(text: string, lang: Locale) {
  return lang === "sk" ? `„${text}“` : `“${text}”`;
}

/**
 * Keeps one-letter words (a, i, k, o, s, u, v, z) off the end of a line, as Slovak typesetting
 * requires: the space after them becomes a non-breaking one. On a phone "Teambuilding s hlinou"
 * then breaks before "s hlinou", never after "s". Harmless in English ("a piece", "I make").
 */
export function bindShortWords(text: string) {
  return text.replace(/(?<=^|[\s(„“"])([aikosuvz]) /gi, "$1 ");
}

/** "129 €" in Slovak, "€129" in English. Cents only when the price has them: "7,90 €". */
export function formatPrice(eur: number, lang: Locale) {
  const digits = Number.isInteger(eur) ? 0 : 2;
  return new Intl.NumberFormat(lang === "sk" ? "sk-SK" : "en-IE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(eur);
}

/** Slovak has three plural forms (1 kúsok, 2 – 4 kúsky, 5 kúskov), English two */
export function plural(n: number, lang: Locale, forms: { sk: [string, string, string]; en: [string, string] }) {
  if (lang === "en") return `${n} ${n === 1 ? forms.en[0] : forms.en[1]}`;
  return `${n} ${n === 1 ? forms.sk[0] : n >= 2 && n <= 4 ? forms.sk[1] : forms.sk[2]}`;
}

/** "10. novembra 2023" / "10 November 2023" */
export function formatDate(isoDate: string, lang: Locale) {
  return new Intl.DateTimeFormat(lang === "sk" ? "sk-SK" : "en-GB", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(`${isoDate}T12:00:00`),
  );
}
