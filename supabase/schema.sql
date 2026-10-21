-- Database of keramikahelienka.sk: CMS texts, products and shop orders (README, "Editovateľný obsah").
-- Run in Supabase → SQL Editor. Safe to run again: every step checks what already exists,
-- so an older database is migrated in place and no rows are lost.

-- ------------------------------------------------------------------------------------- Texts

-- Texts and photos: one row per key "<section>.<field>" (English twin "<section>.<field>_en").
-- Defaults and field types live in lib/content-defaults.ts.
create table if not exists public.content (
  key text primary key,
  value text not null default '',
  section text not null,
  updated_at timestamptz not null default now()
);

create index if not exists content_section_idx on public.content (section);

-- Pinged twice a week by .github/workflows/keep-alive.yml, so the free project is not paused.
create table if not exists public.keep_alive (
  id bigint generated always as identity primary key,
  pinged_at timestamptz not null default now()
);

-- ------------------------------------------------------------------------------------- Admins

-- Only users listed here may edit the site and see orders. Signing in is not enough: if sign-ups
-- were ever switched on by mistake, a stranger's account would still have no access.
-- Add a user in SQL Editor:
--   insert into public.admini (user_id, email) select id, email from auth.users where email = '...';
create table if not exists public.admini (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  pridany_at timestamptz not null default now()
);

create or replace function public.je_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admini where user_id = auth.uid());
$$;

-- ------------------------------------------------------------------------------------- Products

-- Product code KH-0001: assigned once by the database and never changed, so orders and
-- conversations with customers keep pointing at the same piece. A failed or ignored insert
-- (e.g. the import of products that are already there) skips a number; codes need no order.
create sequence if not exists public.produkty_kod_seq;

-- Products of the shop. Defaults in lib/produkty-zaklad.ts, editor in /admin → Produkty.
create table if not exists public.produkty (
  id uuid primary key default gen_random_uuid(),
  kod text not null default 'KH-' || lpad(nextval('public.produkty_kod_seq')::text, 4, '0'),
  -- Address on the site (/obchod/<slug>); fixed once the product exists, like the code
  slug text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  poradie integer not null default 0,
  zverejneny boolean not null default true,
  na_domovskej boolean not null default false,
  nazov_sk text not null,
  nazov_en text not null default '',
  popis_sk text not null default '',
  popis_en text not null default '',
  cena numeric(10, 2) not null check (cena >= 0),
  -- [{ "nazov_sk": "...", "nazov_en": "...", "cena": 39 }]
  varianty jsonb not null default '[]'::jsonb,
  pocet_kusov integer check (pocet_kusov >= 0),
  vypredane boolean not null default false,
  kategorie text[] not null default '{}',
  fotky text[] not null default '{}',
  updated_at timestamptz not null default now()
);

-- Migration of the first version, where the slug was the primary key and there was no code
alter table public.produkty add column if not exists id uuid not null default gen_random_uuid();
alter table public.produkty add column if not exists kod text;
-- Large or fragile pieces that are not shipped: the checkout offers only pickup for them
alter table public.produkty add column if not exists iba_osobny_odber boolean not null default false;

create unique index if not exists produkty_slug_key on public.produkty (slug);

do $$
begin
  if exists (
    select 1
    from pg_constraint c
    join pg_attribute a on a.attrelid = c.conrelid and a.attnum = any (c.conkey)
    where c.conrelid = 'public.produkty'::regclass and c.contype = 'p' and a.attname = 'slug'
  ) then
    alter table public.produkty drop constraint produkty_pkey;
    alter table public.produkty add primary key (id);
  end if;
end $$;

-- Existing products get codes from the oldest (highest poradie) to the newest
do $$
declare
  r record;
begin
  for r in select id from public.produkty where kod is null order by poradie desc, slug loop
    update public.produkty
    set kod = 'KH-' || lpad(nextval('public.produkty_kod_seq')::text, 4, '0')
    where id = r.id;
  end loop;
end $$;

alter table public.produkty alter column kod set default 'KH-' || lpad(nextval('public.produkty_kod_seq')::text, 4, '0');
alter table public.produkty alter column kod set not null;
alter sequence public.produkty_kod_seq owned by public.produkty.kod;

create unique index if not exists produkty_kod_key on public.produkty (kod);
create index if not exists produkty_poradie_idx on public.produkty (poradie);

create or replace function public.produkty_nemenne_polia()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  -- old.kod is null only while the migration above hands out the first codes
  if new.id is distinct from old.id or new.slug is distinct from old.slug
    or (old.kod is not null and new.kod is distinct from old.kod) then
    raise exception 'Kód, id a adresa (slug) produktu sa po vytvorení nemenia.' using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

drop trigger if exists produkty_nemenne_polia on public.produkty;
create trigger produkty_nemenne_polia
  before update on public.produkty
  for each row execute function public.produkty_nemenne_polia();

-- Price history, written by the database on every price change. A discounted price must show the
-- lowest price of the last 30 days before the discount (Omnibus rule), which needs this record.
create table if not exists public.produkty_ceny (
  id bigint generated always as identity primary key,
  produkt_id uuid not null references public.produkty (id) on delete cascade,
  cena numeric(10, 2) not null,
  varianty jsonb not null default '[]'::jsonb,
  od timestamptz not null default now()
);

create index if not exists produkty_ceny_produkt_od_idx on public.produkty_ceny (produkt_id, od desc);

create or replace function public.produkty_zapis_cenu()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' or new.cena is distinct from old.cena or new.varianty is distinct from old.varianty then
    insert into public.produkty_ceny (produkt_id, cena, varianty) values (new.id, new.cena, new.varianty);
  end if;
  return null;
end;
$$;

drop trigger if exists produkty_zapis_cenu on public.produkty;
create trigger produkty_zapis_cenu
  after insert or update of cena, varianty on public.produkty
  for each row execute function public.produkty_zapis_cenu();

-- Products that existed before the history: their current price is the first entry
insert into public.produkty_ceny (produkt_id, cena, varianty)
select p.id, p.cena, p.varianty
from public.produkty p
where not exists (select 1 from public.produkty_ceny c where c.produkt_id = p.id);

-- ------------------------------------------------------------------------------------- Orders

-- Order numbers 2026-0001, 2026-0002, … restarting every year (Slovak time). Taken inside the
-- inserting transaction, so a failed order gives its number back and the sequence has no gaps.
create table if not exists public.objednavky_cisla (
  rok integer primary key,
  posledne integer not null
);

create or replace function public.dalsie_cislo_objednavky()
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  r integer := extract(year from now() at time zone 'Europe/Bratislava');
  n integer;
begin
  insert into public.objednavky_cisla as c (rok, posledne) values (r, 1)
  on conflict (rok) do update set posledne = c.posledne + 1
  returning posledne into n;
  return r || '-' || lpad(n::text, 4, '0');
end;
$$;

-- Exact text of the terms (obchodné podmienky + reklamačný poriadok) a customer agreed to, stored once
-- per version. The order points at it, so a later edit in /admin does not change what was accepted.
create table if not exists public.podmienky_verzie (
  hash text primary key,
  text text not null,
  vytvorena timestamptz not null default now()
);

-- Orders are written only by the checkout on the server, never from the browser. Each one keeps
-- what the customer saw and agreed to; later changes of products or terms do not touch it.
-- Kept 10 years as a basis for the accounts (zákon č. 431/2002 Z. z., § 35).
create table if not exists public.objednavky (
  id uuid primary key default gen_random_uuid(),
  cislo text not null unique default public.dalsie_cislo_objednavky(),
  stav text not null default 'caka_na_platbu'
    check (stav in ('caka_na_platbu', 'zaplatena', 'vybavena', 'zrusena', 'odstupena')), -- widened below
  jazyk text not null default 'sk' check (jazyk in ('sk', 'en')),
  meno text not null,
  email text not null,
  telefon text not null,
  doprava text not null check (doprava in ('osobny-odber')),
  doprava_cena numeric(10, 2) not null default 0 check (doprava_cena >= 0),
  medzisucet numeric(10, 2) not null check (medzisucet >= 0),
  spolu numeric(10, 2) not null check (spolu >= 0),
  -- Version (effective date) of the terms the customer accepted with the checkbox at checkout
  vop_verzia text not null,
  interna_poznamka text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists objednavky_created_at_idx on public.objednavky (created_at desc);

-- An unpaid order holds its pieces until this time, then zrus_expirovane_objednavky() cancels it.
-- The Comgate payment created for the order must expire at the same time.
alter table public.objednavky add column if not exists rezervovane_do timestamptz;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'objednavky_vop_verzia_fkey') then
    alter table public.objednavky
      add constraint objednavky_vop_verzia_fkey foreign key (vop_verzia) references public.podmienky_verzie (hash);
  end if;
end $$;

-- Delivery on a price offer (ZAZNAMNIK.md §15): the customer sends a non-binding request with an
-- address, Helena sets the delivery price in /admin, the customer confirms the offer and pays.
-- The contract is made only by that confirmation, when the full price is known.
--   caka_na_cenu_dopravy → ponuka_odoslana → caka_na_platbu → zaplatena → vybavena
alter table public.objednavky add column if not exists ulica text;
alter table public.objednavky add column if not exists mesto text;
alter table public.objednavky add column if not exists psc text;
alter table public.objednavky add column if not exists krajina text;
-- How Helena sends it, as the customer sees it in the offer ("Packeta na adresu", "kuriér")
alter table public.objednavky add column if not exists doprava_sposob text not null default '';
-- Secret part of the offer link /objednavka/<token>
alter table public.objednavky add column if not exists ponuka_token uuid unique;

alter table public.objednavky drop constraint if exists objednavky_stav_check;
alter table public.objednavky add constraint objednavky_stav_check check (stav in (
  'caka_na_cenu_dopravy', 'ponuka_odoslana', 'caka_na_platbu', 'zaplatena', 'vybavena', 'zrusena', 'odstupena'
));
alter table public.objednavky drop constraint if exists objednavky_doprava_check;
alter table public.objednavky add constraint objednavky_doprava_check check (doprava in ('osobny-odber', 'dorucenie'));
alter table public.objednavky drop constraint if exists objednavky_adresa_check;
alter table public.objednavky add constraint objednavky_adresa_check check (
  doprava <> 'dorucenie' or (ulica is not null and mesto is not null and psc is not null and krajina is not null)
);

drop index if exists public.objednavky_rezervovane_do_idx;
create index if not exists objednavky_rezervacia_idx on public.objednavky (rezervovane_do)
  where stav in ('caka_na_cenu_dopravy', 'ponuka_odoslana', 'caka_na_platbu');

-- Copy of every item as it was sold. The product row cannot be deleted while an order uses it.
create table if not exists public.objednavky_polozky (
  id bigint generated always as identity primary key,
  objednavka_id uuid not null references public.objednavky (id) on delete cascade,
  produkt_id uuid not null references public.produkty (id) on delete restrict,
  kod text not null,
  nazov text not null,
  variant text,
  cena_za_kus numeric(10, 2) not null check (cena_za_kus >= 0),
  pocet integer not null check (pocet > 0)
);

create index if not exists objednavky_polozky_objednavka_idx on public.objednavky_polozky (objednavka_id);
create index if not exists objednavky_polozky_produkt_idx on public.objednavky_polozky (produkt_id);

-- Who changed the state of an order and when, written by the database
create table if not exists public.objednavky_stavy (
  id bigint generated always as identity primary key,
  objednavka_id uuid not null references public.objednavky (id) on delete cascade,
  stav text not null,
  zmenil uuid references auth.users (id) on delete set null,
  at timestamptz not null default now()
);

create index if not exists objednavky_stavy_objednavka_idx on public.objednavky_stavy (objednavka_id, at);

create or replace function public.objednavky_zapis_stav()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' or new.stav is distinct from old.stav then
    insert into public.objednavky_stavy (objednavka_id, stav, zmenil) values (new.id, new.stav, auth.uid());
  end if;
  return null;
end;
$$;

drop trigger if exists objednavky_zapis_stav on public.objednavky;
create trigger objednavky_zapis_stav
  after insert or update of stav on public.objednavky
  for each row execute function public.objednavky_zapis_stav();

create or replace function public.objednavky_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists objednavky_updated_at on public.objednavky;
create trigger objednavky_updated_at
  before update on public.objednavky
  for each row execute function public.objednavky_updated_at();

-- A cancelled order has given its pieces back, so it stays cancelled; a new order is made instead
create or replace function public.objednavky_kontrola_stavu()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if old.stav = 'zrusena' and new.stav <> 'zrusena' then
    raise exception 'Zrušená objednávka sa nedá obnoviť, kusy sa už vrátili na sklad.' using errcode = 'check_violation';
  end if;
  -- The offer states are set only by posli_ponuku and potvrd_ponuku, never by hand
  if new.stav = 'caka_na_cenu_dopravy' and old.stav <> 'caka_na_cenu_dopravy' then
    raise exception 'Tento stav má iba nová žiadosť o doručenie.' using errcode = 'check_violation';
  end if;
  if new.stav = 'ponuka_odoslana' and new.ponuka_token is null then
    raise exception 'Ponuku dopravy pošlite tlačidlom „Poslať ponuku“.' using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

drop trigger if exists objednavky_kontrola_stavu on public.objednavky;
create trigger objednavky_kontrola_stavu
  before update of stav on public.objednavky
  for each row execute function public.objednavky_kontrola_stavu();

-- Cancelling an order that was not handed over yet returns its pieces to the shop
create or replace function public.objednavky_vrat_kusy()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.stav = 'zrusena' and old.stav in ('caka_na_cenu_dopravy', 'ponuka_odoslana', 'caka_na_platbu', 'zaplatena') then
    update public.produkty p
    set pocet_kusov = p.pocet_kusov + t.pocet, vypredane = false
    from (
      select produkt_id, sum(pocet)::integer as pocet
      from public.objednavky_polozky
      where objednavka_id = new.id
      group by produkt_id
    ) t
    where p.id = t.produkt_id and p.pocet_kusov is not null;
  end if;
  return null;
end;
$$;

drop trigger if exists objednavky_vrat_kusy on public.objednavky;
create trigger objednavky_vrat_kusy
  after update of stav on public.objednavky
  for each row execute function public.objednavky_vrat_kusy();

-- Cancels unpaid orders and unanswered delivery requests or offers past their reservation. Runs every 5 minutes (pg_cron below) and before
-- every new order, so a piece someone did not pay for goes back on sale.
create or replace function public.zrus_expirovane_objednavky()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  n integer;
begin
  update public.objednavky set stav = 'zrusena'
  where stav in ('caka_na_cenu_dopravy', 'ponuka_odoslana', 'caka_na_platbu') and rezervovane_do < now();
  get diagnostics n = row_count;
  return n;
end;
$$;

-- The checkout (lib/objednavka-akcia.ts) calls this with the service role key; visitors cannot.
-- Prices, names and stock come from the database, never from the browser. The ordered products
-- are locked first, so two customers cannot buy the same piece at the same moment.
-- p_polozky: [{ "slug": "...", "variant": 0 | null, "pocet": 1 }]
-- p_adresa: { "ulica", "mesto", "psc", "krajina": "SK" } for delivery, null for pickup
-- Pickup: the order waits 30 minutes for payment. Delivery: a non-binding request that holds the
-- pieces 3 days until Helena sends the offer (posli_ponuku).
-- Errors for the checkout: KH_UDAJE (invalid input), KH_NEDOSTUPNE (detail: slugs that are gone),
-- KH_ODBER (detail: slugs sold only with pickup), KH_LIMIT (too many open orders from one e-mail).
drop function if exists public.vytvor_objednavku(text, text, text, text, text, jsonb, text);

create or replace function public.vytvor_objednavku(
  p_jazyk text,
  p_meno text,
  p_email text,
  p_telefon text,
  p_doprava text,
  p_adresa jsonb,
  p_polozky jsonb,
  p_podmienky text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  rezervacia constant interval := interval '30 minutes';
  rezervacia_ziadosti constant interval := interval '3 days';
  v_dorucenie boolean := p_doprava = 'dorucenie';
  v_ulica text := btrim(coalesce(p_adresa->>'ulica', ''));
  v_mesto text := btrim(coalesce(p_adresa->>'mesto', ''));
  v_psc text := regexp_replace(coalesce(p_adresa->>'psc', ''), '[[:space:]]', '', 'g');
  v_krajina text := coalesce(p_adresa->>'krajina', '');
  v_iba_odber text[] := '{}';
  v_meno text := btrim(coalesce(p_meno, ''));
  v_email text := lower(btrim(coalesce(p_email, '')));
  v_telefon text := btrim(coalesce(p_telefon, ''));
  v_hash text;
  v_riadky jsonb := '[]'::jsonb;
  v_nedostupne text[] := '{}';
  v_medzisucet numeric(10, 2) := 0;
  v_objednavka public.objednavky;
  r record;
  v_cena numeric(10, 2);
  v_variant text;
begin
  if coalesce(p_jazyk, '') not in ('sk', 'en') or coalesce(p_doprava, '') not in ('osobny-odber', 'dorucenie') then
    raise exception 'KH_UDAJE';
  end if;
  -- Delivery only within Slovakia for now (ZAZNAMNIK.md, question 2)
  if v_dorucenie and (
    length(v_ulica) not between 3 and 200 or length(v_mesto) not between 2 and 100
    or v_psc !~ '^[0-9]{5}$' or v_krajina <> 'SK'
  ) then
    raise exception 'KH_UDAJE';
  end if;
  if length(v_meno) not between 2 and 200 or length(v_email) > 254 or v_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then
    raise exception 'KH_UDAJE';
  end if;
  if v_telefon !~ '^\+?[0-9 ()/-]{6,30}$' or length(coalesce(p_podmienky, '')) < 100 then
    raise exception 'KH_UDAJE';
  end if;
  if jsonb_typeof(p_polozky) is distinct from 'array' then
    raise exception 'KH_UDAJE';
  end if;
  if jsonb_array_length(p_polozky) not between 1 and 30 then
    raise exception 'KH_UDAJE';
  end if;
  if exists (
    select 1 from jsonb_array_elements(p_polozky) x
    where jsonb_typeof(x->'slug') is distinct from 'string'
      or jsonb_typeof(x->'pocet') is distinct from 'number'
      or (x->>'pocet') !~ '^[0-9]{1,2}$'
      or (x->>'pocet')::integer not between 1 and 10
      or (jsonb_typeof(x->'variant') <> 'null' and (x->>'variant') !~ '^[0-9]{1,2}$')
  ) then
    raise exception 'KH_UDAJE';
  end if;

  perform public.zrus_expirovane_objednavky();

  if (
    select count(*) from public.objednavky
    where email = v_email and stav in ('caka_na_cenu_dopravy', 'caka_na_platbu') and created_at > now() - interval '1 hour'
  ) >= 3 then
    raise exception 'KH_LIMIT';
  end if;

  perform 1 from public.produkty
  where slug in (select x->>'slug' from jsonb_array_elements(p_polozky) x)
  order by id
  for update;

  for r in
    with riadky as (
      select x->>'slug' as slug, (x->>'variant')::integer as variant, (x->>'pocet')::integer as pocet
      from jsonb_array_elements(p_polozky) x
    ),
    spojene as (
      select slug, variant, sum(pocet)::integer as pocet from riadky group by slug, variant
    )
    select
      s.slug, s.variant, s.pocet,
      sum(s.pocet) over (partition by s.slug) as pocet_produktu,
      p.id, p.kod, p.zverejneny, p.vypredane, p.pocet_kusov, p.cena, p.varianty, p.nazov_sk, p.nazov_en,
      p.iba_osobny_odber
    from spojene s
    left join public.produkty p on p.slug = s.slug
    order by s.slug, s.variant nulls first
  loop
    if r.id is null or not r.zverejneny or r.vypredane
      or (r.pocet_kusov is not null and r.pocet_kusov < r.pocet_produktu)
      or (jsonb_array_length(r.varianty) > 0 and (r.variant is null or r.variant >= jsonb_array_length(r.varianty)))
      or (jsonb_array_length(r.varianty) = 0 and r.variant is not null) then
      v_nedostupne := array_append(v_nedostupne, r.slug);
      continue;
    end if;
    if v_dorucenie and r.iba_osobny_odber then
      v_iba_odber := array_append(v_iba_odber, r.slug);
    end if;

    if r.variant is null then
      v_cena := r.cena;
      v_variant := null;
    else
      v_cena := (r.varianty->r.variant->>'cena')::numeric;
      v_variant := coalesce(nullif(r.varianty->r.variant->>('nazov_' || p_jazyk), ''), r.varianty->r.variant->>'nazov_sk');
    end if;

    v_medzisucet := v_medzisucet + v_cena * r.pocet;
    v_riadky := v_riadky || jsonb_build_object(
      'produkt_id', r.id,
      'kod', r.kod,
      'nazov', case when p_jazyk = 'en' and r.nazov_en <> '' then r.nazov_en else r.nazov_sk end,
      'variant', v_variant,
      'cena_za_kus', v_cena,
      'pocet', r.pocet
    );
  end loop;

  if cardinality(v_nedostupne) > 0 then
    raise exception 'KH_NEDOSTUPNE' using detail = array_to_string(array(select distinct unnest(v_nedostupne)), ',');
  end if;
  if cardinality(v_iba_odber) > 0 then
    raise exception 'KH_ODBER' using detail = array_to_string(array(select distinct unnest(v_iba_odber)), ',');
  end if;

  v_hash := encode(sha256(convert_to(p_podmienky, 'UTF8')), 'hex');
  insert into public.podmienky_verzie (hash, text) values (v_hash, p_podmienky) on conflict (hash) do nothing;

  insert into public.objednavky (
    stav, jazyk, meno, email, telefon, doprava, ulica, mesto, psc, krajina,
    doprava_cena, medzisucet, spolu, vop_verzia, rezervovane_do
  )
  values (
    case when v_dorucenie then 'caka_na_cenu_dopravy' else 'caka_na_platbu' end,
    p_jazyk, v_meno, v_email, v_telefon, p_doprava,
    case when v_dorucenie then v_ulica end,
    case when v_dorucenie then v_mesto end,
    case when v_dorucenie then substr(v_psc, 1, 3) || ' ' || substr(v_psc, 4) end,
    case when v_dorucenie then v_krajina end,
    0, v_medzisucet, v_medzisucet, v_hash,
    now() + case when v_dorucenie then rezervacia_ziadosti else rezervacia end
  )
  returning * into v_objednavka;

  insert into public.objednavky_polozky (objednavka_id, produkt_id, kod, nazov, variant, cena_za_kus, pocet)
  select v_objednavka.id, t.produkt_id, t.kod, t.nazov, t.variant, t.cena_za_kus, t.pocet
  from jsonb_to_recordset(v_riadky)
    as t(produkt_id uuid, kod text, nazov text, variant text, cena_za_kus numeric, pocet integer);

  update public.produkty p
  set pocet_kusov = p.pocet_kusov - t.pocet, vypredane = p.vypredane or p.pocet_kusov - t.pocet = 0
  from (
    select (x->>'produkt_id')::uuid as produkt_id, sum((x->>'pocet')::integer)::integer as pocet
    from jsonb_array_elements(v_riadky) x
    group by 1
  ) t
  where p.id = t.produkt_id and p.pocet_kusov is not null;

  return jsonb_build_object(
    'cislo', v_objednavka.cislo,
    'stav', v_objednavka.stav,
    'spolu', v_objednavka.spolu,
    'rezervovane_do', v_objednavka.rezervovane_do,
    'polozky', v_riadky
  );
end;
$$;

-- /admin → Objednávky → "Poslať ponuku": Helena sets the delivery price and method of a delivery
-- request. Sending again changes the offer and keeps the link. The offer is valid 3 days.
create or replace function public.posli_ponuku(p_id uuid, p_cena numeric, p_sposob text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_token uuid;
begin
  if not public.je_admin() then
    raise exception 'Iba admin posiela ponuky.' using errcode = 'insufficient_privilege';
  end if;
  if p_cena is null or p_cena < 0 or p_cena > 10000 or length(btrim(coalesce(p_sposob, ''))) not between 2 and 200 then
    raise exception 'Zadajte cenu dopravy a spôsob doručenia.' using errcode = 'check_violation';
  end if;

  update public.objednavky
  set doprava_cena = round(p_cena, 2),
      spolu = medzisucet + round(p_cena, 2),
      doprava_sposob = btrim(p_sposob),
      ponuka_token = coalesce(ponuka_token, gen_random_uuid()),
      stav = 'ponuka_odoslana',
      rezervovane_do = now() + interval '3 days'
  where id = p_id and doprava = 'dorucenie' and stav in ('caka_na_cenu_dopravy', 'ponuka_odoslana')
  returning ponuka_token into v_token;

  if v_token is null then
    raise exception 'Ponuku možno poslať iba pri žiadosti o doručenie, ktorá ešte čaká.' using errcode = 'check_violation';
  end if;
  return v_token;
end;
$$;

-- The offer page /objednavka/<token> (server only): what the customer is asked to confirm
create or replace function public.nacitaj_ponuku(p_token uuid)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'cislo', o.cislo,
    'stav', o.stav,
    'jazyk', o.jazyk,
    'meno', o.meno,
    'ulica', o.ulica,
    'mesto', o.mesto,
    'psc', o.psc,
    'doprava_sposob', o.doprava_sposob,
    'doprava_cena', o.doprava_cena,
    'medzisucet', o.medzisucet,
    'spolu', o.spolu,
    'rezervovane_do', o.rezervovane_do,
    'polozky', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'kod', p.kod, 'nazov', p.nazov, 'variant', p.variant, 'cena_za_kus', p.cena_za_kus, 'pocet', p.pocet
      ) order by p.id), '[]'::jsonb)
      from public.objednavky_polozky p
      where p.objednavka_id = o.id
    )
  )
  from public.objednavky o
  where o.ponuka_token = p_token;
$$;

-- The customer confirms the offer with the terms shown on the offer page. From here on it is a
-- binding order waiting 30 minutes for payment, like a pickup order.
create or replace function public.potvrd_ponuku(p_token uuid, p_podmienky text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_hash text;
  v_objednavka public.objednavky;
begin
  if length(coalesce(p_podmienky, '')) < 100 then
    raise exception 'KH_UDAJE';
  end if;

  perform public.zrus_expirovane_objednavky();

  v_hash := encode(sha256(convert_to(p_podmienky, 'UTF8')), 'hex');
  insert into public.podmienky_verzie (hash, text) values (v_hash, p_podmienky) on conflict (hash) do nothing;

  update public.objednavky
  set stav = 'caka_na_platbu', vop_verzia = v_hash, rezervovane_do = now() + interval '30 minutes'
  where ponuka_token = p_token and stav = 'ponuka_odoslana'
  returning * into v_objednavka;

  -- null = no valid offer (expired, cancelled or already confirmed). Not an exception, so the
  -- cancellation of expired reservations above is kept.
  if v_objednavka.id is null then
    return null;
  end if;
  return jsonb_build_object(
    'cislo', v_objednavka.cislo,
    'spolu', v_objednavka.spolu,
    'rezervovane_do', v_objednavka.rezervovane_do
  );
end;
$$;

-- Supabase Cron (pg_cron): cancel expired reservations every 5 minutes. Skipped where the
-- extension is not available (local test databases); the checkout then still cancels them.
do $$
begin
  if exists (select 1 from pg_available_extensions where name = 'pg_cron') then
    create extension if not exists pg_cron with schema pg_catalog;
    perform cron.schedule('zrus-expirovane-objednavky', '*/5 * * * *', 'select public.zrus_expirovane_objednavky()');
  end if;
end $$;

-- ------------------------------------------------------------------------------------- Row level security

-- Visitors (anon) may read texts, products and prices; only an admin (public.admini) may write
-- them and see orders. The service role key (scripts only, never in the browser) bypasses RLS.
-- Tables without policies (keep_alive, admini, objednavky_cisla) are closed to the API.
alter table public.content enable row level security;
alter table public.produkty enable row level security;
alter table public.produkty_ceny enable row level security;
alter table public.keep_alive enable row level security;
alter table public.admini enable row level security;
alter table public.objednavky_cisla enable row level security;
alter table public.objednavky enable row level security;
alter table public.objednavky_polozky enable row level security;
alter table public.objednavky_stavy enable row level security;
alter table public.podmienky_verzie enable row level security;

drop policy if exists "content: anyone can read" on public.content;
create policy "content: anyone can read" on public.content
  for select to anon, authenticated using (true);

drop policy if exists "content: admin can insert" on public.content;
create policy "content: admin can insert" on public.content
  for insert to authenticated with check ((select public.je_admin()));

drop policy if exists "content: admin can update" on public.content;
create policy "content: admin can update" on public.content
  for update to authenticated using ((select public.je_admin())) with check ((select public.je_admin()));

drop policy if exists "produkty: anyone can read" on public.produkty;
create policy "produkty: anyone can read" on public.produkty
  for select to anon, authenticated using (true);

drop policy if exists "produkty: admin can insert" on public.produkty;
create policy "produkty: admin can insert" on public.produkty
  for insert to authenticated with check ((select public.je_admin()));

drop policy if exists "produkty: admin can update" on public.produkty;
create policy "produkty: admin can update" on public.produkty
  for update to authenticated using ((select public.je_admin())) with check ((select public.je_admin()));

-- Products can be deleted in /admin while no order uses them; texts cannot (clearing a text is an update)
drop policy if exists "produkty: admin can delete" on public.produkty;
create policy "produkty: admin can delete" on public.produkty
  for delete to authenticated using ((select public.je_admin()));

drop policy if exists "produkty_ceny: anyone can read" on public.produkty_ceny;
create policy "produkty_ceny: anyone can read" on public.produkty_ceny
  for select to anon, authenticated using (true);

drop policy if exists "objednavky: admin can read" on public.objednavky;
create policy "objednavky: admin can read" on public.objednavky
  for select to authenticated using ((select public.je_admin()));

drop policy if exists "objednavky: admin can update" on public.objednavky;
create policy "objednavky: admin can update" on public.objednavky
  for update to authenticated using ((select public.je_admin())) with check ((select public.je_admin()));

drop policy if exists "objednavky_polozky: admin can read" on public.objednavky_polozky;
create policy "objednavky_polozky: admin can read" on public.objednavky_polozky
  for select to authenticated using ((select public.je_admin()));

drop policy if exists "objednavky_stavy: admin can read" on public.objednavky_stavy;
create policy "objednavky_stavy: admin can read" on public.objednavky_stavy
  for select to authenticated using ((select public.je_admin()));

drop policy if exists "podmienky_verzie: admin can read" on public.podmienky_verzie;
create policy "podmienky_verzie: admin can read" on public.podmienky_verzie
  for select to authenticated using ((select public.je_admin()));

-- ------------------------------------------------------------------------------------- Privileges

-- Newer Supabase projects no longer grant table privileges to the API roles by default, which
-- fails with "permission denied for table ...". Older ones grant everything; the revokes make
-- both behave the same. RLS above still decides which rows a role sees.
grant usage on schema public to anon, authenticated, service_role;

revoke all on public.content, public.produkty, public.produkty_ceny, public.keep_alive, public.admini,
  public.objednavky_cisla, public.objednavky, public.objednavky_polozky, public.objednavky_stavy,
  public.podmienky_verzie
  from anon, authenticated;

grant select on public.content, public.produkty, public.produkty_ceny to anon, authenticated;
grant insert, update on public.content to authenticated;
grant insert, update, delete on public.produkty to authenticated;
grant usage on sequence public.produkty_kod_seq to authenticated;
-- Admin changes only the state and the internal note; everything else in an order stays as sold
grant select on public.objednavky, public.objednavky_polozky, public.objednavky_stavy, public.podmienky_verzie to authenticated;
grant update (stav, interna_poznamka) on public.objednavky to authenticated;

grant all on all tables in schema public to service_role;
grant usage, select on all sequences in schema public to service_role;

-- Functions: je_admin is used by the admin and the policies; the rest only by the database itself
revoke execute on function public.je_admin(), public.dalsie_cislo_objednavky(), public.produkty_nemenne_polia(),
  public.produkty_zapis_cenu(), public.objednavky_zapis_stav(), public.objednavky_updated_at(),
  public.objednavky_kontrola_stavu(), public.objednavky_vrat_kusy(), public.zrus_expirovane_objednavky(),
  public.vytvor_objednavku(text, text, text, text, text, jsonb, jsonb, text),
  public.posli_ponuku(uuid, numeric, text), public.nacitaj_ponuku(uuid), public.potvrd_ponuku(uuid, text)
  from public, anon, authenticated;
grant execute on function public.je_admin() to authenticated;
-- Column default of objednavky.cislo, evaluated with the rights of whoever inserts the order
grant execute on function public.dalsie_cislo_objednavky() to service_role;
-- The checkout on the server (lib/objednavka-akcia.ts)
grant execute on function public.vytvor_objednavku(text, text, text, text, text, jsonb, jsonb, text),
  public.zrus_expirovane_objednavky(), public.nacitaj_ponuku(uuid), public.potvrd_ponuku(uuid, text) to service_role;
-- /admin (checks je_admin inside)
grant execute on function public.posli_ponuku(uuid, numeric, text) to authenticated;
