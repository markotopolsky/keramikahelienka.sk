/**
 * Copies the 48 products of the original site (docs/povodny-web/produkty.json with the texts
 * from content/produkty.ts) into the Supabase `produkty` table. /admin has the same import
 * as a button; this script is for setting up a fresh database from the terminal.
 *
 *   npm run seed:produkty -- --dry-run      # show what would change
 *   npm run seed:produkty                   # add the products that are not in the table yet
 *   npm run seed:produkty -- --force        # also overwrite products already edited in /admin
 */
import { createClient } from "@supabase/supabase-js";
import { naRiadok, predvoleneProdukty } from "../lib/produkty-zaklad";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const force = args.includes("--force");

async function main() {
  if (!url || !key) {
    if (!dryRun) {
      console.error("Chýba NEXT_PUBLIC_SUPABASE_URL alebo SUPABASE_SERVICE_ROLE_KEY v .env.local");
      process.exit(1);
    }
    console.log("Bez Supabase kľúčov: --dry-run ukáže všetko ako nové (databázu nevidím).\n");
  }

  const inDb = new Set<string>();
  if (url && key) {
    const { data, error } = await createClient(url, key).from("produkty").select("slug");
    if (error) {
      console.error("Načítanie z DB zlyhalo:", error.message);
      process.exit(1);
    }
    for (const r of data ?? []) inDb.add(r.slug as string);
  }

  const rows = predvoleneProdukty.map(naRiadok).filter((r) => force || !inDb.has(r.slug));
  for (const r of rows) console.log(`${inDb.has(r.slug) ? "prepisujem" : "vkladám   "}  ${r.slug}`);
  console.log(`\n${rows.length} produktov na zápis, ${predvoleneProdukty.length - rows.length} ponechaných bez zmeny.`);

  if (dryRun) {
    console.log("--dry-run: do databázy sa nič nezapísalo.");
    return;
  }
  if (rows.length === 0) return;

  const updated_at = new Date().toISOString();
  const { error } = await createClient(url!, key!)
    .from("produkty")
    .upsert(
      rows.map((r) => ({ ...r, updated_at })),
      { onConflict: "slug" },
    );

  if (error) {
    console.error("Zápis zlyhal:", error.message);
    process.exit(1);
  }
  console.log("Hotovo.");
}

main();
