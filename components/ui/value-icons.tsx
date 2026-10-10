import type { ReactNode } from "react";

// Line drawings for the three values on the homepage, in the same hand as VaseIcon.
// All are drawn in currentColor on a 64 × 64 grid.

function Icon({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden className={className}>
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </g>
    </svg>
  );
}

/** Lump of clay with strata and grog specks, resting on the table */
export function ClayIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M11 49c-2-6-1-13 3-19 4-7 10-12 17-13 6-1 10 3 14 2 5-1 9 3 10 9 2 8 1 15-2 21" />
      <path d="M8 49h48" />
      <path d="M14 36c5 1.5 9 1 13-1s9-2 14 0 9 2 13 .5" />
      <g fill="currentColor" strokeWidth="1">
        <circle cx="22" cy="43" r=".6" />
        <circle cx="36" cy="42" r=".6" />
        <circle cx="45" cy="44.5" r=".6" />
        <circle cx="30" cy="29" r=".6" />
      </g>
    </Icon>
  );
}

/** Fingerprint, the mark a hand leaves in clay */
export function FingerprintIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M28.5 41v-9a3.5 3.5 0 0 1 7 0v12" />
      <path d="M22.5 46V32a9.5 9.5 0 0 1 19 0v3M41.5 41v6" />
      <path d="M16.5 40v-8a15.5 15.5 0 0 1 25.5-11.9M45.5 24.5A15.4 15.4 0 0 1 47.5 32v10" />
      <path d="M16.5 46v-.5" />
      <path d="M12 25a21.5 21.5 0 0 1 40 0" />
      <path d="M10.5 33.5c0 6 0 9 .5 11M53.5 33.5v9" />
    </Icon>
  );
}

/** Hand-built bowl with an uneven rim and a wave glaze */
export function BowlIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M7 25c3 0 5 3 9 2s6-5 10-4 5 4 9 3 6-4 10-3 5 3 7 2 4-1 5-1" />
      <path d="M7.5 26c1.5 14 11 25 24.5 25s23-10 24.5-25" />
      <path d="M14 37c4 2.5 8 2.5 12 0s8-2.5 12 0 8 2.5 12 0" />
      <path d="M24 50.5c1 2 3.5 3.5 8 3.5s7-1.5 8-3.5" />
    </Icon>
  );
}
