import Image from "next/image";
import type { ReactNode } from "react";
import type { Localized } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { kontakt, navigacia } from "@/content/atelier";
import { pasFotiek } from "@/content/diela";
import { pravneStranky } from "@/content/pravne";
import { LanguageSwitcher } from "@/components/language-switcher";
import { NewsletterForm } from "@/components/newsletter-form";
import { LocaleLink } from "@/components/ui/locale-link";
import { Logo } from "@/components/ui/logo";

const texty = {
  newsletter: { sk: "Listy z ateliéru", en: "Letters from the studio" },
  newsletterText: {
    sk: "Nové kurzy, kolekcie a termíny workshopov do schránky.",
    en: "New classes, collections and workshop dates in your inbox.",
  },
  stranky: { sk: "Stránky", en: "Pages" },
  sledujte: { sk: "Sledujte", en: "Follow" },
  atelier: { sk: "Ateliér", en: "Studio" },
} satisfies Record<string, Localized>;

// Alternating tilt and offset for the photo strip, like prints dropped on a table
const tilt = ["-rotate-3 translate-y-4", "rotate-2", "-rotate-1 translate-y-6", "rotate-3 translate-y-2"];

export async function SiteFooter() {
  const lang = await getLang();
  // The strip is rendered twice so the marquee can loop without a seam
  const strip = [...pasFotiek, ...pasFotiek];

  return (
    <footer className="overflow-hidden bg-deep text-sand">
      <div aria-hidden className="border-b border-sand/15 pb-12 pt-6 md:pb-16">
        <div className="flex w-max animate-marquee gap-4 hover:[animation-play-state:paused] md:gap-6">
          {strip.map((src, i) => (
            <div
              key={i}
              className={`w-40 shrink-0 bg-sand p-2 pb-8 shadow-[0_18px_40px_-20px_rgb(0_0_0/0.5)] md:w-56 md:p-2.5 md:pb-10 ${tilt[i % tilt.length]}`}
            >
              <div className="relative aspect-[4/5]">
                <Image src={src} alt="" fill sizes="(min-width: 48rem) 224px, 160px" className="object-cover" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="site-container pb-8 pt-12 md:pb-10 md:pt-16">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
          <div id="newsletter">
            <p className="font-medium">{texty.newsletter[lang]}</p>
            <p className="mt-1.5 text-[14px] text-sand/75">{texty.newsletterText[lang]}</p>
            <div className="mt-6">
              <NewsletterForm />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 text-[15px] md:grid-cols-3 md:gap-12 xl:gap-16">
            <FooterColumn title={texty.stranky[lang]}>
              {navigacia.map((item) => (
                <li key={item.href}>
                  <LocaleLink href={item.href} className="hover:text-aqua">
                    {item.label[lang]}
                  </LocaleLink>
                </li>
              ))}
            </FooterColumn>
            <FooterColumn title={texty.sledujte[lang]}>
              <li>
                <a href={kontakt.instagram} className="hover:text-aqua">
                  Instagram
                </a>
              </li>
              <li>
                <a href={kontakt.facebook} className="hover:text-aqua">
                  Facebook
                </a>
              </li>
            </FooterColumn>
            {/* The e-mail address is too long for half a phone screen, so this column takes a full row there */}
            <FooterColumn title={texty.atelier[lang]} className="max-md:col-span-2">
              <li>{kontakt.ulica}</li>
              <li>{kontakt.mesto}</li>
              <li>
                <a href={kontakt.telefonHref} className="hover:text-aqua">
                  {kontakt.telefon}
                </a>
              </li>
              <li>
                <a href={`mailto:${kontakt.email}`} className="hover:text-aqua">
                  {kontakt.email}
                </a>
              </li>
            </FooterColumn>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-6 md:mt-24 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          {/* Spans the column on phones and tablets; drawn in sand because teal would vanish on the deep background */}
          <Logo farba="text" className="w-full max-w-[44rem] shrink-0 lg:w-[clamp(28rem,45vw,44rem)]" />
          <div className="flex min-w-0 flex-col gap-2 text-[13px] text-sand/70 lg:items-end lg:pb-4 lg:text-right">
            <div className="flex flex-wrap gap-x-5 gap-y-2 lg:justify-end">
              {pravneStranky.map((stranka) => (
                <LocaleLink key={stranka.slug} href={`/${stranka.slug}`} className="hover:text-sand">
                  {stranka.nazov[lang]}
                </LocaleLink>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 lg:justify-end">
              <p>© 2026 {kontakt.nazov}</p>
              <LanguageSwitcher className="text-sand" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <p className="eyebrow text-[11px] text-aqua">{title}</p>
      <ul className="mt-4 space-y-2 text-sand/90">{children}</ul>
    </div>
  );
}
