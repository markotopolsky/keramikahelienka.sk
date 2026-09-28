// Line drawing of a hand-built vase with a wave glaze, drawn in currentColor.
export function VaseIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 84" fill="none" aria-hidden className={className}>
      <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 5h20" />
        <path d="M24 5c0 3 1 5 2 7-1 4-9 8-13 18-4 11-2 24 6 34 3 4 7 7 13 8 6-1 10-4 13-8 8-10 10-23 6-34-4-10-12-14-13-18 1-2 2-4 2-7" />
        <path d="M26 12h12" />
        <path d="M24 78h16" />
        <path d="M14 38c4 3 8 3 12 0s8-3 12 0 8 3 12 0" />
        <path d="M13 48c4 3 9 3 13 0s9-3 13 0 9 3 13 0" />
        <path d="M32 55c-3 3-3 7 0 10 3-3 3-7 0-10Z" />
        <path d="M24 60c-2 2-2 5 0 7M40 60c2 2 2 5 0 7" />
      </g>
    </svg>
  );
}
