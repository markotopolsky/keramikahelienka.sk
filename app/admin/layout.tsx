import type { Metadata } from "next";
import { PT_Serif } from "next/font/google";
import "../globals.css";

// /admin has its own root layout: the site's layout lives in app/[lang] and brings the header,
// footer and cookie bar, which have no place here. proxy.ts leaves /admin out of the language rewrite.
const ptSerif = PT_Serif({
  variable: "--font-pt-serif",
  weight: ["400", "700"],
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Administrácia · Keramika He-lienka",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sk" className={`${ptSerif.variable} antialiased`}>
      <body className="min-h-svh bg-sand text-ink">{children}</body>
    </html>
  );
}
