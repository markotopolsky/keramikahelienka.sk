import type { ReactNode } from "react";
import { bindShortWords } from "@/lib/i18n";
import { Doplnit } from "@/components/ui/doplnit";
import { LocaleLink } from "@/components/ui/locale-link";

/**
 * Long texts edited in /admin (RICH_TEXT_KEYS in lib/content-defaults.ts) can carry a little
 * inline markup:
 *
 *   **tučné**            → zvýraznený text
 *   [popis](/adresa)     → odkaz (interný, mailto:, tel: aj externý)
 *   [[údaj]]             → viditeľné „doplniť“ (chýbajúci údaj)
 *   - položka            → odrážka
 *   ## nadpis            → medzinadpis
 *   prázdny riadok       → nový odsek
 */

const linkClass = "text-deep underline decoration-sage underline-offset-4 transition-colors hover:decoration-deep";

const INLINE = /\*\*([^*]+)\*\*|\[\[(.+?)\]\]|\[([^\]]+)\]\(([^)\s]+)\)/g;

function inline(text: string, prefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;

  INLINE.lastIndex = 0;
  for (let m = INLINE.exec(text); m !== null; m = INLINE.exec(text)) {
    if (m.index > last) nodes.push(bindShortWords(text.slice(last, m.index)));
    const key = `${prefix}-${m.index}`;

    if (m[1] !== undefined) {
      nodes.push(
        <strong key={key} className="font-semibold">
          {m[1]}
        </strong>,
      );
    } else if (m[2] !== undefined) {
      nodes.push(<Doplnit key={key}>{m[2]}</Doplnit>);
    } else {
      const [, , , label, href] = m;
      nodes.push(
        href.startsWith("/") ? (
          <LocaleLink key={key} href={href} className={linkClass}>
            {label}
          </LocaleLink>
        ) : (
          <a
            key={key}
            href={href}
            className={linkClass}
            {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {label}
          </a>
        ),
      );
    }

    last = m.index + m[0].length;
  }

  if (last < text.length) nodes.push(bindShortWords(text.slice(last)));
  return nodes;
}

export function RichText({ value, className, id }: { value: string; className?: string; id?: string }) {
  const blocks = value
    .split(/\n(?:[ \t]*\n)+/)
    .map((block) => block.trim())
    .filter(Boolean);

  if (blocks.length === 0) return null;

  return (
    <div id={id} className={className}>
      {blocks.map((block, i) => {
        const lines = block
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);

        if (lines.length === 1 && lines[0].startsWith("## ")) {
          return (
            <h3 key={i} className="pt-2 text-[22px] leading-tight tracking-[-0.02em] text-deep">
              {inline(lines[0].slice(3), String(i))}
            </h3>
          );
        }

        if (lines.every((line) => line.startsWith("- "))) {
          return (
            <ul key={i} className="list-disc space-y-2 pl-5 marker:text-sea">
              {lines.map((line, j) => (
                <li key={j}>{inline(line.slice(2), `${i}-${j}`)}</li>
              ))}
            </ul>
          );
        }

        return <p key={i}>{inline(lines.join(" "), String(i))}</p>;
      })}
    </div>
  );
}
