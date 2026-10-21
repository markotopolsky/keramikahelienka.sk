# Záznamník – redesign keramikahelienka.sk

Pracovný záznamník projektu. Obsahuje denník práce a úplný súpis dát z pôvodného webu.
Pôvodný web je **zdroj pravdy** pre všetky údaje (ceny, kontakty, texty, produkty).
Nič si nevymýšľame – ak údaj chýba alebo je sporný, patrí do sekcie *Otázky pre Helenku*.

Súvisiace súbory:

- `docs/povodny-web/produkty.json` – všetkých 48 produktov (ceny, sklad, popisy, URL fotiek)
- `docs/povodny-web/Cennik_26_kurzy.jpg`, `Cennik_26_deti.jpg` – originálne cenníky kurzov
- `docs/povodny-web/logo-povodne.png` – pôvodné logo (419 × 197 px)

---

## 1. Denník

### 2026-09-28
- Založený záznamník.
- Prejdený celý pôvodný web (všetky stránky, blog, 48 produktov, EN verzia, doprava, platby, prepojené Google formuláre).
- Uložené dáta do `docs/povodny-web/`.
- Nový projekt: Next.js 16.3.6, React 19.2.8, Tailwind 4 (zatiaľ čistá šablóna).
- Poznámka: web je za firewallom (WAF). Obyčajný `curl` dostane „Access Denied“. Treba poslať hlavičky prehliadača (User-Agent, Accept, Accept-Language, Sec-Fetch-*).
- Prototyp domovskej stránky je responzívny: telefón od 320 px, tablet, notebook aj desktop. Na telefóne a tablete (do 1024 px) je navigácia v menu cez celú obrazovku. Mobilné rozloženie vychádza zo šablóny SkillClass: karty kurzov sa ukladajú na seba aj na mobile, recenzie sa posúvajú do strany, pätička má veľké logo cez celú šírku.

### 2026-10-21
- **Rozhodnutie:** CMS nebude Payload. Je to jednoduchý CMS zo Supabase a Cloudinary, rovnaký ako v projekte franek-skola-sportu. Postup je v README, časť „Editovateľný obsah“.
  - `/admin` má prihlásenie cez Supabase Auth. Záložka „Texty a fotky“ obsahuje 24 sekcií, každý text po slovensky aj anglicky. Záložka „Produkty“ umožňuje pridať, upraviť, skryť a vymazať produkt, upraviť varianty a kategórie, nahrať fotky a zvoliť „na domovskej“.
  - Defaulty sú v `lib/content-defaults.ts`. Produkty z pôvodného webu sú v `lib/produkty-zaklad.ts`. Bez databázy web ukazuje tieto defaulty.
  - Kľúče zatiaľ nie sú zadané. Bez nich web beží z defaultov a `/admin` ukáže, čo chýba. Bez `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` idú fotky z `public/images` bez optimalizácie.
  - Zrušené súbory: `content/kurzy.ts` a `content/o-mne.ts`. Recenzie a pás fotiek v pätičke sú v CMS. Právne texty v `content/pravne.ts` ostávajú ako default; v CMS je každá stránka jeden text, „## nadpis“ začína očíslovanú časť.
- Overené: `tsc`, `eslint`, `next build`, všetky stránky SK aj EN vracajú 200. Neprihlásený `POST /api/revalidate` vracia 401. `npm run seed:content -- --dry-run` vypíše 474 kľúčov, `seed:produkty` 48 produktov. Uloženie v admine zatiaľ nie je otestované, chýba Supabase projekt.
- Supabase projekt založený, región Írsko (`eu-west-1`, v EÚ). Nové projekty nedávajú API rolám práva na tabuľky, preto `supabase/schema.sql` obsahuje `grant` príkazy.
- **E-shop, krok 1 z 5 – databáza** (`supabase/schema.sql`, dá sa spustiť znova, starú databázu upraví bez straty dát):
  - Produkt má interné `id` a kód `KH-0001`. Kód pridelí databáza, nikdy sa nemení. Pôvodné produkty dostali kódy od najstaršieho. Kód, `id` ani adresu (`slug`) nemožno zmeniť, stráži to databáza.
  - História cien `produkty_ceny` sa zapisuje sama pri každej zmene ceny alebo variantov. Je potrebná na zľavy (najnižšia cena za 30 dní pred zľavou).
  - Objednávky: `objednavky` (číslo `2026-0001` podľa roka, bez medzier, stav, zákazník, doprava, sumy, verzia obchodných podmienok), `objednavky_polozky` (kópia kódu, názvu, variantu a ceny v čase nákupu), `objednavky_stavy` (kto a kedy zmenil stav). Zapisuje ich iba server, admin mení iba stav a internú poznámku. Uchovávajú sa 10 rokov (zákon č. 431/2002 Z. z., § 35).
  - Admini sú v tabuľke `admini`, prihlásenie samo nestačí. Platí to pre zápis textov a produktov, objednávky aj `/api/revalidate`. Produkt v objednávke sa nedá vymazať, admin ponúkne skrytie.
- Overené na lokálnom Postgres 17: migrácia starej schémy (dvakrát po sebe), čistá inštalácia, kódy, história cien, číslovanie objednávok, práva návštevníka, cudzieho prihláseného účtu a admina. `tsc` a `eslint` bez chýb.
- Schéma spustená v Supabase: 48 produktov má kódy KH-0001 (najstarší) až KH-0048, história cien 48 záznamov, registrácia vypnutá, prvý admin pridaný do `admini`.
- **E-shop, krok 2 z 5 – admin:**
  - Záložka „Objednávky“ (`app/admin/objednavky-panel.tsx`): zoznam s hľadaním (číslo, meno, e-mail, kód produktu) a filtrom stavu, detail so zákazníkom, položkami, sumami, verziou obchodných podmienok, zmenou stavu, internou poznámkou a históriou stavov.
  - Pri produkte kód v zozname, v hľadaní a v editore (iba na čítanie). Na stránke produktu riadok „Kód“ a `sku` v štruktúrovaných dátach.
  - Spoločné triedy admina sú v `app/admin/styly.ts`.
- Overené: `tsc`, `eslint`, `next build`. Stránka produktu ukazuje KH-0001 z databázy. `/api/revalidate` bez tokenu aj s anon kľúčom vracia 401. Prihlásený admin ešte nie je otestovaný v prehliadači.
- **Rozhodnutie:** platba bude iba cez Comgate, bez prevodu na účet. Platby sa zatiaľ nerobia.
- **Fotky v Cloudinary:** všetkých 177 fotiek z `public/images` je nahraných (`keramikahelienka/...`) a každá vracia 200. V `.env.local` je cloud name a upload preset `keramikahelienka_unsigned`, priečinky pre admin sú vytvorené. Stránky už berú fotky z Cloudinary (`f_auto`, `q_auto`).
- Zásady ochrany osobných údajov (SK aj EN): doplnení sprostredkovatelia Supabase, Inc. (databáza, servery v EÚ – Írsko) a Cloudinary Ltd. (fotky). Pri oboch je poznámka na kontrolu prenosu pre právnika.
- **E-shop, krok 3 z 5 – pokladňa na serveri:**
  - `lib/objednavka-akcia.ts` (Server Action) overí vstup a zavolá DB funkciu `vytvor_objednavku` so service role kľúčom (`lib/supabase-admin.ts`, `server-only`). Návštevník ani admin ju volať nemôžu.
  - Databáza vezme ceny, názvy a sklad z produktov, nie z prehliadača. Zamkne objednané kusy, takže dvaja zákazníci nekúpia ten istý kus. Kus s počtom 0 sa označí ako vypredaný.
  - Kusy sa podržia 30 minút (`rezervovane_do`). Nezaplatenú objednávku potom zruší `zrus_expirovane_objednavky` (Supabase Cron každých 5 minút a pred každou novou objednávkou) a kusy vráti na sklad. Zrušená objednávka sa nedá obnoviť. Platba Comgate musí vypršať v rovnakom čase.
  - Znenie obchodných podmienok a reklamačného poriadku v čase nákupu sa uloží raz za verziu (`podmienky_verzie`). Admin ho vidí pri objednávke.
  - Ochrana: najviac 3 nezaplatené objednávky z jedného e-mailu za hodinu, skryté pole proti robotom.
  - Tlačidlo „Objednať s povinnosťou platby“. Pri vypredanom kuse pokladňa povie, ktorý to je, a odstráni ho z košíka.
  - Admin: rezervácia pri objednávke, „Zrušená“ je konečná a obnoví obchod.
  - `SUPABASE_SERVICE_ROLE_KEY` musí byť aj na hostingu ako serverová premenná (README).
- **Presmerovania 301** zo starých adries WordPressu (`next.config.ts`), SK aj `/en`: `/o_nas`, `/kurzy-keramiky`, `/produkt/<slug>`, kategórie, značky, 2 články blogu, stránky mimo menu, WooCommerce stránky.
- **Rozhodnutie – doprava na cenovú ponuku** (Helenka chce dopravu riešiť individuálne):
  - V pokladni: „Osobný odber v ateliéri – zadarmo“ (objednávka a platba hneď) alebo „Doručenie na Slovensko – cenu dopravy vám pošleme“ (nezáväzná žiadosť s adresou, bez platby).
  - Žiadosť drží kusy 3 dni (stav „čaká na cenu dopravy“). Helenka v admine zadá cenu a spôsob a klikne „Poslať ponuku“. Ponuka platí 3 dni.
  - Zákazník na súkromnom odkaze `/objednavka/<token>` vidí tovar, adresu a celkovú sumu s dopravou. Potvrdí súhlas s obchodnými podmienkami a tlačidlo „Objednať s povinnosťou platby“. Až vtedy je objednávka záväzná a čaká 30 minút na platbu (Comgate neskôr).
  - Nepotvrdená žiadosť alebo ponuka sa po lehote sama zruší a kusy sa vrátia do obchodu.
  - Kus s „Iba osobný odber“ (prepínač v admine) doručenie vypne.
  - Kým nie sú e-maily (krok 4), admin ukáže odkaz na ponuku na skopírovanie a Helenka ho pošle sama.
  - Pre právnika: pri doručení vzniká zmluva až potvrdením ponuky. Treba to opísať v obchodných podmienkach, miesto je `[[ďalšie spôsoby dopravy…]]`.
  - Kód: `supabase/schema.sql` (`posli_ponuku`, `nacitaj_ponuku`, `potvrd_ponuku`), `lib/objednavka-akcia.ts`, `lib/ponuka.ts`, `app/[lang]/objednavka/[token]/page.tsx`, `components/obchod/ponuka-form.tsx`, `app/admin/objednavky-panel.tsx`.
  - Overené na lokálnom Postgres 17: žiadosť, kus iba na odber, zlá adresa a zahraničie, admin nesmie stavy ponuky nastaviť ručne, cudzí účet nepošle ponuku, zmena ponuky, potvrdenie, druhé potvrdenie, vypršaná ponuka vráti kus. `tsc`, `eslint`, `next build` bez chýb. Na skutočnej databáze: žiadosť 2026-0002 s adresou, `posli_ponuku` bez admina zamietnuté, stránka ponuky ukázala sumu s dopravou, adresu a `noindex`, neznámy odkaz vrátil 404, po potvrdení stránka ukázala „Objednávka je potvrdená“. Testovacia objednávka zmazaná, číslovanie vrátené na 1. Tlačidlo „Poslať ponuku“ v admine ešte nie je otestované v prehliadači.
- **Kurzy sa platia vopred:** doplnené na domovskej stránke (blok kurzov), v cenníku na `/kurzy`, pri prihláške na kurz a na podstránkach mesačného kurzu, workshopu, voľného ateliéru a kurzu pre deti. Pravidlo zo starého webu: najneskôr 7 dní pred termínom, miesto je rezervované až dňom úhrady.
- **Vyskakovacie okno (popup)** – `/admin` → Texty a fotky → Celý web → „Vyskakovacie okno“: prepínač zobraziť, verzia, nadpis, text s formátovaním, nepovinné tlačidlo s odkazom a fotka (nahrá sa do Cloudinary, priečinok `keramikahelienka/popup`), SK aj EN. Predvolene vypnuté.
  - Správanie (`components/popup.tsx`): ukáže sa 4 sekundy po načítaní stránky, každá verzia raz na návštevníka. Zmena verzie ho ukáže znova. Zatvára sa krížikom „Zavrieť“, klávesom Esc, klikom vedľa okna aj tlačidlom. Neukáže sa v košíku, pokladni ani na stránke ponuky a čaká, kým návštevník odpovie na cookie lištu.
  - Overené: `tsc`, `eslint`, `next build`. S testovacími textmi v databáze sa okno vykreslilo na `/`, `/en` aj `/obchod` s fotkou z Cloudinary a tučným textom. Testovacie texty zmazané. V prehliadači otvorenie a zatvorenie ešte nie je otestované.
- **Rozhodnutie – Helenka vidí objednávku až po zaplatení.** Objednávka vzniká v databáze pred platbou (rezervácia kusu, `refId` pre Comgate), admin → Objednávky má zoznam „Na vybavenie“ (zaplatené a žiadosti o doručenie, bez nezaplatených). Predvolene sa ukazujú všetky objednávky (zmena na želanie 21. 10. 2026). Ďalšie zoznamy: Žiadosti o doručenie, Vybavené a odstúpené, Nezaplatené a zrušené. Hľadanie prehľadá všetky. Pri Comgate: notifikácia PAID → server overí stav platby v Comgate → „zaplatená“ → e-mail Helenke „Nová zaplatená objednávka“. Nezaplatená sa po 30 minútach sama zruší.
- Overené: DB na lokálnom Postgres 17 (objednávka, vypredanie, súbeh dvoch zákazníkov na jeden kus, vypršanie, vrátenie kusov, limit, práva). `tsc`, `eslint`, `next build` bez chýb. 17 starých adries vedie na správne nové stránky, nové stránky vracajú 200. Nová `supabase/schema.sql` spustená v Supabase. Test na skutočnej databáze: objednávka 2026-0001 (KH-0001) zamkla kus, druhá na ten istý kus vrátila „nedostupné“, anon volanie zamietnuté, vypršaná rezervácia zrušila objednávku a vrátila kus. Testovacia objednávka, znenie podmienok a číslovanie sú zmazané, prvá skutočná objednávka bude 2026-0001. Pokladňa v prehliadači ešte nie je otestovaná.
- **Podstránky kurzov** `/kurzy/mesacny-kurz`, `/kurzy/workshop`, `/kurzy/volny-atelier`, `/kurzy/deti-a-rodicia` (SK aj `/en`), jedna šablóna `app/[lang]/kurzy/[slug]/page.tsx`:
  - Sekcie: úvod, „Čo vás čaká“ s faktami (cena a rozsah z karty kurzu), priebeh v 4 krokoch, galéria (6 miest na fotky), časté otázky, ďalšie kurzy a formulár s vopred vybraným kurzom. Mesačný kurz a Deti a rodičia majú aj celý cenník.
  - Texty a fotky každej podstránky sú v admine („Podstránka …“ v skupine Kurzy a firmy). Názov, cenu, rozsah a úvodnú fotku berie z karty kurzu. Adresy sú v `content/atelier.ts` (`kurzyStranky`).
  - Karty kurzov na `/` a `/kurzy` majú tlačidlo „Viac o kurze“, celá karta je odkaz.
  - `/pre-firmy` má navyše priebeh od dopytu po výpal, galériu a časté otázky.
  - 9 nových fotiek z ateliéru (Helenka, október 2026) v `public/images/kurzy/`, zmenšené na 1800 px, bez metadát, aj na Cloudinary. Sú na kartách kurzov, v úvode `/pre-firmy` a v galériách. Fotky detí zatiaľ nie sú.
  - Texty sú iba z faktov v sekciách 5 a 6. Čo nevieme, je skryté („xxx“, doplní Helenka v admine) alebo viditeľné „doplniť“: čo je v cene voľného ateliéru a kedy sa dá prísť, od koľkých rokov môže prísť dieťa, pri teambuildingu počet ľudí, dĺžka a odovzdanie výrobkov.
  - Stará adresa `/workshopy` vedie na `/kurzy/workshop`.
  - Pôvodný web (overené 21. 10.): `/kurzy-keramiky/` má iba odkaz na Google formulár a vetu o teambuildingu, `/workshopy/` je prázdna. Nový obsah tam nie je.
- Overené: `tsc`, `eslint`, `next build` (8 nových stránok), neznámy kurz vracia 404, v konzole prehliadača bez chýb, mobil 390 px aj desktop 1440 px.
- **Favicon** z loga mory (tyrkysová `#359594`): `app/favicon.ico` (16, 32, 48 px, malé veľkosti majú hrubšie čiary), `app/icon.png` (512 px, priehľadné), `app/apple-icon.png` (180 px na pozadí stránky).
- **Pozadie stránky** zmenené z béžovej `#f3eadb` (pôsobila príliš pieskovo) na teplú šedobéžovú `#f5f1ec` (vybraná zo 4 návrhov; porcelánovo biela `#f8f6f2` bola málo teplá, krémová `#faf3ea` stále pieskovitá). Token sa stále volá `--color-sand`. Kontrast nadpisov `deep` 5,1:1, sekundárneho textu `drift` 4,9:1.

### 2026-10-20
- **Rozhodnutie:** vývojár na požiadavku doplnil návrhy právnych textov sám (mení to sekciu 14). Sú napísané podľa platných zákonov zo slov-lex.sk (znenie od 27. 9. 2026), nie skopírované z iného e-shopu: zákon č. 108/2024 Z. z. (odstúpenie § 19 – § 22, online funkcia § 20a, vzorový formulár z prílohy č. 2), Občiansky zákonník § 619 – § 624 (vady tovaru), zákon č. 391/2015 Z. z. (riešenie sporov), GDPR a zákon č. 18/2018 Z. z., zákon č. 452/2021 Z. z. § 109 ods. 8 (cookies). Texty sú v `content/pravne.ts`. Pruh hore na stránkach hovorí „Návrh podľa platných zákonov – pred spustením ho skontroluje právnik“. Stránky ostávajú `noindex`.
  - Žlté „doplniť“ ostáva iba pri firemných údajoch a rozhodnutiach Helenky: kto platí poštovné pri vrátení, dodacia lehota, platnosť poukážok, ďalšie spôsoby platby, doby uchovávania, hosting a ďalší sprostredkovatelia.
  - Kurzy na presný termín nemajú právo na odstúpenie do 14 dní (§ 19 ods. 1 písm. l) zákona č. 108/2024 Z. z.). Platia storno podmienky ateliéru.
  - Platforma EÚ na riešenie sporov online (ODR) skončila 20. 7. 2025, preto na ňu texty neodkazujú.
- **Nová povinnosť (pred spustením e-shopu):** § 20a zákona č. 108/2024 Z. z. vyžaduje na webe funkciu „odstúpiť od zmluvy tu“. Zákazník v nej vyplní meno, číslo objednávky a e-mail, potvrdí tlačidlom „potvrdiť odstúpenie od zmluvy“ a hneď dostane potvrdenie e-mailom s obsahom, dátumom a časom. Potrebuje odosielanie e-mailov (fáza 0). Pridané do fázy 6.
- Analytika a súhlas s cookies (`lib/analytika.ts`, `components/cookie-lista.tsx`):
  - Google Tag Manager, Google Analytics 4 a Microsoft Clarity. ID sa zadávajú v env premenných (`.env.example`). Bez nich web nemá analytiku, cookie lištu ani odkaz „Nastavenia cookies“.
  - Nič od Google ani Microsoftu sa nenačíta pred súhlasom. Google Consent Mode v2 je predvolene všade „denied“. Clarity dostane signál `consentv2`.
  - Lišta: „Prijať všetko“ a „Odmietnuť“ sú rovnako výrazné, „Nastavenia“ ukáže kategórie. Marketingová kategória sa ukáže iba so zapnutým GTM. Voľba je v localStorage `kh-suhlas-cookies`. Odkaz „Nastavenia cookies“ v pätičke lištu otvorí znova. Po odvolaní súhlasu sa analytické cookies zmažú a stránka sa znova načíta.
  - GA4 ide priamo z kódu. V GTM ho **nepridávať**, inak sa každá návšteva započíta dvakrát. Každá značka v GTM musí rešpektovať Consent Mode.
- SEO: `app/sitemap.ts` (všetky stránky v oboch jazykoch s hreflang, bez košíka, pokladne a právnych návrhov), `app/robots.ts` (zakáže `/kosik` a `/pokladna`), Open Graph na každej stránke (portrét Helenky 1200 × 630 z Cloudinary, pri produkte a článku jeho fotka), štruktúrované dáta: ateliér ako `Store` na domovskej stránke a `Product` s cenou a dostupnosťou pri každom produkte. Overenie v Google Search Console cez env `GOOGLE_SITE_VERIFICATION`.
- Overené: `tsc`, `eslint` a `next build` s testovacími ID bez chýb. `robots.txt`, `sitemap.xml` (114 adries), meta značky, predvolený consent a JSON-LD skontrolované cez curl. Cookie lišta ešte nie je otestovaná v prehliadači.

### 2026-10-10
- Zapísané poznámky zo stretnutia s Helenkou do sekcie 12. Nejasné body sú ako otázky 14 – 20 v sekcii 11.
- Zistené: prototyp je v rozpore s dvomi požiadavkami. Domovská stránka ukazuje kurzy pred dielami. Nadpisy sú v pätkovom písme Instrument Serif.
- **Rozhodnutie:** celý web je v Next.js, bez WordPressu a bez Stripe. Platby cez Comgate. Plán je v sekcii 13. (Zvažovaný bol aj WooCommerce na pozadí. Zamietnutý, lebo by ostal WordPress a WooPayments beží na Stripe.)
- Rozdelenie práce medzi vývojára a Helenku je v sekcii 14. Vývojár robí iba web a napojenie Comgate. Právne texty, zmluvy a účtovníctvo nie sú jeho práca.
- Plán práce po fázach (všetko okrem platobnej brány) je v sekcii 15.
- Hotové body 1 – 3 z časti „Najprv vzhľad“ (sekcia 15):
  - Domovská stránka ukazuje diela pred kurzami. Nadpisy sú v bezpätkovom Open Sans (dočasne, kým nevieme odpoveď na otázku 16). Instrument Serif je preč.
  - Nové stránky `/kurzy`, `/o-mne` a `/kontakt`. Texty a ceny sú zo sekcií 5 a 6.
  - Hlavička a pätička sú teraz v `app/layout.tsx`, nie na každej stránke zvlášť.
  - Kontaktný formulár je iba vzhľad, nič neodosiela. Mapa Google sa načíta až po kliknutí na „Zobraziť mapu“.
  - Prihláška na kurz stále vedie na Google formulár Helenky (sekcia 6).
  - `public/images/helena/helena-kvety.jpg` je `helena-portret.jpg` bez bielych okrajov.
- `/kurzy` zjednodušené na 3 sekcie: úvod, karty kurzov (tie isté ako na domovskej stránke) a cenník s prihláškou. Postup výroby, dlhý popis kurzu a samostatný blok o teambuildingu sú preč.
- Rýchlosť: úvod stránky a hlavička sa animujú cez CSS, nečakajú na JavaScript. Hlavička je celá viditeľná za ~0,8 s namiesto ~1,2 s (merané lokálne). Pri zapnutom „obmedziť pohyb“ sa obsah ukáže hneď. Vývojový režim (`next dev`) je pomalší ako ostrý web: posiela ~950 KB JavaScriptu, ostrý build ~195 KB.
- Domovská stránka, sekcia „O mne“: nové rozloženie podľa muoiatelier.com/en/o-nas. Fotka vľavo, vpravo nadpis „Moja cesta s hlinou“, krátky príbeh (vety z „O nás“) a podpis. Plávajúce fotky a citát sú preč.
- Domovská stránka: galéria diel má vždy 3 stĺpce na každej obrazovke, ukazuje všetky diela (teraz 12, teda 4 rady). Sekcia „Z hliny, rukami, bez kruhu.“ má namiesto dvoch odsekov 3 hodnoty s ikonkami (inšpirácia: muoiatelier.com). Texty hodnôt sú poskladané z Helenkiných viet v sekciách 5.1 a 5.3, mierne skrátené – dať Helenke na schválenie.
- Body 4 – 9 sa robia vo vetve `feat/body-4-9` (oddelený git worktree), lebo v hlavnom priečinku súčasne pracovala iná session na `/kurzy`.
- Hotový bod 4 – anglická verzia:
  - Slovenčina je na `/kurzy`, angličtina na `/en/kurzy`. Adresy stránok ostávajú slovenské aj v angličtine (ako na starom webe).
  - Všetky stránky sú v `app/[lang]/`. Súbor `proxy.ts` slovenské adresy vnútorne presmeruje na `/sk/...`. Kto napíše `/sk/kurzy`, presmeruje ho na `/kurzy`.
  - Každý text je v kóde ako dvojica `{ sk, en }`. Bez anglického textu sa stránka neskompiluje. Preklad spravila AI raz a je uložený v súboroch (`content/*.ts` a texty priamo v komponentoch).
  - Prepínač SK / EN je v hlavičke (na mobile v menu) a v pätičke. Prepne na tú istú stránku v druhom jazyku.
  - Každá stránka má `hreflang` odkazy na druhú jazykovú verziu a `canonical`.
  - Recenzie sú v angličtine preložené, s poznámkou „Translated from Slovak“.
  - Google formulár prihlášky na kurz je iba po slovensky. Anglický text to spomína.
  - Slogan „Krása a úžitok“ je v angličtine „Beauty and purpose“. Anglické texty treba dať prečítať Helenke (otázka 21).
- Hotový bod 5 – obchod:
  - Stiahnutých všetkých 128 fotiek produktov do `public/images/produkty/` (`<slug>-<poradie>.jpg`). Zmenšené na najviac 1400 px na dlhšej strane, spolu 30 MB.
  - `/obchod` číta produkty z `docs/povodny-web/produkty.json` cez `lib/produkty.ts`. Ceny, sklad a fotky sú z neho. Pôvodný súbor sa nemení.
  - Názvy a popisy v oboch jazykoch sú v `content/produkty.ts` (otázka 7). Preklepy a chyby zo sekcie 10 sa neprenášajú: popis Misy Mušľa hovorí „misa“, nie „lampa“; „124)°C“ je 1240 °C; vázy Shell big / middle sú vo Vázach, nie v Misách.
  - Slugy ostávajú pôvodné (aj chybné `2267` a prehodené náramky), aby fungovali staré adresy. Opraví ich fáza 3 spolu s presmerovaniami.
  - Filter podľa kategórie (s počtom kusov) a triedenie: najnovšie, cena od najnižšej, cena od najvyššej. Výber sa uloží do adresy (`/obchod?kategoria=vazy&zoradenie=cena-vzostupne`), dá sa poslať ďalej.
  - Vypredané kusy sú na konci v časti „Vypredané“, zosivené.
  - Detail `/obchod/[slug]`: galéria fotiek, cena, sklad, varianty šálok (s vrchnákom / bez), popis, osobný odber zadarmo, ďalšie kúsky. „Pridať do košíka“ je iba vzhľad.
  - Na detaile svieti `[doplniť: cena s DPH alebo bez DPH – otázka 1]` a `[doplniť: spôsoby a ceny dopravy – otázka 2]`.
  - Diela na domovskej stránke vedú na svoj detail v obchode.
- Hotový bod 6 – info lišta:
  - Tyrkysová lišta nad menu na každej stránke. Text a odkaz sú v `content/info-lista.ts`. Kým Helenka nedodá oznam, svieti `[doplniť: aktuálny oznam od Helenky – zľava, zľavový kód alebo výstava]`.
  - Odkaz „Prihláste sa na Listy z ateliéru“ vedie na odber v pätičke (newsletter je zatiaľ atrapa, otázka 8).
  - Lištu sa dá zavrieť krížikom. Prehliadač si to zapamätá. Pri novom ozname treba zmeniť `id` v súbore, potom sa lišta ukáže znova aj tým, čo ju zavreli.
  - Zobrazuje sa iba navrchu stránky, pri skrolovaní sa zbalí. Zatvorená lišta pri načítaní nebliká (malý skript v `<head>` ju skryje ešte pred vykreslením).
- Hotový bod 7 – formulár na kontakte:
  - Hore prepínač „Otázka“ / „Teambuilding pre firmy“. Spoločné polia sú z pôvodného formulára: meno *, telefón *, e-mail, správa.
  - Pri teambuildingu pribudnú polia z poznámok Helenky (sekcia 12): firma, miesto (v ateliéri / v priestoroch firmy), tvorba (spoločné dielo / každý vlastný kúsok), počet ľudí, predbežný termín.
  - Tlačidlo „Napísať o ponuku“ na `/kurzy` vedie na `/kontakt?typ=teambuilding#sprava`, teambuilding je predvolený.
  - Formulár nič neodosiela, po kliknutí na „Odoslať“ ukáže poznámku, že ide o prototyp.
  - Pod formulárom svieti `[doplniť: poučenie o spracovaní osobných údajov pri formulári – text dodá Helenka]` a odkaz na ochranu osobných údajov.
  - Oprava z bodu 4: logo v pätičke sa pri šírke okolo 1024 px už nezalomí na „He-“ a „lienka“.
- Hotový bod 8 – právne stránky:
  - `/obchodne-podmienky`, `/reklamacny-poriadok`, `/ochrana-osobnych-udajov` a `/cookies`, aj v angličtine. Odkazy sú v pätičke.
  - Pod nadpisom je žltý pruh „Vzorový text – čaká na znenie od právnika“.
  - Obsah je iba osnova: nadpisy častí, ktoré takéto dokumenty bežne majú, a v nich `[doplniť: …]`. Právny text vývojár nepísal (sekcia 14).
  - Doplnené sú iba fakty zo záznamníka a z webu: kontakty, osobný odber v ateliéri zadarmo, podmienky kurzov zo súčasného Google formulára (skrátené, sekcia 6), aké polia má kontaktný formulár, čo web ukladá v prehliadači (zatvorená info lišta), že Mapy Google sa načítajú až po kliknutí a že web zatiaľ nemá analytiku.
  - Stránky majú `noindex`, aby sa vzorový text nedostal do Googlu. Pri vložení konečného znenia ho treba zrušiť v `components/pravna-stranka.tsx`.
  - Obsah je v `content/pravne.ts`. Medzera sa píše ako `[[IČO]]` a na stránke sa ukáže ako `[doplniť: IČO]`.
- Hotový bod 9 – blog a stránka 404:
  - `/blog` a dva pôvodné články zo sekcie 5.6, doslovne (aj s pôvodnými drobnými preklepmi „prepacovaná“, „možem“). Anglický preklad cez AI. Texty sú v `content/blog.ts`.
  - Slugy sú pôvodné (`proces-vyroby-keramiky`, `uprava-salky-po-odliati`), aby sa dali presmerovať staré adresy `/2023/11/…` (fáza 6).
  - Video YouTube sa načíta až po kliknutí na „Prehrať video“, cez youtube-nocookie.com. Doplnené aj na stránku Cookies a Ochrana osobných údajov.
  - Fotky článkov sú z webu (hnedá misa pred výpalom, šálka so zlatom). OG obrázok s logom Sashe (sekcia 10) sa neprenáša.
  - Stránka 404: `app/global-not-found.tsx`, slovensky aj anglicky, s odkazmi na obe verzie. Zapnutá je cez `experimental.globalNotFound` v `next.config.ts`.
  - Prečo nie 404 v bežnom layoute: pri koreňovom layoute `app/[lang]` Next.js 16 nevykreslí 404 v layoute na serveri (posiela prázdnu stránku a dokreslí ju až JavaScript). Dokumentácia pre tento prípad odporúča `global-not-found`. Preto 404 nemá hlavičku a pätičku webu.
  - Neznáme slugy produktov a článkov aj neznámy jazyk (`/de`) vracajú 404 (`dynamicParams = false`).
- Overené pre body 4 – 9: `tsc`, `eslint` a `next build` bez chýb, všetkých 123 stránok sa vygeneruje staticky. Každá nová stránka je skontrolovaná v prehliadači na desktope; domov, detail produktu a info lišta aj na mobile (375 px). Filter a triedenie obchodu, zatvorenie info lišty a 404 sú otestované automaticky v prehliadači.
- Vetva `feat/body-4-9` je zlúčená s `main` (commit `wip` z druhej session, záznamy vyššie). Jej zmeny sú prenesené do `app/[lang]/` a všetky nové texty majú aj anglickú verziu (preklad AI, patrí k otázke 21):
  - Formulár na kontakte má 3 záložky z `main`: Firmy, Kurzy, Otázka (`/kontakt?typ=kurzy#formular`). Nahrádzajú prepínač Otázka / Teambuilding z bodu 7. Poučenie `[doplniť: …]` a odkaz na ochranu osobných údajov pod formulárom ostali.
  - Prihláška na kurz už nevedie na Google formulár, ale na záložku Kurzy. Poznámka z bodu 4, že Google formulár je iba po slovensky, už neplatí. Tlačidlo „Napísať o ponuku“ z bodu 7 je preč spolu s blokom o teambuildingu.
  - Odkazy „Opýtať sa na kúsok“ v obchode vedú na záložku Otázka.
  - Ikona košíka v hlavičke vedie na `/kosik`. Tá stránka ešte neexistuje (fáza 4), zatiaľ ukáže 404.
- Domovská stránka, sekcia „Každý kus existuje len raz“: namiesto galérie v 3 stĺpcoch sú rovnaké karty ako v obchode, najviac v 3 stĺpcoch (2 na telefóne, 3 od tabletu), s cenou a odkazom na produkt. Výber 12 kúskov je v `content/diela.ts` (`dielaNaDomov`), vypredané sa preskočia. Pod mriežkou je tlačidlo „Pozrieť všetky kúsky“ do obchodu. Mení to záznam o 3 stĺpcoch vyššie.
- Chýbajúce údaje sa na webe ukazujú iba ako žlté „doplniť“, bez popisu (predtým „[doplniť: IČO]“). Čo presne chýba, je v zdrojovom kóde a v atribúte `data-doplnit` (`components/ui/doplnit.tsx`).

---

## 2. Základné údaje

| Údaj | Hodnota |
|---|---|
| Názov značky | **Keramika He-lienka** (s pomlčkou; v logu malými: „keramika he-lienka“) |
| Iné tvary názvu na webe | „Ateliér He-lienka“, „Keramický ateliér He-lienka“, „Keramika Helienka“ (Google Maps, alt texty) |
| Slogan | **Krása a úžitok** (na webe aj „KRÁSA A ÚŽITOK“) |
| Majiteľka / lektorka | **Helena Sochnová** („Helenka“) |
| Ateliér od roku | 2020 |
| Adresa ateliéru | **Na vrátkach 1K, 841 01 Bratislava** (mestská časť Dúbravka) |
| GPS (z Google Maps embedu) | 48.189457, 17.042073 |
| Telefón | **0903 394 212** · medzinárodne +421 903 394 212 · na Kontakte „+421 (0) 903 394 212“ · odkaz `tel:+421903394212` |
| E-mail (web) | **info@keramikahelienka.sk** |
| E-mail (cenník, Google formulár) | helena.sochnova@gmail.com |
| Facebook | https://www.facebook.com/Keramika.Helienka |
| Instagram | https://www.instagram.com/keramika_helienka/ |
| YouTube | https://www.youtube.com/@keramikahe-lienka6410 (iba na stránke Kontakt) |
| LinkedIn | https://www.linkedin.com/in/helena-sochnova-675b85279/ (iba na stránke Kontakt) |
| Sashe.sk obchod | https://www.sashe.sk/He-lienka (iba v Google formulári ku kurzom) |
| Logo | Lienka (ladybug) v sivomodrej/petrolejovej farbe + text „keramika he-lienka“ – `docs/povodny-web/logo-povodne.png` |
| Favicon | Portrét Helenky – `/wp-content/uploads/2023/11/cropped-Helena-192x192.jpg` |
| Doména | www.keramikahelienka.sk (bez `www` presmeruje na `www`) |

Google Maps embed (pôvodný):
`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2659.890737842819!2d17.042073076892898!3d48.18945664754739!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476c8dcba5b721d1%3A0x639fb33182c93094!2sKeramika%20Helienka!5e0!3m2!1sen!2ssk!4v1715363894208!5m2!1sen!2ssk`

---

## 3. Pôvodná technológia

- WordPress 7.1.2, téma Astra, Elementor 4.3.2
- WooCommerce 11.1.2 (e-shop), WooPayments (platba kartou)
- Yoast SEO (sitemapy), TranslatePress (SK/EN, anglická verzia pod `/en/`)
- WPForms Lite (kontaktný formulár), WPConsent (cookie lišta)
- Mailchimp for WP – **nefunkčný** (na Kontakte svieti surový shortcode)
- Prihlášky na kurzy cez Google Forms (mimo webu)

---

## 4. Štruktúra webu

### Hlavné menu (v tomto poradí)
1. Domov – `/`
2. Kurzy – `/kurzy-keramiky/`
3. Obchod – `/obchod/`
4. Blog – `/blog/`
5. O nás – `/o_nas/`
6. Kontakt – `/kontakt/`

V hlavičke je aj vyhľadávanie. V pätičke je prepínač jazyka SK / EN.

### Všetky publikované stránky

| Stránka | URL | Stav |
|---|---|---|
| Domov | `/` | aktívna, v menu |
| Kurzy keramiky | `/kurzy-keramiky/` | aktívna, v menu (cenník iba ako obrázok) |
| Obchod | `/obchod/` | aktívna, v menu (48 produktov, 20 na stranu) |
| Blog | `/blog/` | aktívna, v menu (2 články z 11/2023) |
| O nás | `/o_nas/` | aktívna, v menu |
| Kontakt | `/kontakt/` | aktívna, v menu |
| Keramika a Yoga v Nebi | `/keramikaayogavnebi/` | mimo menu; akcia 19.–21. 6. 2026 už prebehla |
| Tvorba | `/tvorba/` | mimo menu; kamenné predajne (info z roku 2023) |
| Galéria | `/galeria-2/` | mimo menu; 9 fotiek z 11/2023 |
| Galéria | `/galeria/` | prázdna (iba nadpis) |
| Workshopy | `/workshopy/` | prázdna (iba nadpis) |
| Domov-2 | `/domov-2/` | zabudnutá šablóna Elementoru („Earth – Endless Potential“), **nepreberať** |
| Košík, Pokladňa, Môj účet | `/kosik/`, `/kontrola-objednavky/`, `/moj-ucet/` | systémové stránky WooCommerce |

### Staré URL (pre presmerovania 301 v novom webe)
- `/o_nas/`, `/kurzy-keramiky/`, `/kontakt/`, `/obchod/`, `/blog/`
- `/produkt/<slug>/` – 48 produktov (slugy sú v `produkty.json`)
- `/kategoria-produktu/<slug>/` – kategórie (tabuľka v sekcii 7)
- `/znacka-produktu/<slug>/` – 45 tagov produktov
- `/2023/11/10/proces-vyroby-keramiky/`, `/2023/11/11/uprava-salky-po-odliati/`
- `/keramikaayogavnebi/`, `/tvorba/`, `/galeria-2/`
- `/en/...` – anglická verzia

---

## 5. Texty stránok (doslovne)

### 5.1 Domov

- **H1:** Keramický ateliér
- **H2:** KRÁSA A ÚŽITOK
- Hlavná fotka: portrét Helenky – `/wp-content/uploads/2026/09/Helenka-Sochnova-Keramika-Helienka-titulne-foto-portret-na-web.jpg`

**Úvodný text:**
> Mojou veľkou vášňou sú dizajnové kúsky pre domov. Bez hrnčiarskeho kruhu u mňa vznikajú misy, vázy, dekorácie a pokojne aj lampy. Každý kúsok je jedinečný. Každý má neopakovateľný tvar a svoj príbeh.

**Galéria (7 fotiek, poradie z webu)** – všetky pod `/wp-content/uploads/`:
`2026/07/Variabilna_04.jpeg`, `2026/04/IMG_3123.jpeg`, `2026/04/IMG_3193.jpeg`, `2026/04/IMG_2212.jpg`, `2026/04/IMG_2266.jpeg`, `2026/04/IMG_2218.jpg`, `2026/09/IMG_3551.jpeg`

**Tri bloky:**

| Nadpis | Text | Fotka (alt) |
|---|---|---|
| O procese | Každý výrobok je robený ručne, čo mu dáva výnimočný charakter a autentickosť. Obsahuje kúsok duše jeho tvorcu, ktorý ho s láskou vytvoril. | Hnedá misa (`IMG_5696`) |
| O nákupe | Výrobky z nášho ateliéru sú nielen krásne, ale aj praktické. Bude mi veľkým potešením, keď sa niektorý kúsok dotkne vášho srdca a stane sa súčasťou vášho domova. | Biela misa (`28ee1052-…`) |
| O mne | Od roku 2020 mám vlastný ateliér. Z hliny tvorím krásu a drobné radosti a vediem kurzy keramiky vo svojom ateliéri v Dúbravke. | Helena Sochnová (`IMG_5191`) |

**Recenzie (3):**

1. > „Som veľmi spokojná, výrobok je prekrásny, perfektne zabalený. Komunikácia s pani Helenkou, ktorá sväteničku vyrobila, bola výborná. Len tak ďalej. Zaslúži si najvyššie hodnotenie.“

   — **Jana, Sološnica**

2. > „Pani Helenka, ďakujem veľmi pekne. Svietniky sú nádherné. Myslím, že táto dvojica je v našom prípade lepšia voľba. Vaše dielka sú zosúladené, harmonické vzorom a aj farebne. Perfektné balenie. Budú sa v exteriéri nenápadne vynímať :). Ešte raz Vám ďakujem a prajem veľa nadšenia, radosti a tvorivých nápadov vo Vašej práci a a iste aj záľube.“

   — **Vlastina, Belá - Dulice** (v origináli preklep „a a iste“)

3. > „Kurz keramiky v Ateliéri He-lienka bol pre mňa vždy relaxom a zdrojom inšpirácie aj mnohých nových možností. Helenka ako lektorka je veľmi ústretová a nápomocná. Intenzívne sa na kurzoch venuje dospelým aj deťom. Neustále rozširuje ponuku materiálov a nástrojov v ateliéri a prináša nové nápady. Zároveň je pripravená podporiť rôzne projekty a pomôcť s realizáciou. Počas viac ako roka to bol náš spoločný tvorivý čas s dcérou (7r.). Vzniklo veľa pekných a naozaj použiteľných kúskov. Zo šálok, misiek a ozdôb sa tešíme dodnes my, aj naši blízki. Individuálny prístup a priateľská atmosféra ateliéru mi veľmi vyhovuje.“

   — **Radka, výtvarníčka**

**Kontaktný formulár:**
- H2: ZOSTAŇME V KONTAKTE
- Text: „Radi vám pripravíme ponuku našich výrobkov, kurzov, workshopov/teambuildingu na mieru podľa vašich požiadaviek.“
- Polia: **Meno \***, **Telefón \***, Email, Vaša správa
- Tlačidlo: ODOSLAŤ

### 5.2 Pätička (na každej stránke)
- KERAMIKA HE-LIENKA
- KDE NÁS NÁJDETE: Na vrátkach 1K, 841 01 Bratislava + Google mapa
- KONTAKTUJTE NÁS: 0903 394 212, info@keramikahelienka.sk
- Ikony Facebook a Instagram
- Prepínač jazyka Slovak / English

### 5.3 O nás
- **H1:** Kto som?
- Fotka: `/wp-content/uploads/2023/11/Helena.jpg`
- **H2:** Som Helenka

> Krása. Vždy ma fascinovala a prinášala radosť, približovala ma k jej Pôvodcovi. Keramiku som si kupovala a obdivovala. Až prišiel deň, kedy som ju začala aj ja tvoriť. Je to úžasný pocit, keď pod mojimi rukami hlina dostáva tvar a prostredníctvom vzduchu a ohňa sa mení v trvácu podobu. Snažím sa, aby dielka boli nielen oku lahodiace, ale aj praktické a užitočné. Verím, že prinesú radosť aj vám.

- **H2:** Zaujalo vás niečo?

> Ak si chcete kúpiť výnimočný výrobok či už pre seba alebo ako darček, prípadne sa chcete prihlásiť na kurz, ozvite sa.

- Tlačidlo: „Tu ma nájdete“ (odkaz nefunguje, vedie na `#`)

### 5.4 Kurzy keramiky
- Meta popis: „Príďte sa dotýkať hliny a tvorivo relaxovať.“
- „VIAC INFORMÁCIÍ O KURZOCH NÁJDETE NA:“ → odkaz „LINK NA BLIŽŠIE INFORMÁCIE O KURZOCH“ (Google formulár, pozri sekciu 6)
- Dva obrázky s cenníkom (sekcia 6)
- **H2:** NAPÍŠTE NÁM:
- **H3:** Máte nejaké otázky? Chcete si dohodnúť teambuilding?
- Tlačidlo: „NEVÁHAJTE NÁS KONTAKTOVAŤ“ (odkaz nefunguje, vedie na `#`)

### 5.5 Kontakt
- **H2:** Naše kontakty
- **H2:** Chcete dostávať listy z ateliéru? – „Prihláste sa na odber:“ (formulár nefunguje)
- **H2:** Máte otázky?
  - EMAIL: info@keramikahelienka.sk
  - Telefón: +421 (0) 903 394 212
  - ADRESA: Na vrátkach 1K, 841 01 Bratislava
- **H4:** Sledujte nás – Instagram, Facebook, YouTube, LinkedIn

### 5.6 Blog (autorka Helenka, kategória „Nezaradené“)

**Článok 1: Proces výroby keramiky** (10. novembra 2023)
URL: `/2023/11/10/proces-vyroby-keramiky/`
Meta popis: „Ako na výrobu keramiky? Postupov je viacero. Priblížime vám celý proces modelovania keramiky z plátu hliny, na čo si dať pozor. Nezatajíme vám ani jeho úskalia. Lepšie je však raz vidieť ako raz počuť. Príďte si to vyskúšať na vlastnej koži v našom ateliéri.“

> Keramika si vyžaduje svoj proces, čas. Učím sa pri jej výrobe trpezlivosti, byť „tu a teraz“, neponáhľať sa.
>
> Najprv zoberem hlinu a modelujem (musí byť dobre prepacovaná, v správnej vlhkosti, pružnosti). Niekedy si len pripravím „diely“ a pokračujem až na druhý deň. Inokedy zase spravím len hrubé nahodenie veci. Každá (aj keď oku neviditeľná) molekula vzduchu spôsobí prasknutie výrobku v peci.
>
> Keď má vec finálny tvar, nechám preschnúť a retušujem (nasucho a aj namokro). Potom nechám dokonale preschnúť, až „na kosť“. Každá vlhkosť by znamenala roztrhnutie vecičky v peci… Doba schnutia sa líši od veľkosti výrobku, jeho hrúbky, modelovanej vrstvy – šáločka cca týždeň, forma na pečenie (nielen) chleba (hlavne vrchnák, ktorý je komplikovanejší a hrubší) môže vyžadovať aj 2-3 týždne.
>
> Potom ide do pece na prvý prežah (zvyčajne 950 stupňov Celzia). Výpal, spolu s chladnutím pece trvá cca 17 hodín.
>
> Keď chcem zvýrazniť detaily – nanášam „burel“. Vecička ide znova do pece (ten istý cyklus).
>
> A možem glazovať. Nanesiem glazúru, veľmi detailne, po kúskoch. V dvoch vrstvách, po preschnutí prvej.
>
> Dám do pece na glazovací program (zvyčajne 1050 stupňov Celzia). Výpal spolu s chladnutím trvá cca 20 hodín.
>
> Niekedy treba glazúru na niektorých miestach opraviť, výrobok ide znova do pece.
>
> V každej fáze tohto procesu výroby (aj keď ho robím 101x) sa môže stať, že sa niečo nepodarí.
>
> Preto je ručná práca taká unikátna a vyžaduje moju, aj Vašu trpezlivosť a zhovievavosť :o)
>
> Uvedené doby výroby sú preto orientačné (rolu zohráva aj počet zákaziek a kurzov v danom čase, ako aj moja zdravotná, či rodinná situácia). Veci robím väčšinou na mieru, podľa želania zákazníka, na sklade mávam málokedy „niečo v zálohe“.
>
> Mám však kúsky, ktoré majú drobné, či väčšie nedokonalosti, ktoré však nebránia ich funkčnosti. Ak máš o takýto jedinečný kúsok záujem, neváhaj ma kontaktovať.

**Článok 2: Ako si vyrobiť šálku odlievaním** (11. novembra 2023)
URL: `/2023/11/11/uprava-salky-po-odliati/`
Text: „Jednotlivé kroky nájdete vo videu.“
Video: YouTube `5Ie4aFM-mZA` (https://www.youtube.com/watch?v=5Ie4aFM-mZA)

### 5.7 Tvorba – kamenné predajne (stránka mimo menu, údaje z 2023)

Galéria: Medovnička, Šálka, Šálka s tanierikom, Fontána.

**„Od 2.11.2023 nájdete naše výrobky aj v kamennom obchode:“**
Place store, Hurbanovo námestie 1, 811 06 Bratislava
Po 10:00–18:00 · Ut–Pia 10:00–19:00 · So 11:00–16:00

**„Výrobky s náboženskou tématikou nájdete aj v kamennom obchode:“**
Predajňa František, Františkánske námestie 2, 811 91 Bratislava
Po–Pia 09:00–18:00 · So 09:00–12:00

### 5.8 Keramika a Yoga v Nebi (akcia už prebehla)
Stránka je 6 obrázkov (1080 × 1080) s textom. Prihláška: https://forms.gle/gABoV1iatX4XaRgZA (formulár sa nepodarilo načítať, zrejme je zatvorený).

- **Kedy?** 19. – 21. 6. 2026
- **Čo?** S veľkou radosťou vás spolu s Radkou pozývam na prvý pobytový workshop, na ktorom prepojíme tvorenie z hliny a cvičenie yogy. Už dlhšie som nosila v hlave nápad preniesť tvorivý proces na miesto, kde budeme obklopení krásnou prírodou. Kde by sme popri stíšeniu sa pri hline mohli myslieť aj na svoje telo. Našla som také miesto.
- **Kde?** Nebo nad Štiavnicou. Miesto na okraji Banskej Štiavnice, kde strávite víkend, poskytuje súkromie a svojou energiou skvele podporuje kreatívne workshopy. Je ideálne na načerpanie energie a inšpirácie súčasne. Bohatá minulosť Banskej Štiavnice vytvorila jedinečný štýl, ktorý nikde na Slovensku nenájdete. Chránená krajinná oblasť Štiavnické vrchy túto jedinečnosť umocňuje. Zachránené chalúpky, v ktorých budeme bývať, aj tvoriť a oddychovať, poskytujú čaro dávnych čias a zároveň komfort našej doby.
- **Pre koho?** Pre každého, kto túži objavovať krásu v hline, v pohybe a tichu prírody. Ak hľadáte priestor na tvorenie, oddych a načerpanie síl, tento víkend je práve pre vás. Nerozhoduje, či už ste s hlinou prešli nejakú cestu alebo ju budete držať v rukách prvýkrát. Rovnako aj cvičenie yogy môže byť na pobyte vašou prvou skúsenosťou.
- **Keramika:** Počas víkendu sa naučíte základné techniky modelovania z hliny. Vyrobíte si niekoľko produktov, na ktorých si ukážeme použítie prírodnín a rôznych pomôcok na vytváranie dekoru. Vovedieme vás aj do figurálneho tvorenia z hliny. Zároveň si vyskúšate aj glazovanie na už pripravenej a vypálenej keramike. Nadizajnujete si vlastnú šálku, ktorú si po výpale v peci vyzdvihnete v ateliéri v Bratislave.
- **Yoga:** Prepojíme sa s dychom a telom. Vedome sa rozhýbeme, rozprúdime energiu, zahrejeme a zaktivujeme svaly, ponaťahujeme telo. Na záver si užijeme vedenú relaxáciu. Vedeli ste že pôvodný význam yogovej asány (polohy tela) a pranayámy (práce s dychom) bol aby sa yogíni vládali dlhé hodiny venovať meditácií? Tvorba je forma meditácie ak je telo v pohode a myseľ uvoľnená tvorivá energia slobodne prúdi.

---

## 6. Kurzy a cenník

Zdroje: obrázky `Cennik_26_kurzy.jpg` a `Cennik_26_deti.jpg` (marec 2026) + Google formulár „Záväzná prihláška na 1-mesačný kurz keramiky“:
https://docs.google.com/forms/d/e/1FAIpQLSeoLK3W8N3NL6rVFy88hWFnaBPmp4bJ6C7nZFkggQzglOEwtg/viewform

### Dospelí – pravidelný kurz (4 lekcie mesačne, pravidelný čas)
| Kurz | Cena |
|---|---|
| Mesačný kurz 4 × 3 hod. | **156 €** |
| Mesačný kurz 4 × 2,5 hod. | **140 €** |
| Mesačný kurz 4 × 2 hod. | **120 €** |

### Dospelí – nepravidelný kurz (iba v Google formulári, nie na obrázku)
| Kurz | Cena |
|---|---|
| Mesačný kurz 4 × 3 hod. | **192 €** |
| Mesačný kurz 4 × 2,5 hod. | **170 €** |
| Mesačný kurz 4 × 2 hod. | **150 €** |

### Ostatné
| Položka | Cena |
|---|---|
| Workshop 3 + 2 hodiny | **85 €** (dá sa kúpiť aj v e-shope ako produkt/poukážka) |
| Jednorazový vstup do ateliéru | **51 € / 3 hod.** (iba na obrázku) |
| Skupinový/rodinný workshop (3–5 osôb, 3 h + 2 h) | cena podľa počtu a veku, **minimum 190 €** |
| Teambuilding | cenová ponuka na mieru |

### Deti
| Vek | Cena |
|---|---|
| do 6 rokov | **8 € / hod.** |
| 6 – 9,99 rokov | **9 € / hod.** |
| 10 – 13,99 rokov | **10 € / hod.** |
| 14 – 18 rokov | **11 € / hod.** |

Deti do 10 rokov len v sprievode platiaceho rodiča.

### Termíny (z Google formulára)
- Utorok 17:00 – 20:00
- Streda 9:30 – 12:30
- Štvrtok 17:30 – 20:30
- Skupinový workshop – individuálny termín (od 1. 3. aj cez víkend)

### Podmienky kurzov
- Skupina: minimálne 4, maximálne 8 dospelých (workshop z e-shopu: 3 – 6 ľudí).
- Na hrnčiarskom kruhu sa **netočí** – iba ručné modelovanie.
- Obsah kurzu: reliéf, miska, hrnček, váza; odtláčanie, vykrajovačky; pokročilí – odlievanie do sádrových foriem, väčšie kusy, porcelán.
- Postup: modelovanie → sušenie v ateliéri → 1. výpal → glazovanie (glazúry, engoby, patina) → 2. výpal → vyzdvihnutie v ateliéri.
- V cene: všetok materiál, pomôcky, uskladnenie počas sušenia, 2 × výpal, malé občerstvenie, lektorka.
- Platba: darčekový poukaz / na účet („k cene za kurz bude pripočítaná DPH“) / v hotovosti.

**Popis kurzu z formulára (doslovne):**
> Počas kurzu sa oboznámite s hlinou ako modelovacím materiálom. Vymodelujete si postupne reliéf, misku, hrnček, vázu. Pripravíme aj rôzne materiály na odtláčanie a vykrajovačky, tiež si môžete doniesť vlastný materiál na dekorovanie, ak preferujete určitý druh, vzor. Hlina a nástroje na jej opracovanie budú pripravené v ateliéri. Či sa budete s hlinou iba hrať, alebo budete vážne tvoriť je na vás, lektorka vám bude nápomocná svojimi radami a skúsenosťami. Môžete si vymodelovať jedinečné kúsky, ktoré budú tešiť vás alebo vašich blízkych ako originálny darček. Na hrnčiarskom kruhu netočíme.
>
> Tí, ktorí už do ateliéru chodili, samozrejme podľa svojej pokročilosti objavujú ďalšie keramické techniky a možnosti ako odlievanie do sádrových foriem, modelovanie väčších kúskov, ako aj prácu s porcelánom a pod.
>
> Vytvorené výrobky necháme v ateliéri vysušiť. Po vyschnutí vašich výtvorov ich dáme vypáliť do keramickej pece a potom sa budete učiť glazovať. Vyskúšate si rôzne techniky nanášania glazúry. K dispozícii budú aj engoby (podglazúrne farby) a patina.
>
> Následne musíme naglazovanú keramiku vypáliť v keramickej peci druhýkrát. Až teraz budú vaše výrobky hotové a vy si ich môžete prísť zobrať do ateliéru. Je to trocha zdĺhavejší proces, ale taká už keramika býva….uvidíte, že sa oplatí čakať. Verím, že budete hrdí na svoju šikovnosť a radi sa pochválite vlastnými výrobkami.

**Workshop 3+2 hodiny (text z e-shopu, doslovne):**
> Na workshope sa naučíte základy modelovania z hliny. Lektorka vás bude sprevádzať celým procesom. Vytvoríte si jedinečné kúsky, ktoré budú tešiť vás alebo vašich blízkych ako originálny darček. Pracujeme v malej skupine 3 – 6 ľudí.
>
> Na kruhu netočíme.
>
> Workshop môžete darovať prostredníctvom Darčekovej poukážky, ktorú Vám zašleme fyzicky poštou alebo elektronicky mailon.
>
> Harmonogram workshopu: 1. stretnutie: 3 hodiny – modelovanie; 2. stretnutie: 2 hodiny – glazovanie
>
> Miesto: Ateliér, Na vrátkach 1K, Bratislava
>
> V cene je zahrnuté: všetok materiál, pracovné pomôcky, uskladnenie výrobkov počas sušenia, 2x výpal v keramickej peci, malé občerstvenie.
>
> Príď a objav v sebe ukryté dary a talenty! Počet účastníkov je obmedzený.

### Všeobecné obchodné podmienky kurzov (z Google formulára, skrátene)
1. **Prihláška** – cez formulár alebo v ateliéri. Bez zaplatenia je nezáväzná. Rezervácia platí dňom úhrady.
2. **Platba** – najneskôr 7 dní pred kurzom. V cene pomôcky, materiál, občerstvenie, lektor.
3. **Storno** – zrušenie najneskôr 3 dni pred kurzom = vrátenie 50 %. Skôr = vrátenie celej sumy alebo iný kurz. Vynechanú lekciu mesačného kurzu možno nahradiť v predplatenom období. Neúčasť treba ohlásiť 48 h vopred, inak termín prepadá.
4. **Darčeková poukážka** – platnosť podľa hodnoty a dohody. Po platnosti prepadá.
5. **Zmeny** – ateliér si vyhradzuje zmenu dátumu a miesta; oznámi e-mailom alebo SMS.
6. **Bezpečnosť** – činnosti v ateliéri na vlastnú zodpovednosť.

Súhlas s GDPR odkazuje na zákon č. 122/2013 Z. z. (**zastaraný**, platí zákon č. 18/2018 Z. z. a GDPR). Formulár obsahuje aj zastaraný súhlas s opatreniami COVID-19.

---

## 7. E-shop

### Súhrn
- **48 produktov**: 40 skladom, 8 vypredaných. Ceny **35 € – 369 €**.
- Takmer všetko sú unikáty (1 ks).
- Zobrazenie ceny: „129,00 € vrát. DPH“ (formát: čiarka, medzera, `€` za číslom).
- Hodnotenia: žiadny produkt nemá recenziu, no všade svieti „Hodnotenie 0 z 5“.
- Úplné dáta: `docs/povodny-web/produkty.json`.

### Kategórie
| Kategória | Slug | Počet |
|---|---|---|
| Vázy / Vases | `vazy` | 23 |
| Misy / Bowls | `misy` | 13 |
| Šperky / Jewelry | `sperky` | 6 |
| ↳ Blue river (podkategória Šperkov) | `sperky/blue-river` | 5 |
| Lampy / Lamps | `lampy` | 3 |
| Šálky / Cups | `salky` | 3 |
| Kurzy / Courses | `kurzy-courses` | 1 |
| Poukážky / Vouchers | `poukazky-vouchers` | 1 |

### Produkty (poradie ako v API, najnovšie hore)
Jazyk popisu: SK / EN / — (bez popisu).

| Názov | Kategória | Cena | Sklad | Fotiek | Popis |
|---|---|---|---|---|---|
| Váza Modrá vlna | Vázy | 75 € | 1 ks | 3 | — |
| Citrónová misa | Misy | 129 € | áno | 3 | — |
| Lampa color | Lampy | 190 € | 1 ks | 3 | SK |
| Lampa vyrezávaná | Lampy | 190 € | vypredané | 2 | SK |
| Misa Mušľa malá 2 | Misy | 55 € | vypredané | 1 | SK |
| Misa Mušľa malá 1 | Misy | 55 € | vypredané | 1 | SK |
| Misa Mušľa 3 | Misy | 75 € | vypredané | 3 | SK |
| Misa Mušľa 2 | Misy | 75 € | vypredané | 2 | SK |
| Váza raku | Vázy | 99 € | áno | 2 | SK |
| Raku nádoba | Misy | 65 € | vypredané | 1 | SK |
| Raku váza | Vázy | 69 € | 1 ks | 2 | — |
| Misa Mušľa 1 | Misy | 75 € | 1 ks | 2 | SK |
| Sada lámp | Lampy | 329 € | 1 ks | 5 | SK |
| Misa morská veľká | Misy | 129 € | áno | 4 | SK |
| Váza prírodná | Vázy | 79 € | 1 ks | 3 | SK |
| Variabilná misa | Misy, Vázy | 189 € | 1 ks | 5 | SK |
| Vyrezávaná misa | Misy | 185 € | 1 ks | 2 | SK |
| Kolekcia Blue River – náramok 1 | Šperky, Blue river | 35 € | 1 ks | 2 | SK |
| Kolekcia Blue River – náramok 2 | Šperky, Blue river | 35 € | 1 ks | 1 | SK |
| Kolekcia Blue River – náhrdelník 3 | Šperky, Blue river | 59 € | vypredané | 1 | SK |
| Kolekcia Blue River – náhrdelník 2 | Šperky, Blue river | 59 € | vypredané | 2 | SK |
| Kolekcia Blue River – náhrdelník 1 | Šperky, Blue river | 59 € | 1 ks | 1 | SK |
| Váza – korálová kolekcia | Vázy | 149 € | 1 ks | 4 | SK |
| Keramický workshop 3+2 hodiny | Kurzy, Poukážky | 85 € | áno | 19 | SK |
| Earings white gold medium | Šperky | 55 € | 1 ks | 4 | — |
| Cup with lava glaze | Šálky | 39 € / 45 € s keramickým vrchnákom | 1 ks | 4 | — |
| Cup with cat | Šálky | 35 € / 41 € s To-go vrchnákom | 1 ks | 3 | EN |
| Bowl with high pedestal and gold | Misy | 75 € | 1 ks | 2 | — |
| Cup with gold pinky | Šálky | 43 € / 49 € s keramickým vrchnákom | 4 ks | 3 | EN |
| Vase high unglazed | Vázy | 89 € | 1 ks | 1 | — |
| Vase with gold | Vázy | 119 € | 1 ks | 3 | — |
| Small vase carved | Vázy | 85 € | 1 ks | 2 | — |
| Small vase pink | Vázy | 65 € | 1 ks | 2 | — |
| Oval vase mini | Vázy | 59 € | 1 ks | 1 | — |
| Art object lava glazed | Vázy | 210 € | 1 ks | 5 | — |
| Shell big glazed vase | Misy | 299 € | 1 ks | 2 | EN |
| Ball vase glazed | Vázy | 75 € | 1 ks | 1 | EN |
| Modrá porcelánová váza „koral“ | Vázy | 229 € | 1 ks | 4 | SK |
| Vase speckled clay glazed | Vázy | 129 € | 1 ks | 1 | EN |
| Bowl/vase grey with lava glaze | Vázy | 329 € | 1 ks | 1 | EN |
| Art object dark brown | Vázy | 299 € | 1 ks | 1 | EN |
| Art object white glazed | Vázy | 369 € | 1 ks | 8 | EN |
| Moon vase green glazed | Vázy | 249 € | 1 ks | 1 | EN |
| Moon vase turquoise glazed | Vázy | 235 € | 1 ks | 1 | EN |
| Oval vase glazed | Vázy | 99 € | 1 ks | 1 | EN |
| Vase bubbles morning fog glazed | Vázy | 99 € | 1 ks | 1 | EN |
| Vase bubbles amethyst glazed | Vázy | 120 € | 1 ks | 1 | EN |
| Shell middle glazed vase | Misy | 189 € | 1 ks | 1 | EN |

„áno“ = skladom bez uvedeného počtu kusov.

### Užitočné fakty z popisov produktov
- Lampy: glazovaná keramika, závit E27, kábel 1,5 m s vypínačom; dizajnová žiarovka za príplatok **35 €**. Sada lámp sa dá používať v 2 polohách.
- Raku = japonská metóda výpalu („na Slovensku ju takmer nikto nepozná“).
- Teploty výpalu: kamenina 1240 – 1250 °C (blog uvádza 950 °C prežah a 1050 °C glazúra).
- Zlato zdobené kusy nie sú vhodné do mikrovlnky ani umývačky.
- Blue River: riečne perly + ručne robené zrniečka z modrého porcelánu.

### Doprava (zistené cez košík, 28. 9. 2026)
| Spôsob | Cena |
|---|---|
| Osobný odber v Ateliéri | 0 € |
| Paušálna sadzba SK | 7,90 € (šperk) · 59 € (misa za 129 €) – cena sa líši podľa triedy dopravy |
| Paušálna sadzba CZ | 99 € (misa) |
| Paušálna sadzba AT | 0 € (vyzerá ako chyba nastavenia) |
| „Free shipping“ | 0 € – ponúka sa pri každej objednávke na SK (vyzerá ako chyba) |

### Platby
- Platba kartou (WooPayments)
- Bankový prevod
- Dobierka

DPH: pri cenách je „vrát. DPH“, košík však počíta daň 0 €.

---

## 8. Vizuál pôvodného webu

**Farby (paleta témy Astra):**

| Farba | Hex | Použitie |
|---|---|---|
| Tyrkysová | `#30C7B5` | hlavná farba značky |
| Tmavá tyrkysová | `#00AC97` | akcent / hover |
| Takmer čierna zelená | `#14261C` | nadpisy |
| Sivá | `#4F5655` | text |
| Svetlé pozadie | `#F3F6F3` | pozadie sekcií |
| Biela | `#FFFFFF` | pozadie |
| Hnedá | `#493636` | na domovskej stránke |

- Logo je sivomodré/petrolejové (odtieň odhadom okolo `#5F9FAE`, nie tyrkysové).
- Cenníky kurzov: tyrkysové pozadie a ručne písaný font.

**Fonty:** Montserrat (300, 400, 500, 600) a Open Sans (500). Elementor má v nastaveniach aj Roboto a Roboto Slab (predvolené hodnoty, zrejme nepoužité).

---

## 9. SEO pôvodného webu

| Stránka | `<title>` | Meta description |
|---|---|---|
| Domov | DOMOV - Keramika He-lienka | nevyplnená (generuje sa z textu) |
| O nás | O NÁS - Keramika He-lienka | nevyplnená |
| Kurzy | KURZY KERAMIKY - Keramika He-lienka | Príďte sa dotýkať hliny a tvorivo relaxovať. |
| Kontakt | KONTAKT - Keramika He-lienka | nevyplnená (obsahuje rozbitý shortcode) |
| Obchod | Obchod - Keramika He-lienka | nevyplnená |
| Blog | BLOG - Keramika He-lienka | nevyplnená |
| Proces výroby keramiky | Proces výroby keramiky - Keramika He-lienka | vyplnená (sekcia 5.6) |

- Názov webu v schéme: „Keramika He-lienka“, popis: „Krása a úžitok“.
- OG obrázok domovskej stránky: portrét Helenky (2026/09).

---

## 10. Chyby na pôvodnom webe (neprenášať do redesignu)

**Funkčné chyby**
- Kontakt: newsletter nefunguje, na stránke svieti text `[mc4wp_form id=2483]`.
- O nás: tlačidlo „Tu ma nájdete“ vedie na `#`.
- Kurzy: tlačidlo „NevÁHAJTE NÁS KONTAKTOVAŤ“ vedie na `#` a má zlé veľké písmená.
- Kurzy: cenník je iba obrázok. Nedá sa čítať čítačkou, nevidí ho Google.
- Doprava: „Free shipping“ vždy, AT za 0 €, SK až 59 €.
- Chýbajú právne stránky (sekcia 11, otázka 1).

**Obsahové chyby**
- Misy Mušľa (4 ks) majú popis „ručne modelovaná **lampa** z kameniny s morským vzorom“.
- Mix slovenských a anglických názvov a popisov produktov.
- Preklepy: „124)°C“, „perecntage“, „schamote“, „specled“, „turqoise“, „colorfull“, „Earings“, „riešnych“, „mailon“, „dizajnová žiarovku“.
- „Shell big/middle glazed vase“ sú vázy, ale sú v kategórii Misy.
- Slugy: „Ball vase glazed“ má slug `2267`. Náramok 1/2 majú prehodené slugy. „Shell middle“ má slug `shell-small-…`.
- Fotky nemajú alt texty.
- Anglická verzia je preložená iba čiastočne a strojovo („Meno“ → „Less“, „svätenička“ → „baptismal font“).
- OG obrázok blogového článku je logo Sashe.sk.
- Schéma uvádza iný Facebook (`facebook.com/keramikahe-lienka`) ako odkazy na webe.
- Prázdne a zabudnuté stránky: `/galeria/`, `/workshopy/`, `/domov-2/`.
- Stránka Yoga zostala zverejnená po skončení akcie.

---

## 11. Otázky pre Helenku

Zoradené podľa dôležitosti.

1. **Právne údaje e-shopu.** Na webe chýba IČO, obchodné meno, obchodné podmienky, reklamačný poriadok a ochrana osobných údajov. E-shop ich zo zákona potrebuje. Má ich Helenka? Je platiteľka DPH?
2. **Doprava.** Aké sú správne ceny? Je doprava zadarmo od nejakej sumy? Posiela do zahraničia?
   - Rozhodnutie 21. 10. 2026: hlavne osobný odber, doručenie „individuálne“ na cenovú ponuku (denník 21. 10.). Zostáva od Helenky: koľko dní drží kus pre žiadosť (dnes 3 dni), či posiela aj do Česka alebo EÚ (dnes iba Slovensko), ktoré kusy sú iba na osobný odber (v admine pri produkte).
3. **Kontaktný e-mail.** Ktorý je hlavný: info@keramikahelienka.sk alebo helena.sochnova@gmail.com?
4. **Kamenné predajne.** Platí ešte Place store (Hurbanovo nám. 1) a Predajňa František (Františkánske nám. 2)?
5. **Kurzy.** Platia termíny Ut / St / Št? Platí nepravidelný kurz (192 / 170 / 150 €) a jednorazový vstup 51 €? Veková hranica detí: obrázok uvádza „6 – 9,99“, formulár „6 – 10“.
6. ~~**Anglická verzia.** Chce ju? Ak áno, kto dodá preklad?~~ **Odpovedané 10. 10. 2026:** áno, prepínač SK / EN, preklad cez AI (sekcia 12).
7. **Názvy produktov.** Zjednotiť do slovenčiny (s anglickým prekladom)? *(10. 10. 2026: na webe je zatiaľ návrh – slovenská verzia má slovenské názvy a popisy, anglická anglické. Chýbajúci jazyk preložila AI, je v `content/produkty.ts`. Treba potvrdiť.)*
8. **Newsletter.** Používa ešte Mailchimp? Chce odber „Listy z ateliéru“? *(10. 10. 2026: newsletter chce – oznamy o výstavách. Ostáva otázka nástroja.)*
9. **Yoga pobyt.** Bude ďalší ročník? Ponechať stránku ako archív?
10. **Meno.** Presný tvar: „Helena Sochnová“ (s dĺžňom)?
11. **Recenzie.** Máme súhlas použiť mená? Má ďalšie recenzie?
12. **Galéria a Workshopy.** Chce tieto sekcie? Dodá fotky?
13. **Sashe.sk.** Predáva ešte cez Sashe? Máme tam odkazovať?

**Nové otázky z poznámok zo stretnutia (10. 10. 2026):**

14. **Faktúry.** Kto je „on“, ktorý chce faktúru hneď (partner, účtovník)? V akom programe dnes fakturujú?
15. **Teambuilding.** „1/2 krát“ znamená 1 – 2 × za rok, alebo za mesiac? Chce formulár pre HR, alebo stačí kontakt?
16. **Písmo.** Čo je „Môj ateliér“ – web, logo, súbor? Pošle odkaz alebo screenshot?
17. **„MOJKA – GALÉRIA“.** Čo znamená „Mojka“?
18. **Misa mesiaca.** Vyberá ju ručne každý mesiac? Akú zľavu chce dávať?
19. **Hodnotenia z Instagramu.** Majú to byť vybrané komentáre, alebo vložený Instagram feed?
20. **Use cases.** Čo presne myslela „use cases“ pri vázach / kurzoch – fotky váz doma v interiéri, alebo typy kurzov (darček, zážitok, firma)?

**Nové otázky z práce na webe (10. 10. 2026):**

21. **Anglické texty.** Preklad spravila AI. Prečíta ich Helenka alebo niekto s dobrou angličtinou? Sedí slogan „Beauty and purpose“ (Krása a úžitok)?

---

## 12. Požiadavky od Helenky (poznámky zo stretnutia, zapísané 10. 10. 2026)

Zdroj: surové poznámky zo stretnutia. Nejasné body sú ako otázky 14 – 20 v sekcii 11.

### Priorita obsahu
- Na prvom mieste je Helenkina vlastná tvorba (diela, obchod). Kurzy sú až na druhom mieste.
- Dôsledok: na domovskej stránke majú byť diela pred kurzami. Prototyp má teraz opačné poradie (`app/page.tsx`: `KurzyStack` pred `DielaGrid`).
- **Nové diela** si Helenka pridáva sama – do galérie aj do obchodu. Web teda potrebuje CMS.

### Kurzy
- **Teambuilding pre firmy (HR).** Robí sa na dohodu, zhruba 1 – 2 ×. Chce ho na webe zvýrazniť, ale nenútene.
- Možný formulár pre HR. Polia: miesto (ateliér alebo priestory firmy), počet ľudí, spoločné dielo alebo každý vlastné. Či formulár chce, ešte nevie.
- **Kurz ako zážitok „na zapamätanie“** – vytvoriť si peknú vázu. Ukázať príklady (use cases).
- Ateliéry (kurzy) idú podľa sezóny: jeseň a jar.
- **Rezervácie** kurzov priamo na webe.

### Obchod
- **Misa mesiaca.** Nový alebo vybraný produkt mesiaca. Môže mať zvýhodnenú cenu. Ak kus dlho stojí, zľava má motivovať kupujúcich.
- **Info lišta** hore na stránke: zľavy, zľavové kódy, oznamy (napr. „najbližšie mám výstavu“) a odkaz na newsletter.
- **Hodnotenia váz z Instagramu.**
- **Vypredané kusy** ostávajú na webe ako galéria, jemne zosivené.
- **Triedenie produktov** – doladíme neskôr.

### Platby a faktúry
- Dnes WooCommerce. Problém: po platbe príde iba oznámenie. Faktúru chcú mať vystavenú hneď a automaticky, aby sa nič nepomýlilo.
- Pozrieť **Comgate**. Pri novom obchodníkovi drží peniaze dlhšie, po overení chodia skôr. Faktúra však musí byť hotová hneď po zaplatení, nie až po výplate peňazí.

### Právne stránky (spravované v CMS)
- GDPR a ochrana osobných údajov, cookies, všeobecné obchodné podmienky.
- Helenka chce ošetriť, že sa tovar nedá vrátiť, s výnimkami. Treba zistiť, čo dovoľuje zákon.
- **Zistené 10. 10. 2026 (overiť s právnikom):** platí zákon č. 108/2024 Z. z. o ochrane spotrebiteľa. Pri nákupe cez internet môže spotrebiteľ odstúpiť od zmluvy do 14 dní. Výnimky sú v § 19 ods. 1.
  - Výnimka platí pre tovar vyrobený podľa požiadaviek spotrebiteľa (zákazka). Hotový unikát zo skladu **nie je** výnimka – zákazník ho môže vrátiť do 14 dní.
  - Kurz na konkrétny termín je pravdepodobne výnimka (voľnočasová služba s určeným dátumom). Overiť presné znenie § 19 na slov-lex.sk.
  - Ak predávajúci o práve na odstúpenie nepoučí, lehota sa predĺži až o 12 mesiacov.

### Jazyk
- Chce anglickú verziu. Prepínač SK / EN, preklad cez AI.

### Písmo
- Bezpätkové písmo (sans-serif). Spomenuté: Canva Sans, Open Sans. Páči sa jej písmo „Môj ateliér“ (otázka 16).
- Dôsledok: prototyp má nadpisy v pätkovom Instrument Serif – treba ho vymeniť.
- Canva Sans je písmo z Canvy. Licenciu na použitie na webe treba overiť. Open Sans je voľne na Google Fonts.

---

## 13. Obchod a platby – plán (Next.js + Comgate)

**Rozhodnutie 10. 10. 2026:** celý web je v Next.js. WordPress sa zruší. Platby idú cez Comgate. Stripe ani WooPayments nepoužívame.

- **Produkty:** CMS priamo v Next.js (návrh: Payload CMS). Helenka v ňom pridáva diela. 48 produktov sa naimportuje z `docs/povodny-web/produkty.json`.
- **Platba:** Comgate. Stránku s kartou a 3D Secure robí Comgate. Web kartu nikdy nevidí.
- **Pred zrušením WordPressu:** exportovať objednávky, zákazníkov a faktúry. Potrebuje ich účtovníctvo. Spraviť zálohu celého webu.

### Comgate – zistené 10. 10. 2026
- REST API: `https://payments.comgate.cz/v2.0/`. Prihlásenie cez HTTP Basic (`merchant:secret` z klientskeho portálu).
- Vytvorenie platby: `POST /payment.json`. Povinné: `price` (v centoch), `curr`, `label` (1 – 16 znakov), `refId` (naše číslo objednávky), `method`, `fullName` a `email` alebo `phone`. Odpoveď vráti `transId` a `redirect`.
- Stav platby: `GET /payment/transId/{transId}.json`. Stavy: `PENDING`, `PAID`, `CANCELLED`, `AUTHORIZED`.
- Výsledok na pozadí: Comgate pošle správu na URL pre výsledok. Správe sa neverí, stav sa vždy overí cez API. Web musí vrátiť HTTP 200, inak Comgate opakuje až 1000-krát.
- Testovací režim: parameter `test: true`.
- IP whitelist: API je chránené zoznamom IP adries. Pri hostingu bez pevnej IP (Vercel) sa kontrola dá vypnúť v portáli. Potom treba dobre chrániť heslo (iba v env premenných).
- Zdroje: https://apidoc.comgate.cz/en/api/rest/ · https://apidoc.comgate.cz/en/faq

### Nastavenie v portáli Comgate
Integrácia → Nastavenie obchodu → Prepojenie obchodu:
1. API login a heslo.
2. Vypnúť IP whitelist (Vercel).
3. Návratové URL pre `PAID`, `CANCELLED`, `PENDING` a URL pre výsledok na pozadí.
4. E-mail pre chybové hlásenia (Integrácia → Kontaktné údaje).

### Čo Comgate vyžaduje pred spustením
Zdroj: https://help.comgate.eu/docs/en/how-to-get-a-payment-gateway
- Na webe: obchodné meno, sídlo, IČO, e-mail, telefón, popisy a ceny produktov, košík, obchodné podmienky, reklamačný poriadok, ochrana osobných údajov, podmienky dopravy a platby, HTTPS.
- Na zmluvu (Helenka): údaje firmy, bankový účet, 2 doklady totožnosti, doklad o vlastníctve účtu, overovacia platba 0,10 € (vráti sa), konečný užívateľ výhod, vyhlásenie o krajine pôvodu.
- Dĺžku schvaľovania Comgate neuvádza.

### Poplatky Comgate (cenník SK 2026)
- Tarifa Štart: platby kartou zadarmo do 2 000 € mesačne, nad to 1 %. Bez mesačného poplatku. Od 7. mesiaca prechod na inú tarifu (ceny overiť). Vrátenie platby 0,20 €.
- Tarifa Profi: karty EÚ 0,67 % + 0,04 €.
- Zdroje: https://www.comgate.cz/files/comgate-seur26pbsk.pdf · https://www.comgate.cz/files/comgate-peur26pbsk.pdf

### Postup platby
1. Zákazník vyplní pokladňu (údaje, doprava, platba).
2. Server prepočíta cenu z databázy, nie z prehliadača. Vytvorí objednávku „čaká na platbu“.
3. Server zarezervuje kusy. Takmer všetko sú unikáty, takže ten istý kus nesmú kúpiť dvaja naraz.
4. Server zavolá `POST /payment.json` a presmeruje zákazníka na `redirect`.
5. Comgate pošle výsledok. Server overí stav cez `GET /payment/transId/{transId}.json`.
6. `PAID`: objednávka je zaplatená, e-mail zákazníkovi aj Helenke. `CANCELLED`: rezervácia kusov sa zruší.

---

## 14. Rozdelenie práce (dohodnuté 10. 10. 2026)

Vývojár nie je právnik ani účtovník. Jeho práca je iba web a jednoduché napojenie Comgate.

### Robí vývojár
- Dizajn a vývoj webu v Next.js (stránky, obchod, košík, pokladňa).
- CMS, v ktorom Helenka pridáva diela.
- Napojenie Comgate podľa sekcie 13.
- Vloženie právnych textov, ktoré dodá Helenka. Text nepíše ani neupravuje.

### Dodá alebo vybaví Helenka
- **Právne texty:** obchodné podmienky, reklamačný poriadok, ochrana osobných údajov (GDPR), cookies, poučenie o odstúpení od zmluvy a formulár na odstúpenie. Napíše ich právnik alebo služba so vzormi pre e-shopy. Musia pokryť tovar (unikáty) aj kurzy (služba na termín).
- **Firemné údaje:** obchodné meno, IČO, DIČ / IČ DPH, sídlo, platiteľ DPH áno / nie.
- **Zmluva s Comgate** na jej meno. Vývojárovi dá prístup do portálu.
- **Fakturácia:** program a pravidlá faktúr určí ona a jej účtovník.
- **Doprava:** spôsoby, ceny, krajiny.
- **Obsah:** texty, fotky nových diel, súhlas so zverejnením recenzií.
- **Účty na jej meno:** doména, hosting, Comgate, fakturácia. Vývojár má iba prístup.

### Treba dohodnúť pred začatím
- Ktoré funkcie z poznámok (sekcia 12) idú do prvej verzie. Ostatné sú ďalšia práca za ďalšiu cenu.
- Či je automatická faktúra po zaplatení súčasťou zákazky.
- Údržba po spustení: kto a za koľko opravuje chyby a robí zmeny.
- Kto zálohuje a ruší starý WordPress (po exporte objednávok a faktúr).

---

## 15. Plán práce – všetko okrem platobnej brány (10. 10. 2026)

Stav 10. 10. 2026: hotová je iba domovská stránka (`app/page.tsx`). Menu a pätička odkazujú na stránky, ktoré ešte neexistujú (`/kurzy`, `/obchod`, `/o-mne`, `/blog`, `/kontakt`, `/obchodne-podmienky`, `/ochrana-osobnych-udajov`). Newsletter je iba atrapa.

Platobná brána Comgate (sekcia 13) sa robí až nakoniec. Pokladňa skončí tlačidlom „Zaplatiť“ a vytvorí objednávku v stave „čaká na platbu“.

Značka **[čaká: X]** znamená, že úloha potrebuje odpoveď od Helenky (otázka X v sekcii 11 alebo bod v správe zo sekcie 14).

Odhad spolu: asi 3 týždne práce.

### Najprv vzhľad (rozhodnutie 10. 10. 2026)
CMS, databáza, e-maily a hosting (fáza 0 a 3) sú zatiaľ odložené. Najprv robíme to, čo je vidieť: fázu 1, fázu 2 a obchod z fázy 4. Obchod číta produkty zo statického `docs/povodny-web/produkty.json`, CMS ho nahradí neskôr. Formuláre zatiaľ iba ako vzhľad, bez odosielania.

Poradie:
1. ~~Fáza 1 – diela pred kurzami, bezpätkové písmo.~~ Hotové 10. 10. 2026.
2. ~~`/kurzy`~~ Hotové 10. 10. 2026.
3. ~~`/o-mne` a `/kontakt`~~ Hotové 10. 10. 2026.
4. ~~**Anglická verzia (prepínač SK / EN).** Robí sa pred ďalšími stránkami, aby nové stránky vznikali rovno v dvoch jazykoch. Slovenčina ostáva na `/`, angličtina na `/en/...` (rovnako ako na starom webe). Texty preložené raz cez AI a uložené v súboroch. Nie automatický prekladač za behu – ten na starom webe prekladal zle (sekcia 10). Postup podľa návodu na internacionalizáciu v `node_modules/next/dist/docs/`.~~ Hotové 10. 10. 2026. [čaká: 21 – kontrola anglických textov]
5. ~~`/obchod` a `/obchod/[slug]` zo statických dát. Najprv stiahnuť 128 fotiek produktov do `public/images/produkty/` (starý web má firewall, treba hlavičky prehliadača). Filter podľa kategórie a základné triedenie: najnovšie, cena od najnižšej, cena od najvyššej. Vypredané kusy na konci, jemne zosivené.~~ Hotové 10. 10. 2026. [čaká: 1 – DPH, 2 – doprava, 7 – názvy produktov]
6. ~~Info lišta hore na stránke so statickým textom, dá sa zavrieť. Text v súbore v `content/`.~~ Hotové 10. 10. 2026. [čaká: aktuálny oznam od Helenky]
7. ~~Formulár na kontakte s výberom „Otázka“ / „Teambuilding pre firmy“. Pri teambuildingu ďalšie polia: firma, miesto (ateliér / priestory firmy), počet ľudí, spoločné dielo / každý vlastné, predbežný termín. Tlačidlo v sekcii teambuilding na `/kurzy` otvorí formulár s predvoleným teambuildingom. Zatiaľ iba vzhľad, nič neodosiela.~~ Hotové 10. 10. 2026. [čaká: 15 – formulár pre HR áno / nie]
8. ~~Právne stránky: `/obchodne-podmienky`, `/reklamacny-poriadok`, `/ochrana-osobnych-udajov`, `/cookies`. Zatiaľ **vzorový text** so zástupnými údajmi `[doplniť: IČO]` a pod. Hore viditeľný pruh „Vzorový text – čaká na znenie od právnika“. Nekopírovať podmienky iných e-shopov. Konečné znenie dodá Helenka (sekcia 14).~~ Hotové 10. 10. 2026. [čaká: 1 – právne údaje e-shopu, právne texty od Helenky]
9. ~~`/blog` a `/blog/[slug]` (2 pôvodné články, sekcia 5.6), stránka 404.~~ Hotové 10. 10. 2026.

### Fáza 0 – Technické rozhodnutia (odložené)
- [ ] CMS: potvrdiť Payload CMS v Next.js (Next.js 16 podporuje od verzie 3.73 – overiť v release notes).
- [ ] Databáza pre Payload (Postgres) a úložisko fotiek. Vybrať poskytovateľa.
- [ ] Služba na odosielanie e-mailov (kontaktný formulár, teambuilding, potvrdenie objednávky).
- [ ] Hosting: Vercel Pro (komerčný web nesmie byť na bezplatnom pláne) alebo iný.

### Fáza 1 – Opravy prototypu (asi 1 h, dá sa hneď)
- [x] Domovská stránka: diela pred kurzami (`app/page.tsx`).
- [x] Nadpisy v bezpätkovom písme namiesto Instrument Serif. Dočasne Open Sans. Písmo sa mení na jednom mieste v `app/layout.tsx`. [čaká: 16 – písmo „Môj ateliér“]

### Fáza 2 – Statické stránky (2 – 3 dni, dáta sú v sekciách 5 a 6)
- [x] `/kurzy` – cenník ako text (nie obrázok), termíny, podmienky, sezóna jeseň / jar. Údaje sú zo sekcie 6, po odpovedi na otázku 5 ich overiť. [čaká: 5 – platné termíny a ceny]
- [x] `/kurzy` – sekcia teambuilding pre firmy. Tlačidlo otvorí formulár na `/kontakt` s predvoleným teambuildingom (bod 7). [čaká: 15 – formulár pre HR áno / nie]
- [x] `/o-mne`
- [x] `/kontakt` – kontakty, mapa, formulár (iba vzhľad). Zatiaľ s info@keramikahelienka.sk. [čaká: 3 – hlavný e-mail]
- [x] `/blog` a `/blog/[slug]` – 2 pôvodné články.
- [x] Stránka 404 (`app/global-not-found.tsx`, po slovensky aj anglicky).

### Fáza 3 – CMS a produkty (3 – 4 dni)
- [x] CMS v projekte, administrácia na `/admin`. Namiesto Payload je to Supabase + Cloudinary (rozhodnutie 21. 10. 2026). Čaká na Supabase projekt a kľúče.
- [ ] Kolekcie: produkty (názov, slug, cena, akciová cena, kategória, fotky, popis, sklad, misa mesiaca), kategórie, blog, objednávky. Hotové 21. 10. 2026: produkty s kódom `KH-0001`, história cien, objednávky s položkami a históriou stavov, admini. Zostáva akciová cena (otázka 18) a blog.
- [ ] Globálne nastavenia: info lišta, kontakty.
- [ ] Import 48 produktov z `docs/povodny-web/produkty.json` vrátane fotiek. Pripravené: `npm run seed:produkty` alebo tlačidlo v `/admin`. Spustiť po vytvorení Supabase projektu.
- [ ] Opraviť chyby v produktoch zo sekcie 10 (zlé popisy, kategórie, slugy, preklepy, alt texty). [čaká: 7 – jazyk názvov]
- [ ] Právne stránky ako stránky v CMS. Helenka do nich vloží texty sama, bez vývojára.

### Fáza 4 – Obchod bez platby (asi 3 dni)
- [x] `/obchod` – zoznam, filter podľa kategórie, jednoduché triedenie. Zatiaľ zo statického `produkty.json`.
- [x] Vypredané kusy ako galéria, jemne zosivené.
- [x] `/obchod/[slug]` – detail produktu. Tlačidlo „Pridať do košíka“ je zatiaľ iba vzhľad.
- [ ] Misa mesiaca na domovskej stránke a v obchode, so zľavnenou cenou. [čaká: 18]
- [x] Domovská stránka berie diela z CMS (prepínač „na domovskej“ pri produkte), nie z `content/diela.ts`.
- [x] Košík (`/kosik`). Reálne funguje – pridáva/odoberá/pamätá si položky v localStorage prehliadača, badge v headri. Bez CMS/DB zatiaľ nič nerezervuje.
- [x] Pokladňa (`/pokladna`): údaje zákazníka, doprava (iba osobný odber je reálna možnosť, kuriér čaká na odpoveď 2), súhlas s podmienkami. Vytvorí objednávku v stave „čaká na platbu“ – uloženú len v prehliadači (`/pokladna/hotovo`), nikam sa neodosiela. Rezervácia kusov, e-mail a platba cez Comgate prídu s backendom (fáza 3) a §13. [čaká: 2 – doprava]

### Fáza 5 – Funkcie z poznámok (3 – 5 dní, podľa výberu Helenky)
- [x] Info lišta hore na stránke (text z CMS). [čaká: aktuálny oznam od Helenky]
- [ ] Kontaktný formulár a formulár na teambuilding (odosielanie e-mailom).
- [ ] Newsletter. [čaká: 8 – nástroj]
- [x] Anglická verzia s prepínačom SK / EN, preklad cez AI. [čaká: 21 – kontrola anglických textov]
- [ ] Hodnotenia z Instagramu. [čaká: 19]
- [ ] Rezervácie kurzov – samostatný veľký projekt, iba ak ho Helenka chce v prvej verzii.

### Fáza 6 – Pred spustením (asi 2 dni)
- [x] SEO: title a description pre každú stránku, OG obrázky, `sitemap.xml`, `robots.txt`, štruktúrované dáta produktov. Hotové 20. 10. 2026. Po nasadení: overiť web v Google Search Console a poslať sitemapu.
- [x] Presmerovania 301 zo starých URL (sekcia 4) v `next.config.ts`. Hotové 21. 10. 2026.
- [x] Cookie lišta a analytika (GTM, GA4, Clarity) so súhlasom. Hotové 20. 10. 2026. Po nasadení: zadať ID do env premenných na hostingu. [čaká: účty Google Analytics, GTM a Clarity na meno Helenky]
- [ ] Funkcia „odstúpiť od zmluvy tu“ podľa § 20a zákona č. 108/2024 Z. z. (formulár + potvrdenie e-mailom). Povinná pre e-shop. Potom doplniť jej adresu do obchodných podmienok.
- [ ] Právnik skontroluje návrhy právnych textov v `content/pravne.ts`, potom zrušiť `noindex` a pruh „Návrh“. [čaká: firemné údaje a rozhodnutia Helenky]
- [ ] Nasadenie: hosting, doména, databáza, env premenné.
- [ ] Záloha WordPressu a export objednávok a faktúr. Až potom zrušiť starý web.

### Až nakoniec
- [ ] Platobná brána Comgate podľa sekcie 13. [čaká: zmluva Helenky s Comgate a právne texty]
