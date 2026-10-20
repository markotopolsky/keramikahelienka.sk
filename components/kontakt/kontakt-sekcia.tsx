import { bindShortWords, type Localized } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { kontakt } from "@/content/atelier";
import { KontaktForm } from "@/components/kontakt/kontakt-form";
import { Reveal } from "@/components/ui/reveal";

const siete = [
  { nazov: "Instagram", href: kontakt.instagram },
  { nazov: "Facebook", href: kontakt.facebook },
  { nazov: "YouTube", href: kontakt.youtube },
  { nazov: "LinkedIn", href: kontakt.linkedin },
];

const texty = {
  eyebrow: { sk: "Napíšte nám", en: "Write to us" },
  nadpis: { sk: "Prihláška, dopyt aj otázky", en: "Sign-ups, enquiries and questions" },
  text: {
    sk: "Prihláste sa na kurz, pošlite dopyt na teambuilding pre firmu alebo sa len opýtajte. Radi poradíme s kurzom, darčekom aj dielom na mieru.",
    en: "Sign up for a class, send an enquiry about team building for your company, or just ask. We are glad to help with a class, a gift or a custom piece.",
  },
  sledujte: { sk: "Sledujte nás", en: "Follow us" },
} satisfies Record<string, Localized>;

// The form card is always the other light color than the section, and its inputs match the section
const tones = {
  sand: { section: "bg-sand", card: "bg-mint [--field:var(--color-sand)]" },
  mint: { section: "bg-mint", card: "bg-sand [--field:var(--color-mint)]" },
};

type KontaktSekciaProps = {
  tone?: keyof typeof tones;
  /** Phone and e-mail beside the form; off on /kontakt, where the page hero lists them */
  kanaly?: boolean;
};

/** The form section, with `id="formular"` for the links in `formular`. Used on the homepage and on /kontakt. */
export async function KontaktSekcia({ tone = "sand", kanaly = false }: KontaktSekciaProps) {
  const lang = await getLang();

  return (
    <section id="formular" className={`${tones[tone].section} py-24 md:py-36`}>
      <div className="site-container grid gap-14 lg:grid-cols-[1fr_30rem] lg:gap-16 xl:grid-cols-[1fr_40rem] xl:gap-20">
        <div>
          <Reveal>
            <p className="eyebrow text-drift">{texty.eyebrow[lang]}</p>
            <h2 className="mt-5 text-h2 text-deep">{bindShortWords(texty.nadpis[lang])}</h2>
            <p className="mt-6 max-w-[28rem] text-lead text-ink/80">{texty.text[lang]}</p>
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
            <p className="eyebrow text-drift">{texty.sledujte[lang]}</p>
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
          <KontaktForm />
        </Reveal>
      </div>
    </section>
  );
}
