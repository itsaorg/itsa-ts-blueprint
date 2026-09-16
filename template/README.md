# **PACKAGE_NAME**

Frozen TypeScript library toolchain and GitHub template for all Itsa platform repositories (**REPO_ID**). Downstream repos substitute metadata tokens only — no ESLint, TypeScript, Vitest, Husky, or CI reconfiguration.

## Purpose

- **Configure once** in R0
- **Copy via GitHub template** for R1–R32 and A1
- **Substitute** template placeholders with repo metadata
- **Verify** with `npm install && npm run check`

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full contribution SOP and [MVP.md](../MVP.md) for the platform catalog.

## Prerequisites

| Requirement              | Verify             |
| ------------------------ | ------------------ |
| Node.js 22.12.0          | `node -v`          |
| npm                      | `npm -v`           |
| GitHub CLI               | `gh auth status`   |
| git-flow (AVH)           | `git flow version` |
| npm org access (publish) | `npm whoami`       |

```bash
nvm use
# or: fnm use / volta install node@22.12.0
```

## Quick start (Human Step 0 — downstream repos)

Create a new library repo from this template:

```bash
gh repo create itsaorg/itsa-example --template __GITHUB_ORG__/__REPO_NAME__ --private=false
git clone git@github.com:itsaorg/itsa-example.git udawg-game-bot-refactor/itsa-example
cd udawg-game-bot-refactor/itsa-example
git flow init -d
git checkout develop
```

Substitute tokens (if not done by template variables):

```bash
node scripts/substitute-names.mjs \
  --repo itsa-example \
  --package @itsaorg/example \
  --description "Example Itsa library" \
  --repo-id R99 \
  --phase P1 \
  --out .
```

Install and verify:

```bash
npm install
npm run check
```

## Git Flow cheat sheet

| Branch type | Start                                   | Finish                                   |
| ----------- | --------------------------------------- | ---------------------------------------- |
| Feature     | `git flow feature start <issue>-<slug>` | `git flow feature finish <issue>-<slug>` |
| Bugfix      | `git flow bugfix start <issue>-<slug>`  | `git flow bugfix finish <issue>-<slug>`  |
| Release     | `git flow release start <version>`      | `git flow release finish <version>`      |
| Hotfix      | `git flow hotfix start <version>`       | `git flow hotfix finish <version>`       |
| Support     | `git flow support start <name> <base>`  | `git flow support finish <name>`         |

Long-lived branches: `main` (production), `develop` (integration).

## npm scripts reference

Every script below is inherited unchanged by scaffolded repos. Toolchain configs live in `config/`.

### `build`

Compile ESM to `dist/` and declarations to `types/`.

```bash
npm run build
```

### `clean`

Remove build, coverage, and generated docs artifacts.

```bash
npm run clean
```

### `typecheck`

TypeScript check without emit.

```bash
npm run typecheck
```

### `lint` / `lint:fix`

Type-aware ESLint (`config/eslint.config.js`).

```bash
npm run lint
npm run lint:fix
```

### `format` / `format:check`

Prettier write or check (`config/.prettierrc.json`).

```bash
npm run format
npm run format:check
```

### `test` / `test:watch` / `test:coverage`

Vitest unit and integration suites (`config/vitest.config.ts`). Coverage enforces 80% thresholds.

```bash
npm run test
npm run test:watch
npm run test:coverage
```

### `test:consumer`

ESM consumer import test (`config/vitest.consumer.config.ts`).

```bash
npm run build
npm run test:consumer
```

### `docs`

Generate API documentation to `docs/api/` (`config/typedoc.json`, gitignored).

```bash
npm run docs
```

### `check:layout`

Enforce one principal export per source file.

```bash
npm run check:layout
```

### `check:types-mirror`

Verify `types/` declarations exist and match public API after build.

```bash
npm run build
npm run check:types-mirror
```

### `check:tarball`

Pack and inspect npm tarball; reject tests/scripts/config/.github in published files.

```bash
npm run check:tarball
```

### `check`

Full local/CI gate (matches Husky `pre-push`).

```bash
npm run check
```

### `prepare`

Install Husky hooks (runs automatically on `npm install`).

```bash
npm run prepare
```

### `prepublishOnly`

Runs `npm run check` before publish.

```bash
npm publish --dry-run
```

### Changesets

```bash
npm run changeset
npm run changeset:version
npm run changeset:publish
```

## Husky hooks

| Hook         | Runs                              |
| ------------ | --------------------------------- |
| `pre-commit` | lint-staged (ESLint + Prettier)   |
| `commit-msg` | Commitlint (Conventional Commits) |
| `pre-push`   | `npm run check`                   |

Details: [CONTRIBUTING.md § Husky hooks](CONTRIBUTING.md#10-husky-hooks-and-git-flow-coexistence).

## Variants

Non-library repos (Next.js, Electron, Expo) add overlays documented in [docs/variants/](docs/variants/). Variant configs extend files in `config/`.

## Changesets summary

1. `npx changeset` after meaningful package changes
2. Merge Version PR on `develop` (updates `CHANGELOG.md` automatically)
3. `git flow release` to `main`
4. CI publishes with npm provenance

## Changelog

See [CHANGELOG.md](CHANGELOG.md). Contributors use `npx changeset`; do not hand-edit release sections.

## License

Apache-2.0 — see [LICENSE](LICENSE).
