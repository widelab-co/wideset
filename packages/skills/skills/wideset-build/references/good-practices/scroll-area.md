# ScrollArea

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
