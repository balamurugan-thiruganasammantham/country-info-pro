# country-info-pro

[![npm version](https://img.shields.io/npm/v/country-info-pro.svg)](https://www.npmjs.com/package/country-info-pro)
[![npm downloads](https://img.shields.io/npm/dm/country-info-pro.svg)](https://www.npmjs.com/package/country-info-pro)
[![npm total downloads](https://img.shields.io/npm/dt/country-info-pro.svg)](https://www.npmjs.com/package/country-info-pro)
[![CI](https://github.com/balamurugan-thiruganasammantham/country-info-pro/actions/workflows/ci.yml/badge.svg)](https://github.com/balamurugan-thiruganasammantham/country-info-pro/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4+-blue.svg)](https://www.typescriptlang.org/)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-green.svg)](https://www.npmjs.com/package/country-info-pro)
[![Bundle Size](https://img.shields.io/badge/bundle-290KB-brightgreen)](https://www.npmjs.com/package/country-info-pro)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)

> The most comprehensive country data package for Node.js and TypeScript. 250 countries. 38 functions. Zero dependencies. Built-in fuzzy search.

Get detailed data for **250 countries**: names, ISO codes, capitals, currencies, phone codes, timezones, languages, populations, flags, maps, borders, postal codes, driving side, and 18 political/economic groupings (EU, NATO, G7, BRICS, ASEAN, etc.).

## Why country-info-pro?

| Feature | country-info-pro | country-list | i18n-iso-countries | world-countries |
|---------|:---:|:---:|:---:|:---:|
| Countries | 250 | 249 | 249 | 250 |
| Functions | 38 | 2 | 5 | 1 |
| Fuzzy search | Yes | No | No | No |
| TypeScript | Full | Partial | Partial | No |
| Zero deps | Yes | Yes | No | No |
| Country groupings | 18 | No | No | No |
| Distance calculator | Yes | No | No | No |
| Postal code validation | Yes | No | No | No |
| Driving side filter | Yes | No | No | No |
| Timezone filter | Yes | No | No | No |
| ESM + CJS | Yes | CJS | CJS | CJS |
| Tree-shakable | Yes | No | No | No |
| Bundle size | 290 KB | 12 KB | 150 KB | 25 KB |

## Installation

```bash
npm install country-info-pro
```

```bash
yarn add country-info-pro
```

```bash
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

### CommonJS

```js
const { getCountry, searchCountries } = require("country-info-pro");

const india = getCountry("IN");
console.log(india.name.common); // "India"
```

## Complete API Reference

### Smart Lookup

#### `getCountry(input: string): Country | undefined`

Auto-detects input type: alpha-2, alpha-3, numeric code, name, or common alias. Supports 28 aliases including "UK", "USA", "UAE", "Holland", "Burma", etc.

```ts
getCountry("IN");       // alpha-2
getCountry("IND");      // alpha-3
getCountry("356");      // numeric
getCountry("India");    // name
getCountry("UK");       // alias → United Kingdom
```

### Exact Lookups (O(1) — instant)

All lookups use pre-indexed hash maps for instant O(1) resolution.

```ts
getCountryByAlpha2("US");            // by ISO 3166-1 alpha-2
getCountryByAlpha3("DEU");           // by ISO 3166-1 alpha-3
getCountryByNumericCode("840");      // by ISO 3166-1 numeric
getCountryByName("France");          // by common or official name
getCountryByCapital("Tokyo");        // by capital city
getCountryByTLD(".in");              // by top-level domain
getCountryByPhoneCode("+91");        // by international calling code
```

All lookups are **case-insensitive** and return `Country | undefined`.

### Search

#### `searchCountries(query: string, options?: SearchOptions): SearchResult[]`

Fuzzy search across names, codes, alt spellings, capitals, demonyms, and currency names.

```ts
searchCountries("Franc");           // partial match → France
searchCountries("Frence");          // typo tolerance → France
searchCountries("American");        // search by demonym → United States
searchCountries("rupee");           // search by currency name → India, Pakistan, etc.
searchCountries("New Delhi");       // search by capital → India
searchCountries("united", { limit: 5, threshold: 0.4 });
```

#### `searchCountry(query: string, options?: SearchOptions): Country | undefined`

Returns just the top match.

```ts
searchCountry("ind");  // → India
```

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `limit` | `number` | `10` | Maximum results to return |
| `threshold` | `number` | `0.3` | Minimum score (0-1) to include |

### Filters

```ts
getCountriesByRegion("Europe");                // by UN region
getCountriesByContinent("South America");      // by continent
getCountriesBySubregion("Southern Asia");       // by subregion
getCountriesByLanguage("English");              // by language name or ISO 639 code
getCountriesByCurrency("EUR");                  // by currency code
getCountriesByCallingCode("+91");               // by phone calling code
getCountriesByDrivingSide("left");              // left-driving countries (IN, GB, JP, AU...)
getCountriesByTimezone("UTC+05:30");            // countries in a timezone
getCountriesByStartOfWeek("sunday");            // US, India, Japan, etc.
```

#### `filterCountries(options: FilterOptions): Country[]`

Combine multiple filters — all conditions must match:

```ts
// Find independent, landlocked European countries that drive on the right
filterCountries({
  region: "Europe",
  landlocked: true,
  independent: true,
  drivingSide: "right",
});

// Find English-speaking countries using USD
filterCountries({
  language: "English",
  currency: "USD",
});

// Find countries in a specific timezone
filterCountries({
  timezone: "UTC+05:30",
  independent: true,
});
```

**FilterOptions:**

| Option | Type | Description |
|--------|------|-------------|
| `region` | `Region` | Africa, Americas, Antarctic, Asia, Europe, Oceania |
| `subregion` | `string` | E.g., "Southern Asia", "Western Europe" |
| `continent` | `Continent` | Africa, Antarctica, Asia, Europe, North America, Oceania, South America |
| `language` | `string` | Language name or ISO 639 code |
| `currency` | `string` | Currency code (EUR, USD, INR, etc.) |
| `independent` | `boolean` | Is an independent nation |
| `unMember` | `boolean` | Is a UN member state |
| `landlocked` | `boolean` | Has no coastline |
| `drivingSide` | `"left" \| "right"` | Side of road for driving |
| `timezone` | `string` | E.g., "UTC+05:30", "UTC-05:00" |
| `populationMin` | `number` | Minimum population |
| `populationMax` | `number` | Maximum population |
| `areaMin` | `number` | Minimum area (km²) |
| `areaMax` | `number` | Maximum area (km²) |

### Country Groupings (18 Organizations)

```ts
import { getCountriesByGrouping, getGroupings, getAvailableGroupings } from "country-info-pro";

// Get all member countries
const eu = getCountriesByGrouping("EU");          // 27 countries
const nato = getCountriesByGrouping("NATO");       // 32 countries
const brics = getCountriesByGrouping("BRICS");     // 9 countries
const g7 = getCountriesByGrouping("G7");           // 7 countries
const g20 = getCountriesByGrouping("G20");         // 19 countries
const asean = getCountriesByGrouping("ASEAN");     // 10 countries
const commonwealth = getCountriesByGrouping("COMMONWEALTH"); // 54 countries

// What groupings does a country belong to?
const india = getCountry("IN")!;
getGroupings(india);  // ["G20", "BRICS", "COMMONWEALTH", "APEC"]

// List all available groupings
getAvailableGroupings();
// ["EU", "NATO", "G7", "G20", "BRICS", "ASEAN", "AU", "ARAB_LEAGUE",
//  "COMMONWEALTH", "SCHENGEN", "EUROZONE", "FIVE_EYES", "OPEC",
//  "MERCOSUR", "CARICOM", "NORDIC", "BENELUX", "APEC"]
```

### Utilities

```ts
// Get all countries
getAllCountries();                    // all 250 countries

// Bordering countries
getNeighbors(getCountry("IN")!);     // [Pakistan, China, Nepal, Bangladesh, Myanmar, Bhutan]

// Phone & currency helpers
getPhoneCode(getCountry("IN")!);     // "+91"
getCurrencyInfo(getCountry("IN")!);  // { code: "INR", name: "Indian rupee", symbol: "₹" }

// Validation
isValidCountryCode("US");            // true
isValidCountryCode("XX");            // false

// Emoji flag generator
toEmojiFlag("US");                   // "🇺🇸"
toEmojiFlag("IN");                   // "🇮🇳"

// Distance between countries (Haversine formula)
const india = getCountry("IN")!;
const japan = getCountry("JP")!;
getDistance(india, japan);            // 5847 (km)

// Nearest countries by distance
getClosestCountries(india, 3);
// [{ country: Nepal, distance: 1138 },
//  { country: Pakistan, distance: 1316 },
//  { country: Bangladesh, distance: 1411 }]

// Postal code validation
validatePostalCode(getCountry("US")!, "90210");      // true
validatePostalCode(getCountry("IN")!, "110001");     // true
validatePostalCode(getCountry("US")!, "ABCDE");      // false

// Random country
getRandomCountry();                                   // random country
getRandomCountry(c => c.region === "Europe");         // random European country

// Multiple random countries
getRandomCountries(5);                                // 5 random countries
getRandomCountries(3, c => c.region === "Europe");    // 3 random European countries

// Filter by population or area range
getCountriesByPopulation(1_000_000_000);              // countries with 1B+ population
getCountriesByArea(0, 1000);                          // countries under 1000 km²

// Simplified flat output for APIs and forms
formatCountry(india);
// { name: "India", iso2: "IN", iso3: "IND", capital: "New Delhi",
//   currency: { code: "INR", name: "Indian rupee", symbol: "₹" },
//   phoneCode: "+91", flag: "🇮🇳", ... }

// Compare two countries side-by-side
compareCountries(india, japan);
// { name: { a: "India", b: "Japan" },
//   population: { a: 1428627663, b: 123294513 },
//   capital: { a: "New Delhi", b: "Tokyo" },
//   drivingSide: { a: "left", b: "left" }, ... }
```

## Country Data Structure

Each country object contains 25+ fields:

```ts
interface Country {
  name: {
    common: string;          // "India"
    official: string;        // "Republic of India"
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
  landlocked: boolean;
  independent: boolean | null;
  unMember: boolean;
  startOfWeek: string;       // "monday" | "sunday"
}
```

## All 34 Functions

| Function | Returns | Description |
|----------|---------|-------------|
| `getCountry(input)` | `Country \| undefined` | Smart lookup (auto-detects code type) |
| `getCountryByAlpha2(code)` | `Country \| undefined` | Lookup by ISO alpha-2 |
| `getCountryByAlpha3(code)` | `Country \| undefined` | Lookup by ISO alpha-3 |
| `getCountryByNumericCode(code)` | `Country \| undefined` | Lookup by ISO numeric |
| `getCountryByName(name)` | `Country \| undefined` | Lookup by country name |
| `getCountryByCapital(capital)` | `Country \| undefined` | Lookup by capital city |
| `getCountryByTLD(tld)` | `Country \| undefined` | Lookup by top-level domain |
| `getCountryByPhoneCode(code)` | `Country \| undefined` | Lookup by calling code |
| `getPhoneCode(country)` | `string` | Get formatted phone code |
| `getCurrencyInfo(country)` | `object \| undefined` | Get primary currency info |
| `isValidCountryCode(code)` | `boolean` | Validate ISO code |
| `searchCountries(query, opts?)` | `SearchResult[]` | Fuzzy search |
| `searchCountry(query, opts?)` | `Country \| undefined` | Top search result |
| `getCountriesByRegion(region)` | `Country[]` | Filter by region |
| `getCountriesByContinent(continent)` | `Country[]` | Filter by continent |
| `getCountriesBySubregion(subregion)` | `Country[]` | Filter by subregion |
| `getCountriesByLanguage(language)` | `Country[]` | Filter by language |
| `getCountriesByCurrency(code)` | `Country[]` | Filter by currency |
| `getCountriesByCallingCode(code)` | `Country[]` | Filter by calling code |
| `getCountriesByDrivingSide(side)` | `Country[]` | Filter by driving side |
| `getCountriesByTimezone(tz)` | `Country[]` | Filter by timezone |
| `getCountriesByStartOfWeek(day)` | `Country[]` | Filter by week start |
| `getCountriesByGrouping(group)` | `Country[]` | Filter by organization |
| `getGroupings(country)` | `string[]` | Get country's groupings |
| `getAvailableGroupings()` | `string[]` | List all 18 groupings |
| `filterCountries(options)` | `Country[]` | Combined multi-filter |
| `getAllCountries()` | `Country[]` | All 250 countries |
| `getNeighbors(country)` | `Country[]` | Bordering countries |
| `toEmojiFlag(cca2)` | `string` | Generate emoji flag |
| `getDistance(a, b)` | `number` | Distance in km |
| `getClosestCountries(country, n)` | `array` | Nearest countries |
| `getRandomCountry(filter?)` | `Country` | Random country |
| `compareCountries(a, b)` | `object` | Side-by-side comparison |
| `getRandomCountries(n, filter?)` | `Country[]` | N unique random countries |
| `getCountriesByPopulation(min?, max?)` | `Country[]` | Filter by population range |
| `getCountriesByArea(min?, max?)` | `Country[]` | Filter by area range |
| `formatCountry(country)` | `CountrySummary` | Simplified flat output |
| `validatePostalCode(country, code)` | `boolean` | Validate postal code |

## Features

- **Zero dependencies** — all data bundled, no API calls at runtime
- **Full TypeScript** — complete type definitions with strict mode
- **Dual ESM/CJS** — works with `import` and `require()`
- **Tree-shakable** — `sideEffects: false`, import only what you need
- **Tiny bundle** — 290 KB total (gzipped ~80 KB)
- **O(1) lookups** — pre-indexed maps for instant resolution (~2.5M ops/sec)
- **Fuzzy search** — handles typos, partial matches, demonym & currency search
- **Smart aliases** — "UK", "USA", "UAE", "Holland", "Burma" all resolve correctly
- **Case-insensitive** — all lookups normalize input automatically
- **250 countries** — comprehensive coverage including territories
- **18 country groupings** — EU, NATO, G7, G20, BRICS, ASEAN, Commonwealth, and more
- **157 postal code formats** — with regex validation patterns
- **Distance calculator** — haversine formula for km between any two countries
- **Geoproximity** — find the N closest countries to any given country
- **Driving side filter** — filter countries by left/right driving
- **Timezone filter** — find countries by timezone
- **Country comparison** — structured side-by-side diff of any two countries
- **Random country** — with optional filter predicate
- **Population/area range filters** — find countries by demographic criteria
- **`formatCountry()`** — simplified flat output for APIs and forms
- **127 unit tests** — comprehensive test coverage
- **CI/CD** — GitHub Actions with Node 18, 20, 22

## Use Cases

- **E-commerce**: Country selectors, currency/shipping lookups, address validation
- **Phone number forms**: Auto-detect country from calling code, format validation
- **Analytics dashboards**: Group users by region, continent, or economic bloc
- **Travel apps**: Distance calculations, neighboring countries, timezone info
- **Educational tools**: Country comparisons, quiz generators, geography data
- **API backends**: Validate country codes, enrich user data with country info
- **Internationalization (i18n)**: Language detection, locale mapping

## Development & Release Workflow

### Setup

```bash
git clone https://github.com/balamurugan-thiruganasammantham/country-info-pro.git
cd country-info-pro
npm install
```

### Making Changes

```bash
npm test              # Run all 114 tests
npm run typecheck     # Validate TypeScript
npm run build         # Generate dist/ (CJS + ESM)
npm run bench         # Performance benchmarks
```

### Publishing a New Version to npm

```bash
# 1. Bump version (choose one)
npm version patch   # 1.3.0 → 1.3.1 (bug fixes)
npm version minor   # 1.3.0 → 1.4.0 (new features)
npm version major   # 1.3.0 → 2.0.0 (breaking changes)

# 2. Push with tags — auto-publishes to npm via GitHub Actions
git push origin main --tags
```

### Quick Reference

| Action | Command | Result |
|--------|---------|--------|
| Run tests | `npm test` | Runs all 127 unit tests |
| Type check | `npm run typecheck` | Validates TypeScript |
| Build | `npm run build` | Generates dist/ (CJS + ESM) |
| Push code | `git push origin main` | CI runs (tests only) |
| Release to npm | `npm version patch && git push origin main --tags` | CI + auto-publish |

## Data Sources

Country data sourced from [mledoze/countries](https://github.com/mledoze/countries), enriched with population estimates, timezone data, postal code formats, and flag/map URLs.

## Contributing

Contributions are welcome! Please open an issue or submit a PR on [GitHub](https://github.com/balamurugan-thiruganasammantham/country-info-pro).

## License

MIT

---

**Keywords**: country, countries, ISO 3166, alpha-2, alpha-3, currency, timezone, flag, phone code, country info, country data, country lookup, country search, fuzzy search, EU, NATO, G7, G20, BRICS, ASEAN, postal code, TypeScript, zero dependencies, country groupings, distance calculator, geoproximity, country comparison, driving side, country API, ISO country codes, country names, capital cities, population data, country flags, calling codes, country borders
