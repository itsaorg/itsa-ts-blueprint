# Contributing to **PACKAGE_NAME**

This document is the contribution standard inherited by every Itsa platform repository scaffolded from this blueprint. Follow it end-to-end for human and AI agent work.

Platform catalog and phase gates live in the workspace [MVP.md](../MVP.md) (or your org copy).

## 1. Prerequisites

Install once per machine:

| Tool           | Version / notes                                                |
| -------------- | -------------------------------------------------------------- |
| Node.js        | 22.12.0 LTS (`nvm use` reads `.nvmrc`)                         |
| npm            | Bundled with Node; `npm whoami` must succeed before publishing |
| Git            | 2.40+                                                          |
| GitHub CLI     | `gh auth status` must succeed                                  |
| git-flow (AVH) | `git flow version`                                             |

### Git Flow init defaults (AVH)

When initializing a new clone:

```bash
git flow init -d
# Production branch: main
# Development branch: develop
# Feature prefix: feature/
# Bugfix prefix: bugfix/
# Release prefix: release/
# Hotfix prefix: hotfix/
# Support prefix: support/
# Version tag prefix: v
```

## 2. Unified workspace layout

All Itsa repos clone as siblings under one workspace folder:

```text
udawg-game-bot-refactor/
├── MVP.md
├── __REPO_NAME__/     # R0 — this repo
├── itsa-dbms-base/        # R1
├── itsa-storage-base/     # R2
└── ...
```

Clone into the workspace root — do not nest repos inside each other.

## 3. Issue filing

Use GitHub issue forms (`.github/ISSUE_TEMPLATE/`):

| Template        | When to use             | Example title                                  |
| --------------- | ----------------------- | ---------------------------------------------- |
| Feature request | New capability          | `[Feature] R1: add WAL segment interface`      |
| Bug report      | Incorrect behavior      | `[Bug] R2: page checksum mismatch on truncate` |
| Chore / docs    | Tooling, docs, refactor | `[Chore] R0: document variant overlays`        |

Every issue must include **Repo ID** and **MVP phase** fields plus acceptance criteria.

## 4. Picking up an issue

1. Assign yourself (or comment intent if you lack assign permissions).
2. Link the MVP task ID in a comment when applicable (e.g. `R1 Task 12`).
3. Create the appropriate Git Flow branch (see below).
4. Keep PR scope aligned with the issue — one atomic task per PR when possible.

## 5. Git Flow branch usage

Branch naming convention: `<prefix><issue-number>-<short-slug>`

Example: `feature/42-add-wal-segment`

### Feature (from `develop`)

```bash
git checkout develop
git pull origin develop
git flow feature start 42-add-wal-segment
# ... commits ...
git flow feature finish 42-add-wal-segment
git push origin develop
```

### Bugfix (from `develop`)

```bash
git flow bugfix start 57-fix-cursor-leak
# ... commits ...
git flow bugfix finish 57-fix-cursor-leak
git push origin develop
```

### Release (from `develop` → `main`)

```bash
# 1. Ensure all .changeset/*.md files are merged on develop
# 2. Merge the Changesets Version PR (updates CHANGELOG.md + package.json version)
# 3. Start release matching the Version PR version:
git flow release start 1.2.0
npm run check
git flow release finish 1.2.0
git push origin main develop --tags
```

### Hotfix (from `main`)

```bash
git flow hotfix start 1.2.1
# Add changeset if the hotfix affects the published package
# Run changeset version on hotfix branch before finish (or merge Version PR pattern)
npm run check
git flow hotfix finish 1.2.1
git push origin main develop --tags
```

### Support (long-lived maintenance branch)

```bash
git flow support start 1.x 1.2.0
# ... maintenance commits ...
git flow support finish 1.x
```

## 6. Commits and pull requests

Use [Conventional Commits](https://www.conventionalcommits.org/):

```text
feat: add BaseTransaction interface
fix: guard null page in BaseStorage
docs: expand Git Flow release steps
chore: bump typescript-eslint
```

PR checklist (see `.github/PULL_REQUEST_TEMPLATE.md`):

- Linked issue
- Change type selected
- Test evidence (`npm run check` output or CI link)
- Changeset added when the npm package version should change
- **Do not** manually edit `CHANGELOG.md` in feature PRs
- Conventional commit type matches changeset bump intent (`feat` → minor, `fix` → patch, BREAKING → major)

## 7. Changesets, CHANGELOG, and release flow

### 7.1 When to add a changeset

| Change type                                                      | Add `.changeset/*.md`? | CHANGELOG updated? |
| ---------------------------------------------------------------- | ---------------------- | ------------------ |
| `feat` / `fix` / breaking API change affecting published package | **Yes**                | On next Version PR |
| Docs-only, CI-only, test-only (no npm version bump)              | **No**                 | No                 |
| Internal refactor with no public API change                      | **No**                 | No                 |
| Hotfix on `main` affecting published package                     | **Yes**                | On hotfix release  |

### 7.2 How to add a changeset

```bash
npx changeset
```

Select semver bump (patch / minor / major) and write a **user-facing summary**. That summary becomes the CHANGELOG bullet when the Version PR runs.

### 7.3 How CHANGELOG.md is updated

- [`CHANGELOG.md`](CHANGELOG.md) lives at the repo root and is **published to npm**.
- Only `npm run changeset:version` (via the Changesets Version PR) updates release sections.
- Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
- **Never** hand-edit release sections in feature PRs — fix typos post-release only with human approval.

### 7.4 Version PR workflow

1. Feature PRs with changesets merge into `develop`.
2. The Changesets GitHub Action opens a **Version PR** on `develop`.
3. That PR runs `changeset version`, consuming `.changeset/*.md` files and updating `CHANGELOG.md` + `package.json` version.
4. A human merges the Version PR — preserve the CHANGELOG diff (do not squash away).

### 7.5 Git Flow + npm publish integration

1. Merge Version PR on `develop`.
2. `git flow release start X.Y.Z` (version must match Version PR).
3. `npm run check` on the release branch.
4. `git flow release finish X.Y.Z` → tag `vX.Y.Z`.
5. Publish workflow on `main` publishes to npm with provenance.

### 7.6 Hotfix changelog path

1. `git flow hotfix start X.Y.Z` from `main`.
2. Apply fix; add a `.changeset/*.md` with a patch bump summary.
3. Run `npx changeset version` on the hotfix branch (or follow org Version PR policy).
4. `npm run check`, then `git flow hotfix finish`.
5. CHANGELOG gains a patch entry; merge back to `develop`.

## 8. AI agent rules

AI agents working in Itsa repos must:

- **Not** create GitHub repositories or enable template settings
- **Not** publish to npm or merge to `main`/`develop` without human approval
- **Not** use `git commit --no-verify` or `git push --no-verify` unless the PR documents human approval
- **Not** edit MVP.md unless explicitly requested
- **Not** hand-edit `CHANGELOG.md` release sections
- **Not** run `changeset version` or `changeset publish` without human approval
- **Do** remind the human if a package-affecting PR lacks a changeset file
- Run `npm run check` before handing off
- Follow this CONTRIBUTING.md and the repo README

## 9. Local quality gate

The single local/CI gate:

```bash
npm run check
```

This runs lint, format check, typecheck, coverage tests, build, layout check, types mirror check, consumer import test, and tarball inspection.

## 10. Husky hooks and Git Flow coexistence

Hooks install automatically on `npm install` via the `prepare` script.

| Hook         | Command         | Purpose                           |
| ------------ | --------------- | --------------------------------- |
| `pre-commit` | `lint-staged`   | ESLint + Prettier on staged files |
| `commit-msg` | `commitlint`    | Enforce Conventional Commits      |
| `pre-push`   | `npm run check` | Match CI before push              |

Hooks live in `.husky/` (version-controlled). Git Flow may use additional `.git/hooks` entries for its own filters; Husky repo-managed hooks do not conflict.

### Bypass policy

Do **not** use `--no-verify` to skip hooks except with explicit human approval documented in the PR. Hook failures indicate CI will fail — fix the root cause instead.

### Reinstall hooks

```bash
npm run prepare
```

## 11. Platform reference

- **Catalog & phases:** [MVP.md](../MVP.md)
- **Changelog:** [CHANGELOG.md](CHANGELOG.md)
- **Variant overlays:** [docs/variants/](docs/variants/)
- **Human Step 0:** See README.md
