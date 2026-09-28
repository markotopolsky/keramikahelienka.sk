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
3. **Kontaktný e-mail.** Ktorý je hlavný: info@keramikahelienka.sk alebo helena.sochnova@gmail.com?
4. **Kamenné predajne.** Platí ešte Place store (Hurbanovo nám. 1) a Predajňa František (Františkánske nám. 2)?
5. **Kurzy.** Platia termíny Ut / St / Št? Platí nepravidelný kurz (192 / 170 / 150 €) a jednorazový vstup 51 €? Veková hranica detí: obrázok uvádza „6 – 9,99“, formulár „6 – 10“.
6. **Anglická verzia.** Chce ju? Ak áno, kto dodá preklad?
7. **Názvy produktov.** Zjednotiť do slovenčiny (s anglickým prekladom)?
8. **Newsletter.** Používa ešte Mailchimp? Chce odber „Listy z ateliéru“?
9. **Yoga pobyt.** Bude ďalší ročník? Ponechať stránku ako archív?
10. **Meno.** Presný tvar: „Helena Sochnová“ (s dĺžňom)?
11. **Recenzie.** Máme súhlas použiť mená? Má ďalšie recenzie?
12. **Galéria a Workshopy.** Chce tieto sekcie? Dodá fotky?
13. **Sashe.sk.** Predáva ešte cez Sashe? Máme tam odkazovať?
