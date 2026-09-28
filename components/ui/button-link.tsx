import Link from "next/link";
import type { ReactNode } from "react";

const variants = {
  // Aqua with ink text: 6.8:1 contrast
  primary: "bg-aqua text-ink hover:bg-sand",
  // For sand/mint backgrounds
  deep: "bg-deep text-sand hover:bg-ink",
  // For deep-teal backgrounds
  light: "bg-sand text-deep hover:bg-aqua hover:text-ink",
  outline: "border border-current text-current hover:bg-sand hover:text-deep hover:border-sand",
};

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: keyof typeof variants;
  className?: string;
};

export function ButtonLink({ href, children, variant = "primary", className = "" }: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2 rounded-full px-5 py-3 text-[15px] font-medium tracking-[-0.01em] transition-colors duration-300 ${variants[variant]} ${className}`}
    >
      {children}
      <ArrowIcon className="size-3.5 transition-transform duration-300 ease-soft group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </Link>
  );
}

export function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 14 14" fill="none" aria-hidden className={className}>
      <path d="M3 11 11 3M4.5 3H11v6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
