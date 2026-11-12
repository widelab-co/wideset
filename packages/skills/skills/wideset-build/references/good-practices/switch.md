# Switch

## When to use

- Settings pages and panels where each change applies immediately: notifications, feature
  toggles, visibility.
- Turning a single feature on or off in a toolbar or table row.

## When not to use

- A choice submitted later with a form (consent, opt-in) → `Checkbox`.
- More than two states, or two named modes ("List" / "Board") → `SegmentedControl`.
- A switch look inside a selectable tile → `Tile.Indicator` in `Tile.Checkbox`, never a real
  `Switch`.

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
