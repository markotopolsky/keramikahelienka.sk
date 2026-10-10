"use client";

import { useEffect, useRef } from "react";
import type { Localized } from "@/lib/i18n";
import { infoLista, infoListaKluc } from "@/content/info-lista";
import { useLang } from "@/components/locale-provider";
import { Doplnit } from "@/components/ui/doplnit";

const texty = {
  oznam: { sk: "Oznam", en: "Announcement" },
  zavriet: { sk: "Zavrieť oznam", en: "Close announcement" },
} satisfies Record<string, Localized>;

/**
 * Closing hides the bar with a data attribute on <html>, the same one the inline script in
 * app/[lang]/layout.tsx sets before the first paint, so a closed bar never flashes on reload.
 * The bar's height is published as --info-lista; <main> uses it as top padding so the bar,
 * which sits in the fixed header, never covers the page.
 */
export function InfoLista({ skryta }: { skryta: boolean }) {
  const lang = useLang();
  const obsah = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = obsah.current;
    if (!element) return;
    const root = document.documentElement;
    const observer = new ResizeObserver(() => root.style.setProperty("--info-lista", `${element.offsetHeight}px`));
    observer.observe(element);
    return () => {
      observer.disconnect();
      root.style.removeProperty("--info-lista");
    };
  }, []);

  function zavriet() {
    document.documentElement.setAttribute("data-info-zavreta", "");
    try {
      localStorage.setItem(infoListaKluc, infoLista.id);
    } catch {
      // Private mode without storage: the bar stays closed until the next page load
    }
  }

  if (!infoLista.zobrazit) return null;

  return (
    // Collapses once the page scrolls; its height stays in --info-lista so the page does not jump
    <aside
      data-info-lista
      aria-label={texty.oznam[lang]}
      inert={skryta}
      className={`grid transition-[grid-template-rows] duration-500 ease-soft motion-reduce:transition-none ${
        skryta ? "grid-rows-[0fr]" : "grid-rows-[1fr]"
      }`}
    >
      <div className="overflow-hidden">
        <div ref={obsah} className="bg-aqua text-ink">
          <div className="site-container relative flex min-h-10 items-center justify-center py-2 pr-12 text-center text-[14px] leading-snug sm:pr-14">
            <p>
              {infoLista.text ? infoLista.text[lang] : <Doplnit>aktuálny oznam od Helenky – zľava, zľavový kód alebo výstava</Doplnit>}
              {infoLista.odkaz && (
                <>
                  {" "}
                  <a
                    href={infoLista.odkaz.href}
                    className="whitespace-nowrap font-medium underline decoration-ink/40 underline-offset-4 hover:decoration-ink"
                  >
                    {infoLista.odkaz.text[lang]}
                  </a>
                </>
              )}
            </p>
            <button
              type="button"
              onClick={zavriet}
              aria-label={texty.zavriet[lang]}
              className="absolute right-[calc(var(--spacing-gutter)-0.5rem)] top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full transition-colors hover:bg-ink/10"
            >
              <svg viewBox="0 0 12 12" aria-hidden className="size-3">
                <path d="m1 1 10 10M11 1 1 11" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
