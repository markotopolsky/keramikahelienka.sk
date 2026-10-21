import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formatPrice, type Localized } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { nacitajPonuku } from "@/lib/ponuka";
import { PageHero } from "@/components/page-hero";
import { PonukaForm } from "@/components/obchod/ponuka-form";
import { ButtonLink } from "@/components/ui/button-link";

// Each visit reads the current state of the offer; the link is private, so it is never indexed
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ponuka dopravy · Keramika He-lienka",
  robots: { index: false, follow: false },
};

const texty = {
  eyebrow: { sk: "Objednávka", en: "Order" },
  nadpis: { sk: "Ponuka dopravy", en: "Delivery offer" },
  uvod: {
    sk: "Pripravili sme vám cenu dopravy. Skontrolujte objednávku a potvrďte ju. Až potvrdením sa objednávka stáva záväznou.",
    en: "We have prepared your delivery price. Please check the order and confirm it. The order becomes binding only once you confirm.",
  },
  platiDo: { sk: "Ponuka platí do {cas}.", en: "The offer is valid until {cas}." },
  adresa: { sk: "Doručíme na adresu", en: "Delivery address" },
  doprava: { sk: "Doprava", en: "Delivery" },
  medzisucet: { sk: "Tovar", en: "Items" },
  spolu: { sk: "Spolu", en: "Total" },
  potvrdena: {
    sk: "Objednávka je potvrdená. Platbu kartou cez Comgate zapojíme pred spustením obchodu, potvrdenie e-mailom príde tiež neskôr.",
    en: "The order is confirmed. Card payment through Comgate is connected before the shop opens, and the email confirmation comes later too.",
  },
  pripravujeme: { sk: "Cenu dopravy ešte pripravujeme.", en: "We are still preparing the delivery price." },
  neplati: {
    sk: "Táto ponuka už neplatí a kúsky sme uvoľnili. Ak o ne stále máte záujem, napíšte nám.",
    en: "This offer is no longer valid and the pieces have been released. If you are still interested, write to us.",
  },
  kontakt: { sk: "Napísať nám", en: "Write to us" },
} satisfies Record<string, Localized>;

/**
 * The customer's private link from Helena's delivery offer (/admin → Objednávky → Poslať ponuku).
 * Shows the items, the address and the full price including delivery, and lets the customer
 * confirm (lib/objednavka-akcia.ts → potvrditPonuku).
 */
export default async function PonukaPage({ params }: PageProps<"/[lang]/objednavka/[token]">) {
  const { token } = await params;
  const lang = await getLang();
  const ponuka = await nacitajPonuku(token);
  if (!ponuka) notFound();

  const cas = (iso: string) =>
    new Date(iso).toLocaleString(lang === "sk" ? "sk-SK" : "en-GB", {
      timeZone: "Europe/Bratislava",
      day: "numeric",
      month: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  const platna =
    ponuka.stav === "ponuka_odoslana" && ponuka.rezervovaneDo !== null && new Date(ponuka.rezervovaneDo) > new Date();
  const potvrdena = ["caka_na_platbu", "zaplatena", "vybavena"].includes(ponuka.stav);

  return (
    <>
      <PageHero eyebrow={`${texty.eyebrow[lang]} ${ponuka.cislo}`} title={texty.nadpis[lang]} />
      <section className="bg-sand py-16 md:py-20">
        <div className="site-container grid max-w-[40rem] gap-8">
          {platna && (
            <p className="text-[15px] leading-relaxed text-ink">
              {texty.uvod[lang]} {texty.platiDo[lang].replace("{cas}", cas(ponuka.rezervovaneDo!))}
            </p>
          )}

          <ul className="divide-y divide-sage border-y border-sage text-[14px]">
            {ponuka.polozky.map((p, i) => (
              <li key={i} className="flex items-baseline justify-between gap-4 py-3">
                <span className="text-ink">
                  {p.nazov}
                  {p.variant && <span className="text-drift"> · {p.variant}</span>}
                  <span className="text-drift"> × {p.pocet}</span>
                </span>
                <span className="shrink-0 text-deep">{formatPrice(p.cenaZaKus * p.pocet, lang)}</span>
              </li>
            ))}
          </ul>

          <dl className="grid gap-2 text-[15px]">
            <div className="flex justify-between gap-4">
              <dt className="text-drift">{texty.medzisucet[lang]}</dt>
              <dd>{formatPrice(ponuka.medzisucet, lang)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-drift">
                {texty.doprava[lang]}
                {ponuka.dopravaSposob && ` · ${ponuka.dopravaSposob}`}
              </dt>
              <dd>{ponuka.stav === "caka_na_cenu_dopravy" ? "–" : formatPrice(ponuka.dopravaCena, lang)}</dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-sage pt-3 font-display text-[20px]">
              <dt className="text-deep">{texty.spolu[lang]}</dt>
              <dd className="text-ink">{formatPrice(ponuka.spolu, lang)}</dd>
            </div>
          </dl>

          <div className="text-[15px]">
            <p className="eyebrow text-[11px] text-drift">{texty.adresa[lang]}</p>
            <p className="mt-2">
              {ponuka.meno}
              <br />
              {ponuka.ulica}
              <br />
              {ponuka.psc} {ponuka.mesto}
            </p>
          </div>

          {platna ? (
            <PonukaForm token={token} spolu={ponuka.spolu} />
          ) : potvrdena ? (
            <p className="rounded-card bg-mint p-4 text-[15px] leading-relaxed text-deep">{texty.potvrdena[lang]}</p>
          ) : ponuka.stav === "caka_na_cenu_dopravy" ? (
            <p className="text-[15px] text-drift">{texty.pripravujeme[lang]}</p>
          ) : (
            <div className="flex flex-col items-start gap-5">
              <p className="text-[15px] leading-relaxed text-ink/80">{texty.neplati[lang]}</p>
              <ButtonLink href="/kontakt" variant="deep">
                {texty.kontakt[lang]}
              </ButtonLink>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
