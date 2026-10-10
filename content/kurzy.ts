// Prices and formats come from the 2026 price list on keramikahelienka.sk.
// The descriptions are draft copy: confirm them with Helena before launch.

export type Kurz = {
  nazov: string;
  popis: string;
  rozsah: string;
  cena: string;
  stitok: string;
  foto: string;
  fotoAlt: string;
};

export const kurzy: Kurz[] = [
  {
    nazov: "Mesačný kurz",
    popis:
      "Štyri stretnutia za mesiac. Naučíte sa modelovať z plátov a valčekov, zdobiť a glazovať. Na každom stretnutí pokračujete tam, kde ste skončili.",
    rozsah: "4 × 2 h · 4 × 2,5 h · 4 × 3 h",
    cena: "od 120 €",
    stitok: "Pravidelne",
    foto: "/images/diela/strip-img_3193.jpg",
    fotoAlt: "Ruky držia vlnitú misu s reliéfom",
  },
  {
    nazov: "Workshop",
    popis:
      "Jednorazový workshop pre tých, ktorí si chcú hlinu vyskúšať. Odnesiete si vlastný kúsok vypálený v ateliéri.",
    rozsah: "3 + 2 hodiny",
    cena: "85 €",
    stitok: "Na vyskúšanie",
    foto: "/images/diela/strip-img_2218.jpg",
    fotoAlt: "Guľatá váza s krátermi v rukách",
  },
  {
    nazov: "Voľný ateliér",
    popis:
      "Máte skúsenosti a chcete len priestor, hlinu a pec? Príďte tvoriť sami, Helena je pri vás, keď treba poradiť.",
    rozsah: "3 hodiny",
    cena: "51 €",
    stitok: "Pre pokročilých",
    foto: "/images/diela/strip-img_3123.jpg",
    fotoAlt: "Zvlnený art objekt z bielej hliny",
  },
  {
    nazov: "Deti a rodičia",
    popis:
      "Kurzy pre deti od najmenších po tínedžerov. Deti do 10 rokov chodia v sprievode platiaceho rodiča, tvoríte spolu.",
    rozsah: "Cena podľa veku",
    cena: "od 8 € / hod",
    stitok: "Rodiny",
    foto: "/images/diela/misa-vysoky-podstavec.jpg",
    fotoAlt: "Misa na vysokom podstavci s krokusmi",
  },
];

// Everything below is for the price list on /kurzy and comes from ZAZNAMNIK.md section 6:
// the 2026 price list images and Helena's Google sign-up form, which the site no longer links to.
// TODO: question 5 for Helena. The irregular-course prices appear only in the form,
// the one-off visit only on the price list image.

export const cennikDospeli = [
  { rozsah: "4 × 3 hod.", pravidelne: "156 €", nepravidelne: "192 €" },
  { rozsah: "4 × 2,5 hod.", pravidelne: "140 €", nepravidelne: "170 €" },
  { rozsah: "4 × 2 hod.", pravidelne: "120 €", nepravidelne: "150 €" },
];

// The price list image says "6 – 9,99", the form says "6 – 10" (question 5)
export const cennikDeti = [
  { vek: "do 6 rokov", cena: "8 €" },
  { vek: "6 – 9 rokov", cena: "9 €" },
  { vek: "10 – 13 rokov", cena: "10 €" },
  { vek: "14 – 18 rokov", cena: "11 €" },
];

export const terminy = [
  { den: "Utorok", cas: "17:00 – 20:00" },
  { den: "Streda", cas: "9:30 – 12:30" },
  { den: "Štvrtok", cas: "17:30 – 20:30" },
];
