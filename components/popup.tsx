"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import type { Localized } from "@/lib/i18n";
import type { PopupData } from "@/lib/content";
import { analytikaZapnuta, nacitajSuhlas } from "@/lib/analytika";
import { useLang } from "@/components/locale-provider";
import { RichText } from "@/components/rich-text";
import { ButtonLink } from "@/components/ui/button-link";

const texty = {
  zavriet: { sk: "Zavrieť", en: "Close" },
} satisfies Record<string, Localized>;

/** localStorage key holding the version of the popup the visitor closed */
const KLUC = "kh-popup-zavrety";
/** Shown a moment after the page loads, not over the first thing the visitor reads */
const ONESKORENIE_MS = 4000;
/** Pages where a popup would get in the way of a purchase or a private link */
const BEZ_POPUPU = /^(\/en)?\/(kosik|pokladna|objednavka)(\/|$)/;

/**
 * Popup window from /admin (section "popup"): photo, heading, text and an optional button.
 * Each version shows once per visitor; changing "verzia" in the admin shows it again. Native
 * <dialog>: focus stays inside, Esc and a click outside close it. It waits until the visitor has
 * answered the cookie bar, so the two never cover each other.
 */
export function Popup({ popup }: { popup: PopupData }) {
  const lang = useLang();
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!popup.zobrazit || BEZ_POPUPU.test(pathname)) return;
    try {
      if (localStorage.getItem(KLUC) === popup.verzia) return;
    } catch {
      return; // No storage: it could not stay closed, so it is not shown at all
    }
    if (analytikaZapnuta && !nacitajSuhlas()) return;

    const casovac = setTimeout(() => dialog.current?.showModal(), ONESKORENIE_MS);
    return () => clearTimeout(casovac);
  }, [popup.zobrazit, popup.verzia, pathname]);

  function zapamatat() {
    try {
      localStorage.setItem(KLUC, popup.verzia);
    } catch {
      // Without storage the popup simply shows again on a later visit
    }
  }

  if (!popup.zobrazit) return null;

  return (
    <dialog
      ref={dialog}
      aria-labelledby="popup-nadpis"
      onClose={zapamatat}
      // A click on the backdrop lands on the <dialog> itself, not on its content
      onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
      className="m-auto w-[min(28rem,calc(100vw-2rem))] overflow-hidden rounded-card bg-sand p-0 text-ink shadow-2xl backdrop:bg-ink/50 open:animate-rise motion-reduce:open:animate-none"
    >
      {popup.foto && (
        <div className="relative aspect-[4/3] bg-mint">
          <Image src={popup.foto} alt={popup.fotoAlt} fill sizes="28rem" className="object-cover" />
        </div>
      )}
      <div className="p-6 sm:p-8">
        <h2 id="popup-nadpis" className="font-display text-[26px] leading-tight text-deep">
          {popup.nadpis}
        </h2>
        {popup.text && <RichText value={popup.text} className="mt-3 space-y-3 text-[15px] leading-relaxed text-ink/85" />}
        <div className="mt-6 flex flex-wrap items-center gap-4">
          {popup.tlacidlo && (
            // Following the button counts as closing this version of the popup
            <div onClick={() => dialog.current?.close()}>
              <ButtonLink href={popup.tlacidlo.href} variant="deep" external={/^https?:/.test(popup.tlacidlo.href)}>
                {popup.tlacidlo.text}
              </ButtonLink>
            </div>
          )}
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            className="text-[15px] text-deep underline decoration-sage underline-offset-4 hover:decoration-deep touch:min-h-11"
          >
            {texty.zavriet[lang]}
          </button>
        </div>
      </div>
    </dialog>
  );
}
