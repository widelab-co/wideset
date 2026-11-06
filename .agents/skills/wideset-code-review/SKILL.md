---
name: wideset-code-review
description: >-
  Review a Wideset change (PR, branch, working tree) or audit existing code along three axes — Safety (can it hurt
  consumers, the release or the repo?), Standards (does it follow this repo's practices?) and Intent (does it do what the
  task and changeset say, nothing less, and if more, what else changed and why?) — and report them side by side with a
  verdict. Use when asked to review a PR or branch; to review local changes (working tree, staged or unstaged, local
  commits); when someone wonders whether a change is safe to merge; or when asked to audit or review an existing part of
  the library without a diff.
license: Apache-2.0
metadata:
  internal: true
  conventions: AGENTS.md, CONTRIBUTING.md, RELEASING.md, wideset-component-convention
---

Three-axis review of a diff against its base, or of existing code in audit mode. Each axis runs as a **parallel sub-agent** when the tool
supports it (otherwise one after another, notes kept apart); this skill maps the risk first, then aggregates.

This skill reports; it does not fix code, comment on GitHub, approve or merge unless asked. It never repeats what
ESLint, Prettier, `tsc` or the token-prefix test already enforce, and never repeats a CodeRabbit finding already on the PR
(it checks that each one was addressed or rebutted).

## Process

### 1. Pin the input

Pick one input and use it for every step below. `<base>` is the PR's `baseRefName`, otherwise `develop` unless the user
says otherwise.

- **Branch**: `git diff <base>...HEAD` (three-dot) + `git log <base>..HEAD --oneline`.
- **PR**: `gh pr view <n> --json title,body,baseRefName,files,reviews,comments`, then `gh pr checkout <n>`. Inline review
  threads (CodeRabbit, humans) are not in that output; fetch them with their resolution state:
  `gh api graphql -F owner='{owner}' -F repo='{repo}' -F n=<n> -f query='query($owner:String!,$repo:String!,$n:Int!){repository(owner:$owner,name:$repo){pullRequest(number:$n){reviewThreads(first:100){nodes{isResolved path line comments(first:3){nodes{author{login} body}}}}}}}'`
- **Working tree**: `git diff HEAD` (staged + unstaged) and `git ls-files --others --exclude-standard` (untracked).
- **Audit (no diff)**: the paths the user names (a component folder, `src/styles/`, the build config) read as they are
  now. Ask for the audit question if none was given ("is Select DS-ready?", "is the styles export safe to publish?"); it
  replaces the task and changeset as the Intent source.

For a diff input, confirm the base resolves and the diff is non-empty; say if `origin/<base>` moved since.
A `develop → main` PR is not a code review: check the Version Packages PR is merged, `.changeset/` has no pending `*.md`,
and it merges with a merge commit (`RELEASING.md`).

### 2. Map changed files to risk zones

List the files of the input pinned in step 1 (`git diff --name-only <base>...HEAD`; for a working tree
`git diff --name-only HEAD` plus the untracked files; in audit mode the target paths) and sort every path. A change is as
dangerous as its worst zone, whatever the title says. In audit mode the rules read as "does the code hold this today".
The library lives in `packages/design-system/`; the `src/…` paths below are relative to that folder.

- **Public API** — `src/index.ts`, `*.types.ts`, props and defaults, `displayName`.
  Removed or renamed export, prop or default ⇒ changeset with **Breaking** + migration. Public things exported, internals
  (`.context`, `.hooks`, `.Root`) not. Alphabetical. No browser-global names (`File`, `Text`).
- **Package surface** — `package.json`, `vite.config.*`, `tsconfig*`, `.npmrc`.
  `version` never by hand. New dependency justified in the PR; build-time only ⇒ `devDependencies`. `exports` change ⇒
  changeset + README.
- **Tokens and styles** — `src/styles/**`, `src/lib/utils.ts`, `prefix-tokens.cjs`, focus ring, `typography-*`.
  Generated token files not hand-edited. No Tailwind default name in `@theme`. New tokens `ws`-prefixed; new scale ⇒
  `twMerge` updated. Shared utilities changed only with a stated blast radius.
- **Release plumbing** — `.changeset/*`, `CHANGELOG.md`.
  `CHANGELOG.md` only via the Version Packages PR. Bump per rule 3 below.
- **CI and hooks** — `.github/**`, `.husky/**`, lint configs.
  No gate removed (lint → prettier → typecheck → build → test → storybook), no `permissions:` broadened, no secret,
  no `--no-verify` / `continue-on-error`.
- **Tests** — `*.test.*`, `__snapshots__/**`.
  No test deleted or `.skip`ped without a reason. Snapshot diffs read hunk by hunk.
- **Agent instructions** — `AGENTS.md`, `CLAUDE.md`, `.agents/**`, `.claude/**`, `.mcp.json`.
  Ships publicly: no credentials or internal links. A changed convention changes `AGENTS.md` too.

Any of these broken is a 🔴 blocker on the Safety axis, before any other reading of the diff.

### 3. Identify the standards sources

`AGENTS.md` (conventions), `wideset-component-convention` (per-component checklist, run it for any component folder
beyond a one-line fix), `RELEASING.md` (changesets). On top of them, the Wideset rules the team holds the line on:

1. **Consistent API.** Composition first (`<Button><Button.Icon /></Button>`, `Tile.Checkbox`), but the test is "does it
   look like its siblings": same names (`variant`, `size`, `disabled`, `value`/`onValueChange`, `open`/`onOpenChange`),
   one top-level component per folder, controlled + uncontrolled, discriminated unions. A plain prop is fine for a single
   value (`icon={RiCheckLine}`) or where siblings already do it; a deviation must be argued in the PR.
2. **Styling through variants.** Every visual axis lives in `Component.variants.ts` as CVA; ternaries picking classes in
   `.tsx` are the tell. Exception: a small component with no variant axis (`FieldLabel`, `Search`) keeps its
   classes inline. `ws` tokens or arbitrary values only; a visual change matches Figma, "looks better" is not a reason.
3. **Changesets bump by consumer impact.** Every consumer-facing change ships one; first line = changelog entry. A breaking
   change to one component's API (rename, removal, compound split, changed default) is **`minor` with a Breaking paragraph
   and a before/after migration**, not `major`. `major` is a team decision for the library's integration contract
   (stylesheet entries, install steps, peer ranges): if a changeset says `major`, ask where it was agreed; if `patch`
   describes a rename, ask for `minor` + Breaking. Internal-only change ⇒ no changeset, said so in the PR.
   This is a deliberate exception to strict SemVer, recorded in `RELEASING.md`; do not flag it as a violation.
   Prefer a soft landing: keep the old prop or export as a `@deprecated` alias for one minor, then remove it.
4. **Public API is exported, and types are part of it.** Anything stories, docs or a changeset present as usable is in
   `src/index.ts` with its `*Props`; otherwise it does not exist for consumers. A type change alone can be breaking:
   a prop made required, a narrower union, a changed callback signature. Nothing disappears from `src/index.ts`, yet
   a consumer's build fails. Verify with `pnpm build:lib` and read the `dist/index.d.ts` diff as an API diff.
5. **Snapshot tests.** Every component has a committed snapshot. A snapshot diff is a render diff: every changed class or
   attribute is explained by the PR and usually needs a changeset. Regenerated snapshots without a source change, blanket
   `vitest -u`, or deleted snapshot files are findings.
6. **Works where consumers run it.** Wideset supports React 18 and 19 (`peerDependencies`) and apps that render on the
   server. So: no React-19-only APIs (`use`, `ref` as a plain prop), `document`/`window` only behind a guard or inside
   an effect, timers and listeners cleaned up on unmount. Tests run in jsdom on one React version and stay green when
   this breaks, which is why it is a review question, not a CI question.

Judgement-call smells (labelled as such, repo practice wins): prop bag where siblings compose; one-off synonym (`isDisabled`,
`kind`); duplicated class strings across hunks; leaked `.Root`/`.Provider`/context; speculative prop nothing in Figma or the
ticket needs; boolean magic (`duration={0}` = persistent); one shared utility bent for one component; a Figma fix and an
API change in one PR that no single changeset line can describe.

### 4. Spawn the three sub-agents in parallel

Each gets the diff command, the commit list, the PR title/body, the changeset files, and its own brief only:

- **Safety**: "Using the risk zones from step 2, list every place this diff can hurt consumers, the release or the repo: file:line,
  zone, what breaks for whom, what makes it safe. Quote the hunk. A missing or mismatched changeset is a finding. No style."
- **Standards**: "Check the diff against the standards sources and rules 1–6. Cite the rule and its source, quote the hunk,
  say how to fix. Hard rules vs judgement calls kept apart. Skip what tooling enforces."
- **Intent**: "Compare the diff with the task id (from the branch name), PR body, commits and changeset text.
  Report: asked but missing/partial; done but not asked (scope creep, drive-by refactors); claimed but implemented
  differently; claims you could not verify ('tests pass', 'matches Figma'). Quote the claim and the hunk."

In audit mode each agent gets the target paths and the audit question instead of a diff; Safety reports what could hurt
consumers today (unexported public parts, SSR or React 18 hazards, generated files edited by hand), and Intent answers the
audit question and reports what the docs, stories or JSDoc promise that the code does not do.

### 5. Verify, do not trust

Run `pnpm typecheck && pnpm test`; `pnpm build:lib` + `dist/index.d.ts` diff when exports or types changed; open the story
in Storybook and compare with the Figma node when classes changed; find the test behind every
behaviour claim. `git diff --ignore-cr-at-eol` strips Windows line-ending noise from snapshots. Report what you ran.

### 6. Aggregate

Present `## Safety`, `## Standards`, `## Intent` as returned, findings as `🔴 blocker | 🟡 should fix | 🟢 nit` with
`file:line`, what, why (rule source), how to fix. Do not merge or rerank across axes. Then `## Changeset` (present, bump,
first line), `## Verified` (commands run and not run), and a verdict that follows the worst axis: ✅ Approve,
⚠️ Approve with fixes (listed), ❌ Request changes (blockers named). Under ~500 words; no praise, no diff restated.
An audit has no `## Changeset`; its verdict is ✅ Sound, ⚠️ Sound with fixes (listed) or ❌ Needs work (blockers named).

## Why three axes

A change can pass two and fail one: every convention met but an export silently gone (Safety fail); the ticket done
exactly with palette classes (Standards fail); clean, safe code that also renames a prop nobody asked for (Intent fail).
Reporting them separately stops one axis from masking another, and keeps "dangerous" from being outvoted by "tidy".
