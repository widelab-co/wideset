# Actions

Controls the user activates to do something or go somewhere: run an action, submit, navigate,
filter a list, act on a selection. `Button`, `IconButton` and `SplitButton` share one colour
(`variant`), emphasis (`preset`) and `size` system, defined once in the Button spec; the others
are specialised controls built on top of it.

## Pick the right one

- [Button](./button.md) — an action with a visible label; the default choice.
- [IconButton](./icon-button.md) — icon-only action in toolbars and dense rows; always with
  `aria-label`.
- [LinkButton](./link-button.md) — text-style navigation that keeps link semantics.
- [TextLink](./text-link.md) — a link inside a sentence; it takes the sentence's type.
- [SplitButton](./split-button.md) — one default action plus a menu of related alternatives.
- [FilterButton](./filter-button.md) — compact multi-select filter trigger for toolbars.
- [ActionBar](./action-bar.md) — floating bar of bulk actions while items are selected.
- [ActionTile](./action-tile.md) — tile-shaped entry point with badge, title, description and
  arrow, for settings lists and setup steps.

Close calls:

- Button vs LinkButton: going to another page is `LinkButton`, not a `Button` with navigation in
  `onClick`; running an action is `Button`.
- LinkButton vs TextLink: a standalone route is a `LinkButton`; a link inside running text is a
  `TextLink`, which keeps the text's size and weight.
- SplitButton vs two buttons: one main action plus alternatives is a `SplitButton`.
- ActionBar vs a hand-built toolbar: actions on selected rows are an `ActionBar`.
- DropdownMenu vs Select: a short list of commands is a `DropdownMenu` ([overlays](../overlays/README.md));
  picking a value is a `Select`.
- ActionTile vs Card: a large tile that starts a flow is an `ActionTile`, not a `Card` with
  `onClick`.
