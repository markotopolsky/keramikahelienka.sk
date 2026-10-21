This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Editovateľný obsah (jednoduchý CMS)

Texty, fotky a produkty sa upravujú na `/admin` bez zmeny kódu. Rovnaký systém ako v projekte franek-skola-sportu: Supabase (databáza a prihlásenie) a Cloudinary (fotky).

### Ako to funguje

- **Texty a fotky** sú v tabuľke `content`: jeden riadok = jeden kľúč `<sekcia>.<pole>` (napr. `hero.lead`). Anglická verzia má kľúč s `_en` (`hero.lead_en`).
- **Defaulty v kóde sú zdroj pravdy** (`lib/content-defaults.ts`). Každý editovateľný kľúč tam má default, takže web funguje aj s prázdnou databázou, bez env premenných alebo keď Supabase nefunguje.
- **Typ poľa určuje kľúč**: fotky (`images` v sekcii), súbory (`FILE_KEYS`), dlhé texty s formátovaním (`RICH_TEXT_KEYS`, `components/rich-text.tsx`), prepínač áno/nie (`SWITCH_KEYS`). Ostatné je obyčajný text.
- **„xxx …“** označuje text, ktorý treba doplniť. Web ho neukáže (`filled()`), seed ho smie prepísať.
- **Produkty** majú vlastnú tabuľku `produkty` (`lib/produkty.ts`). Kým je prázdna, obchod ukazuje 48 produktov z pôvodného webu.
- **Stránka číta obsah** cez `await getContent("<sekcia>", lang)` a `await getProdukty()`. Obsah je v cache (`unstable_cache`, tagy `content` a `produkty`). Po každom uložení admin zavolá `POST /api/revalidate`. Endpoint overí prihláseného používateľa a cache hneď zneplatní. `revalidate = 3600` je iba záloha.
- **Fotky** idú z prehliadača priamo do Cloudinary (unsigned preset) do priečinka `keramikahelienka/<sekcia>`. Do DB sa uloží iba URL.
- **Bezpečnosť**: RLS dovoľuje návštevníkom iba čítať. Zapisovať a vidieť objednávky smie iba používateľ z tabuľky `admini`, samotné prihlásenie nestačí. `SUPABASE_SERVICE_ROLE_KEY` používajú lokálne skripty a pokladňa na serveri (`lib/supabase-admin.ts`, chránené `server-only`). Na hostingu je iba ako serverová premenná, nikdy s prefixom `NEXT_PUBLIC_`.
- **Produkty a objednávky**: každý produkt má kód `KH-0001`, ktorý pridelí databáza a ktorý sa nikdy nemení. Adresa (`slug`) sa po vytvorení tiež nemení. Databáza sama zapisuje históriu cien (`produkty_ceny`, pre pravidlo o 30 dňoch pri zľave). Objednávka (`objednavky`, `objednavky_polozky`) si ukladá kópiu položiek a verziu obchodných podmienok. Admin v nej mení iba stav a internú poznámku, každú zmenu stavu databáza zapíše do `objednavky_stavy`. Produkt, ktorý je v objednávke, sa nedá vymazať, iba skryť.
- **Pokladňa** (`lib/objednavka-akcia.ts`, Server Action) volá databázovú funkciu `vytvor_objednavku`. Tá vezme ceny a sklad z databázy, zamkne kusy (dvaja zákazníci nekúpia ten istý kus), uloží znenie podmienok (`podmienky_verzie`) a podrží kusy 30 minút. Nezaplatenú objednávku potom zruší `zrus_expirovane_objednavky` (Supabase Cron každých 5 minút) a kusy vráti na sklad. Zrušená objednávka sa nedá obnoviť. Návštevník ani admin funkciu volať nemôžu, iba server so service role kľúčom.
- **Doručenie na cenovú ponuku**: pri doručení pokladňa odošle nezáväznú žiadosť (`caka_na_cenu_dopravy`, kusy držané 3 dni). Admin zadá cenu a spôsob dopravy (`posli_ponuku`), zákazník ju potvrdí na `/objednavka/<token>` (`potvrd_ponuku`) a až potom platí. Kus s „Iba osobný odber“ doručenie vypne.

### Prvé nastavenie

1. Vytvor projekt na supabase.com (región v EÚ). V **SQL Editor** spusti `supabase/schema.sql`. Po každej zmene súboru ho spusti znova – starú databázu upraví bez straty dát.
2. **Authentication → Sign In / Providers**: vypni „Allow new users to sign up“. Potom v **Authentication → Users → Add user** vytvor admin účet (e-mail + heslo). V **SQL Editor** ho pridaj medzi adminov:
   ```sql
   insert into public.admini (user_id, email) select id, email from auth.users where email = 'e-mail@admina.sk';
   ```
3. Do `.env.local` (a do env premenných na hostingu) doplň premenné z `.env.example`. `SUPABASE_SERVICE_ROLE_KEY` potrebuje aj hosting, lebo s ním pokladňa vytvára objednávky. Nesmie mať prefix `NEXT_PUBLIC_`.
4. `npm run setup:cloudinary` vytvorí unsigned upload preset a priečinky.
5. `npm run seed:content -- --dry-run` ukáže, čo sa zapíše. Potom `npm run seed:content`.
6. `npm run seed:produkty`, alebo v `/admin` → Produkty tlačidlo „Importovať“.
7. Otvor `/admin`, prihlás sa a uprav text. Zmena je na webe hneď po uložení.

Keep-alive: `.github/workflows/keep-alive.yml` pinguje Supabase 2× týždenne, aby sa bezplatný projekt neuspal. V GitHub → Settings → Secrets → Actions nastav `SUPABASE_URL` a `SUPABASE_SERVICE_KEY` (service role key).

### Nová editovateľná sekcia

1. Do `SECTIONS` v `lib/content-defaults.ts` pridaj `sekcia("nazov", "Popis · /cesta", { pole: ["Slovensky", "English"], iny: "jeden jazyk" }, { foto: "/images/..." })`.
2. Názov sekcie pridaj do `SECTION_GROUPS`. Admin ju potom ukáže sám, nový admin kód netreba.
3. V komponente: `const c = await getContent("nazov", lang)` a `{c["nazov.pole"]}`. Klientskému komponentu pošli `c` ako prop.
4. `npm run seed:content -- nazov` zapíše defaulty do DB (nepovinné, admin ich ukazuje aj bez toho).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# keramikahelienka.sk
