# Electron variant overlay

Desktop admin repos (R30–R31) start from the library blueprint, then add Electron main/preload/renderer structure.

## Baseline (unchanged)

Retain library toolchain for shared TypeScript modules published or consumed internally:

- Strict TS, Vitest, ESLint, Prettier
- Husky hooks and CI `check`
- Changesets if sub-packages publish to npm

## Additional files (overlay)

| File                                          | Purpose                           |
| --------------------------------------------- | --------------------------------- |
| `electron.vite.config.ts` or `vite.config.ts` | Bundler for main/preload/renderer |
| `src/main/`                                   | Electron main process             |
| `src/preload/`                                | Context-isolated preload scripts  |
| `src/renderer/`                               | UI (often React)                  |
| `package.json` scripts                        | `dev`, `build:electron`, `start`  |
| `.github/workflows/ci.yml`                    | Add electron build smoke step     |

## TypeScript notes

- Use separate `config/tsconfig.main.json` / `config/tsconfig.renderer.json` that **extend** `config/tsconfig.json`
- Do not relax `strict` or disable `noUncheckedIndexedAccess` in overlays

## Verification

```bash
npm run check
npm run build:electron
```

## Strategy

Shared domain logic lives in `src/` library exports (same layout rules). Electron-specific IPC wiring stays in `src/main/` and `src/preload/`.
