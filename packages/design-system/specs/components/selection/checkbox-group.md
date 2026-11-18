---
name: CheckboxGroup
import: import { Checkbox, CheckboxGroup } from '@wideset/react'
group: selection
status: stable
parts: [CheckboxGroup]
related: [Checkbox, RadioButtonGroup, MultiSelect, FormField]
docs: https://wideset.co/components/checkbox-group
storybook: components-checkbox-checkboxgroup--default
---

# CheckboxGroup

> A layout wrapper that lines up related checkboxes with consistent spacing and names them as one group.

## When to use

- Several related, independent options under one heading: notification channels, permissions,
  features to include.

## When not to use

- Only one option may be picked → `RadioButtonGroup`.
- A single checkbox → `Checkbox` on its own.
- A long list that would not fit on screen → `MultiSelect`.
- Options that need an icon and a title as a large target → `Tile.Checkbox` in a grid.

## Anatomy

```tsx
<FormField label="Notify me by" id="notify-label">
  <CheckboxGroup aria-labelledby="notify-label">
    <Checkbox label="Email" description="A daily digest at 8:00" defaultChecked />
    <Checkbox label="Push" description="Mentions and replies only" defaultChecked />
    <Checkbox label="SMS" description="Security alerts only" />
  </CheckboxGroup>
</FormField>
```

`Checkbox.Group` is the same component as `CheckboxGroup`.

## Choosing props

| Prop          | Value                | Use for                                        |
| ------------- | -------------------- | ---------------------------------------------- |
| `orientation` | `vertical` (default) | any length of label, labels with descriptions  |
|               | `horizontal`         | two or three short labels with no descriptions |

## States

The group has no state of its own. Selection, disabled and invalid states live on each `Checkbox`.

## Content

- The group heading names the set ("Notify me by"); each label names one option, in sentence case.

## Accessibility

- The group already renders `role="group"`. Name it with `aria-labelledby` pointing at the visible
  heading, or `aria-label` when there is none.
- Each checkbox is its own tab stop and toggles with Space; orientation does not change that.

## Do / Don't

```tsx
// Do: collect the selection yourself, one handler per option
const [channels, setChannels] = useState<string[]>(['email']);
const toggle = (value: string) => (checked: boolean | 'indeterminate') =>
  setChannels((prev) => (checked === true ? [...prev, value] : prev.filter((v) => v !== value)));

<CheckboxGroup aria-label="Notification channels">
  <Checkbox label="Email" checked={channels.includes('email')} onCheckedChange={toggle('email')} />
  <Checkbox label="SMS" checked={channels.includes('sms')} onCheckedChange={toggle('sms')} />
</CheckboxGroup>;
```

```tsx
// Don't: expect the group to own the value
<CheckboxGroup value={channels} onValueChange={setChannels}>
  …
</CheckboxGroup>
```

- Don't go horizontal with descriptions or long labels; the row wraps unpredictably.

## Gotchas

- There is no `value`, `onValueChange`, `name` or `disabled` on the group. Set them on each
  `Checkbox` (`name` and `value` come from the checkbox primitive).
- Adding `role="group"` yourself is redundant; only the name is missing by default.
- DOM hook: `data-slot="checkbox-group"`.

## API

Full props: `https://wideset.co/components/checkbox-group.md` · Types:
`packages/design-system/src/components/checkbox/Checkbox.types.ts`
