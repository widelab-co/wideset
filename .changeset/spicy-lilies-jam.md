---
'@wideset/react': minor
---

Chip: add optional Action, Label, and IconButton parts for independent main and removal actions; make the root a passive container.

**Breaking:** Chip no longer supplies a button role, a tab stop, or keyboard activation on its root. Move main-action handlers and button-specific accessibility props to `Chip.Action`, and wrap the text in `Chip.Label`. Place a decorative leading `Chip.Icon` inside Action when present. For removal, use a sibling `Chip.IconButton` with an accessible name and a consumer-provided handler; Chip does not remove itself or manage selection.

```tsx
// Before
<Chip onClick={applyFilter}>
  <Chip.Icon icon={RiMapPinLine} />
  Warsaw
</Chip>

// After: main action with optional independent removal
<Chip>
  <Chip.Action onClick={applyFilter}>
    <Chip.Icon icon={RiMapPinLine} />
    <Chip.Label>Warsaw</Chip.Label>
  </Chip.Action>
  <Chip.IconButton aria-label="Remove Warsaw" onClick={removeFilter} />
</Chip>
```

For removal-only chips, omit Action and place Icon and Label directly inside Chip. Both buttons use native Enter/Space activation and default to `type="button"`. Root `disabled` and motion settings apply to both buttons. The root ref remains `HTMLDivElement`; use the Action or IconButton ref to focus a button. The new parts are also available as named exports: `ChipAction`, `ChipLabel`, and `ChipIconButton`.
