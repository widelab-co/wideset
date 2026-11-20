---
name: wideset-component-docs
description: Give a Wideset component its examples and full docs page. Examples are files in the library (`src/components/<folder>/examples/<page>/`) that Storybook shows as stories and the docs site (apps/docs) shows as page sections; this skill covers writing them, the playground's stage and its optional tuning, and checking the page. Use when a component is added, when one gains a variant, size, part or state the page should show, or when asked to document a component or fill out its docs page.
license: Apache-2.0
metadata:
  internal: true
  pattern: packages/design-system/src/components/tabs/examples/tabs, apps/docs/src/playgrounds/button.tsx
---

# Component examples and docs page

The page builds itself from the library: the title and description (the stories meta) with
"Copy page", then up to five tabs.

- **Overview:** the component on its stage (the thumbnail); Installation (one card: CLI or
  Manual, from the registry item); **Examples (the example files)**, each a card with the live
  example and its code; API reference (one props table per part, from the types); Accessibility
  (the spec's section, when it has one).
- **Code** shows the component's own installed source files when it has a registry item.
- **Anatomy** (two or more parts): the picture (parts found by `data-slot`) and the parts table
  (named exports). Its rules are the `wideset-component-anatomy` skill.
- **Relationships** (when the graph links the component to another): the map and the lists
  "Built with", "Uses <name>", "Appears with", read from imports.
- **Playground** shows the interactive stage, properties and generated code when a default example
  exists.

The Playground tab (`/components/<page>?tab=playground`) is the only playground; the old
`/docs/playground?c=<page>` address redirects there. One file per example feeds both Storybook
and the page, so they cannot drift. Tabs is the pattern to copy.

The page tabs are the only row of tabs in the page's flow: any other switch sits inside a card
(Installation's CLI | Manual pills) or is another control. Do not add a second row.

Paths: `pkg/` = `packages/design-system/`, `docs/` = `apps/docs/`. A page is a stories file
whose component `src/index.ts` exports; `<page>` is its kebab name (`IconButton.stories.tsx` →
`icon-button`). Internal components (not exported) have stories but no page and no examples.

## 1. The examples folder — `pkg/src/components/<folder>/examples/<page>/`

```
default.tsx   the playground's stage (section 2)
<name>.tsx    one example per subject: variants, sizes, icons, states, …
index.ts      export default ['types', 'sizes', 'icons', 'states'];  ← reading order
```

An example is what a consumer copies; the page prints the file as it is.

```tsx
/**
 * Large is the default for most product screens. Small has a smaller label and less vertical
 * padding, for dense panels and sidebars; use one size per screen.
 */
import { Tabs } from '@wideset/react';

export default function TabsSizes() {
  return (
    <div className="gap-ws-12 flex w-[24rem] max-w-full flex-col">
      {(['sm', 'lg'] as const).map((size) => (
        <Tabs key={size} size={size} defaultValue="overview">
          …
        </Tabs>
      ))}
    </div>
  );
}
```

- Imports only `@wideset/react`, `@remixicon/react` and `react` (ESLint rejects relative
  imports here; the package name resolves to `src/index.ts` everywhere in the repo).
- **Starts with a JSDoc**: what the title and the picture do not say — the rule behind it, when
  to pick which, what you cannot see (keyboard, screen readers). Never a sentence that repeats
  the title. It is the description in Storybook and on the page.
- One subject per file, all values side by side, realistic content, `ws` token classes only,
  a minimal layout wrapper. Uncontrolled state (`defaultValue`) unless control is the subject.
- No code patterns (`asChild`, routing, a form around it) and no dev cases: those are stories
  of their own in the stories file, not examples.

## 2. Every example is a story

```tsx
import { exampleStory } from '../../stories/example';
import SizesExample from './examples/tabs/sizes';
import sizesSource from './examples/tabs/sizes?raw';

export const Sizes: Story = exampleStory(SizesExample, sizesSource);
```

Place them after `Default`, in `index.ts` order. `Default` stays the Controls story; dev-only
stories (Controlled, Composition, edge cases) stay as they are.

## 3. The playground's stage — `examples/<page>/default.tsx`

The page opens on it and the gallery shows it as the component's thumbnail: one typical
instance with realistic content whose root takes the Playground's props. Every page has one.

```tsx
/** The playground's stage: one link button, its props set from the Properties panel. */
import { LinkButton, type LinkButtonProps } from '@wideset/react';

export default function LinkButtonDefault(props: Partial<LinkButtonProps>) {
  return (
    <LinkButton href="#invoices" {...props}>
      View invoice
    </LinkButton>
  );
}
```

The Playground's Properties panel is every union and boolean of the root props type
(`gen-props.mjs` reads them); the code under the stage prints the JSX `default.tsx` returns with
`{...props}` replaced by the chosen props. Use every part a reader should see, so the anatomy
picture can name them.

## 4. Playground tuning — `docs/src/playgrounds/<page>.tsx` (optional)

Only what the types do not say: `playground({ from: '<Name>Props', … })` from
`docs/src/lib/playground-kit.ts` (read its JSDoc). `hide`, `labels`, `order`, `optional`,
`defaults`, `stage` (the dark stage for `inverse`), `preview` (an overlay drawn open for the
gallery card), `anatomy` (a composition with every part, when the stage lacks some),
`render`/`code` with `content` controls only when the stage needs controls the types do not have
(an icon on/off, a count). Never re-list a union by hand. For `anatomy` and anything else on
the Anatomy tab, use the `wideset-component-anatomy` skill.

### Playground controls

The Playground page's Properties panel picks each control from the definition's
`select | switch` at render time; playground files do not change. Source of truth:
`docs/src/components/PropertiesPanel.tsx`.

- On/off (`switch`) is a Switch on its row: label left, switch right.
- A `select` of two or three options whose labels are all short (10 characters or fewer, a
  "None" counted) is a full-width SegmentedControl. Two named alternatives (Filled / Outline)
  are segmented, never a switch: a switch cannot say which one is on.
- Four or more options, or any long label, is a full-width Select.
- Options keep the definition's order, so a scale reads small to large in both.
- Layout: the definition's groups under their titles (the strongest text in the panel), apart by
  space, no lines; each field label above its control in the quietest text; small (`sm`) controls.

## 5. Parts carry `data-slot`

Every rendered part sets `data-slot="<kebab of its export>"` before `{...props}`
(`TabsList` → `tabs-list`). The anatomy picture finds parts only by it; a part without one says
"Renders no element" in the table.

## Check

```bash
pnpm --filter @wideset/react exec vitest run src/__tests__/examples.test.tsx -t <page>
pnpm --filter @wideset/docs test        # generators: controls, catalogue, descriptions
pnpm docs:build                         # renders every page and example
pnpm lint && pnpm prettier
```

Then open the page (`pnpm docs:dev`, `/components/<page>`), its playground
(`/components/<page>?tab=playground`) and the stories in Storybook: the stage and the thumbnail in the
gallery, the playground's controls and the code after changing one, each example in light and
dark, the API tables, the Anatomy tab (`?tab=anatomy`, the checklist in
`wideset-component-anatomy`) and the Relationships tab (`?tab=relationships`).
