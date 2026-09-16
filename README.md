# 📦 @itsaorg/ts-blueprint

Frozen TypeScript library toolchain and GitHub template for all Itsa platform repositories (R0). Downstream repos substitute metadata tokens only — no ESLint, TypeScript, Vitest, Husky, or CI reconfiguration.

---

## 📑 Table of Contents

- [📦 @itsaorg/ts-blueprint](#-itsaorgts-blueprint)
  - [📑 Table of Contents](#-table-of-contents)
  - [🎯 Purpose](#-purpose)
  - [📁 Repository layout](#-repository-layout)
  - [🗂️ Why template/ exists](#️-why-template-exists)
  - [📋 Prerequisites](#-prerequisites)
  - [🚀 Quick start (Human Step 0 — downstream repos)](#-quick-start-human-step-0--downstream-repos)
  - [🌿 Git Flow cheat sheet](#-git-flow-cheat-sheet)
  - [📜 npm scripts reference](#-npm-scripts-reference)
  - [🪝 Husky hooks](#-husky-hooks)
  - [🧩 Variants](#-variants)
  - [📦 Changesets summary](#-changesets-summary)
  - [📓 Changelog](#-changelog)
  - [📄 License](#-license)

---

## 🎯 Purpose

- **Configure once** in R0
- **Copy via GitHub template** for R1–R32 and A1
- **Substitute** template placeholders with repo metadata
- **Verify** with `npm install && npm run check`

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full contribution SOP and [MVP.md](../MVP.md) for the platform catalog.

## 📁 Repository layout

```text
itsa-ts-blueprint/
├── config/                 # Toolchain configs (ESLint, TS, Vitest, Prettier, TypeDoc)
├── src/                    # Library source
├── tests/                  # Unit, integration, consumer tests
├── scripts/                # Validation and scaffold scripts
├── template/               # Portable downstream mirror (__TOKEN__ placeholders)
├── docs/variants/          # Next / Electron / Expo overlay notes
├── .github/                # CI, issue/PR templates
├── .husky/                 # Git hooks
├── .changeset/             # Changesets release management
├── tsconfig.json           # Stub → extends config/tsconfig.json
├── CHANGELOG.md            # Auto-updated by Changesets
├── .npmignore              # Publish guard (defense in depth)
└── package.json            # npm scripts and metadata
```

Tooling configs live in `config/` so the repo root stays focused on source, docs, and human-facing files.

## 🗂️ Why template/ exists

This repo is a **GitHub Template repository** — but it also keeps a `template/` subdirectory. They serve different roles:

| Mechanism                    | What it does                                                                                           | What it does not do                                             |
| ---------------------------- | ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------- |
| **GitHub Template**          | Copies the entire default branch when you click "Use this template" or run `gh repo create --template` | Token substitution, strip R0-only files, or validate the result |
| **`template/` subdirectory** | Holds the portable downstream layout with `__REPO_NAME__`, `__PACKAGE_NAME__`, etc.                    | Replace GitHub's repo-creation UX                               |

**Why keep `template/`:**

1. **Token substitution** — [`scripts/substitute-names.mjs`](scripts/substitute-names.mjs) copies `template/` to a target directory and replaces eight approved tokens.
2. **R0-only separation** — Root keeps R0-only scripts (`smoke:scaffold`, nested `template/`). The `template/` mirror is what R1+ repos should look like.
3. **Offline P0 gate** — [`scripts/smoke-scaffold.mjs`](scripts/smoke-scaffold.mjs) validates end-to-end without calling GitHub.
4. **Future-proofing** — Bootstrap R1–R32 locally or in CI even if GitHub template is unavailable.

**Known gap:** `gh repo create --template` copies the R0 root as-is (including R0-only paths). Downstream Human Step 0 may still need in-place token substitution. The `template/` folder is the **canonical portable snapshot**.

## 📋 Prerequisites

| Requirement               | Verify                                  |
| ------------------------- | --------------------------------------- |
| Node.js 22.12 LTS or 24.x | `node -v` (CI runs 22.12.0 and 24.21.0) |
| npm                       | `npm -v`                                |
| GitHub CLI                | `gh auth status`                        |
| git-flow (AVH)            | `git flow version`                      |
| npm org access (publish)  | `npm whoami`                            |

Node **22.12.0+** satisfies `engines`; **24.x** is supported locally without nvm. Optional version managers:

```bash
fnm use    # reads .nvmrc (24.21.0)
# or: volta install node@22.12.0 / node@24.21.0
```

## 🚀 Quick start (Human Step 0 — downstream repos)

Create a new library repo from this template:

```bash
gh repo create itsaorg/itsa-example --template itsaorg/itsa-ts-blueprint --private=false
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

## 🌿 Git Flow cheat sheet

| Branch type | Start                                   | Finish                                   |
| ----------- | --------------------------------------- | ---------------------------------------- |
| Feature     | `git flow feature start <issue>-<slug>` | `git flow feature finish <issue>-<slug>` |
| Bugfix      | `git flow bugfix start <issue>-<slug>`  | `git flow bugfix finish <issue>-<slug>`  |
| Release     | `git flow release start <version>`      | `git flow release finish <version>`      |
| Hotfix      | `git flow hotfix start <version>`       | `git flow hotfix finish <version>`       |
| Support     | `git flow support start <name> <base>`  | `git flow support finish <name>`         |

Long-lived branches: `main` (production), `develop` (integration).

## 📜 npm scripts reference

Every script below is inherited unchanged by scaffolded repos (except R0-only scripts noted). Toolchain configs live in `config/`.

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

### R0-only: `smoke:scaffold`

End-to-end template validation in a temp directory.

```bash
npm run smoke:scaffold
```

### R0-only: token substitution

```bash
node scripts/substitute-names.mjs \
  --repo itsa-dbms-base \
  --package @itsaorg/dbms-base \
  --description "Itsa DBMS base contracts" \
  --repo-id R1 \
  --phase P1 \
  --out /tmp/itsa-r1-scaffold
```

## 🪝 Husky hooks

| Hook         | Runs                              |
| ------------ | --------------------------------- |
| `pre-commit` | lint-staged (ESLint + Prettier)   |
| `commit-msg` | Commitlint (Conventional Commits) |
| `pre-push`   | `npm run check`                   |

Details: [CONTRIBUTING.md § Husky hooks](CONTRIBUTING.md#10-husky-hooks-and-git-flow-coexistence).

## 🧩 Variants

Non-library repos (Next.js, Electron, Expo) add overlays documented in [docs/variants/](docs/variants/). Variant configs extend files in `config/` — do not fork the toolchain. The library variant requires zero extra config beyond token substitution.

## 📦 Changesets summary

1. `npx changeset` after meaningful package changes
2. Merge Version PR on `develop` (updates `CHANGELOG.md` automatically)
3. `git flow release` to `main`
4. CI publishes with npm provenance

## 📓 Changelog

Release history lives in [CHANGELOG.md](CHANGELOG.md) (published to npm).

- **Contributors:** add a `.changeset/*.md` file via `npx changeset` — do not hand-edit release sections.
- **Version PR:** the Changesets GitHub Action runs `changeset version`, which prepends the new version to `CHANGELOG.md`.
- **Format:** [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

See [CONTRIBUTING.md § 7](CONTRIBUTING.md#7-changesets-changelog-and-release-flow) for the full SOP.

## 📄 License

Apache-2.0 — see [LICENSE](LICENSE).
