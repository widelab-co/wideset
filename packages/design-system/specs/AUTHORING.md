# Writing a spec

Specs are for AI agents (and people) **building with** Wideset. They hold what the code cannot
say: when to pick a component and when not, which variant for which job, how parts compose, the
traps. Facts the code already holds (every prop, type, default) stay in the code and in the
generated reference (`https://wideset.co/components/<id>.md`); a spec names only the props
that decide how to use the component.

Sources of truth, in order: **Figma → code (types, CVA variants, stories, examples) → specs**.
A spec never disagrees with the code. Every component, part, prop, value and token class in a
spec must exist in `packages/design-system/src` today; check before writing it.

## Rules

- English, short sentences, plain Markdown. A component spec stays under ~150 lines.
- Write for a consumer: import and compose the component. Never describe how it is built inside
  (pixel sizes, layer structure, internal classes): an agent that reads that rebuilds the
  component instead of importing it.
- Every "when not" names the alternative (`→ use LinkButton`).
- Token classes always carry `ws` (`bg-ws-static-container`, `p-ws-4`); never palette or plain
  Tailwind scale classes. Icons are Remix components (`RiCheckLine`).
- Code samples import only from `@wideset/react`, `@remixicon/react` and `react`, and use
  real prop values. A test type-checks them: leave code out with `…`, show a mistake under
  `// Don't:`, and fence a sketch that is not one module as ` ```tsx fragment `.
- One idea once: shared rules live in a foundation file and are linked, not repeated.

## Component spec

Path: `specs/components/<group>/<kebab-name>.md`. Groups: `actions`, `inputs`, `selection`,
`date-time`, `feedback`, `navigation`, `overlays`, `data-display`, `layout`.

```markdown
---
name: Button
import: import { Button } from '@wideset/react'
group: actions
status: stable # stable | beta | deprecated
parts: [Button, ButtonIcon, ButtonTruncatedText] # named exports, root first
related: [IconButton, LinkButton, SplitButton]
docs: https://wideset.co/components/button
storybook: components-button--default # from the stories title
---

# Button

> One sentence: the decision this component stands for.

## When to use

## When not to use

- Navigating to another page → `LinkButton`.

## Anatomy

A composition tree in TSX, every part named, as a consumer writes it.

## Choosing props

| Prop | Value | Use for |
| ---- | ----- | ------- |

Only the props that decide usage (variant, preset, size, …), every value real.

## States

## Content

Label and copy rules (length, casing, verbs, counts).

## Accessibility

Only what the consumer must do or know beyond the native element / Radix (labels for icon-only,
focus, announcements).

## Do / Don't

Short TSX pairs or bullets. Counter-examples are the most useful part.

## Gotchas

Traps agents fall into: wrong prop names, mixing parts, state ownership, portals.

## API

Full props: `https://wideset.co/components/<id>.md` · Types:
`packages/design-system/src/components/<folder>/<Name>.types.ts`
```

Omit a section that would be empty. Deprecations go in frontmatter (`status: deprecated`) and a
first-line note naming the replacement.

## Group file

`specs/components/<group>/README.md`: one paragraph on what the group is for, then a "Pick the
right one" list (one line per component: when to choose it, link to its spec).

## Foundation file

`specs/foundations/<topic>.md`: the principle in two sentences, the token or class table (real
names from `src/styles`), selection rules, banned alternatives, light/dark behaviour, links to the
docs page.

## Pattern file

`specs/patterns/<name>.md`: the problem, which components and in what structure (a full TSX
example using only real exports), variants of the pattern, accessibility, anti-patterns.
