---
name: wideset-design-contribution
description: >-
  Safe workflow for a designer (with an AI agent) contributing visual work to Wideset — motion, spacing and colour
  fixes, Storybook stories, examples and docs, copy. One `design/<topic>` branch per topic with its own handoff file,
  synced from `develop` before every session, never on `main` or `develop`; the designer opens a draft pull request,
  and developers review each branch and merge, adapt or decline it. Use whenever the user is a designer, mentions a
  design branch or a handoff, or asks to tweak visuals, motion, docs or stories without writing a developer PR.
license: Apache-2.0
metadata:
  internal: true
---

# Contributing as a designer

You are helping a designer change how Wideset looks, moves and reads. Developers review everything
you produce before it reaches `develop`. The goal of a session is a small branch a developer can
read in one sitting and either merge as is or adapt onto a feature branch, not a finished release.

## Hard rules

1. **One topic, one branch, one handoff file.** Every group of related changes lives on its own
   `design/<topic>` branch with its own `docs/design-contributions/<topic>.md`. A topic is one
   component or one concern across a few components (`design/tabs-motion`,
   `design/button-hover-states`): something a developer reviews in one sitting. When the work
   drifts to something unrelated, finish the handoff and start a new branch. A branch that
   collects weeks of mixed changes cannot be reviewed and cannot be moved into the real codebase.
   The handoff is the only document you produce: no session logs, notes, plans, screenshots or
   extra markdown anywhere in the repo. The deliverable is the code change plus that one file.
2. **Sync from `develop` before every session.** Storybook has to show the current state of the
   library; otherwise you fix things that are already fixed, build on styles that no longer exist
   and hand over a branch that no longer merges. Step 1 below is the check. Do not skip it.
3. **Never touch `main` or `develop`.** Do not check them out, commit to them, merge into them or
   push them. The only contact with `develop` is reading `origin/develop`: branching from it and
   merging it into your branch. A pre-push hook refuses direct pushes; do not bypass it
   (`--no-verify`, `--force`).
4. **Never rewrite history.** No `git rebase`, `git reset --hard`, `git push --force`,
   `git commit --amend` on pushed commits. The reviewer pulls your branch.
5. **Stay in the visual layer.** Allowed, all under `packages/design-system/`: component styles
   and CVA variants (`Component.variants.ts`, `className`s in `Component.tsx`), motion and
   transitions, Storybook stories, `examples/` files and `.mdx` docs, prop descriptions (JSDoc
   text), story descriptions, copy, and snapshot updates caused by your visual change. Not allowed
   without a developer: public props and types, `src/index.ts`, `src/lib/`, `src/styles/` (tokens,
   theme entry points and the hand-maintained utilities), usage specs in `specs/`, `package.json`
   and dependencies, CI and config files, other tests, `registry.json` and the registry copies in
   `playground/`, changesets and `CHANGELOG.md`. The developer who merges writes the changeset and
   refreshes the playground. If the design needs one of these, implement the visual part, describe
   the rest as an `OPEN:` item and let the reviewer adapt it; that is a normal outcome, not a
   failure.
6. **Tokens only, never edit them.** Use existing `ws` token classes (`bg-ws-dynamic-primary-default`,
   `rounded-ws-control-lg`, `p-ws-4`, `duration-(--ws-motion-duration-fast)`). No palette classes
   (`text-gray-900`), raw hex, Tailwind scale classes (`p-4`, `w-64`, `text-sm`, `rounded-lg`) or
   arbitrary values copied from Figma. If a token you need does not exist, the binding is fixed in
   Figma, not in code: record the missing token, with the Figma node, variant and property, as an
   `OPEN:` handoff item. The token pipeline is documented in
   `packages/design-system/src/styles/tokens/README.md`; generated token files are never edited by
   hand.
7. **When unsure, stop and write it down** in the handoff rather than guessing.

## Session workflow

### 1. Start: pick the branch and sync it from `develop`

```bash
git fetch origin
git branch --list 'design/*'         # topics already started locally
git branch -r --list 'origin/design/*'
```

Continuing a topic:

```bash
git checkout design/<topic>
git merge origin/develop --no-edit
```

Starting a topic (kebab-case, same name as the handoff file; `design/<task-id>/<topic>` if the
designer has a ClickUp task):

```bash
git checkout -b design/<topic> origin/develop
```

Then verify before touching any file:

```bash
git branch --show-current              # must start with design/
git log --oneline HEAD..origin/develop # must print nothing
```

If the branch name is wrong, switch; if `develop` has commits you do not have, merge again. If
the merge reports conflicts, run `git merge --abort`, add
`OPEN: branch needs a developer sync (conflicts with develop)` to the handoff, and continue on
the current state. Never resolve conflicts by picking sides in files you did not change.

For a new topic, create `docs/design-contributions/<topic>.md` (at the repository root) from the
template in step 6 before the first commit, so the branch explains itself from the first push.

### 2. Work in Storybook

`pnpm install` once, then `pnpm storybook` (http://localhost:6006). Find the component under
`packages/design-system/src/components/<kebab-name>/`; styles live in `Component.variants.ts` and
the `className`s in `Component.tsx`, stories in `Component.stories.tsx`, docs page sections in
`examples/<page>/`. Follow [AGENTS.md](../../../AGENTS.md) for conventions; the
`wideset-component-convention` skill has the full checklist and `wideset-component-docs` covers
examples.

Motion: use the motion tokens the way sibling components do,
`duration-(--ws-motion-duration-fast) ease-(--ws-motion-ease-smooth-out)`. The durations
(`micro`, `quick`, `fast`, `medium`, `slow`, …), easings, distances and scales, with their
intended uses, are in `packages/design-system/src/styles/utilities/motion.css`. The durations
collapse to almost zero under `prefers-reduced-motion`, so anything timed with them respects
reduced motion without extra classes. Animate `transform` and `opacity`, not layout properties. A
timing with no token is an `OPEN:` item, not a raw `duration-200` or `duration-[…]` value.

### 3. Check before committing

```bash
pnpm typecheck
pnpm test
```

`pnpm test` needs a library build; if it complains that `dist/` is missing, run `pnpm build:lib`
once and test again. If a snapshot test fails only because of your intended visual change, update
it with `pnpm --filter @wideset/react exec vitest run -u <path to the test file>` (path relative to
`packages/design-system/`) and mention it in the commit and the handoff. If anything else fails
and you cannot fix it inside the visual layer, revert that part and note it in the handoff.

### 4. Commit and push

One commit per change, conventional message with a component scope, written for the developer
who will review ([conventional commits](https://www.conventionalcommits.org/en/v1.0.0/)):

```
fix(button): hover transition matches Figma (micro duration, colours only)
docs(tooltip): rewrite "when to use" section
feat(modal): overlay fade-in on the motion tokens
```

The pre-commit hook formats staged files. Then:

```bash
git push -u origin design/<topic>
```

If the push is refused for lack of access, stop and ask the designer to get write access from a
maintainer. Do not fork or push anywhere else on your own.

### 5. Open the draft pull request (first push only)

Nothing opens it automatically. Check whether one exists, and open it as a draft if not:

```bash
gh pr list --head design/<topic> --state open
gh pr create --draft --base develop --title "[design] <Topic>" --body "<body>"
```

The body follows `.github/pull_request_template.md`: a `## Why` with one or two sentences in the
designer's words, the `@coderabbitai summary` line kept as is (CodeRabbit writes the description
there), and the checklist, with items that do not apply struck through and a reason. Without
`gh`, open it on GitHub ("Compare & pull request", base `develop`, "Create draft pull request").
Never target `main`.

The `Changeset present` check fails on a design PR that changes component code. That is expected:
the developer who merges adds the changeset. Do not add one to make it green.

### 6. Keep the handoff current

`docs/design-contributions/<topic>.md` is what the reviewer reads first; a change without a line
there is invisible to them. Update it in the same commit as the change. The developer deletes the
file before the branch merges (the PR keeps it), so write it for them, not for posterity. Template:

```markdown
# Tabs motion

- Branch: `design/tabs-motion`
- Designer: <name>
- Status: in progress

## Changes

- Tabs: active pill slides between tabs (fast duration, smooth-out easing). Was: instant colour
  swap.
- Tabs docs: added "when to use" paragraph. No code change.
- Tabs snapshot updated: class names only.

## Open

- OPEN: the `simple` variant needs a 300ms duration; no motion token has it (Figma: Tabs /
  simple / transition). Not implemented; needs the token first.
- OPEN: wanted a slightly darker hover than `bg-ws-dynamic-primary-hover`; no semantic token for
  it, so used that one. Please confirm or add a token.
```

One line per change, saying what it is now and what it was; one `OPEN:` line per thing a
developer must decide or do. Rewrite lines instead of appending session logs: the file describes
the branch, not the sessions.

### 7. Finish the topic

When the branch does what the designer wanted (or has gone as far as the visual layer allows):

1. Set `Status: ready for review` in the handoff, commit, push.
2. Mark the PR ready for review (`gh pr ready`, or the GitHub "Ready for review" button).
   CodeRabbit skips drafts, so it reviews now, within minutes.
3. Go through CodeRabbit's comments: fix what stays inside the visual layer, and answer the rest
   in its thread (usually "needs a developer, listed as OPEN in the handoff"). GitHub then assigns
   a maintainer from `.github/CODEOWNERS`; tell a developer the branch is ready.
4. Start the next topic on a new branch from step 1. Do not reuse this branch.

The developer answers with one of three verdicts: merge as is (after adding the changeset,
refreshing the playground and deleting the handoff), adapt on a feature branch (they keep what
works and rework the rest, with a note in the handoff), or decline with a reason. Adapting is the
expected path whenever an `OPEN:` item needs a prop, a token or a test.

## Boundaries in one line

One `design/<topic>` branch, one draft PR and one handoff per topic, nothing else written, synced
from `develop` before every session, visual layer only, tokens only and never edited, no history
rewriting, no changesets, everything unsure goes into the handoff.
