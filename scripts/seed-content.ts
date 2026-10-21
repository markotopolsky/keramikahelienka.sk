/**
 * Writes the texts from lib/content-defaults.ts into the Supabase `content` table, so that
 * everything on the site can be edited in /admin.
 *
 *   npm run seed:content -- --dry-run                 # show what would change
 *   npm run seed:content -- hero cennik               # only these sections
 *   npm run seed:content -- --force hero              # overwrite edited rows
 *
 * A row that already holds real text is never touched: only missing rows and rows still
 * carrying an „xxx …" placeholder (or an empty value) are written.
 */
import { createClient } from "@supabase/supabase-js";
import { DEFAULTS, SECTIONS } from "../lib/content-defaults";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const force = args.includes("--force");
const wanted = args.filter((a) => !a.startsWith("--"));

const sections = SECTIONS.map((s) => s.section).filter((s) => wanted.length === 0 || wanted.includes(s));

if (sections.length === 0) {
  console.error(`Neznáma sekcia: ${wanted.join(", ")}`);
  process.exit(1);
}

/** A value that is still an authoring placeholder, i.e. safe to overwrite. */
function isPlaceholder(value: string | null | undefined): boolean {
  const text = (value ?? "").trim();
  return text === "" || /^xxx\b/i.test(text);
}

async function main() {
  if (!url || !key) {
    if (!dryRun) {
      console.error("Chýba NEXT_PUBLIC_SUPABASE_URL alebo SUPABASE_SERVICE_ROLE_KEY v .env.local");
      process.exit(1);
    }
    console.log("Bez Supabase kľúčov: --dry-run ukáže všetko ako nové (databázu nevidím).\n");
  }

  const inDb = new Map<string, string>();
  if (url && key) {
    const supabase = createClient(url, key);
    const { data, error } = await supabase.from("content").select("key, value").in("section", sections);
    if (error) {
      console.error("Načítanie z DB zlyhalo:", error.message);
      process.exit(1);
    }
    for (const r of data ?? []) inDb.set(r.key, r.value as string);
  }

  const rows: { key: string; value: string; section: string }[] = [];
  const kept: string[] = [];

  for (const section of sections) {
    for (const [k, value] of Object.entries(DEFAULTS[section] ?? {})) {
      const current = inDb.get(k);
      const missing = current === undefined;

      if (!missing && !force && !isPlaceholder(current)) {
        kept.push(k);
        continue;
      }
      if (!missing && !force && isPlaceholder(value)) {
        kept.push(k);
        continue;
      }
      if (!missing && current === value) {
        kept.push(k);
        continue;
      }

      rows.push({ key: k, value, section });
      console.log(`${missing ? "vkladám   " : "prepisujem"}  ${k}`);
    }
  }

  console.log(`\n${rows.length} kľúčov na zápis, ${kept.length} ponechaných bez zmeny.`);

  if (dryRun) {
    console.log("--dry-run: do databázy sa nič nezapísalo.");
    return;
  }
  if (rows.length === 0) return;

  const supabase = createClient(url!, key!);
  const updated_at = new Date().toISOString();
  const { error } = await supabase.from("content").upsert(
    rows.map((r) => ({ ...r, updated_at })),
    { onConflict: "key" },
  );

  if (error) {
    console.error("Zápis zlyhal:", error.message);
    process.exit(1);
  }

  console.log("Hotovo. Zmeny na webe uvidíte po uložení čohokoľvek v /admin, alebo najneskôr o hodinu.");
}

main();
