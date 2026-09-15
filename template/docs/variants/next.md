# Next.js variant overlay

Admin and web GUI repos (R27–R29) start from the library blueprint, then add Next.js-specific files.

## Baseline (unchanged)

Keep the entire library toolchain:

- `config/tsconfig.json` strict flags (root `tsconfig.json` extends it)
- ESLint, Prettier, Vitest in `config/` (for shared packages extracted from the app)
- Husky, Changesets, CI `check` job
- CONTRIBUTING.md and issue templates

## Additional files (overlay)

| File                       | Purpose                                                     |
| -------------------------- | ----------------------------------------------------------- |
| `next.config.ts`           | Next.js app configuration                                   |
| `app/` or `pages/`         | Application routes                                          |
| `config/tsconfig.json`     | Extend base config with `"jsx": "preserve"` and Next plugin |
| `config/eslint.config.js`  | Add `eslint-config-next` rules for app directory            |
| `.github/workflows/ci.yml` | Add `next build` step after `npm run check`                 |

## Substitution

Use the same template placeholders as the library variant. Package name typically remains `@itsa/<repo-name>` for shared exports; the Next app may use a private `"name"` field or a monorepo layout if multiple packages are extracted later.

## Verification

```bash
npm run check
npm run build   # next build — add script after overlay
```

## Strategy

Extract reusable logic into `src/` library exports first; keep Next-specific UI in `app/`. Do not fork ESLint or Vitest configs — extend them.
