---
name: Switch
import: import { Switch } from '@wideset/react'
group: selection
status: stable
parts: [Switch, SwitchLabel, SwitchDescription]
related: [Checkbox, SegmentedControl, TileIndicator]
docs: https://wideset.co/components/switch
storybook: components-switch--default
---

# Switch

> A binary setting that takes effect the moment it flips, with no save step.

## When to use

- Settings pages and panels where each change applies immediately: notifications, feature
  toggles, visibility.
- Turning a single feature on or off in a toolbar or table row.

## When not to use

- A choice submitted later with a form (consent, opt-in) → `Checkbox`.
- More than two states, or two named modes ("List" / "Board") → `SegmentedControl`.
- A switch look inside a selectable tile → `Tile.Indicator` in `Tile.Checkbox`, never a real
  `Switch`.

## Anatomy

```tsx
// Shorthand
<Switch label="Email notifications" defaultChecked />

// Composed
<Switch defaultChecked>
  <Switch.Label>Email notifications</Switch.Label>
  <Switch.Description>One summary a day, at 9:00.</Switch.Description>
</Switch>
```

`Switch.Label` and `SwitchLabel` are the same component, as are `Switch.Description` and
`SwitchDescription`.

## Choosing props

| Prop                         | Value                        | Use for                                                   |
| ---------------------------- | ---------------------------- | --------------------------------------------------------- |
| `size`                       | `lg` (default)               | settings pages and forms                                  |
|                              | `sm`                         | dense places: table rows, toolbars, side panels           |
| `labelPosition`              | `right` (default)            | inline in a form                                          |
|                              | `left`                       | settings lists: labels on one edge, switches on the other |
| `checked` / `defaultChecked` | `boolean`                    | controlled / uncontrolled                                 |
| `onCheckedChange`            | `(checked: boolean) => void` | apply the setting here                                    |

Keep one size within a list of switches.

## States

- Off, on, disabled off, disabled on. Hover, press and keyboard focus are built in.
- A disabled switch leaves the tab order; say near it why it is locked.
- If applying the setting can fail, flip it back in `onCheckedChange` and tell the user why.

## Content

- The label names the setting, not the action: "Email notifications", not "Turn on email
  notifications".
- Don't write "On"/"Off" in the label; the switch shows the state.

## Accessibility

- Space or Enter toggles it; it is announced as a switch, on or off.
- Without a visible label, pass `aria-label`.
- With `label`, the whole row is the click target.

## Do / Don't

```tsx
// Do: apply immediately
<Switch
  label="Email notifications"
  checked={settings.email}
  onCheckedChange={(email) => saveSettings({ ...settings, email })}
/>
```

```tsx
// Don't: a switch behind a Save button
<Switch label="Accept the terms" />
<Button>Save</Button>
// Do
<Checkbox label="I accept the terms" />
```

## Gotchas

- `className`, `ref` and the remaining props all land on the switch control (`button` with
  `role="switch"`), as in `Checkbox`. Style the row around the switch and its label with
  `wrapperClassName`.
- `label` and children are mutually exclusive; the types reject passing both.
- There is no `variant` and no `description` prop. Supporting text is `Switch.Description` in the
  composed children; it becomes the switch's `aria-describedby`.
- `Switch.Label` throws outside a `Switch`; it takes `htmlFor` from it.
- DOM hooks: `data-slot="switch"`, `"switch-label"`, `"switch-description"`.

## API

Full props: `https://wideset.co/components/switch.md` · Types:
`packages/design-system/src/components/switch/Switch.types.ts`
