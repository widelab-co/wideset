# Contributing to Wideset

Thanks for helping. Bug reports, fixes, docs and new components are all welcome. This page is
the process; the technical conventions are in [AGENTS.md](AGENTS.md) (they apply to people and
AI agents alike). By taking part you agree to the [Code of Conduct](CODE_OF_CONDUCT.md).

## Before you start

- **A bug:** open an [issue](https://github.com/widelab-co/wideset/issues/new/choose)
  with the package version and a minimal reproduction. Search the open issues first.
- **A question or an idea:** start a
  [discussion](https://github.com/widelab-co/wideset/discussions).
- **A new component or an API change:** start a discussion before writing code. Wideset is
  designed in Figma first, so a new component needs a design before it needs a PR, and it may
  already be planned.
- **A security issue:** never in a public issue; see [SECURITY.md](SECURITY.md).

Small fixes (a bug, a typo, a missing `aria-*`) can go straight to a pull request.

## Local setup

Node 22 (see `.nvmrc`) and pnpm (version pinned in `package.json`; `corepack enable` or install it directly).

```bash
pnpm install      # install dependencies
pnpm storybook    # http://localhost:6006
pnpm docs:dev     # the documentation site, http://localhost:4321
pnpm test         # Vitest
pnpm typecheck    # tsc --noEmit
pnpm format       # Prettier + ESLint fixes
pnpm build:lib    # library build, check packages/design-system/dist/index.d.ts
```

CI runs lint, Prettier, typecheck, build, tests and a Storybook build on every PR.

## Workflow

1. Fork the repository and branch from `develop`: `<type>/<description>`, e.g.
   `fix/select-aria-label`. `type` is `feature`, `fix` or `chore`. Never target `main`.
2. If you changed a file that ships (`packages/design-system/src/` or `cli/`, minus stories, tests,
   snapshots, Figma specs and docs pages), add a changeset: `pnpm changeset`. One consumer-facing
   line, correct semver bump. Shipping change with nothing to release: `pnpm changeset --empty`,
   reason in the body. The pre-push hook and CI refuse a branch without one
   ([RELEASING.md](RELEASING.md#when-a-changeset-is-required)).
3. Run `pnpm typecheck && pnpm test` locally. Pre-commit hooks only format staged files.
4. Open the PR against `develop`. Write **Why** in one or two sentences and go through the
   checklist; [CodeRabbit](https://coderabbit.ai) writes the rest of the description and reviews
   the PR within minutes.
5. Fix or answer every CodeRabbit comment and resolve its threads, then mark the PR ready for
   review. GitHub assigns one maintainer from [CODEOWNERS](.github/CODEOWNERS).

## Review and merge

A PR merges into `develop` when all of these hold. Nothing else, and no particular person, is
needed:

- **one approval from a code owner**: anyone in `wideset-maintainers`; for the risk zones (build,
  CI, tokens and styles, `src/index.ts`, the CLI, dependencies) someone in `wideset-core`;
- **CI green**: `Build & validate` and `Changeset present`;
- **every review conversation resolved**, CodeRabbit's included.

Blockers get **Request changes**. Small remarks get
**Approve** and the author fixes them before merging; a new push does not dismiss the approval.
The author merges, or turns on **auto-merge** so the PR squash-merges itself once green.
Reviewers (people and agents) use the `wideset-code-review` skill: risk zones, then Safety /
Standards / Intent, then a verdict.

Releases (`develop` → `main`, which publishes to npm) are merged by `wideset-core` only; see
[RELEASING.md](RELEASING.md).

To address existing review feedback, use `wideset-pr-review-resolve` with a PR URL or number.
It evaluates comments against repository rules, applies clear fixes locally, and prepares a local
report with decisions and exact reply drafts. After approval of the reply batch, it posts the
approved replies and resolves eligible threads. Code pushes require a separate instruction.

## Adding a component

1. Create `packages/design-system/src/components/<component-name>/` following the folder structure in
   [AGENTS.md](AGENTS.md#layout), with stories and tests.
2. Export the component and its public types from `src/index.ts` (alphabetical).
3. Run `pnpm build:lib` and confirm the export appears in `dist/index.d.ts`.
4. If the component exists in Figma, compare it with the Figma frame and match the code to it.
5. Review it against the `wideset-component-convention` skill before asking for review.
6. Add its guidelines and examples to the documentation site (`apps/docs`, see its README).

## Documentation

General docs (installation, theming, foundations, changelog) live once, in `apps/docs`.
Storybook is the development workbench: stories and controls for every component, plus token
galleries.

## Releases

Versioning and publishing are automated with Changesets; see [RELEASING.md](RELEASING.md).

## Working with AI tools

The repository is set up for Claude Code, Codex, Cursor, Copilot and Gemini CLI: `AGENTS.md` is
the shared instruction file, and skills live in `.agents/skills/`. Agents follow the same conventions and
review process as everyone else.

## License

By contributing you agree that your contributions are licensed under the
[Apache License 2.0](LICENSE), the same terms as the rest of Wideset. Section 5 of the license
says exactly this, so there is no separate contributor agreement to sign.
