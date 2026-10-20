import type { Metadata } from "next";
import { Playfair_Display, PT_Serif } from "next/font/google";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { TornEdge } from "@/components/ui/torn-edge";
import "./globals.css";

// The 404 page for every unknown address. It lives outside app/[lang], so it has no language:
// it says the same in Slovak and English and offers both versions of the site.
// It is a full document without the site header and footer (they need the page language).

const playfairDisplay = Playfair_Display({ variable: "--font-playfair-display", subsets: ["latin", "latin-ext"] });
const ptSerif = PT_Serif({ variable: "--font-pt-serif", weight: ["400", "700"], subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = {
  title: "Stránka sa nenašla · Page not found · Keramika He-lienka",
};

const odkazy = [
  { href: "/", sk: "Domov", en: "Home" },
  { href: "/obchod", sk: "Obchod", en: "Shop" },
  { href: "/kurzy", sk: "Kurzy", en: "Classes" },
  { href: "/kontakt", sk: "Kontakt", en: "Contact" },
];

export default function GlobalNotFound() {
  return (
    <html lang="sk" className={`${playfairDisplay.variable} ${ptSerif.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col bg-sand">
        <section className="bg-deep text-sand">
          <div className="site-container flex h-16 items-center lg:h-20">
            <Link href="/" className="w-32 lg:w-40">
              <Logo farba="text" className="w-full" />
            </Link>
          </div>
          <div className="site-container pb-16 pt-16 md:pb-24 md:pt-24">
            <p className="eyebrow text-aqua">404</p>
            <h1 className="mt-5 max-w-[52rem] text-display">Táto stránka neexistuje</h1>
            <p className="mt-7 max-w-[36rem] text-lead text-sand/90">
              Možno ste prišli cez starý odkaz. Web má novú podobu a niektoré adresy sa zmenili.
            </p>
            <ul className="mt-8 flex flex-wrap gap-3">
              {odkazy.map((o, i) => (
                <li key={o.href}>
                  <Link
                    href={o.href}
                    className={`inline-flex rounded-full px-5 py-3 text-[15px] font-medium tracking-[-0.01em] transition-colors duration-300 ${
                      i === 0 ? "bg-aqua text-ink hover:bg-sand" : "border border-current hover:border-sand hover:bg-sand hover:text-deep"
                    }`}
                  >
                    {o.sk}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <TornEdge className="-mb-px text-sand" />
        </section>

        <section lang="en" className="site-container flex-1 py-14 md:py-20">
          <h2 className="text-h3 text-deep">This page does not exist</h2>
          <p className="mt-4 max-w-[36rem] text-base leading-relaxed text-ink/80 md:text-[17px]">
            You may have followed an old link. The website has a new look and some addresses have changed.
          </p>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[15px]">
            {odkazy.map((o) => (
              <li key={o.href}>
                <Link href={o.href === "/" ? "/en" : `/en${o.href}`} className="text-deep underline decoration-sage underline-offset-4 hover:decoration-deep">
                  {o.en}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </body>
    </html>
  );
}
