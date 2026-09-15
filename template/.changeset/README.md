# Changesets

We use [Changesets](https://github.com/changesets/changesets) to manage releases.

1. Run `npx changeset` after meaningful changes.
2. Merge the version PR created on `develop` — this runs `changeset version` and updates `CHANGELOG.md` automatically.
3. Publish workflow releases to npm with provenance.
