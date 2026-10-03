# AGENTS.md

## Changelog

- Only record user-facing changes in `changes.md` (new features, behavior/API changes, fixes users can observe).
- Never add internal changes (build config, tooling, dependencies, refactors, repo housekeeping) to the changelog.

## Builds and `dist/`

- Never build the package (`npm run build`) except when a build is required to test a change.
- After any test build, revert every diff under `dist/` before finishing (e.g. `git checkout -- dist`). Do not leave `dist/` modified.
