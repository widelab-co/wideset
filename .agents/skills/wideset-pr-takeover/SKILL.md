---
name: wideset-pr-takeover
description: >-
  Take over a stale or unfinished Wideset pull request by rebuilding it as a fresh PR from
  develop: overview with before/after screenshots and a verdict on whether it still makes sense,
  then a clean implementation that already answers its review threads, review, approval, new PR
  opened and the old one closed. Use when asked to take over, redo, recreate or finish someone's
  PR ("przejmij PR", "przepisz PR po naszemu"); requires a PR URL or number.
license: Apache-2.0
metadata:
  internal: true
  conventions: AGENTS.md, CONTRIBUTING.md
---

# Wideset PR takeover

An old PR is a **proposal**, not a diff to port: `develop` has usually moved on, so the old branch
carries conflicts, stale copies and work that already landed elsewhere. We judge the idea, rebuild
it on a new branch from `develop` to this repository's standards, open it as a new PR and close
the old one with a pointer. Talk to the user in their language; the repo, commits and GitHub stay
English.

Two **gates** stop the run for the user: after the overview (step 2) and before anything leaves
the machine (step 7). Nothing is pushed, opened, closed or commented without approval of the
concrete text.

## Steps

1. **Read the PR whole.** `gh pr view <n>` with body, commits, files and `mergeable`; every review,
   comment and inline thread, resolved or not, CodeRabbit included (GraphQL query in
   `wideset-code-review` step 1); the ClickUp task when the title or branch names one. Find its
   **real diff**: when it was stacked on PRs that have since merged, compare its head with theirs
   (`git fetch origin pull/<m>/head`) so only what this PR adds is left. Check what `develop`
   already has of it: `git log origin/develop -- <its main files>` and the current code.
   Done when every file of the real diff is either still needed, already in `develop`, or obsolete.

2. **Overview, then gate.** Check the old PR out in a worktree (`pnpm install`, so the hooks run)
   and give the user, before any code:
   - what it does, in plain words: the problem, what changes for a consumer (components, props,
     tokens, blocks, docs pages), what it leaves out;
   - whether it still makes sense: what `develop` already covers, what went stale, what the PR
     missed, and any Figma claim checked against Figma;
   - **before/after screenshots**: the old PR against its merge base with `develop`, through the
     `visual-shots` skill when it is installed (else Storybook), the stories of what it touches
     and the docs pages for a docs change; read the diff pictures and name what each shows;
   - the review threads, each with what the rebuild will do about it;
   - every decision that is not technical (business, public API, scope, a departure from Figma),
     as questions;
   - a recommendation: **rebuild**, **shrink** (only part of it) or **close** (nothing left worth
     doing), with the scope of the new PR.

   Done when the user has chosen; on **close**, skip to step 8.

3. **Build on a new branch from `develop`**, `<type>/<description>` per `AGENTS.md`. Implement the
   agreed scope as if it were new work, under every rule that applies: `AGENTS.md`, the
   `wideset-component-convention` skill for component code, `wideset-component-docs` for
   examples and docs pages, the spec in `packages/design-system/specs/` when usage changes,
   `pnpm build:skills` and `pnpm playground --no-dev` when their inputs change, a changeset.
   Every review thread of the old PR is answered by the code or by a written reason it does not
   apply. Conventional commits, one topic each; credit the original author with a
   `Co-authored-by:` line when their idea carries over.
   Done when the scope is implemented and every old thread has an answer.

4. **Review and sweep.** Run `wideset-code-review` on the new branch. For each finding name the
   kind of bug, search the whole branch for it and fix every case. Done when every finding is
   fixed everywhere it occurs, put to the user as a question, or recorded as skipped with its
   reason.

5. **Verify.** `pnpm typecheck && pnpm test && pnpm lint && pnpm prettier`, plus
   `pnpm build:lib && pnpm test` after a change to build config or exports. Done when all are
   green.

6. **Screenshots of the result**: `visual-shots` (or Storybook) of the new branch against
   `origin/develop`, the same stories and pages as step 2, so the user sees the old PR's look
   and ours side by side.

7. **Gate before publishing.** Show the user the commits and the hunks that matter, the
   screenshots, the new PR body (what it does, what changed against the old PR and why, the
   design notes, `Supersedes #<old>`) and the closing comment for the old PR. Done when the user
   approves this text.

8. **Publish and close.** Push the branch, `gh pr create` against `develop` with the approved
   body, then close the old PR with the approved comment linking the new one
   (`gh pr close <old> --comment …`). Read back both URLs. When CodeRabbit reviews the new PR,
   sweep its threads as in step 4 and settle them under the `wideset-pr-review-resolve`
   publishing rules.
