// schema.org descriptions of the studio and the products, for Google's rich results.
// Check a page with https://search.google.com/test/rich-results after deploying.
import { localizeHref, type Locale } from "@/lib/i18n";
import { cloudinaryUrl } from "@/lib/cloudinary";
import { webUrl } from "@/lib/metadata";
import type { Produkt } from "@/lib/produkty";
import { kontakt } from "@/content/atelier";

const foto = (src: string) => cloudinaryUrl(src, ["c_limit", "w_1200", "f_jpg", "q_auto"]);

/** The studio as a local business: address, contacts and the map pin from content/atelier.ts */
export function atelierData(lang: Locale) {
  return {
    "@type": "Store",
    "@id": `${webUrl}/#atelier`,
    name: kontakt.nazov,
    url: webUrl + localizeHref("/", lang),
    image: foto("/images/helena/helena-portret.jpg"),
    telephone: kontakt.telefonHref.replace("tel:", ""),
    email: kontakt.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: kontakt.ulica,
      postalCode: kontakt.mesto.slice(0, 6),
      addressLocality: "Bratislava",
      addressCountry: "SK",
    },
    geo: { "@type": "GeoCoordinates", latitude: 48.189457, longitude: 17.042073 },
    sameAs: [kontakt.instagram, kontakt.facebook, kontakt.youtube],
  };
}

export function produktData(produkt: Produkt, lang: Locale) {
  return {
    "@type": "Product",
    name: produkt.nazov[lang],
    description: produkt.popis[lang].join(" ") || undefined,
    image: produkt.fotky.map(foto),
    url: webUrl + localizeHref(`/obchod/${produkt.slug}`, lang),
    brand: { "@type": "Brand", name: kontakt.nazov },
    offers: {
      "@type": "Offer",
      price: produkt.cena.toFixed(2),
      priceCurrency: "EUR",
      availability: produkt.vypredane ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": `${webUrl}/#atelier` },
    },
  };
}
