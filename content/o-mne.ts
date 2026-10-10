// Texts for the /o-mne page, verbatim from the original site (ZAZNAMNIK.md):
// the "O nás" page (5.3), the homepage blocks (5.1) and the blog post "Proces výroby keramiky" (5.6).
// English: translated once with AI.
import type { Localized } from "@/lib/i18n";

/** "O nás" opens with the single word "Krása." The page sets it as the heading and continues with these. */
export const pribeh: Localized<string[]> = {
  sk: [
    "Vždy ma fascinovala a prinášala radosť, približovala ma k jej Pôvodcovi.",
    "Keramiku som si kupovala a obdivovala. Až prišiel deň, kedy som ju začala aj ja tvoriť. Je to úžasný pocit, keď pod mojimi rukami hlina dostáva tvar a prostredníctvom vzduchu a ohňa sa mení v trvácu podobu.",
    "Snažím sa, aby dielka boli nielen oku lahodiace, ale aj praktické a užitočné. Verím, že prinesú radosť aj vám.",
  ],
  en: [
    "It has always fascinated me and brought me joy, drawing me closer to its Creator.",
    "I used to buy ceramics and admire them. Then the day came when I started making them myself. It is a wonderful feeling when clay takes shape under my hands and, through air and fire, turns into something lasting.",
    "I try to make pieces that are not only pleasing to the eye but also practical and useful. I believe they will bring you joy too.",
  ],
};

export const krasa: Localized = { sk: "Krása.", en: "Beauty." };

export const oMneUvod: Localized = {
  sk: "Od roku 2020 mám vlastný ateliér. Z hliny tvorím krásu a drobné radosti a vediem kurzy keramiky vo svojom ateliéri v Dúbravke.",
  en: "I have had my own studio since 2020. I make beauty and small joys out of clay, and I teach pottery classes in my studio in Dúbravka.",
};

export const citatProces: Localized = {
  sk: "Keramika si vyžaduje svoj proces, čas. Učím sa pri jej výrobe trpezlivosti, byť „tu a teraz“, neponáhľať sa.",
  en: "Ceramics demands its own process, its own time. Making it teaches me patience, to be “here and now”, not to rush.",
};

export const bloky: { nazov: Localized; text: Localized; foto: string; alt: Localized }[] = [
  {
    nazov: { sk: "O procese", en: "On the process" },
    text: {
      sk: "Každý výrobok je robený ručne, čo mu dáva výnimočný charakter a autentickosť. Obsahuje kúsok duše jeho tvorcu, ktorý ho s láskou vytvoril.",
      en: "Every piece is made by hand, which gives it a unique character and authenticity. It holds a bit of the soul of the maker who created it with love.",
    },
    foto: "/images/proces-hneda-misa.jpg",
    alt: { sk: "Misa z hnedej hliny pred výpalom", en: "Brown clay bowl before firing" },
  },
  {
    nazov: { sk: "O nákupe", en: "On buying" },
    text: {
      sk: "Výrobky z nášho ateliéru sú nielen krásne, ale aj praktické. Bude mi veľkým potešením, keď sa niektorý kúsok dotkne vášho srdca a stane sa súčasťou vášho domova.",
      en: "Pieces from our studio are not only beautiful but also practical. It will be a great pleasure for me if one of them touches your heart and becomes part of your home.",
    },
    foto: "/images/nakup-biela-misa.jpg",
    alt: { sk: "Biela misa s vlnitým okrajom v rukách", en: "White bowl with a wavy rim held in hands" },
  },
];

export const zaujalo: Localized = {
  sk: "Ak si chcete kúpiť výnimočný výrobok či už pre seba alebo ako darček, prípadne sa chcete prihlásiť na kurz, ozvite sa.",
  en: "If you would like to buy a special piece, for yourself or as a gift, or sign up for a class, get in touch.",
};
