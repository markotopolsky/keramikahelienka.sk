"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { localizeHref } from "@/lib/i18n";
import { useLang } from "@/components/locale-provider";

type LocaleLinkProps = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

/** next/link that keeps the visitor in their language: href="/kurzy" becomes /en/kurzy on English pages. */
export function LocaleLink({ href, ...props }: LocaleLinkProps) {
  const lang = useLang();
  return <Link href={localizeHref(href, lang)} {...props} />;
}
