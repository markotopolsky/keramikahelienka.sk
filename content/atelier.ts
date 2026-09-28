// Contact details and reviews from keramikahelienka.sk.

export const kontakt = {
  nazov: "Keramika He-lienka",
  ulica: "Na vrátkach 1K",
  mesto: "841 01 Bratislava",
  telefon: "0903 394 212",
  telefonHref: "tel:+421903394212",
  email: "info@keramikahelienka.sk",
  instagram: "https://www.instagram.com/keramika_helienka/",
  facebook: "https://www.facebook.com/Keramika.Helienka",
};

export const navigacia = [
  { label: "Kurzy", href: "/kurzy" },
  { label: "Obchod", href: "/obchod" },
  { label: "O mne", href: "/o-mne" },
  { label: "Blog", href: "/blog" },
  { label: "Kontakt", href: "/kontakt" },
];

export type Recenzia = {
  text: string;
  meno: string;
  miesto: string;
  tema: "Kurz" | "Nákup";
};

export const recenzie: Recenzia[] = [
  {
    text: "Som veľmi spokojná, výrobok je prekrásny, perfektne zabalený. Komunikácia s pani Helenkou, ktorá sväteničku vyrobila, bola výborná. Len tak ďalej. Zaslúži si najvyššie hodnotenie.",
    meno: "Jana",
    miesto: "Sološnica",
    tema: "Nákup",
  },
  {
    text: "Kurz keramiky v Ateliéri He-lienka bol pre mňa vždy relaxom a zdrojom inšpirácie aj mnohých nových možností. Helenka ako lektorka je veľmi ústretová a nápomocná. Počas viac ako roka to bol náš spoločný tvorivý čas s dcérou (7 r.). Individuálny prístup a priateľská atmosféra ateliéru mi veľmi vyhovuje.",
    meno: "Radka",
    miesto: "výtvarníčka",
    tema: "Kurz",
  },
  {
    text: "Pani Helenka, ďakujem veľmi pekne. Svietniky sú nádherné. Vaše dielka sú zosúladené, harmonické vzorom a aj farebne. Perfektné balenie. Budú sa v exteriéri nenápadne vynímať. Ešte raz Vám ďakujem a prajem veľa nadšenia, radosti a tvorivých nápadov.",
    meno: "Vlastina",
    miesto: "Belá-Dulice",
    tema: "Nákup",
  },
];
