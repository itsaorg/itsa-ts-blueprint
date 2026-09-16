# **PACKAGE_NAME**

TypeScript library blueprint scaffolded from [itsa-ts-blueprint](https://github.com/itsaorg/itsa-ts-blueprint). Toolchain configs live in `config/` — substitute metadata tokens only.

---

## Table of Contents

- [Quickstart](#quickstart)
- [Usage — install from npm](#usage--install-from-npm)
- [Tutorials](#tutorials)
- [Prerequisites](#prerequisites)
- [npm scripts reference](#npm-scripts-reference)
- [License](#license)

---

## Quickstart

```bash
git clone git@github.com:__GITHUB_ORG__/__REPO_NAME__.git
cd __REPO_NAME__
npm install
npm run check
```

Optional: `fnm use` or `nvm use` reads [`.nvmrc`](.nvmrc) (`24.21.0`).

---

## Usage — install from npm

```bash
npm install __PACKAGE_NAME__
```

```typescript
import { getBlueprintHealth } from '__PACKAGE_NAME__';
```

Package page: `https://www.npmjs.com/package/__PACKAGE_NAME__`

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

## Prerequisites

| Requirement       | Verify    |
| ----------------- | --------- |
| Node.js ≥ 24.21.0 | `node -v` |
| npm               | `npm -v`  |

CI runs a single Node **24.21.0** job (`check (Node 24.21.0)`).

---

## npm scripts reference

| Script                                                | Purpose                                              |
| ----------------------------------------------------- | ---------------------------------------------------- |
| `build`                                               | Compile ESM to `dist/` and declarations to `types/`  |
| `check`                                               | Full local/CI gate                                   |
| `changeset` / `changeset:version` / `changeset:stage` | Release management (CI stages via `changeset:stage`) |

```bash
npm run check
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for Git Flow, changesets, and staged publish SOP.

---

## License

Apache-2.0 — see [LICENSE](LICENSE).

Release history: [CHANGELOG.md](CHANGELOG.md).
