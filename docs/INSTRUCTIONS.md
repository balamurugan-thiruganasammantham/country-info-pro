# Development Instructions

## Core Rules

1. **Zero runtime dependencies** — every feature must be built in-house. Dev dependencies only for build/test tooling.
2. **TypeScript strict mode** — no `any`, no `@ts-ignore`, no unsafe casts without validation.
3. **Every exported function must have tests** — no exceptions.
4. **Every change must be logged in MEMORY.md** — append-only.

## Coding Standards

- Functions must be small, pure, and single-purpose
- Prefer composition over inheritance
- All string comparisons must be case-insensitive via `normalize()`
- Use `const` by default, `let` only when mutation is required
- No default exports — named exports only for tree-shaking
- Barrel exports through `src/index.ts` only

## Performance Constraints

- Lookup operations: O(1) via pre-built index maps
- Search operations: O(n) with early termination where possible
- Data loading: lazy — only on first function call
- Bundle size target: < 500 KB minified (excluding sourcemaps)
- Startup latency: < 50ms for first lookup

## Bundle Size Policy

- JSON data must be stripped of unused fields
- No duplicate data storage
- Prefer computed values over stored values where computation is cheap
- Review bundle impact before adding any new data field

## API Design Principles

- Predictable return types: `T | undefined` for single lookups, `T[]` for filters
- All inputs are case-insensitive and trimmed automatically
- No throwing — return `undefined` or empty arrays for bad input
- Options objects for optional parameters (not positional args)
- Consistent naming: `getX` for single, `getXsByY` for filtered lists, `searchX` for fuzzy

## File Organization

```
src/
├── index.ts          — Public API barrel (exports only)
├── types/            — TypeScript interfaces and type unions
├── data/             — Static JSON datasets
├── core/             — Business logic (lookup, search, filters)
└── utils/            — Pure utility functions (fuzzy, normalize, loader)
```
