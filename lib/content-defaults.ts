// Single source of truth for the editable texts (the simple CMS, README "Editovateľný obsah").
// Every key editable in /admin has its default here, so the site works with an empty database
// or when Supabase is down. A key is "<section>.<field>"; a text in two languages is two keys,
// "<section>.<field>" (Slovak) and "<section>.<field>_en" (English).
//
// The field type comes from the key, not from the database: `images` are photos, FILE_KEYS files,
// RICH_TEXT_KEYS long texts with mini-markup (components/rich-text.tsx), SWITCH_KEYS yes/no.
// Everything else is plain text. "xxx …" marks a text Helena still has to supply: the site does
// not show it (filled() in lib/content.ts) and the seed script may overwrite it.
//
// Products are not here: they have their own table (supabase/schema.sql, lib/produkty.ts).
import { kontakt, kurzyStranky } from "../content/atelier";
import { kategorie } from "../content/produkty";
import { pravneStranky, type Blok, type Sekcia } from "../content/pravne";

export type SectionDef = {
  section: string;
  label: string;
  defaults: Record<string, string>;
  images?: Record<string, string>;
};

/** A plain value, or a [Slovak, English] pair that becomes two keys */
type Pole = string | [sk: string, en: string];

function sekcia(
  section: string,
  label: string,
  polia: Record<string, Pole>,
  images: Record<string, string> = {},
): SectionDef {
  const defaults: Record<string, string> = {};
  for (const [pole, value] of Object.entries(polia)) {
    const key = `${section}.${pole}`;
    if (typeof value === "string") {
      defaults[key] = value;
    } else {
      defaults[key] = value[0];
      defaults[`${key}_en`] = value[1];
    }
  }
  const obrazky = Object.fromEntries(Object.entries(images).map(([pole, src]) => [`${section}.${pole}`, src]));
  return { section, label, defaults, images: obrazky };
}

/** A legal page from content/pravne.ts as one rich text: "## heading" starts a numbered section */
function pravnyText(sekcie: Sekcia[]) {
  const blok = (b: Blok) => (typeof b === "string" ? b : b.zoznam.map((polozka) => `- ${polozka}`).join("\n"));
  return sekcie.map((s) => [`## ${s.nadpis}`, ...s.bloky.map(blok)].join("\n\n")).join("\n\n");
}

function pravnaSekcia(slug: string): SectionDef {
  const stranka = pravneStranky.find((s) => s.slug === slug);
  if (!stranka) throw new Error(`content/pravne.ts has no page "${slug}"`);
  return sekcia(pravnaSekciaPreSlug(slug), `${stranka.nazov.sk} · /${slug}`, {
    nazov: [stranka.nazov.sk, stranka.nazov.en],
    uvod: [stranka.uvod.sk, stranka.uvod.en],
    text: [pravnyText(stranka.sekcie.sk), pravnyText(stranka.sekcie.en)],
  });
}

/** "obchodne-podmienky" → "pravne_obchodne_podmienky" */
export function pravnaSekciaPreSlug(slug: string) {
  return `pravne_${slug.replace(/-/g, "_")}`;
}

export const PRAVNE_SLUGY = pravneStranky.map((s) => s.slug);

/** "deti-a-rodicia" → "kurz_deti_a_rodicia", the section with the texts of /kurzy/deti-a-rodicia */
export function kurzSekciaPreSlug(slug: string) {
  return `kurz_${slug.replace(/-/g, "_")}`;
}

const KURZ_SEKCIE = kurzyStranky.map((k) => kurzSekciaPreSlug(k.slug));

/** Photos from the studio shoot (public/images/kurzy) with their alt texts, shared by the course pages */
const fotkyAtelier = {
  skupina: ["/images/kurzy/workshop-skupina.jpg", "Účastníčky workshopu modelujú pri stole v tieni", "Workshop participants modelling at a table in the shade"],
  plat: ["/images/kurzy/modelovanie-z-platu.jpg", "Ruky ovíjajú pásik hliny okolo formy", "Hands wrapping a strip of clay around a mould"],
  krajka: ["/images/kurzy/odtlacok-krajky.jpg", "Odtlačok háčkovanej dečky v pláte hliny", "The print of a crocheted doily in a slab of clay"],
  navrh: ["/images/kurzy/navrh-vazy.jpg", "Kreslenie návrhu vázy ceruzkou", "Sketching a vase design in pencil"],
  malovanie: ["/images/kurzy/malovanie-misky.jpg", "Maľovanie modrých línií na misku", "Painting blue lines on a bowl"],
  glazovanie: ["/images/kurzy/glazovanie.jpg", "Glazúra steká zo štetca do misky", "Glaze dripping from a brush into a bowl"],
  stetce: ["/images/kurzy/stetce.jpg", "Štetce v hlinenom kvetináči", "Brushes in a clay pot"],
  stol: ["/images/kurzy/pracovny-stol.jpg", "Pracovný stôl s miskou, ceruzkou a nástrojmi", "A work table with a bowl, a pencil and tools"],
  figurka: ["/images/kurzy/modelovanie-figurky.jpg", "Miska z hliny s malou figúrkou zvieratka", "A clay dish with a small animal figure"],
} satisfies Record<string, [src: string, sk: string, en: string]>;

type FotkaAtelier = keyof typeof fotkyAtelier;

/**
 * sekcia() with a gallery of six photo slots ("galeria1_foto", "galeria1_alt" …) after its other fields,
 * the first ones filled with these photos in order (components/kurzy/fotky.tsx)
 */
function sekciaSGaleriou(
  section: string,
  label: string,
  polia: Record<string, Pole>,
  images: Record<string, string>,
  fotky: FotkaAtelier[],
): SectionDef {
  const galeria: Record<string, Pole> = {};
  const galeriaFotky: Record<string, string> = {};
  for (let n = 1; n <= 6; n++) {
    const fotka = fotky[n - 1] ? fotkyAtelier[fotky[n - 1]] : null;
    galeria[`galeria${n}_alt`] = [fotka?.[1] ?? "", fotka?.[2] ?? ""];
    galeriaFotky[`galeria${n}_foto`] = fotka?.[0] ?? "";
  }
  return sekcia(section, label, { ...polia, ...galeria }, { ...images, ...galeriaFotky });
}

/** Alt text of a photo from the shoot, as a [Slovak, English] field */
function altAtelier(meno: FotkaAtelier): Pole {
  return [fotkyAtelier[meno][1], fotkyAtelier[meno][2]];
}

export const SECTIONS: SectionDef[] = [
  // ---------------------------------------------------------------- Celý web
  sekcia("info_lista", "Info lišta hore · všetky stránky", {
    zobrazit: "ano",
    verzia: "2026-10",
    text: [
      "xxx aktuálny oznam – zľava, zľavový kód alebo výstava",
      "xxx current announcement – a discount, a discount code or an exhibition",
    ],
    odkaz_text: ["Prihláste sa na Listy z ateliéru", "Subscribe to Letters from the studio"],
    odkaz_href: "#newsletter",
  }),

  // Popup window over the page (components/popup.tsx). Off by default; Helena switches it on
  sekcia(
    "popup",
    "Vyskakovacie okno · všetky stránky",
    {
      zobrazit: "nie",
      verzia: "2026-10",
      nadpis: ["xxx nadpis okna – napr. Vianočný predaj v ateliéri", "xxx window heading – e.g. Christmas sale at the studio"],
      text: ["xxx krátky text oznamu", "xxx short announcement text"],
      tlacidlo_text: ["", ""],
      tlacidlo_href: "",
      foto_alt: ["", ""],
    },
    { foto: "" },
  ),

  sekcia("kontakt", "Kontaktné údaje · hlavička, pätička, /kontakt", {
    ulica: kontakt.ulica,
    mesto: kontakt.mesto,
    telefon: kontakt.telefon,
    email: kontakt.email,
    instagram: kontakt.instagram,
    facebook: kontakt.facebook,
    youtube: kontakt.youtube,
    linkedin: kontakt.linkedin,
  }),

  sekcia(
    "paticka",
    "Pätička · všetky stránky",
    {
      newsletter: ["Listy z ateliéru", "Letters from the studio"],
      newsletter_text: [
        "Nové kurzy, kolekcie a termíny workshopov do schránky.",
        "New classes, collections and workshop dates in your inbox.",
      ],
      stranky: ["Stránky", "Pages"],
      sledujte: ["Sledujte", "Follow"],
      atelier: ["Ateliér", "Studio"],
    },
    {
      pas_foto1: "/images/diela/strip-img_2212.jpg",
      pas_foto2: "/images/diela/strip-img_2266.jpg",
      pas_foto3: "/images/diela/strip-img_3551.jpg",
      pas_foto4: "/images/diela/variabilna.jpg",
      pas_foto5: "/images/diela/strip-img_3123.jpg",
      pas_foto6: "/images/diela/misa-morska-velka.jpg",
      pas_foto7: "/images/diela/strip-img_2218.jpg",
      pas_foto8: "/images/diela/art-object-white.jpg",
    },
  ),

  sekcia("seo", "Vyhľadávače (predvolený titulok a popis) · všetky stránky", {
    titulok: [
      "Keramika He-lienka · keramický ateliér a kurzy keramiky v Bratislave",
      "Keramika He-lienka · ceramics studio and pottery classes in Bratislava",
    ],
    popis: [
      "Ručne modelované misy, vázy, lampy a art objekty z ateliéru v Bratislave-Dúbravke. Kurzy keramiky pre dospelých aj deti.",
      "Hand-built bowls, vases, lamps and art objects from a studio in Bratislava-Dúbravka. Pottery classes for adults and children.",
    ],
  }),

  // ---------------------------------------------------------------- Domovská stránka
  sekcia(
    "hero",
    "Úvodná fotka a nadpis · /",
    {
      nadpis: ["Krása a úžitok", "Beauty and purpose"],
      atelier: ["Keramický ateliér", "Ceramics studio"],
      od_roku: ["od roku 2020", "since 2020"],
      lead: [
        "Misy, vázy, lampy a objekty modelované ručne, bez hrnčiarskeho kruhu. A kurzy, na ktorých si to vyskúšate sami.",
        "Bowls, vases, lamps and objects built by hand, without a potter’s wheel. And classes where you can try it yourself.",
      ],
      tlacidlo_kurzy: ["Kurzy keramiky", "Pottery classes"],
      tlacidlo_obchod: ["Obchod", "Shop"],
      original: ["Každý kus je originál. Žiadne dva nie sú rovnaké.", "Every piece is an original. No two are the same."],
      foto1_alt: [
        "Helena sedí na drevenom chodníku v tráve pri svojich ručne modelovaných vázach",
        "Helena sitting on a wooden boardwalk in tall grass beside her hand-built vases",
      ],
      foto2_alt: [
        "Tri ručne modelované vázy na drevenom chodníku medzi trávou",
        "Three hand-built vases on a wooden boardwalk in tall grass",
      ],
      foto3_alt: [
        "Helena sedí na terase pred domom a ukladá svoje vázy na schod",
        "Helena sitting on a terrace by the house, arranging her vases on a step",
      ],
      foto4_alt: [
        "Rad ručne modelovaných váz a mís na drevenej podlahe pred skleníkom",
        "A row of hand-built vases and bowls on a wooden deck in front of a greenhouse",
      ],
      foto5_alt: [
        "Biela zvlnená váza na drevenom schode v jesennom slnku",
        "A white wavy vase on a wooden step in autumn sunlight",
      ],
    },
    {
      foto1: "/images/hero/hero-helena-chodnik.jpg",
      foto2: "/images/hero/hero-nadoby-chodnik.jpg",
      foto3: "/images/hero/hero-helena-terasa.jpg",
      foto4: "/images/hero/hero-sklenik.jpg",
      foto5: "/images/hero/hero-biela-vaza.jpg",
    },
  ),

  sekcia("intro", "Z hliny, rukami, bez kruhu · /", {
    nadpis: ["Z hliny, rukami, bez kruhu.", "From clay, by hand, no wheel."],
    lead: ["Mojou veľkou vášňou sú dizajnové kúsky pre domov.", "My great passion is design pieces for the home."],
    hodnota1_nazov: ["Z hliny", "From clay"],
    hodnota1_text: [
      "Je to úžasný pocit, keď hlina dostáva tvar a prostredníctvom vzduchu a ohňa sa mení v trvácu podobu.",
      "It is a wonderful feeling when clay takes shape and, through air and fire, turns into something lasting.",
    ],
    hodnota2_nazov: ["Rukami", "By hand"],
    hodnota2_text: [
      "Každé dielo vzniká ručne. Obsahuje kúsok duše tvorcu, ktorý ho s láskou vytvoril.",
      "Every piece is made by hand. It holds a bit of the soul of the maker who created it with love.",
    ],
    hodnota3_nazov: ["Bez kruhu", "No wheel"],
    hodnota3_text: [
      "Misy, vázy, dekorácie aj lampy modelujem bez hrnčiarskeho kruhu. Každý kúsok má neopakovateľný tvar a svoj príbeh.",
      "I build bowls, vases, decorations and lamps without a potter’s wheel. Every piece has a shape that cannot be repeated, and its own story.",
    ],
  }),

  sekcia("diela_domov", "Diela z obchodu · /", {
    eyebrow: ["Z ateliéru", "From the studio"],
    nadpis: ["Každý kus existuje len raz", "Every piece exists only once"],
    text: [
      "Misy, vázy, lampy a art objekty. Každý výrobok je robený ručne, čo mu dáva výnimočný charakter.",
      "Bowls, vases, lamps and art objects. Every piece is made by hand, which gives it a unique character.",
    ],
    tlacidlo_obchod: ["Celý obchod", "Whole shop"],
    tlacidlo_vsetky: ["Pozrieť všetky kúsky", "See all pieces"],
  }),

  sekcia("kurzy_domov", "Kurzy (nadpis a tlačidlá) · /", {
    nadpis: ["Kurzy keramiky", "Pottery classes"],
    aside: [
      "Pre dospelých aj deti, jednorazovo alebo pravidelne. V ateliéri Na vrátkach 1K v Dúbravke. Kurzy sa platia vopred.",
      "For adults and children, one-off or regular. In the studio at Na vrátkach 1K in Dúbravka. Classes are paid in advance.",
    ],
    teambuilding: ["Teambuilding a firemné workshopy pripravíme na mieru.", "We tailor team building and company workshops to you."],
    tlacidlo_rezervovat: ["Rezervovať kurz", "Book a class"],
    tlacidlo_cennik: ["Celý cenník", "Full price list"],
  }),

  sekcia(
    "o_mne_domov",
    "O mne · /",
    {
      eyebrow: ["O mne", "About me"],
      nadpis: ["Moja cesta s hlinou", "My path with clay"],
      text: [
        "Krása. Vždy ma fascinovala a prinášala radosť, približovala ma k jej Pôvodcovi. Keramiku som si kupovala a obdivovala. Až prišiel deň, kedy som ju začala aj ja tvoriť.\n\nOd roku 2020 mám vlastný ateliér. Z hliny tvorím krásu a drobné radosti a vediem kurzy keramiky vo svojom ateliéri v Dúbravke.\n\nSnažím sa, aby dielka boli nielen oku lahodiace, ale aj praktické a užitočné. Verím, že prinesú radosť aj vám.",
        "Beauty. It has always fascinated me and brought me joy, drawing me closer to its Creator. I used to buy ceramics and admire them. Then the day came when I started making them myself.\n\nI have had my own studio since 2020. I make beauty and small joys out of clay, and I teach pottery classes in my studio in Dúbravka.\n\nI try to make pieces that are not only pleasing to the eye but also practical and useful. I believe they will bring you joy too.",
      ],
      foto_alt: ["Helena Sochnová s vázou plnou kvetov", "Helena Sochnová with a vase full of flowers"],
      rola: ["Keramikárka a lektorka", "Ceramicist and teacher"],
      tlacidlo_viac: ["Viac o mne", "More about me"],
    },
    { foto: "/images/helena/helena-kvety.jpg" },
  ),

  sekcia("recenzie", "Recenzie · /", {
    nadpis: ["Čo hovoria ľudia", "What people say"],
    aside: [
      "Od tých, ktorí si kúpili kúsok domov, aj od tých, ktorí u mňa tvorili.",
      "From those who took a piece home, and from those who made things with me.",
    ],
    preklad: ["", "Translated from Slovak"],
    recenzia1_text: [
      "Som veľmi spokojná, výrobok je prekrásny, perfektne zabalený. Komunikácia s pani Helenkou, ktorá sväteničku vyrobila, bola výborná. Len tak ďalej. Zaslúži si najvyššie hodnotenie.",
      "I am very happy, the piece is beautiful and perfectly packed. Communication with Helenka, who made the holy water font, was excellent. Keep it up. She deserves the highest rating.",
    ],
    recenzia1_meno: "Jana",
    recenzia1_miesto: ["Sološnica", "Sološnica"],
    recenzia1_stitok: ["Nákup", "Purchase"],
    recenzia2_text: [
      "Kurz keramiky v Ateliéri He-lienka bol pre mňa vždy relaxom a zdrojom inšpirácie aj mnohých nových možností. Helenka ako lektorka je veľmi ústretová a nápomocná. Počas viac ako roka to bol náš spoločný tvorivý čas s dcérou (7 r.). Individuálny prístup a priateľská atmosféra ateliéru mi veľmi vyhovuje.",
      "The pottery class at Ateliér He-lienka has always been a way to relax for me, and a source of inspiration and many new possibilities. As a teacher, Helenka is very accommodating and helpful. For more than a year it was our shared creative time with my daughter (7). The individual approach and the friendly atmosphere of the studio suit me very well.",
    ],
    recenzia2_meno: "Radka",
    recenzia2_miesto: ["výtvarníčka", "artist"],
    recenzia2_stitok: ["Kurz", "Class"],
    recenzia3_text: [
      "Pani Helenka, ďakujem veľmi pekne. Svietniky sú nádherné. Vaše dielka sú zosúladené, harmonické vzorom a aj farebne. Perfektné balenie. Budú sa v exteriéri nenápadne vynímať. Ešte raz Vám ďakujem a prajem veľa nadšenia, radosti a tvorivých nápadov.",
      "Helenka, thank you very much. The candle holders are wonderful. Your pieces go well together, harmonious in pattern and in colour. Perfect packaging. They will stand out quietly outdoors. Thank you once again, and I wish you lots of enthusiasm, joy and creative ideas.",
    ],
    recenzia3_meno: "Vlastina",
    recenzia3_miesto: ["Belá-Dulice", "Belá-Dulice"],
    recenzia3_stitok: ["Nákup", "Purchase"],
    // Empty slots for new reviews: a review shows once its text and name are filled in
    ...Object.fromEntries(
      [4, 5, 6].flatMap((n) => [
        [`recenzia${n}_text`, ["", ""] as Pole],
        [`recenzia${n}_meno`, ""],
        [`recenzia${n}_miesto`, ["", ""] as Pole],
        [`recenzia${n}_stitok`, ["", ""] as Pole],
      ]),
    ),
  }),

  // ---------------------------------------------------------------- Kurzy a firmy
  sekcia(
    "kurzy_stranka",
    "Stránka Kurzy · /kurzy",
    {
      meta_titulok: ["Kurzy keramiky", "Pottery classes"],
      meta_popis: [
        "Príďte sa dotýkať hliny a tvorivo relaxovať. Kurzy keramiky pre dospelých aj deti v ateliéri v Bratislave-Dúbravke: mesačné kurzy, workshopy a teambuilding.",
        "Come and touch clay and relax creatively. Pottery classes for adults and children in a studio in Bratislava-Dúbravka: monthly courses, workshops and team building.",
      ],
      eyebrow: ["Kurzy keramiky", "Pottery classes"],
      nadpis: ["Príďte sa dotýkať hliny a tvorivo relaxovať", "Come and touch clay and relax creatively"],
      lead: [
        "Pre dospelých aj deti, v ateliéri v Dúbravke. Modelujeme ručne, bez hrnčiarskeho kruhu.",
        "For adults and children, in the studio in Dúbravka. We build by hand, without a potter’s wheel.",
      ],
      tlacidlo_prihlasit: ["Prihlásiť sa", "Sign up"],
      tlacidlo_cennik: ["Cenník", "Prices"],
      foto_alt: ["Modrá váza s reliéfom v rukách", "Blue vase with a relief held in hands"],
      vyberte: ["Vyberte si kurz", "Choose a class"],
      sezona: [
        "Kurzy bežia na jeseň a na jar, v malej skupine najviac 8 ľudí.",
        "Classes run in autumn and spring, in a small group of at most 8 people.",
      ],
    },
    { foto: "/images/diela/strip-img_2212.jpg" },
  ),

  sekcia(
    "kurzy_ponuka",
    "Ponuka kurzov (karty) · /, /kurzy, /kurzy/…, formulár",
    {
      kurz1_nazov: ["Mesačný kurz", "Monthly course"],
      kurz1_popis: [
        "Štyri stretnutia za mesiac. Naučíte sa modelovať z plátov a valčekov, zdobiť a glazovať. Na každom stretnutí pokračujete tam, kde ste skončili.",
        "Four sessions a month. You learn to build with slabs and coils, to decorate and to glaze. Each session picks up where the last one ended.",
      ],
      kurz1_rozsah: ["4 × 2 h · 4 × 2,5 h · 4 × 3 h", "4 × 2 h · 4 × 2.5 h · 4 × 3 h"],
      kurz1_cena: ["od 120 €", "from €120"],
      kurz1_stitok: ["Pravidelne", "Regular"],
      kurz1_foto_alt: altAtelier("plat"),
      kurz2_nazov: ["Workshop", "Workshop"],
      kurz2_popis: [
        "Jednorazový workshop pre tých, ktorí si chcú hlinu vyskúšať. Odnesiete si vlastný kúsok vypálený v ateliéri.",
        "A one-off workshop for anyone who wants to try clay. You take home your own piece, fired in the studio.",
      ],
      kurz2_rozsah: ["3 + 2 hodiny", "3 + 2 hours"],
      kurz2_cena: ["85 €", "€85"],
      kurz2_stitok: ["Na vyskúšanie", "To try it out"],
      kurz2_foto_alt: altAtelier("malovanie"),
      kurz3_nazov: ["Voľný ateliér", "Open studio"],
      kurz3_popis: [
        "Máte skúsenosti a chcete len priestor, hlinu a pec? Príďte tvoriť sami, Helena je pri vás, keď treba poradiť.",
        "Have some experience and just need space, clay and a kiln? Come and work on your own, Helena is there when you need advice.",
      ],
      kurz3_rozsah: ["3 hodiny", "3 hours"],
      kurz3_cena: ["51 €", "€51"],
      kurz3_stitok: ["Pre pokročilých", "For experienced makers"],
      kurz3_foto_alt: altAtelier("stol"),
      kurz4_nazov: ["Deti a rodičia", "Children and parents"],
      kurz4_popis: [
        "Kurzy pre deti od najmenších po tínedžerov. Deti do 10 rokov chodia v sprievode platiaceho rodiča, tvoríte spolu.",
        "Classes for children, from the youngest to teenagers. Children under 10 come with a paying parent, and you make things together.",
      ],
      kurz4_rozsah: ["Cena podľa veku", "Price by age"],
      kurz4_cena: ["od 8 € / hod", "from €8 / hour"],
      kurz4_stitok: ["Rodiny", "Families"],
      kurz4_foto_alt: altAtelier("figurka"),
      viac: ["Viac o kurze", "More about the class"],
    },
    {
      kurz1_foto: fotkyAtelier.plat[0],
      kurz2_foto: fotkyAtelier.malovanie[0],
      kurz3_foto: fotkyAtelier.stol[0],
      kurz4_foto: fotkyAtelier.figurka[0],
    },
  ),

  // Course subpages (/kurzy/<slug>, content/atelier.ts kurzyStranky). Name, price, length and the
  // opening photo come from the course card; facts only from ZAZNAMNIK.md sections 5 and 6.
  sekciaSGaleriou(
    kurzSekciaPreSlug("mesacny-kurz"),
    "Podstránka Mesačný kurz · /kurzy/mesacny-kurz",
    {
      meta_popis: [
        "Mesačný kurz keramiky v ateliéri v Bratislave-Dúbravke: štyri stretnutia za mesiac, ručné modelovanie, glazovanie a dva výpaly v peci. Malá skupina 4 – 8 ľudí.",
        "A monthly pottery course in a studio in Bratislava-Dúbravka: four sessions a month, hand building, glazing and two kiln firings. A small group of 4–8 people.",
      ],
      nadpis: ["Štyri stretnutia s hlinou každý mesiac", "Four sessions with clay every month"],
      lead: [
        "Postupne si vymodelujete reliéf, misku, hrnček aj vázu. Na hrnčiarskom kruhu netočíme, všetko vzniká v rukách.",
        "Step by step you make a relief, a bowl, a mug and a vase. We do not use a potter’s wheel: everything takes shape in your hands.",
      ],
      odkaz_text: ["", ""],
      odkaz_href: "",
      popis_nadpis: ["Čo vás čaká", "What to expect"],
      popis_text: [
        "Počas kurzu sa oboznámite s hlinou ako modelovacím materiálom. Postupne si vymodelujete reliéf, misku, hrnček a vázu. Pripravíme materiály na odtláčanie aj vykrajovačky. Ak máte obľúbený vzor, doneste si vlastný materiál na dekorovanie.\n\nČi sa budete s hlinou iba hrať, alebo budete vážne tvoriť, je na vás. Lektorka vám pomôže radami a skúsenosťami.\n\nKto už do ateliéru chodil, objavuje ďalšie techniky: odlievanie do sádrových foriem, modelovanie väčších kúskov aj prácu s porcelánom.\n\n## V cene kurzu\n\n- všetok materiál a pomôcky\n- uskladnenie výrobkov počas sušenia\n- dva výpaly v keramickej peci\n- malé občerstvenie",
        "During the course you get to know clay as a material for modelling. Step by step you make a relief, a bowl, a mug and a vase. We prepare materials for pressing patterns and cutters. If you have a favourite pattern, bring your own material for decorating.\n\nWhether you just play with the clay or work in earnest is up to you. The teacher helps with advice and experience.\n\nThose who have been to the studio before discover more techniques: slip casting in plaster moulds, larger pieces and working with porcelain.\n\n## Included in the price\n\n- all materials and tools\n- storing your pieces while they dry\n- two kiln firings\n- light refreshments",
      ],
      fakt1_nazov: ["Skupina", "Group"],
      fakt1_text: ["4 – 8 dospelých", "4–8 adults"],
      fakt2_nazov: ["Kedy", "When"],
      fakt2_text: ["Na jeseň a na jar", "In autumn and spring"],
      priebeh_nadpis: ["Ako vzniká váš kúsok", "How your piece is made"],
      priebeh_aside: [
        "Je to trocha zdĺhavejší proces, ale taká už keramika býva. Uvidíte, že sa oplatí čakať.",
        "It takes a little while, but that is ceramics. You will see it is worth the wait.",
      ],
      krok1_nazov: ["Modelovanie", "Modelling"],
      krok1_text: [
        "Tvoríte ručne z plátov a valčekov. Hotové kúsky necháme v ateliéri vyschnúť.",
        "You build by hand with slabs and coils. The finished pieces dry in the studio.",
      ],
      krok2_nazov: ["Prvý výpal", "First firing"],
      krok2_text: ["Vysušené výrobky vypálime v keramickej peci.", "We fire the dried pieces in the kiln."],
      krok3_nazov: ["Glazovanie", "Glazing"],
      krok3_text: [
        "Vyskúšate si rôzne techniky nanášania glazúry. K dispozícii sú aj engoby (podglazúrne farby) a patina.",
        "You try different ways of applying glaze. Engobes (underglaze colours) and patina are there too.",
      ],
      krok4_nazov: ["Druhý výpal", "Second firing"],
      krok4_text: ["Až po ňom sú výrobky hotové. Vyzdvihnete si ich v ateliéri.", "Only then are the pieces finished. You pick them up at the studio."],
      galeria_nadpis: ["Z ateliéru", "From the studio"],
      galeria_aside: ["Odtláčanie, kreslenie návrhov, maľovanie a glazovanie.", "Pressing patterns, sketching designs, painting and glazing."],
      otazky_nadpis: ["Časté otázky", "Questions"],
      otazka1_text: ["Musím mať skúsenosti?", "Do I need experience?"],
      otazka1_odpoved: [
        "Nie. Kurz je pre začiatočníkov aj pokročilých, lektorka sa venuje každému podľa toho, kde práve je.",
        "No. The course is for beginners and experienced makers alike; the teacher works with each person at their own level.",
      ],
      otazka2_text: ["Čo ak vynechám lekciu?", "What if I miss a session?"],
      otazka2_odpoved: [
        "Vynechanú lekciu môžete nahradiť v predplatenom období. Neúčasť ohláste aspoň 48 hodín vopred, inak termín prepadá.",
        "You can make up a missed session within the period you paid for. Let us know at least 48 hours ahead, otherwise the session is lost.",
      ],
      otazka3_text: ["Kedy a ako sa platí?", "When and how do I pay?"],
      otazka3_odpoved: [
        "Kurz sa platí vopred, najneskôr 7 dní pred začiatkom – na účet, v hotovosti alebo darčekovou poukážkou. Miesto je rezervované až dňom úhrady.",
        "The course is paid in advance, at least 7 days before it starts – by bank transfer, in cash or with a gift voucher. Your place is booked only on the day you pay.",
      ],
      otazka4_text: ["Kedy si odnesiem hotové výrobky?", "When can I take my pieces home?"],
      otazka4_odpoved: [
        "Po druhom výpale. Hlina musí najprv vyschnúť a potom ide dvakrát do pece. Hotové kúsky si vyzdvihnete v ateliéri.",
        "After the second firing. The clay has to dry first and then goes into the kiln twice. You pick up the finished pieces at the studio.",
      ],
    },
    {},
    ["krajka", "navrh", "malovanie", "glazovanie", "stetce", "stol"],
  ),

  sekciaSGaleriou(
    kurzSekciaPreSlug("workshop"),
    "Podstránka Workshop · /kurzy/workshop",
    {
      meta_popis: [
        "Keramický workshop v ateliéri v Bratislave-Dúbravke: 3 hodiny modelovania a 2 hodiny glazovania v malej skupine 3 – 6 ľudí. Dá sa darovať aj ako poukážka.",
        "A pottery workshop in a studio in Bratislava-Dúbravka: 3 hours of modelling and 2 hours of glazing in a small group of 3–6 people. You can also give it as a gift voucher.",
      ],
      nadpis: ["Vyskúšajte si hlinu za dve stretnutia", "Try clay in two sessions"],
      lead: [
        "Naučíte sa základy modelovania a odnesiete si vlastné kúsky vypálené v ateliéri. Lektorka vás sprevádza celým procesom.",
        "You learn the basics of modelling and take home your own pieces, fired in the studio. The teacher guides you through the whole process.",
      ],
      odkaz_text: ["Darovať ako poukážku", "Give it as a voucher"],
      odkaz_href: "/obchod/keramicky-workshop-3-2-hodiny",
      popis_nadpis: ["Čo vás čaká", "What to expect"],
      popis_text: [
        "Na workshope sa naučíte základy modelovania z hliny. Vytvoríte si jedinečné kúsky, ktoré potešia vás alebo vašich blízkych ako originálny darček. Pracujeme v malej skupine 3 – 6 ľudí a na kruhu netočíme.\n\nWorkshop sa platí vopred, najneskôr 7 dní pred termínom. Miesto je rezervované až dňom úhrady.\n\n## Pre partiu alebo rodinu\n\nWorkshop pripravíme aj len pre vás, pre 3 – 5 osôb. Termín dohodneme individuálne, aj cez víkend. Cena závisí od počtu a veku účastníkov, najmenej 190 €.\n\n## Ako darček\n\nWorkshop môžete darovať cez [darčekovú poukážku](/obchod/keramicky-workshop-3-2-hodiny). Pošleme ju poštou alebo e-mailom.",
        "At the workshop you learn the basics of modelling with clay. You make unique pieces that will delight you or your loved ones as an original gift. We work in a small group of 3–6 people, without a potter’s wheel.\n\nThe workshop is paid in advance, at least 7 days before the date. Your place is booked only on the day you pay.\n\n## For friends or family\n\nWe can also run the workshop just for you, for 3–5 people. We agree the date individually, weekends included. The price depends on the number and age of the participants, at least €190.\n\n## As a gift\n\nYou can give the workshop as a [gift voucher](/obchod/keramicky-workshop-3-2-hodiny). We send it by post or by email.",
      ],
      fakt1_nazov: ["Skupina", "Group"],
      fakt1_text: ["3 – 6 ľudí", "3–6 people"],
      fakt2_nazov: ["Len pre vás", "Just for you"],
      fakt2_text: ["3 – 5 osôb, od 190 €", "3–5 people, from €190"],
      priebeh_nadpis: ["Ako workshop prebieha", "How the workshop works"],
      priebeh_aside: [
        "Medzi stretnutiami výrobky v ateliéri vyschnú a prejdú pecou.",
        "Between the sessions your pieces dry in the studio and go through the kiln.",
      ],
      krok1_nazov: ["1. stretnutie: modelovanie", "Session 1: modelling"],
      krok1_text: [
        "Tri hodiny s hlinou. Naučíte sa základné techniky a vymodelujete si vlastné kúsky.",
        "Three hours with clay. You learn the basic techniques and model your own pieces.",
      ],
      krok2_nazov: ["Sušenie a výpal", "Drying and firing"],
      krok2_text: ["Výrobky vyschnú v ateliéri a vypálime ich v keramickej peci.", "Your pieces dry in the studio and we fire them in the kiln."],
      krok3_nazov: ["2. stretnutie: glazovanie", "Session 2: glazing"],
      krok3_text: [
        "Dve hodiny s farbami. Vyskúšate si glazúry a rôzne techniky ich nanášania.",
        "Two hours with colour. You try glazes and different ways of applying them.",
      ],
      krok4_nazov: ["Hotovo", "Done"],
      krok4_text: [
        "Po druhom výpale si hotové kúsky vyzdvihnete v ateliéri.",
        "After the second firing you pick up your finished pieces at the studio.",
      ],
      galeria_nadpis: ["Z workshopu", "From the workshop"],
      galeria_aside: ["", ""],
      otazky_nadpis: ["Časté otázky", "Questions"],
      otazka1_text: ["Je workshop aj pre úplných začiatočníkov?", "Is the workshop for complete beginners?"],
      otazka1_odpoved: [
        "Áno. Je presne pre tých, ktorí si chcú hlinu vyskúšať. Lektorka vás prevedie celým procesom.",
        "Yes. It is made for anyone who wants to try clay. The teacher takes you through the whole process.",
      ],
      otazka2_text: ["Ako workshop darovať?", "How do I give the workshop as a gift?"],
      otazka2_odpoved: [
        "Kúpte [darčekovú poukážku](/obchod/keramicky-workshop-3-2-hodiny) v obchode. Pošleme ju poštou alebo e-mailom.",
        "Buy a [gift voucher](/obchod/keramicky-workshop-3-2-hodiny) in the shop. We send it by post or by email.",
      ],
      otazka3_text: ["Môžeme prísť ako partia alebo rodina?", "Can we come as friends or a family?"],
      otazka3_odpoved: [
        "Áno. Workshop pre 3 – 5 osôb pripravíme na termín podľa dohody, aj cez víkend. Cena závisí od počtu a veku, najmenej 190 €. [Napíšte nám](/kontakt?typ=otazka#formular).",
        "Yes. We run the workshop for 3–5 people on a date we agree, weekends included. The price depends on the number and age of the participants, at least €190. [Write to us](/kontakt?typ=otazka#formular).",
      ],
      otazka4_text: ["Točí sa na hrnčiarskom kruhu?", "Do you use a potter’s wheel?"],
      otazka4_odpoved: ["Nie, na workshope modelujeme iba ručne.", "No, at the workshop we only build by hand."],
    },
    {},
    ["skupina", "figurka", "plat", "glazovanie", "stetce", "stol"],
  ),

  sekciaSGaleriou(
    kurzSekciaPreSlug("volny-atelier"),
    "Podstránka Voľný ateliér · /kurzy/volny-atelier",
    {
      meta_popis: [
        "Voľný ateliér v Bratislave-Dúbravke pre tých, ktorí už s hlinou pracovali: 3 hodiny v ateliéri za 51 €. Tvoríte samostatne, lektorka poradí.",
        "Open studio in Bratislava-Dúbravka for those who have worked with clay before: 3 hours in the studio for €51. You work on your own and the teacher is there to advise.",
      ],
      nadpis: ["Priestor, hlina a pec pre vaše nápady", "Space, clay and a kiln for your ideas"],
      lead: [
        "Pre tých, ktorí už s hlinou pracovali a chcú tvoriť po svojom. Helena je pri vás, keď treba poradiť.",
        "For those who have worked with clay and want to make things their own way. Helena is there when you need advice.",
      ],
      odkaz_text: ["", ""],
      odkaz_href: "",
      popis_nadpis: ["Čo vás čaká", "What to expect"],
      popis_text: [
        "Voľný ateliér je jednorazový vstup na tri hodiny. Prídete s vlastným nápadom a tvoríte samostatne, vo vlastnom tempe.\n\nV ateliéri sú pripravené nástroje, glazúry, engoby aj keramická pec. Helena je pri vás, keď potrebujete poradiť s technikou, glazúrou alebo výpalom.\n\n[[čo presne je v cene (hlina, výpaly) a v ktoré dni sa dá prísť – overiť s Helenkou]]",
        "Open studio is a one-off three-hour visit. You come with your own idea and work on your own, at your own pace.\n\nTools, glazes, engobes and a kiln are ready in the studio. Helena is there when you need advice on a technique, a glaze or the firing.\n\n[[what exactly is included (clay, firings) and which days you can come – to be confirmed with Helena]]",
      ],
      fakt1_nazov: ["Pre koho", "Who it is for"],
      fakt1_text: ["Pre skúsenejších", "Experienced makers"],
      fakt2_nazov: ["", ""],
      fakt2_text: ["", ""],
      priebeh_nadpis: ["Ako to funguje", "How it works"],
      priebeh_aside: ["", ""],
      krok1_nazov: ["Dohodnite si termín", "Book a time"],
      krok1_text: ["Napíšte alebo zavolajte, kedy chcete prísť.", "Write or call to say when you would like to come."],
      krok2_nazov: ["Tvoríte", "You make"],
      krok2_text: ["Tri hodiny v ateliéri, s vlastným nápadom a vo vlastnom tempe.", "Three hours in the studio, with your own idea, at your own pace."],
      krok3_nazov: ["Sušenie a výpaly", "Drying and firing"],
      krok3_text: ["Výrobky vyschnú v ateliéri a prejdú pecou.", "Your pieces dry in the studio and go through the kiln."],
      krok4_nazov: ["Vyzdvihnutie", "Pick-up"],
      krok4_text: ["Hotové kúsky si vyzdvihnete v ateliéri.", "You pick up the finished pieces at the studio."],
      galeria_nadpis: ["Z ateliéru", "From the studio"],
      galeria_aside: ["", ""],
      otazky_nadpis: ["Časté otázky", "Questions"],
      otazka1_text: ["Musím mať skúsenosti?", "Do I need experience?"],
      otazka1_odpoved: [
        "Áno, voľný ateliér je pre tých, ktorí už s hlinou pracovali. Ak začínate, vyberte si [workshop](/kurzy/workshop) alebo [mesačný kurz](/kurzy/mesacny-kurz).",
        "Yes, open studio is for those who have worked with clay before. If you are starting out, choose the [workshop](/kurzy/workshop) or the [monthly course](/kurzy/mesacny-kurz).",
      ],
      otazka2_text: ["Dá sa točiť na kruhu?", "Can I use a potter’s wheel?"],
      otazka2_odpoved: ["Nie, v ateliéri sa modeluje iba ručne.", "No, the studio only does hand building."],
      otazka3_text: ["Kedy sa platí?", "When do I pay?"],
      otazka3_odpoved: [
        "Vopred, najneskôr 7 dní pred termínom – na účet, v hotovosti alebo darčekovou poukážkou. Miesto je rezervované až dňom úhrady.",
        "In advance, at least 7 days before the date – by bank transfer, in cash or with a gift voucher. Your place is booked only on the day you pay.",
      ],
      otazka4_text: ["", ""],
      otazka4_odpoved: ["", ""],
    },
    {},
    ["stetce", "krajka", "navrh", "glazovanie"],
  ),

  sekciaSGaleriou(
    kurzSekciaPreSlug("deti-a-rodicia"),
    "Podstránka Deti a rodičia · /kurzy/deti-a-rodicia",
    {
      meta_popis: [
        "Kurzy keramiky pre deti od najmenších po tínedžerov v ateliéri v Bratislave-Dúbravke. Deti do 10 rokov tvoria spolu s rodičom. Od 8 € za hodinu.",
        "Pottery classes for children, from the youngest to teenagers, in a studio in Bratislava-Dúbravka. Children under 10 make things together with a parent. From €8 an hour.",
      ],
      nadpis: ["Tvoríme spolu, malí aj veľkí", "Making together, young and old"],
      lead: [
        "Kurzy pre deti od najmenších po tínedžerov. Deti do 10 rokov chodia s rodičom a tvoria spolu s ním.",
        "Classes for children, from the youngest to teenagers. Children under 10 come with a parent and make things together.",
      ],
      odkaz_text: ["", ""],
      odkaz_href: "",
      popis_nadpis: ["Čo vás čaká", "What to expect"],
      popis_text: [
        "Deti modelujú rukami, bez hrnčiarskeho kruhu, rovnako ako dospelí. Vznikajú misky, šálky aj ozdoby, ktoré po dvoch výpaloch naozaj slúžia doma.\n\nDeti do 10 rokov tvoria v sprievode platiaceho rodiča. Je to spoločný čas, po ktorom ostanú kúsky na roky.\n\n„Počas viac ako roka to bol náš spoločný tvorivý čas s dcérou (7 r.). Vzniklo veľa pekných a naozaj použiteľných kúskov. Zo šálok, misiek a ozdôb sa tešíme dodnes my aj naši blízki.“ – z recenzie",
        "Children build by hand, without a potter’s wheel, just like adults. They make bowls, cups and ornaments that are truly useful at home after two firings.\n\nChildren under 10 come with a paying parent. It is time spent together, and the pieces stay with you for years.\n\n“For more than a year it was our creative time together with my daughter (7). We made many beautiful and truly useful pieces. We and our loved ones still enjoy the cups, bowls and ornaments today.” – from a review",
      ],
      fakt1_nazov: ["Vek", "Age"],
      fakt1_text: ["od najmenších po 18 rokov", "from the youngest up to 18"],
      fakt2_nazov: ["Do 10 rokov", "Under 10"],
      fakt2_text: ["s platiacim rodičom", "with a paying parent"],
      priebeh_nadpis: ["Od hliny po hrnček", "From clay to cup"],
      priebeh_aside: [
        "Na hotové kúsky sa chvíľu čaká: musia vyschnúť a dvakrát prejsť pecou.",
        "Finished pieces take a while: they have to dry and go through the kiln twice.",
      ],
      krok1_nazov: ["Modelovanie", "Modelling"],
      krok1_text: ["Deti tvoria ručne a skúšajú odtláčanie aj vykrajovačky.", "Children build by hand and try pressing patterns and cutters."],
      krok2_nazov: ["Prvý výpal", "First firing"],
      krok2_text: ["Vysušené výrobky vypálime v keramickej peci.", "We fire the dried pieces in the kiln."],
      krok3_nazov: ["Glazovanie", "Glazing"],
      krok3_text: ["Maľovanie glazúrami a engobami.", "Painting with glazes and engobes."],
      krok4_nazov: ["Hotovo", "Done"],
      krok4_text: ["Po druhom výpale si kúsky vyzdvihnete v ateliéri.", "After the second firing you pick up the pieces at the studio."],
      galeria_nadpis: ["Z ateliéru", "From the studio"],
      galeria_aside: ["", ""],
      otazky_nadpis: ["Časté otázky", "Questions"],
      otazka1_text: ["Musí rodič tvoriť s dieťaťom?", "Does a parent have to join in?"],
      otazka1_odpoved: [
        "Deti do 10 rokov chodia v sprievode platiaceho rodiča, ktorý tvorí spolu s nimi. Staršie deti môžu prísť samy.",
        "Children under 10 come with a paying parent, who makes things with them. Older children can come on their own.",
      ],
      otazka2_text: ["Koľko to stojí?", "How much does it cost?"],
      otazka2_odpoved: [
        "Cena je za hodinu a závisí od veku dieťaťa, od 8 do 11 €. Platí sa vopred, najneskôr 7 dní pred kurzom. Celý cenník je [nižšie na stránke](#cennik).",
        "The price is per hour and depends on the child’s age, from €8 to €11. It is paid in advance, at least 7 days before the class. The full price list is [further down the page](#cennik).",
      ],
      otazka3_text: ["Čo si deti odnesú?", "What do children take home?"],
      otazka3_odpoved: [
        "Vlastné misky, šálky či ozdoby. Hotové sú po dvoch výpaloch a vyzdvihnete si ich v ateliéri.",
        "Their own bowls, cups or ornaments. They are finished after two firings and you pick them up at the studio.",
      ],
      otazka4_text: ["xxx Od koľkých rokov môže dieťa prísť?", "xxx How old does a child need to be?"],
      otazka4_odpoved: ["xxx", "xxx"],
    },
    {},
    ["malovanie", "stetce", "glazovanie"],
  ),

  // Prices from the 2026 price list (ZAZNAMNIK.md section 6). TODO: question 5 for Helena.
  sekcia("cennik", "Cenník a termíny · /kurzy", {
    eyebrow: ["Cenník 2026", "Prices 2026"],
    nadpis: ["Cenník a prihláška", "Prices and sign-up"],
    aside: [
      "V cene je materiál, pomôcky, dva výpaly v peci aj malé občerstvenie.",
      "The price includes materials, tools, two kiln firings and light refreshments.",
    ],
    mesacny: ["Mesačný kurz, 4 lekcie", "Monthly course, 4 lessons"],
    rozsah: ["Rozsah", "Length"],
    pravidelny: ["Pravidelný čas", "Regular time"],
    nepravidelny: ["Nepravidelný čas", "Irregular time"],
    dospeli1_rozsah: ["4 × 3 hod.", "4 × 3 h"],
    dospeli1_pravidelne: "156",
    dospeli1_nepravidelne: "192",
    dospeli2_rozsah: ["4 × 2,5 hod.", "4 × 2.5 h"],
    dospeli2_pravidelne: "140",
    dospeli2_nepravidelne: "170",
    dospeli3_rozsah: ["4 × 2 hod.", "4 × 2 h"],
    dospeli3_pravidelne: "120",
    dospeli3_nepravidelne: "150",
    deti: ["Deti", "Children"],
    deti1_vek: ["do 6 rokov", "under 6"],
    deti1_cena: "8",
    deti2_vek: ["6 – 9 rokov", "6–9 years"],
    deti2_cena: "9",
    deti3_vek: ["10 – 13 rokov", "10–13 years"],
    deti3_cena: "10",
    deti4_vek: ["14 – 18 rokov", "14–18 years"],
    deti4_cena: "11",
    hod: [" / hod.", " / hour"],
    sprievod: ["Do 10 rokov v sprievode platiaceho rodiča.", "Under 10 with a paying parent."],
    terminy: ["Termíny", "Times"],
    termin1_den: ["Utorok", "Tuesday"],
    termin1_cas: "17:00 – 20:00",
    termin2_den: ["Streda", "Wednesday"],
    termin2_cas: "9:30 – 12:30",
    termin3_den: ["Štvrtok", "Thursday"],
    termin3_cas: "17:30 – 20:30",
    // Empty slots: a time shows once its day is filled in
    termin4_den: ["", ""],
    termin4_cas: "",
    termin5_den: ["", ""],
    termin5_cas: "",
    vikend: ["Skupinové workshopy podľa dohody, aj cez víkend.", "Group workshops by arrangement, weekends included."],
    prihlaska: ["Vyplniť prihlášku", "Fill in the sign-up form"],
    zaplatit: [
      "Kurzy sa platia vopred, najneskôr 7 dní pred termínom. Miesto je rezervované až dňom úhrady. Teambuilding pre firmy pripravíme na mieru,",
      "Classes are paid in advance, at least 7 days before the date. Your place is booked only on the day you pay. We tailor team building for companies,",
    ],
    napiste: ["napíšte nám", "write to us"],
  }),

  sekciaSGaleriou(
    "pre_firmy",
    "Pre firmy · /pre-firmy",
    {
      meta_titulok: ["Pre firmy", "For companies"],
      meta_popis: [
        "Teambuilding a firemné workshopy s keramikou v ateliéri v Bratislave-Dúbravke, alebo priamo u vás vo firme. Cenová ponuka na mieru.",
        "Team building and company pottery workshops in our studio in Bratislava-Dúbravka, or at your company. Custom quotes.",
      ],
      eyebrow: ["Pre firmy", "For companies"],
      nadpis: ["Teambuilding s hlinou v rukách", "Team building with clay in your hands"],
      lead: [
        "Keramický workshop pre kolegov – spoločný zážitok, na ktorý sa dá aj po rokoch zaspomínať. Pripravíme ho na mieru podľa vašich požiadaviek.",
        "A pottery workshop for colleagues – a shared experience worth remembering for years. We tailor it to your needs.",
      ],
      tlacidlo: ["Napísať o ponuku", "Ask about a quote"],
      foto_alt: ["Skupina ľudí pri keramickom workshope", "A group of people at a pottery workshop"],
      ponuka: ["Ako to prebieha", "How it works"],
      ponuka_aside: ["Robíme ho zvyčajne 1 – 2× do roka, podľa dohody.", "We usually run it once or twice a year, by arrangement."],
      miesto_nadpis: ["Kde", "Where"],
      miesto_text: [
        "V ateliéri v Dúbravke, alebo prídeme s materiálom priamo k vám do firmy.",
        "At the studio in Dúbravka, or we bring the materials to your company.",
      ],
      tvorba_nadpis: ["Čo tvoríte", "What you make"],
      tvorba_text: [
        "Jedno spoločné dielo, alebo si každý odnesie vlastný kúsok – vyberiete si.",
        "One shared piece, or everyone takes home their own – you choose.",
      ],
      cena_nadpis: ["Cena", "Price"],
      cena_text: [
        "Pripravíme cenovú ponuku na mieru podľa počtu ľudí a miesta konania.",
        "We prepare a custom quote based on the number of people and the venue.",
      ],
      priebeh_nadpis: ["Od dopytu po hotové dielo", "From enquiry to finished piece"],
      priebeh_aside: ["", ""],
      krok1_nazov: ["Dopyt", "Enquiry"],
      krok1_text: [
        "Napíšte, koľko vás bude, kde a kedy by ste chceli tvoriť.",
        "Tell us how many of you there are, and where and when you would like to make things.",
      ],
      krok2_nazov: ["Ponuka na mieru", "Custom quote"],
      krok2_text: [
        "Pripravíme cenovú ponuku podľa počtu ľudí a miesta konania.",
        "We prepare a quote based on the number of people and the venue.",
      ],
      krok3_nazov: ["Spoločná tvorba", "Making together"],
      krok3_text: [
        "V ateliéri v Dúbravke alebo priamo u vás vo firme. Lektorka vás prevedie celým procesom.",
        "At the studio in Dúbravka or at your company. The teacher takes you through the whole process.",
      ],
      krok4_nazov: ["Výpal", "Firing"],
      krok4_text: [
        "Výrobky vyschnú a vypálime ich v keramickej peci v ateliéri.",
        "The pieces dry and we fire them in the studio kiln.",
      ],
      galeria_nadpis: ["Takto u nás tvoríme", "This is how we work"],
      galeria_aside: ["", ""],
      otazky_nadpis: ["Časté otázky", "Questions"],
      otazka1_text: ["Potrebujú kolegovia skúsenosti s hlinou?", "Do colleagues need any experience with clay?"],
      otazka1_odpoved: [
        "Nie. Lektorka vás prevedie celým procesom, od modelovania po glazovanie.",
        "No. The teacher takes you through the whole process, from modelling to glazing.",
      ],
      otazka2_text: ["xxx Koľko ľudí môže prísť?", "xxx How many people can come?"],
      otazka2_odpoved: ["xxx", "xxx"],
      otazka3_text: ["xxx Ako dlho teambuilding trvá?", "xxx How long does the team building take?"],
      otazka3_odpoved: ["xxx", "xxx"],
      otazka4_text: ["xxx Ako sa k nám dostanú hotové výrobky?", "xxx How do the finished pieces reach us?"],
      otazka4_odpoved: ["xxx", "xxx"],
    },
    { foto: fotkyAtelier.skupina[0] },
    ["navrh", "malovanie", "plat", "glazovanie", "krajka", "stol"],
  ),

  // ---------------------------------------------------------------- O mne a kontakt
  sekcia(
    "o_mne",
    "Stránka O mne · /o-mne",
    {
      meta_titulok: ["O mne", "About me"],
      meta_popis: [
        "Som Helenka. Od roku 2020 mám vlastný keramický ateliér v Bratislave-Dúbravke, tvorím misy, vázy a lampy a vediem kurzy keramiky.",
        "I am Helenka. Since 2020 I have had my own ceramics studio in Bratislava-Dúbravka, where I make bowls, vases and lamps and teach pottery classes.",
      ],
      eyebrow: ["Kto som?", "Who am I?"],
      nadpis: ["Som Helenka", "I am Helenka"],
      lead: [
        "Od roku 2020 mám vlastný ateliér. Z hliny tvorím krásu a drobné radosti a vediem kurzy keramiky vo svojom ateliéri v Dúbravke.",
        "I have had my own studio since 2020. I make beauty and small joys out of clay, and I teach pottery classes in my studio in Dúbravka.",
      ],
      hero_foto_alt: ["Helena Sochnová s vázou plnou kvetov", "Helena Sochnová with a vase full of flowers"],
      pribeh_eyebrow: ["Môj príbeh", "My story"],
      pribeh_nadpis: ["Krása.", "Beauty."],
      pribeh_text: [
        "Vždy ma fascinovala a prinášala radosť, približovala ma k jej Pôvodcovi.\n\nKeramiku som si kupovala a obdivovala. Až prišiel deň, kedy som ju začala aj ja tvoriť. Je to úžasný pocit, keď pod mojimi rukami hlina dostáva tvar a prostredníctvom vzduchu a ohňa sa mení v trvácu podobu.\n\nSnažím sa, aby dielka boli nielen oku lahodiace, ale aj praktické a užitočné. Verím, že prinesú radosť aj vám.",
        "It has always fascinated me and brought me joy, drawing me closer to its Creator.\n\nI used to buy ceramics and admire them. Then the day came when I started making them myself. It is a wonderful feeling when clay takes shape under my hands and, through air and fire, turns into something lasting.\n\nI try to make pieces that are not only pleasing to the eye but also practical and useful. I believe they will bring you joy too.",
      ],
      pribeh_foto_alt: ["Helena Sochnová sedí na skalách", "Helena Sochnová sitting on rocks"],
      rola: ["Keramikárka a lektorka", "Ceramicist and teacher"],
      tvorim_eyebrow: ["Krása a úžitok", "Beauty and purpose"],
      tvorim_nadpis: ["Ako tvorím", "How I work"],
      tvorim_aside: [
        "Bez hrnčiarskeho kruhu u mňa vznikajú misy, vázy, dekorácie a pokojne aj lampy.",
        "Without a potter’s wheel I make bowls, vases, decorations and even lamps.",
      ],
      citat: [
        "Keramika si vyžaduje svoj proces, čas. Učím sa pri jej výrobe trpezlivosti, byť „tu a teraz“, neponáhľať sa.",
        "Ceramics demands its own process, its own time. Making it teaches me patience, to be “here and now”, not to rush.",
      ],
      citat_zdroj: ["Z blogu Proces výroby keramiky", "From the blog post “How ceramics are made”"],
      blok1_nazov: ["O procese", "On the process"],
      blok1_text: [
        "Každý výrobok je robený ručne, čo mu dáva výnimočný charakter a autentickosť. Obsahuje kúsok duše jeho tvorcu, ktorý ho s láskou vytvoril.",
        "Every piece is made by hand, which gives it a unique character and authenticity. It holds a bit of the soul of the maker who created it with love.",
      ],
      blok1_foto_alt: ["Misa z hnedej hliny pred výpalom", "Brown clay bowl before firing"],
      blok2_nazov: ["O nákupe", "On buying"],
      blok2_text: [
        "Výrobky z nášho ateliéru sú nielen krásne, ale aj praktické. Bude mi veľkým potešením, keď sa niektorý kúsok dotkne vášho srdca a stane sa súčasťou vášho domova.",
        "Pieces from our studio are not only beautiful but also practical. It will be a great pleasure for me if one of them touches your heart and becomes part of your home.",
      ],
      blok2_foto_alt: ["Biela misa s vlnitým okrajom v rukách", "White bowl with a wavy rim held in hands"],
      zaujalo_nadpis: ["Zaujalo vás niečo?", "Did something catch your eye?"],
      zaujalo_text: [
        "Ak si chcete kúpiť výnimočný výrobok či už pre seba alebo ako darček, prípadne sa chcete prihlásiť na kurz, ozvite sa.",
        "If you would like to buy a special piece, for yourself or as a gift, or sign up for a class, get in touch.",
      ],
      tlacidlo_najdete: ["Tu ma nájdete", "Where to find me"],
      tlacidlo_obchod: ["Obchod", "Shop"],
      tlacidlo_kurzy: ["Kurzy", "Classes"],
    },
    {
      hero_foto: "/images/helena/helena-kvety.jpg",
      pribeh_foto: "/images/helena/helena-more.jpg",
      blok1_foto: "/images/diela/proces-hneda-misa.jpg",
      blok2_foto: "/images/diela/nakup-biela-misa.jpg",
    },
  ),

  sekcia("kontakt_stranka", "Stránka Kontakt · /kontakt", {
    meta_titulok: ["Kontakt", "Contact"],
    meta_popis: [
      "Keramika He-lienka, Na vrátkach 1K, 841 01 Bratislava-Dúbravka. Telefón 0903 394 212, e-mail info@keramikahelienka.sk.",
      "Keramika He-lienka, Na vrátkach 1K, 841 01 Bratislava-Dúbravka. Phone +421 903 394 212, email info@keramikahelienka.sk.",
    ],
    eyebrow: ["Kontakt", "Contact"],
    nadpis: ["Zostaňme v kontakte", "Let’s stay in touch"],
    lead: [
      "Radi vám pripravíme ponuku našich výrobkov, kurzov, workshopov a teambuildingu na mieru podľa vašich požiadaviek.",
      "We are happy to prepare an offer of our pieces, classes, workshops and team building tailored to your wishes.",
    ],
    telefon: ["Telefón", "Phone"],
    email: ["E-mail", "Email"],
    atelier: ["Ateliér", "Studio"],
    kde: ["Kde nás nájdete", "Where to find us"],
    atelier_nadpis: ["Ateliér v Dúbravke", "Studio in Dúbravka"],
    trasa: ["Naplánovať trasu", "Get directions"],
  }),

  sekcia("kontakt_formular", "Sekcia s formulárom · /, /kontakt, /kurzy, /pre-firmy", {
    eyebrow: ["Napíšte nám", "Write to us"],
    nadpis: ["Prihláška, dopyt aj otázky", "Sign-ups, enquiries and questions"],
    text: [
      "Prihláste sa na kurz, pošlite dopyt na teambuilding pre firmu alebo sa len opýtajte. Radi poradíme s kurzom, darčekom aj dielom na mieru.",
      "Sign up for a class, send an enquiry about team building for your company, or just ask. We are glad to help with a class, a gift or a custom piece.",
    ],
    sledujte: ["Sledujte nás", "Follow us"],
    // The form on /kurzy, only for sign-ups
    kurzy_eyebrow: ["Prihláška", "Sign-up"],
    kurzy_nadpis: ["Prihláste sa na kurz", "Sign up for a class"],
    kurzy_text: [
      "Vyberte kurz a termín. Ozveme sa vám s pokynmi k platbe. Kurz sa platí vopred, najneskôr 7 dní pred termínom, a miesto je vaše až po úhrade.",
      "Choose a class and a time. We will get back to you with payment details. Classes are paid in advance, at least 7 days before the date, and the place is yours once you have paid.",
    ],
    // The form on /pre-firmy, only for company enquiries
    firmy_eyebrow: ["Dopyt pre firmy", "Company enquiry"],
    firmy_nadpis: ["Teambuilding na mieru", "Team building made to measure"],
    firmy_text: [
      "Napíšte nám, koľko vás bude a kde chcete tvoriť. Pripravíme vám cenovú ponuku na mieru.",
      "Tell us how many of you there will be and where you would like to work. We will prepare a custom quote for you.",
    ],
  }),

  // ---------------------------------------------------------------- Obchod
  sekcia("obchod", "Obchod (nadpisy) · /obchod", {
    meta_titulok: ["Obchod", "Shop"],
    meta_popis: [
      "Ručne modelované vázy, misy, lampy, šálky a šperky z keramického ateliéru v Bratislave. Každý kus je originál.",
      "Hand-built vases, bowls, lamps, cups and jewellery from a ceramics studio in Bratislava. Every piece is an original.",
    ],
    eyebrow: ["Obchod", "Shop"],
    nadpis: ["Každý kus existuje len raz", "Every piece exists only once"],
    lead: [
      "Každý výrobok je robený ručne, čo mu dáva výnimočný charakter a autentickosť. Obsahuje kúsok duše jeho tvorcu, ktorý ho s láskou vytvoril.",
      "Every piece is made by hand, which gives it a unique character and authenticity. It holds a bit of the soul of the maker who created it with love.",
    ],
    vypredane_text: [
      "Tento kúsok už má nový domov. Ostáva tu ako galéria. Ak sa vám páči, opýtajte sa na podobný.",
      "This piece has found a new home and stays here as a gallery. If you like it, ask about a similar one.",
    ],
  }),

  sekcia(
    "kategorie",
    "Kategórie produktov (názvy) · /obchod",
    Object.fromEntries(Object.entries(kategorie).map(([slug, nazov]) => [slug, [nazov.sk, nazov.en] as Pole])),
  ),

  // ---------------------------------------------------------------- Právne stránky
  ...PRAVNE_SLUGY.map(pravnaSekcia),
];

export const DEFAULTS: Record<string, Record<string, string>> = Object.fromEntries(
  SECTIONS.map((s) => [s.section, { ...s.defaults, ...(s.images ?? {}) }]),
);

export const IMAGE_KEYS: Set<string> = new Set(SECTIONS.flatMap((s) => Object.keys(s.images ?? {})));

export function isImageKey(key: string): boolean {
  return IMAGE_KEYS.has(key);
}

/** Files (PDF) uploaded to Cloudinary. None yet; the admin field is ready for one. */
export const FILE_KEYS: Set<string> = new Set([]);

export function isFileKey(key: string): boolean {
  return FILE_KEYS.has(key);
}

/**
 * Keys whose value is a whole block of text rendered by <RichText>: blank line starts a
 * paragraph, `**text**` is bold, `[popis](/adresa)` is a link, a line starting with `- ` is a
 * bullet, `## nadpis` a heading and `[[údaj]]` a visible "doplniť" gap.
 */
export const RICH_TEXT_KEYS: Set<string> = new Set([
  "o_mne_domov.text",
  "o_mne.pribeh_text",
  "popup.text",
  ...KURZ_SEKCIE.map((s) => `${s}.popis_text`),
  ...[...KURZ_SEKCIE, "pre_firmy"].flatMap((s) => [1, 2, 3, 4].map((n) => `${s}.otazka${n}_odpoved`)),
  ...PRAVNE_SLUGY.map((slug) => `${pravnaSekciaPreSlug(slug)}.text`),
]);

export function isRichTextKey(key: string): boolean {
  return RICH_TEXT_KEYS.has(baseKey(key));
}

/** Keys edited as a Slovak yes/no switch in the admin, not as free text. */
export const SWITCH_KEYS: Set<string> = new Set(["info_lista.zobrazit", "popup.zobrazit"]);

export function isSwitchKey(key: string): boolean {
  return SWITCH_KEYS.has(key);
}

/** Truthy values accepted for a switch key, so a hand-typed value still works. */
export function isSwitchOn(value: string | undefined): boolean {
  return /^(ano|áno|1|true|zapnute|zapnuté)$/i.test((value ?? "").trim());
}

export const KEY_DEFAULTS: Record<string, string> = Object.assign(
  {},
  ...SECTIONS.map((s) => ({ ...s.defaults, ...(s.images ?? {}) })),
);

export function defaultFor(key: string): string {
  return KEY_DEFAULTS[key] ?? "";
}

/** True for the English twin of a translated key ("hero.lead_en") */
export function isEnglishKey(key: string): boolean {
  return key.endsWith("_en") && key.slice(0, -3) in KEY_DEFAULTS;
}

/** True for a Slovak key that has an English twin */
export function isTranslatedKey(key: string): boolean {
  return `${key}_en` in KEY_DEFAULTS;
}

/** "hero.lead_en" → "hero.lead"; any other key unchanged */
export function baseKey(key: string): string {
  return isEnglishKey(key) ? key.slice(0, -3) : key;
}

export function cloudinaryFolder(section: string): string {
  return `keramikahelienka/${section}`;
}

export type SectionGroup = {
  group: string;
  sections: string[];
};

export const SECTION_GROUPS: SectionGroup[] = [
  { group: "Celý web", sections: ["info_lista", "popup", "kontakt", "paticka", "seo"] },
  {
    group: "Domovská stránka",
    sections: ["hero", "intro", "diela_domov", "kurzy_domov", "o_mne_domov", "recenzie"],
  },
  { group: "Kurzy a firmy", sections: ["kurzy_stranka", "kurzy_ponuka", ...KURZ_SEKCIE, "cennik", "pre_firmy"] },
  { group: "O mne a kontakt", sections: ["o_mne", "kontakt_stranka", "kontakt_formular"] },
  { group: "Obchod", sections: ["obchod", "kategorie"] },
  { group: "Právne stránky", sections: PRAVNE_SLUGY.map(pravnaSekciaPreSlug) },
];
