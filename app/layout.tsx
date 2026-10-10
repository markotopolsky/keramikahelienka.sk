import type { Metadata } from "next";
import { Inter, Open_Sans } from "next/font/google";
import { MotionProvider } from "@/components/motion-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

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

export const metadata: Metadata = {
  title: {
    default: "Keramika He-lienka · keramický ateliér a kurzy keramiky v Bratislave",
    template: "%s · Keramika He-lienka",
  },
  description:
    "Ručne modelované misy, vázy, lampy a art objekty z ateliéru v Bratislave-Dúbravke. Kurzy keramiky pre dospelých aj deti.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="sk" className={`${openSans.variable} ${inter.variable} antialiased`}>
      <body>
        <MotionProvider>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </MotionProvider>
      </body>
    </html>
  );
}
