# Evals

Do the skills change what agents build? Each case in `cases/` runs `claude -p` in a fresh Vite + Tailwind v4 app with every Wideset component scaffolded, without the skills and with them, and grades the result. The source is there on purpose: that is how Wideset is consumed, so an agent can always read a component's props. The checks measure what the source does not teach.

A run passes when all of these hold:

- the agent finished, and the app's type-check and build pass, which rules out invented exports and props
- no palette classes, raw hex, Tailwind scale classes, unprefixed spacing or `dark:` variants
- Remix icons only, no inline `<svg>`
- the handler each component really takes (`onValueChange` on `Select`, not `onChange`)
- the Wideset components the case requires are used
- what the type-checker accepts but the system does not: hand-built controls where Wideset has one, more than one filled primary button in a view, cards inside cards, gradients, emoji, placeholder content, filler headings
- mistakes that compile and then break: a `Sidebar.Section` with no mode wrapper renders nothing, a trigger without `asChild` nests a button in a button, a `Modal.Content` with no title, an `IconButton` with no label, a field error with no invalid control

A view for the primary button check is what can show at once: an overlay, a tab panel, each branch of a ternary and an `if` that returns stay apart, while components rendered together in one file add up. Components imported from another file are not counted together.

The checks are in `grade.mjs`. They read code, so they say nothing about whether a screen looks good.

```bash
pnpm --filter @wideset/skills evals --case settings-modal --runs 1   # try one first
pnpm --filter @wideset/skills evals --runs 3 --name release          # the acceptance run
```

Results land in `results/<name>.json`: a summary per arm (pass rate, and for every case its passes and the traps that fired) and every run's reasons. The runner prints the same summary. `results/` is ignored by Git: a run says something only about the guidance it graded, so it is not kept in the repository.

## Traps

The cases named `trap-*` are built so the obvious implementation compiles, builds and is wrong, while the answer is in `packages/design-system/specs/` and not in one component's source: three plans compared at a glance are a radio group, not a `Select`; a record's status is a `StatusBadge`, not a `Tag`; a dialog opened from a menu item is controlled outside the menu; a composed `Select` takes its `id` and `aria-describedby` on `Select.Trigger`. A case arms its traps with `traps: id, id` in its frontmatter, the checks live in `TRAPS` in `grade.mjs` (`checkTraps`), and a trap fires only in the cases that arm it. Trap results are reported apart from the other checks and count toward pass and fail. A trap whose check cannot be made reliable from the syntax tree is dropped together with its case.

`toolUsage` records `specsRead` (spec paths under `references/specs`, without `.md`), `skillsInvoked`, `skillFilesRead`, `agentsFileRead` and `librarySourceReads`, to tell a skill that was not consulted from one that did not help.

## What a result means

The target for a release: **with the skills at least 80% of runs pass, and without them at least half of the runs fail.** The pilots so far show why that alone is not enough: the gap comes almost entirely from the `ws` token rule, and says little about choosing or combining components.

So read the traps too, without a target of their own. If both arms fall into a trap equally often, the guidance adds nothing on that trap: reconsider the rule (its wording, where it sits, whether the spec is the right carrier) instead of keeping it. A trap nobody falls into, in either arm, is an easy case and tells us nothing: make it harder or drop it. Three runs per case is a small sample; read a difference of one run as noise.

To add a case, write a task a person would actually ask for, without naming components in the prompt, and list what a correct answer must use under `requires`. `Modal|StatusModal` accepts either, and a component used through its hook (`useToast`) counts.
