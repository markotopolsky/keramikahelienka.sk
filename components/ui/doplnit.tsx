/**
 * Visible gap for data we do not have yet, e.g. <Doplnit>IČO</Doplnit> → "[doplniť: IČO]".
 * It stays in Slovak on English pages too: it is a note for Helena and the developer,
 * and every one must be replaced before launch.
 */
export function Doplnit({ children }: { children: string }) {
  return (
    <mark className="rounded-sm border border-dashed border-drift/60 bg-note px-1 font-sans text-[0.9em] font-normal text-ink not-italic">
      [doplniť: {children}]
    </mark>
  );
}
