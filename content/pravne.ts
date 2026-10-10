// Legal pages (ZAZNAMNIK.md section 15, step 8). Helena supplies the final wording (section 14).
import type { Localized } from "@/lib/i18n";

export type PravnaStranka = {
  slug: string;
  nazov: Localized;
};

export const pravneStranky: PravnaStranka[] = [
  { slug: "obchodne-podmienky", nazov: { sk: "Obchodné podmienky", en: "Terms and conditions" } },
  { slug: "reklamacny-poriadok", nazov: { sk: "Reklamačný poriadok", en: "Complaints policy" } },
  { slug: "ochrana-osobnych-udajov", nazov: { sk: "Ochrana osobných údajov", en: "Privacy policy" } },
  { slug: "cookies", nazov: { sk: "Cookies", en: "Cookies" } },
];
