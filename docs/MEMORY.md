# Change Log

## [2026-03-20] — Initial Build

### Added
- Complete package scaffold: package.json, tsconfig.json, tsup.config.ts, vitest.config.ts
- 250-country static dataset from mledoze/countries, enriched with population, timezones, continents, flag URLs, map links, car driving side, coat of arms
- Type definitions: Country, CountryName, Currency, InternationalDialing, Demonym, Maps, CarInfo, FlagUrls, CoatOfArms, PostalCode, Region, Continent, SearchResult, SearchOptions, FilterOptions
- Lookup functions: getCountry (smart), getCountryByAlpha2, getCountryByAlpha3, getCountryByNumericCode, getCountryByName
- Search: searchCountries with fuzzy multi-field weighted scoring
- Filters: getCountriesByRegion, getCountriesByContinent, getCountriesByLanguage, getCountriesByCurrency, getCountriesByCallingCode, filterCountries
- Utilities: getAllCountries, getNeighbors
- Fuzzy search engine: Levenshtein distance with early termination + prefix/substring scoring
- String normalization: NFD diacritics removal, lowercase, trim
- Lazy data loader with O(1) index maps
- 54 unit tests across 4 test files (fuzzy, lookup, search, filters)
- README.md with full API reference and usage examples
- MIT LICENSE
- Data fetch script (scripts/fetch-data.ts)

### Fixed
- getCountriesByCallingCode: added root-only matching for countries like US/Canada where root "+1" is the calling code itself (suffixes are area codes)

### Reason
- Initial package creation to provide comprehensive, zero-dependency country data with TypeScript support

## [2026-03-20] — Improvement Cycle 1

### Added
- **6 new API functions**: getCountryByCapital, getCountryByTLD, getPhoneCode, getCurrencyInfo, isValidCountryCode, searchCountry (singular)
- **Alias system**: 28 common abbreviations/alternate names (UK, USA, UAE, Holland, Burma, etc.) resolve via getCountry()
- **Demonym search**: searchCountries now matches on English demonyms (e.g., "American" → United States)
- **157 postal code formats** with regex validation patterns enriched into country data
- **JSDoc comments** on all 19 exported functions
- **14 new unit tests** for aliases, capital lookup, TLD lookup, phone code, currency info, validation, and searchCountry
- **/docs/ system**: INSTRUCTIONS.md, WORKFLOWS.md, SKILLS.md, MEMORY.md, ROADMAP.md

### Improved
- **Bundle size reduced 29%**: 527KB → 380KB CJS (stripped unused null fields gini/fifa, removed JSON formatting)
- **README.md**: added comparison table, badges, all new API docs, SEO keywords, multiple install methods
- **getCountry()**: aliases checked before code detection, fixing edge cases like "UK" (2-char alias)

### Refactored
- Country type: gini and fifa fields made optional (were always null in dataset)
- Alias lookup moved to top of getCountry() cascade for priority over code detection

### Reason
- Increase API completeness and developer ergonomics
- Reduce bundle size for better performance
- Add postal code data (frequently requested feature)
- Establish documentation system for continuous improvement

## [2026-03-20] — Improvement Cycle 2 (v1.1.0)

### Added
- **18 country groupings**: EU (27), NATO (32), G7, G20, BRICS (9), ASEAN (10), African Union, Arab League, Commonwealth (54), Schengen (29), Eurozone (20), Five Eyes, OPEC (13), MERCOSUR, CARICOM, Nordic, Benelux, APEC (21)
- **3 new API functions**: `getCountriesByGrouping()`, `getGroupings()`, `getAvailableGroupings()`
- **Currency name search**: search now splits multi-word currency names for better partial matching ("rupee" finds India, "dollar" finds 10+ countries)
- **`CountryGrouping` type** export for TypeScript consumers
- **Performance benchmark script** (`scripts/benchmark.ts`): lookups ~2.5M ops/sec, filters ~500K ops/sec, groupings ~195K ops/sec
- **CHANGELOG.md** for npm publishing
- **12 new unit tests** for groupings, currency search, demonym search (80 total)
- Groupings data module (`src/data/groupings.ts`) — typed, `as const`

### Improved
- **O(1) capital & TLD lookups**: `getCountryByCapital()` and `getCountryByTLD()` now use pre-indexed maps in loader.ts instead of `Array.find()` linear scans (~3M ops/sec, up from ~500K)
- **Data integrity validated**: all 250 border codes resolve, all IDD roots valid
- **package.json SEO**: expanded keywords (eu, nato, g7, brics, iso-3166, etc.), improved description
- **README.md**: added country groupings section with examples, updated features list

### Refactored
- `loader.ts`: added `capitalMap` and `tldMap` index maps, exported `byCapital()` and `byTLD()` helpers
- `lookup.ts`: `getCountryByCapital` and `getCountryByTLD` now delegate to indexed loader instead of inline `getAll().find()`

### Reason
- Country groupings are a major differentiator — no competing npm package offers this
- O(1) capital/TLD lookups eliminate unnecessary linear scans
- Currency name search fills a gap where users expect natural language queries
- Benchmarks provide confidence in performance claims and catch regressions

## [2026-03-20] — Improvement Cycle 3 (v1.2.0)

### Added
- **6 new utility functions**: `toEmojiFlag()`, `getDistance()`, `getRandomCountry()`, `compareCountries()`, `validatePostalCode()`, `getClosestCountries()`
- **2 new filter functions**: `getCountriesBySubregion()`, `getCountriesByStartOfWeek()`
- **New `src/core/utils.ts` module** — pure utility functions separated from lookup/filter logic
- **Haversine distance calculator** — compute km between any two countries
- **Postal code validation** — validate strings against country-specific regex patterns
- **Country comparison** — side-by-side structured diff of two countries
- **Geoproximity search** — `getClosestCountries()` returns nearest N countries by distance
- **24 new tests** in `tests/utils.test.ts` (104 total, 5 test files)

### Improved
- **Search early termination**: when a perfect match (score 1.0) is found, stops checking remaining fields for that country
- **Total exported functions**: 22 → 31 (41% increase)
- **Type declarations**: 8.35 KB (up from 6.69 KB — more functions, richer types)

### Reason
- Distance calculator and geoproximity are unique features no competitor offers
- Postal code validation turns stored regex into actionable utility
- Country comparison serves common use cases (e.g., decision tools, infographics)
- Random country generator is useful for quizzes, demos, and testing
- Early termination improves search performance for exact-match queries

## [2026-04-15] — Improvement Cycle 4 (v1.3.0)

### Added
- **3 new API functions**: `getCountriesByDrivingSide()`, `getCountriesByTimezone()`, `getCountryByPhoneCode()`
- **2 new FilterOptions**: `drivingSide` and `timezone` in `filterCountries()`
- **Node 22** added to CI matrix (now tests on Node 18, 20, 22)
- **npm provenance** support in publish workflow for supply chain security
- **Bundle size check** in CI — fails build if CJS exceeds 500KB
- **10 new unit tests** (114 total)
- **Automation token** for npm — CI/CD auto-publish now works without OTP

### Improved
- **Bundle size reduced 36%**: 460KB → 293KB CJS (stripped nativeName, coatOfArms, capitalInfo, cioc, status + minified JSON)
- **README completely rewritten**: 34-function API table, 12-row comparison table, use cases, CommonJS example, SEO keywords
- **package.json SEO**: 20 → 32 keywords, added engines field
- Both GitHub repos synced with identical code

### Breaking Changes
- Removed coatOfArms, capitalInfo, cioc, status fields from Country type
- Removed nativeName from CountryName type
- Removed CoatOfArms type export

### Reason
- Downloads dropped post-launch — needed better SEO, discoverability, smaller bundle
- Unused fields inflated bundle size by 196KB
- Missing timezone/driving side filters were gaps vs real-world needs
- CI/CD auto-publish needed automation token to bypass 2FA
