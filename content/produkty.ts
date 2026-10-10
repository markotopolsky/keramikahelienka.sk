// Shop texts in both languages, laid over the raw product data in docs/povodny-web/produkty.json
// (prices, stock and photos come from there). The phase 3 CMS replaces both files.
//
// The original shop mixed Slovak and English names and descriptions (ZAZNAMNIK.md section 10).
// Here every product has a Slovak and an English text, translated once with AI where the
// original had only one language. Question 7 for Helena: she still has to confirm this.
// Typos and mistakes listed in section 10 are not carried over: the "lampa" in the Shell bowl
// descriptions is "misa", "124)°C" is 1240 °C, "perecntage", "schamote", "specled", "turqoise",
// "colorfull", "Earings", "riešnych", "mailon" and "dizajnová žiarovku" are spelled correctly.
import type { Localized } from "@/lib/i18n";

export const kategorie = {
  vazy: { sk: "Vázy", en: "Vases" },
  misy: { sk: "Misy", en: "Bowls" },
  lampy: { sk: "Lampy", en: "Lamps" },
  salky: { sk: "Šálky", en: "Cups" },
  sperky: { sk: "Šperky", en: "Jewellery" },
  kurzy: { sk: "Kurzy", en: "Classes" },
  poukazky: { sk: "Poukážky", en: "Vouchers" },
} satisfies Record<string, Localized>;

export type KategoriaSlug = keyof typeof kategorie;

/** Categories of the original shop ("Vázy / Vases") mapped to ours. "Blue river" is a subcategory of jewellery. */
export const povodneKategorie: Record<string, KategoriaSlug | null> = {
  "Vázy / Vases": "vazy",
  "Misy / Bowls": "misy",
  "Lampy / Lamps": "lampy",
  "Šálky / Cups": "salky",
  "Šperky / Jewelry": "sperky",
  "Blue river": null,
  "Kurzy / Courses": "kurzy",
  "Poukážky / Vouchers": "poukazky",
};

export type Variant = { nazov: Localized; cena: number };

export type TextProduktu = {
  nazov: Localized;
  popis: Localized<string[]>;
  /** Cups sold with or without a lid. Prices from ZAZNAMNIK.md section 7. */
  varianty?: Variant[];
  /** Replaces the original categories where they were wrong (section 10) */
  kategorie?: KategoriaSlug[];
};

const bezVrchnaka: Localized = { sk: "Bez vrchnáka", en: "Without lid" };
const keramickyVrchnak: Localized = { sk: "S keramickým vrchnákom", en: "With ceramic lid" };

const zlato: Localized = {
  sk: "Kúsky zdobené zlatom nie sú vhodné do mikrovlnnej rúry ani do umývačky riadu.",
  en: "Items decorated with gold are not suitable for use in the microwave or dishwasher.",
};

const jedinyKus: Localized = { sk: "K dispozícii je len 1 kus.", en: "Only 1 piece available." };
const unikat: Localized = {
  sk: "Unikátne, jedinečné dielo, ktoré krásne doplní každý interiér.",
  en: "A unique, one-of-a-kind creation that will beautifully complement any interior.",
};
const pritahuje: Localized = { sk: "Je to samostatný kúsok, ktorý priťahuje pozornosť.", en: "It’s a standalone piece that draws attention." };
const kazdyZahyb: Localized = { sk: "Každý záhyb je jedinečný.", en: "Every fold is one of a kind." };

const musla: Localized<string[]> = {
  sk: ["Ručne modelovaná misa z kameniny s morským vzorom.", "Glazovaná, 2× vypálená."],
  en: ["Hand-built stoneware bowl with a sea pattern.", "Glazed, fired twice."],
};

const shellVase = (velkost?: Localized): Localized<string[]> => ({
  sk: [
    "Ručne modelovaná váza z kameniny.",
    "Tvarovaná rukou, náladou a prítomným okamihom.",
    kazdyZahyb.sk,
    "Váza je z béžovej hliny s malým podielom šamotu. Vnútro pokrýva opálovo biela glazúra s tyrkysovými odleskami, vonkajšia strana má zamatový efekt zafarbený podglazúrnymi farbami – surová, organická, akoby ju tvarovala príroda.",
    "Vypálená dvakrát. Najvyššia teplota výpalu bola 1240 °C, takže je úplne vodotesná.",
    pritahuje.sk,
    jedinyKus.sk,
    unikat.sk,
    ...(velkost ? [velkost.sk] : []),
  ],
  en: [
    "Hand-built stoneware vase.",
    "Shaped by the hand, the mood, and the present moment.",
    kazdyZahyb.en,
    "The vase is made from beige clay with a small percentage of chamotte. The interior is coated with an opal white glaze with turquoise highlights, while the exterior carries a velvet effect coloured by underglaze colours — raw, organic, as if shaped by nature’s touch.",
    "Fired two times. The highest firing temperature was 1240 °C, ensuring it is fully waterproof.",
    pritahuje.en,
    jedinyKus.en,
    unikat.en,
    ...(velkost ? [velkost.en] : []),
  ],
});

export const textyProduktov: Record<string, TextProduktu> = {
  "vaza-modra-vlna": {
    nazov: { sk: "Váza Modrá vlna", en: "Blue Wave vase" },
    popis: { sk: [], en: [] },
  },
  "citronova-misa": {
    nazov: { sk: "Citrónová misa", en: "Lemon bowl" },
    popis: { sk: [], en: [] },
  },
  "lampa-color": {
    nazov: { sk: "Lampa color", en: "Colour lamp" },
    popis: {
      sk: ["Glazovaná keramika, korok a drevo.", "Veľký závit E27.", "Kábel 1,5 m s vypínačom.", "Možnosť dokúpiť dizajnovú žiarovku za 35 €."],
      en: ["Glazed ceramics, cork and wood.", "Large E27 socket.", "1.5 m cable with a switch.", "A designer bulb can be added for €35."],
    },
  },
  "lampa-vyrezavana": {
    nazov: { sk: "Lampa vyrezávaná", en: "Carved lamp" },
    popis: {
      sk: ["Glazovaná keramika, veľký závit E27, kábel 1,5 m.", "Možnosť dokúpiť dizajnovú žiarovku v cene 35 €."],
      en: ["Glazed ceramics, large E27 socket, 1.5 m cable.", "A designer bulb can be added for €35."],
    },
  },
  "misa-musla-mala-2": { nazov: { sk: "Misa Mušľa malá 2", en: "Small Shell bowl 2" }, popis: musla },
  "misa-musla-mala": { nazov: { sk: "Misa Mušľa malá 1", en: "Small Shell bowl 1" }, popis: musla },
  "misa-musla-3": { nazov: { sk: "Misa Mušľa 3", en: "Shell bowl 3" }, popis: musla },
  "misa-musla-2": { nazov: { sk: "Misa Mušľa 2", en: "Shell bowl 2" }, popis: musla },
  "vaza-raku": {
    nazov: { sk: "Váza raku", en: "Raku-fired vase" },
    popis: {
      sk: [
        "Ručne modelovaná váza.",
        "Vypálená japonskou metódou raku.",
        "Unikátna keramika vytvorená unikátnou metódou, ktorú na Slovensku takmer nikto nepozná.",
      ],
      en: [
        "Hand-built vase.",
        "Fired with the Japanese raku method.",
        "Unique ceramics made with a unique method that almost nobody in Slovakia knows.",
      ],
    },
  },
  "raku-nadoba": {
    nazov: { sk: "Raku nádoba", en: "Raku vessel" },
    popis: {
      sk: ["Ručne modelovaná miska s pokrievkou.", "Vyrobená metódou unikátneho japonského výpalu Raku.", "Jedinečný kus."],
      en: ["Hand-built small bowl with a lid.", "Made with the unique Japanese raku firing method.", "A one-of-a-kind piece."],
    },
  },
  "raku-vaza": {
    nazov: { sk: "Raku váza", en: "Raku vase" },
    popis: { sk: [], en: [] },
  },
  "misa-musla-1": { nazov: { sk: "Misa Mušľa 1", en: "Shell bowl 1" }, popis: musla },
  "sada-dizajnovych-lamp": {
    nazov: { sk: "Sada lámp", en: "Set of lamps" },
    popis: {
      sk: ["Ručne modelované lampy z kameniny.", "Vhodné na žiarovku E27 / 220 V.", "Vypínač na prívodnom kábli.", "Možné používať v 2 polohách."],
      en: ["Hand-built stoneware lamps.", "For an E27 / 220 V bulb.", "Switch on the power cable.", "Can be used in 2 positions."],
    },
  },
  "misa-morska-velka": {
    nazov: { sk: "Misa morská veľká", en: "Large sea bowl" },
    popis: { sk: ["Ručne modelovaná misa s morskými vlnami."], en: ["Hand-built bowl with sea waves."] },
  },
  "vaza-prirodna": {
    nazov: { sk: "Váza prírodná", en: "Natural vase" },
    popis: {
      sk: [
        "Ručne modelovaná váza z bledej kameniny.",
        "Reliéf tvorený ručne aplikovaním vrstiev krémovej hliny.",
        "Váza je zvnútra glazovaná transparentnou glazúrou, aby sa ľahšie udržiavala, najmä pri použití živých kvetov.",
        "Vypaľované pri 1240 stupňoch Celzia.",
        "Vhodné na suché aj čerstvé kvety, konáre.",
        "Veľkosť: výška cca 18,5 cm, priemer 14,5 cm.",
        "Materiál: kamenina, glazúra. Spôsob výroby: keramika, glazovanie.",
      ],
      en: [
        "Hand-built vase made of pale stoneware.",
        "The relief is made by hand from layers of cream-coloured clay.",
        "Inside, the vase is glazed with a transparent glaze so it is easier to keep clean, especially with fresh flowers.",
        "Fired at 1240 degrees Celsius.",
        "Suitable for dried and fresh flowers and branches.",
        "Size: height approx. 18.5 cm, diameter 14.5 cm.",
        "Material: stoneware, glaze. Made by: hand-building, glazing.",
      ],
    },
  },
  "variabilna-misa": {
    nazov: { sk: "Variabilná misa", en: "Versatile bowl" },
    popis: {
      sk: [
        "MILUJEM KRÁSU UMENIA ✨",
        "Ešte radšej mám umenie, ktoré je nielen krásne, ale zároveň si nájde miesto v každodennom živote.",
        "Práve s týmto zámerom vznikla táto misa.",
        "A vlastne aj váza v jednom.",
        "Môže poslúžiť ako miesto pre ovocie. Môže sa stať vázou pre umelé aj živé kvety. A pokojne môže zostať sama sebou a len byť súčasťou vášho priestoru.",
        "Teší ma, keď moje diela nachádzajú svoje miesto vo vašich bežných dňoch, rodinných stretnutiach, ranných rituáloch alebo tichých chvíľach. 🤍",
        "Pre mňa je umenie plnohodnotné vtedy, keď nie je len krásne, ale aj funkčné.",
      ],
      en: [
        "I LOVE THE BEAUTY OF ART ✨",
        "Even more, I love art that is not only beautiful but also finds a place in everyday life.",
        "This bowl was made with exactly that in mind.",
        "And it is actually a vase as well.",
        "It can hold fruit. It can become a vase for artificial or fresh flowers. Or it can simply stay itself and be part of your space.",
        "It makes me happy when my pieces find their place in your ordinary days, family gatherings, morning rituals or quiet moments. 🤍",
        "For me, art is complete when it is not only beautiful but also functional.",
      ],
    },
  },
  "vyrezavana-misa": {
    nazov: { sk: "Vyrezávaná misa", en: "Carved bowl" },
    popis: {
      sk: [
        "Bol to kus zrecyklovanej hliny.",
        "Prišla inšpirácia a moje ruky začali pretvárať kus hliny na misu. S okrajmi jemne zahnutými dovnútra, s organickým tvarom.",
        "Zobrala som do rúk nástroj na vyrezávanie. Bez nejakého plánu som začala vytvárať reliéfny povrch. Intuitívne som začala aj skončila. Sušila som ju pomaly, aby sa nepokrútila. Potom išla do pece prvýkrát. Vydržala. Postupne som nanášala niekoľko vrstiev rôznych glazúr.",
        "Výsledok vidíte. Na dvoch miestach sa spracovaná hlina trochu vzbúrila.",
        "Misa sa dá využiť aj ako podnos alebo aj ako solitér vášho domova. Priemer má 37 cm a výšku 5 cm.",
        "Koho chytila za srdce?",
      ],
      en: [
        "It was a piece of recycled clay.",
        "Inspiration came and my hands began to turn the lump of clay into a bowl. With edges gently curving inwards, with an organic shape.",
        "I picked up a carving tool. Without any plan I began to create a relief surface. I started and finished intuitively. I dried it slowly so it would not warp. Then it went into the kiln for the first time. It survived. Step by step I applied several layers of different glazes.",
        "You can see the result. In two places the clay rebelled a little.",
        "The bowl can also serve as a tray or as a standalone piece in your home. It is 37 cm in diameter and 5 cm high.",
        "Whose heart has it won?",
      ],
    },
  },
  // The two bracelets have swapped slugs on the original site (section 10). The slugs stay for now
  // so the old URLs keep working; phase 3 fixes them together with redirects.
  "kolekcia-blue-river-naramok-2": {
    nazov: { sk: "Kolekcia Blue River – náramok 1", en: "Blue River collection – bracelet 1" },
    popis: {
      sk: ["Kombinácia riečnych perál a ručne vyrábaných perál z modrého porcelánu.", "Je možné zakúpiť aj náhrdelník."],
      en: ["A combination of river pearls and handmade beads of blue porcelain.", "A matching necklace is also available."],
    },
  },
  "kolekcia-blue-river-naramok-1": {
    nazov: { sk: "Kolekcia Blue River – náramok 2", en: "Blue River collection – bracelet 2" },
    popis: {
      sk: [
        "Ručne vyrábané zrniečka kombinované s riečnymi perlami.",
        "Kombinácia riečnych perál a ručne vyrábaných modrých perál.",
        "Možné dokúpiť aj náhrdelník v rovnakej kombinácii.",
      ],
      en: [
        "Handmade beads combined with river pearls.",
        "A combination of river pearls and handmade blue beads.",
        "A necklace in the same combination is also available.",
      ],
    },
  },
  "kolekcia-blue-river-nahrdelnik-3": {
    nazov: { sk: "Kolekcia Blue River – náhrdelník 3", en: "Blue River collection – necklace 3" },
    popis: {
      sk: ["Ručne robené modré zrniečka v kombinácii s modrými riečnymi perlami."],
      en: ["Handmade blue beads combined with blue river pearls."],
    },
  },
  "kolekcia-blue-river-nahrdelnik-2": {
    nazov: { sk: "Kolekcia Blue River – náhrdelník 2", en: "Blue River collection – necklace 2" },
    popis: {
      sk: [
        "Ručne vyrábaný náhrdelník – kombinácia modrých riečnych perál a ručne vyrobených zrniečok z modrého porcelánu.",
        "Je možné dokúpiť náramok.",
      ],
      en: ["Handmade necklace – a combination of blue river pearls and handmade beads of blue porcelain.", "A matching bracelet is also available."],
    },
  },
  "kolekcia-blue-river-nahrdelnik-1": {
    nazov: { sk: "Kolekcia Blue River – náhrdelník 1", en: "Blue River collection – necklace 1" },
    popis: {
      sk: ["Ručne robený náhrdelník – kombinácia bielych riečnych perál a ručne robených zrniečok z modrého porcelánu."],
      en: ["Handmade necklace – a combination of white river pearls and handmade beads of blue porcelain."],
    },
  },
  "vaza-koralova-kolekcia": {
    nazov: { sk: "Váza – korálová kolekcia", en: "Vase – coral collection" },
    popis: {
      sk: ["Vysoká váza v koralovom štýle.", "Trocha iný kúsok mora vo vašom živote.", "Jediný kus, neopakovateľný.", "24 × 11 cm"],
      en: ["Tall vase in a coral style.", "A slightly different piece of the sea in your life.", "A single piece that cannot be repeated.", "24 × 11 cm"],
    },
  },
  "keramicky-workshop-3-2-hodiny": {
    nazov: { sk: "Keramický workshop 3+2 hodiny", en: "Ceramics workshop 3+2 hours" },
    popis: {
      sk: [
        "Na workshope sa naučíte základy modelovania z hliny. Lektorka vás bude sprevádzať celým procesom. Vytvoríte si jedinečné kúsky, ktoré budú tešiť vás alebo vašich blízkych ako originálny darček. Pracujeme v malej skupine 3 – 6 ľudí.",
        "Na kruhu netočíme.",
        "Workshop môžete darovať prostredníctvom darčekovej poukážky, ktorú vám zašleme fyzicky poštou alebo elektronicky mailom.",
        "Harmonogram workshopu: 1. stretnutie: 3 hodiny – modelovanie. 2. stretnutie: 2 hodiny – glazovanie.",
        "Miesto: Ateliér, Na vrátkach 1K, Bratislava.",
        "V cene je zahrnuté: všetok materiál, pracovné pomôcky, uskladnenie výrobkov počas sušenia, 2× výpal v keramickej peci, malé občerstvenie.",
        "Príď a objav v sebe ukryté dary a talenty!",
        "Počet účastníkov je obmedzený.",
      ],
      en: [
        "At the workshop you learn the basics of modelling with clay. The teacher guides you through the whole process. You make unique pieces that will delight you or your loved ones as an original gift. We work in a small group of 3–6 people.",
        "We do not use the potter’s wheel.",
        "You can give the workshop as a gift voucher, which we send by post or by email.",
        "Schedule: 1st session: 3 hours – modelling. 2nd session: 2 hours – glazing.",
        "Place: Studio, Na vrátkach 1K, Bratislava.",
        "Included: all materials, tools, storage of your pieces while they dry, 2 × kiln firing, light refreshments.",
        "Come and discover the gifts and talents hidden in you!",
        "The number of participants is limited.",
      ],
    },
  },
  "earings-white-gold-medium": {
    nazov: { sk: "Náušnice biele so zlatom, stredné", en: "Earrings white gold medium" },
    popis: { sk: [], en: [] },
  },
  "cup-with-lava-glaze": {
    nazov: { sk: "Šálka s lávovou glazúrou", en: "Cup with lava glaze" },
    popis: { sk: [], en: [] },
    varianty: [
      { nazov: bezVrchnaka, cena: 39 },
      { nazov: keramickyVrchnak, cena: 45 },
    ],
  },
  "cup-with-cat": {
    nazov: { sk: "Šálka s mačkou", en: "Cup with cat" },
    popis: { sk: [zlato.sk], en: [zlato.en] },
    varianty: [
      { nazov: bezVrchnaka, cena: 35 },
      { nazov: { sk: "S to-go vrchnákom", en: "With to-go lid" }, cena: 41 },
    ],
  },
  "bowl-with-high-pedestal-and-gold": {
    nazov: { sk: "Misa na vysokom podstavci so zlatom", en: "Bowl with high pedestal and gold" },
    popis: { sk: [], en: [] },
  },
  "cup-with-gold-2": {
    nazov: { sk: "Ružová šálka so zlatom", en: "Cup with gold pinky" },
    popis: {
      sk: ["Krásna šálka zdobená farebnými a zlatými líniami.", "Ideálna na väčšiu kávu, čaj alebo matchu.", zlato.sk],
      en: ["Beautiful cup decorated with colourful and gold line patterns.", "Ideal for bigger coffee, tea or matcha.", zlato.en],
    },
    varianty: [
      { nazov: bezVrchnaka, cena: 43 },
      { nazov: keramickyVrchnak, cena: 49 },
    ],
  },
  "vase-high-unglazed": {
    nazov: { sk: "Vysoká neglazovaná váza", en: "Vase high unglazed" },
    popis: { sk: [], en: [] },
  },
  "vase-with-gold": {
    nazov: { sk: "Váza so zlatom", en: "Vase with gold" },
    popis: { sk: [], en: [] },
  },
  "small-vase-carved": {
    nazov: { sk: "Malá vyrezávaná váza", en: "Small vase carved" },
    popis: { sk: [], en: [] },
  },
  "small-vase-pink": {
    nazov: { sk: "Malá ružová váza", en: "Small vase pink" },
    popis: { sk: [], en: [] },
  },
  "oval-vase-mini": {
    nazov: { sk: "Oválna váza mini", en: "Oval vase mini" },
    popis: { sk: [], en: [] },
  },
  "art-object-lava-glazed": {
    nazov: { sk: "Art objekt s lávovou glazúrou", en: "Art object lava glazed" },
    popis: { sk: [], en: [] },
  },
  // Vases filed under bowls on the original site (section 10)
  "shell-big-glazed-vase": {
    nazov: { sk: "Veľká váza Mušľa, glazovaná", en: "Shell big glazed vase" },
    popis: shellVase(),
    kategorie: ["vazy"],
  },
  "2267": {
    nazov: { sk: "Guľatá glazovaná váza", en: "Ball vase glazed" },
    popis: {
      sk: [
        "Táto guľatá váza je ručne tvarovaná z bielej škvrnitej kameniny.",
        "Použila som niekoľko glazúr, aby som dosiahla efekt oceánu.",
        "Spodok vázy je neglazovaný, aby vynikol efekt stekajúcej glazúry.",
        "Po výpale pri 1240 stupňoch je váza vodotesná, takže ju môžete pokojne použiť na čerstvé kvety.",
      ],
      en: [
        "This ball vase is hand-shaped from white speckled stoneware.",
        "I used several glazes to achieve an ocean effect.",
        "The bottom of the vase is unglazed to highlight the glaze run effect.",
        "After firing at 1240 degrees, the vase is water-resistant so you can safely use it for fresh flowers.",
      ],
    },
  },
  "blue-porcelain-art-object": {
    nazov: { sk: "Modrá porcelánová váza „koral“", en: "Blue porcelain vase “Coral”" },
    popis: {
      sk: [
        "Ručne vyrobený porcelánový umelecký objekt/váza, ktorého tvar nevznikol podľa šablóny, ale bol vytvorený rukou, náladou a prítomným okamihom.",
        "Každý kus je jedinečný.",
        "Je vyrobený z modrého porcelánu a ručne pokrytý rôznymi povrchovými úpravami.",
        "Vnútro zdobí priehľadná glazúra, ktorá necháva vyniknúť prirodzenú textúru hliny.",
        pritahuje.sk,
        jedinyKus.sk,
        unikat.sk,
      ],
      en: [
        "Handmade porcelain art object/vase whose shape was not made from a template but by the hand, the mood and the present moment.",
        "Every piece is one of a kind.",
        "It is made of blue porcelain and finished by hand with various surface treatments.",
        "The interior features a transparent glaze that lets the natural texture of the clay shine through.",
        pritahuje.en,
        jedinyKus.en,
        unikat.en,
      ],
    },
  },
  "vase-speckled-clay-glazed": {
    nazov: { sk: "Váza zo škvrnitej hliny, glazovaná", en: "Vase speckled clay glazed" },
    popis: {
      sk: [
        "Ručne modelovaná váza so štruktúrou, vďaka ktorej je ideálnym dizajnovým doplnkom do každého interiéru.",
        "Váza je zo škvrnitej kameniny s kombináciou tmavej a svetlej lávovej glazúry na povrchu.",
        "Vnútro pokrýva transparentná glazúra. Vodotesná.",
        jedinyKus.sk,
        unikat.sk,
      ],
      en: [
        "Hand-sculpted vase, with a structure that makes it an ideal design accessory for any interior.",
        "The vase is made from speckled stoneware with a combination of dark and light lava glaze on its surface.",
        "The interior is coated with a transparent glaze. Water-resistant.",
        jedinyKus.en,
        unikat.en,
      ],
    },
  },
  "bowl-vase-grey-with-lava-glaze": {
    nazov: { sk: "Misa/váza sivá s lávovou glazúrou", en: "Bowl/vase grey with lava glaze" },
    popis: {
      sk: [
        "Ručne modelované dielo z kameniny, ktorého tvar nevznikol podľa šablóny, ale rukou, náladou a prítomným okamihom.",
        kazdyZahyb.sk,
        "Je z béžovej kameniny s povrchom s lávovým efektom – surovým, organickým, akoby ho tvarovala sama príroda.",
        "Vnútro má priehľadnú glazúru, cez ktorú vyniká prirodzená textúra hliny.",
        pritahuje.sk,
        jedinyKus.sk,
        unikat.sk,
      ],
      en: [
        "Hand-built stoneware artpiece whose form wasn’t created from a template, but shaped by the hand, the mood, and the present moment.",
        kazdyZahyb.en,
        "It is made from beige stoneware with a lava-effect surface — raw, organic, as if shaped by nature itself.",
        "The interior features a transparent glaze that allows the natural texture of the clay to shine through.",
        pritahuje.en,
        jedinyKus.en,
        unikat.en,
      ],
    },
  },
  "art-object-dark-brown": {
    nazov: { sk: "Art objekt tmavohnedý", en: "Art object dark brown" },
    popis: {
      sk: [
        "Z čiernej kameniny, ktorá po výpale ostáva na povrchu v surovom stave – neglazovaná, aby vynikla jej prirodzená krása bez ďalších úprav. Povrch je štruktúrovaný.",
        "Vnútro pokrýva transparentná glazúra. Vodotesný.",
        jedinyKus.sk,
        unikat.sk,
      ],
      en: [
        "Made from black stoneware, which remains in its raw state on the surface after firing—unglazed to emphasize its natural beauty without additional treatments. The surface is structured.",
        "The interior is coated with a transparent glaze. Waterproof.",
        jedinyKus.en,
        unikat.en,
      ],
    },
  },
  "art-object-white-glazed": {
    nazov: { sk: "Art objekt biely, glazovaný", en: "Art object white glazed" },
    popis: {
      sk: [
        "Ručne modelovaná váza/misa so štruktúrou, vďaka ktorej je ideálnym dizajnovým doplnkom do každého interiéru.",
        "Váza je zo svetlej kameniny s kombináciou rôznych povrchov.",
        "Vodotesná.",
        jedinyKus.sk,
        unikat.sk,
      ],
      en: [
        "Hand-sculpted vase/bowl, with a structure that makes it an ideal design accessory for any interior.",
        "The vase is made from light stoneware with a combination of various surfaces.",
        "Water-resistant.",
        jedinyKus.en,
        unikat.en,
      ],
    },
  },
  "moon-vase-green-glazed": {
    nazov: { sk: "Moon vase, zelená", en: "Moon vase green glazed" },
    popis: {
      sk: [
        "Ručne modelovaná váza so štruktúrou, vďaka ktorej je ideálnym dizajnovým doplnkom do každého interiéru.",
        "Váza je zo svetlej kameniny s kombináciou rôznych glazúr na povrchu.",
        "Vnútro pokrýva transparentná glazúra. Vodotesná.",
        jedinyKus.sk,
        unikat.sk,
      ],
      en: [
        "Hand-sculpted vase with a structure that makes it an ideal design accessory for any interior.",
        "The vase is made from light stoneware with a combination of various glazes on its surface.",
        "The interior is coated with a transparent glaze. Water-resistant.",
        jedinyKus.en,
        unikat.en,
      ],
    },
  },
  "moon-vase-turquoise-glazed": {
    nazov: { sk: "Moon vase, tyrkysová", en: "Moon vase turquoise glazed" },
    popis: {
      sk: [
        "Ručne modelovaná váza so štruktúrou, vďaka ktorej je ideálnym dizajnovým doplnkom do každého interiéru.",
        "Váza je zo svetlej kameniny s kombináciou rôznych glazúr.",
        "Vnútro pokrýva transparentná glazúra. Vodotesná.",
        jedinyKus.sk,
        unikat.sk,
      ],
      en: [
        "Hand-sculpted vase, with a structure that makes it an ideal design accessory for any interior.",
        "The vase is made from light stoneware with a combination of various glazes.",
        "The interior is coated with a transparent glaze. Water-resistant.",
        jedinyKus.en,
        unikat.en,
      ],
    },
  },
  "oval-vase-glazed": {
    nazov: { sk: "Oválna glazovaná váza", en: "Oval vase glazed" },
    popis: {
      sk: [
        "Ručne tvarovaná váza z bielej kameniny.",
        "Glazovaná niekoľkými glazúrami v odtieňoch modrej a sivej.",
        "Vypálená pri 1250 stupňoch Celzia.",
        "Vhodná na suché aj čerstvé kvety.",
        "Vodotesná.",
      ],
      en: [
        "A hand-shaped vase made of white stoneware.",
        "Glazed with several glazes in shades of blue and grey.",
        "Fired at 1250 degrees Celsius.",
        "Suitable for both dried and fresh flowers.",
        "Waterproof.",
      ],
    },
  },
  "vase-bubbles-morning-fog-glazed": {
    nazov: { sk: "Váza s bublinkami, ranná hmla", en: "Vase bubbles morning fog glazed" },
    popis: {
      sk: [
        "Ručne modelovaná váza.",
        "Z čiernej kameniny, ktorá aj po výpale ostáva na povrchu v surovom stave, teda neglazovaná, a tak vyniká jej prirodzená krása bez ďalších úprav. Hornú časť pokrýva bublinková zamatová podglazúra v tóne „ranná hmla“.",
        "Vnútro pokrýva transparentná glazúra. Vypálená pri 1240 °C. Vodotesná.",
        jedinyKus.sk,
        unikat.sk,
      ],
      en: [
        "Hand-sculpted vase.",
        "Made from black stoneware, which, even after firing, remains in its raw state on the surface, meaning it is unglazed, highlighting its natural beauty without any additional alterations. The upper part is covered by a bubbled velvet underglaze in a “morning fog” tone.",
        "The interior is coated with a transparent glaze. Fired at 1240 °C. Water-resistant.",
        jedinyKus.en,
        unikat.en,
      ],
    },
  },
  "vase-bubbles-amethyst-glazed": {
    nazov: { sk: "Váza s bublinkami, ametyst", en: "Vase bubbles amethyst glazed" },
    popis: {
      sk: [
        "Ručne modelovaná váza.",
        kazdyZahyb.sk,
        "Je z béžovej hliny s kombináciou trblietavej bielej glazúry v spodnej časti a bublinkovej ametystovej glazúry hore.",
        "Vnútro má priehľadnú glazúru.",
        pritahuje.sk,
        jedinyKus.sk,
        unikat.sk,
      ],
      en: [
        "Hand-built vase.",
        kazdyZahyb.en,
        "It is made from beige clay with a combination of glimmer white glaze on the lower part and bubbled amethyst glaze on the top.",
        "The interior features a transparent glaze.",
        pritahuje.en,
        jedinyKus.en,
        unikat.en,
      ],
    },
  },
  "shell-small-glazed-vase": {
    nazov: { sk: "Stredná váza Mušľa, glazovaná", en: "Shell middle glazed vase" },
    popis: shellVase({ sk: "Veľkosť: 11 × 32 cm (v × š)", en: "Size: 11 × 32 cm (h × w)" }),
    kategorie: ["vazy"],
  },
};
