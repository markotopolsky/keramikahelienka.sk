// Contact details from keramikahelienka.sk. They are the defaults of the "kontakt" section in /admin
// (lib/content-defaults.ts); the site reads them through getKontakt() in lib/content.ts.
import type { Localized } from "@/lib/i18n";

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

/** Slovak paths; LocaleLink adds /en on English pages */
export const navigacia: { label: Localized; href: string }[] = [
  { label: { sk: "Kurzy", en: "Classes" }, href: "/kurzy" },
  { label: { sk: "Pre firmy", en: "For companies" }, href: "/pre-firmy" },
  { label: { sk: "Obchod", en: "Shop" }, href: "/obchod" },
  { label: { sk: "O mne", en: "About me" }, href: "/o-mne" },
  { label: { sk: "Blog", en: "Blog" }, href: "/blog" },
  { label: { sk: "Kontakt", en: "Contact" }, href: "/kontakt" },
];

/** Cart page of the shop (phase 4 in ZAZNAMNIK.md section 15) */
export const kosik = "/kosik";

/**
 * Links to the right form (`KontaktSekcia`): the sign-up on /kurzy, the enquiry on /pre-firmy,
 * and a question on /kontakt, whose form keeps the switch. Course sign-ups used to go to Helena's Google form.
 */
export const formular = {
  firmy: "/pre-firmy#formular",
  kurzy: "/kurzy#formular",
  otazka: "/kontakt?typ=otazka#formular",
};

export type TypDopytu = keyof typeof formular;

/**
 * Subpages /kurzy/<slug> of the course cards, in card order: the first belongs to slot
 * "kurzy_ponuka.kurz1_…" in /admin. `cennik` adds the full price list, for the courses it has prices of.
 * A slug is a public address; changing one needs a redirect from the old address.
 */
export const kurzyStranky: { slug: string; cennik: boolean }[] = [
  { slug: "mesacny-kurz", cennik: true },
  { slug: "workshop", cennik: false },
  { slug: "volny-atelier", cennik: false },
  { slug: "deti-a-rodicia", cennik: true },
];

/** The sign-up tab of the form with this course already chosen */
export function prihlaskaNaKurz(slug: string) {
  return `/kurzy?kurz=${slug}#formular`;
}
