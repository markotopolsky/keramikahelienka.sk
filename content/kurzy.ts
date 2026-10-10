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

// Everything below is for the /kurzy page and comes from ZAZNAMNIK.md section 6:
// the 2026 price list images, the course sign-up form and the workshop product in the shop.
// TODO: question 5 for Helena. The irregular-course prices appear only in the form,
// the one-off visit only on the price list image.

/** The sign-up form Helena uses today ("Záväzná prihláška na 1-mesačný kurz keramiky"). It is in Slovak only. */
export const prihlaska =
  "https://docs.google.com/forms/d/e/1FAIpQLSeoLK3W8N3NL6rVFy88hWFnaBPmp4bJ6C7nZFkggQzglOEwtg/viewform";

/** Course description from the sign-up form, verbatim */
export const popisKurzu: Localized<string[]> = {
  sk: [
    "Počas kurzu sa oboznámite s hlinou ako modelovacím materiálom. Vymodelujete si postupne reliéf, misku, hrnček, vázu. Pripravíme aj rôzne materiály na odtláčanie a vykrajovačky, tiež si môžete doniesť vlastný materiál na dekorovanie, ak preferujete určitý druh, vzor.",
    "Hlina a nástroje na jej opracovanie budú pripravené v ateliéri. Či sa budete s hlinou iba hrať, alebo budete vážne tvoriť je na vás, lektorka vám bude nápomocná svojimi radami a skúsenosťami.",
    "Tí, ktorí už do ateliéru chodili, samozrejme podľa svojej pokročilosti objavujú ďalšie keramické techniky a možnosti ako odlievanie do sádrových foriem, modelovanie väčších kúskov, ako aj prácu s porcelánom a pod.",
  ],
  en: [
    "During the course you get to know clay as a modelling material. Step by step you make a relief, a small bowl, a mug and a vase. We prepare various materials for pressing patterns and cutters, and you can also bring your own decorating material if you prefer a particular kind or pattern.",
    "Clay and tools for working it are ready in the studio. Whether you just play with the clay or work seriously is up to you; the teacher will help with advice and experience.",
    "Those who have come to the studio before discover further techniques according to their level, such as slip casting in plaster moulds, building larger pieces, working with porcelain and more.",
  ],
};

export const zakladneInfo: { nazov: Localized; text: Localized }[] = [
  { nazov: { sk: "Skupina", en: "Group" }, text: { sk: "4 – 8 dospelých", en: "4–8 adults" } },
  {
    nazov: { sk: "Technika", en: "Technique" },
    text: { sk: "Ručné modelovanie. Na hrnčiarskom kruhu netočíme.", en: "Hand-building. We do not use the potter’s wheel." },
  },
  { nazov: { sk: "Sezóna", en: "Season" }, text: { sk: "Kurzy bežia na jeseň a na jar.", en: "Classes run in autumn and spring." } },
  {
    nazov: { sk: "Deti", en: "Children" },
    text: { sk: "Do 10 rokov len v sprievode platiaceho rodiča.", en: "Under 10 only with a paying parent." },
  },
];

/** From clay to a finished piece. Kiln temperatures and times come from the blog post "Proces výroby keramiky". */
export const postup: { nazov: Localized; text: Localized }[] = [
  {
    nazov: { sk: "Modelovanie", en: "Modelling" },
    text: {
      sk: "Z hliny vymodelujete reliéf, misku, hrnček alebo vázu. Hlina a nástroje sú pripravené v ateliéri.",
      en: "You model a relief, a small bowl, a mug or a vase. Clay and tools are ready in the studio.",
    },
  },
  {
    nazov: { sk: "Sušenie", en: "Drying" },
    text: {
      sk: "Výrobky necháme v ateliéri vysušiť. Šálka schne zhruba týždeň, väčšie kusy aj dlhšie.",
      en: "Your pieces dry in the studio. A cup takes about a week, larger pieces longer.",
    },
  },
  {
    nazov: { sk: "Prvý výpal", en: "First firing" },
    text: {
      sk: "Vysušené výrobky vypálime v keramickej peci, zvyčajne pri 950 °C.",
      en: "The dry pieces are fired in the kiln, usually at 950 °C.",
    },
  },
  {
    nazov: { sk: "Glazovanie", en: "Glazing" },
    text: {
      sk: "Vyskúšate si rôzne techniky nanášania glazúry. K dispozícii sú aj engoby (podglazúrne farby) a patina.",
      en: "You try different ways of applying glaze. Engobes (underglaze colours) and patina are available too.",
    },
  },
  {
    nazov: { sk: "Druhý výpal", en: "Second firing" },
    text: {
      sk: "Naglazovanú keramiku vypálime druhýkrát, zvyčajne pri 1050 °C.",
      en: "The glazed pieces are fired a second time, usually at 1050 °C.",
    },
  },
  {
    nazov: { sk: "Vyzdvihnutie", en: "Collection" },
    text: {
      sk: "Až teraz sú výrobky hotové. Prídete si ich zobrať do ateliéru.",
      en: "Only now are the pieces finished. You collect them from the studio.",
    },
  },
];

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

export const cennikOstatne: { nazov: Localized; rozsah: Localized; cena: Localized }[] = [
  {
    nazov: { sk: "Workshop", en: "Workshop" },
    rozsah: {
      sk: "3 + 2 hodiny, skupina 3 – 6 ľudí. Dá sa darovať ako darčeková poukážka.",
      en: "3 + 2 hours, group of 3–6 people. Can be given as a gift voucher.",
    },
    cena: { sk: "85 €", en: "€85" },
  },
  {
    nazov: { sk: "Jednorazový vstup do ateliéru", en: "Single studio visit" },
    rozsah: { sk: "3 hodiny", en: "3 hours" },
    cena: { sk: "51 €", en: "€51" },
  },
  {
    nazov: { sk: "Skupinový alebo rodinný workshop", en: "Group or family workshop" },
    rozsah: {
      sk: "3 – 5 osôb, 3 + 2 hodiny. Cena podľa počtu a veku.",
      en: "3–5 people, 3 + 2 hours. Price depends on group size and age.",
    },
    cena: { sk: "od 190 €", en: "from €190" },
  },
  {
    nazov: { sk: "Teambuilding", en: "Team building" },
    rozsah: { sk: "Pre firmy, na dohodu.", en: "For companies, by arrangement." },
    cena: { sk: "na mieru", en: "custom quote" },
  },
];

export const terminy: { den: Localized; cas: string }[] = [
  { den: { sk: "Utorok", en: "Tuesday" }, cas: "17:00 – 20:00" },
  { den: { sk: "Streda", en: "Wednesday" }, cas: "9:30 – 12:30" },
  { den: { sk: "Štvrtok", en: "Thursday" }, cas: "17:30 – 20:30" },
];

export const vCene: Localized<string[]> = {
  sk: [
    "všetok materiál a pracovné pomôcky",
    "uskladnenie výrobkov počas sušenia",
    "2 × výpal v keramickej peci",
    "malé občerstvenie",
    "lektorka",
  ],
  en: ["all materials and tools", "storage of your pieces while they dry", "2 × kiln firing", "light refreshments", "teacher"],
};
