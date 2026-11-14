# Releasing

How we version, change-log, and publish `@wideset/react` and the `wideset` CLI. They live in
`packages/design-system/` and `packages/cli/`; their `package.json` and `CHANGELOG.md` files are the
ones Changesets bumps and writes, to one shared version. Commands run from the repository root.

We use **[Changesets](https://github.com/changesets/changesets)** to manage [semantic versioning](https://semver.org/) and the changelog. Changesets is not an alternative to semver — it is a tool that turns small, per‑PR intent files into the right version bump + a generated `CHANGELOG.md`, so nobody has to run `npm version` by hand or write the changelog manually.

---

## Branching model

| Branch    | Role                                                                | What a push does                                                                                                                                        |
| --------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `develop` | Integration. All feature PRs land here. Changesets accumulate here. | Runs CI and deploys the `-develop` Workers. **Does not publish.**                                                                                       |
| `main`    | Production / release.                                               | Builds, **deploys docs + Storybook** to production (wideset.co), checks the hosts answer, then **publishes to npm**, tags and creates a GitHub Release. |

**Why versioning happens on `develop`, not `main`:** the version bump (updated `package.json` + `CHANGELOG.md`, consumed changeset files) is created on `develop` and flows forward to `main` through the normal promotion PR. `changeset publish` on `main` only adds a git tag + GitHub Release — **no commits** — so `develop` and `main` stay content‑aligned after every release. This is what avoids the classic GitFlow "back‑merge" chore.

```
feature/* ──PR──▶ develop ──"Version Packages" PR──▶ develop ──promotion PR──▶ main ──▶ CI publishes
   (+changeset)        (bump + CHANGELOG)                                          (deploy + check, then npm + tag + Release)
```

---

## Day‑to‑day: add a changeset to every PR

When you open a PR into `develop` that changes published behaviour, add a changeset:

```bash
pnpm changeset
```

It asks for the **bump type** and a **summary** (this line becomes the changelog entry), then writes a markdown file under `.changeset/`. Commit it with your PR.

**How to write the summary** (one short line — like [Radix](https://www.radix-ui.com/primitives/docs/overview/releases) or [MUI](https://github.com/mui/material-ui/releases)):

- **One line per changeset.** Only the first line lands in `CHANGELOG.md`.
- **Consumer-facing.** Say what changed for someone upgrading, not how you fixed it internally.

Example summaries:

```md
Icons: remove bundled Icon\* exports — install @remixicon/react (see README)
Button: fix icon-to-label gap to match Figma
Modal: render in portal again (Modal/Sidepanel root collision)
```

Pick the bump by consumer impact. We follow [semver](https://semver.org/) with one deliberate exception: a breaking change to a single component's API ships as `minor`, not `major` (see the table and the note below it).

| Bump      | When                                                                                                                                                                            | Example         |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| **patch** | Bug fix, no API change                                                                                                                                                          | `1.2.0 → 1.2.1` |
| **minor** | New component / new prop, backwards‑compatible                                                                                                                                  | `1.2.0 → 1.3.0` |
| **minor** | Breaking change to **one component's API** (removed/renamed prop, compound split, renamed export) — with a **Breaking** paragraph and a migration example in the changeset body | `1.2.0 → 1.3.0` |
| **major** | Breaking change to the **library's integration contract** (stylesheet entry points, install steps, peer ranges) - a team decision, never triggered by a single component        | `1.2.0 → 2.0.0` |

A breaking change does **not** automatically mean a major release. Component-level breaks are frequent while the library matures and ship as `minor`; the changelog line and the **Breaking** paragraph tell consumers what to migrate. `major` is reserved for changes every consumer must act on to keep the package working (see the `wideset-code-review` skill).

### When a changeset is required

The rule is mechanical, by file path. A branch needs a changeset when it changes a file that **ships**: anything under `packages/design-system/src/` or `packages/cli/src/` except

- stories (`*.stories.tsx`), tests (`*.test.ts(x)`, `__tests__/`), snapshots (`__snapshots__/`, `*.snap`)
- Figma specs (`*.figma-spec.json`)
- docs pages (`*.mdx`, `*.md`)

`packages/cli/package.json` ships too: the CLI reads the shadcn version it runs from its `devDependencies`.

The consumer skills ship too: `packages/skills/skills`, `agents`, `cursor`, `AGENTS.wideset.md` and
`.claude-plugin` need a changeset, Markdown included. A component change that only regenerates them
is covered by the component's own changeset.

Everything else is **internal** and needs no changeset: CI, scripts, contributor skills in
`.agents/`, tooling, root config.

A shipping change that releases nothing on purpose (a refactor with identical output, a helper only tests use) still needs one, an **empty** changeset: `pnpm changeset --empty`, with the reason in the file body. It bumps nothing and adds no changelog line; it only records the decision.

Enforced twice by the same script, `scripts/check-changeset.mjs`:

- **pre-push hook**: the push fails when the branch (compared with `origin/develop`) has shipping changes and no new file in `.changeset/`. `design/<topic>` branches are exempt; the developer who merges them writes the changeset.
- **CI**: the `Changeset present` job fails a PR into `develop` the same way.

---

## Releasing

A release is two merges. There is no manual version number to type.

### 1. Version on `develop`

When `develop` has accumulated the changesets you want to ship, run the version step - `pnpm changeset version`. This consumes all pending changesets, bumps `package.json`, and updates `CHANGELOG.md`.

The recommended way is the automated **"Version Packages" PR** that the Changesets Action keeps open against `develop`:

- It is opened with the `wideset-release` GitHub App token (repository variable `RELEASE_APP_ID`, secret `RELEASE_APP_PRIVATE_KEY`), so CI runs on it like on any other PR. A PR opened with the built-in `GITHUB_TOKEN` runs no checks and cannot satisfy the ruleset.
- Open it, review the computed version and the generated `CHANGELOG.md`.
- Merge it into `develop`.

If the auto-generated section is too noisy (many small Figma parity entries), **edit `CHANGELOG.md` in that PR** before merging: group visual fixes under one “Design (Figma parity)” bullet and keep breaking/features/bug fixes as short lines. Storybook reads this file verbatim.

Treat **version → promote** as a brief freeze: avoid landing new changesets on `develop` between this step and step 2 (see Caveats).

### 2. Promote `develop → main`

Open a PR `develop → main` and merge it with **"Create a merge commit"** — **never Squash or Rebase** (squash collapses the whole history into one commit). The `main` ruleset allows only merge commits, and only `wideset-core` can merge into `main`.

On push to `main`, CI runs in order: **build → deploy → publish**:

- Deploys docs (with the registry under `/r`) and Storybook to production Workers, then checks
  that `wideset.co/r/registry.json`, `wideset.co/docs/introduction`, `wideset.co/llms.txt` and
  `storybook.wideset.co` answer 200. The CLI and every published URL point there, and an npm
  version cannot be republished, so a failed check stops the release before npm.
- Publishes the new version to npm (with provenance).
- Creates the git tag `vX.Y.Z` and a **GitHub Release** with the changelog.

If the publish fails after a successful deploy, the docs briefly describe a version npm does not
have yet: fix the cause and re-run the failed job.

After this, `develop` and `main` are aligned. Nothing to back‑merge.

---

## Hosting and CI setup

The `deploy` job in `.github/workflows/build.yaml` publishes to Cloudflare Workers:

| Trigger   | Docs and registry                                                                         | Storybook                                     |
| --------- | ----------------------------------------------------------------------------------------- | --------------------------------------------- |
| `main`    | `wideset-docs` on `wideset.co` (`/docs`, `/components`, `/blocks`, `/r`, `/llms*.txt`, …) | `wideset-storybook` on `storybook.wideset.co` |
| `develop` | `wideset-docs-develop` on workers.dev                                                     | `wideset-storybook-develop` on workers.dev    |
| PR        | alias `pr-<number>` on the `-develop` Workers                                             | same                                          |

Repository settings: secrets `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `NPM_TOKEN`; variable
`CF_WORKERS_SUBDOMAIN`; environments `production` (branch `main`) and `develop` (branch `develop`);
Actions allowed to create pull requests. Chromatic runs only when the variable `CHROMATIC_APP_ID`
is set.

Production on `wideset.co`:

- The `production` environment sets `DOCS_URL=https://wideset.co` and
  `STORYBOOK_URL=https://storybook.wideset.co` (the workflow falls back to the same values).
- The account in `CLOUDFLARE_ACCOUNT_ID` owns the `wideset.co` zone, and `CLOUDFLARE_API_TOKEN`
  has, on that zone, **Workers Routes: Edit** (the docs routes) and **DNS: Edit** (the
  `storybook.wideset.co` custom domain creates its record), besides **Workers Scripts: Edit** on
  the account.
- The apex `wideset.co` record is **proxied** (orange cloud). Routes run only on proxied
  hostnames; DNS-only, the deploy succeeds and the post-deploy check fails.
- A Redirect Rule on the zone (Rules → Redirect Rules, dashboard only) sends every other path on
  `wideset.co` to `www.wideset.co`, the landing page. It runs before the Worker routes, so it must
  exclude exactly the routes in `apps/docs/wrangler.jsonc`: **change both together**, and change
  the rule **before** merging the `develop → main` PR that adds a route: the deploy checks every
  route on `wideset.co`, so a route the rule still redirects fails the release before npm. Landing
  pages must not use paths starting with `/docs`, `/components` or `/blocks`. Expression:

  ```text
  (http.host eq "wideset.co" and not starts_with(http.request.uri.path, "/docs") and not starts_with(http.request.uri.path, "/components") and not starts_with(http.request.uri.path, "/blocks") and not starts_with(http.request.uri.path, "/r/") and not starts_with(http.request.uri.path, "/_docs/") and not starts_with(http.request.uri.path, "/.well-known/agent-skills/") and http.request.uri.path ne "/llms.txt" and http.request.uri.path ne "/llms-full.txt")
  ```

  Action: dynamic redirect to `concat("https://www.wideset.co", http.request.uri.path)`, 301,
  preserve query string.

- The production Workers `wideset-docs` and `wideset-storybook` have `workers_dev: false`: they
  answer only on wideset.co and storybook.wideset.co, and the old workers.dev addresses are
  retired. The `-develop` Workers keep workers.dev, which the PR previews need.

---

## Caveats

- **Freeze window.** If a new changeset lands on `develop` _between_ the version step and the promotion, `main` arrives with an unconsumed changeset and the `release` job stops before npm, naming it. Merge the Version PR that `develop` opens for it and promote again; it bumps past the unpublished version. Keep version → promote tight.
- **Empty changesets.** `changesets/action` neither versions nor publishes while only empty changesets are pending, so the `release` job deletes them from its checkout (nothing is committed) and the action publishes.
- **Merge method matters.** Always promote `develop → main` with a merge commit. Squash/Rebase destroys the per‑component history.

---

## Agent skills

`@wideset/skills` is versioned with Changesets alongside the library, and its references state the
library version they describe. The Version PR runs `pnpm version-packages`, which is
`changeset version` followed by `pnpm build:skills`, so the bump and the regenerated files land
together.

`.changeset/config.json` lists `@wideset/react`, `@wideset/skills` and `wideset` (the CLI) in one `fixed` group, so they
always share a version: any release that bumps one bumps the others to the same number. Today that moves the
skills from 0.1.0 straight to the library's next version (1.4.0 with the pending changesets); the library's own
next version does not change. A private package in a fixed group is still versioned by `changeset version`
(its `package.json` and changelog are updated); only `changeset publish` skips it.

The package is `"private": true` for now, so `changeset publish` skips it. To publish it to npmjs:
create the `@wideset` organisation and its token (or OIDC), remove `private`, and add
`"publishConfig": { "access": "public" }`, since `.changeset/config.json` defaults to restricted.
