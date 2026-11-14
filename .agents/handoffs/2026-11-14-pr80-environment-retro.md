# Handoff: environment fixes from the #80 retrospective

Written 2026-11-14 after the session that merged `develop` into #80 (starting points), moved the
blocks onto `AppShell` and migrated them to the new title scale. The work itself is in #80's
commits; this file lists what in the repository's environment made that session slower or let
mistakes through, and how to fix each. One small pull request per item, from `develop`, in the
order below. Items 1–3 are mechanical and should land before #81 (stacked on #80), which repeats
the same patterns.

## 1. Git hooks never run

**Problem.** `.husky/pre-commit` and `.husky/pre-push` are tracked as `100644`
(`git ls-files -s .husky/`). Husky 8 (`"prepare": "husky install"`, `core.hooksPath=.husky`)
needs them executable, so Git skips both with "hook was ignored because it's not set as
executable". Nobody on macOS or Linux runs lint-staged on commit or the pre-push checks
(changeset, no direct push to `main`/`develop`), although `AGENTS.md` says the pre-push hook
enforces them. In the #80 session a Prettier failure reached a commit unnoticed.

**Fix.** `git update-index --chmod=+x .husky/pre-commit .husky/pre-push`, commit. Optionally
move to Husky 9 in a separate change.

**Done when** a commit with a Prettier error is stopped locally, and `git push origin develop`
from a local branch is refused by the hook.

## 2. Classes that do not exist pass every check

**Problem.** Tailwind drops unknown classes silently. After the title-scale change (#57, #52)
removed `typography-subtitle-lg`, 21 headings in #80 rendered as body text while typecheck,
lint, every test and CI were green. Any renamed or removed utility or token class fails the same
way.

**Fix.** A test (beside `src/styles/token-prefix.test.ts`, which already has a `compile()` helper)
that collects every `typography-*` class, and ideally every class containing `-ws-`, from
`src/**/*.{ts,tsx}` (components, examples, blocks) and from code fences in `specs/**/*.md`,
compiles them against the theme entry and fails on each class that produces no CSS, naming the
file. Allow a short, explicit list of exceptions if any are needed.

**Done when** reintroducing `typography-subtitle-lg` in one block fails the test with that file
and class in the message.

## 3. Blocks can hand-write the app frame again

**Problem.** `specs/components/layout/app-shell.md` and `specs/patterns/directions.md` list a
hand-written surround (grey row, rounded `main` with a shadow, `Sidebar surface` per screen) as
an anti-pattern, yet 63 blocks shipped that way and had to be migrated by codemod. Agents copy
blocks whole, and only prose guards the rule.

**Fix.** In `src/__tests__/blocks.test.tsx`:

- every block whose `navigation` in `src/blocks/index.ts` is not `none`, and every panel stage
  that shows an app page, renders `[data-slot="app-shell"]`;
- no file under `src/blocks/` contains the Inset recipe (`shadow-ws-low my-ws-7 mr-ws-7`) or
  `surface="frame"` / `surface="tinted"` on a `Sidebar`.

Then apply the same migration to #81's blocks (the #80 commit `refactor(blocks): every app
screen on AppShell direction` is the reference).

**Done when** the test fails on a block that builds its frame by hand.

## 4. One fact in five places drifts

**Problem.** The default visual direction is stated in the AppShell types, the AppShell spec,
`specs/patterns/directions.md`, `wideset-craft/SKILL.md` and `wideset-build/SKILL.md`. When it
changed from Flat to Inset, `wideset-build` kept "Flat, the default" and a link to the retired
`workers.dev` docs origin, and the first pass missed it.

**Fix.**

- Mechanical: a test in `packages/skills` (or `scripts/`) that fails on `workers.dev` in any file
  that ships: `packages/skills/**`, `packages/design-system/specs/**`,
  `packages/design-system/src/**`, `apps/docs/src/**`, minus the infrastructure files that
  legitimately name it (`apps/docs/astro.config.mjs`, `apps/docs/wrangler.jsonc`,
  `apps/docs/src/layouts/DocsLayout.astro`, `packages/design-system/scripts/registry-smoke.mjs`).
  `packages/cli/src/cli.mjs:256` still links to `workers.dev`: fix it in the same pull request
  (needs a changeset).
- Judgement: state the default direction once, in `directions.md`; the two skills and the craft
  table point there instead of repeating the value.

## 5. Branches drift from `develop`

**Problem.** #80 went days without merging `develop`. Its 77 reference screens were generated on
the old type scale and tuned visually against it, which later took a `git blame` classification
to migrate. CI tests the merge result, but no check covered the class change (item 2).

**Fix (team decision, not code).** Either require branches to be up to date before merging into
`develop` (GitHub ruleset), or a CI notice when a branch is behind `develop` and `develop` has
changed `packages/design-system/src/styles/` since the merge base. Add one line to
`CONTRIBUTING.md`: merge `develop` before generating or restyling screens.

## 6. No before/after screenshot tool

**Problem.** Reviewing #80 needed screenshots of all 96 Starting points stories on two branches.
The tool had to be written during the session; plain `chrome --headless --screenshot` captured
Storybook's loading spinner, and dialogs were caught mid-animation. `.claude/launch.json` and
`CLAUDE.md` point at preview tools that were not available in that session, so the instruction
did nothing there.

**Fix.** `packages/design-system/scripts/storybook-shots.mjs` plus a root script
(`pnpm shots -- --ref <git ref> --stories <prefix>`):

- start Storybook for the current tree and, for `--ref`, in a temporary `git worktree` with
  `pnpm install --offline` on another port;
- drive headless Chrome over the DevTools protocol (Node 22 has `fetch` and `WebSocket`; no new
  dependency): per story open `iframe.html?id=…&viewMode=story`, wait until `body` has
  `sb-show-main` and `#storybook-root` has children, then `document.fonts.ready` and about 2.5s;
  emulate `prefers-color-scheme` and `prefers-reduced-motion: reduce`; 3 tabs in parallel;
- write PNG pairs, a pixel-difference percentage per story, and a static `index.html` that shows
  the pairs side by side, sorted by difference.

Add one line to `CLAUDE.md`: without preview tools, run Storybook with
`pnpm --filter @wideset/react exec storybook dev -p <port> --ci --no-open`.

## 7. Context cost of generated files

**Problem.** One `git diff` of the regenerated, minified playground stylesheet printed 867 KB.
Generated skill references produce the same noise in reviews.

**Fix.** `.gitattributes`:

```
packages/design-system/playground/src/styles/wideset.css -diff linguist-generated
packages/skills/skills/*/references/specs/** linguist-generated
packages/skills/skills/*/references/good-practices/** linguist-generated
packages/skills/skills/wideset-build/references/registry-imports.md linguist-generated
```

## 8. Takeover workflow as a skill

**Problem.** Fixing another contributor's pull request on their branch repeats the same steps
every session, and today they live in local notes as an exception to `wideset-pr-queue`.

**Fix.** A contributor skill `.agents/skills/wideset-pr-takeover/SKILL.md`
(`metadata.internal: true`), written with the `writing-for-agents` guide:

1. Read the PR, its threads (resolved or not) and whether it contains other PRs.
2. `gh pr checkout`, `git merge origin/develop` (never rebase or force-push their branch).
3. For each conflicted file that came from an already merged PR, take `develop`'s side: compare
   the file with the merged PR's head (`refs/pull/<n>/head`) to confirm nothing else is in it;
   re-apply only what has no PR of its own.
4. Regenerate instead of resolving: `pnpm build:skills`, `pnpm playground --no-dev`, snapshots.
5. Review with `wideset-code-review`; fix small technical findings in place, one commit each.
6. Screenshots before/after (item 6) for anything visual.
7. Full verification, show the diff and the comment text, push only after approval.
8. Comment "What I changed", `gh pr ready`, CodeRabbit, record the result in the queue.

## 9. Asking the user

From the same session: ask in the language the user writes in, and show a visible change across
many screens (here 66 page titles from 24 to 32px) before making it, not after. These are
personal preferences, so they go to the agent's memory, not the repository.

## Suggested skills

- `writing-for-agents`: before editing `CLAUDE.md`, `AGENTS.md`, `CONTRIBUTING.md` or writing
  the skill in item 8.
- `write-a-skill`: for item 8.
- `wideset-code-review`: review each pull request before opening it.
- `tdd`: items 2–4 are tests; write each one failing on a planted example first.
