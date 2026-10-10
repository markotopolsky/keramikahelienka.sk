// Aqua dot with an ink tick, for short lists of facts
export function CheckIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden className={`shrink-0 ${className}`}>
      <circle cx="10" cy="10" r="10" className="fill-aqua" />
      <path d="m6 10.2 2.6 2.6L14 7.4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-ink" />
    </svg>
  );
}
