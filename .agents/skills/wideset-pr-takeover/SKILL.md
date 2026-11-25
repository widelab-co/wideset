---
name: wideset-pr-takeover
description: >-
  Take over a stale or unfinished Wideset pull request by rebuilding it as a fresh PR from
  develop: overview with before/after screenshots and a verdict on whether it still makes sense,
  then a clean implementation that already answers its review threads, review, approval, new PR
  opened and the old one closed. Use when asked to take over, redo, recreate or finish someone's
  PR. Requires a PR URL or number.
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

Get the user's scope decision after the overview. Before any GitHub write, get explicit approval
for the target PR or branch, the revision being published, and the exact public text.

## Steps

1. **Read the PR whole.** `gh pr view <n>` with body, commits, files and `mergeable`; every review,
   comment and inline thread, resolved or not, CodeRabbit included (GraphQL query in
   `wideset-code-review` step 1); the ClickUp task when the title or branch names one. Find its
   **real diff**: when it was stacked on PRs that have since merged, compare its head with theirs
   (`git fetch origin pull/<m>/head`) so only what this PR adds is left. Check what `develop`
   already has of it: `git log origin/develop -- <its main files>` and the current code.
   Done when every file of the real diff is either still needed, already in `develop`, or obsolete.

2. **Overview, then gate.** Inspect the old PR read-only. For screenshots, run the trusted
   `wideset-visual-shots` script and both checkouts in a disposable VM or isolated runner with
   no operator credentials, host mounts, or shared Git state. Restrict filesystem access to the
   scratch environment and network access to required dependency sources. This applies to checkout,
   installation, build, dev servers, and the browser. If isolation is unavailable, use existing
   screenshots or report that screenshots are unavailable. Give the user:
   - what it does, in plain words: the problem, what changes for a consumer (components, props,
     tokens, blocks, docs pages), what it leaves out;
   - whether it still makes sense: what `develop` already covers, what went stale, what the PR
     missed, and any Figma claim checked against Figma;
   - **before/after screenshots**: use the baseline from step 1 for a stacked PR, including the
     parent head after a squash merge, and the merge base with `develop` otherwise. Compare the
     relevant Storybook stories and docs pages and explain the visible differences.
   - the review threads, each with what the rebuild will do about it;
   - every decision that is not technical (business, public API, scope, a departure from Figma),
     as questions;
   - a recommendation: **rebuild**, **shrink** (only part of it) or **close** (nothing left worth
     doing), with the scope of the new PR.

   For **rebuild** or **shrink**, continue to step 3. For **close**, show the exact closing
   comment and target PR for approval. After approval, verify the PR is still open at the
   reviewed head, close it with the approved comment, confirm the state, and end the workflow.

3. **Build on a new branch from `develop`**, `<type>/<description>` per `AGENTS.md`. Implement the
   agreed scope as if it were new work, under every rule that applies: `AGENTS.md`, the
   `wideset-component-convention` skill for component code, `wideset-component-docs` for
   examples and docs pages, the spec in `packages/design-system/specs/` when usage changes,
   `pnpm build:skills` when a spec changes, a changeset.
   Draft replies to the old review threads using `wideset-pr-review-resolve`. Explain how the
   rebuilt code addresses each request or why it does not apply. Use conventional commits and
   credit the original author with a `Co-authored-by:` line when their work carries over.
   Done when the agreed scope is implemented and the reply batch is ready for review.

4. **Review and sweep.** Run `wideset-code-review` on the new branch. For each finding name the
   kind of bug, search the whole branch for it and fix every case. Done when every finding is
   fixed everywhere it occurs, put to the user as a question, or recorded as skipped with its
   reason.

5. **Verify.** `pnpm typecheck && pnpm test && pnpm lint && pnpm prettier`, plus
   `pnpm build:lib && pnpm test` after a change to build config or exports. Done when all are
   green.

6. **Screenshots of the result**: `wideset-visual-shots` of the new branch against
   `origin/develop`, the same stories and pages as step 2, so the user sees the old PR's look
   and ours side by side.

7. **Approve the replacement PR.** Show the commits, relevant hunks, screenshots, and exact
   replacement PR body, including `Supersedes #<old>`. Get approval to push the reviewed revision
   and open the replacement against `develop`.

8. **Publish the replacement, then close the original.** Push and open the replacement after
   approval. Once its URL exists, show the exact reply batch and closing comment with that URL.
   Get approval to post those replies and close the original PR. Publish the approved replies
   under `wideset-pr-review-resolve` before posting the closing comment and closing the original.
   Before any retry, check the remote branch, both PRs, and previously posted replies so completed
   actions are reused. If a revision or public text changes, refresh the affected approval.
   Confirm both URLs and states. Review new CodeRabbit findings as in step 4.
