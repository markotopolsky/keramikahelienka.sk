"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { kontakt, navigacia } from "@/content/atelier";
import { ButtonLink } from "@/components/ui/button-link";

/**
 * Transparent over the hero, turns solid sand once the hero scrolls away.
 * Below 1024px the links move into a full-screen menu (a modal <dialog>, so the
 * browser handles Escape, focus and hiding the page from screen readers).
 */
export function SiteHeader() {
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useMotionValueEvent(scrollY, "change", (y) => {
    setSolid(y > window.innerHeight * 0.75);
  });

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
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        solid ? "bg-sand text-ink shadow-[0_1px_0_rgb(47_111_122/0.12)]" : "text-sand"
      }`}
    >
      <div className="site-container flex h-16 items-center justify-between lg:grid lg:h-20 lg:grid-cols-[1fr_auto_1fr]">
        <Link href="/" className="justify-self-start font-serif text-[26px] leading-none tracking-[-0.02em] lg:text-[30px]">
          He-lienka
        </Link>

        <nav aria-label="Hlavná navigácia" className="max-lg:hidden">
          <ul className="flex items-center gap-9 text-[15px]">
            {navigacia.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="relative py-1 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 justify-self-end">
          <ButtonLink href="/kurzy#rezervacia" variant={solid ? "deep" : "primary"} className="max-sm:hidden">
            Rezervovať kurz
          </ButtonLink>
          <button
            type="button"
            onClick={openMenu}
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            aria-controls="mobilne-menu"
            className="inline-flex items-center gap-2.5 rounded-full border border-current/40 px-4 py-3 text-[15px] font-medium leading-[1.5] transition-colors hover:border-current lg:hidden"
          >
            Menu
            <svg viewBox="0 0 16 10" aria-hidden className="h-2.5 w-4">
              <path d="M0 1h16M0 9h16" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>
      </div>

      <dialog
        id="mobilne-menu"
        ref={menuRef}
        aria-label="Menu"
        onClose={() => setMenuOpen(false)}
        onClick={closeOnLink}
        className="m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto bg-deep text-sand opacity-0 transition-[opacity,display,overlay] duration-400 ease-soft transition-discrete backdrop:bg-transparent open:opacity-100 starting:open:opacity-0 motion-reduce:transition-none lg:hidden"
      >
        <div className="site-container flex min-h-full flex-col pb-10">
          <div className="flex h-16 shrink-0 items-center justify-between">
            <Link href="/" className="font-serif text-[26px] leading-none tracking-[-0.02em]">
              He-lienka
            </Link>
            <button
              ref={closeRef}
              type="button"
              onClick={closeMenu}
              className="inline-flex items-center gap-2.5 rounded-full border border-sand/40 px-4 py-3 text-[15px] font-medium leading-[1.5] transition-colors hover:border-sand"
            >
              Zavrieť
              <svg viewBox="0 0 12 12" aria-hidden className="size-3">
                <path d="m1 1 10 10M11 1 1 11" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
          </div>

          <nav aria-label="Hlavná navigácia" className="mt-8">
            <ul className="border-t border-sand/15">
              {navigacia.map((item, i) => (
                <li
                  key={item.href}
                  style={{ transitionDelay: `${120 + i * 60}ms` }}
                  className="border-b border-sand/15 transition-[opacity,translate] duration-700 ease-soft starting:translate-y-5 starting:opacity-0 motion-reduce:transition-none"
                >
                  <Link
                    href={item.href}
                    className="flex items-baseline justify-between gap-6 py-4 font-serif text-[clamp(2.5rem,11vw,3.5rem)] leading-none tracking-[-0.03em] transition-colors hover:text-aqua"
                  >
                    {item.label}
                    <span aria-hidden className="eyebrow font-sans text-[11px] text-aqua">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto pt-12">
            <ButtonLink href="/kurzy#rezervacia">Rezervovať kurz</ButtonLink>
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
    </motion.header>
  );
}
