---
'@wideset/react': minor
---

FormField: the label's info tooltip opens from a real `<button>` next to the `<label>` (named by `tooltipAriaLabel`, "More information" by default), the required asterisk is decorative (`aria-hidden`), and `suffix` sits inside the label, so "(optional)" is part of the control's accessible name. Inside the package the label is now a compound: `FieldLabel` is the `<label>` (forwarding its `ref`) and takes `required`, with `FieldLabel.RequiredIndicator` (the asterisk, shown only when the label is `required`) and `FieldLabel.Suffix` inside it, and `FieldLabel.Tooltip` and `FieldLabel.Aside` as siblings the parent lays out. Every part carries a `data-slot` (`field-label`, `field-label-required-indicator`, `field-label-suffix`, `field-label-tooltip`, `field-label-aside`).

**Breaking:** the tooltip trigger was a focusable `<svg>`; tests or styles that targeted `svg[tabindex]` or `[aria-label="More information"]` on the icon should target `button[data-slot=field-label-tooltip]` (`getByRole('button', { name: 'More information' })`). A control's accessible name no longer ends with `*` when `required` is set. In FormField, `[data-slot=field-label]` now matches the `<label>` itself, not the row around it; the row is `[data-slot=form-field-label-row]`. ProgressBar and Tile.RadioGroup render the same label: in ProgressBar the two `<div>`s around the `<label>` are gone and `data-slot="field-label"` moves from the outer `<div>` to the `<label>`; in Tile.RadioGroup the group's accessible name (via `aria-labelledby`) loses the trailing `*` when `required` is set. If you scaffolded with the registry, `field-label` installs its new part files; `npx wideset add form-field --overwrite` refreshes both. The `suffix`, `tooltip`, `tooltipAriaLabel`, `aside` and `description` props of your local `FieldLabel` are gone, and `required` no longer draws the asterisk on its own: place `FieldLabel.RequiredIndicator`. Move to the parts:

```tsx
// before
<FieldLabel tooltip="Help" aside="0/100" suffix="(optional)" required>Email</FieldLabel>

// after
<div className="gap-ws-3 flex items-start">
  <FieldLabel required>
    Email <FieldLabel.RequiredIndicator /> <FieldLabel.Suffix>(optional)</FieldLabel.Suffix>
  </FieldLabel>
  <FieldLabel.Tooltip>Help</FieldLabel.Tooltip>
  <FieldLabel.Aside>0/100</FieldLabel.Aside>
</div>
```
