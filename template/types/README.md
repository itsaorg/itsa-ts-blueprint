# types/

Hand-maintained placeholder for public TypeScript declarations.

- **Before first build:** `index.d.ts` mirrors the public API in `src/` so IDEs and tooling resolve types immediately.
- **After `npm run build`:** TypeScript regenerates this folder; `check:types-mirror` verifies symbols match the published API.

Do not edit release sections in `CHANGELOG.md` from here — see [CONTRIBUTING.md](../CONTRIBUTING.md).
