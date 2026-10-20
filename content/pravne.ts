// Legal pages (ZAZNAMNIK.md section 15, step 8). DRAFTS written on 20 Oct 2026 at the developer's
// request from the current statutes on slov-lex.sk (text valid from 27 Sep 2026), not copied from other shops:
// - consumer protection act no. 108/2024 Z. z. (§ 19 – § 22 withdrawal, § 20a online withdrawal
//   function, annex 2 the model withdrawal form, § 4 ods. 2 písm. j) defects of services),
// - Civil Code §§ 619 – 624 as amended by 108/2024 (liability for defects of goods),
// - act no. 391/2015 Z. z. on alternative dispute resolution, GDPR and act no. 18/2018 Z. z.,
// - act no. 452/2021 Z. z. on electronic communications, § 109 ods. 8 (cookies need consent).
// A lawyer must check them before launch. [[gap]] marks what only Helena can decide or supply.
//
// Text format: [[gap]] renders as a visible "doplniť"; the gap text stays as a note in the source.
import type { Localized } from "@/lib/i18n";
import { kontakt } from "@/content/atelier";

export type Blok = string | { zoznam: string[] };
export type Sekcia = { nadpis: string; bloky: Blok[] };

export type PravnaStranka = {
  slug: string;
  nazov: Localized;
  uvod: Localized;
  sekcie: Localized<Sekcia[]>;
};

const telefonMedzinarodny = "+421 903 394 212";

const predavajuci: Localized<Blok[]> = {
  sk: [
    {
      zoznam: [
        "Obchodné meno: [[obchodné meno]]",
        "Sídlo alebo miesto podnikania: [[sídlo]]",
        "IČO: [[IČO]]",
        "DIČ / IČ DPH: [[DIČ, IČ DPH – platiteľ DPH áno / nie, otázka 1]]",
        "Zápis v registri: [[živnostenský alebo obchodný register, číslo]]",
        `Ateliér: ${kontakt.ulica}, ${kontakt.mesto}`,
        `E-mail: ${kontakt.email}`,
        `Telefón: ${kontakt.telefon}`,
      ],
    },
  ],
  en: [
    {
      zoznam: [
        "Business name: [[obchodné meno]]",
        "Registered office: [[sídlo]]",
        "Company ID (IČO): [[IČO]]",
        "Tax / VAT ID: [[DIČ, IČ DPH – platiteľ DPH áno / nie, otázka 1]]",
        "Registration: [[živnostenský alebo obchodný register, číslo]]",
        `Studio: ${kontakt.ulica}, ${kontakt.mesto}`,
        `Email: ${kontakt.email}`,
        `Phone: ${telefonMedzinarodny}`,
      ],
    },
  ],
};

const dozor: Localized<Blok> = {
  sk: "Orgán dozoru: Slovenská obchodná inšpekcia, Inšpektorát SOI pre Bratislavský kraj, Bajkalská 21/A, 827 99 Bratislava, www.soi.sk.",
  en: "Supervisory authority: Slovak Trade Inspection (Slovenská obchodná inšpekcia), Inspectorate for the Bratislava Region, Bajkalská 21/A, 827 99 Bratislava, www.soi.sk.",
};

const sporySekcia: Localized<Sekcia> = {
  sk: {
    nadpis: "Riešenie sporov",
    bloky: [
      `Ak nie ste spokojní s tým, ako sme vybavili vašu reklamáciu, alebo si myslíte, že sme porušili vaše práva, napíšte nám na ${kontakt.email} so žiadosťou o nápravu.`,
      "Ak vašu žiadosť zamietneme alebo na ňu neodpovieme do 30 dní od jej odoslania, môžete podať návrh na alternatívne riešenie sporu podľa zákona č. 391/2015 Z. z. Príslušným subjektom je Slovenská obchodná inšpekcia (Bajkalská 21/A, P. O. BOX 29, 827 99 Bratislava, ars@soi.sk) alebo iný subjekt zo zoznamu na webe Ministerstva hospodárstva SR. Riešenie sporu pred SOI je bezplatné.",
      dozor.sk,
    ],
  },
  en: {
    nadpis: "Dispute resolution",
    bloky: [
      `If you are not satisfied with how we handled your complaint, or you believe we have violated your rights, write to us at ${kontakt.email} and ask us to put it right.`,
      "If we reject your request or do not reply within 30 days of it being sent, you can file a proposal for alternative dispute resolution under Act No. 391/2015 Coll. The competent body is the Slovak Trade Inspection (Bajkalská 21/A, P. O. BOX 29, 827 99 Bratislava, ars@soi.sk) or another body on the list kept by the Slovak Ministry of Economy. Dispute resolution before the Slovak Trade Inspection is free of charge.",
      dozor.en,
    ],
  },
};

export const pravneStranky: PravnaStranka[] = [
  {
    slug: "obchodne-podmienky",
    nazov: { sk: "Obchodné podmienky", en: "Terms and conditions" },
    uvod: {
      sk: "Podmienky nákupu v e-shope a účasti na kurzoch a workshopoch v ateliéri Keramika He-lienka.",
      en: "Terms for buying in the online shop and for taking part in classes and workshops at the Keramika He-lienka studio.",
    },
    sekcie: {
      sk: [
        { nadpis: "Predávajúci", bloky: [...predavajuci.sk, dozor.sk] },
        {
          nadpis: "Úvodné ustanovenia",
          bloky: [
            "Tieto obchodné podmienky upravujú kúpu tovaru v e-shope na www.keramikahelienka.sk a účasť na kurzoch a workshopoch v ateliéri. Kupujúci je spotrebiteľ alebo podnikateľ, ktorý si u nás objedná tovar alebo službu.",
            "Spotrebiteľom je fyzická osoba, ktorá nakupuje mimo svojho podnikania. Ak nakupujete ako podnikateľ (napríklad teambuilding pre firmu), ustanovenia o ochrane spotrebiteľa sa na vás nevzťahujú a vzťah sa riadi Obchodným zákonníkom.",
          ],
        },
        {
          nadpis: "Tovar",
          bloky: [
            "Každý kus je ručne robený v ateliéri a väčšinou existuje iba raz. Fotografie zobrazujú konkrétny kus. Farba glazúry sa na rôznych obrazovkách môže mierne líšiť.",
            "Ak si rovnaký kus v tom istom čase objednajú dvaja kupujúci, zmluva vznikne s tým, koho objednávku potvrdíme skôr. Druhému kupujúcemu to oznámime a vrátime všetko, čo zaplatil.",
          ],
        },
        {
          nadpis: "Objednávka a uzavretie zmluvy",
          bloky: [
            "Tovar vložíte do košíka a v pokladni vyplníte meno, e-mail, telefón a spôsob dopravy. Pred odoslaním vidíte súhrn objednávky s celkovou cenou a môžete ho opraviť.",
            "Objednávku odošlete tlačidlom „Zaplatiť“. Tým podávate návrh na uzavretie kúpnej zmluvy a zaväzujete sa zaplatiť cenu.",
            "Kúpna zmluva vzniká, keď vám e-mailom potvrdíme prijatie objednávky. [[overiť s právnikom: zmluva vzniká potvrdením objednávky alebo prijatím platby]]",
          ],
        },
        {
          nadpis: "Ceny a platba",
          bloky: [
            "Ceny sú uvedené v eurách. [[ceny s DPH alebo bez DPH – otázka 1]]",
            "Platiť môžete kartou cez platobnú bránu Comgate. Údaje o karte zadávate priamo na stránke Comgate, my ich nevidíme. [[ďalšie spôsoby platby – prevod na účet, hotovosť pri osobnom odbere]]",
            "Faktúru vám pošleme e-mailom. [[kedy a z akého programu – otázka 14]]",
          ],
        },
        {
          nadpis: "Doprava a dodanie",
          bloky: [
            `Osobný odber v ateliéri (${kontakt.ulica}, Bratislava) je zadarmo. Termín odberu si dohodneme e-mailom alebo telefonicky.`,
            "[[ďalšie spôsoby dopravy, ceny, krajiny – otázka 2]]",
            "Tovar dodáme najneskôr do [[dodacia lehota, zákon pripúšťa najviac 30 dní]] od uzavretia zmluvy.",
          ],
        },
        {
          nadpis: "Odstúpenie od zmluvy",
          bloky: [
            "Tovar kúpený v e-shope: ako spotrebiteľ máte právo odstúpiť od zmluvy bez uvedenia dôvodu v lehote 14 dní (§ 19 a § 20 zákona č. 108/2024 Z. z.). Lehota uplynie po 14 dňoch odo dňa, keď vy alebo vami určená tretia osoba okrem dopravcu prevezmete tovar.",
            `Pri uplatnení práva na odstúpenie od zmluvy nás informujte o svojom rozhodnutí jednoznačným vyhlásením, napríklad listom zaslaným poštou na adresu [[sídlo]] alebo e-mailom na ${kontakt.email}. Môžete použiť vzorový formulár nižšie, jeho použitie však nie je povinné. Lehota je zachovaná, ak oznámenie odošlete pred jej uplynutím.`,
            "Právo na odstúpenie od zmluvy môžete uplatniť aj online cez funkciu „odstúpiť od zmluvy tu“ na adrese [[stránka s funkciou na odstúpenie – § 20a, doplní vývojár]]. Potvrdenie o doručení odstúpenia vrátane jeho obsahu, dátumu a času odoslania vám bezodkladne pošleme e-mailom.",
            "Po odstúpení od zmluvy vám vrátime všetky platby, ktoré ste uhradili v súvislosti s uzavretím zmluvy, vrátane nákladov na doručenie tovaru k vám. To sa nevzťahuje na dodatočné náklady, ak ste si zvolili iný druh doručenia, ako je najlacnejší bežný spôsob doručenia, ktorý ponúkame. Platby vrátime najneskôr do 14 dní odo dňa, keď nám bude doručené vaše oznámenie o odstúpení, rovnakým spôsobom, aký ste použili pri platbe, bez akýchkoľvek ďalších poplatkov.",
            "S vrátením platby môžeme čakať do vrátenia tovaru späť na našu adresu alebo do preukázania, že ste tovar odoslali späť, podľa toho, čo nastane skôr.",
            `Tovar nám zašlite späť alebo ho prineste do ateliéru (${kontakt.ulica}, Bratislava) najneskôr do 14 dní odo dňa uplatnenia práva na odstúpenie od zmluvy. Lehota je zachovaná, ak tovar odošlete pred jej uplynutím. Keramiku dobre zabaľte.`,
            "Priame náklady na vrátenie tovaru znášate vy. [[rozhodne Helenka: alebo ich znáša ateliér]]",
            "Zodpovedáte len za akékoľvek zníženie hodnoty tovaru v dôsledku zaobchádzania s ním iným spôsobom, aký je potrebný na zistenie povahy, vlastností a funkčnosti tovaru.",
            {
              zoznam: [
                "Kurzy a workshopy na presne dohodnutý termín: podľa § 19 ods. 1 písm. l) zákona č. 108/2024 Z. z. pri nich nemáte právo na odstúpenie bez uvedenia dôvodu. Platia storno podmienky v časti Kurzy a workshopy.",
                "Tovar vyrobený podľa vašich požiadaviek (zákazka na mieru): podľa § 19 ods. 1 písm. c) toho istého zákona pri ňom nemáte právo na odstúpenie bez uvedenia dôvodu.",
              ],
            },
          ],
        },
        {
          nadpis: "Vzorový formulár na odstúpenie od zmluvy",
          bloky: [
            "Vyplňte a zašlite tento formulár, len ak si želáte odstúpiť od zmluvy (príloha č. 2 zákona č. 108/2024 Z. z.):",
            {
              zoznam: [
                `Komu: [[obchodné meno]], [[sídlo]], ${kontakt.email}`,
                "Týmto oznamujem/oznamujeme*, že odstupujem/odstupujeme* od zmluvy o dodaní alebo poskytnutí tohto produktu: …",
                "Dátum objednania/dátum prijatia*: …",
                "Meno a priezvisko spotrebiteľa/spotrebiteľov*: …",
                "Adresa spotrebiteľa/spotrebiteľov*: …",
                "Podpis spotrebiteľa/spotrebiteľov* (ak sa tento formulár podáva v listinnej podobe): …",
                "Dátum: …",
              ],
            },
            "* Nehodiace sa prečiarknite.",
          ],
        },
        {
          nadpis: "Kurzy a workshopy",
          bloky: [
            "Podmienky zo súčasného formulára prihlášky na kurz:",
            {
              zoznam: [
                "Prihláška – cez formulár alebo v ateliéri. Bez zaplatenia je nezáväzná. Rezervácia platí dňom úhrady.",
                "Platba – najneskôr 7 dní pred kurzom. V cene sú pomôcky, materiál, uskladnenie výrobkov počas sušenia, dva výpaly, malé občerstvenie a lektorka.",
                "Storno – pri zrušení najneskôr 3 dni pred kurzom sa vracia 50 %. Pri skoršom zrušení sa vracia celá suma alebo je možný iný kurz. [[overiť: „skôr“ znamená koľko dní pred kurzom]]",
                "Vynechaná lekcia mesačného kurzu – dá sa nahradiť v predplatenom období. Neúčasť treba ohlásiť 48 hodín vopred, inak termín prepadá.",
                "Zmeny – ateliér si vyhradzuje zmenu dátumu a miesta. Oznámi ju e-mailom alebo SMS. Ak vám nový termín nevyhovuje, vrátime celú sumu.",
                "Bezpečnosť – v ateliéri dodržiavajte pokyny lektorky. Za deti zodpovedá ich zákonný zástupca, ak sa nedohodneme inak.",
                "Hotové výrobky si vyzdvihnete v ateliéri po druhom výpale. [[ako dlho na ne ateliér čaká]]",
              ],
            },
            "Vady kurzu (služby) môžete vytknúť bez zbytočného odkladu e-mailom alebo osobne. Bezodkladne vám písomne potvrdíme vytknutie vady a lehotu na jej odstránenie, najviac 30 dní (§ 4 ods. 2 písm. j) zákona č. 108/2024 Z. z.).",
          ],
        },
        {
          nadpis: "Darčekové poukážky",
          bloky: [
            "Poukážku na kurz alebo nákup vám pošleme poštou alebo e-mailom. Platí do dátumu uvedeného na poukážke: [[doba platnosti]]. Po uplynutí platnosti prepadá.",
            "Poukážka nie je kurz na presný termín, preto pri nej môžete odstúpiť od zmluvy do 14 dní od jej prevzatia, ak ste ju ešte nepoužili.",
          ],
        },
        {
          nadpis: "Zodpovednosť za vady a reklamácie",
          bloky: ["Za vady tovaru zodpovedáme podľa Občianskeho zákonníka. Postup je v Reklamačnom poriadku."],
        },
        {
          nadpis: "Osobné údaje",
          bloky: ["Ako spracúvame vaše osobné údaje, popisuje stránka Ochrana osobných údajov."],
        },
        sporySekcia.sk,
        {
          nadpis: "Záverečné ustanovenia",
          bloky: [
            "Vzťahy, ktoré tieto podmienky neupravujú, sa riadia právom Slovenskej republiky, najmä Občianskym zákonníkom a zákonom č. 108/2024 Z. z. o ochrane spotrebiteľa.",
            "Podmienky môžeme zmeniť. Na objednávku platia podmienky účinné v čase jej odoslania.",
            "Tieto obchodné podmienky sú účinné od [[dátum účinnosti]].",
          ],
        },
      ],
      en: [
        { nadpis: "Seller", bloky: [...predavajuci.en, dozor.en] },
        {
          nadpis: "Introduction",
          bloky: [
            "These terms govern buying goods in the online shop at www.keramikahelienka.sk and taking part in classes and workshops at the studio. The buyer is a consumer or a business that orders goods or a service from us.",
            "A consumer is a natural person buying outside their business. If you buy as a business (for example a team building for a company), the consumer protection rules do not apply to you and the relationship is governed by the Slovak Commercial Code.",
          ],
        },
        {
          nadpis: "Goods",
          bloky: [
            "Every piece is made by hand in the studio and usually exists only once. The photos show the actual piece. The colour of the glaze may look slightly different on different screens.",
            "If two buyers order the same piece at the same time, the contract is made with the one whose order we confirm first. We let the other buyer know and refund everything they paid.",
          ],
        },
        {
          nadpis: "Orders and conclusion of the contract",
          bloky: [
            "You put goods in the cart and at checkout fill in your name, email, phone and delivery method. Before sending you see a summary of the order with the total price and can correct it.",
            "You send the order with the “Pay” button. By doing so you propose a purchase contract and commit to paying the price.",
            "The purchase contract is concluded when we confirm receipt of your order by email. [[overiť s právnikom: zmluva vzniká potvrdením objednávky alebo prijatím platby]]",
          ],
        },
        {
          nadpis: "Prices and payment",
          bloky: [
            "Prices are in euros. [[ceny s DPH alebo bez DPH – otázka 1]]",
            "You can pay by card through the Comgate payment gateway. You enter your card details directly on Comgate's page; we never see them. [[ďalšie spôsoby platby – prevod na účet, hotovosť pri osobnom odbere]]",
            "We send the invoice by email. [[kedy a z akého programu – otázka 14]]",
          ],
        },
        {
          nadpis: "Delivery",
          bloky: [
            `Pickup at the studio (${kontakt.ulica}, Bratislava) is free. We agree on the pickup time by email or phone.`,
            "[[ďalšie spôsoby dopravy, ceny, krajiny – otázka 2]]",
            "We deliver the goods within [[dodacia lehota, zákon pripúšťa najviac 30 dní]] of the conclusion of the contract.",
          ],
        },
        {
          nadpis: "Withdrawal from the contract",
          bloky: [
            "Goods bought in the online shop: as a consumer you have the right to withdraw from the contract within 14 days without giving any reason (§ 19 and § 20 of Act No. 108/2024 Coll.). The withdrawal period expires 14 days after the day on which you, or a third party other than the carrier indicated by you, take possession of the goods.",
            `To exercise the right of withdrawal, inform us of your decision by an unequivocal statement, for example a letter sent by post to [[sídlo]] or an email to ${kontakt.email}. You may use the model withdrawal form below, but it is not obligatory. The deadline is met if you send your notice before the withdrawal period has expired.`,
            "You can also withdraw online with the “withdraw from the contract here” function at [[stránka s funkciou na odstúpenie – § 20a, doplní vývojár]]. We will email you a confirmation of receipt without delay, including its content and the date and time it was sent.",
            "If you withdraw from the contract, we will reimburse all payments received from you in connection with the contract, including the costs of delivery to you. This does not apply to supplementary costs if you chose a type of delivery other than the least expensive standard delivery we offer. We will make the reimbursement no later than 14 days from the day we receive your withdrawal notice, using the same means of payment you used, without any fees.",
            "We may withhold reimbursement until we have received the goods back or you have supplied evidence of having sent them back, whichever is earlier.",
            `Send the goods back or bring them to the studio (${kontakt.ulica}, Bratislava) no later than 14 days from the day you withdraw from the contract. The deadline is met if you send the goods before it expires. Please pack ceramics carefully.`,
            "You bear the direct cost of returning the goods. [[rozhodne Helenka: alebo ich znáša ateliér]]",
            "You are only liable for any diminished value of the goods resulting from handling other than what is necessary to establish their nature, characteristics and functioning.",
            {
              zoznam: [
                "Classes and workshops on a fixed date: under § 19(1)(l) of Act No. 108/2024 Coll. there is no right to withdraw without giving a reason. The cancellation terms in Classes and workshops apply.",
                "Goods made to your specification (custom orders): under § 19(1)(c) of the same act there is no right to withdraw without giving a reason.",
              ],
            },
          ],
        },
        {
          nadpis: "Model withdrawal form",
          bloky: [
            "Complete and return this form only if you wish to withdraw from the contract (annex 2 of Act No. 108/2024 Coll.):",
            {
              zoznam: [
                `To: [[obchodné meno]], [[sídlo]], ${kontakt.email}`,
                "I/We* hereby give notice that I/We* withdraw from my/our* contract for the supply or provision of the following product: …",
                "Ordered on/received on*: …",
                "Name of consumer(s): …",
                "Address of consumer(s): …",
                "Signature of consumer(s) (only if this form is sent on paper): …",
                "Date: …",
              ],
            },
            "* Delete as appropriate.",
          ],
        },
        {
          nadpis: "Classes and workshops",
          bloky: [
            "Conditions from the current class sign-up form:",
            {
              zoznam: [
                "Sign-up – through the form or at the studio. It is not binding until paid. The booking is valid from the day of payment.",
                "Payment – at least 7 days before the class. The price includes tools, materials, storage of your pieces while they dry, two firings, light refreshments and the teacher.",
                "Cancellation – 50 % is refunded for cancellations up to 3 days before the class. Earlier cancellations get a full refund or another class. [[overiť: „skôr“ znamená koľko dní pred kurzom]]",
                "A missed lesson of a monthly course can be made up within the prepaid period. Absence must be announced 48 hours in advance, otherwise the session is lost.",
                "Changes – the studio may change the date and place. It announces changes by email or text message. If the new date does not suit you, we refund the full amount.",
                "Safety – follow the teacher's instructions in the studio. Children are the responsibility of their legal guardian unless agreed otherwise.",
                "You collect your finished pieces at the studio after the second firing. [[ako dlho na ne ateliér čaká]]",
              ],
            },
            "You can report defects of a class (a service) without undue delay by email or in person. We will confirm the report in writing without delay, with the period for fixing the defect of no more than 30 days (§ 4(2)(j) of Act No. 108/2024 Coll.).",
          ],
        },
        {
          nadpis: "Gift vouchers",
          bloky: [
            "We send a voucher for a class or a purchase by post or email. It is valid until the date shown on it: [[doba platnosti]]. It expires after that date.",
            "A voucher is not a class on a fixed date, so you can withdraw from the contract within 14 days of receiving it, as long as you have not used it.",
          ],
        },
        {
          nadpis: "Liability for defects and complaints",
          bloky: ["We are liable for defects of goods under the Slovak Civil Code. The procedure is in the Complaints policy."],
        },
        {
          nadpis: "Personal data",
          bloky: ["How we process your personal data is described on the Privacy policy page."],
        },
        sporySekcia.en,
        {
          nadpis: "Final provisions",
          bloky: [
            "Matters not covered by these terms are governed by Slovak law, in particular the Civil Code and Act No. 108/2024 Coll. on consumer protection.",
            "We may change these terms. An order is governed by the terms in effect when it was sent.",
            "These terms and conditions are effective from [[dátum účinnosti]].",
          ],
        },
      ],
    },
  },
  {
    slug: "reklamacny-poriadok",
    nazov: { sk: "Reklamačný poriadok", en: "Complaints policy" },
    uvod: {
      sk: "Ako postupovať, ak má kúpený výrobok vadu.",
      en: "What to do if a piece you bought has a defect.",
    },
    sekcie: {
      sk: [
        { nadpis: "Predávajúci", bloky: predavajuci.sk },
        {
          nadpis: "Na čo sa vzťahuje",
          bloky: [
            "Tento reklamačný poriadok platí pre tovar kúpený v e-shope aj v ateliéri. Zákon od 1. júla 2024 hovorí namiesto „reklamácie“ o „vytknutí vady“. Obe slová tu znamenajú to isté.",
          ],
        },
        {
          nadpis: "Zodpovednosť za vady",
          bloky: [
            "Zodpovedáme za akúkoľvek vadu, ktorú má tovar v čase dodania a ktorá sa prejaví do dvoch rokov od dodania (§ 619 Občianskeho zákonníka).",
            "Ak sa vada prejaví v tejto dobe, predpokladá sa, že ju tovar mal už pri dodaní, ak sa nepreukáže opak (§ 620).",
            "Vadu treba vytknúť do dvoch mesiacov od jej zistenia, najneskôr do uplynutia dvoch rokov od dodania (§ 621 ods. 3).",
          ],
        },
        {
          nadpis: "Ručne robená keramika",
          bloky: [
            "Každý kus je ručne modelovaný a glazovaný. Drobné nerovnosti, rozdiely vo farbe a toku glazúry, stopy po ručnej práci a malé bublinky v glazúre sú vlastnosťou ručnej výroby uvedenou v opise tovaru, nie vadou.",
            "Kúsky zdobené zlatom nie sú vhodné do mikrovlnnej rúry ani do umývačky riadu. Poškodenie z takého použitia nie je vada.",
            "[[ďalšie pokyny na používanie a údržbu – vodotesnosť váz, potraviny, mráz]]",
          ],
        },
        {
          nadpis: "Ako vytknúť vadu",
          bloky: [
            {
              zoznam: [
                `E-mailom na ${kontakt.email} alebo telefonicky na ${kontakt.telefon}.`,
                `Osobne v ateliéri, ${kontakt.ulica}, Bratislava, po dohode o čase.`,
                "Poštou na adresu [[sídlo alebo adresa na zasielanie tovaru]].",
              ],
            },
            "Uveďte svoje meno, číslo objednávky alebo doklad o kúpe, popis vady a ak sa dá, priložte fotografie. Ak je na posúdenie potrebný samotný tovar, dohodneme sa, ako nám ho odovzdáte. Náklady na prevzatie tovaru znášame my (§ 623 ods. 4).",
          ],
        },
        {
          nadpis: "Potvrdenie a lehota",
          bloky: [
            "Bezodkladne vám písomne (aj e-mailom) potvrdíme, že ste vadu vytkli. V potvrdení uvedieme lehotu, v ktorej vadu odstránime. Lehota nesmie byť dlhšia ako 30 dní odo dňa vytknutia vady, ak dlhšia lehota nie je odôvodnená objektívnym dôvodom, ktorý nemôžeme ovplyvniť (§ 622 ods. 3).",
            "Ak zodpovednosť za vadu odmietneme, dôvody vám oznámime písomne. Ak potom znaleckým posudkom alebo odborným stanoviskom preukážete, že za vadu zodpovedáme, môžete ju vytknúť znova a odmietnuť ju už nemôžeme (§ 622 ods. 4).",
          ],
        },
        {
          nadpis: "Vaše práva",
          bloky: [
            {
              zoznam: [
                "Odstránenie vady opravou alebo výmenou za iný kus. Spôsob si zvolíte vy, ak je možný a nespôsobí neprimerané náklady (§ 623). Unikátny ručne robený kus často nemožno vymeniť za rovnaký.",
                "Primeraná zľava z ceny alebo odstúpenie od zmluvy, ak vadu neodstránime, odmietneme ju odstrániť, ak sa vada opakuje, ak je taká závažná, že to odôvodňuje okamžitú zľavu alebo odstúpenie, alebo ak je zrejmé, že ju neodstránime včas (§ 624). Pri zanedbateľnej vade od zmluvy odstúpiť nemožno.",
                "Po odstúpení vám kúpnu cenu vrátime najneskôr do 14 dní od vrátenia tovaru alebo od preukázania, že ste ho odoslali, rovnakým spôsobom, akým ste platili (§ 624 ods. 7 a 8).",
              ],
            },
          ],
        },
        sporySekcia.sk,
        { nadpis: "Účinnosť", bloky: ["Tento reklamačný poriadok je účinný od [[dátum účinnosti]]."] },
      ],
      en: [
        { nadpis: "Seller", bloky: predavajuci.en },
        {
          nadpis: "Scope",
          bloky: [
            "This complaints policy applies to goods bought in the online shop and at the studio. Since 1 July 2024 Slovak law speaks of “notifying a defect” instead of a “complaint”. Here both mean the same thing.",
          ],
        },
        {
          nadpis: "Liability for defects",
          bloky: [
            "We are liable for any defect the goods have at the time of delivery that becomes apparent within two years of delivery (§ 619 of the Slovak Civil Code).",
            "If a defect becomes apparent within that time, it is presumed to have existed at delivery unless proven otherwise (§ 620).",
            "A defect must be notified within two months of discovering it, and no later than two years after delivery (§ 621(3)).",
          ],
        },
        {
          nadpis: "Handmade ceramics",
          bloky: [
            "Every piece is shaped and glazed by hand. Small irregularities, differences in the colour and flow of the glaze, traces of handwork and tiny bubbles in the glaze are a feature of handmade work stated in the product description, not a defect.",
            "Items decorated with gold are not suitable for the microwave or the dishwasher. Damage caused by such use is not a defect.",
            "[[ďalšie pokyny na používanie a údržbu – vodotesnosť váz, potraviny, mráz]]",
          ],
        },
        {
          nadpis: "How to notify a defect",
          bloky: [
            {
              zoznam: [
                `By email to ${kontakt.email} or by phone on ${telefonMedzinarodny}.`,
                `In person at the studio, ${kontakt.ulica}, Bratislava, at an agreed time.`,
                "By post to [[sídlo alebo adresa na zasielanie tovaru]].",
              ],
            },
            "Give your name, order number or proof of purchase and a description of the defect, and attach photos if you can. If we need the piece itself to assess it, we will agree how you hand it over. We bear the cost of taking over the goods (§ 623(4)).",
          ],
        },
        {
          nadpis: "Confirmation and time limit",
          bloky: [
            "We will confirm in writing (email counts) without delay that you have notified the defect. The confirmation states the period within which we will remedy the defect. It may not exceed 30 days from the notification unless a longer period is justified by an objective reason beyond our control (§ 622(3)).",
            "If we refuse liability for the defect, we will tell you the reasons in writing. If you then prove our liability with an expert opinion, you can notify the defect again and we can no longer refuse it (§ 622(4)).",
          ],
        },
        {
          nadpis: "Your rights",
          bloky: [
            {
              zoznam: [
                "Repair or replacement with another piece. You choose the remedy, if it is possible and does not cause disproportionate costs (§ 623). A unique handmade piece often cannot be replaced with an identical one.",
                "A reasonable price reduction or withdrawal from the contract, if we do not remedy the defect, refuse to remedy it, the defect recurs, it is serious enough to justify an immediate reduction or withdrawal, or it is clear we will not remedy it in time (§ 624). You cannot withdraw because of a minor defect.",
                "After withdrawal we refund the purchase price within 14 days of receiving the goods back or of proof that you sent them, using the same means of payment you used (§ 624(7) and (8)).",
              ],
            },
          ],
        },
        sporySekcia.en,
        { nadpis: "Effective date", bloky: ["This complaints policy is effective from [[dátum účinnosti]]."] },
      ],
    },
  },
  {
    slug: "ochrana-osobnych-udajov",
    nazov: { sk: "Ochrana osobných údajov", en: "Privacy policy" },
    uvod: {
      sk: "Aké osobné údaje web zbiera, prečo, ako dlho ich uchovávame a aké máte práva.",
      en: "What personal data the website collects, why, how long we keep it and what your rights are.",
    },
    sekcie: {
      sk: [
        {
          nadpis: "Prevádzkovateľ",
          bloky: [
            "Prevádzkovateľom vašich osobných údajov podľa nariadenia (EÚ) 2016/679 (GDPR) a zákona č. 18/2018 Z. z. je:",
            ...predavajuci.sk,
            "Zodpovednú osobu sme nevymenovali, zákon to od nás nevyžaduje.",
          ],
        },
        {
          nadpis: "Aké údaje spracúvame a prečo",
          bloky: [
            {
              zoznam: [
                "Objednávky v e-shope: meno, e-mail, telefón, adresa doručenia, obsah objednávky a stav platby. Údaje o karte spracúva iba Comgate. Právny základ: plnenie zmluvy (čl. 6 ods. 1 písm. b) GDPR).",
                "Faktúry a účtovné doklady: údaje na faktúre. Právny základ: zákonná povinnosť podľa zákona č. 431/2002 Z. z. o účtovníctve (čl. 6 ods. 1 písm. c) GDPR).",
                "Prihlášky na kurzy a workshopy: meno, e-mail, telefón, vybraný termín, pri deťoch aj meno a vek dieťaťa. Právny základ: plnenie zmluvy.",
                "Kontaktný formulár a e-maily: meno, telefón, e-mail, správa, pri teambuildingu aj firma, miesto, počet ľudí, druh tvorby a predbežný termín. Právny základ: opatrenia pred uzavretím zmluvy na vašu žiadosť alebo náš oprávnený záujem odpovedať na otázky (čl. 6 ods. 1 písm. b) a f) GDPR).",
                "Odber noviniek „Listy z ateliéru“: e-mail. Právny základ: váš súhlas (čl. 6 ods. 1 písm. a) GDPR). Odhlásiť sa môžete odkazom v každom e-maile. [[nástroj na newsletter – otázka 8]]",
                "Analytika návštevnosti (Google Analytics, Microsoft Clarity): pseudonymné identifikátory z cookies, typ zariadenia a prehliadača, približná poloha podľa krajiny alebo mesta, navštívené stránky, kliknutia a pohyb po stránke. Clarity skrýva texty, ktoré píšete do formulárov. Právny základ: váš súhlas v cookie lište (čl. 6 ods. 1 písm. a) GDPR a § 109 ods. 8 zákona č. 452/2021 Z. z.).",
                "Prevádzka a bezpečnosť webu: IP adresa a technické záznamy servera. Právny základ: náš oprávnený záujem na bezpečnom webe.",
              ],
            },
            "Údaje na uzavretie a plnenie zmluvy sú potrebné. Bez nich objednávku ani prihlášku nevybavíme. Poskytnutie ostatných údajov je dobrovoľné.",
          ],
        },
        {
          nadpis: "Ako dlho údaje uchovávame",
          bloky: [
            {
              zoznam: [
                "Objednávky a prihlášky: počas plnenia zmluvy a potom počas dvoch rokov zodpovednosti za vady, ak ich nepotrebujeme dlhšie na uplatnenie práv.",
                "Účtovné doklady: 10 rokov po roku, ktorého sa týkajú (§ 35 zákona č. 431/2002 Z. z.).",
                "Správy z kontaktného formulára: kým otázku vybavíme, najdlhšie [[doba uchovávania, napríklad 1 rok]].",
                "Newsletter: kým súhlas neodvoláte.",
                "Analytika: Google Analytics [[doba uchovávania nastavená v GA4 – 2 alebo 14 mesiacov]], Microsoft Clarity podľa svojich pravidiel (záznamy relácií spravidla 30 dní).",
              ],
            },
          ],
        },
        {
          nadpis: "Kto ďalší údaje spracúva",
          bloky: [
            "Údaje odovzdávame iba v rozsahu potrebnom na daný účel týmto sprostredkovateľom a príjemcom:",
            {
              zoznam: [
                "Comgate, a. s. – platobná brána (platby kartou).",
                "Google Ireland Limited – Google Analytics, Google Tag Manager, a po kliknutí aj Mapy Google a YouTube.",
                "Microsoft Ireland Operations Limited – Microsoft Clarity.",
                "[[hosting webu – dnes Netlify, overiť pri nasadení]]",
                "[[služba na odosielanie e-mailov]]",
                "[[nástroj na newsletter – otázka 8]]",
                "[[účtovník alebo účtovná firma]]",
                "[[dopravca, ak bude doručovanie – otázka 2]]",
              ],
            },
            "Google a Microsoft môžu údaje prenášať do USA. Obe spoločnosti sú certifikované v rámci EU-US Data Privacy Framework, pre ktorý Európska komisia 10. júla 2023 prijala rozhodnutie o primeranosti.",
            "Nepoužívame automatizované rozhodovanie ani profilovanie, ktoré by malo pre vás právne účinky.",
          ],
        },
        {
          nadpis: "Vaše práva",
          bloky: [
            {
              zoznam: [
                "Prístup k údajom – dozviete sa, aké údaje o vás máme (čl. 15 GDPR).",
                "Oprava nesprávnych údajov (čl. 16).",
                "Vymazanie údajov, ak ich už nepotrebujeme alebo ak ich spracúvame nezákonne (čl. 17).",
                "Obmedzenie spracúvania (čl. 18).",
                "Prenosnosť údajov, ktoré ste nám dali na základe zmluvy alebo súhlasu (čl. 20).",
                "Námietka proti spracúvaniu na základe oprávneného záujmu (čl. 21).",
                "Odvolanie súhlasu kedykoľvek, napríklad cez „Nastavenia cookies“ v pätičke alebo odkazom v newsletteri. Odvolanie sa netýka spracúvania pred ním (čl. 7 ods. 3).",
              ],
            },
            `Svoje práva uplatníte e-mailom na ${kontakt.email}. Odpovieme najneskôr do jedného mesiaca.`,
            "Ak si myslíte, že s údajmi zaobchádzame nezákonne, môžete podať návrh na Úrad na ochranu osobných údajov Slovenskej republiky, Hraničná 12, 820 07 Bratislava 27, dataprotection.gov.sk.",
          ],
        },
        { nadpis: "Účinnosť", bloky: ["Tieto informácie sú účinné od [[dátum účinnosti]]."] },
      ],
      en: [
        {
          nadpis: "Controller",
          bloky: [
            "The controller of your personal data under Regulation (EU) 2016/679 (GDPR) and Slovak Act No. 18/2018 Coll. is:",
            ...predavajuci.en,
            "We have not appointed a data protection officer, as the law does not require one.",
          ],
        },
        {
          nadpis: "What data we process and why",
          bloky: [
            {
              zoznam: [
                "Shop orders: name, email, phone, delivery address, the contents of the order and the payment status. Card details are processed only by Comgate. Legal basis: performance of a contract (Art. 6(1)(b) GDPR).",
                "Invoices and accounting records: the details on the invoice. Legal basis: a legal obligation under the Slovak Accounting Act No. 431/2002 Coll. (Art. 6(1)(c) GDPR).",
                "Class and workshop sign-ups: name, email, phone, chosen date, and for children also the child's name and age. Legal basis: performance of a contract.",
                "Contact form and emails: name, phone, email, message, and for team building also company, place, number of people, type of making and preferred date. Legal basis: steps taken at your request before entering into a contract, or our legitimate interest in answering questions (Art. 6(1)(b) and (f) GDPR).",
                "“Letters from the studio” newsletter: email. Legal basis: your consent (Art. 6(1)(a) GDPR). You can unsubscribe with the link in every email. [[nástroj na newsletter – otázka 8]]",
                "Visitor analytics (Google Analytics, Microsoft Clarity): pseudonymous identifiers from cookies, device and browser type, approximate location by country or city, pages visited, clicks and movement on the page. Clarity hides the text you type into forms. Legal basis: your consent in the cookie bar (Art. 6(1)(a) GDPR and § 109(8) of Slovak Act No. 452/2021 Coll.).",
                "Running and securing the website: IP address and technical server logs. Legal basis: our legitimate interest in a secure website.",
              ],
            },
            "Data needed to conclude and perform a contract is required; without it we cannot process an order or a sign-up. Providing any other data is voluntary.",
          ],
        },
        {
          nadpis: "How long we keep data",
          bloky: [
            {
              zoznam: [
                "Orders and sign-ups: while the contract is performed and then for the two-year liability period for defects, unless we need them longer to exercise our rights.",
                "Accounting records: 10 years after the year they relate to (§ 35 of Act No. 431/2002 Coll.).",
                "Contact form messages: until we have dealt with your question, at most [[doba uchovávania, napríklad 1 rok]].",
                "Newsletter: until you withdraw your consent.",
                "Analytics: Google Analytics [[doba uchovávania nastavená v GA4 – 2 alebo 14 mesiacov]], Microsoft Clarity under its own rules (session recordings usually 30 days).",
              ],
            },
          ],
        },
        {
          nadpis: "Who else processes data",
          bloky: [
            "We pass on data only as far as needed for each purpose, to these processors and recipients:",
            {
              zoznam: [
                "Comgate, a. s. – payment gateway (card payments).",
                "Google Ireland Limited – Google Analytics, Google Tag Manager, and after a click also Google Maps and YouTube.",
                "Microsoft Ireland Operations Limited – Microsoft Clarity.",
                "[[hosting webu – dnes Netlify, overiť pri nasadení]]",
                "[[služba na odosielanie e-mailov]]",
                "[[nástroj na newsletter – otázka 8]]",
                "[[účtovník alebo účtovná firma]]",
                "[[dopravca, ak bude doručovanie – otázka 2]]",
              ],
            },
            "Google and Microsoft may transfer data to the USA. Both companies are certified under the EU-US Data Privacy Framework, for which the European Commission adopted an adequacy decision on 10 July 2023.",
            "We do not use automated decision-making or profiling that has legal effects on you.",
          ],
        },
        {
          nadpis: "Your rights",
          bloky: [
            {
              zoznam: [
                "Access – find out what data we hold about you (Art. 15 GDPR).",
                "Rectification of incorrect data (Art. 16).",
                "Erasure, if we no longer need the data or process it unlawfully (Art. 17).",
                "Restriction of processing (Art. 18).",
                "Portability of data you gave us under a contract or consent (Art. 20).",
                "Objection to processing based on legitimate interest (Art. 21).",
                "Withdrawal of consent at any time, for example with “Cookie settings” in the footer or the link in the newsletter. Withdrawal does not affect processing before it (Art. 7(3)).",
              ],
            },
            `Exercise your rights by email to ${kontakt.email}. We will reply within one month at the latest.`,
            "If you believe we handle your data unlawfully, you can lodge a complaint with the Office for Personal Data Protection of the Slovak Republic, Hraničná 12, 820 07 Bratislava 27, dataprotection.gov.sk.",
          ],
        },
        { nadpis: "Effective date", bloky: ["This privacy policy is effective from [[dátum účinnosti]]."] },
      ],
    },
  },
  {
    slug: "cookies",
    nazov: { sk: "Cookies", en: "Cookies" },
    uvod: {
      sk: "Čo web ukladá vo vašom prehliadači a ako svoj súhlas zmeníte.",
      en: "What the website stores in your browser and how to change your consent.",
    },
    sekcie: {
      sk: [
        {
          nadpis: "Čo sú cookies",
          bloky: [
            "Cookies sú malé súbory, ktoré web ukladá vo vašom prehliadači. Podobne funguje aj úložisko prehliadača (localStorage). Nevyhnutné ukladáme bez súhlasu, všetky ostatné iba s vaším súhlasom (§ 109 ods. 8 zákona č. 452/2021 Z. z.).",
          ],
        },
        {
          nadpis: "Nevyhnutné – vždy zapnuté",
          bloky: [
            {
              zoznam: [
                "„kh-kosik“ (úložisko prehliadača): obsah košíka. Ostáva, kým košík nevyprázdnite alebo úložisko nevymažete.",
                "„kh-posledna-objednavka“ (úložisko prehliadača): súhrn poslednej objednávky na stránke po odoslaní.",
                "„kh-suhlas-cookies“ (úložisko prehliadača): vaša voľba v cookie lište, aby sme sa nepýtali znova.",
                "„info-lista-zavreta“ (úložisko prehliadača): pamätá si, že ste zavreli informačnú lištu hore na stránke.",
                "Na stránke platobnej brány Comgate platia jej vlastné cookies a pravidlá.",
              ],
            },
          ],
        },
        {
          nadpis: "Analytické – iba so súhlasom",
          bloky: [
            "Pomáhajú nám pochopiť, ktoré stránky ľudia čítajú a kde sa na webe strácajú. Údaje sú pseudonymné, bez mena a e-mailu.",
            {
              zoznam: [
                "„_ga“ (Google Analytics, 2 roky): rozlišuje návštevníkov.",
                "„_ga_<ID>“ (Google Analytics, 2 roky): pamätá si stav návštevy.",
                "„_clck“ (Microsoft Clarity, 1 rok): identifikátor návštevníka.",
                "„_clsk“ (Microsoft Clarity, 1 deň): spája zobrazenia stránok do jednej návštevy.",
                "„CLID“ (Microsoft Clarity, doména clarity.ms, 1 rok): kedy Clarity návštevníka videl prvýkrát.",
              ],
            },
            "[[overiť zoznam po zapnutí analytiky: prehliadač › Nástroje pre vývojárov › Application › Cookies]]",
          ],
        },
        {
          nadpis: "Marketingové – iba so súhlasom",
          bloky: [
            "Web dnes nepoužíva reklamné ani remarketingové cookies. Google Tag Manager sám cookies neukladá. Ak ateliér pridá meranie reklám, doplníme ho sem a spustí sa iba s vaším súhlasom.",
          ],
        },
        {
          nadpis: "Služby, ktoré sa načítajú až po kliknutí",
          bloky: [
            {
              zoznam: [
                "Mapy Google na stránke Kontakt sa načítajú až po kliknutí na „Zobraziť mapu“. Až potom môže Google uložiť svoje cookies.",
                "Video YouTube v blogu sa načíta až po kliknutí na „Prehrať video“, cez youtube-nocookie.com.",
              ],
            },
          ],
        },
        {
          nadpis: "Ako súhlas zmeniť alebo cookies vymazať",
          bloky: [
            "Súhlas zmeníte alebo odvoláte kedykoľvek cez „Nastavenia cookies“ v pätičke. Po odvolaní analytické cookies vymažeme a stránku znova načítame.",
            "Cookies a úložisko môžete vymazať aj v nastaveniach prehliadača (Chrome, Firefox, Safari, Edge) v časti Súkromie alebo Ochrana osobných údajov. Vymazaním sa vyprázdni aj košík.",
          ],
        },
      ],
      en: [
        {
          nadpis: "What cookies are",
          bloky: [
            "Cookies are small files a website stores in your browser. Browser storage (localStorage) works in a similar way. We store the necessary ones without consent and everything else only with your consent (§ 109(8) of Slovak Act No. 452/2021 Coll.).",
          ],
        },
        {
          nadpis: "Necessary – always on",
          bloky: [
            {
              zoznam: [
                "“kh-kosik” (browser storage): the contents of your cart. It stays until you empty the cart or clear the storage.",
                "“kh-posledna-objednavka” (browser storage): the summary of your last order on the page shown after sending it.",
                "“kh-suhlas-cookies” (browser storage): your choice in the cookie bar, so we do not ask again.",
                "“info-lista-zavreta” (browser storage): remembers that you closed the information bar at the top of the page.",
                "The Comgate payment page has its own cookies and rules.",
              ],
            },
          ],
        },
        {
          nadpis: "Analytics – only with consent",
          bloky: [
            "They help us understand which pages people read and where they get lost on the site. The data is pseudonymous, without your name or email.",
            {
              zoznam: [
                "“_ga” (Google Analytics, 2 years): distinguishes visitors.",
                "“_ga_<ID>” (Google Analytics, 2 years): keeps the state of the visit.",
                "“_clck” (Microsoft Clarity, 1 year): visitor identifier.",
                "“_clsk” (Microsoft Clarity, 1 day): joins page views into one visit.",
                "“CLID” (Microsoft Clarity, clarity.ms domain, 1 year): when Clarity first saw the visitor.",
              ],
            },
            "[[overiť zoznam po zapnutí analytiky: prehliadač › Nástroje pre vývojárov › Application › Cookies]]",
          ],
        },
        {
          nadpis: "Marketing – only with consent",
          bloky: [
            "The website does not use advertising or remarketing cookies today. Google Tag Manager itself stores no cookies. If the studio adds ad measurement, we will list it here and it will only run with your consent.",
          ],
        },
        {
          nadpis: "Services that load only after a click",
          bloky: [
            {
              zoznam: [
                "Google Maps on the Contact page loads only after you click “Show map”. Only then can Google set its cookies.",
                "The YouTube video on the blog loads only after you click “Play video”, through youtube-nocookie.com.",
              ],
            },
          ],
        },
        {
          nadpis: "Changing your consent or deleting cookies",
          bloky: [
            "You can change or withdraw your consent at any time with “Cookie settings” in the footer. After withdrawal we delete the analytics cookies and reload the page.",
            "You can also delete cookies and storage in your browser settings (Chrome, Firefox, Safari, Edge) under Privacy. This also empties your cart.",
          ],
        },
      ],
    },
  },
];
