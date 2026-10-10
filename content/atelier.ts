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
  youtube: "https://www.youtube.com/@keramikahe-lienka6410",
  linkedin: "https://www.linkedin.com/in/helena-sochnova-675b85279/",
};

// The studio on Google Maps. The embed is the one from the original Kontakt page.
export const mapa = {
  embed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2659.890737842819!2d17.042073076892898!3d48.18945664754739!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476c8dcba5b721d1%3A0x639fb33182c93094!2sKeramika%20Helienka!5e0!3m2!1sen!2ssk!4v1715363894208!5m2!1sen!2ssk",
  odkaz: "https://www.google.com/maps/search/?api=1&query=Keramika%20Helienka%2C%20Na%20vr%C3%A1tkach%201K%2C%20Bratislava",
  trasa: "https://www.google.com/maps/dir/?api=1&destination=48.189457,17.042073",
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
