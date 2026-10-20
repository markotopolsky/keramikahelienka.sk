import type { Metadata } from "next";
import { Playfair_Display, PT_Serif } from "next/font/google";
import { locales, type Localized } from "@/lib/i18n";
import { infoLista, infoListaKluc } from "@/content/info-lista";
import { getLang } from "@/lib/i18n-server";
import { analytikaZapnuta, suhlasPredvolenySkript } from "@/lib/analytika";
import { webUrl, zakladOpenGraph } from "@/lib/metadata";
import { LocaleProvider } from "@/components/locale-provider";
import { MotionProvider } from "@/components/motion-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CookieLista } from "@/components/cookie-lista";
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

const texty = {
  title: {
    sk: "Keramika He-lienka · keramický ateliér a kurzy keramiky v Bratislave",
    en: "Keramika He-lienka · ceramics studio and pottery classes in Bratislava",
  },
  description: {
    sk: "Ručne modelované misy, vázy, lampy a art objekty z ateliéru v Bratislave-Dúbravke. Kurzy keramiky pre dospelých aj deti.",
    en: "Hand-built bowls, vases, lamps and art objects from a studio in Bratislava-Dúbravka. Pottery classes for adults and children.",
  },
} satisfies Record<string, Localized>;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

// Any other value is a 404 (app/global-not-found.tsx)
export const dynamicParams = false;

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return {
    metadataBase: new URL(webUrl),
    title: {
      default: texty.title[lang],
      template: "%s · Keramika He-lienka",
    },
    description: texty.description[lang],
    openGraph: { ...zakladOpenGraph(lang), title: texty.title[lang], description: texty.description[lang] },
    // Google Search Console ownership check (HTML tag method); the value comes from .env
    ...(process.env.GOOGLE_SITE_VERIFICATION && { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }),
  };
}

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const lang = await getLang();

  return (
    // suppressHydrationWarning: the script below may add data-info-zavreta before React hydrates
    <html lang={lang} className={`${playfairDisplay.variable} ${ptSerif.variable} antialiased`} suppressHydrationWarning>
      <head>
        {/* Hides the info bar before the first paint if the visitor closed this version of it */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem(${JSON.stringify(infoListaKluc)})===${JSON.stringify(infoLista.id)})document.documentElement.setAttribute("data-info-zavreta","")}catch(e){}`,
          }}
        />
        {/* Google Consent Mode: everything "denied" until the visitor chooses in the cookie bar */}
        {analytikaZapnuta && <script dangerouslySetInnerHTML={{ __html: suhlasPredvolenySkript }} />}
      </head>
      <body>
        <LocaleProvider lang={lang}>
          <MotionProvider>
            <SiteHeader />
            <main>{children}</main>
            <SiteFooter />
            <CookieLista />
          </MotionProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
