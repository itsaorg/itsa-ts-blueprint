# Library variant (default)

The default blueprint targets **publishable TypeScript libraries** under the `@itsa` npm scope.

## What you get

After token substitution and `npm install`:

- Strict TypeScript (`src/` → `dist/` + `types/`)
- Vitest unit/integration + consumer import tests
- ESLint flat config + Prettier
- Husky + Commitlint + lint-staged
- Changesets + CI/publish workflows
- CONTRIBUTING.md + issue/PR templates

## Required steps

1. Create repo from `itsaorg/itsa-ts-blueprint` template
2. Substitute template placeholders (or use GitHub template variables)
3. `npm install && npm run check`

## Files that differ from other variants

None. The library variant is the baseline — zero overlay files beyond substitution.

## When to use

All R1–R21 core packages, protocol libraries, and shared utilities that publish to npm.
