# Roadmap

## Completed

- [x] Strip unused fields (gini, fifa, nativeName, coatOfArms, capitalInfo, cioc, status)
- [x] Minify JSON data (no whitespace) — bundle 460KB → 293KB
- [x] Add postal code data (157 countries) + validation utility
- [x] Validate data integrity: all border codes resolve, all IDD codes valid
- [x] All lookup functions: Alpha2, Alpha3, Numeric, Name, Capital, TLD, PhoneCode
- [x] Smart `getCountry()` with alias resolution (28 aliases)
- [x] Helpers: getPhoneCode, getCurrencyInfo, isValidCountryCode
- [x] searchCountry (singular) + searchCountries (plural)
- [x] Demonym search + currency name search
- [x] 18 country groupings (EU, NATO, G7, G20, BRICS, ASEAN, etc.)
- [x] O(1) indexed lookups (alpha2, alpha3, numeric, name, capital, TLD)
- [x] Performance benchmarks (2.5M ops/sec lookups)
- [x] Distance calculator (haversine) + geoproximity search
- [x] Country comparison utility
- [x] Random country generator + emoji flag generator
- [x] Subregion, start-of-week, driving side, timezone filters
- [x] drivingSide and timezone options in filterCountries()
- [x] Search early termination on perfect match
- [x] JSDoc on all exports, CHANGELOG.md, full README SEO
- [x] GitHub Actions CI/CD (Node 18, 20, 22) + auto-publish with provenance
- [x] Bundle size check in CI (max 500KB)
- [x] npm automation token (bypasses 2FA for CI/CD)

## Next Up

### Performance
- [x] Pre-extract search field values during data load (avoid per-search allocations)
- [ ] Add memoization for repeated filter calls with same args
- [ ] Compress JSON data further (abbreviate long field names at build time)

### API (Done in v1.4.0)
- [x] `getRandomCountries(n, filter?)` returning multiple random countries
- [x] `getCountriesByPopulation(min, max)` range filter
- [x] `getCountriesByArea(min, max)` range filter
- [x] `formatCountry(country)` — simplified flat `CountrySummary` output
- [x] `populationMin/Max`, `areaMin/Max` added to `filterCountries()`

### Data
- [ ] Add GINI index data where available
- [ ] Independence year/date field
- [ ] Alternative country name spellings expansion
- [ ] ISO 4217 numeric currency codes

### Advanced Features
- [ ] i18n support — country names in other languages
- [ ] Subdivision/state data as opt-in submodule
- [ ] Country quiz/trivia generator
- [ ] Plugin system for user-contributed data extensions

### DX & Distribution
- [x] Contributing guide
- [ ] Code examples in JSDoc
- [ ] Interactive API playground (StackBlitz / CodeSandbox)
- [x] Benchmark results in README

## Competitive Advantages

1. **46 exported functions** — most comprehensive API in the ecosystem
2. **18 country groupings** — no competitor offers this
3. **Haversine distance + geoproximity** — unique feature
4. **Postal code validation** — unique feature
5. **Country comparison** — unique feature
6. **Timezone & driving side filters** — unique feature
7. **290KB bundle** — smaller than comparable feature-rich packages
8. Fastest lookups at ~2.5M ops/sec via O(1) hash maps
9. Built-in fuzzy search with typo tolerance
10. Zero dependencies
11. Full TypeScript strict mode + dual ESM/CJS
12. CI/CD with Node 18/20/22 + npm provenance
