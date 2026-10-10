"use client";

import { useState } from "react";
import { mapa } from "@/content/atelier";

/**
 * Google Maps loads only after a click. Until then the visitor's browser sends nothing to Google.
 */
export function Mapa() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-sage sm:aspect-[16/10]">
      {loaded ? (
        <iframe
          src={mapa.embed}
          title="Mapa: Keramika He-lienka, Na vrátkach 1K, Bratislava"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 size-full border-0"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-[radial-gradient(rgb(47_111_122/0.22)_1px,transparent_1px)] bg-[size:18px_18px] p-6 text-center">
          <PinIcon />
          <button
            type="button"
            onClick={() => setLoaded(true)}
            className="rounded-full bg-deep px-5 py-3 text-[15px] font-medium tracking-[-0.01em] text-sand transition-colors duration-300 hover:bg-ink"
          >
            Zobraziť mapu
          </button>
          <p className="max-w-[18rem] text-[13px] leading-relaxed text-ink/75">Mapa sa načíta zo služby Google Maps.</p>
        </div>
      )}
    </div>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 32 40" aria-hidden className="h-10 w-8 text-deep">
      <path d="M16 39s13-12.5 13-23A13 13 0 0 0 3 16c0 10.5 13 23 13 23Z" fill="currentColor" />
      <circle cx="16" cy="16" r="5" className="fill-sand" />
    </svg>
  );
}
