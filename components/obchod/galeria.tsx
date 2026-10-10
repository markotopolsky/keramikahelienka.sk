"use client";

import Image from "next/image";
import { useState } from "react";
import type { Localized } from "@/lib/i18n";
import { useLang } from "@/components/locale-provider";

const texty = {
  fotka: { sk: "fotka", en: "photo" },
  fotky: { sk: "Fotky", en: "Photos" },
} satisfies Record<string, Localized>;

/** Large photo with a row of thumbnails underneath; a thumbnail swaps the large photo. */
export function Galeria({ fotky, nazov, vypredane }: { fotky: string[]; nazov: string; vypredane: boolean }) {
  const lang = useLang();
  const [aktivna, setAktivna] = useState(0);

  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-sage">
        <Image
          key={fotky[aktivna]}
          src={fotky[aktivna]}
          alt={aktivna === 0 ? nazov : `${nazov}, ${texty.fotka[lang]} ${aktivna + 1}`}
          fill
          preload
          sizes="(min-width: 90rem) 680px, (min-width: 64rem) 50vw, calc(100vw - 2.5rem)"
          className={`object-cover ${vypredane ? "opacity-80 grayscale" : ""}`}
        />
      </div>

      {fotky.length > 1 && (
        <ul aria-label={texty.fotky[lang]} className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-6 sm:gap-3">
          {fotky.map((foto, i) => (
            <li key={foto}>
              <button
                type="button"
                onClick={() => setAktivna(i)}
                aria-pressed={i === aktivna}
                aria-label={`${texty.fotka[lang]} ${i + 1}`}
                className="relative block aspect-square w-full overflow-hidden rounded-lg bg-sage opacity-70 ring-deep ring-offset-2 ring-offset-sand transition hover:opacity-100 aria-pressed:opacity-100 aria-pressed:ring-2"
              >
                <Image src={foto} alt="" fill sizes="120px" className={`object-cover ${vypredane ? "grayscale" : ""}`} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
