# Roadmap

## Completed

- [x] Strip unused null fields (gini, fifa) to reduce bundle
- [x] Add postal code data (157 countries) + validation utility
- [x] Validate data integrity: all border codes resolve, all IDD codes valid
- [x] All lookup functions: Alpha2, Alpha3, Numeric, Name, Capital, TLD
- [x] Smart `getCountry()` with alias resolution (28 aliases)
- [x] Helpers: getPhoneCode, getCurrencyInfo, isValidCountryCode
- [x] searchCountry (singular) + searchCountries (plural)
- [x] Demonym search + currency name search
- [x] 18 country groupings (EU, NATO, G7, G20, BRICS, ASEAN, etc.)
- [x] O(1) indexed lookups (alpha2, alpha3, numeric, name, capital, TLD)
- [x] Performance benchmarks (2.5M ops/sec lookups)
- [x] Distance calculator (haversine)
- [x] Geoproximity search (closest N countries)
- [x] Country comparison utility
- [x] Random country generator
- [x] Emoji flag generator (computed from cca2)
- [x] Subregion and start-of-week filters
- [x] Search early termination on perfect match
- [x] JSDoc on all exports, CHANGELOG.md, SEO keywords

## Next Up

### Performance
- [ ] Pre-extract search field values during data load (avoid per-search allocations)
- [ ] Add memoization for repeated filter calls with same args
- [ ] Investigate minification of countries.json to reduce bundle < 400KB

### API Gaps
- [ ] `getCountryByPhoneCode(code)` as alias for getCountriesByCallingCode returning single
- [ ] `getCountriesByTimezone("UTC+05:30")` filter
- [ ] `getCountriesByDrivingSide("left")` filter
- [ ] `getRandomCountries(n, filter?)` returning multiple random countries

### Data
- [ ] Add GINI index data where available
- [ ] Independence year/date field
- [ ] Internet penetration / common statistics
- [ ] Alternative country name spellings expansion

### Advanced Features
- [ ] i18n support — country names in other languages (using translations data)
- [ ] Subdivision/state data as opt-in submodule
- [ ] Country quiz/trivia generator using the data
- [ ] Plugin system for user-contributed data extensions
- [ ] Streaming/async API for server-side use with large datasets

### DX & Distribution
- [ ] GitHub Actions CI/CD config
- [ ] Contributing guide
- [ ] Code examples in JSDoc
- [ ] Interactive API playground (StackBlitz / CodeSandbox)

## Competitive Advantages

1. **18 country groupings** — no competitor offers this
2. **Haversine distance + geoproximity** — unique feature
3. **Postal code validation** — unique feature
4. **Country comparison** — unique feature
5. **Random country generator** — unique feature
6. Most complete data per country (25+ fields)
7. Fastest lookups at ~2.5M ops/sec
8. Built-in fuzzy search with typo tolerance
9. Zero dependencies
10. 31 exported functions — most comprehensive API
