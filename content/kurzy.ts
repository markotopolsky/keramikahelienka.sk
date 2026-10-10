// Prices and formats come from the 2026 price list on keramikahelienka.sk.
// The descriptions are draft copy: confirm them with Helena before launch.
// English: translated once with AI.
import type { Localized } from "@/lib/i18n";

export type Kurz = {
  nazov: Localized;
  popis: Localized;
  rozsah: Localized;
  cena: Localized;
  stitok: Localized;
  foto: string;
  fotoAlt: Localized;
};

export const kurzy: Kurz[] = [
  {
    nazov: { sk: "Mesačný kurz", en: "Monthly course" },
    popis: {
      sk: "Štyri stretnutia za mesiac. Naučíte sa modelovať z plátov a valčekov, zdobiť a glazovať. Na každom stretnutí pokračujete tam, kde ste skončili.",
      en: "Four sessions a month. You learn to build with slabs and coils, to decorate and to glaze. Each session picks up where the last one ended.",
    },
    rozsah: { sk: "4 × 2 h · 4 × 2,5 h · 4 × 3 h", en: "4 × 2 h · 4 × 2.5 h · 4 × 3 h" },
    cena: { sk: "od 120 €", en: "from €120" },
    stitok: { sk: "Pravidelne", en: "Regular" },
    foto: "/images/diela/strip-img_3193.jpg",
    fotoAlt: { sk: "Ruky držia vlnitú misu s reliéfom", en: "Hands holding a wavy bowl with a relief" },
  },
  {
    nazov: { sk: "Workshop", en: "Workshop" },
    popis: {
      sk: "Jednorazový workshop pre tých, ktorí si chcú hlinu vyskúšať. Odnesiete si vlastný kúsok vypálený v ateliéri.",
      en: "A one-off workshop for anyone who wants to try clay. You take home your own piece, fired in the studio.",
    },
    rozsah: { sk: "3 + 2 hodiny", en: "3 + 2 hours" },
    cena: { sk: "85 €", en: "€85" },
    stitok: { sk: "Na vyskúšanie", en: "To try it out" },
    foto: "/images/diela/strip-img_2218.jpg",
    fotoAlt: { sk: "Guľatá váza s krátermi v rukách", en: "Round vase with craters held in hands" },
  },
  {
    nazov: { sk: "Voľný ateliér", en: "Open studio" },
    popis: {
      sk: "Máte skúsenosti a chcete len priestor, hlinu a pec? Príďte tvoriť sami, Helena je pri vás, keď treba poradiť.",
      en: "Have some experience and just need space, clay and a kiln? Come and work on your own, Helena is there when you need advice.",
    },
    rozsah: { sk: "3 hodiny", en: "3 hours" },
    cena: { sk: "51 €", en: "€51" },
    stitok: { sk: "Pre pokročilých", en: "For experienced makers" },
    foto: "/images/diela/strip-img_3123.jpg",
    fotoAlt: { sk: "Zvlnený art objekt z bielej hliny", en: "Wavy art object made of white clay" },
  },
  {
    nazov: { sk: "Deti a rodičia", en: "Children and parents" },
    popis: {
      sk: "Kurzy pre deti od najmenších po tínedžerov. Deti do 10 rokov chodia v sprievode platiaceho rodiča, tvoríte spolu.",
      en: "Classes for children, from the youngest to teenagers. Children under 10 come with a paying parent, and you make things together.",
    },
    rozsah: { sk: "Cena podľa veku", en: "Price by age" },
    cena: { sk: "od 8 € / hod", en: "from €8 / hour" },
    stitok: { sk: "Rodiny", en: "Families" },
    foto: "/images/diela/misa-vysoky-podstavec.jpg",
    fotoAlt: { sk: "Misa na vysokom podstavci s krokusmi", en: "Bowl on a tall pedestal with crocuses" },
  },
];

// Everything below is for the price list on /kurzy and comes from ZAZNAMNIK.md section 6:
// the 2026 price list images and Helena's Google sign-up form, which the site no longer links to.
// TODO: question 5 for Helena. The irregular-course prices appear only in the form,
// the one-off visit only on the price list image.

export const cennikDospeli: { rozsah: Localized; pravidelne: number; nepravidelne: number }[] = [
  { rozsah: { sk: "4 × 3 hod.", en: "4 × 3 h" }, pravidelne: 156, nepravidelne: 192 },
  { rozsah: { sk: "4 × 2,5 hod.", en: "4 × 2.5 h" }, pravidelne: 140, nepravidelne: 170 },
  { rozsah: { sk: "4 × 2 hod.", en: "4 × 2 h" }, pravidelne: 120, nepravidelne: 150 },
];

// The price list image says "6 – 9,99", the form says "6 – 10" (question 5)
export const cennikDeti: { vek: Localized; cena: number }[] = [
  { vek: { sk: "do 6 rokov", en: "under 6" }, cena: 8 },
  { vek: { sk: "6 – 9 rokov", en: "6–9 years" }, cena: 9 },
  { vek: { sk: "10 – 13 rokov", en: "10–13 years" }, cena: 10 },
  { vek: { sk: "14 – 18 rokov", en: "14–18 years" }, cena: 11 },
];

export const terminy: { den: Localized; cas: string }[] = [
  { den: { sk: "Utorok", en: "Tuesday" }, cas: "17:00 – 20:00" },
  { den: { sk: "Streda", en: "Wednesday" }, cas: "9:30 – 12:30" },
  { den: { sk: "Štvrtok", en: "Thursday" }, cas: "17:30 – 20:30" },
];
