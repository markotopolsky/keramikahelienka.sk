import type { Metadata } from "next";
import { Playfair_Display, PT_Serif } from "next/font/google";
import { locales } from "@/lib/i18n";
import { infoListaKluc } from "@/content/info-lista";
import { getContent, getInfoLista, getKontakt, getPopup } from "@/lib/content";
import { getLang } from "@/lib/i18n-server";
import { analytikaZapnuta, suhlasPredvolenySkript } from "@/lib/analytika";
import { webUrl, zakladOpenGraph } from "@/lib/metadata";
import { LocaleProvider } from "@/components/locale-provider";
import { MotionProvider } from "@/components/motion-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CookieLista } from "@/components/cookie-lista";
import { Popup } from "@/components/popup";
import "../globals.css";

// Serif site-wide (fint z muoiatelier.com/en: Playfair Display na nadpisy, PT Serif na text).
// Prepisuje pôvodnú požiadavku na bezpätkové písmo (otázka 16 v ZAZNAMNIK.md) — treba dať Helenke schváliť.
const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin", "latin-ext"],
});

const ptSerif = PT_Serif({
  variable: "--font-pt-serif",
  weight: ["400", "700"],
  subsets: ["latin", "latin-ext"],
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

// Any other value is a 404 (app/global-not-found.tsx)
export const dynamicParams = false;

// Fallback only: every save in /admin revalidates the texts and products right away (app/api/revalidate)
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  const seo = await getContent("seo", lang);
  const title = seo["seo.titulok"];
  const description = seo["seo.popis"];
  return {
    metadataBase: new URL(webUrl),
    title: {
      default: title,
      template: "%s · Keramika He-lienka",
    },
    description,
    openGraph: { ...zakladOpenGraph(lang), title, description },
    // Google Search Console ownership check (HTML tag method); the value comes from .env
    ...(process.env.GOOGLE_SITE_VERIFICATION && { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }),
  };
}

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const lang = await getLang();
  const [infoLista, kontakt, popup] = await Promise.all([getInfoLista(lang), getKontakt(), getPopup(lang)]);

  return (
    // suppressHydrationWarning: the script below may add data-info-zavreta before React hydrates
    <html lang={lang} className={`${playfairDisplay.variable} ${ptSerif.variable} antialiased`} suppressHydrationWarning>
      <head>
        {/* Hides the info bar before the first paint if the visitor closed this version of it */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem(${JSON.stringify(infoListaKluc)})===${JSON.stringify(infoLista.verzia)})document.documentElement.setAttribute("data-info-zavreta","")}catch(e){}`,
          }}
        />
        {/* Google Consent Mode: everything "denied" until the visitor chooses in the cookie bar */}
        {analytikaZapnuta && <script dangerouslySetInnerHTML={{ __html: suhlasPredvolenySkript }} />}
      </head>
      <body>
        <LocaleProvider lang={lang}>
          <MotionProvider>
            <SiteHeader infoLista={infoLista} kontakt={kontakt} />
            <main>{children}</main>
            <SiteFooter />
            <CookieLista />
            <Popup popup={popup} />
          </MotionProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
