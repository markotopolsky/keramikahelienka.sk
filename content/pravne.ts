// Legal pages (ZAZNAMNIK.md section 15, step 8). These are SAMPLE pages: an outline of the sections
// such documents usually have, with [[…]] gaps for everything only Helena or her lawyer can supply.
// The developer does not write legal text (section 14). Facts in here come only from the notebook
// (contacts, the course conditions from Helena's current sign-up form) or describe what this
// website itself does (which form fields it has, what it stores in the browser, which services it loads).
// Nothing is copied from other shops' terms.
//
// Text format: [[gap]] renders as a visible "[doplniť: gap]".
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

const predavajuci: Localized<Blok[]> = {
  sk: [
    {
      zoznam: [
        "Obchodné meno: [[obchodné meno]]",
        "Sídlo: [[sídlo]]",
        "IČO: [[IČO]]",
        "DIČ / IČ DPH: [[DIČ, IČ DPH – platiteľ DPH áno / nie, otázka 1]]",
        "Zápis v registri: [[živnostenský alebo obchodný register]]",
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
        "Registration: [[živnostenský alebo obchodný register]]",
        `Studio: ${kontakt.ulica}, ${kontakt.mesto}`,
        `Email: ${kontakt.email}`,
        `Phone: +421 903 394 212`,
      ],
    },
  ],
};

const ucinnost: Localized<Sekcia> = {
  sk: { nadpis: "Účinnosť", bloky: ["Tieto podmienky sú účinné od [[dátum účinnosti]]."] },
  en: { nadpis: "Effective date", bloky: ["These terms are effective from [[dátum účinnosti]]."] },
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
        { nadpis: "Predávajúci", bloky: predavajuci.sk },
        {
          nadpis: "Objednávka a uzavretie zmluvy",
          bloky: ["[[ako vzniká kúpna zmluva – od odoslania objednávky po potvrdenie]]"],
        },
        {
          nadpis: "Ceny a platba",
          bloky: [
            "Ceny sú uvedené v eurách. [[ceny s DPH alebo bez DPH – otázka 1]]",
            "[[spôsoby platby – platba kartou cez Comgate, prípadne ďalšie]]",
          ],
        },
        {
          nadpis: "Doprava a dodanie",
          bloky: [
            `Osobný odber v ateliéri (${kontakt.ulica}, Bratislava) je zadarmo.`,
            "[[ďalšie spôsoby dopravy, ceny, krajiny a dodacie lehoty – otázka 2]]",
          ],
        },
        {
          nadpis: "Odstúpenie od zmluvy",
          bloky: [
            "[[lehota a postup pri odstúpení od zmluvy pre tovar aj pre kurzy na určený termín – zákon č. 108/2024 Z. z., overiť s právnikom]]",
            "[[formulár na odstúpenie od zmluvy]]",
          ],
        },
        {
          nadpis: "Reklamácie",
          bloky: ["Postup pri reklamácii je v Reklamačnom poriadku."],
        },
        {
          nadpis: "Kurzy a workshopy",
          bloky: [
            "Podmienky zo súčasného Google formulára prihlášky na kurz, skrátené. Konečné znenie potvrdí právnik.",
            {
              zoznam: [
                "Prihláška – cez formulár alebo v ateliéri. Bez zaplatenia je nezáväzná. Rezervácia platí dňom úhrady.",
                "Platba – najneskôr 7 dní pred kurzom. V cene sú pomôcky, materiál, občerstvenie a lektor.",
                "Storno – pri zrušení najneskôr 3 dni pred kurzom sa vracia 50 %. Pri skoršom zrušení sa vracia celá suma alebo je možný iný kurz. Vynechanú lekciu mesačného kurzu možno nahradiť v predplatenom období. Neúčasť treba ohlásiť 48 hodín vopred, inak termín prepadá.",
                "Darčeková poukážka – platnosť podľa hodnoty a dohody. Po platnosti prepadá.",
                "Zmeny – ateliér si vyhradzuje zmenu dátumu a miesta. Oznámi ju e-mailom alebo SMS.",
                "Bezpečnosť – činnosti v ateliéri sú na vlastnú zodpovednosť.",
              ],
            },
          ],
        },
        {
          nadpis: "Riešenie sporov",
          bloky: ["[[alternatívne riešenie sporov a orgán dozoru]]"],
        },
        ucinnost.sk,
      ],
      en: [
        { nadpis: "Seller", bloky: predavajuci.en },
        {
          nadpis: "Orders and conclusion of the contract",
          bloky: ["[[ako vzniká kúpna zmluva – od odoslania objednávky po potvrdenie]]"],
        },
        {
          nadpis: "Prices and payment",
          bloky: ["Prices are in euros. [[ceny s DPH alebo bez DPH – otázka 1]]", "[[spôsoby platby – platba kartou cez Comgate, prípadne ďalšie]]"],
        },
        {
          nadpis: "Delivery",
          bloky: [
            `Pickup at the studio (${kontakt.ulica}, Bratislava) is free.`,
            "[[ďalšie spôsoby dopravy, ceny, krajiny a dodacie lehoty – otázka 2]]",
          ],
        },
        {
          nadpis: "Withdrawal from the contract",
          bloky: [
            "[[lehota a postup pri odstúpení od zmluvy pre tovar aj pre kurzy na určený termín – zákon č. 108/2024 Z. z., overiť s právnikom]]",
            "[[formulár na odstúpenie od zmluvy]]",
          ],
        },
        {
          nadpis: "Complaints",
          bloky: ["How to make a complaint is described in the Complaints policy."],
        },
        {
          nadpis: "Classes and workshops",
          bloky: [
            "Conditions from the current Google sign-up form, shortened. A lawyer will confirm the final wording.",
            {
              zoznam: [
                "Sign-up – through the form or at the studio. It is not binding until paid. The booking is valid from the day of payment.",
                "Payment – at least 7 days before the class. The price includes tools, materials, refreshments and the teacher.",
                "Cancellation – 50 % is refunded for cancellations up to 3 days before the class. Earlier cancellations get a full refund or another class. A missed lesson of a monthly course can be made up within the prepaid period. Absence must be announced 48 hours in advance, otherwise the session is lost.",
                "Gift voucher – valid according to its value and agreement. It expires after the validity date.",
                "Changes – the studio may change the date and place. It announces changes by email or text message.",
                "Safety – activities in the studio are at your own risk.",
              ],
            },
          ],
        },
        {
          nadpis: "Dispute resolution",
          bloky: ["[[alternatívne riešenie sporov a orgán dozoru]]"],
        },
        ucinnost.en,
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
        { nadpis: "Zodpovednosť za vady", bloky: ["[[za aké vady predávajúci zodpovedá a ako dlho]]"] },
        {
          nadpis: "Ručne robená keramika",
          bloky: [
            "[[ako sa posudzujú drobné nerovnosti a rozdiely ručne robených kusov – rozhodne Helenka s právnikom]]",
            "Kúsky zdobené zlatom nie sú vhodné do mikrovlnnej rúry ani do umývačky riadu.",
          ],
        },
        {
          nadpis: "Ako reklamovať",
          bloky: [
            `Reklamáciu môžete oznámiť e-mailom na ${kontakt.email} alebo telefonicky na ${kontakt.telefon}.`,
            "[[postup, potrebné doklady a adresa na zaslanie tovaru]]",
          ],
        },
        { nadpis: "Vybavenie reklamácie", bloky: ["[[lehoty a spôsoby vybavenia reklamácie]]"] },
        { nadpis: "Riešenie sporov", bloky: ["[[alternatívne riešenie sporov a orgán dozoru]]"] },
        { ...ucinnost.sk, bloky: ["Tento reklamačný poriadok je účinný od [[dátum účinnosti]]."] },
      ],
      en: [
        { nadpis: "Seller", bloky: predavajuci.en },
        { nadpis: "Liability for defects", bloky: ["[[za aké vady predávajúci zodpovedá a ako dlho]]"] },
        {
          nadpis: "Handmade ceramics",
          bloky: [
            "[[ako sa posudzujú drobné nerovnosti a rozdiely ručne robených kusov – rozhodne Helenka s právnikom]]",
            "Items decorated with gold are not suitable for the microwave or the dishwasher.",
          ],
        },
        {
          nadpis: "How to make a complaint",
          bloky: [`You can report a complaint by email to ${kontakt.email} or by phone on +421 903 394 212.`, "[[postup, potrebné doklady a adresa na zaslanie tovaru]]"],
        },
        { nadpis: "Handling of complaints", bloky: ["[[lehoty a spôsoby vybavenia reklamácie]]"] },
        { nadpis: "Dispute resolution", bloky: ["[[alternatívne riešenie sporov a orgán dozoru]]"] },
        { ...ucinnost.en, bloky: ["This complaints policy is effective from [[dátum účinnosti]]."] },
      ],
    },
  },
  {
    slug: "ochrana-osobnych-udajov",
    nazov: { sk: "Ochrana osobných údajov", en: "Privacy policy" },
    uvod: {
      sk: "Aké osobné údaje web zbiera, prečo a aké máte práva.",
      en: "What personal data the website collects, why, and what your rights are.",
    },
    sekcie: {
      sk: [
        { nadpis: "Prevádzkovateľ", bloky: predavajuci.sk },
        {
          nadpis: "Aké údaje web zbiera",
          bloky: [
            "Zoznam podľa toho, čo web robí dnes a čo pribudne v ďalších fázach:",
            {
              zoznam: [
                "Kontaktný formulár: meno, telefón, e-mail, správa. Pri teambuildingu aj firma, miesto, počet ľudí, druh tvorby a predbežný termín.",
                "Objednávky v e-shope: [[údaje z pokladne – fáza 4]]",
                "Odber noviniek „Listy z ateliéru“: e-mail. [[nástroj na newsletter – otázka 8]]",
                "Prihláška na kurz: vypĺňa sa v Google formulári mimo tohto webu.",
              ],
            },
          ],
        },
        { nadpis: "Účel a právny základ", bloky: ["[[účel a právny základ pre každý druh údajov – zákon č. 18/2018 Z. z. a nariadenie GDPR, overiť s právnikom]]"] },
        { nadpis: "Ako dlho údaje uchovávame", bloky: ["[[doby uchovávania]]"] },
        {
          nadpis: "Kto ďalší údaje spracúva",
          bloky: [
            {
              zoznam: [
                "Google (Mapy Google, iba po kliknutí na „Zobraziť mapu“; Google formulár prihlášky na kurz)",
                "Comgate (platby kartou, keď bude e-shop spustený)",
                "[[hosting webu]]",
                "[[služba na odosielanie e-mailov]]",
                "[[nástroj na newsletter – otázka 8]]",
              ],
            },
          ],
        },
        { nadpis: "Vaše práva", bloky: ["[[práva dotknutej osoby a ako ich uplatniť]]"] },
        { nadpis: "Kontakt", bloky: [`Otázky k osobným údajom posielajte na ${kontakt.email}.`] },
      ],
      en: [
        { nadpis: "Controller", bloky: predavajuci.en },
        {
          nadpis: "What data the website collects",
          bloky: [
            "A list based on what the website does today and what later phases will add:",
            {
              zoznam: [
                "Contact form: name, phone, email, message. For team building also company, place, number of people, type of making and preferred date.",
                "Shop orders: [[údaje z pokladne – fáza 4]]",
                "“Letters from the studio” newsletter: email. [[nástroj na newsletter – otázka 8]]",
                "Class sign-up: filled in on a Google form outside this website.",
              ],
            },
          ],
        },
        { nadpis: "Purpose and legal basis", bloky: ["[[účel a právny základ pre každý druh údajov – zákon č. 18/2018 Z. z. a nariadenie GDPR, overiť s právnikom]]"] },
        { nadpis: "How long we keep data", bloky: ["[[doby uchovávania]]"] },
        {
          nadpis: "Who else processes data",
          bloky: [
            {
              zoznam: [
                "Google (Google Maps, only after clicking “Show map”; the Google sign-up form for classes)",
                "Comgate (card payments, once the shop is live)",
                "[[hosting webu]]",
                "[[služba na odosielanie e-mailov]]",
                "[[nástroj na newsletter – otázka 8]]",
              ],
            },
          ],
        },
        { nadpis: "Your rights", bloky: ["[[práva dotknutej osoby a ako ich uplatniť]]"] },
        { nadpis: "Contact", bloky: [`Send questions about personal data to ${kontakt.email}.`] },
      ],
    },
  },
  {
    slug: "cookies",
    nazov: { sk: "Cookies", en: "Cookies" },
    uvod: {
      sk: "Čo web ukladá vo vašom prehliadači.",
      en: "What the website stores in your browser.",
    },
    sekcie: {
      sk: [
        {
          nadpis: "Čo web ukladá dnes",
          bloky: [
            {
              zoznam: [
                "„info-lista-zavreta“ (úložisko prehliadača, nie cookie): pamätá si, že ste zavreli informačnú lištu hore na stránke. Ostáva, kým ju nevymažete v prehliadači.",
                "Mapy Google na stránke Kontakt sa načítajú až po kliknutí na „Zobraziť mapu“. Až potom môže Google uložiť svoje cookies. [[zoznam cookies Google Máp]]",
              ],
            },
            "Web zatiaľ nepoužíva analytiku ani reklamné cookies.",
          ],
        },
        { nadpis: "Čo pribudne", bloky: ["[[cookies košíka, platobnej brány a prípadnej analytiky – doplniť pri fáze 4 a 6]]"] },
        { nadpis: "Ako cookies vymazať alebo zablokovať", bloky: ["[[návod pre prehliadače]]"] },
      ],
      en: [
        {
          nadpis: "What the website stores today",
          bloky: [
            {
              zoznam: [
                "“info-lista-zavreta” (browser storage, not a cookie): remembers that you closed the information bar at the top of the page. It stays until you clear it in your browser.",
                "Google Maps on the Contact page loads only after you click “Show map”. Only then can Google set its cookies. [[zoznam cookies Google Máp]]",
              ],
            },
            "The website does not use analytics or advertising cookies yet.",
          ],
        },
        { nadpis: "What will be added", bloky: ["[[cookies košíka, platobnej brány a prípadnej analytiky – doplniť pri fáze 4 a 6]]"] },
        { nadpis: "How to delete or block cookies", bloky: ["[[návod pre prehliadače]]"] },
      ],
    },
  },
];
