# Contributing to country-info-pro

Thanks for your interest in contributing! Here's how to get started.

## Setup

```bash
git clone https://github.com/balamurugan-thiruganasammantham/country-info-pro.git
cd country-info-pro
npm install
```

## Development

```bash
npm test              # Run all tests
npm run typecheck     # TypeScript validation
npm run build         # Build CJS + ESM + types
npm run bench         # Performance benchmarks
```

## Making Changes

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes in `src/`
3. Add tests in `tests/`
4. Run `npm test` and `npm run typecheck`
5. Commit and push
6. Open a PR against `main`

## Guidelines

- **Zero dependencies** — do not add runtime dependencies
- **TypeScript strict** — no `any`, no `@ts-ignore`
- **Test everything** — every exported function must have tests
- **Case-insensitive** — all string inputs must be normalized
- **No throwing** — return `undefined` or `[]` for invalid input
- **JSDoc** — add doc comments to all exported functions
- **Bundle size** — keep CJS under 500KB (CI enforces this)

## Project Structure

```
src/
  index.ts          — Public exports barrel
  types/            — TypeScript interfaces
  data/             — Static JSON + groupings
  core/             — Lookup, search, filter, utility functions
  utils/            — Fuzzy matching, normalization, data loader
tests/              — Vitest test files
```

## Reporting Issues

Open an issue at https://github.com/balamurugan-thiruganasammantham/country-info-pro/issues

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
