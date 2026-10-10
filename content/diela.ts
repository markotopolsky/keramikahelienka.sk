// Products currently in stock in the shop on keramikahelienka.sk (September 2026).
import type { Localized } from "@/lib/i18n";

export const kategorieDiel = {
  misy: { sk: "Misy", en: "Bowls" },
  vazy: { sk: "Vázy", en: "Vases" },
  lampy: { sk: "Lampy", en: "Lamps" },
  artObjekty: { sk: "Art objekty", en: "Art objects" },
} satisfies Record<string, Localized>;

export type Dielo = {
  nazov: Localized;
  kategoria: keyof typeof kategorieDiel;
  cena: number;
  foto: string;
  sirka: number;
  vyska: number;
  /** CSS object-position when the photo is cropped, e.g. to keep a label out of frame */
  fokus?: string;
};

export const diela: Dielo[] = [
  { nazov: { sk: "Moon vase, tyrkysová", en: "Moon vase, turquoise" }, kategoria: "vazy", cena: 235, foto: "/images/diela/moon-vase-tyrkys.jpg", sirka: 1200, vyska: 1800 },
  { nazov: { sk: "Misa Mušľa", en: "Shell bowl" }, kategoria: "misy", cena: 75, foto: "/images/diela/misa-musla-1.jpg", sirka: 1080, vyska: 1350, fokus: "50% 30%" },
  { nazov: { sk: "Art object, biela glazúra", en: "Art object, white glaze" }, kategoria: "artObjekty", cena: 369, foto: "/images/diela/art-object-white.jpg", sirka: 1350, vyska: 1800 },
  { nazov: { sk: "Lampa color", en: "Colour lamp" }, kategoria: "lampy", cena: 190, foto: "/images/diela/lampa-color.jpg", sirka: 1012, vyska: 1800 },
  { nazov: { sk: "Misa morská veľká", en: "Large sea bowl" }, kategoria: "misy", cena: 129, foto: "/images/diela/misa-morska-velka.jpg", sirka: 1012, vyska: 1800 },
  { nazov: { sk: "Váza Modrá vlna", en: "Blue Wave vase" }, kategoria: "vazy", cena: 75, foto: "/images/diela/vaza-modra-vlna.jpg", sirka: 1350, vyska: 1800 },
  { nazov: { sk: "Citrónová misa", en: "Lemon bowl" }, kategoria: "misy", cena: 129, foto: "/images/diela/citronova-misa.jpg", sirka: 1350, vyska: 1800 },
  { nazov: { sk: "Raku váza", en: "Raku vase" }, kategoria: "vazy", cena: 69, foto: "/images/diela/raku-vaza.jpg", sirka: 1012, vyska: 1800 },
  { nazov: { sk: "Sada lámp", en: "Set of lamps" }, kategoria: "lampy", cena: 329, foto: "/images/diela/sada-lamp.jpg", sirka: 1080, vyska: 1350 },
  { nazov: { sk: "Art object, lávová glazúra", en: "Art object, lava glaze" }, kategoria: "artObjekty", cena: 210, foto: "/images/diela/art-object-lava.jpg", sirka: 1350, vyska: 1800 },
  { nazov: { sk: "Váza prírodná", en: "Natural vase" }, kategoria: "vazy", cena: 79, foto: "/images/diela/vaza-prirodna.jpg", sirka: 720, vyska: 1280 },
  { nazov: { sk: "Art object, tmavohnedý", en: "Art object, dark brown" }, kategoria: "artObjekty", cena: 299, foto: "/images/diela/art-object-dark-brown.jpg", sirka: 1350, vyska: 1800 },
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
