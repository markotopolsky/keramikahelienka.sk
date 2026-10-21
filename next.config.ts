import type { NextConfig } from "next";

// Addresses of the old WordPress site (ZAZNAMNIK.md §4) → the new pages, so links and search
// results keep working. Each one also exists under /en, as TranslatePress served English there.
const stareAdresy: [zdroj: string, ciel: string][] = [
  ["/o_nas", "/o-mne"],
  ["/kurzy-keramiky", "/kurzy"],
  ["/workshopy", "/kurzy/workshop"],
  ["/keramikaayogavnebi", "/kurzy"],
  ["/tvorba", "/o-mne"],
  ["/galeria", "/obchod"],
  ["/galeria-2", "/obchod"],
  ["/domov-2", "/"],
  ["/kontrola-objednavky", "/pokladna"],
  ["/moj-ucet", "/"],
  ["/obchod/page/:strana(\\d+)", "/obchod"],
  ["/produkt/:slug", "/obchod/:slug"],
  ["/kategoria-produktu/sperky/blue-river", "/obchod?kategoria=sperky"],
  ["/kategoria-produktu/kurzy-courses", "/obchod?kategoria=kurzy"],
  ["/kategoria-produktu/poukazky-vouchers", "/obchod?kategoria=poukazky"],
  ["/kategoria-produktu/:kategoria(vazy|misy|sperky|lampy|salky)", "/obchod?kategoria=:kategoria"],
  ["/kategoria-produktu/:cesta*", "/obchod"],
  ["/znacka-produktu/:cesta*", "/obchod"],
  ["/2023/11/10/proces-vyroby-keramiky", "/blog/proces-vyroby-keramiky"],
  ["/2023/11/11/uprava-salky-po-odliati", "/blog/uprava-salky-po-odliati"],
];

const nextConfig: NextConfig = {
  redirects() {
    return stareAdresy.flatMap(([zdroj, ciel]) => [
      { source: zdroj, destination: ciel, permanent: true },
      { source: `/en${zdroj}`, destination: ciel === "/" ? "/en" : `/en${ciel}`, permanent: true },
    ]);
  },
  experimental: {
    // The root layout is app/[lang]/layout.tsx. With a dynamic root segment Next.js cannot render
    // a 404 inside the layout on the server, so app/global-not-found.tsx renders it instead.
    globalNotFound: true,
  },
  images: {
    loader: "custom",
    loaderFile: "./lib/cloudinary-loader.ts",
  },
};

export default nextConfig;
