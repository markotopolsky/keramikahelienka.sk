"use client";

// /admin → Objednávky. Orders are written only by the checkout on the server (supabase/schema.sql);
// the admin reads them and changes just the state and the internal note. Every state change is
// recorded by the database in objednavky_stavy.
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { input, outlineButton, primaryButton } from "./styly";
import { triggerRevalidate } from "./revalidate";

type Stav =
  | "caka_na_cenu_dopravy"
  | "ponuka_odoslana"
  | "caka_na_platbu"
  | "zaplatena"
  | "vybavena"
  | "zrusena"
  | "odstupena";

const STAVY: Record<Stav, { nazov: string; farba: string }> = {
  caka_na_cenu_dopravy: { nazov: "Čaká na cenu dopravy", farba: "bg-note text-ink" },
  ponuka_odoslana: { nazov: "Ponuka odoslaná zákazníkovi", farba: "bg-note text-ink" },
  caka_na_platbu: { nazov: "Čaká na platbu", farba: "bg-note text-ink" },
  zaplatena: { nazov: "Zaplatená", farba: "bg-mint text-deep" },
  vybavena: { nazov: "Vybavená (odoslaná / odovzdaná)", farba: "bg-deep text-sand" },
  zrusena: { nazov: "Zrušená", farba: "bg-sage/60 text-ink" },
  odstupena: { nazov: "Odstúpená zákazníkom", farba: "bg-sage/60 text-ink" },
};

const DOPRAVA: Record<string, string> = {
  "osobny-odber": "Osobný odber v ateliéri",
  dorucenie: "Doručenie (na cenovú ponuku)",
};

/**
 * Views of the list; the default shows every order. "Na vybavenie" leaves out unpaid orders, which
 * cancel themselves when their reservation runs out, but keeps delivery requests, which need
 * Helena's price before any payment.
 */
const POHLADY = {
  vsetky: { nazov: "Všetky", stavy: null },
  na_vybavenie: { nazov: "Na vybavenie", stavy: ["zaplatena", "caka_na_cenu_dopravy"] },
  dorucenie: { nazov: "Žiadosti o doručenie", stavy: ["caka_na_cenu_dopravy", "ponuka_odoslana"] },
  vybavene: { nazov: "Vybavené a odstúpené", stavy: ["vybavena", "odstupena"] },
  nezaplatene: { nazov: "Nezaplatené a zrušené", stavy: ["caka_na_platbu", "zrusena"] },
} satisfies Record<string, { nazov: string; stavy: Stav[] | null }>;

type Pohlad = keyof typeof POHLADY;

/** States the admin may pick by hand; the offer states are set by "Poslať ponuku" and the customer */
const RUCNE_STAVY: Stav[] = ["caka_na_platbu", "zaplatena", "vybavena", "zrusena", "odstupena"];

type Polozka = {
  id: number;
  kod: string;
  nazov: string;
  variant: string | null;
  cena_za_kus: number;
  pocet: number;
};

type ZmenaStavu = {
  id: number;
  stav: Stav;
  zmenil: string | null;
  at: string;
};

type Objednavka = {
  id: string;
  cislo: string;
  stav: Stav;
  jazyk: "sk" | "en";
  meno: string;
  email: string;
  telefon: string;
  doprava: string;
  doprava_cena: number;
  doprava_sposob: string;
  ulica: string | null;
  mesto: string | null;
  psc: string | null;
  krajina: string | null;
  ponuka_token: string | null;
  medzisucet: number;
  spolu: number;
  vop_verzia: string;
  interna_poznamka: string;
  created_at: string;
  rezervovane_do: string | null;
  podmienky_verzie: { vytvorena: string } | null;
  objednavky_polozky: Polozka[];
  objednavky_stavy: ZmenaStavu[];
};

const SELECT = "*, objednavky_polozky(*), objednavky_stavy(*), podmienky_verzie(vytvorena)";

const eur = (suma: number) =>
  `${Number(suma).toLocaleString("sk-SK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;

const datum = (iso: string) =>
  new Date(iso).toLocaleString("sk-SK", { timeZone: "Europe/Bratislava", dateStyle: "medium", timeStyle: "short" });

function StavStitok({ stav }: { stav: Stav }) {
  return <span className={`rounded-full px-2 py-0.5 text-xs ${STAVY[stav].farba}`}>{STAVY[stav].nazov}</span>;
}

function vPohlade(stav: Stav, pohlad: Pohlad) {
  const stavy: readonly Stav[] | null = POHLADY[pohlad].stavy;
  return stavy === null || stavy.includes(stav);
}

export function ObjednavkyPanel() {
  const [objednavky, setObjednavky] = useState<Objednavka[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [pohlad, setPohlad] = useState<Pohlad>("vsetky");
  const [selected, setSelected] = useState<string | null>(null);

  const fetchObjednavky = () =>
    supabase!.from("objednavky").select(SELECT).order("created_at", { ascending: false }).limit(500);

  function apply({ data, error }: Awaited<ReturnType<typeof fetchObjednavky>>) {
    if (error) setError(error.message);
    else setObjednavky((data ?? []) as Objednavka[]);
    setLoading(false);
  }

  async function load() {
    setError(null);
    apply(await fetchObjednavky());
  }

  useEffect(() => {
    fetchObjednavky().then(apply);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once on mount, like ProduktyPanel
  }, []);

  if (loading) return <p className="text-drift">Načítavam objednávky…</p>;

  const q = query.trim().toLowerCase();
  const filtered = objednavky.filter(
    (o) =>
      (q !== "" || vPohlade(o.stav, pohlad)) &&
      (!q ||
        o.cislo.includes(q) ||
        o.meno.toLowerCase().includes(q) ||
        o.email.toLowerCase().includes(q) ||
        o.objednavky_polozky.some((p) => p.kod.toLowerCase().includes(q))),
  );
  const otvorena = objednavky.find((o) => o.id === selected) ?? null;
  const pocet = (p: Pohlad) => objednavky.filter((o) => vPohlade(o.stav, p)).length;

  return (
    <>
      {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      {objednavky.length === 0 ? (
        <div className="rounded-card bg-note p-5 text-[15px]">
          Zatiaľ žiadne objednávky. Pokladňa ich sem začne ukladať po zapojení servera (ZAZNAMNIK.md, e-shop krok 3).
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-[22rem_1fr]">
          <div className="md:sticky md:top-6 md:max-h-[calc(100svh-3rem)] md:self-start md:overflow-y-auto">
            <p className="mb-3 text-sm text-drift">
              {objednavky.length} objednávok, {pocet("na_vybavenie")} na vybavenie
            </p>
            <div className="mb-3 flex flex-col gap-2">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Hľadať vo všetkých: číslo, meno, e-mail, kód…"
                className={`${input} py-1.5`}
              />
              <div className="flex gap-2">
                <select value={pohlad} onChange={(e) => setPohlad(e.target.value as Pohlad)} className={`${input} py-1.5`}>
                  {(Object.keys(POHLADY) as Pohlad[]).map((p) => (
                    <option key={p} value={p}>
                      {POHLADY[p].nazov} ({pocet(p)})
                    </option>
                  ))}
                </select>
                <button onClick={load} className={`shrink-0 ${outlineButton}`}>
                  Obnoviť
                </button>
              </div>
            </div>
            <ul className="flex flex-col gap-1">
              {filtered.map((o) => (
                <li key={o.id}>
                  <button
                    onClick={() => setSelected(o.id)}
                    className={`flex w-full flex-col gap-1 rounded-lg p-2 text-left text-sm transition-colors ${
                      selected === o.id ? "bg-deep text-sand" : "hover:bg-mint"
                    }`}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="font-medium">{o.cislo}</span>
                      <span>{eur(o.spolu)}</span>
                    </span>
                    <span className="flex items-center justify-between gap-2 text-xs">
                      <span className="truncate opacity-75">
                        {o.meno} · {datum(o.created_at)}
                      </span>
                      <StavStitok stav={o.stav} />
                    </span>
                  </button>
                </li>
              ))}
              {filtered.length === 0 && (
                <li className="p-2 text-sm text-drift">
                  {q ? "Nič sa nenašlo." : pohlad === "na_vybavenie" ? "Nič nečaká na vybavenie." : "V tomto zozname nič nie je."}
                </li>
              )}
            </ul>
          </div>

          <div>
            {otvorena ? (
              <ObjednavkaDetail
                key={otvorena.id}
                objednavka={otvorena}
                onSaved={(nova) => setObjednavky((prev) => prev.map((o) => (o.id === nova.id ? nova : o)))}
              />
            ) : (
              <p className="text-drift">Vyberte objednávku vľavo.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function ObjednavkaDetail({ objednavka: o, onSaved }: { objednavka: Objednavka; onSaved: (o: Objednavka) => void }) {
  const [stav, setStav] = useState<Stav>(o.stav);
  const [poznamka, setPoznamka] = useState(o.interna_poznamka);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [podmienky, setPodmienky] = useState<string | null>(null);

  const [cenaDopravy, setCenaDopravy] = useState(o.doprava_cena > 0 ? String(o.doprava_cena) : "");
  const [sposob, setSposob] = useState(o.doprava_sposob);
  const [posiela, setPosiela] = useState(false);
  const [skopirovane, setSkopirovane] = useState(false);

  const zmenene = stav !== o.stav || poznamka !== o.interna_poznamka;
  const ponukaMozna = o.doprava === "dorucenie" && (o.stav === "caka_na_cenu_dopravy" || o.stav === "ponuka_odoslana");
  const odkaz = o.ponuka_token
    ? `${window.location.origin}${o.jazyk === "en" ? "/en" : ""}/objednavka/${o.ponuka_token}`
    : null;
  const moznosti = RUCNE_STAVY.includes(o.stav) ? RUCNE_STAVY : [o.stav, ...RUCNE_STAVY.filter((s) => s === "zrusena")];

  async function handlePonuka() {
    const cena = Number(cenaDopravy.replace(",", "."));
    if (!(cena >= 0) || cenaDopravy.trim() === "" || sposob.trim().length < 2) {
      setError("Zadajte cenu dopravy (napr. 6,90) a spôsob doručenia, ktorý uvidí zákazník.");
      return;
    }
    setPosiela(true);
    setError(null);
    const { error } = await supabase!.rpc("posli_ponuku", { p_id: o.id, p_cena: cena, p_sposob: sposob.trim() });
    if (error) {
      setPosiela(false);
      setError(`Ponuku sa nepodarilo uložiť: ${error.message}`);
      return;
    }
    const { data, error: chybaNacitania } = await supabase!.from("objednavky").select(SELECT).eq("id", o.id).single();
    setPosiela(false);
    if (chybaNacitania) {
      setError(chybaNacitania.message);
      return;
    }
    onSaved(data as Objednavka);
  }

  async function kopirovat() {
    if (!odkaz) return;
    await navigator.clipboard.writeText(odkaz);
    setSkopirovane(true);
  }
  const zrusena = o.stav === "zrusena";

  /** The terms text is long, so it loads only when opened */
  async function nacitajPodmienky() {
    if (podmienky !== null) return;
    const { data, error } = await supabase!.from("podmienky_verzie").select("text").eq("hash", o.vop_verzia).single();
    setPodmienky(error ? `Text sa nepodarilo načítať: ${error.message}` : (data.text as string));
  }

  async function handleSave() {
    setBusy(true);
    setError(null);
    const { data, error } = await supabase!
      .from("objednavky")
      .update({ stav, interna_poznamka: poznamka })
      .eq("id", o.id)
      .select(SELECT)
      .single();
    setBusy(false);
    if (error) {
      setError(`Uloženie zlyhalo: ${error.message}`);
      return;
    }
    onSaved(data as Objednavka);
    setSaved(true);
    // A cancelled order returned its pieces, so the shop must show them for sale again
    if (stav !== o.stav) await triggerRevalidate();
  }

  const historia = [...o.objednavky_stavy].sort((a, b) => a.at.localeCompare(b.at) || a.id - b.id);

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-display text-2xl text-deep">Objednávka {o.cislo}</h2>
        <span className="text-sm text-drift">
          {datum(o.created_at)} · {o.jazyk === "en" ? "anglický web" : "slovenský web"}
        </span>
      </header>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-card bg-white p-4 text-[15px]">
          <h3 className="mb-2 text-sm font-medium text-drift">Zákazník</h3>
          <p>{o.meno}</p>
          <p>
            <a href={`mailto:${o.email}`} className="text-deep underline underline-offset-4">
              {o.email}
            </a>
          </p>
          <p>
            <a href={`tel:${o.telefon.replace(/\s/g, "")}`} className="text-deep underline underline-offset-4">
              {o.telefon}
            </a>
          </p>
        </div>
        <div className="rounded-card bg-white p-4 text-[15px]">
          <h3 className="mb-2 text-sm font-medium text-drift">Doprava a podmienky</h3>
          <p>{DOPRAVA[o.doprava] ?? o.doprava}</p>
          {o.doprava === "dorucenie" && (
            <p className="mt-1 text-sm">
              {o.ulica}, {o.psc} {o.mesto}, {o.krajina}
              {o.doprava_sposob && (
                <>
                  <br />
                  {o.doprava_sposob} · {eur(o.doprava_cena)}
                </>
              )}
            </p>
          )}
          {["caka_na_cenu_dopravy", "ponuka_odoslana", "caka_na_platbu"].includes(o.stav) && o.rezervovane_do && (
            <p className="mt-2 text-sm">
              Kusy rezervované do {datum(o.rezervovane_do)}.{" "}
              {o.stav === "caka_na_cenu_dopravy"
                ? "Dovtedy pošlite ponuku dopravy, inak sa žiadosť sama zruší."
                : o.stav === "ponuka_odoslana"
                  ? "Ak ju zákazník dovtedy nepotvrdí, objednávka sa sama zruší."
                  : "Potom sa objednávka bez platby sama zruší."}
            </p>
          )}
          <details className="mt-2 text-sm" onToggle={(e) => e.currentTarget.open && nacitajPodmienky()}>
            <summary className="cursor-pointer text-drift">
              Súhlasil s obchodnými podmienkami a reklamačným poriadkom
              {o.podmienky_verzie && ` (znenie z ${datum(o.podmienky_verzie.vytvorena)})`}
            </summary>
            <pre className="mt-2 max-h-96 overflow-y-auto font-sans text-xs leading-5 whitespace-pre-wrap">
              {podmienky ?? "Načítavam…"}
            </pre>
          </details>
        </div>
      </div>

      <div className="overflow-x-auto rounded-card bg-white p-4">
        <table className="w-full text-left text-[15px]">
          <thead className="text-sm text-drift">
            <tr>
              <th className="pb-2 font-medium">Kód</th>
              <th className="pb-2 font-medium">Produkt</th>
              <th className="pb-2 text-right font-medium">Ks</th>
              <th className="pb-2 text-right font-medium">Cena za kus</th>
              <th className="pb-2 text-right font-medium">Spolu</th>
            </tr>
          </thead>
          <tbody>
            {o.objednavky_polozky.map((p) => (
              <tr key={p.id} className="border-t border-sage/60">
                <td className="py-2 pr-3 text-sm whitespace-nowrap text-drift">{p.kod}</td>
                <td className="py-2 pr-3">
                  {p.nazov}
                  {p.variant && <span className="text-drift"> · {p.variant}</span>}
                </td>
                <td className="py-2 text-right">{p.pocet}</td>
                <td className="py-2 text-right whitespace-nowrap">{eur(p.cena_za_kus)}</td>
                <td className="py-2 text-right whitespace-nowrap">{eur(p.cena_za_kus * p.pocet)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-sage/60">
              <td colSpan={4} className="pt-2 text-right text-drift">
                Medzisúčet
              </td>
              <td className="pt-2 text-right whitespace-nowrap">{eur(o.medzisucet)}</td>
            </tr>
            <tr>
              <td colSpan={4} className="text-right text-drift">
                Doprava
              </td>
              <td className="text-right whitespace-nowrap">{eur(o.doprava_cena)}</td>
            </tr>
            <tr>
              <td colSpan={4} className="pt-1 text-right font-medium">
                Spolu
              </td>
              <td className="pt-1 text-right font-medium whitespace-nowrap">{eur(o.spolu)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {ponukaMozna && (
        <div className="flex flex-col gap-3 rounded-card bg-note p-4">
          <h3 className="text-sm font-medium">
            {o.stav === "caka_na_cenu_dopravy" ? "Ponuka dopravy pre zákazníka" : "Ponuka je odoslaná – môžete ju zmeniť"}
          </h3>
          <div className="grid gap-3 sm:grid-cols-[9rem_1fr]">
            <label className="flex flex-col gap-1 text-sm">
              Cena dopravy (€)
              <input inputMode="decimal" value={cenaDopravy} onChange={(e) => setCenaDopravy(e.target.value)} className={input} />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Spôsob doručenia (vidí zákazník)
              <input
                value={sposob}
                onChange={(e) => setSposob(e.target.value)}
                placeholder="napr. Packeta na adresu, kuriér SPS"
                className={input}
              />
            </label>
          </div>
          <p className="text-xs text-drift">
            Spolu so zákazníkovi ukáže {eur(o.medzisucet + (Number(cenaDopravy.replace(",", ".")) || 0))}. Ponuka platí 3 dni.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={handlePonuka} disabled={posiela} className={primaryButton}>
              {posiela ? "Ukladám…" : o.ponuka_token ? "Zmeniť ponuku" : "Poslať ponuku"}
            </button>
          </div>
          {odkaz && (
            <div className="flex flex-col gap-1 text-sm">
              <span>
                E-maily ešte neodchádzajú (ZAZNAMNIK.md, e-shop krok 4). Pošlite zákazníkovi tento odkaz sami:
              </span>
              <div className="flex gap-2">
                <input readOnly value={odkaz} className={`${input} py-1.5 text-xs`} onFocus={(e) => e.target.select()} />
                <button onClick={kopirovat} className={`shrink-0 ${outlineButton}`}>
                  {skopirovane ? "✓ Skopírované" : "Kopírovať"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm font-medium">
          Stav
          <select
            value={stav}
            disabled={zrusena}
            onChange={(e) => {
              setStav(e.target.value as Stav);
              setSaved(false);
            }}
            className={`${input} disabled:bg-mint`}
          >
            {moznosti.map((s) => (
              <option key={s} value={s}>
                {STAVY[s].nazov}
              </option>
            ))}
          </select>
          <span className="text-xs font-normal text-drift">
            {zrusena
              ? "Zrušená objednávka už vrátila kusy na sklad, stav sa nedá zmeniť."
              : "„Zrušená“ vráti kusy na sklad a je konečná."}
          </span>
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Interná poznámka
          <textarea
            value={poznamka}
            rows={3}
            onChange={(e) => {
              setPoznamka(e.target.value);
              setSaved(false);
            }}
            placeholder="Vidí ju iba admin, zákazník nie."
            className={`${input} font-normal`}
          />
        </label>
      </div>

      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <div className="flex items-center gap-3">
        <button onClick={handleSave} disabled={busy || !zmenene} className={`ml-auto ${primaryButton}`}>
          {busy ? "Ukladám…" : "Uložiť"}
        </button>
        {saved && <span className="text-sm text-deep">✓ Uložené</span>}
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium text-drift">História stavov</h3>
        <ol className="flex flex-col gap-1 text-sm">
          {historia.map((z) => (
            <li key={z.id} className="flex flex-wrap items-center gap-2">
              <span className="text-drift">{datum(z.at)}</span>
              <StavStitok stav={z.stav} />
              <span className="text-drift">{z.zmenil ? "zmenil admin" : "systém (pokladňa alebo vypršaná rezervácia)"}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
