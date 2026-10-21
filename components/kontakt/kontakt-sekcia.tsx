import { bindShortWords } from "@/lib/i18n";
import { getContent, getKontakt, getKurzy, getTerminy } from "@/lib/content";
import { getLang } from "@/lib/i18n-server";
import type { TypDopytu } from "@/content/atelier";
import { KontaktForm } from "@/components/kontakt/kontakt-form";
import { Reveal } from "@/components/ui/reveal";

// The form card is always the other light color than the section, and its inputs match the section
const tones = {
  sand: { section: "bg-sand", card: "bg-mint [--field:var(--color-sand)]" },
  mint: { section: "bg-mint", card: "bg-sand [--field:var(--color-mint)]" },
};

type KontaktSekciaProps = {
  tone?: keyof typeof tones;
  /** Only this kind of form, with its own heading; without it the form has the switch */
  typ?: TypDopytu;
  /** Slug of the course chosen at first in the sign-up, on /kurzy/<slug> */
  kurz?: string;
  /** Phone and e-mail beside the form; off on /kontakt, where the page hero lists them */
  kanaly?: boolean;
};

/**
 * The form section, with `id="formular"` for the links in `formular`. With the switch on the homepage
 * and /kontakt; fixed to the sign-up on /kurzy and to the enquiry on /pre-firmy.
 */
export async function KontaktSekcia({ tone = "sand", typ, kurz, kanaly = false }: KontaktSekciaProps) {
  const lang = await getLang();
  const [c, kontakt, kurzy, terminy] = await Promise.all([
    getContent("kontakt_formular", lang),
    getKontakt(),
    getKurzy(lang),
    getTerminy(lang),
  ]);
  const siete = [
    { nazov: "Instagram", href: kontakt.instagram },
    { nazov: "Facebook", href: kontakt.facebook },
    { nazov: "YouTube", href: kontakt.youtube },
    { nazov: "LinkedIn", href: kontakt.linkedin },
  ].filter((siet) => siet.href);
  // The fixed forms have their own heading fields ("kontakt_formular.kurzy_nadpis"); the general
  // one stands in while a cached copy of the section predates them
  const t = (pole: string) => c[`kontakt_formular.${typ}_${pole}`] ?? c[`kontakt_formular.${pole}`];

  return (
    <section id="formular" className={`${tones[tone].section} py-24 md:py-36`}>
      <div className="site-container grid gap-14 lg:grid-cols-[1fr_30rem] lg:gap-16 xl:grid-cols-[1fr_40rem] xl:gap-20">
        <div>
          <Reveal>
            <p className="eyebrow text-drift">{t("eyebrow")}</p>
            <h2 className="mt-5 text-h2 text-deep">{bindShortWords(t("nadpis"))}</h2>
            <p className="mt-6 max-w-[28rem] text-lead text-ink/80">{t("text")}</p>
          </Reveal>

          {kanaly && (
            <Reveal delay={0.1} className="mt-10 space-y-2 touch:space-y-0">
              <a
                href={kontakt.telefonHref}
                className="block font-display text-[22px] leading-tight tracking-[-0.02em] text-deep transition-colors hover:text-sea touch:flex touch:min-h-11 touch:items-center"
              >
                {kontakt.telefon}
              </a>
              <a
                href={`mailto:${kontakt.email}`}
                className="block font-display text-[22px] leading-tight tracking-[-0.02em] text-deep transition-colors hover:text-sea touch:flex touch:min-h-11 touch:items-center"
              >
                {kontakt.email}
              </a>
            </Reveal>
          )}

          <Reveal delay={0.1} className="mt-12">
            <p className="eyebrow text-drift">{c["kontakt_formular.sledujte"]}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {siete.map((siet) => (
                <li key={siet.nazov}>
                  <a
                    href={siet.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-full border border-sage px-4 py-2 text-[15px] text-deep touch:py-2.5 transition-colors hover:border-deep hover:bg-deep hover:text-sand"
                  >
                    {siet.nazov}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.1} className={`rounded-card p-5 sm:p-8 lg:p-10 ${tones[tone].card}`}>
          <KontaktForm typ={typ} kurz={kurz} kurzy={kurzy} terminy={terminy} email={kontakt.email} />
        </Reveal>
      </div>
    </section>
  );
}
