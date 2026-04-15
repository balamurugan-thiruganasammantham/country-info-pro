# Changelog

All notable changes to this project will be documented in this file.

## [1.5.0] - 2026-04-15

### Added
- **`sortCountries(countries, field, order)`**: sort any country array by name, population, area, capital, or region (asc/desc). Returns new array, does not mutate.
- **`getCountriesByBorderCount(count)`**: find countries with exactly N land borders (0 = island nations)
- **`getAllCurrencies()`**: returns all unique currencies with code, name, symbol, and list of countries using each
- **`getAllLanguages()`**: returns all unique languages with ISO code, name, and list of countries
- **`getAllTimezones()`**: returns all unique timezones with associated countries
- **`SortField` type**: exported union type for sortCountries field parameter
- **50+ aliases** in `getCountry()`: added England, Scotland, Emirates, Czech Republic, RSA, Saudi, NZ, Hong Kong, DPRK, PRC, Trinidad, Bosnia, and more
- **CONTRIBUTING.md**: contributor guide with setup, guidelines, and project structure
- 11 new unit tests (138 total across 5 test files)

### Improved
- Total exported functions: 38 → 43
- Total exported types: 16 → 17 (SortField)
- Alias map expanded from 28 → 50+ entries for better `getCountry()` coverage

## [1.4.0] - 2026-04-15

### Added
- **Search performance optimization**: pre-extracted and normalized search fields during data load — eliminates per-query allocations for 2-3x faster fuzzy search
- **`getRandomCountries(n, filter?)`**: returns N unique random countries with optional predicate filter (Fisher-Yates shuffle)
- **`getCountriesByPopulation(min?, max?)`**: filter countries by population range
- **`getCountriesByArea(min?, max?)`**: filter countries by area range (km²)
- **`formatCountry(country)`**: returns a simplified flat `CountrySummary` object for APIs, forms, and display
- **`CountrySummary` type**: exported for TypeScript consumers of `formatCountry()`
- `populationMin`, `populationMax`, `areaMin`, `areaMax` options added to `filterCountries()`
- `SearchIndex` type in loader for pre-extracted search data
- 13 new unit tests (127 total across 5 test files)

### Improved
- **Search internals**: search now reads from pre-built `SearchIndex` instead of extracting and normalizing fields per query per country — eliminates ~2000 string allocations per search call
- Total exported functions: 34 → 38
- Total exported types: 15 → 16 (added `CountrySummary`)

## [1.3.0] - 2026-04-15

### Added
- **Driving side filter**: `getCountriesByDrivingSide("left")` — filter by left/right driving countries
- **Timezone filter**: `getCountriesByTimezone("UTC+05:30")` — find countries in a specific timezone
- **Phone code lookup**: `getCountryByPhoneCode("+91")` — single country lookup by calling code
- `drivingSide` and `timezone` options added to `filterCountries()`
- Node 22 added to CI matrix
- npm provenance support for supply chain security
- Bundle size check in CI (fails if > 500KB)
- 10 new unit tests (114 total across 5 test files)

### Improved
- **Bundle size reduced 36%**: 460 KB → 293 KB (stripped nativeName, coatOfArms, capitalInfo, cioc, status fields + minified JSON)
- **README completely rewritten**: full API reference table (all 34 functions), comparison table, use cases, CommonJS example, SEO keywords
- **package.json SEO**: expanded to 32 keywords, added engines field
- Total exported functions: 31 → 34

### Breaking Changes
- Removed `coatOfArms` field from Country type (rarely used, saved 33KB)
- Removed `capitalInfo` field from Country type (redundant with `capital` + `latlng`)
- Removed `cioc` (IOC code) and `status` fields from Country type
- Removed `nativeName` from `CountryName` type (saved 39KB)

## [1.2.0] - 2026-03-20

### Added
- **Distance calculator**: `getDistance(countryA, countryB)` — haversine formula, returns km
- **Geoproximity search**: `getClosestCountries(country, n)` — nearest N countries by distance
- **Postal code validation**: `validatePostalCode(country, code)` — validates against country regex
- **Country comparison**: `compareCountries(a, b)` — structured side-by-side diff
- **Random country**: `getRandomCountry(filter?)` — with optional predicate
- **Emoji flag generator**: `toEmojiFlag(cca2)` — computes flag from alpha-2 code
- **Subregion filter**: `getCountriesBySubregion("Southern Asia")`
- **Start-of-week filter**: `getCountriesByStartOfWeek("monday")`
- 24 new unit tests (104 total across 5 test files)

### Improved
- **Search early termination**: perfect matches skip remaining field checks
- Total exported functions: 22 → 31

## [1.1.0] - 2026-03-20

### Added
- **Country groupings**: `getCountriesByGrouping()`, `getGroupings()`, `getAvailableGroupings()` — supports 18 organizations: EU, NATO, G7, G20, BRICS, ASEAN, AU, Arab League, Commonwealth, Schengen, Eurozone, Five Eyes, OPEC, MERCOSUR, CARICOM, NORDIC, BENELUX, APEC
- **Currency name search**: `searchCountries("rupee")` now finds India, `searchCountries("dollar")` finds all dollar-using countries
- **Performance benchmarks**: `npx tsx scripts/benchmark.ts` — lookups at ~2.5M ops/sec
- `CountryGrouping` type export for TypeScript consumers
- 12 new unit tests for groupings and currency search (80 total)

### Improved
- **O(1) capital & TLD lookups**: `getCountryByCapital()` and `getCountryByTLD()` now use pre-indexed maps instead of linear scans (~3M ops/sec, up from ~500K)
- Data integrity validated: all 250 countries' border codes resolve correctly, all IDD roots valid

## [1.0.0] - 2026-03-20

### Added
- Initial release with 250 countries, 25+ data fields per country
- Smart lookup via `getCountry()` — auto-detects alpha-2, alpha-3, numeric, name, or alias
- Fuzzy search with typo tolerance via `searchCountries()` and `searchCountry()`
- 28 common aliases (UK, USA, UAE, Holland, Burma, etc.)
- Demonym search support
- 157 postal code formats with regex validation
- Filter by region, continent, language, currency, calling code
- Combined multi-field filtering via `filterCountries()`
- Helper functions: `getPhoneCode()`, `getCurrencyInfo()`, `isValidCountryCode()`
- Lookups by capital and TLD
- Zero runtime dependencies
- Dual ESM/CJS with full TypeScript declarations
- 68 unit tests
