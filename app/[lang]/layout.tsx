import type { Metadata } from "next";
import { Inter, Open_Sans } from "next/font/google";
import { locales, type Localized } from "@/lib/i18n";
import { infoLista, infoListaKluc } from "@/content/info-lista";
import { getLang } from "@/lib/i18n-server";
import { LocaleProvider } from "@/components/locale-provider";
import { MotionProvider } from "@/components/motion-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "../globals.css";

// Headings are sans-serif at Helena's request. Open Sans stands in until we know
// the font she liked ("Môj ateliér", question 16 in ZAZNAMNIK.md).
const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin", "latin-ext"],
});

const inter = Inter({
  variable: "--font-inter",
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

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  return {
    metadataBase: new URL("https://www.keramikahelienka.sk"),
    title: {
      default: texty.title[lang],
      template: "%s · Keramika He-lienka",
    },
    description: texty.description[lang],
  };
}

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const lang = await getLang();

  return (
    // suppressHydrationWarning: the script below may add data-info-zavreta before React hydrates
    <html lang={lang} className={`${openSans.variable} ${inter.variable} antialiased`} suppressHydrationWarning>
      <head>
        {/* Hides the info bar before the first paint if the visitor closed this version of it */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem(${JSON.stringify(infoListaKluc)})===${JSON.stringify(infoLista.id)})document.documentElement.setAttribute("data-info-zavreta","")}catch(e){}`,
          }}
        />
      </head>
      <body>
        <LocaleProvider lang={lang}>
          <MotionProvider>
            <SiteHeader />
            <main>{children}</main>
            <SiteFooter />
          </MotionProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
