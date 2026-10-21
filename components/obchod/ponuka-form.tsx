"use client";

import { useId, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/components/locale-provider";
import { formatPrice, type Localized } from "@/lib/i18n";
import { potvrditPonuku } from "@/lib/objednavka-akcia";
import { Checkbox } from "@/components/ui/form-fields";
import { LocaleLink } from "@/components/ui/locale-link";

const texty = {
  suhlas: { sk: "Súhlasím s ", en: "I agree to the " },
  podmienky: { sk: "obchodnými podmienkami", en: "terms and conditions" },
  // Button wording for an order that creates an obligation to pay (zákon č. 108/2024 Z. z.)
  objednat: { sk: "Objednať s povinnosťou platby", en: "Order with obligation to pay" },
  odosiela: { sk: "Potvrdzujem…", en: "Confirming…" },
  chybaPonuka: {
    sk: "Ponuka už neplatí. Napíšte nám a pripravíme novú.",
    en: "The offer is no longer valid. Write to us and we will prepare a new one.",
  },
  chybaServer: {
    sk: "Potvrdenie sa nepodarilo. Skúste to o chvíľu znova, alebo nám napíšte.",
    en: "The confirmation failed. Please try again in a moment or write to us.",
  },
} satisfies Record<string, Localized>;

/**
 * Confirms a delivery offer (app/[lang]/objednavka/[token]). After a successful confirmation the
 * page reloads from the server and shows the confirmed state.
 */
export function PonukaForm({ token, spolu }: { token: string; spolu: number }) {
  const lang = useLang();
  const router = useRouter();
  const id = useId();
  const [odosiela, setOdosiela] = useState(false);
  const [chyba, setChyba] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const suhlas = new FormData(event.currentTarget).get("suhlas") !== null;
    setOdosiela(true);
    setChyba(null);

    let vysledok: Awaited<ReturnType<typeof potvrditPonuku>>;
    try {
      vysledok = await potvrditPonuku(token, lang, suhlas);
    } catch {
      vysledok = { ok: false, chyba: "server" };
    }

    if (vysledok.ok) {
      router.refresh();
      return;
    }
    setChyba((vysledok.chyba === "ponuka" ? texty.chybaPonuka : texty.chybaServer)[lang]);
    setOdosiela(false);
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <Checkbox id={`${id}-suhlas`} name="suhlas" required>
        {texty.suhlas[lang]}
        <LocaleLink href="/obchodne-podmienky" className="underline decoration-current/50 underline-offset-4 hover:decoration-current">
          {texty.podmienky[lang]}
        </LocaleLink>
      </Checkbox>

      {chyba && (
        <p role="alert" className="rounded-card bg-note p-4 text-[14px] leading-relaxed text-ink">
          {chyba}
        </p>
      )}

      <button
        type="submit"
        disabled={odosiela}
        className="w-full rounded-full bg-deep px-6 py-3.5 text-[15px] font-medium tracking-[-0.01em] text-sand transition-colors duration-300 hover:bg-ink disabled:opacity-60 sm:w-auto"
      >
        {odosiela ? texty.odosiela[lang] : `${texty.objednat[lang]} · ${formatPrice(spolu, lang)}`}
      </button>
    </form>
  );
}
