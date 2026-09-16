# Contributing to **PACKAGE_NAME**

Contribution standard inherited from [itsa-ts-blueprint](https://github.com/itsaorg/itsa-ts-blueprint). Follow it for human and AI agent work.

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

Optional metadata (Repo ID, phase) may be added in issue forms when your org uses a catalog.

## 3. Git Flow branch usage

Branch naming: `<prefix><issue-number>-<short-slug>`

Example: `feature/42-add-wal-segment`

Long-lived branches: `main` (production), `develop` (integration).

See the upstream [itsa-ts-blueprint CONTRIBUTING](https://github.com/itsaorg/itsa-ts-blueprint/blob/main/CONTRIBUTING.md) for full feature, bugfix, release, and hotfix commands.

## 4. Commits and pull requests

Use [Conventional Commits](https://www.conventionalcommits.org/). PRs must include **`Fixes #N`** in the body.

## 5. Changesets, CHANGELOG, and release flow

Add a `.changeset/*.md` file when the published npm package version should change. Never hand-edit `CHANGELOG.md` release sections in feature PRs.

## 6. AI agent rules

AI agents must not publish to npm, merge to protected branches, or bypass hooks without human approval documented in the PR.

## 7. Staged npm publish approval SOP

CI runs `npm stage publish` → maintainer approves on npm **Staged Packages** → version becomes public.

### 7.1 Maintainer setup (Trusted Publisher + stage token)

1. **Trusted Publisher (OIDC)** — npm package → Settings → Access:
   - Publisher: **GitHub Actions**
   - Repository: must match your GitHub repo name (e.g. `__REPO_NAME__`)
   - Workflow file: **`publish.yml`**
   - Allowed: **stage publish**

2. **Publishing access** — **Require 2FA and allow bypass 2FA tokens**

3. **Stage-only granular token** — Packages: **Read and write (stage only)**; **Bypass 2FA** checked

4. **GitHub secret** — `NPM_TOKEN` with the stage-only token

5. **Rotate tokens** — new token → update secret → revoke old publish-capable token

### 7.2 Release flow (staged)

Push to `main` triggers `publish.yml` → `npm run changeset:stage` → approve on npm Staged Packages.

### 7.3 Emergency direct publish

Run **Publish** workflow manually with `direct_publish: true` and a reason. Normal releases use staging.

## 8. Local quality gate

```bash
npm run check
```

## 9. Husky hooks and Git Flow coexistence

| Hook         | Purpose                                   |
| ------------ | ----------------------------------------- |
| `pre-commit` | Max **5 staged files**; ESLint + Prettier |
| `commit-msg` | Conventional Commits                      |
| `pre-push`   | `npm run check`                           |

## 10. Reference

- **Changelog:** [CHANGELOG.md](CHANGELOG.md)
- **Variant overlays:** [docs/variants/](docs/variants/)
- **Quickstart:** [README.md](README.md)
