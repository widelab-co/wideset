---
'@wlrx/design-system': minor
---

FormField: the label's info tooltip opens from a real `<button>` next to the `<label>` (named by `tooltipAriaLabel`, "More information" by default), the required asterisk is decorative (`aria-hidden`), and `suffix` sits inside the label, so "(optional)" is part of the control's accessible name. Inside the package the label is now a compound: `FieldLabel` is the `<label>` (forwarding its `ref`), with `FieldLabel.Suffix` inside it and `FieldLabel.Tooltip`, `FieldLabel.Aside` and `FieldLabel.Description` as siblings the parent lays out. Every part carries a `data-slot` (`field-label`, `field-label-required`, `field-label-suffix`, `field-label-tooltip`, `field-label-aside`, `field-label-description`).

**Breaking:** the tooltip trigger was a focusable `<svg>`; tests or styles that targeted `svg[tabindex]` or `[aria-label="More information"]` on the icon should target `button[data-slot=field-label-tooltip]` (`getByRole('button', { name: 'More information' })`). A control's accessible name no longer ends with "*" when `required` is set. If you scaffolded with the registry, `field-label` installs its new part files; `npx wideset add form-field --overwrite` refreshes both, and code that passed `tooltip`, `aside`, `description` or `tooltipAriaLabel` to your local `FieldLabel` directly moves to the parts:

```tsx
// before
<FieldLabel tooltip="Help" aside="0/100" description="Hint" required>Email</FieldLabel>

// after
<div className="gap-ws-3 flex flex-wrap items-center">
  <FieldLabel required>Email</FieldLabel>
  <FieldLabel.Tooltip>Help</FieldLabel.Tooltip>
  <FieldLabel.Aside>0/100</FieldLabel.Aside>
  <FieldLabel.Description>Hint</FieldLabel.Description>
</div>
```
