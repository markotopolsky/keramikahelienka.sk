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

// Everything below is for the /kurzy page and comes from ZAZNAMNIK.md section 6:
// the 2026 price list images, the course sign-up form and the workshop product in the shop.
// TODO: question 5 for Helena. The irregular-course prices appear only in the form,
// the one-off visit only on the price list image.

/** The sign-up form Helena uses today ("Záväzná prihláška na 1-mesačný kurz keramiky") */
export const prihlaska =
  "https://docs.google.com/forms/d/e/1FAIpQLSeoLK3W8N3NL6rVFy88hWFnaBPmp4bJ6C7nZFkggQzglOEwtg/viewform";

/** Course description from the sign-up form, verbatim */
export const popisKurzu = [
  "Počas kurzu sa oboznámite s hlinou ako modelovacím materiálom. Vymodelujete si postupne reliéf, misku, hrnček, vázu. Pripravíme aj rôzne materiály na odtláčanie a vykrajovačky, tiež si môžete doniesť vlastný materiál na dekorovanie, ak preferujete určitý druh, vzor.",
  "Hlina a nástroje na jej opracovanie budú pripravené v ateliéri. Či sa budete s hlinou iba hrať, alebo budete vážne tvoriť je na vás, lektorka vám bude nápomocná svojimi radami a skúsenosťami.",
  "Tí, ktorí už do ateliéru chodili, samozrejme podľa svojej pokročilosti objavujú ďalšie keramické techniky a možnosti ako odlievanie do sádrových foriem, modelovanie väčších kúskov, ako aj prácu s porcelánom a pod.",
];

export const zakladneInfo = [
  { nazov: "Skupina", text: "4 – 8 dospelých" },
  { nazov: "Technika", text: "Ručné modelovanie. Na hrnčiarskom kruhu netočíme." },
  { nazov: "Sezóna", text: "Kurzy bežia na jeseň a na jar." },
  { nazov: "Deti", text: "Do 10 rokov len v sprievode platiaceho rodiča." },
];

/** From clay to a finished piece. Kiln temperatures and times come from the blog post "Proces výroby keramiky". */
export const postup = [
  { nazov: "Modelovanie", text: "Z hliny vymodelujete reliéf, misku, hrnček alebo vázu. Hlina a nástroje sú pripravené v ateliéri." },
  { nazov: "Sušenie", text: "Výrobky necháme v ateliéri vysušiť. Šálka schne zhruba týždeň, väčšie kusy aj dlhšie." },
  { nazov: "Prvý výpal", text: "Vysušené výrobky vypálime v keramickej peci, zvyčajne pri 950 °C." },
  { nazov: "Glazovanie", text: "Vyskúšate si rôzne techniky nanášania glazúry. K dispozícii sú aj engoby (podglazúrne farby) a patina." },
  { nazov: "Druhý výpal", text: "Naglazovanú keramiku vypálime druhýkrát, zvyčajne pri 1050 °C." },
  { nazov: "Vyzdvihnutie", text: "Až teraz sú výrobky hotové. Prídete si ich zobrať do ateliéru." },
];

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

export const cennikOstatne = [
  { nazov: "Workshop", rozsah: "3 + 2 hodiny, skupina 3 – 6 ľudí. Dá sa darovať ako darčeková poukážka.", cena: "85 €" },
  { nazov: "Jednorazový vstup do ateliéru", rozsah: "3 hodiny", cena: "51 €" },
  { nazov: "Skupinový alebo rodinný workshop", rozsah: "3 – 5 osôb, 3 + 2 hodiny. Cena podľa počtu a veku.", cena: "od 190 €" },
  { nazov: "Teambuilding", rozsah: "Pre firmy, na dohodu.", cena: "na mieru" },
];

export const terminy = [
  { den: "Utorok", cas: "17:00 – 20:00" },
  { den: "Streda", cas: "9:30 – 12:30" },
  { den: "Štvrtok", cas: "17:30 – 20:30" },
];

export const vCene = [
  "všetok materiál a pracovné pomôcky",
  "uskladnenie výrobkov počas sušenia",
  "2 × výpal v keramickej peci",
  "malé občerstvenie",
  "lektorka",
];
