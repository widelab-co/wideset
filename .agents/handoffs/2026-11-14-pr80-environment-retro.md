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

**Done when**, after the mode change, a commit with a Prettier error is stopped locally, and a
push to a `develop` branch on a disposable remote (`git init --bare /tmp/remote.git`, then
`git push /tmp/remote.git HEAD:develop`) is refused by the hook. Never test it against `origin`:
if the hook still does not run, the push lands on the real `develop`.

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
  `packages/design-system/src/**`, `packages/cli/src/**`, `apps/docs/src/**`, minus the
  infrastructure files that legitimately name it (`apps/docs/astro.config.mjs`,
  `apps/docs/wrangler.jsonc`, `apps/docs/src/layouts/DocsLayout.astro`,
  `packages/design-system/scripts/registry-smoke.mjs`).
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

## Addendum 2026-11-18: seven review rounds on #81 and #93

#81 and #93 (the agent interface, stacked on #91) needed seven CodeRabbit rounds on 17.11. Most
findings were one defect class, found one instance per round: a handler reading state from the
last render. Items 10–14 are what let that through.

## 10. Review fixes stop at the reported line

**Problem.** CodeRabbit reviews only the files changed since its last pass. Each fix to
`agent-chat/use-session.ts` sent it back into that file, where it found the next instance of the
same class (`attach`, then `send`, then the tray, then `running`): five rounds for one class.
Classes fixed only at the named line on 16.11 (IME in a composer, "Copied" before the clipboard
write, pane state lost on unmount) came back on 17.11 in other places.

**Fix.** In `.agents/skills/wideset-pr-review-resolve/SKILL.md`, step 3: for every Apply, name
the defect class and search the whole pull request, kit copies included, for its other
instances before validating; the reply says how many places changed. Locally, the CodeRabbit
CLI (`coderabbit review --agent`, which the bot suggests) runs the same review before a push; it
is a personal tool, not a repository change.

**Done when** a report entry lists the class, the search and every instance, not only the
reported line.

## 11. Stacked pull requests run without CI

**Problem.** `.github/workflows/build.yaml` runs on pull requests into `develop` and `main` only,
and `.coderabbit.yaml` reviews automatically only on those bases. #81 (based on #91's branch) and
#93 (based on #81's) had no CI through their whole review, and CodeRabbit ran only on a manual
`@coderabbitai review`. Retargeting to `develop` starts nothing either: `edited` is not a trigger.

**Fix.** Run the build job for pull requests into `feature/**` too (`pull_request.branches`), and
add `feature/**` to `auto_review.base_branches`. Both files belong to `wideset-core`.

**Done when** a pull request based on a `feature/…` branch shows `Build & validate`.

## 12. Tests do not run in StrictMode

**Problem.** A queued agent message went out twice in development, because StrictMode sets
effects up twice; no test could see it, since `src/test-setup.ts` renders without StrictMode.
`useSession`, the agent kit's state machine (queue, questions, stop, attachments), had no test
before 17.11, so CodeRabbit acted as its test suite.

**Fix.** `configure({ reactStrictMode: true })` from `@testing-library/react` in
`src/test-setup.ts`, then fix what fails. For the kit, one test per session method called twice
in one handler. Longer term, `useSession` as a `useReducer` makes every transition atomic; the
refs added on 17.11 (`busy`, `tray`) are a patch.

**Done when** every test renders in StrictMode and `pnpm test` passes.

## 13. Kit copies are reviewed as separate code

**Problem.** The agent kit lives in `agent-chat/` and is copied byte for byte into up to four
other blocks; the AGENT_KIT test in `src/__tests__/blocks.test.tsx` keeps the copies identical.
CodeRabbit reviews each copy as its own file: the late findings came on #93's copies of
`use-session.ts` while #81, which holds the source, was already approved. Every kit fix took two
pushes and two reviews.

**Fix.** A `path_instructions` entry in `.coderabbit.yaml` for
`packages/design-system/src/blocks/**` (there is none for blocks today): blocks are copied
consumer code; files on the AGENT_KIT list outside `agent-chat/` are copies the test keeps
identical, so findings go on the `agent-chat/` file.

**Done when** a review of a change to a kit copy files its findings against `agent-chat/`.

## 14. Stale state updates pass lint

**Problem.** `setOpen(!open)`, `setItems([...items, item])` and `setCount(count + 1)` in a handler
read the value of the last render, so a second call in the same handler loses the first. On
17.11 every agent block had to be swept by hand; `react-hooks/exhaustive-deps` does not look at
this.

**Fix.** A `no-restricted-syntax` rule in `.eslintrc.json`, first for
`packages/design-system/src/blocks/**`: a call to `set[A-Z]…` whose argument is `!x`, an array
spreading an identifier, or `x ± 1`, with the message "use the updater form". IME handling
(Enter and Escape ignore `isComposing`) is a judgement call: it belongs in the review rules
(`wideset-code-review`, or the blocks entry of item 13).

**Done when** reintroducing `setOpen(!open)` in a block fails `pnpm lint`.

## Suggested skills

- `writing-for-agents`: before editing `CLAUDE.md`, `AGENTS.md`, `CONTRIBUTING.md`, writing the
  skill in item 8 or editing the one in item 10.
- `write-a-skill`: for item 8.
- `wideset-code-review`: review each pull request before opening it.
- `tdd`: items 2–4 and 12 are tests; write each one failing on a planted example first.
