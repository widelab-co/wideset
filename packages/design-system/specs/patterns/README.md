# Patterns

Recurring screens and flows built from Wideset components. Wideset has no page, template,
grid or stack components: beyond `Sidebar` (navigation), `Sidepanel` (overlay panel) and `Card`
(bounded surface), structure is plain HTML elements with Tailwind layout classes and `ws`
tokens (`flex`, `grid`, `gap-ws-*`, `p-ws-*`, `bg-ws-static-background`, `typography-*`).
Every example here uses only real exports and props; copy the structure, not the copy.

| Pattern                                                | Use it for                                                                              |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| [App shell](app-shell.md)                              | The frame: `Sidebar` beside a scrolling `main`, one `ToastProvider`.                    |
| [Form page](form-page.md)                              | `FormField`s around inputs, field errors, save failure, submit and cancel.              |
| [List with search and filters](list-and-filters.md)    | `Table` + search `TextInput` + `FilterButton` + `Pagination`, empty and loading states. |
| [Dense data](dense-data.md)                            | Spreadsheet-like screens: `Spreadsheet` vs `Table` vs `ListItem`, density, numbers.     |
| [Detail in a side panel](detail-in-sidepanel.md)       | Open one row's detail in `Sidepanel`, act, return focus to the row.                     |
| [Confirm a destructive action](confirm-destructive.md) | `Modal` / `StatusModal` with a `danger` button, async-safe.                             |
| [Page feedback](page-feedback.md)                      | Choosing and placing `InlineAlert`, `SystemAlert`, `Toast`, `ProgressBar`.              |
| [Composition laws](composition.md)                     | Rules between components: state ownership, overlays, row actions, loading.              |

Shared rules:

- Space with `gap-ws-*` on the parent, not margins on children. Common steps: `gap-ws-5`
  between buttons, `gap-ws-9` inside a section, `gap-ws-11` between fields or cards,
  `gap-ws-12` between page sections; `p-ws-12` around page content.
- Never plain Tailwind scale classes (`p-4`, `gap-6`, `text-sm`) or palette colours; use the
  `ws` token or an arbitrary value (`w-[20rem]`).
- State (filters, selection, open panels, pages) is yours; components render it.
