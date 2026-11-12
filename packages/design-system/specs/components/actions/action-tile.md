---
name: ActionTile
import: import { ActionTile } from '@wideset/react'
group: actions
status: stable
parts: [ActionTile, ActionTileEntity, ActionTileTitle, ActionTileDescription, ActionTileIcon]
related: [Tile, LinkButton, Button]
docs: https://wideset.co/components/action-tile
storybook: components-tile-actiontile--default
---

# ActionTile

> A tile-shaped entry point to an action or a destination: badge, title, description, arrow.

## When to use

- Settings and navigation lists: "Billing details", "Notifications", "Invite your team".
- Setup or onboarding steps, each opening its own flow.

## When not to use

- A tile that only presents information, or one the user selects → `Tile` (`TileCheckbox`,
  `TileRadio`).
- A single inline route → `LinkButton`.
- A single action without a description → `Button`.

## Anatomy

Shorthand props (most cases):

```tsx
<ActionTile
  entity={RiBankCardLine} // badge before the text
  title="Billing details"
  description="Update your card and invoice address"
  icon={RiArrowRightLine} // trailing arrow
  href="/settings/billing" // or onClick={openBilling}
/>
```

Composed by hand, when shorthand is not enough:

```tsx
<ActionTile onClick={openIssue}>
  <ActionTile.Entity icon={RiBugLine} />
  <div className="gap-ws-3 flex flex-1 flex-col">
    <ActionTile.Title>Report an issue</ActionTile.Title>
    <ActionTile.Description>Tell us what went wrong</ActionTile.Description>
  </div>
  <ActionTile.Icon className="ml-auto" icon={RiArrowRightLine} />
</ActionTile>
```

The rendered element follows the props: `href` → `<a>`; `onClick` or `type` → `<button>`;
`asChild` → your element; none → a plain `div` (decorative, not a tab stop).

## Choosing props

| Prop      | Value              | Use for                                                       |
| --------- | ------------------ | ------------------------------------------------------------- |
| `variant` | `border` (default) | Tiles on a plain page background.                             |
|           | `filled`           | Tiles inside a card or panel that already has a border.       |
| `href`    | URL                | Navigates; renders a real link (`target`, `rel` accepted).    |
| `onClick` | function           | Acts in place; renders a button.                              |
| `type`    | `submit` / `reset` | A form tile; renders a button without needing `onClick`.      |
| `asChild` | `true`             | A router link carries the tile styling.                       |
| `entity`  | Remix icon         | What the tile is about.                                       |
| `icon`    | `RiArrowRightLine` | The tile goes somewhere. Drop it when the tile acts in place. |

## States

- Hover, press and focus are built in for interactive tiles.
- `disabled` hides the arrow and takes the tile out of the tab order: a button gets native
  `disabled`, a link gets `aria-disabled` and stops navigating. Say nearby why it is unavailable.

## Content

- Title: the destination or task, short, sentence case. Description: one line of what happens.
- One `variant` per list.

## Accessibility

- The whole tile is the control; badge and arrow are decorative and hidden from screen readers,
  so the title must make sense alone.
- Do not put buttons or links inside a tile; it is already one control.

## Do / Don't

```tsx
// Do: router link through asChild
<ActionTile asChild>
  <a href="/settings">…composed parts…</a> {/* or your router's link element */}
</ActionTile>

// Don't: a nested button for the arrow
<ActionTile title="Billing"><IconButton icon={RiArrowRightLine} aria-label="Open" /></ActionTile>

```

## Gotchas

- With `asChild`, shorthand props (`title`, `description`, `entity`, `icon`) are ignored; compose
  the parts inside your element.
- When composing by hand, wrap Title and Description in your own column as shown; shorthand adds
  that wrapper for you.
- `href` and `type` cannot be combined (the types forbid it).
- The tile is `w-full`; size it with its container or `className`.

## API

Full props: `https://wideset.co/components/action-tile.md` · Types:
`packages/design-system/src/components/action-tile/ActionTile.types.ts`
