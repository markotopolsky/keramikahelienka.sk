import { useSyncExternalStore } from "react";

export type PolozkaKosika = {
  slug: string;
  /** Index do produkt.varianty, alebo null keď produkt varianty nemá */
  variant: number | null;
  mnozstvo: number;
};

const KLUC = "kh-kosik";
const PRAZDNY: PolozkaKosika[] = [];

let polozky: PolozkaKosika[] = PRAZDNY;
let hydrovane = false;
const odberatelia = new Set<() => void>();

function rovnakaPolozka(a: PolozkaKosika, slug: string, variant: number | null) {
  return a.slug === slug && a.variant === variant;
}

/** Načíta uložený košík z localStorage – iba raz, len na klientovi. */
function hydrovat() {
  if (hydrovane || typeof window === "undefined") return;
  hydrovane = true;
  try {
    const ulozene = localStorage.getItem(KLUC);
    if (ulozene) polozky = JSON.parse(ulozene);
  } catch {
    // Private mode alebo zakázané úložisko – košík ostane prázdny.
  }
}

function zmenit(dalsie: PolozkaKosika[]) {
  polozky = dalsie;
  try {
    localStorage.setItem(KLUC, JSON.stringify(polozky));
  } catch {
    // Úložisko plné alebo zakázané – košík funguje len do konca návštevy.
  }
  odberatelia.forEach((odber) => odber());
}

function subscribe(odber: () => void) {
  odberatelia.add(odber);
  return () => odberatelia.delete(odber);
}

function getSnapshot() {
  hydrovat();
  return polozky;
}

function getServerSnapshot() {
  return PRAZDNY;
}

function pridat(slug: string, variant: number | null) {
  const existujuca = polozky.find((p) => rovnakaPolozka(p, slug, variant));
  if (existujuca) {
    zmenit(polozky.map((p) => (rovnakaPolozka(p, slug, variant) ? { ...p, mnozstvo: p.mnozstvo + 1 } : p)));
  } else {
    zmenit([...polozky, { slug, variant, mnozstvo: 1 }]);
  }
}

function odobrat(slug: string, variant: number | null) {
  zmenit(polozky.filter((p) => !rovnakaPolozka(p, slug, variant)));
}

function zmenitMnozstvo(slug: string, variant: number | null, mnozstvo: number) {
  if (mnozstvo < 1) return odobrat(slug, variant);
  zmenit(polozky.map((p) => (rovnakaPolozka(p, slug, variant) ? { ...p, mnozstvo } : p)));
}

function vyprazdnit() {
  zmenit([]);
}

/**
 * Košík obchodu. Žije iba v prehliadači (localStorage) – nie je napojený na žiadny backend,
 * ten prichádza vo fáze 3 (ZAZNAMNIK.md §15). Do vtedy nič nerezervuje a nikam sa neodosiela.
 * Rovnaký vzor ako `lib/use-media-query.ts`: jeden spoločný stav mimo Reactu, prečítaný cez
 * `useSyncExternalStore`, server vidí prázdny košík.
 */
export function useCart() {
  const polozky = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const pocetKusov = polozky.reduce((spolu, p) => spolu + p.mnozstvo, 0);
  return { polozky, pridat, odobrat, zmenitMnozstvo, vyprazdnit, pocetKusov };
}
