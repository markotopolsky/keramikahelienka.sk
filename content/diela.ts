// Products currently in stock in the shop on keramikahelienka.sk (September 2026).

export type Dielo = {
  nazov: string;
  kategoria: "Misy" | "Vázy" | "Lampy" | "Art objekty";
  cena: string;
  foto: string;
  sirka: number;
  vyska: number;
  /** CSS object-position when the photo is cropped, e.g. to keep a label out of frame */
  fokus?: string;
};

export const diela: Dielo[] = [
  { nazov: "Moon vase, tyrkysová", kategoria: "Vázy", cena: "235 €", foto: "/images/diela/moon-vase-tyrkys.jpg", sirka: 1200, vyska: 1800 },
  { nazov: "Misa Mušľa", kategoria: "Misy", cena: "75 €", foto: "/images/diela/misa-musla-1.jpg", sirka: 1080, vyska: 1350, fokus: "50% 30%" },
  { nazov: "Art object, biela glazúra", kategoria: "Art objekty", cena: "369 €", foto: "/images/diela/art-object-white.jpg", sirka: 1350, vyska: 1800 },
  { nazov: "Lampa color", kategoria: "Lampy", cena: "190 €", foto: "/images/diela/lampa-color.jpg", sirka: 1012, vyska: 1800 },
  { nazov: "Misa morská veľká", kategoria: "Misy", cena: "129 €", foto: "/images/diela/misa-morska-velka.jpg", sirka: 1012, vyska: 1800 },
  { nazov: "Váza Modrá vlna", kategoria: "Vázy", cena: "75 €", foto: "/images/diela/vaza-modra-vlna.jpg", sirka: 1350, vyska: 1800 },
  { nazov: "Citrónová misa", kategoria: "Misy", cena: "129 €", foto: "/images/diela/citronova-misa.jpg", sirka: 1350, vyska: 1800 },
  { nazov: "Raku váza", kategoria: "Vázy", cena: "69 €", foto: "/images/diela/raku-vaza.jpg", sirka: 1012, vyska: 1800 },
  { nazov: "Sada lámp", kategoria: "Lampy", cena: "329 €", foto: "/images/diela/sada-lamp.jpg", sirka: 1080, vyska: 1350 },
  { nazov: "Art object, lávová glazúra", kategoria: "Art objekty", cena: "210 €", foto: "/images/diela/art-object-lava.jpg", sirka: 1350, vyska: 1800 },
  { nazov: "Váza prírodná", kategoria: "Vázy", cena: "79 €", foto: "/images/diela/vaza-prirodna.jpg", sirka: 720, vyska: 1280 },
  { nazov: "Art object, tmavohnedý", kategoria: "Art objekty", cena: "299 €", foto: "/images/diela/art-object-dark-brown.jpg", sirka: 1350, vyska: 1800 },
];

// Photos for the tilted strip in the footer
export const pasFotiek = [
  "/images/diela/strip-img_2212.jpg",
  "/images/diela/strip-img_2266.jpg",
  "/images/diela/strip-img_3551.jpg",
  "/images/variabilna.jpg",
  "/images/diela/strip-img_3123.jpg",
  "/images/diela/misa-morska-velka.jpg",
  "/images/diela/strip-img_2218.jpg",
  "/images/diela/art-object-white.jpg",
];
