# Responsive layout

Wideset ships no layout components, and its components have no built-in responsive behaviour.
Responsiveness is your layout, written with Tailwind variants and `ws` spacing. Which widths the
breakpoint tokens and Tailwind's variants stand for: [breakpoints](breakpoints.md).

## Approach

- Build small to large: base classes for the phone, `md:` and `lg:` for what changes. These are
  Tailwind's own widths (768px and 1024px), which is fine as long as you do not assume they equal
  the `--ws-breakpoints-*` tokens.
- Change layout at breakpoints and let content flow between them (`flex-wrap`, `min-w-0`,
  `max-w-*`).
- Change structure, not only size: a sidebar becomes a drawer, a table row becomes a stacked item.
- Test at 360, 768 and 1280 px, with long content.

```tsx
import type { ReactNode } from 'react';

export function Columns({ main, aside }: { main: ReactNode; aside: ReactNode }) {
  return (
    <div className="gap-ws-12 flex flex-col lg:flex-row">
      <div className="min-w-0 flex-1">{main}</div>
      <aside className="lg:w-[20rem]">{aside}</aside>
    </div>
  );
}
```

## Navigation

| Width        | Shell                                                                                  |
| ------------ | -------------------------------------------------------------------------------------- |
| Under `md`   | One column; the same items open in a left `Sidepanel` from a top bar (`NavigationBar`) |
| `md` to `lg` | `Sidebar` with `collapsed`, so items show their icons only                             |
| `lg` and up  | The full `Sidebar`                                                                     |

Keep the items in one array so both forms stay in step, and close the panel on navigation. Under
`md`, open `Sidepanel side="left"` from the menu `IconButton` (with `aria-label`) in
`NavigationBar.Start`. `Sidebar` has no drawer mode of its own: drive `collapsed` /
`onCollapsedChange` from your layout code. A product whose links sit in a `NavigationBar` hides
`NavigationBar.Nav` under `md` (`hidden md:flex`) and opens the same links from that menu button.

## Tables

Pick by what people do with the data.

- **A few columns.** Wrap the `Table` in a container with `overflow-x-auto`, and use
  `stickyColumn` for the identifier column. The page itself never scrolls sideways.
- **Many columns, few that matter.** Hide the secondary columns under `md`.
- **Read as records.** Under `md`, render a list of `ListItem` or `Card` instead.

## Forms and overlays

- Forms stay one column. Controls fill the width on small screens (`w-full md:w-[20rem]`).
- Footer actions stack on phones, primary on top, and sit side by side from `sm`.
- `Modal` and `Sidepanel` adapt in width; keep their content short enough to scroll. A long form
  on a phone is a page, not an overlay.
- `Popup` and `DropdownMenu` reposition themselves. Do not put tall content in them.

## Touch

- A touch target is at least 44 by 44 px. Only `size="lg"` controls (3rem) reach it; `md`
  (2.5rem) and smaller, and `IconButton`s, fall short. Use `lg` on touch layouts or space the
  targets apart (at least `gap-ws-5`).
- Hover does not exist. Row actions hidden until hover must be visible, and `Tooltip` content must
  not be the only copy.
- Set `type` and `inputMode` on inputs for the right keyboard.

## Content

- `min-w-0` on flex children, and `truncate` or `break-words` on anything of unknown length
  (names, emails, ids).
- Titles shrink one level on small screens instead of wrapping over five lines.
- Scale the page gutter: `px-ws-9 lg:px-ws-16`.
- Fixed bars on phones respect the safe area: `pb-[env(safe-area-inset-bottom)]`.

## Checklist

- No horizontal scroll on the page at 360 px.
- Navigation reachable at every width.
- Tables usable, not just shrunk.
- Touch targets at least 44 px.
- Nothing important relies on hover.
- Long names and empty values do not break the layout.
