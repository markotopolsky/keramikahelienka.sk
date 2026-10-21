"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase, supabaseChyba } from "@/lib/supabase";
import {
  DEFAULTS,
  SECTIONS,
  SECTION_GROUPS,
  baseKey,
  cloudinaryFolder,
  isEnglishKey,
  isFileKey,
  isImageKey,
  isRichTextKey,
  isSwitchKey,
  isSwitchOn,
  isTranslatedKey,
} from "@/lib/content-defaults";
import { uploadFile, uploadImage } from "@/lib/cloudinary";
import { KATEGORIE, naRiadok, predvoleneProdukty, type ProduktRow } from "@/lib/produkty-zaklad";
import { kategorie as nazvyKategorii } from "@/content/produkty";
import { input, outlineButton, primaryButton } from "./styly";
import { triggerRevalidate } from "./revalidate";
import { ObjednavkyPanel } from "./objednavky-panel";

type ContentRow = {
  key: string;
  value: string;
  section: string;
};

export default function AdminPage() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!supabase) {
    return (
      <main className="mx-auto max-w-lg px-6 py-16">
        <h1 className="font-display text-3xl text-deep">Administrácia</h1>
        <p className="mt-4 rounded-card bg-note p-4 text-[15px]">
          Databáza ešte nie je pripojená. {supabaseChyba} Postup je v README, časť „Editovateľný obsah“.
        </p>
      </main>
    );
  }

  if (session === undefined) {
    return <main className="mx-auto max-w-md px-6 py-16 text-center text-drift">Načítavam…</main>;
  }

  return session ? <AdminGate key={session.user.id} /> : <LoginForm />;
}

/**
 * Signed in is not enough: only users in public.admini may edit (supabase/schema.sql).
 * Without this check a non-admin would see the editor and get an error on every save.
 */
function AdminGate() {
  const [jeAdmin, setJeAdmin] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase!.rpc("je_admin").then(({ data, error }) => {
      if (error) setError(error.message);
      setJeAdmin(data === true);
    });
  }, []);

  if (jeAdmin === null) {
    return <main className="mx-auto max-w-md px-6 py-16 text-center text-drift">Načítavam…</main>;
  }
  if (jeAdmin) return <Dashboard />;

  return (
    <main className="mx-auto max-w-lg px-6 py-16">
      <h1 className="font-display text-3xl text-deep">Administrácia</h1>
      <p className="mt-4 rounded-card bg-note p-4 text-[15px]">
        {error
          ? `Prístup sa nepodarilo overiť: ${error}`
          : "Tento účet nemá prístup do administrácie. Pridať ho môže vývojár v tabuľke admini (README, „Prvé nastavenie“)."}
      </p>
      <button onClick={() => supabase!.auth.signOut()} className={`mt-6 ${outlineButton}`}>
        Odhlásiť sa
      </button>
    </main>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await supabase!.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setBusy(false);
  }

  return (
    <main className="mx-auto max-w-sm px-6 py-16">
      <h1 className="mb-6 font-display text-3xl text-deep">Prihlásenie</h1>

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          E-mail
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={input} />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Heslo
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={input}
          />
        </label>

        {error && <p className="text-sm text-red-700">{error}</p>}

        <button type="submit" disabled={busy} className={`${primaryButton} py-2.5`}>
          {busy ? "Prihlasujem…" : "Prihlásiť sa"}
        </button>
      </form>
    </main>
  );
}

function Dashboard() {
  const [tab, setTab] = useState<"texty" | "produkty" | "objednavky">("texty");

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <h1 className="font-display text-3xl text-deep">Administrácia</h1>
          <div role="tablist" className="flex rounded-full border border-sage bg-white p-1">
            {(
              [
                ["texty", "Texty a fotky"],
                ["produkty", "Produkty"],
                ["objednavky", "Objednávky"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                role="tab"
                aria-selected={tab === id}
                onClick={() => setTab(id)}
                className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                  tab === id ? "bg-deep text-sand" : "text-ink hover:bg-mint"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" target="_blank" rel="noreferrer" className="text-sm text-deep underline underline-offset-4">
            Otvoriť web
          </a>
          <button onClick={() => supabase!.auth.signOut()} className={outlineButton}>
            Odhlásiť sa
          </button>
        </div>
      </div>

      {tab === "texty" ? <TextyPanel /> : tab === "produkty" ? <ProduktyPanel /> : <ObjednavkyPanel />}
    </main>
  );
}

// ------------------------------------------------------------------------------------- Texty

function splitLabel(label: string): { title: string; path?: string } {
  const idx = label.indexOf(" · ");
  if (idx === -1) return { title: label };
  return { title: label.slice(0, idx), path: label.slice(idx + 3) };
}

/** Labels for keys whose name alone would read badly in the admin. */
const FIELD_LABEL: Record<string, string> = {
  "info_lista.zobrazit": "Zobraziť info lištu?",
  "info_lista.verzia":
    "Verzia lišty – pri novom ozname ju zmeňte (napr. 2026-11), lišta sa potom znova ukáže aj tým, ktorí ju zavreli",
  "info_lista.odkaz_href": "Kam vedie odkaz (napr. #newsletter alebo /kurzy)",
  "hero.nadpis": "Veľký nadpis (každé slovo na novom riadku)",
  "recenzie.preklad": "Poznámka pod nadpisom (na anglickej stránke „Translated from Slovak“)",
};

/** Readable names of the common field endings */
const FIELD_WORDS: [RegExp, string][] = [
  [/^meta_titulok$/, "Titulok vo vyhľadávaní a v karte prehliadača"],
  [/^meta_popis$/, "Popis vo vyhľadávaní"],
  [/^eyebrow$/, "Malý text nad nadpisom"],
  [/^lead$/, "Úvodný text pod nadpisom"],
  [/^aside$/, "Text vedľa nadpisu"],
  [/^tlacidlo_?(.*)$/, "Tlačidlo $1"],
  [/^(.*)_foto_alt$/, "$1 – popis fotky (pre nevidiacich a Google)"],
  [/^foto_alt$/, "Popis fotky (pre nevidiacich a Google)"],
];

function fieldLabel(key: string): string {
  const custom = FIELD_LABEL[key];
  if (custom) return custom;

  let suffix = key.includes(".") ? key.slice(key.indexOf(".") + 1) : key;
  for (const [pattern, replacement] of FIELD_WORDS) {
    if (pattern.test(suffix)) {
      suffix = suffix.replace(pattern, replacement);
      break;
    }
  }
  const spaced = suffix.replace(/_/g, " ").replace(/(\D)(\d)/g, "$1 $2").trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

/** Rows to show for a text field, so long legal texts are not edited in a slit. */
function textareaRows(value: string): number {
  const lines = value.split("\n").length + Math.floor(value.length / 70);
  return Math.min(Math.max(lines, value.length > 50 ? 3 : 1), 28);
}

function RichTextHint() {
  return (
    <p className="text-xs leading-5 text-drift">
      Nový odsek: prázdny riadok. Tučné: <code>**text**</code>. Odkaz: <code>[popis](/adresa)</code> alebo{" "}
      <code>[popis](mailto:info@keramikahelienka.sk)</code>. Odrážka: riadok začnite „- “. Nadpis: riadok začnite „## “.
      Chýbajúci údaj: <code>[[IČO]]</code>.
    </p>
  );
}

const SECTION_LABEL: Record<string, string> = Object.fromEntries(SECTIONS.map((s) => [s.section, s.label]));

function useResolvedGroups() {
  return useMemo(() => {
    const placed = new Set(SECTION_GROUPS.flatMap((g) => g.sections));
    const orphans = SECTIONS.map((s) => s.section).filter((name) => !placed.has(name));
    const groups = SECTION_GROUPS.map((g) => ({
      group: g.group,
      sections: g.sections.filter((name) => name in DEFAULTS),
    })).filter((g) => g.sections.length > 0);
    if (orphans.length > 0) groups.push({ group: "Ostatné", sections: orphans });
    return groups;
  }, []);
}

function TextyPanel() {
  const groups = useResolvedGroups();

  const [rows, setRows] = useState<ContentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selected, setSelected] = useState<string>(SECTIONS[0]?.section ?? "");
  const [query, setQuery] = useState("");

  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [savedKey, setSavedKey] = useState<string | null>(null);

  useEffect(() => {
    supabase!
      .from("content")
      .select("key, value, section")
      .then(({ data, error }) => {
        if (error) {
          setError(error.message);
          setLoading(false);
          return;
        }
        const fromDb = new Map((data ?? []).map((r) => [r.key, r.value as string]));
        const merged: ContentRow[] = [];
        for (const s of SECTIONS) {
          for (const [key, value] of Object.entries(DEFAULTS[s.section] ?? {})) {
            merged.push({ key, value: fromDb.get(key) ?? value, section: s.section });
          }
        }
        const known = new Set(merged.map((r) => r.key));
        for (const r of data ?? []) {
          if (!known.has(r.key)) merged.push({ key: r.key, value: r.value, section: r.section });
        }
        setRows(merged);
        setLoading(false);
      });
  }, []);

  function handleChange(key: string, value: string) {
    setRows((prev) => prev.map((r) => (r.key === key ? { ...r, value } : r)));
  }

  /** Saves one key, or a Slovak key together with its English twin */
  async function handleSave(toSave: ContentRow[], markerKey: string) {
    setSavingKey(markerKey);
    setSavedKey(null);
    setError(null);

    const updated_at = new Date().toISOString();
    const { error } = await supabase!.from("content").upsert(
      toSave.map((r) => ({ key: r.key, value: r.value, section: r.section, updated_at })),
      { onConflict: "key" },
    );

    setSavingKey(null);

    if (error) {
      setError(`Uloženie „${markerKey}“ zlyhalo: ${error.message}`);
      return;
    }

    await triggerRevalidate();

    setSavedKey(markerKey);
    setTimeout(() => setSavedKey((k) => (k === markerKey ? null : k)), 2500);
  }

  const q = query.trim().toLowerCase();
  const searching = q.length > 0;

  const matches = useMemo(() => {
    if (!searching) return [];
    // A match on either language shows the whole field (both languages)
    const hit = new Set(
      rows
        .filter((r) => r.key.toLowerCase().includes(q) || r.value.toLowerCase().includes(q))
        .map((r) => baseKey(r.key)),
    );
    return rows.filter((r) => hit.has(baseKey(r.key)));
  }, [rows, q, searching]);

  const matchCountBySection = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const r of matches) if (!isEnglishKey(r.key)) counts[r.section] = (counts[r.section] ?? 0) + 1;
    return counts;
  }, [matches]);

  const matchedSections = SECTIONS.map((s) => s.section).filter((name) => (matchCountBySection[name] ?? 0) > 0);

  return (
    <>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Hľadať v textoch… (naprieč celou stránkou)"
        className={`${input} mb-8`}
      />

      {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {loading ? (
        <p className="text-drift">Načítavam texty…</p>
      ) : (
        <div className="grid gap-8 md:grid-cols-[15rem_1fr]">
          <nav className="md:sticky md:top-6 md:max-h-[calc(100svh-3rem)] md:self-start md:overflow-y-auto">
            <div className="flex flex-col gap-6">
              {groups.map((g) => (
                <div key={g.group}>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-drift">{g.group}</p>
                  <ul className="flex flex-col gap-0.5">
                    {g.sections.map((name) => {
                      const { title } = splitLabel(SECTION_LABEL[name] ?? name);
                      const active = !searching && name === selected;
                      const count = matchCountBySection[name] ?? 0;
                      return (
                        <li key={name}>
                          <button
                            onClick={() => {
                              setSelected(name);
                              setQuery("");
                            }}
                            className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${
                              active ? "bg-deep text-sand" : "text-ink hover:bg-mint"
                            }`}
                          >
                            <span className="truncate">{title}</span>
                            {searching && count > 0 && (
                              <span className="shrink-0 rounded-full bg-mint px-2 text-xs font-semibold text-deep">
                                {count}
                              </span>
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </nav>

          <div>
            {searching ? (
              matchedSections.length === 0 ? (
                <p className="text-drift">Pre „{query}“ sa nenašli žiadne texty.</p>
              ) : (
                <div className="flex flex-col gap-12">
                  {matchedSections.map((name) => (
                    <SectionPanel
                      key={name}
                      label={SECTION_LABEL[name] ?? name}
                      rows={matches.filter((r) => r.section === name)}
                      savingKey={savingKey}
                      savedKey={savedKey}
                      onChange={handleChange}
                      onSave={handleSave}
                    />
                  ))}
                </div>
              )
            ) : (
              <SectionPanel
                label={SECTION_LABEL[selected] ?? selected}
                rows={rows.filter((r) => r.section === selected)}
                savingKey={savingKey}
                savedKey={savedKey}
                onChange={handleChange}
                onSave={handleSave}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}

type FieldProps = {
  savingKey: string | null;
  savedKey: string | null;
  onChange: (key: string, value: string) => void;
  onSave: (rows: ContentRow[], markerKey: string) => void;
};

function SectionPanel({ label, rows, ...field }: FieldProps & { label: string; rows: ContentRow[] }) {
  const { title, path } = splitLabel(label);
  const byKey = new Map(rows.map((r) => [r.key, r]));

  return (
    <section>
      <div className="mb-5 border-b border-sage pb-2">
        <h2 className="font-display text-2xl text-deep">{title}</h2>
        {path && <p className="mt-0.5 font-mono text-xs text-drift">{path}</p>}
      </div>

      {rows.length === 0 ? (
        <p className="text-drift">Žiadne texty.</p>
      ) : (
        <div className="flex flex-col gap-7">
          {rows
            // The English twin is edited together with its Slovak key
            .filter((row) => !isEnglishKey(row.key))
            .map((row) => (
              <ContentField key={row.key} row={row} en={byKey.get(`${row.key}_en`)} {...field} />
            ))}
        </div>
      )}
    </section>
  );
}

function SaveButton({ busy, saved, onClick }: { busy: boolean; saved: boolean; onClick: () => void }) {
  return (
    <>
      <button onClick={onClick} disabled={busy} className={`ml-auto ${primaryButton}`}>
        {busy ? "Ukladám…" : "Uložiť"}
      </button>
      {saved && <span className="text-sm text-deep">✓ Uložené</span>}
    </>
  );
}

function ContentField({ row, en, savingKey, savedKey, onChange, onSave }: FieldProps & { row: ContentRow; en?: ContentRow }) {
  const translated = isTranslatedKey(row.key) && en;
  const toSave = translated ? [row, en] : [row];

  return (
    <div className="flex flex-col gap-1.5">
      {isImageKey(row.key) ? (
        <ImageField row={row} onChange={onChange} />
      ) : isFileKey(row.key) ? (
        <FileField row={row} onChange={onChange} />
      ) : isSwitchKey(row.key) ? (
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">{fieldLabel(row.key)}</span>
          <select
            value={isSwitchOn(row.value) ? "ano" : "nie"}
            onChange={(e) => onChange(row.key, e.target.value)}
            className={`${input} max-w-xs`}
          >
            <option value="ano">Áno</option>
            <option value="nie">Nie</option>
          </select>
        </label>
      ) : (
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium">{fieldLabel(row.key)}</span>
          {isRichTextKey(row.key) && <RichTextHint />}
          {translated ? (
            <div className="grid gap-3 lg:grid-cols-2">
              <TextArea label="Slovensky" row={row} onChange={onChange} />
              <TextArea label="English" row={en} onChange={onChange} />
            </div>
          ) : (
            <TextArea row={row} onChange={onChange} />
          )}
        </div>
      )}

      <div className="flex items-center gap-3">
        <span className="font-mono text-[11px] text-drift/70">{row.key}</span>
        <SaveButton busy={savingKey === row.key} saved={savedKey === row.key} onClick={() => onSave(toSave, row.key)} />
      </div>
    </div>
  );
}

function TextArea({ label, row, onChange }: { label?: string; row: ContentRow; onChange: (key: string, value: string) => void }) {
  const area = (
    <textarea
      value={row.value}
      onChange={(e) => onChange(row.key, e.target.value)}
      rows={textareaRows(row.value)}
      className={input}
    />
  );
  if (!label) return area;
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs uppercase tracking-wide text-drift">{label}</span>
      {area}
    </label>
  );
}

/** Preview of a photo: "/images/..." paths are served from public/, uploads from Cloudinary */
function Nahlad({ src, className }: { src: string; className: string }) {
  if (!src) return <span className="text-xs text-drift">Bez fotky</span>;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" className={className} />;
}

function ImageField({ row, label, onChange }: { row: ContentRow; label?: string; onChange: (key: string, value: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    setUploadError(null);
    try {
      onChange(row.key, await uploadImage(file, cloudinaryFolder(row.section)));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Nahrávanie zlyhalo.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">{label ?? fieldLabel(row.key)}</span>

      <div className="flex items-start gap-4">
        <div className="grid size-24 shrink-0 place-items-center overflow-hidden rounded-lg border border-sage bg-mint">
          <Nahlad src={row.value} className="size-full object-cover" />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex items-center gap-3">
            <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
            <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} className={`self-start ${outlineButton}`}>
              {uploading ? "Nahrávam…" : "Nahrať fotku"}
            </button>
            <span className="text-xs text-drift">Po nahratí kliknite na Uložiť.</span>
          </div>

          <input
            type="text"
            value={row.value}
            onChange={(e) => onChange(row.key, e.target.value)}
            placeholder="URL fotky"
            className={`${input} py-1.5 text-xs`}
          />

          {uploadError && <p className="text-xs text-red-700">{uploadError}</p>}
        </div>
      </div>
    </div>
  );
}

function FileField({ row, onChange }: { row: ContentRow; onChange: (key: string, value: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    setUploadError(null);
    try {
      onChange(row.key, await uploadFile(file, cloudinaryFolder(row.section)));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Nahrávanie zlyhalo.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">{fieldLabel(row.key)}</span>

      <div className="flex items-center gap-3">
        <input ref={inputRef} type="file" accept="application/pdf" onChange={handleFile} className="hidden" />
        <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} className={outlineButton}>
          {uploading ? "Nahrávam…" : "Nahrať súbor (PDF)"}
        </button>
        {row.value && (
          <a href={row.value} target="_blank" rel="noreferrer" className="truncate text-sm text-deep underline">
            Zobraziť aktuálny súbor
          </a>
        )}
      </div>

      <input
        type="text"
        value={row.value}
        onChange={(e) => onChange(row.key, e.target.value)}
        placeholder="URL súboru"
        className={`${input} py-1.5 text-xs`}
      />

      {uploadError && <p className="text-xs text-red-700">{uploadError}</p>}
    </div>
  );
}

// ------------------------------------------------------------------------------------- Produkty

const PRODUKTY_FOLDER = cloudinaryFolder("produkty");

function prazdnyProdukt(poradie: number): ProduktRow {
  return {
    slug: "",
    poradie,
    zverejneny: false,
    na_domovskej: false,
    iba_osobny_odber: false,
    nazov_sk: "",
    nazov_en: "",
    popis_sk: "",
    popis_en: "",
    cena: 0,
    varianty: [],
    pocet_kusov: 1,
    vypredane: false,
    kategorie: [],
    fotky: [],
  };
}

/** "Váza Modrá vlna" → "vaza-modra-vlna" */
function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function ProduktyPanel() {
  const [produkty, setProdukty] = useState<ProduktRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  /** Slug of the product open in the editor, or "" for a new one */
  const [selected, setSelected] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);

  const fetchProdukty = () => supabase!.from("produkty").select("*").order("poradie");

  function apply({ data, error }: Awaited<ReturnType<typeof fetchProdukty>>) {
    if (error) setError(error.message);
    else setProdukty((data ?? []) as ProduktRow[]);
    setLoading(false);
  }

  async function load() {
    apply(await fetchProdukty());
  }

  useEffect(() => {
    supabase!.from("produkty").select("*").order("poradie").then(apply);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once on mount, like TextyPanel
  }, []);

  async function handleImport() {
    setImporting(true);
    setError(null);
    const { error } = await supabase!
      .from("produkty")
      .upsert(predvoleneProdukty.map(naRiadok), { onConflict: "slug", ignoreDuplicates: true });
    if (error) setError(`Import zlyhal: ${error.message}`);
    else await triggerRevalidate();
    await load();
    setImporting(false);
  }

  const q = query.trim().toLowerCase();
  const filtered = produkty.filter(
    (p) =>
      !q ||
      p.nazov_sk.toLowerCase().includes(q) ||
      p.nazov_en.toLowerCase().includes(q) ||
      p.slug.includes(q) ||
      Boolean(p.kod?.toLowerCase().includes(q)),
  );
  const editing =
    selected === null
      ? null
      : selected === ""
        ? prazdnyProdukt(Math.max(-1, ...produkty.map((p) => p.poradie)) + 1)
        : produkty.find((p) => p.slug === selected) ?? null;

  if (loading) return <p className="text-drift">Načítavam produkty…</p>;

  return (
    <>
      {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      {produkty.length === 0 && (
        <div className="mb-8 rounded-card bg-note p-5 text-[15px]">
          <p>
            Databáza produktov je prázdna, web zatiaľ ukazuje {predvoleneProdukty.length} produktov z pôvodného webu. Naimportujte
            ich sem a potom ich upravujte.
          </p>
          <button onClick={handleImport} disabled={importing} className={`mt-4 ${primaryButton}`}>
            {importing ? "Importujem…" : `Importovať ${predvoleneProdukty.length} produktov`}
          </button>
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-[19rem_1fr]">
        <div className="md:sticky md:top-6 md:max-h-[calc(100svh-3rem)] md:self-start md:overflow-y-auto">
          <div className="mb-3 flex gap-2">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Hľadať názov alebo kód…"
              className={`${input} py-1.5`}
            />
            <button onClick={() => setSelected("")} className={`shrink-0 ${primaryButton}`}>
              + Nový
            </button>
          </div>
          <ul className="flex flex-col gap-1">
            {filtered.map((p) => (
              <li key={p.slug}>
                <button
                  onClick={() => setSelected(p.slug)}
                  className={`flex w-full items-center gap-3 rounded-lg p-1.5 text-left text-sm transition-colors ${
                    selected === p.slug ? "bg-deep text-sand" : "hover:bg-mint"
                  }`}
                >
                  <span className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-md bg-mint">
                    <Nahlad src={p.fotky[0] ?? ""} className="size-full object-cover" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate">{p.nazov_sk || p.slug}</span>
                    <span className="block text-xs opacity-75">
                      {p.kod && `${p.kod} · `}
                      {Number(p.cena).toLocaleString("sk-SK")} €{!p.zverejneny && " · skrytý"}
                      {p.vypredane && " · vypredané"}
                      {p.na_domovskej && " · na domovskej"}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          {editing ? (
            <ProduktEditor
              key={selected}
              produkt={editing}
              isNew={selected === ""}
              existujuceSlugy={produkty.map((p) => p.slug)}
              onSaved={async (slug) => {
                await load();
                setSelected(slug);
              }}
              onDeleted={async () => {
                setSelected(null);
                await load();
              }}
            />
          ) : (
            <p className="text-drift">Vyberte produkt vľavo, alebo pridajte nový.</p>
          )}
        </div>
      </div>
    </>
  );
}

function ProduktEditor({
  produkt,
  isNew,
  existujuceSlugy,
  onSaved,
  onDeleted,
}: {
  produkt: ProduktRow;
  isNew: boolean;
  existujuceSlugy: string[];
  onSaved: (slug: string) => void;
  onDeleted: () => void;
}) {
  const [p, setP] = useState<ProduktRow>(produkt);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof ProduktRow>(pole: K, value: ProduktRow[K]) => {
    setP((prev) => ({ ...prev, [pole]: value }));
    setSaved(false);
  };

  function chyba(): string | null {
    if (!p.nazov_sk.trim()) return "Vyplňte slovenský názov.";
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.slug)) return "Adresa (slug) smie obsahovať iba malé písmená bez diakritiky, čísla a pomlčky.";
    if (isNew && existujuceSlugy.includes(p.slug)) return "Produkt s touto adresou už existuje.";
    if (!(Number(p.cena) >= 0)) return "Cena musí byť číslo.";
    if (p.varianty.some((v) => !v.nazov_sk.trim() || !(Number(v.cena) >= 0))) return "Každý variant potrebuje názov a cenu.";
    return null;
  }

  async function handleSave() {
    const problem = chyba();
    if (problem) {
      setError(problem);
      return;
    }
    setBusy(true);
    setError(null);
    const { error } = await supabase!
      .from("produkty")
      .upsert(
        {
          ...p,
          cena: Number(p.cena),
          varianty: p.varianty.map((v) => ({ ...v, cena: Number(v.cena) })),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "slug" },
      );
    setBusy(false);
    if (error) {
      setError(`Uloženie zlyhalo: ${error.message}`);
      return;
    }
    await triggerRevalidate();
    setSaved(true);
    onSaved(p.slug);
  }

  async function handleDelete() {
    setBusy(true);
    const { error } = await supabase!.from("produkty").delete().eq("slug", p.slug);
    setBusy(false);
    if (error) {
      // 23503: an order uses the product (objednavky_polozky), which must keep pointing at it
      setError(
        error.code === "23503"
          ? "Produkt je v objednávke, preto sa nedá vymazať. Skryte ho odškrtnutím „Zverejnený“."
          : `Vymazanie zlyhalo: ${error.message}`,
      );
      setConfirming(false);
      return;
    }
    await triggerRevalidate();
    onDeleted();
  }

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = [...(e.target.files ?? [])];
    e.target.value = "";
    if (files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      const urls: string[] = [];
      for (const file of files) urls.push(await uploadImage(file, PRODUKTY_FOLDER));
      set("fotky", [...p.fotky, ...urls]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nahrávanie zlyhalo.");
    } finally {
      setUploading(false);
    }
  }

  function presunFotku(from: number, to: number) {
    const fotky = [...p.fotky];
    [fotky[from], fotky[to]] = [fotky[to], fotky[from]];
    set("fotky", fotky);
  }

  const cislo = (value: string) => (value.trim() === "" ? NaN : Number(value.replace(",", ".")));

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-sage pb-2">
        <h2 className="font-display text-2xl text-deep">{isNew ? "Nový produkt" : p.nazov_sk || p.slug}</h2>
        {!isNew && p.zverejneny && (
          <a href={`/obchod/${p.slug}`} target="_blank" rel="noreferrer" className="text-sm text-deep underline">
            Zobraziť na webe
          </a>
        )}
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-2 text-[15px]">
        <Checkbox label="Zverejnený v obchode" checked={p.zverejneny} onChange={(v) => set("zverejneny", v)} />
        <Checkbox label="Vypredané" checked={p.vypredane} onChange={(v) => set("vypredane", v)} />
        <Checkbox label="Na domovskej stránke" checked={p.na_domovskej} onChange={(v) => set("na_domovskej", v)} />
        <Checkbox
          label="Iba osobný odber (veľký alebo krehký kus, neposiela sa)"
          checked={p.iba_osobny_odber ?? false}
          onChange={(v) => set("iba_osobny_odber", v)}
        />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Pole label="Názov – slovensky">
          <input
            value={p.nazov_sk}
            onChange={(e) => {
              set("nazov_sk", e.target.value);
              if (isNew) set("slug", slugify(e.target.value));
            }}
            className={input}
          />
        </Pole>
        <Pole label="Názov – English">
          <input value={p.nazov_en} onChange={(e) => set("nazov_en", e.target.value)} className={input} />
        </Pole>
      </div>

      <div className="grid gap-3 sm:grid-cols-[9rem_1fr]">
        <Pole label="Kód produktu" hint={isNew ? "Pridelí sa pri uložení." : "Nemení sa, je v objednávkach."}>
          <input value={p.kod ?? ""} disabled placeholder="KH-…" className={`${input} py-1.5 disabled:bg-mint`} />
        </Pole>
        <Pole label="Adresa na webe" hint={isNew ? undefined : "Adresu existujúceho produktu nemožno zmeniť, odkazy na ňu by prestali fungovať."}>
          <div className="flex items-center gap-1 text-sm">
            <span className="text-drift">/obchod/</span>
            <input
              value={p.slug}
              disabled={!isNew}
              onChange={(e) => set("slug", e.target.value)}
              className={`${input} py-1.5 disabled:bg-mint`}
            />
          </div>
        </Pole>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Pole label="Cena (€)" hint="Pri variantoch najnižšia cena.">
          <input
            inputMode="decimal"
            value={String(p.cena)}
            onChange={(e) => set("cena", e.target.value as unknown as number)}
            onBlur={(e) => set("cena", cislo(e.target.value))}
            className={input}
          />
        </Pole>
        <Pole label="Počet kusov" hint="Prázdne = nesleduje sa.">
          <input
            inputMode="numeric"
            value={p.pocet_kusov ?? ""}
            onChange={(e) => set("pocet_kusov", e.target.value.trim() === "" ? null : Math.max(0, Math.round(cislo(e.target.value)) || 0))}
            className={input}
          />
        </Pole>
        <Pole label="Poradie v obchode" hint="Menšie číslo = vyššie.">
          <input
            inputMode="numeric"
            value={p.poradie}
            onChange={(e) => set("poradie", Math.round(cislo(e.target.value)) || 0)}
            className={input}
          />
        </Pole>
      </div>

      <Pole label="Kategórie">
        <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-[15px]">
          {KATEGORIE.map((k) => (
            <Checkbox
              key={k}
              label={nazvyKategorii[k].sk}
              checked={p.kategorie.includes(k)}
              onChange={(v) => set("kategorie", v ? [...p.kategorie, k] : p.kategorie.filter((x) => x !== k))}
            />
          ))}
        </div>
      </Pole>

      <div className="grid gap-3 lg:grid-cols-2">
        <Pole label="Popis – slovensky" hint="Nový odsek: prázdny riadok.">
          <textarea value={p.popis_sk} onChange={(e) => set("popis_sk", e.target.value)} rows={textareaRows(p.popis_sk) + 2} className={input} />
        </Pole>
        <Pole label="Popis – English" hint="New paragraph: blank line.">
          <textarea value={p.popis_en} onChange={(e) => set("popis_en", e.target.value)} rows={textareaRows(p.popis_en) + 2} className={input} />
        </Pole>
      </div>

      <Pole label="Varianty" hint="Napr. šálka bez vrchnáka a s vrchnákom. Bez variantov sa predáva za cenu vyššie.">
        <div className="flex flex-col gap-2">
          {p.varianty.map((v, i) => {
            const zmen = (zmena: Partial<ProduktRow["varianty"][number]>) =>
              set(
                "varianty",
                p.varianty.map((x, j) => (j === i ? { ...x, ...zmena } : x)),
              );
            return (
              <div key={i} className="grid items-center gap-2 sm:grid-cols-[1fr_1fr_6rem_auto]">
                <input placeholder="Názov – slovensky" value={v.nazov_sk} onChange={(e) => zmen({ nazov_sk: e.target.value })} className={`${input} py-1.5`} />
                <input placeholder="Name – English" value={v.nazov_en} onChange={(e) => zmen({ nazov_en: e.target.value })} className={`${input} py-1.5`} />
                <input
                  placeholder="€"
                  inputMode="decimal"
                  value={String(v.cena)}
                  onChange={(e) => zmen({ cena: e.target.value as unknown as number })}
                  onBlur={(e) => zmen({ cena: cislo(e.target.value) })}
                  className={`${input} py-1.5`}
                />
                <button
                  type="button"
                  onClick={() => set("varianty", p.varianty.filter((_, j) => j !== i))}
                  className="text-sm text-drift underline hover:text-red-700"
                >
                  Odstrániť
                </button>
              </div>
            );
          })}
          <button
            type="button"
            onClick={() => set("varianty", [...p.varianty, { nazov_sk: "", nazov_en: "", cena: Number(p.cena) || 0 }])}
            className={`self-start ${outlineButton}`}
          >
            + Pridať variant
          </button>
        </div>
      </Pole>

      <Pole label="Fotky" hint="Prvá fotka je hlavná (karta v obchode). Poradie zmeníte šípkami.">
        <div className="flex flex-wrap gap-3">
          {p.fotky.map((src, i) => (
            <div key={`${src}-${i}`} className="w-28">
              <div className="relative aspect-square overflow-hidden rounded-lg border border-sage bg-mint">
                <Nahlad src={src} className="size-full object-cover" />
                {i === 0 && <span className="absolute left-1 top-1 rounded bg-deep px-1.5 text-[11px] text-sand">hlavná</span>}
              </div>
              <div className="mt-1 flex items-center justify-between text-sm text-drift">
                <button type="button" disabled={i === 0} onClick={() => presunFotku(i, i - 1)} aria-label="Posunúť vľavo" className="px-1 hover:text-deep disabled:opacity-30">
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => set("fotky", p.fotky.filter((_, j) => j !== i))}
                  className="text-xs underline hover:text-red-700"
                >
                  Odstrániť
                </button>
                <button
                  type="button"
                  disabled={i === p.fotky.length - 1}
                  onClick={() => presunFotku(i, i + 1)}
                  aria-label="Posunúť vpravo"
                  className="px-1 hover:text-deep disabled:opacity-30"
                >
                  →
                </button>
              </div>
            </div>
          ))}
          <div className="grid aspect-square w-28 place-items-center rounded-lg border border-dashed border-sage">
            <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="text-sm text-deep underline">
              {uploading ? "Nahrávam…" : "+ Nahrať"}
            </button>
          </div>
        </div>
      </Pole>

      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <div className="sticky bottom-0 -mx-2 flex flex-wrap items-center gap-3 border-t border-sage bg-sand px-2 py-4">
        {!isNew &&
          (confirming ? (
            <>
              <span className="text-sm text-red-700">Natrvalo vymazať produkt? (Skryť ho môžete aj odškrtnutím „Zverejnený“.)</span>
              <button
                type="button"
                onClick={handleDelete}
                disabled={busy}
                className="rounded-full bg-red-700 px-4 py-1.5 text-sm font-medium text-white disabled:opacity-50"
              >
                Áno, vymazať
              </button>
              <button type="button" onClick={() => setConfirming(false)} className="text-sm underline">
                Zrušiť
              </button>
            </>
          ) : (
            <button type="button" onClick={() => setConfirming(true)} className="text-sm text-drift underline hover:text-red-700">
              Vymazať produkt
            </button>
          ))}
        <SaveButton busy={busy} saved={saved} onClick={handleSave} />
      </div>
    </section>
  );
}

function Pole({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium">{label}</span>
      {children}
      {hint && <span className="text-xs text-drift">{hint}</span>}
    </div>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="inline-flex items-center gap-2">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="size-4 accent-deep" />
      {label}
    </label>
  );
}
