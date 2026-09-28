import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { kontakt, navigacia } from "@/content/atelier";
import { pasFotiek } from "@/content/diela";
import { NewsletterForm } from "@/components/newsletter-form";

// Alternating tilt and offset for the photo strip, like prints dropped on a table
const tilt = ["-rotate-3 translate-y-4", "rotate-2", "-rotate-1 translate-y-6", "rotate-3 translate-y-2"];

export function SiteFooter() {
  // The strip is rendered twice so the marquee can loop without a seam
  const strip = [...pasFotiek, ...pasFotiek];

  return (
    <footer className="overflow-hidden bg-deep text-sand">
      <div aria-hidden className="border-b border-sand/15 pb-16 pt-6">
        <div className="flex w-max animate-marquee gap-6 hover:[animation-play-state:paused]">
          {strip.map((src, i) => (
            <div key={i} className={`w-56 shrink-0 bg-sand p-2.5 pb-10 shadow-[0_18px_40px_-20px_rgb(0_0_0/0.5)] ${tilt[i % tilt.length]}`}>
              <div className="relative aspect-[4/5]">
                <Image src={src} alt="" fill sizes="224px" className="object-cover" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="site-container pb-10 pt-16">
        <div className="flex items-start justify-between gap-10">
          <div>
            <p className="font-medium">Listy z ateliéru</p>
            <p className="mt-1.5 text-[14px] text-sand/75">Nové kurzy, kolekcie a termíny workshopov do schránky.</p>
            <div className="mt-6">
              <NewsletterForm />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-16 text-[15px]">
            <FooterColumn title="Stránky">
              {navigacia.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-aqua">
                    {item.label}
                  </Link>
                </li>
              ))}
            </FooterColumn>
            <FooterColumn title="Sledujte">
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
            <FooterColumn title="Ateliér">
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

        <div className="mt-24 flex items-end justify-between gap-10">
          <p className="font-serif text-[15rem] leading-[0.8] tracking-[-0.04em]">He-lienka</p>
          <div className="flex flex-col items-end gap-2 pb-4 text-[13px] text-sand/70">
            <div className="flex gap-5">
              <Link href="/obchodne-podmienky" className="hover:text-sand">
                Obchodné podmienky
              </Link>
              <Link href="/ochrana-osobnych-udajov" className="hover:text-sand">
                Ochrana osobných údajov
              </Link>
            </div>
            <p>© 2026 {kontakt.nazov}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="eyebrow text-[11px] text-aqua">{title}</p>
      <ul className="mt-4 space-y-2 text-sand/90">{children}</ul>
    </div>
  );
}
