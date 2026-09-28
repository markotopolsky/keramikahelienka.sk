import type { Metadata } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import { MotionProvider } from "@/components/motion-provider";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  subsets: ["latin", "latin-ext"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Keramika He-lienka · keramický ateliér a kurzy keramiky v Bratislave",
  description:
    "Ručne modelované misy, vázy, lampy a art objekty z ateliéru v Bratislave-Dúbravke. Kurzy keramiky pre dospelých aj deti.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="sk" className={`${instrumentSerif.variable} ${inter.variable} antialiased`}>
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
