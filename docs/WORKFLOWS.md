# Development Workflows

## Feature Development Lifecycle

1. **Identify** — read ROADMAP.md, pick next priority
2. **Design** — define types first, then function signatures
3. **Implement** — write code in `src/core/` or `src/utils/`
4. **Test** — add tests in `tests/`, ensure all pass
5. **Export** — add to `src/index.ts` barrel
6. **Build** — run `npm run build`, verify output
7. **Document** — update README.md API reference
8. **Log** — append to MEMORY.md

## Bug Fixing Workflow

1. Write a failing test that reproduces the bug
2. Fix the code
3. Verify all tests pass
4. Log in MEMORY.md

## Refactoring Process

1. Ensure full test coverage for the code being refactored
2. Make incremental changes
3. Run tests after each change
4. Verify build output hasn't regressed (check bundle size)
5. Log in MEMORY.md

## Release Process

1. Run `npm run typecheck`
2. Run `npm run test`
3. Run `npm run build`
4. Verify bundle size
5. Update version in package.json (semver)
6. Update MEMORY.md with release notes
7. `npm publish`

## Data Update Workflow

1. Run `npm run fetch-data` to refresh from upstream
2. Run diff on `src/data/countries.json` to review changes
3. Run all tests
4. Log data changes in MEMORY.md

## Improvement Cycle (Agentic Loop)

1. Read all docs (INSTRUCTIONS, WORKFLOWS, SKILLS, MEMORY, ROADMAP)
2. Analyze current codebase for issues
3. Pick highest-impact improvement from ROADMAP
4. Implement following Feature Development Lifecycle
5. Update all relevant docs
6. Repeat
