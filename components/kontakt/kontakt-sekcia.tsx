import { kontakt } from "@/content/atelier";
import { KontaktForm } from "@/components/kontakt/kontakt-form";
import { Reveal } from "@/components/ui/reveal";

const siete = [
  { nazov: "Instagram", href: kontakt.instagram },
  { nazov: "Facebook", href: kontakt.facebook },
  { nazov: "YouTube", href: kontakt.youtube },
  { nazov: "LinkedIn", href: kontakt.linkedin },
];

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
export function KontaktSekcia({ tone = "sand", kanaly = false }: KontaktSekciaProps) {
  return (
    <section id="formular" className={`${tones[tone].section} py-24 md:py-36`}>
      <div className="site-container grid gap-14 lg:grid-cols-[1fr_36rem] lg:gap-20 xl:grid-cols-[1fr_40rem]">
        <div>
          <Reveal>
            <p className="eyebrow text-drift">Napíšte nám</p>
            <h2 className="mt-5 text-h2 text-deep">Prihláška, dopyt aj otázky</h2>
            <p className="mt-6 max-w-[28rem] text-lead text-ink/80">
              Prihláste sa na kurz, pošlite dopyt na teambuilding pre firmu alebo sa len opýtajte. Radi poradíme s kurzom,
              darčekom aj dielom na mieru.
            </p>
          </Reveal>

          {kanaly && (
            <Reveal delay={0.1} className="mt-10 space-y-2">
              <a
                href={kontakt.telefonHref}
                className="block font-display text-[22px] leading-tight tracking-[-0.02em] text-deep transition-colors hover:text-sea"
              >
                {kontakt.telefon}
              </a>
              <a
                href={`mailto:${kontakt.email}`}
                className="block font-display text-[22px] leading-tight tracking-[-0.02em] text-deep transition-colors hover:text-sea"
              >
                {kontakt.email}
              </a>
            </Reveal>
          )}

          <Reveal delay={0.1} className="mt-12">
            <p className="eyebrow text-drift">Sledujte nás</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {siete.map((siet) => (
                <li key={siet.nazov}>
                  <a
                    href={siet.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-full border border-sage px-4 py-2 text-[15px] text-deep transition-colors hover:border-deep hover:bg-deep hover:text-sand"
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
