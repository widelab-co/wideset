---
name: wideset-pr-takeover
description: >-
  Take over a stale or unfinished Wideset pull request by rebuilding it as a fresh PR from
  develop: ownership check, overview with before/after screenshots and a verdict on whether it
  still makes sense, the old PR closed as soon as the rebuild is agreed, then a clean
  implementation that already answers its review threads, review, approval, and the new PR
  opened and linked from the old one. Use when asked to take over, redo, recreate or finish
  someone's PR. Requires a PR URL or number.
license: Apache-2.0
metadata:
  internal: true
  conventions: AGENTS.md, CONTRIBUTING.md
---

# Wideset PR takeover

An old PR is a **proposal**, not a diff to port: `develop` has usually moved on, so the old branch
carries conflicts, stale copies and work that already landed elsewhere. We judge the idea, rebuild
it on a new branch from `develop` to this repository's standards and open it as a new PR. The old
PR is closed as soon as the rebuild is agreed, so nobody else picks it up or reviews it meanwhile,
and gets a pointer to the new PR once that exists. Talk to the user in their language; the repo,
commits and GitHub stay English.

Get the user's choice after the overview (step 3). Before any GitHub write (closing the old PR,
pushing, opening the new PR, replies, comments), get explicit approval for the target PR or
branch, the revision being published and the exact public text. Step 4 handles the ClickUp task
after the user approves the takeover.

## Steps

1. **Check ownership and overlapping work before taking over.** Keep this step read-only.
   - Read the GitHub PR's assignees, author, state, title, branch, body and files. Search ClickUp
     using the PR number, title and affected components, even if GitHub has no assignee or task
     link. Read matching tasks' status, assignees and linked work.
   - Fetch `origin/develop`. Search open, merged and closed GitHub PRs by original PR number,
     ClickUp ID, components and behavior. Compare candidate diffs and current code so each
     proposed outcome has evidence of whether it landed, is being handled elsewhere, or remains
     available.
   - If another person owns an active matching task or PR, stop and report their name and the
     links. Ask the user to confirm who should continue before any takeover or task change. If
     another change covers the whole scope, recommend closing and show the supporting links. If
     coverage is partial, carry only the outstanding scope to the overview.

   Done when ownership and overlapping work are accounted for, including ClickUp assignments.

2. **Read the PR whole.** `gh pr view <n>` with body, commits, files and `mergeable`; every review,
   comment and inline thread, resolved or not, CodeRabbit included (GraphQL query in
   `wideset-code-review` step 1); the ClickUp task when the title or branch names one. Find its
   **real diff**: when it was stacked on PRs that have since merged, compare its head with theirs
   (`git fetch origin pull/<m>/head`) so only what this PR adds is left, and keep that parent
   head (after a squash merge too) as the screenshot baseline. Check what `develop` already has
   of it: `git log origin/develop -- <its main files>` and the current code.
   Done when every file of the real diff is either still needed, already in `develop`, or
   obsolete.

3. **Overview, then gate.** Look at the old PR in a separate worktree. Before running anything
   from it (`pnpm install`, a build, Storybook), read what it changes that runs on install or
   start: `package.json` scripts, `pnpm-workspace.yaml` (approved build scripts), `.husky/`,
   Vite and Storybook config, against its baseline. When the author is outside the team or such
   a change is not clearly harmless, run its checkout only in an isolated environment with no
   credentials or shared Git state, or skip the screenshots and say so. Then give the user,
   before any code:
   - what it does, in plain words: the problem, what changes for a consumer (components, props,
     tokens, blocks, docs pages), what it leaves out;
   - whether it still makes sense: what `develop` already covers, what went stale, what the PR
     missed, and any Figma claim checked against Figma;
   - **before/after screenshots**: the old PR against the baseline from step 2 (the parent head
     for a stacked PR, otherwise its merge base with `develop`), through the
     `wideset-visual-shots` skill (else Storybook): the stories of what it touches and the docs
     pages for a docs change; read the diff pictures and name what each shows;
   - the review threads, each with what the rebuild will do about it;
   - every decision that is not technical (business, public API, scope, a departure from Figma),
     as questions;
   - a recommendation: **rebuild**, **shrink** (only part of it) or **close** (nothing left worth
     doing), with the scope of the new PR.

   Done when the user has chosen.
   - **Close:** get approval for the exact PR and closing text, verify the PR is still open at
     the reviewed head, close it with the approved comment (or add it if already closed) and
     confirm the state. End the run there.
   - **Rebuild** or **shrink:** close the old PR now, before any code, so nobody else takes it up
     or reviews it while the rebuild is under way. Show the exact comment for approval, for
     example: "Closing: this is being rebuilt from current `develop` as a new PR (<scope in one
     line>); the link follows here once it is open." After approval, verify the PR is still open
     at the reviewed head, `gh pr close <old> --comment …` and confirm the state. If the user
     declines closing now, keep it open; step 10 closes it then. If the rebuild is later
     abandoned, reopen it (`gh pr reopen <old>`) with a comment saying so. Then go to step 4.

4. **ClickUp task: find it, or create it.** Every rebuilt PR has one task in ClickUp, list
   `Tasks` in Design system › Wideset (id `901214016294`). Look first: the task step 2 found,
   then `clickup_search` in that space over the PR's subject in the team's languages (component
   or area, the feature), closed tasks included. A task that already covers the work is the
   task, whatever its wording, assignee or status.
   - **Found:** use it as it stands; move it to `in progress` unless it is already `complete`.
   - **None:** create it without waiting, assigned to the user, status `in progress`, named
     `<Component or area>: <what changes>`, in the language and markdown format of the list's
     existing tasks: a context section (the problem, and that it comes from #<old> by its
     author), numbered, checkable outcomes a consumer sees, and a PR section linking #<old>
     (step 10 adds the new PR).

   Report the task as a link. Done when exactly one task covers the work.

5. **Build on a new branch from `develop`**, `<type>/<description>` per `AGENTS.md`, named
   differently from the old PR's branch: `git ls-remote origin <name>` must print nothing. On a
   taken name the push is rejected, yet `gh pr create` still opens a PR on the old head.
   Implement the agreed scope as if it were new work, under every rule that applies:
   `AGENTS.md`, the `wideset-component-convention` skill for component code,
   `wideset-component-docs` for examples and docs pages, the spec in
   `packages/design-system/specs/` when usage changes, `pnpm build:skills` when a spec changes,
   a changeset. Every review thread of the old PR is answered by the code or by a written reason
   it does not apply: draft those replies with `wideset-pr-review-resolve`. Conventional
   commits, one topic each; credit the original author with a `Co-authored-by:` line when their
   idea carries over.
   Done when the scope is implemented and every old thread has a drafted answer.

6. **Review and sweep.** Run `wideset-code-review` on the new branch. For each finding name the
   kind of bug, search the whole branch for it and fix every case. Done when every finding is
   fixed everywhere it occurs, put to the user as a question, or recorded as skipped with its
   reason.

7. **Verify.** `pnpm typecheck && pnpm test && pnpm lint && pnpm prettier`, plus
   `pnpm build:lib && pnpm test` after a change to build config or exports. Done when all are
   green.

8. **Screenshots of the result**: `wideset-visual-shots` (or Storybook) of the new branch
   against `origin/develop`, the same stories and pages as step 3, so the user sees the old PR's
   look and ours side by side.

9. **Gate before publishing.** Show the user the commits and the hunks that matter, the
   screenshots, the new PR body (what it does, what changed against the old PR and why, the
   design notes, `Supersedes #<old>`, a `ClickUp: [<task name>](<url>)` line), the drafted
   replies to the old threads, and the comment for the old PR with a placeholder for the new PR
   URL. Done when the user approves the revision and every text (and closing the old PR, if it
   was kept open at step 3).

10. **Publish and link.** Before anything, check the remote branch, both PRs and any replies
    already posted, so a retry reuses what is done. Push the branch, `gh pr create` against
    `develop` with the approved body, then post the approved replies on the old PR's threads
    under `wideset-pr-review-resolve`, and the approved comment with the new PR's URL on the old
    PR, closed at step 3 (`gh pr comment <old> --body …`); if it was kept open, close it with
    that comment instead (`gh pr close <old> --comment …`). If a revision or text changes after
    approval, ask again for that part. Move the ClickUp task to `in review` and add the new PR to
    its PR section (a comment on a task found in step 4). Read back both URLs and states. When
    CodeRabbit reviews the new PR, sweep its threads as in step 6 and settle them under the
    `wideset-pr-review-resolve` publishing rules.
