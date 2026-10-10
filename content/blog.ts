// The two blog posts from the original site, verbatim (ZAZNAMNIK.md section 5.6). Author: Helenka.
// English: translated once with AI. Slugs are the original WordPress ones, for the phase 6 redirects
// from /2023/11/10/proces-vyroby-keramiky/ and /2023/11/11/uprava-salky-po-odliati/.
import type { Localized } from "@/lib/i18n";

export type Clanok = {
  slug: string;
  /** ISO date of the original post */
  datum: string;
  nazov: Localized;
  popis: Localized;
  odseky: Localized<string[]>;
  /** YouTube video id; the player loads only after a click */
  video?: string;
  foto: string;
  fotoAlt: Localized;
};

export const clanky: Clanok[] = [
  {
    slug: "uprava-salky-po-odliati",
    datum: "2023-11-11",
    nazov: { sk: "Ako si vyrobiť šálku odlievaním", en: "How to make a cup by slip casting" },
    popis: {
      sk: "Jednotlivé kroky výroby šálky odlievaním nájdete vo videu.",
      en: "The individual steps of making a slip-cast cup are in the video.",
    },
    odseky: { sk: ["Jednotlivé kroky nájdete vo videu."], en: ["You can find the individual steps in the video."] },
    video: "5Ie4aFM-mZA",
    foto: "/images/produkty/cup-with-gold-2-1.jpg",
    fotoAlt: { sk: "Šálka so zlatými líniami v ruke", en: "Cup with gold lines held in a hand" },
  },
  {
    slug: "proces-vyroby-keramiky",
    datum: "2023-11-10",
    nazov: { sk: "Proces výroby keramiky", en: "How ceramics are made" },
    popis: {
      sk: "Ako na výrobu keramiky? Postupov je viacero. Priblížime vám celý proces modelovania keramiky z plátu hliny, na čo si dať pozor. Nezatajíme vám ani jeho úskalia. Lepšie je však raz vidieť ako raz počuť. Príďte si to vyskúšať na vlastnej koži v našom ateliéri.",
      en: "How are ceramics made? There are several ways. We walk you through the whole process of building ceramics from a slab of clay and what to watch out for, including the pitfalls. But seeing is better than hearing. Come and try it yourself in our studio.",
    },
    odseky: {
      sk: [
        "Keramika si vyžaduje svoj proces, čas. Učím sa pri jej výrobe trpezlivosti, byť „tu a teraz“, neponáhľať sa.",
        "Najprv zoberem hlinu a modelujem (musí byť dobre prepacovaná, v správnej vlhkosti, pružnosti). Niekedy si len pripravím „diely“ a pokračujem až na druhý deň. Inokedy zase spravím len hrubé nahodenie veci. Každá (aj keď oku neviditeľná) molekula vzduchu spôsobí prasknutie výrobku v peci.",
        "Keď má vec finálny tvar, nechám preschnúť a retušujem (nasucho a aj namokro). Potom nechám dokonale preschnúť, až „na kosť“. Každá vlhkosť by znamenala roztrhnutie vecičky v peci… Doba schnutia sa líši od veľkosti výrobku, jeho hrúbky, modelovanej vrstvy – šáločka cca týždeň, forma na pečenie (nielen) chleba (hlavne vrchnák, ktorý je komplikovanejší a hrubší) môže vyžadovať aj 2-3 týždne.",
        "Potom ide do pece na prvý prežah (zvyčajne 950 stupňov Celzia). Výpal, spolu s chladnutím pece trvá cca 17 hodín.",
        "Keď chcem zvýrazniť detaily – nanášam „burel“. Vecička ide znova do pece (ten istý cyklus).",
        "A možem glazovať. Nanesiem glazúru, veľmi detailne, po kúskoch. V dvoch vrstvách, po preschnutí prvej.",
        "Dám do pece na glazovací program (zvyčajne 1050 stupňov Celzia). Výpal spolu s chladnutím trvá cca 20 hodín.",
        "Niekedy treba glazúru na niektorých miestach opraviť, výrobok ide znova do pece.",
        "V každej fáze tohto procesu výroby (aj keď ho robím 101x) sa môže stať, že sa niečo nepodarí.",
        "Preto je ručná práca taká unikátna a vyžaduje moju, aj Vašu trpezlivosť a zhovievavosť :o)",
        "Uvedené doby výroby sú preto orientačné (rolu zohráva aj počet zákaziek a kurzov v danom čase, ako aj moja zdravotná, či rodinná situácia). Veci robím väčšinou na mieru, podľa želania zákazníka, na sklade mávam málokedy „niečo v zálohe“.",
        "Mám však kúsky, ktoré majú drobné, či väčšie nedokonalosti, ktoré však nebránia ich funkčnosti. Ak máš o takýto jedinečný kúsok záujem, neváhaj ma kontaktovať.",
      ],
      en: [
        "Ceramics demands its own process, its own time. Making it teaches me patience, to be “here and now”, not to rush.",
        "First I take the clay and model it (it has to be well wedged, with the right moisture and plasticity). Sometimes I only prepare the “parts” and carry on the next day. Other times I just rough out the shape. Every molecule of air, even one invisible to the eye, can make the piece crack in the kiln.",
        "When the piece has its final shape, I let it dry a little and refine it (dry and wet). Then I let it dry completely, “bone dry”. Any moisture would make the piece burst in the kiln… Drying time depends on the size of the piece, its thickness and the modelled layer – a small cup takes about a week, a baking dish for bread (and more), especially the lid, which is more complicated and thicker, may need 2–3 weeks.",
        "Then it goes into the kiln for the first bisque firing (usually 950 degrees Celsius). The firing, including the kiln cooling down, takes about 17 hours.",
        "When I want to bring out details, I apply “burel”. The piece goes back into the kiln (the same cycle).",
        "And then I can glaze. I apply the glaze very carefully, bit by bit. In two layers, after the first one has dried.",
        "It goes into the kiln on the glaze programme (usually 1050 degrees Celsius). The firing, including cooling, takes about 20 hours.",
        "Sometimes the glaze needs touching up in places, and the piece goes into the kiln again.",
        "At every stage of this process (even though I have done it 101 times) something can go wrong.",
        "That is why handwork is so unique and asks for patience and understanding from me and from you :o)",
        "The times given are therefore approximate (the number of orders and classes at the time also plays a role, as do my health and family situation). I mostly make pieces to order, as the customer wishes; I rarely have “something in reserve” in stock.",
        "I do, however, have pieces with small or larger imperfections that do not affect how they work. If you are interested in such a one-of-a-kind piece, do not hesitate to contact me.",
      ],
    },
    foto: "/images/proces-hneda-misa.jpg",
    fotoAlt: { sk: "Misa z hnedej hliny pred výpalom", en: "Brown clay bowl before firing" },
  },
];
