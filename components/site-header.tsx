"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { navigacia } from "@/content/atelier";
import { ButtonLink } from "@/components/ui/button-link";

/** Transparent over the hero, turns solid sand once the hero scrolls away. */
export function SiteHeader() {
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    setSolid(y > window.innerHeight * 0.75);
  });

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        solid ? "bg-sand text-ink shadow-[0_1px_0_rgb(47_111_122/0.12)]" : "text-sand"
      }`}
    >
      <div className="site-container grid h-20 grid-cols-[1fr_auto_1fr] items-center">
        <Link href="/" className="justify-self-start font-serif text-[30px] leading-none tracking-[-0.02em]">
          He-lienka
        </Link>

        <nav aria-label="Hlavná navigácia">
          <ul className="flex items-center gap-9 text-[15px]">
            {navigacia.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="relative py-1 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="justify-self-end">
          <ButtonLink href="/kurzy#rezervacia" variant={solid ? "deep" : "primary"}>
            Rezervovať kurz
          </ButtonLink>
        </div>
      </div>
    </motion.header>
  );
}
