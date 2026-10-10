"use client";

import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
import { languageNames, localizeHref, locales } from "@/lib/i18n";
import { useLang } from "@/components/locale-provider";

/**
 * SK / EN links to the same page in the other language. The path comes from the route segments
 * below app/[lang], not from usePathname: proxy.ts rewrites Slovak URLs, so the pathname
 * differs between server and browser and would break hydration.
 */
export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const lang = useLang();
  const segments = useSelectedLayoutSegments().filter((s) => !s.startsWith("(") && !s.startsWith("_"));
  const path = `/${segments.join("/")}`;

  return (
    <ul aria-label={lang === "sk" ? "Jazyk" : "Language"} className={`flex items-center text-[13px] font-medium ${className}`}>
      {locales.map((l, i) => (
        <li key={l} className="flex items-center">
          {i > 0 && (
            <span aria-hidden className="px-1.5 opacity-40">
              /
            </span>
          )}
          <Link
            href={localizeHref(path, l)}
            hrefLang={l}
            lang={l}
            aria-label={languageNames[l]}
            aria-current={l === lang ? "true" : undefined}
            className="rounded-sm px-0.5 py-1 opacity-60 transition-opacity hover:opacity-100 aria-[current=true]:underline aria-[current=true]:underline-offset-4 aria-[current=true]:opacity-100"
          >
            {l.toUpperCase()}
          </Link>
        </li>
      ))}
    </ul>
  );
}
