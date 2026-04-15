# Skills & Patterns

## Search Algorithms

### Levenshtein Distance (`src/utils/fuzzy.ts`)
- Single-row DP optimization: O(min(m,n)) space
- Early termination via `maxDistance` parameter — skips computation when length difference alone exceeds threshold
- Used as fallback when prefix/substring matching fails

### Fuzzy Scoring Strategy
- **Phase 1 — Exact match**: score = 1.0
- **Phase 2 — Prefix match**: score = 0.9 + 0.1 × (queryLen / targetLen)
- **Phase 3 — Substring match**: score = 0.7 × (queryLen / targetLen)
- **Phase 4 — Levenshtein fallback**: score = 1 - (distance / maxLen), threshold = 0.6

### Multi-Field Weighted Search (`src/core/search.ts`)
- Fields searched in priority order with weights:
  - `name.common` (1.0), `name.official` (0.9), `cca2` (0.95), `cca3` (0.95), `altSpellings` (0.8), `demonym` (0.75), `capital` (0.7)
- Short queries (< 2 chars) skip code fields to avoid false positives
- Results sorted by score descending, sliced to limit

### Alias Resolution (`src/core/lookup.ts`)
- Static `ALIASES` map: 28 common abbreviations/alternate names → alpha-2 codes
- Checked first in `getCountry()` cascade, before code detection
- Examples: "UK" → GB, "USA" → US, "Holland" → NL, "Burma" → MM

## Data Normalization (`src/utils/normalize.ts`)

- Unicode NFD decomposition to strip diacritics: `"Réunion"` → `"reunion"`
- Lowercase for case-insensitive matching
- Trim whitespace
- Preserves apostrophes and hyphens (important for "Côte d'Ivoire", "Guinea-Bissau")

## Data Loading & Indexing (`src/utils/loader.ts`)

- **Lazy initialization**: data loaded on first function call, not at import time
- **Index maps** for O(1) lookups:
  - `alpha2Map`: Map<uppercase_code, Country>
  - `alpha3Map`: Map<uppercase_code, Country>
  - `numericMap`: Map<code, Country>
  - `nameMap`: Map<lowercase_name, Country> (both common and official names)
  - `capitalMap`: Map<lowercase_capital, Country>
  - `tldMap`: Map<lowercase_tld, Country>
- Maps built once, reused for all subsequent calls
- Benchmark: ~2.5M lookups/sec, ~3M for capital/TLD

## TypeScript Patterns

- Union types for constrained values (`Region`, `Continent`)
- `Record<string, T>` for dynamic key maps (currencies, languages, demonyms)
- Tuple types for lat/lng: `[number, number]`
- Discriminated return types: `Country | undefined` for lookups, `Country[]` for filters
- `SearchResult` wraps `Country` with metadata (score, matchedOn)

## Country Groupings (`src/data/groupings.ts`)

- Static `GROUPINGS` map: `Record<CountryGrouping, readonly string[]>` with `as const`
- 18 organizations, values are alpha-2 code arrays
- `getCountriesByGrouping()` resolves codes to Country objects via `byAlpha2()`
- `getGroupings()` does reverse lookup: iterates all groupings checking membership
- Both operations sub-microsecond due to small dataset size

## Multi-Word Currency Search (`src/core/search.ts`)

- Currency field extractor splits names into individual words
- "rupee" matches "Indian rupee" by matching the word "rupee" directly (score ~0.65)
- Words shorter than 3 chars are filtered out to avoid noise
- Combined with full name matching for "Indian rupee" → exact match

## Geographic Utilities (`src/core/utils.ts`)

### Haversine Distance
- Standard formula: `2R × atan2(√a, √(1-a))` where R = 6371 km
- Uses country center points (`latlng` field)
- Accuracy: within ~1% for most countries (center-to-center, not border-to-border)

### Geoproximity Search
- `getClosestCountries()` computes distance to all 250 countries, sorts, slices
- O(n log n) due to sort — fast enough for 250 entries
- Excludes the source country from results

### Emoji Flag Generation
- Unicode Regional Indicator Symbols: `0x1F1E6` + char offset for each letter
- `toEmojiFlag("US")` → `String.fromCodePoint(0x1F1FA, 0x1F1F8)` → 🇺🇸
- Computed, not stored — saves ~2KB in data

### Postal Code Validation
- Uses country's `postalCode.regex` pattern
- Wrapped in try/catch for malformed regex safety
- Returns `false` for countries without postal codes

## Pre-extracted Search Index (`src/utils/loader.ts`)

- `SearchIndex` built once during `ensureLoaded()` alongside lookup maps
- Each entry pre-normalizes: `commonName`, `officialName`, `cca2`, `cca3`, `altSpellings`, `capitals`, `demonyms`, `currencyNames`
- Currency names split into individual words (3+ chars) for partial matching
- Eliminates ~2000 `normalize()` calls per `searchCountries()` invocation
- Search module reads from index directly — no per-query allocations

## Fisher-Yates Shuffle (`src/core/utils.ts`)

- Partial Fisher-Yates for `getRandomCountries(n)` — only shuffles first `n` elements
- O(n) time, O(1) extra space
- Guarantees unique results without Set-based deduplication

## Simplified Output Pattern (`formatCountry`)

- Flattens nested Country structure into a 25-field `CountrySummary`
- Extracts primary currency (first entry), primary capital, primary TLD, primary continent
- Formats phone code inline (root + suffix for single-suffix countries)
- Returns `null` for missing optional fields (currency, capital) instead of `undefined`

## Build & Distribution

- tsup for dual ESM/CJS output with declaration files
- `sideEffects: false` enables tree-shaking
- Conditional exports in package.json for proper module resolution
- Sourcemaps for debugging (excluded from npm package via .npmignore)
