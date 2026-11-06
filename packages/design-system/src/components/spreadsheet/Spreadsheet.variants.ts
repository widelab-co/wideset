import { cva } from 'class-variance-authority';
import { cn } from 'src/lib/utils';

/**
 * The scroll container. It takes the width it is given (`w-full`: a scroll container has no
 * width of its own to shrink to, so in a centring flex parent it would collapse). Its background
 * is the grid's surface: rows inherit it, and frozen cells repaint it so nothing shows through
 * them while the grid scrolls. `isolate` keeps the sticky layers' z-index inside the grid.
 */
export const SPREADSHEET_CLASS = 'bg-ws-static-container isolate w-full overflow-auto';

/**
 * `table-fixed` + `w-full`: columns keep the widths set on their column headers, a column
 * without one takes the rest, and the table grows past the container (and scrolls) when the
 * widths add up to more.
 */
export const SPREADSHEET_TABLE_CLASS =
  'w-full table-fixed border-separate border-spacing-0 bg-inherit tabular-nums';

/* Figma: Spreadsheet Cell (10590:65934). Every type shares one frame: Size=Small is 32px high
   with 8px sides, Size=Medium 40px with 12px, Body/Small text, a 1px Static/Stroke/Subtle line
   on the right and bottom. The fill is a translucent tint per State, held in
   `--spreadsheet-tint` so frozen cells can lay it over an opaque surface (an image layer)
   while the rest paint it as their background colour. */
export const spreadsheetCellVariants = cva(
  cn(
    'typography-body-sm text-ws-static-base truncate align-middle',
    // Grid lines: every cell draws its right and bottom edge, the first cell of a row its
    // left edge and the first head row its top edge, so every cell is boxed.
    'border-ws-static-subtle border-r border-b first:border-l [thead>tr:first-child>&]:border-t',
    'bg-(--spreadsheet-tint)',
    // Set by Spreadsheet on the cells of its pinned columns, with their `left` offset.
    'data-sticky:z-ws-mask data-sticky:sticky data-sticky:bg-inherit data-sticky:bg-[linear-gradient(var(--spreadsheet-tint),var(--spreadsheet-tint))]',
    // Selected=True: the active cell, in every state.
    'aria-selected:[--spreadsheet-tint:var(--ws-dynamic-fill-primary-alpha-strong-default)]',
    'aria-selected:hover:[--spreadsheet-tint:var(--ws-dynamic-fill-primary-alpha-strong-hover)]',
    'aria-selected:active:[--spreadsheet-tint:var(--ws-dynamic-fill-primary-alpha-strong-pressed)]',
    // Keyboard focus adds an inset ring to the selected tint (Figma draws no focus state).
    'outline-ws-dynamic-primary-strong-default focus-visible:outline-2 focus-visible:-outline-offset-2',
  ),
  {
    variants: {
      size: {
        sm: 'h-ws-14 px-ws-5',
        md: 'h-ws-16 px-ws-7',
      },
      /* Column headers sit on a 4% tint (Clients screen 13501:3173 sets the header row to
         Static/Fill/Alpha/Subtle; Tertiary/Alpha/Strong is the same value in light and dark),
         so their hover and pressed steps start from it. Every other cell is clear at rest. */
      header: {
        true: cn(
          '[--spreadsheet-tint:var(--ws-dynamic-fill-tertiary-alpha-strong-default)]',
          'hover:[--spreadsheet-tint:var(--ws-dynamic-fill-tertiary-alpha-strong-hover)]',
          'active:[--spreadsheet-tint:var(--ws-dynamic-fill-tertiary-alpha-strong-pressed)]',
        ),
        false: cn(
          '[--spreadsheet-tint:var(--ws-dynamic-fill-secondary-alpha-default)]',
          'hover:[--spreadsheet-tint:var(--ws-dynamic-fill-secondary-alpha-hover)]',
          'active:[--spreadsheet-tint:var(--ws-dynamic-fill-secondary-alpha-pressed)]',
        ),
      },
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
      },
    },
    defaultVariants: {
      size: 'sm',
      header: false,
      align: 'left',
    },
  },
);

/** The row a cell lays out mixed content in: Figma's auto layout, centred, 4px apart. */
export const spreadsheetCellContentVariants = cva('gap-ws-3 flex min-w-0 items-center', {
  variants: {
    align: {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
    },
  },
  defaultVariants: {
    align: 'left',
  },
});
