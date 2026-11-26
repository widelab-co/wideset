# ActionTile

## When to use

- Settings and navigation lists: "Billing details", "Notifications", "Invite your team".
- Setup or onboarding steps, each opening its own flow.

## When not to use

- A tile that only presents information, or one the user selects → `Tile` (`TileCheckbox`,
  `TileRadio`).
- A standalone text link → `LinkButton`. A link inside running text → `TextLink`.
- A single action without a description → `Button`.

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
