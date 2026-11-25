---
name: Pagination
import: import { Pagination } from '@wideset/react'
group: navigation
status: stable
parts: [Pagination, PaginationNumbers, PaginationOverflow, PaginationRowsPerPage]
related: [Table]
docs: https://wideset.co/components/pagination
storybook: components-pagination--default
---

# Pagination

> Move through a collection that is already split into pages, one page at a time.

## When to use

- Below a `Table` or a result list whose data is fetched or sliced per page.
- When users need to reach a specific page or change how many rows a page shows.

## When not to use

- Steps of a flow that must be done in order → `ProgressStepper`.
- Switching between sections of a page → `Tabs`.
- Fewer items than one page holds: render no pagination at all.

## Anatomy

Usually one element; the root renders the controls for you:

```tsx
<Pagination
  pagesCount={20}
  activePage={page}
  onChangeActivePage={setPage}
  rowsPerPageOptions={[10, 25, 50]}
  itemsPerPage={perPage}
  onChangeItemsPerPage={(next) => {
    setPerPage(next);
    setPage(1);
  }}
/>
```

Compose only to reorder or restyle the pieces; pick `Numbers` or `Overflow`, never both:

```tsx
<Pagination pagesCount={20} rowsPerPageOptions={[10, 25, 50]}>
  <Pagination.RowsPerPage />
  <Pagination.Numbers />
</Pagination>
```

## Choosing props

| Prop                 | Value               | Use for                                                                 |
| -------------------- | ------------------- | ----------------------------------------------------------------------- |
| `type`               | `numbers` (default) | Page buttons plus an ellipsis menu; jump to a nearby page in one click. |
|                      | `overflow`          | Prev, page select, Next; constant width for long sets and narrow bars.  |
| `maxVisiblePages`    | number (default 7)  | How many numbered buttons `numbers` shows before folding into ellipses. |
| `rowsPerPageOptions` | `number[]`          | Shows the rows-per-page select. Default `false` hides it.               |
| `pagesCount`         | number ≥ 1          | Total pages. Defaults to 1, so always pass it; below 1 it throws.       |

State: `activePage` + `onChangeActivePage` (controlled) or `defaultActivePage`; rows per page:
`itemsPerPage` + `onChangeItemsPerPage` or `defaultItemsPerPage` (default 10).

## States

- First page disables Prev; last page disables Next.
- Out-of-range pages are clamped to `1…pagesCount`.

## Content

- Visible strings default to English: `rowsPerPageLabel` ("Rows per page"), `prevLabel`,
  `nextLabel`, `ofLabel`. Translate them through these props.
- Screen-reader strings: `navigationAriaLabel`, `prevPageAriaLabel`, `nextPageAriaLabel`,
  `selectPageAriaLabel(from, to)`. Translate them too.

## Accessibility

- The root is a `nav` landmark labelled by `navigationAriaLabel`; give it a specific label when
  a page has more than one ("Invoices pages").
- The current page carries `aria-current="page"`; arrow buttons have their own names.

## Do / Don't

- Do reset to page 1 in `onChangeItemsPerPage`; Pagination does not do it for you.
- Do recompute `pagesCount` when the page size or the data changes.
- Don't put `Pagination.Numbers` and `Pagination.Overflow` in the same bar.
- Don't render Pagination for a single page of results.

## Gotchas

- Callbacks are `onChangeActivePage` and `onChangeItemsPerPage`, not `onValueChange` or
  `onPageChange`, and they receive numbers.
- `Pagination.RowsPerPage` renders nothing unless `rowsPerPageOptions` is set on the root or
  `options` on the part.
- Pagination does not slice data; it only reports the page. Fetch or slice yourself.
- Parts throw outside `<Pagination>`.

## API

Full props: `https://wideset.co/components/pagination.md` · Types:
`packages/design-system/src/components/pagination/Pagination.types.ts`
