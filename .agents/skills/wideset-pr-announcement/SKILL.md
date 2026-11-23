---
name: wideset-pr-announcement
description: >-
  Turns a Wideset pull request into a short Polish announcement for the team (Dlaczego / Co / Jak
  sprawdzić), ready to paste into Slack or saved as a Slack draft. Use when asked to announce a PR,
  summarise it for the team or Slack, or shorten its description; requires a PR URL or number.
license: Apache-2.0
metadata:
  internal: true
---

# Wideset PR announcement

## Quick start

`Use $wideset-pr-announcement for PR #129.` A full PR URL also works; add a channel name to get a
Slack draft as well.

The output is a message a teammate reads in ten seconds and knows what changed and why. The PR
description is written for the reviewer; the announcement is written for the rest of the team.

## Workflow

### 1. Read the PR

- Require a PR URL or number; ask if absent, never infer it from the current branch.
- `gh pr view <n> --json title,url,author,state,body,files` (and `gh pr diff <n>` only when the
  body leaves the effect unclear).
- Note who the author is: the message is in the first person when the user wrote the PR
  (`Dodałem`, `Naprawiłem`), otherwise it names the author once and stays impersonal.

Done when you can say, in one sentence each, what was wrong and what is different after the merge.

### 2. Write the announcement

Three sections, in this order, each header in Slack bold:

- **Dlaczego**: the problem in plain words: what broke or was missing, who noticed, why the checks
  did not catch it. One to three sentences.
- **Co**: what is different after the merge, one bullet per change a person could notice. A fix
  gets its before state: `Wcześniej …`.
- **Jak sprawdzić**: the one command or the one place (Storybook story, docs page) that shows it.
  Leave the section out when nothing is checkable.

Writing rules:

- Polish, plain and concrete: the effect a person sees (`nagłówki wyglądały jak zwykły tekst`), not
  the mechanism (`klasa nie generuje CSS`), unless the mechanism is the news.
- Keep the PR's facts; numbers (`21 nagłówków`) and before/after colours are what make it land.
- Leave out what only the reviewer needs: merge order, changesets, checklists, the CodeRabbit
  summary, refactors nobody sees, file lists.
- Code formatting only for something to type or search: a command, a test file, a PR number.
- Under 120 words. First line: the PR as a link, `<url|#129 Tytuł PR>`.
- Slack mrkdwn: `*bold*` headers, `•` bullets, `` `code` `` for commands.

Done when every sentence would be missed if deleted and the message fits one screen without
scrolling.

### 3. Hand it over

- Print the message in a code block so it pastes as is.
- When the user names a channel or person, also save it with `slack_send_message_draft` and give
  the draft's link. A draft only: posting is the user's click.
- Ask for corrections in one line; apply them to the same draft.

## Example

From PR #129 (test for classes that compile to nothing):

```
<https://github.com/widelab-co/wideset/pull/129|#129 Test na klasy, które nie generują CSS>

*Dlaczego*
Tailwind przy generowaniu CSS po cichu pomija klasy, których tokeny nie istnieją. W #80 przez to 21 nagłówków wyglądało jak zwykły tekst, bo ich klasa przestała istnieć. CI i testy nic nie zgłosiły.

*Co*
Dodałem test: wywala się, gdy klasa `typography-*` albo `-ws-` nie generuje CSS.
Naprawiłem dwie takie klasy, które test znalazł w blokach:
• Code editor: podkreślenia błędów i ostrzeżeń są czerwone i żółte, tak jak miało być. Wcześniej miały kolor tekstu.
• Bloki agentów: pusta kropka „stopped” ma ten sam kolor co „working”. Wcześniej była szara.

*Jak sprawdzić*
`pnpm vitest src/styles/known-classes.test.ts` w `packages/design-system`.
```
