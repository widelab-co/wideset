---
name: Tile
import: import { Tile } from '@wideset/react'
group: selection
status: stable
parts:
  [
    Tile,
    TileCheckbox,
    TileRadioGroup,
    TileRadio,
    TileIcon,
    TileTitle,
    TileDescription,
    TileIndicator,
  ]
related: [ActionTile, Card, Checkbox, RadioButtonGroup]
docs: https://wideset.co/components/tile
storybook: components-tile-tile--default
---

# Tile

> A bordered block of comparable information that is either static or, as a whole, one selectable option.

## When to use

- A set of comparable options the user selects as large targets with an icon, title and
  description: plans, add-ons, integrations.
- Static summaries laid out as a set of equal blocks.

## When not to use

- The tile runs an action or opens a link → `ActionTile`.
- One piece of content with rich hierarchy and several actions → `Card`.
- Plain options with a label only → `Checkbox` or `RadioButton` in their groups.

## Anatomy

Pick the part by what the tile _is_:

| Part                                  | Renders                       | Use for            |
| ------------------------------------- | ----------------------------- | ------------------ |
| `Tile`                                | `div`, no role, no tab stop   | static content     |
| `Tile.Checkbox`                       | `role="checkbox"`             | multiple selection |
| `Tile.Radio` inside `Tile.RadioGroup` | `role="radio"` / `radiogroup` | single selection   |

```tsx
import { RiCloudLine, RiRocketLine, RiTeamLine } from '@remixicon/react';

// Static, shorthand
<Tile icon={RiTeamLine} title="Team" description="8 members" />

// Multiple selection: the whole tile is the checkbox
<Tile.Checkbox icon={RiCloudLine} title="Backups" description="Daily" defaultChecked>
  <Tile.Indicator />
</Tile.Checkbox>

// Single selection
<Tile.RadioGroup label="Plan" defaultValue="pro">
  <Tile.Radio value="starter" icon={RiCloudLine} title="Starter" description="3 projects">
    <Tile.Indicator />
  </Tile.Radio>
  <Tile.Radio value="pro" icon={RiRocketLine} title="Pro" description="Unlimited">
    <Tile.Indicator />
  </Tile.Radio>
</Tile.RadioGroup>

// Composed body, only when the shorthand is not enough: you own the layout
<Tile>
  <div className="gap-ws-3 flex flex-1 items-start">
    <Tile.Icon icon={RiTeamLine} />
    <div className="gap-ws-3 flex flex-1 flex-col">
      <Tile.Title>Team</Tile.Title>
      <Tile.Description>8 members</Tile.Description>
    </div>
  </div>
</Tile>
```

Every dot member has a named export (`TileCheckbox`, `TileRadioGroup`, `TileRadio`, `TileIcon`,
`TileTitle`, `TileDescription`, `TileIndicator`).

## Choosing props

Tile has no size or variant. The props that decide usage:

| Prop                                             | On                   | Use for                                              |
| ------------------------------------------------ | -------------------- | ---------------------------------------------------- |
| `icon`, `title`, `description`                   | all three tile kinds | the standard body; children render after it          |
| `checked` / `defaultChecked` / `onCheckedChange` | `Tile.Checkbox`      | its selection                                        |
| `value` / `defaultValue` / `onValueChange`       | `Tile.RadioGroup`    | the selected `Tile.Radio` `value`                    |
| `label`                                          | `Tile.RadioGroup`    | visible group label that also names the group        |
| `orientation`                                    | `Tile.RadioGroup`    | `vertical` (default) or `horizontal`                 |
| `asChild`                                        | `Tile`               | render the static tile as your own element (`li`, …) |

## States

- Selectable tiles: unselected, selected, hover, pressed, keyboard focus, disabled, disabled +
  selected. A disabled tile is skipped by Tab and keeps its selection visible.
- `Tile.Indicator` only mirrors the tile's state; it has none of its own.

## Content

- Title: a short noun ("Pro", "Backups"). Description: the one fact that tells options apart
  ("Unlimited projects"). Keep titles parallel across a set.

## Accessibility

- `Tile.Checkbox` is its own tab stop, toggled with Space. `Tile.RadioGroup` is one tab stop; the
  arrow keys move the selection.
- Name the radio group with `label`, `aria-label` or `aria-labelledby`; without it a screen reader
  hears only "radio group".
- For a set of `Tile.Checkbox`, wrap them in an element with `role="group"` and a name.

## Do / Don't

```tsx
// Don't: a real control inside a selectable tile (nested interactive)
<Tile.Checkbox title="Backups"><Switch /></Tile.Checkbox>
// Do
<Tile.Checkbox title="Backups"><Tile.Indicator /></Tile.Checkbox>
```

- Don't add `onClick` to a static `Tile` to make it act → `ActionTile`.
- Don't put links or buttons inside `Tile.Checkbox` or `Tile.Radio`; the tile is already a button.

## Gotchas

- `Tile` and `Tile.Icon` both take `icon` as a Remix icon component, not an element.
- Children of a tile sit in one row after the shorthand body. Composed `Tile.Title` and
  `Tile.Description` placed directly as children end up side by side; wrap them in one element, or
  use the shorthand props.
- `Tile.Radio` must sit inside `Tile.RadioGroup`; it fails without the group.
- Selectable tiles stretch to the width of their container; size them with your grid.
- `Tile.RadioGroup` mirrors `RadioButtonGroup`'s contract, so the two swap in a form.
- DOM hooks: `data-slot="tile"`, `"tile-checkbox"`, `"tile-radio-group"`, `"tile-radio"`,
  `"tile-body"`, `"tile-icon"`, `"tile-title"`, `"tile-description"`, `"tile-indicator"`.

## API

Full props: `https://wideset.co/components/tile.md` · Types:
`packages/design-system/src/components/tile/Tile.types.ts`
