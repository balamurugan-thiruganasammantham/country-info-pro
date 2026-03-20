# country-info-pro

[![npm version](https://img.shields.io/npm/v/country-info-pro.svg)](https://www.npmjs.com/package/country-info-pro)
[![npm downloads](https://img.shields.io/npm/dm/country-info-pro.svg)](https://www.npmjs.com/package/country-info-pro)
[![CI](https://github.com/balamurugan-thiruganasammantham/country-info-pro/actions/workflows/ci.yml/badge.svg)](https://github.com/balamurugan-thiruganasammantham/country-info-pro/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4+-blue.svg)](https://www.typescriptlang.org/)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-green.svg)](https://www.npmjs.com/package/country-info-pro)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Comprehensive country information package with built-in fuzzy search. Zero runtime dependencies. Full TypeScript support.

Get detailed data for 250 countries: names, ISO codes, capitals, currencies, phone codes, timezones, languages, populations, flags, maps, borders, postal codes, driving side, and more.

## Why country-info-pro?

| Feature | country-info-pro | country-list | i18n-iso-countries | world-countries |
|---------|:---:|:---:|:---:|:---:|
| Fuzzy search | Yes | No | No | No |
| TypeScript | Full | Partial | Partial | No |
| Zero deps | Yes | Yes | No | No |
| Postal codes | Yes | No | No | No |
| Population data | Yes | No | No | Yes |
| ESM + CJS | Yes | CJS | CJS | CJS |
| Tree-shakable | Yes | No | No | No |

## Installation

```bash
npm install country-info-pro
# or
yarn add country-info-pro
# or
pnpm add country-info-pro
```

## Quick Start

```ts
import { getCountry, searchCountries, getPhoneCode, getCurrencyInfo } from "country-info-pro";

// Smart lookup - auto-detects input type
const india = getCountry("IN");       // by alpha-2 code
const usa = getCountry("USA");        // by alpha-3 code
const france = getCountry("France");  // by name
const japan = getCountry("392");      // by numeric code

// Common aliases work too
const uk = getCountry("UK");          // → United Kingdom
const uae = getCountry("UAE");        // → United Arab Emirates
const holland = getCountry("Holland"); // → Netherlands

// Fuzzy search with typo tolerance
const results = searchCountries("Frence");  // finds France
const topHit = searchCountry("ind");        // returns India directly

// Helpers
getPhoneCode(india!);      // "+91"
getCurrencyInfo(india!);   // { code: "INR", name: "Indian rupee", symbol: "₹" }
```

## API Reference

### Smart Lookup

#### `getCountry(input: string): Country | undefined`

Auto-detects input type: alpha-2, alpha-3, numeric code, name, or common alias.

```ts
getCountry("IN");       // alpha-2
getCountry("IND");      // alpha-3
getCountry("356");      // numeric
getCountry("India");    // name
getCountry("UK");       // alias → United Kingdom
```

### Exact Lookups

```ts
getCountryByAlpha2("US");            // by ISO alpha-2
getCountryByAlpha3("DEU");           // by ISO alpha-3
getCountryByNumericCode("840");      // by ISO numeric
getCountryByName("France");          // by common or official name
getCountryByCapital("Tokyo");        // by capital city
getCountryByTLD(".in");              // by top-level domain
```

All lookups are case-insensitive and return `Country | undefined`.

### Search

#### `searchCountries(query: string, options?: SearchOptions): SearchResult[]`

Fuzzy search across names, codes, alt spellings, capitals, and demonyms.

```ts
searchCountries("Franc");           // partial match
searchCountries("Frence");          // typo tolerance
searchCountries("American");        // search by demonym
searchCountries("united", { limit: 5, threshold: 0.4 });
```

#### `searchCountry(query: string, options?: SearchOptions): Country | undefined`

Returns just the top match.

```ts
searchCountry("ind");  // → India
```

**Options:**

| Option      | Type     | Default | Description                    |
| ----------- | -------- | ------- | ------------------------------ |
| `limit`     | `number` | `10`    | Maximum results to return      |
| `threshold` | `number` | `0.3`   | Minimum score (0-1) to include |

### Filters

```ts
getCountriesByRegion("Europe");          // by region
getCountriesByContinent("South America"); // by continent
getCountriesByLanguage("English");       // by language name or ISO 639 code
getCountriesByCurrency("EUR");           // by currency code
getCountriesByCallingCode("+91");        // by phone calling code
```

#### `filterCountries(options: FilterOptions): Country[]`

Combine multiple filters:

```ts
filterCountries({
  region: "Europe",
  language: "French",
  independent: true,
  landlocked: false,
});
```

### Country Groupings

```ts
import { getCountriesByGrouping, getGroupings, getAvailableGroupings } from "country-info-pro";

// Get all EU member countries
const eu = getCountriesByGrouping("EU");        // 27 countries
const nato = getCountriesByGrouping("NATO");      // 32 countries
const brics = getCountriesByGrouping("BRICS");    // 9 countries
const g7 = getCountriesByGrouping("G7");          // 7 countries

// What groupings does India belong to?
const india = getCountry("IN")!;
getGroupings(india);  // ["G20", "BRICS", "COMMONWEALTH"]

// List all available groupings
getAvailableGroupings();
// ["EU", "NATO", "G7", "G20", "BRICS", "ASEAN", "AU", "ARAB_LEAGUE",
//  "COMMONWEALTH", "SCHENGEN", "EUROZONE", "FIVE_EYES", "OPEC",
//  "MERCOSUR", "CARICOM", "NORDIC", "BENELUX", "APEC"]
```

### Utilities

```ts
getAllCountries();                    // all 250 countries
getNeighbors(getCountry("IN")!);     // bordering countries
getPhoneCode(getCountry("IN")!);     // "+91"
getCurrencyInfo(getCountry("IN")!);  // { code: "INR", name: "Indian rupee", symbol: "₹" }
isValidCountryCode("US");            // true
isValidCountryCode("XX");            // false

// Emoji flag generator
toEmojiFlag("US");                   // "🇺🇸"
toEmojiFlag("IN");                   // "🇮🇳"

// Distance & proximity
getDistance(india, japan);            // 6147 (km)
getClosestCountries(india, 3);       // [Nepal (1138km), Pakistan (1316km), Bangladesh (1411km)]

// Postal code validation
validatePostalCode(getCountry("US")!, "90210");      // true
validatePostalCode(getCountry("IN")!, "110001");     // true
validatePostalCode(getCountry("US")!, "ABCDE");      // false

// Random country
getRandomCountry();                                   // random country
getRandomCountry(c => c.region === "Europe");         // random European country

// Compare two countries
compareCountries(india, japan);
// { name: { a: "India", b: "Japan" }, population: { a: 1428627663, b: 123294513 }, ... }

// Additional filters
getCountriesBySubregion("Southern Asia");   // India, Pakistan, Sri Lanka, etc.
getCountriesByStartOfWeek("sunday");         // US, India, Japan, etc.
```

## Country Data Structure

Each country object contains 25+ fields:

```ts
interface Country {
  name: {
    common: string;          // "India"
    official: string;        // "Republic of India"
    nativeName: Record<string, { official: string; common: string }>;
  };
  cca2: string;              // "IN" (ISO 3166-1 alpha-2)
  cca3: string;              // "IND" (ISO 3166-1 alpha-3)
  ccn3: string;              // "356" (ISO 3166-1 numeric)
  capital: string[];         // ["New Delhi"]
  region: Region;            // "Asia"
  subregion: string;         // "Southern Asia"
  continents: Continent[];   // ["Asia"]
  currencies: Record<string, { name: string; symbol: string }>;
  idd: { root: string; suffixes: string[] };
  languages: Record<string, string>;
  latlng: [number, number];  // [20, 77]
  borders: string[];         // ["BGD", "BTN", "MMR", "CHN", "NPL", "PAK"]
  area: number;              // 3287590 (km²)
  population: number;        // 1428627663
  timezones: string[];       // ["UTC+05:30"]
  flag: string;              // "🇮🇳" (emoji)
  flags: { png: string; svg: string; alt: string };
  maps: { googleMaps: string; openStreetMaps: string };
  car: { signs: string[]; side: "left" | "right" };
  demonyms: Record<string, { f: string; m: string }>;
  tld: string[];             // [".in"]
  postalCode: { format: string; regex: string } | null;
  coatOfArms: { png?: string; svg?: string };
  landlocked: boolean;
  independent: boolean | null;
  unMember: boolean;
  startOfWeek: string;       // "monday" | "sunday"
}
```

## Features

- **Zero dependencies** — all data bundled, no API calls at runtime
- **Full TypeScript** — complete type definitions with strict mode
- **Dual ESM/CJS** — works with `import` and `require()`
- **Tree-shakable** — `sideEffects: false`, import only what you need
- **Fuzzy search** — handles typos, partial matches, and demonym search
- **Smart aliases** — "UK", "USA", "UAE", "Holland", "Burma" all resolve correctly
- **Case-insensitive** — all lookups normalize input automatically
- **250 countries** — comprehensive coverage including territories
- **18 country groupings** — EU, NATO, G7, G20, BRICS, ASEAN, Commonwealth, and more
- **157 postal code formats** — with regex validation patterns
- **O(1) lookups** — pre-indexed maps for instant code/name/capital/TLD resolution (~2.5M ops/sec)
- **Currency name search** — "rupee", "dollar", "euro" all find relevant countries
- **Distance calculator** — haversine formula for km between any two countries
- **Geoproximity** — find the N closest countries to any given country
- **Postal code validation** — validate against country-specific regex patterns
- **Country comparison** — structured side-by-side diff of any two countries
- **Random country** — with optional filter predicate

## Data Sources

Country data sourced from [mledoze/countries](https://github.com/mledoze/countries), enriched with population estimates, timezone data, postal code formats, and flag/map URLs.

## License

MIT
