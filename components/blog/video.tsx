"use client";

import { useState } from "react";
import type { Localized } from "@/lib/i18n";
import { useLang } from "@/components/locale-provider";

const texty = {
  prehrat: { sk: "Prehrať video", en: "Play video" },
  youtube: { sk: "Video sa načíta zo služby YouTube.", en: "The video loads from YouTube." },
} satisfies Record<string, Localized>;

/**
 * YouTube loads only after a click, like the map on the contact page: until then the visitor's
 * browser sends nothing to Google. After the click it uses the youtube-nocookie.com player.
 */
export function Video({ id, nazov }: { id: string; nazov: string }) {
  const lang = useLang();
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative aspect-video overflow-hidden rounded-card bg-deep">
      {loaded ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
          title={nazov}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 size-full border-0"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-[radial-gradient(rgb(254_248_239/0.14)_1px,transparent_1px)] bg-[size:18px_18px] p-6 text-center text-sand">
          <button
            type="button"
            onClick={() => setLoaded(true)}
            className="inline-flex items-center gap-3 rounded-full bg-aqua px-6 py-3.5 text-[15px] font-medium tracking-[-0.01em] text-ink transition-colors duration-300 hover:bg-sand"
          >
            <svg viewBox="0 0 12 14" aria-hidden className="h-3.5 w-3">
              <path d="M0 0v14l12-7z" fill="currentColor" />
            </svg>
            {texty.prehrat[lang]}
          </button>
          <p className="max-w-[18rem] text-[13px] leading-relaxed text-sand/75">{texty.youtube[lang]}</p>
        </div>
      )}
    </div>
  );
}
