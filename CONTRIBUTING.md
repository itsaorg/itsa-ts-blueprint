# Contributing to @itsaorg/ts-blueprint

Contribution standard inherited by every repository scaffolded from this blueprint. Follow it for human and AI agent work.

## 1. Prerequisites

| Tool           | Version / notes                                                |
| -------------- | -------------------------------------------------------------- |
| Node.js        | ≥ 24.21.0 (`engines`; CI uses 24.21.0)                         |
| npm            | Bundled with Node; `npm whoami` must succeed before publishing |
| Git            | 2.40+                                                          |
| GitHub CLI     | `gh auth status` (optional but recommended)                    |
| git-flow (AVH) | `git flow version` (optional)                                  |

### Git Flow init defaults (AVH)

```bash
git flow init -d
# Production branch: main
# Development branch: develop
```

## 2. Issue-first workflow

**Every change starts with a GitHub issue.** Do not open drive-by PRs without a linked issue.

1. Open an issue using `.github/ISSUE_TEMPLATE/` (feature, bug, or chore).
2. Assign yourself or comment intent.
3. Create a branch named `<prefix>/<issue>-<slug>` (e.g. `feature/42-add-health-check`).
4. Open a PR that includes `Fixes #N` in the body — merging closes the issue automatically.
5. Keep PR scope aligned with the issue.

Optional metadata (Repo ID, MVP phase) may be added in issue forms when your org uses a catalog; they are not required for this blueprint.

## 3. Git Flow branch usage

Branch naming: `<prefix><issue-number>-<short-slug>`

Example: `feature/42-add-wal-segment`

### Feature (from `develop`)

```bash
git checkout develop
git pull origin develop
git flow feature start 42-add-wal-segment
# ... commits (max 5 staged files per commit) ...
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
# 1. Merge all .changeset/*.md files on develop
# 2. Merge the Changesets Version PR (updates CHANGELOG.md + package.json)
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
npm run check
git flow hotfix finish 1.2.1
git push origin main develop --tags
```

Long-lived branches: `main` (production), `develop` (integration).

## 4. Commits and pull requests

Use [Conventional Commits](https://www.conventionalcommits.org/):

```text
feat: add BaseTransaction interface
fix: guard null page in BaseStorage
docs: expand staged publish steps
chore: bump typescript-eslint
```

PR checklist (`.github/PULL_REQUEST_TEMPLATE.md`):

- **`Fixes #N`** in the PR body (required)
- Change type selected
- Test evidence (`npm run check` or CI link)
- Changeset added when the npm package version should change
- Do **not** manually edit `CHANGELOG.md` in feature PRs

## 5. Changesets, CHANGELOG, and release flow

### 5.1 When to add a changeset

| Change type                                                      | Add `.changeset/*.md`? |
| ---------------------------------------------------------------- | ---------------------- |
| `feat` / `fix` / breaking API change affecting published package | **Yes**                |
| Docs-only, CI-only, test-only                                    | **No**                 |
| Internal refactor with no public API change                      | **No**                 |
| Hotfix on `main` affecting published package                     | **Yes**                |

### 5.2 How to add a changeset

```bash
npx changeset
```

Select semver bump and write a user-facing summary.

### 5.3 Version PR workflow

1. Feature PRs with changesets merge into `develop`.
2. The Changesets GitHub Action opens a **Version PR** on `develop`.
3. Merge the Version PR — it updates `CHANGELOG.md` and `package.json`.
4. `git flow release` to `main`; CI stages the new version on npm.

### 5.4 CHANGELOG rules

- [`CHANGELOG.md`](CHANGELOG.md) is published to npm.
- Only `npm run changeset:version` updates release sections.
- Never hand-edit release sections in feature PRs.

## 6. AI agent rules

AI agents must:

- **Not** create GitHub repositories or enable template settings without human approval
- **Not** publish to npm or merge to `main`/`develop` without human approval
- **Not** use `git commit --no-verify` unless documented in the PR
- **Not** hand-edit `CHANGELOG.md` release sections
- **Not** run `changeset version` or direct `npm publish` without human approval
- **Do** remind the human if a package-affecting PR lacks a changeset
- Run `npm run check` before handing off

## 7. Staged npm publish approval SOP

This repo uses **Option B**: CI runs `npm stage publish` → a maintainer approves on npm **Staged Packages** → the version becomes public.

### 7.1 Maintainer setup (Trusted Publisher + stage token)

Configure once per npm package:

1. **Trusted Publisher (OIDC)** — npm package → Settings → Access → Publishing access:
   - Publisher: **GitHub Actions**
   - Organization: your GitHub org (e.g. `itsaorg`)
   - Repository: **`ts-blueprint`** (must match the GitHub repo name exactly)
   - Workflow file: **`publish.yml`**
   - Allowed: **stage publish** (disable direct `npm publish` if shown)
   - npm does not allow editing an existing Trusted Publisher — delete and recreate if fields are wrong.

2. **Publishing access** — select **Require 2FA and allow bypass 2FA tokens**. Do **not** enable "disallow tokens" while using a stage-only granular token.

3. **Stage-only granular token** — npm → Access Tokens → Granular:
   - Name: e.g. `ts-blueprint-ci-stage`
   - **Bypass 2FA:** checked
   - Packages: **Read and write (stage only)**
   - Organization: read/write for your npm org

4. **GitHub secret** — store the token as `NPM_TOKEN`:

   ```bash
   gh secret set NPM_TOKEN --repo itsaorg/ts-blueprint
   ```

5. **Rotate tokens** — create new stage-only token → update GitHub secret → revoke old publish-capable token on npm.

OIDC (Trusted Publisher) is primary auth in CI; the stage-only `NPM_TOKEN` is kept as documented fallback. Rotate every ~90 days.

> **After renaming the GitHub repo**
>
> If the repository slug changes (e.g. `itsa-ts-blueprint` → `ts-blueprint`):
>
> 1. **npm Trusted Publisher** — delete the old publisher entry, recreate with Repository = `ts-blueprint`, Workflow = `publish.yml`
> 2. **GitHub secret** — `gh secret set NPM_TOKEN --repo itsaorg/ts-blueprint`
> 3. **GitHub template** — confirm **Settings → Template repository** is enabled on `itsaorg/ts-blueprint`
> 4. **Verify** — push to `main` and confirm the publish workflow resolves the repo slug

### 7.2 Release flow (staged)

1. Merge Version PR on `develop`; `git flow release` to `main`.
2. Push to `main` triggers [`.github/workflows/publish.yml`](.github/workflows/publish.yml).
3. CI runs `npm run changeset:stage` (via [`scripts/stage-publish.mjs`](scripts/stage-publish.mjs) / [`.github/actions/npm-stage-publish`](.github/actions/npm-stage-publish/action.yml)).
4. Maintainer opens npm → **Staged Packages** → approves with 2FA.
5. GitHub Release is created after staging succeeds (version is not public on npm until approval).

### 7.3 Emergency direct publish

For bootstrap or emergencies only, run **Publish** workflow manually with `direct_publish: true` and a reason. This uses [`.github/actions/npm-publish`](.github/actions/npm-publish/action.yml) (`npm publish`). Normal releases must use staging.

## 8. Local quality gate

```bash
npm run check
```

Runs lint, format check, typecheck, coverage tests, build, layout check, types mirror, consumer import test, and tarball inspection.

## 9. Husky hooks and Git Flow coexistence

Hooks install on `npm install` via `prepare`.

| Hook         | Command                                 | Purpose                           |
| ------------ | --------------------------------------- | --------------------------------- |
| `pre-commit` | `check-staged-file-limit` + lint-staged | Max **5 staged files** per commit |
| `commit-msg` | `commitlint`                            | Conventional Commits              |
| `pre-push`   | `npm run check`                         | Match CI before push              |

Do **not** use `--no-verify` except with explicit human approval in the PR.

```bash
npm run prepare   # reinstall hooks
```

## 10. Reference

- **Changelog:** [CHANGELOG.md](CHANGELOG.md)
- **Variant overlays:** [docs/variants/](docs/variants/)
- **Quickstart / template setup:** [README.md](README.md)
