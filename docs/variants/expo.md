# Expo / React Native variant overlay

Mobile repos (R32) start from the library blueprint for shared TypeScript modules, then add Expo application structure.

## Baseline (unchanged)

Keep Husky, Commitlint, Prettier, and CI `check` for any publishable library code in `src/`.

## Additional files (overlay)

| File                         | Purpose                                         |
| ---------------------------- | ----------------------------------------------- |
| `app.json` / `app.config.ts` | Expo configuration                              |
| `app/`                       | Expo Router or screen entry                     |
| `babel.config.js`            | Expo Babel preset                               |
| `metro.config.js`            | Metro bundler                                   |
| `config/tsconfig.json`       | Extend base with `"jsx": "react-native"`        |
| `.github/workflows/ci.yml`   | Add `expo export` or typecheck-only mobile step |

## TypeScript notes

Extend `config/tsconfig.json` — do not replace strict flags. Shared business logic remains in `src/` with one export per file.

## Verification

```bash
npm run check
npx expo-doctor
npx tsc --noEmit   # if mobile tsconfig overlay added
```

## Strategy

Publish shared types and clients from `src/` via the standard `@itsa/<package>` export map. Mobile UI stays in `app/` and does not alter the library `check` pipeline for core modules.
