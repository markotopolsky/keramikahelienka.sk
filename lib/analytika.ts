// Analytics and the visitor's cookie consent (ZAZNAMNIK.md section 15, phase 6).
//
// Nothing from Google or Microsoft loads before the visitor agrees. The IDs come from env variables
// (see .env.example); with none set, the site has no analytics, no cookie bar and no
// "Cookie settings" link. GA4 and Clarity load straight from here. Google Tag Manager is
// the container for anything Helena adds later (e.g. ads): every tag in it must respect the
// Consent Mode signals below. Do not add GA4 inside GTM as well, or every visit counts twice.

export const analytika = {
  gtm: process.env.NEXT_PUBLIC_GTM_ID ?? "",
  ga4: process.env.NEXT_PUBLIC_GA4_ID ?? "",
  clarity: process.env.NEXT_PUBLIC_CLARITY_ID ?? "",
};

export const analytikaZapnuta = Boolean(analytika.gtm || analytika.ga4 || analytika.clarity);

/** Marketing cookies exist only through GTM, so without it the bar offers analytics only */
export const marketingZapnuty = Boolean(analytika.gtm);

/** Key in localStorage. Raise `verzia` when the categories change, so everyone is asked again. */
export const suhlasKluc = "kh-suhlas-cookies";
const verzia = 1;

export type Suhlas = { analyticke: boolean; marketingove: boolean };
type UlozenySuhlas = Suhlas & { verzia: number; datum: string };

/** Sent by the footer link; the cookie bar listens for it and opens its settings */
export const otvoritNastaveniaEvent = "kh-nastavenia-cookies";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    clarity?: ((...args: unknown[]) => void) & { q?: unknown[] };
  }
}

export function nacitajSuhlas(): Suhlas | null {
  try {
    const ulozeny = JSON.parse(localStorage.getItem(suhlasKluc) ?? "null") as UlozenySuhlas | null;
    if (!ulozeny || ulozeny.verzia !== verzia) return null;
    return { analyticke: ulozeny.analyticke, marketingove: ulozeny.marketingove };
  } catch {
    return null;
  }
}

export function ulozSuhlas(suhlas: Suhlas) {
  const zaznam: UlozenySuhlas = { ...suhlas, verzia, datum: new Date().toISOString() };
  try {
    localStorage.setItem(suhlasKluc, JSON.stringify(zaznam));
  } catch {
    // Private mode without storage: the choice holds until the next page load
  }
}

function stav(povolene: boolean) {
  return povolene ? "granted" : "denied";
}

/** Loads a script once; returns false if it was already on the page */
function nacitajSkript(src: string) {
  if (document.querySelector(`script[src="${src}"]`)) return false;
  const script = document.createElement("script");
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
  return true;
}

/**
 * Applies a consent: updates Google Consent Mode and loads the services the visitor allowed.
 * The inline script in app/[lang]/layout.tsx has already set every signal to "denied"
 * and defined window.gtag. Withdrawing consent needs a page reload to unload the scripts.
 */
export function pouziSuhlas(suhlas: Suhlas) {
  const gtag = window.gtag!;
  gtag("consent", "update", {
    analytics_storage: stav(suhlas.analyticke),
    ad_storage: stav(suhlas.marketingove),
    ad_user_data: stav(suhlas.marketingove),
    ad_personalization: stav(suhlas.marketingove),
  });

  if (analytika.gtm && (suhlas.analyticke || suhlas.marketingove)) {
    if (nacitajSkript(`https://www.googletagmanager.com/gtm.js?id=${analytika.gtm}`))
      window.dataLayer!.push({ "gtm.start": Date.now(), event: "gtm.js" });
  }

  if (analytika.ga4 && suhlas.analyticke) {
    if (nacitajSkript(`https://www.googletagmanager.com/gtag/js?id=${analytika.ga4}`)) {
      gtag("js", new Date());
      gtag("config", analytika.ga4);
    }
  }

  if (analytika.clarity && suhlas.analyticke) {
    // The queue stub from Clarity's own snippet; the script replays it once it loads
    window.clarity =
      window.clarity ??
      function () {
        // eslint-disable-next-line prefer-rest-params
        (window.clarity!.q = window.clarity!.q ?? []).push(arguments);
      };
    // Clarity waits for this signal before it sets cookies for visitors from the EU
    window.clarity("consentv2", { ad_Storage: stav(suhlas.marketingove), analytics_Storage: "granted" });
    nacitajSkript(`https://www.clarity.ms/tag/${analytika.clarity}`);
  }
}

/** Removes the analytics cookies on this domain after the visitor withdraws consent */
export function zmazAnalytickeCookies() {
  const domena = location.hostname.replace(/^www\./, "");
  for (const cookie of document.cookie.split(";")) {
    const nazov = cookie.split("=")[0].trim();
    if (!/^(_ga|_gid|_gcl|_clck|_clsk)/.test(nazov)) continue;
    for (const domain of ["", `; domain=${domena}`, `; domain=.${domena}`]) {
      document.cookie = `${nazov}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain}`;
    }
  }
}

/**
 * Runs in <head> before anything else: every Consent Mode signal starts as "denied",
 * so a Google tag never sets cookies before the visitor chooses.
 */
export const suhlasPredvolenySkript = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("consent","default",{ad_storage:"denied",ad_user_data:"denied",ad_personalization:"denied",analytics_storage:"denied",functionality_storage:"granted",security_storage:"granted"});`;
