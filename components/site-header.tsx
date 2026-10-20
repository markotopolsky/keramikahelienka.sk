"use client";

import { usePathname, useSelectedLayoutSegments } from "next/navigation";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { formular, kontakt, kosik, navigacia } from "@/content/atelier";
import type { Localized } from "@/lib/i18n";
import { useCart } from "@/lib/use-cart";
import { useLang } from "@/components/locale-provider";
import { InfoLista } from "@/components/info-lista";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ButtonLink } from "@/components/ui/button-link";
import { LocaleLink } from "@/components/ui/locale-link";
import { Logo } from "@/components/ui/logo";

const texty = {
  rezervovat: { sk: "Rezervovať kurz", en: "Book a class" },
  navigacia: { sk: "Hlavná navigácia", en: "Main navigation" },
  menu: { sk: "Menu", en: "Menu" },
  zavriet: { sk: "Zavrieť", en: "Close" },
  kosik: { sk: "Košík", en: "Cart" },
} satisfies Record<string, Localized>;

/** True once the page's dark top section (marked `data-hero`) has scrolled away, or if the page has none */
function heroScrolledAway() {
  const hero = document.querySelector("[data-hero]");
  const heroBottom = hero ? hero.getBoundingClientRect().bottom : 0;
  return heroBottom < Math.max(window.innerHeight * 0.25, 96);
}

/**
 * Transparent over the dark top section of a page, turns solid sand once that section scrolls away.
 * Below 1024px the links move into a full-screen menu (a modal <dialog>, so the
 * browser handles Escape, focus and hiding the page from screen readers).
 */
export function SiteHeader() {
  const lang = useLang();
  const { pocetKusov } = useCart();
  // Effects only: with proxy.ts rewrites the pathname differs between server and browser
  const pathname = usePathname();
  // The section the page belongs to ("/kurzy"), the same on server and client
  const section = `/${useSelectedLayoutSegments()[0] ?? ""}`;
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  // The info bar shows only at the very top of the page
  const [naVrchu, setNaVrchu] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useMotionValueEvent(scrollY, "change", (y) => {
    setSolid(heroScrolledAway());
    setNaVrchu(y < 24);
  });

  // The header lives in the root layout, so measure again once a new page has rendered
  useEffect(() => {
    const frame = requestAnimationFrame(() => setSolid(heroScrolledAway()));
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  // The menu only exists on phones and tablets: close it when the window grows to the desktop layout
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 64rem)");
    const onChange = () => {
      if (desktop.matches) menuRef.current?.close();
    };
    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
  }, []);

  function openMenu() {
    menuRef.current?.showModal();
    closeRef.current?.focus();
    setMenuOpen(true);
  }

  function closeMenu() {
    menuRef.current?.close();
  }

  // Any link in the menu closes it, so the next page does not open behind it
  function closeOnLink(event: MouseEvent<HTMLDialogElement>) {
    if ((event.target as HTMLElement).closest("a")) closeMenu();
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 motion-safe:animate-fade-in ${
        solid ? "bg-sand text-ink shadow-[0_1px_0_rgb(47_111_122/0.12)]" : "text-sand"
      }`}
      style={{ animationDelay: "0.2s", animationDuration: "0.6s" }}
    >
      <InfoLista skryta={!naVrchu} />
      <div className="site-container flex h-16 items-center justify-between lg:grid lg:h-20 lg:grid-cols-[1fr_auto_1fr]">
        {/* The logo's own colors on the solid sand bar, its shape in sand over the dark hero; the two crossfade */}
        <LocaleLink href="/" className="grid w-32 justify-self-start lg:w-40">
          <span aria-hidden={!solid} className={`col-start-1 row-start-1 transition-opacity duration-500 ${solid ? "" : "opacity-0"}`}>
            <Logo farba="znacka" className="w-full" />
          </span>
          <span aria-hidden={solid} className={`col-start-1 row-start-1 transition-opacity duration-500 ${solid ? "opacity-0" : ""}`}>
            <Logo farba="text" className="w-full" />
          </span>
        </LocaleLink>

        <nav aria-label={texty.navigacia[lang]} className="max-lg:hidden">
          <ul className="flex items-center gap-9 text-[15px]">
            {navigacia.map((item) => (
              <li key={item.href}>
                <LocaleLink
                  href={item.href}
                  aria-current={section === item.href ? "page" : undefined}
                  className="relative py-1 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100 aria-[current=page]:after:scale-x-100"
                >
                  {item.label[lang]}
                </LocaleLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 justify-self-end">
          <LanguageSwitcher className="mr-3 max-lg:hidden" />
          <ButtonLink href={formular.kurzy} variant="deep" className="max-sm:hidden">
            {texty.rezervovat[lang]}
          </ButtonLink>
          <LocaleLink
            href={kosik}
            aria-label={texty.kosik[lang]}
            aria-current={section === kosik ? "page" : undefined}
            className="relative inline-flex size-[2.875rem] items-center justify-center rounded-full border border-current/40 transition-colors hover:border-current aria-[current=page]:border-current"
          >
            <BasketIcon className="size-5" />
            {pocetKusov > 0 && (
              <span
                aria-hidden
                className="absolute right-0 top-0 flex size-5 items-center justify-center rounded-full bg-aqua text-[11px] font-medium text-ink"
              >
                {pocetKusov}
              </span>
            )}
          </LocaleLink>
          <button
            type="button"
            onClick={openMenu}
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            aria-controls="mobilne-menu"
            className="inline-flex items-center gap-2.5 rounded-full border border-current/40 px-4 py-3 text-[15px] font-medium leading-[1.5] transition-colors hover:border-current lg:hidden"
          >
            {texty.menu[lang]}
            <svg viewBox="0 0 16 10" aria-hidden className="h-2.5 w-4">
              <path d="M0 1h16M0 9h16" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>
      </div>

      <dialog
        id="mobilne-menu"
        ref={menuRef}
        aria-label={texty.menu[lang]}
        onClose={() => setMenuOpen(false)}
        onClick={closeOnLink}
        className="m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto bg-deep text-sand opacity-0 transition-[opacity,display,overlay] duration-400 ease-soft transition-discrete backdrop:bg-transparent open:opacity-100 starting:open:opacity-0 motion-reduce:transition-none lg:hidden"
      >
        <div className="site-container flex min-h-full flex-col pb-10">
          <div className="flex h-16 shrink-0 items-center justify-between">
            <LocaleLink href="/" className="w-32">
              <Logo farba="text" className="w-full" />
            </LocaleLink>
            <button
              ref={closeRef}
              type="button"
              onClick={closeMenu}
              className="inline-flex items-center gap-2.5 rounded-full border border-sand/40 px-4 py-3 text-[15px] font-medium leading-[1.5] transition-colors hover:border-sand"
            >
              {texty.zavriet[lang]}
              <svg viewBox="0 0 12 12" aria-hidden className="size-3">
                <path d="m1 1 10 10M11 1 1 11" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
          </div>

          <nav aria-label={texty.navigacia[lang]} className="mt-8">
            <ul className="border-t border-sand/15">
              {navigacia.map((item, i) => (
                <li
                  key={item.href}
                  style={{ transitionDelay: `${120 + i * 60}ms` }}
                  className="border-b border-sand/15 transition-[opacity,translate] duration-700 ease-soft starting:translate-y-5 starting:opacity-0 motion-reduce:transition-none"
                >
                  <LocaleLink
                    href={item.href}
                    aria-current={section === item.href ? "page" : undefined}
                    className="flex items-baseline justify-between gap-6 py-4 font-display text-[clamp(2.5rem,11vw,3.5rem)] leading-none tracking-[-0.03em] transition-colors hover:text-aqua aria-[current=page]:text-aqua"
                  >
                    {item.label[lang]}
                    <span aria-hidden className="eyebrow font-sans text-[11px] text-aqua">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </LocaleLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto pt-12">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <ButtonLink href={formular.kurzy}>{texty.rezervovat[lang]}</ButtonLink>
              <LanguageSwitcher className="text-[15px]" />
            </div>
            <ul className="mt-8 space-y-1.5 text-[15px] text-sand/80">
              <li>
                {kontakt.ulica}, {kontakt.mesto}
              </li>
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
              <li className="flex gap-5 pt-1.5">
                <a href={kontakt.instagram} className="hover:text-aqua">
                  Instagram
                </a>
                <a href={kontakt.facebook} className="hover:text-aqua">
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>
      </dialog>
    </header>
  );
}

/** Line drawing of a woven shopping basket with a handle */
function BasketIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className={className}>
      <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 8.5 9 3.5M14 8.5l-3-5" />
        <path d="M2.5 8.5h15l-1.6 7.3a1.5 1.5 0 0 1-1.5 1.2H5.6a1.5 1.5 0 0 1-1.5-1.2Z" />
        <path d="M7.5 11.5v2.5M10 11.5v2.5M12.5 11.5v2.5" />
      </g>
    </svg>
  );
}
