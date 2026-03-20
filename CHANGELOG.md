# Changelog

All notable changes to this project will be documented in this file.

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
