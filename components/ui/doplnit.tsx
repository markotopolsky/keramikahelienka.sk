/**
 * Visible gap for data we do not have yet. Shows only "doplniť"; what is missing
 * stays in the source and in the data-doplnit attribute, e.g. <Doplnit>IČO</Doplnit>.
 * It stays in Slovak on English pages too, and every one must be replaced before launch.
 */
export function Doplnit({ children }: { children: string }) {
  return (
    <mark
      data-doplnit={children}
      className="rounded-sm border border-dashed border-drift/60 bg-note px-1 font-sans text-[0.9em] font-normal text-ink not-italic"
    >
      doplniť
    </mark>
  );
}
