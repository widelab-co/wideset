---
name: ScrollArea
import: import { ScrollArea } from '@wideset/react'
group: layout
status: stable
parts: [ScrollArea]
related: [Card, Modal, Sidepanel, Sidebar, Table, Textarea]
docs: https://wideset-docs.widelab.workers.dev/components/scroll-area
storybook: components-scrollarea--default
---

# ScrollArea

> A region that keeps its size and scrolls its content behind Wideset's thin overlay scrollbar.

## When to use

- Any region inside a screen that must keep its size and scroll: a panel body, a list that
  fills the height left by a header and footer, a feed in a fixed-height card.
- A list in a popover or panel you compose yourself, capped with `max-h-*`.
- A row wider than its container (cards, a timeline) → `orientation="horizontal"`; a wide table
  in a fixed height → `orientation="both"` with the table's `stickyHeader` / `stickyColumn`.
- The main area of an app shell, beside the `Sidebar`.

## When not to use

- Inside `Modal.Body`, `Sidepanel.Content`, `Popup.Content`, `Card.Content` or a `scrollable`
  `Sidebar.Section`, or around the list of `Select`, `MultiSelect`, `ComboBox` or
  `FilterButton`: they already scroll this way → add nothing.
- The page itself, a `textarea`, or any element you cannot wrap → the `wds-scrollbar` class,
  which gives its native bar the same look.
- Content that can simply grow while the page scrolls → no ScrollArea; a second scroll inside a
  scrolling page is one more thing to manage.
- Thousands of rows → `Pagination`, or a virtualiser inside the area with the `ref` (the
  viewport) as its scroll element.

## Anatomy

```tsx
<ScrollArea className="h-[16rem]">
  <ul className="p-ws-9 gap-ws-9 flex flex-col">…</ul>
</ScrollArea>
```

One element you size; the bar is drawn inside it, over the content's edge.

## Choosing props

| Prop                  | Value                | Use for                                                                                                                          |
| --------------------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `orientation`         | `vertical` (default) | Lists, text, panels. Children can `truncate`.                                                                                    |
|                       | `horizontal`         | A row wider than its container.                                                                                                  |
|                       | `both`               | A wide table in a fixed height.                                                                                                  |
| `scrollbarVisibility` | `hover` (default)    | Most regions: the bar shows while the pointer is over the area or it scrolls.                                                    |
|                       | `scroll`             | Quiet surfaces where the cut-off content already says there is more.                                                             |
|                       | `auto` / `always`    | A short region people must see scrolls at a glance, such as terms above an Accept button.                                        |
|                       | `never`              | A collapsed rail; the wheel, touch and keyboard still scroll.                                                                    |
| `scrollbarGutter`     | `true`               | Content that runs to the edge and whose end matters (right-aligned amounts, row actions), or that lines up with parts beside it. |

## Accessibility

- When the content overflows and holds nothing to tab to, the area itself becomes a tab stop
  with a focus ring, so the arrow, Page, Home, End and Space keys scroll it. Content with links or
  fields adds no extra stop: tabbing to them scrolls them into view.
- A list that keeps focus elsewhere (`aria-activedescendant` on a field) passes `tabIndex={-1}`.
- Pressing the bar keeps focus where it is, like a native scrollbar.

## Do / Don't

```tsx
// Do: size the area, pad what is inside it
<div className="flex h-full flex-col">
  <header className="p-ws-12">…</header>
  <ScrollArea className="min-h-0 flex-1">
    <div className="p-ws-12">…</div>
  </ScrollArea>
</div>

// Don't: a bare scroll container
<div className="max-h-[24rem] overflow-y-auto">…</div>

// Don't: padding on the area: the content is cut off short of its edge
<ScrollArea className="p-ws-12 h-[24rem]">…</ScrollArea>
```

- Don't wrap a component that already scrolls (the list above): two bars, two scroll positions.
- Don't use `wds-scrollbar` where you can wrap: it is a native bar that takes its own width and
  never hides.

## Gotchas

- Size the root: `h-*`, `max-h-*`, or `min-h-0 flex-1` in a flex column. Without `min-h-0` a flex
  child never shrinks below its content, so the parent grows and nothing scrolls.
- Layout classes on `ScrollArea` (`flex`, `gap-*`, `p-*`) do not reach the children; wrap them
  in your own element.
- `ref` is the viewport, the element that scrolls (`scrollTo`, an IntersectionObserver root, a
  virtualiser), not the root.
- The bar floats over the content's edge. Padded content absorbs it; content flush with the edge
  needs `scrollbarGutter`.
- In a right-to-left page pass `dir="rtl"` (or wrap the app in Radix's `DirectionProvider`);
  without it the area lays its content out left to right.
- The page has no ScrollArea: put `wds-scrollbar` on `<html>` for its bar, or make the main area
  of an app shell a ScrollArea.

## API

Full props: `https://wideset-docs.widelab.workers.dev/components/scroll-area.md` · Types:
`packages/design-system/src/components/scroll-area/ScrollArea.types.ts`
