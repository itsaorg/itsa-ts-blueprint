# @itsaorg/ts-blueprint

TypeScript library blueprint and GitHub template. Downstream repos substitute metadata tokens only — no ESLint, TypeScript, Vitest, Husky, or CI reconfiguration.

---

## Table of Contents

- [Quickstart](#quickstart)
- [QuickSetup — GitHub template (web)](#quicksetup--github-template-web)
- [QuickSetup — GitHub template (gh CLI)](#quicksetup--github-template-gh-cli)
- [Usage — install from npm](#usage--install-from-npm)
- [Tutorials](#tutorials)
- [Repository layout](#repository-layout)
- [Prerequisites](#prerequisites)
- [npm scripts reference](#npm-scripts-reference)
- [License](#license)

---

## Quickstart

For developers working in **this repo** locally:

```bash
git clone git@github.com:itsaorg/itsa-ts-blueprint.git
cd itsa-ts-blueprint
npm install
npm run check
```

Optional: `fnm use` or `nvm use` reads [`.nvmrc`](.nvmrc) (`24.21.0`).

---

## QuickSetup — GitHub template (web)

Create a new library repo from this template using the GitHub web UI:

1. Open [https://github.com/itsaorg/itsa-ts-blueprint](https://github.com/itsaorg/itsa-ts-blueprint)
2. Click **Use this template** → **Create a new repository**
3. Choose owner, name, and visibility
4. Clone the new repo, run token substitution if needed, then verify:

```bash
git clone git@github.com:<org>/<new-repo>.git
cd <new-repo>
node scripts/substitute-names.mjs --repo <name> --package @scope/name --description "..." --out .
npm install && npm run check
```

---

## QuickSetup — GitHub template (gh CLI)

```bash
gh repo create <org>/<new-repo> --template itsaorg/itsa-ts-blueprint --public
git clone git@github.com:<org>/<new-repo>.git
cd <new-repo>
node scripts/substitute-names.mjs \
  --repo <name> \
  --package @scope/name \
  --description "My library" \
  --out .
npm install && npm run check
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for Git Flow init, issue-first workflow, and release steps.

---

## Usage — install from npm

For **consumers** installing the published package:

```bash
npm install @itsaorg/ts-blueprint
```

```typescript
import { getBlueprintHealth } from '@itsaorg/ts-blueprint';
```

Package page: [https://www.npmjs.com/package/@itsaorg/ts-blueprint](https://www.npmjs.com/package/@itsaorg/ts-blueprint)

---

## Tutorials

| Topic                  | Where to read                                                                            |
| ---------------------- | ---------------------------------------------------------------------------------------- |
| Issue-first workflow   | [CONTRIBUTING § 2](CONTRIBUTING.md#2-issue-first-workflow)                               |
| Git Flow branches      | [CONTRIBUTING § 3](CONTRIBUTING.md#3-git-flow-branch-usage)                              |
| Changesets & changelog | [CONTRIBUTING § 5](CONTRIBUTING.md#5-changesets-changelog-and-release-flow)              |
| Staged npm publish     | [CONTRIBUTING § 7](CONTRIBUTING.md#7-staged-npm-publish-approval-sop)                    |
| Local development      | [CONTRIBUTING § 8](CONTRIBUTING.md#8-local-quality-gate)                                 |
| npm publish auth setup | [CONTRIBUTING § 7.1](CONTRIBUTING.md#71-maintainer-setup-trusted-publisher--stage-token) |

---

## Repository layout

```text
itsa-ts-blueprint/
├── config/                 # Toolchain configs (ESLint, TS, Vitest, Prettier, TypeDoc)
├── src/                    # Library source
├── tests/                  # Unit, integration, consumer tests
├── scripts/                # Validation and scaffold scripts
├── template/               # Portable downstream mirror (__TOKEN__ placeholders)
├── docs/variants/          # Next / Electron / Expo overlay notes
├── .github/                # CI, composite actions, issue/PR templates
├── .husky/                 # Git hooks
├── .changeset/             # Changesets release management
└── package.json            # npm scripts and metadata
```

### Why `template/` exists

| Mechanism                    | Role                                                                                                                              |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **GitHub Template**          | Copies the default branch when you click **Use this template**                                                                    |
| **`template/` subdirectory** | Portable layout with `__REPO_NAME__`, `__PACKAGE_NAME__`, etc. for [`scripts/substitute-names.mjs`](scripts/substitute-names.mjs) |

R0-only scripts (`smoke:scaffold`, nested `template/`) stay at the repo root. The `template/` folder is the canonical portable snapshot for downstream repos.

---

## Prerequisites

| Requirement             | Verify             |
| ----------------------- | ------------------ |
| Node.js ≥ 24.21.0       | `node -v`          |
| npm                     | `npm -v`           |
| GitHub CLI (optional)   | `gh auth status`   |
| git-flow AVH (optional) | `git flow version` |

CI runs a single Node **24.21.0** job (`check (Node 24.21.0)`).

---

## npm scripts reference

Every script below is inherited unchanged by scaffolded repos (except R0-only scripts noted).

| Script                                                | Purpose                                              |
| ----------------------------------------------------- | ---------------------------------------------------- |
| `build`                                               | Compile ESM to `dist/` and declarations to `types/`  |
| `clean`                                               | Remove build, coverage, and generated docs artifacts |
| `typecheck`                                           | TypeScript check without emit                        |
| `lint` / `lint:fix`                                   | ESLint (`config/eslint.config.js`)                   |
| `format` / `format:check`                             | Prettier                                             |
| `test` / `test:watch` / `test:coverage`               | Vitest (80% coverage thresholds)                     |
| `test:consumer`                                       | ESM consumer import test                             |
| `docs`                                                | TypeDoc to `docs/api/`                               |
| `check:layout`                                        | One principal export per source file                 |
| `check:types-mirror`                                  | Verify `types/` matches public API                   |
| `check:tarball`                                       | Inspect npm tarball contents                         |
| `check`                                               | Full local/CI gate (matches Husky `pre-push`)        |
| `changeset` / `changeset:version` / `changeset:stage` | Release management (CI stages via `changeset:stage`) |
| `smoke:scaffold`                                      | **R0-only** — end-to-end template validation         |

```bash
npm run check
```

Husky hooks: `pre-commit` (lint-staged, max 5 staged files), `commit-msg` (Commitlint), `pre-push` (`npm run check`). Details in [CONTRIBUTING § 9](CONTRIBUTING.md#9-husky-hooks-and-git-flow-coexistence).

---

## License

Apache-2.0 — see [LICENSE](LICENSE).

Release history: [CHANGELOG.md](CHANGELOG.md).
