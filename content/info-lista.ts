// Info bar at the top of every page (ZAZNAMNIK.md section 12): discounts, discount codes,
// announcements such as an upcoming exhibition, and a link to the newsletter.
// The phase 3 CMS replaces this file, so Helena can change the text herself.
import type { Localized } from "@/lib/i18n";

export type InfoLista = {
  zobrazit: boolean;
  /** Visitors who closed the bar see it again once this changes, so change it with every new text */
  id: string;
  /** null shows a visible "doplniť" gap */
  text: Localized | null;
  odkaz: { href: string; text: Localized } | null;
};

export const infoLista: InfoLista = {
  zobrazit: true,
  id: "2026-10",
  // TODO: Helena's current announcement (section 15, step 6)
  text: null,
  odkaz: {
    href: "#newsletter",
    text: { sk: "Prihláste sa na Listy z ateliéru", en: "Subscribe to Letters from the studio" },
  },
};

/** localStorage key holding the id of the bar the visitor closed */
export const infoListaKluc = "info-lista-zavreta";
