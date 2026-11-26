import type { VariantProps } from 'class-variance-authority';

import type { cellVariants } from './Table.variants';

export type SelectionMode = 'single' | 'multiple';

export type TableContextType = Omit<VariantProps<typeof cellVariants>, 'header'> & {
  /** Indicates whether the table rows should have alternating background colors */
  striped?: boolean;
  /** Whether the header should be sticky */
  stickyHeader?: boolean;
  /**
   * Applies a solid background color to all cells.
   * Required for sticky header/column to appear correctly over scrolling content.
   * Automatically defaults to `true` when `stickyHeader` or `stickyColumn` is enabled.
   */
  hasBackground?: boolean;
  /** Enables row selection
   * - `single` — only one row can be selected at a time
   * - `multiple` — multiple rows can be selected
   */
  selectionMode?: SelectionMode;
};

/** Structured content arranged in rows and columns. */
export type TableProps = React.HTMLAttributes<HTMLTableElement> & TableContextType;

export type SortDirection = 'asc' | 'desc' | null;

/** Props shared by header and data cells. */
type TableCellBaseProps = {
  /** Horizontal alignment of the cell content. Overrides the table-level value. */
  align?: 'left' | 'center' | 'right';
  /** Removes horizontal padding. Overrides the table-level value. */
  flushMargin?: boolean;
  /**
   * Truncates overflowing content to a single line with an ellipsis. Overrides the table-level
   * value. Requires a constrained column width (`table-fixed` class on the table with `w-*`
   * classes on the headers, or a `max-w-*` class on the cell); without one, the forced
   * single line widens the column to the full text width and can overflow the container.
   */
  truncate?: boolean;
};

/** A column header cell (`<th>`), optionally sortable. */
export type TableHeaderProps = React.ThHTMLAttributes<HTMLTableCellElement> &
  TableCellBaseProps & {
    /** Makes the column sortable — renders a sort button and sets aria-sort on the th. */
    sortable?: boolean;
    /**
     * Current sort direction.
     * - `null` — sortable, not currently sorted
     * - `'asc'` — sorted ascending
     * - `'desc'` — sorted descending
     */
    sortDirection?: SortDirection;
    /** Called when the user clicks to sort. Required when sortable is true. */
    onSort?: () => void;
    /** Disables the sort interaction visually and functionally. Only applies when sortable is true. */
    disabled?: boolean;
    /** Accessible label for the sort button. When omitted, defaults to `` `Sort by ${column}` `` using the column's text content, or `'Sort by this column'` as a fallback. */
    sortAriaLabel?: string;
  };

/** A data row with an optional selected state. */
export type TableRowProps = React.HTMLAttributes<HTMLTableRowElement> & {
  /** Whether the row is in the selected state. */
  selected?: boolean;
};

/** A data cell with optional alignment and truncation. */
export type TableCellProps = React.TdHTMLAttributes<HTMLTableCellElement> &
  TableCellBaseProps & {
    /** Vertical alignment of the cell content. Overrides the table-level value. */
    placement?: 'top' | 'middle' | 'bottom';
  };

/** The table section containing column headings. */
export type TableHeadProps = React.HTMLAttributes<HTMLTableSectionElement>;

/** The table section containing the body rows. */
export type TableBodyProps = React.HTMLAttributes<HTMLTableSectionElement>;

/** The table section containing summary rows. */
export type TableFootProps = React.HTMLAttributes<HTMLTableSectionElement>;

/**
 * A second line under a cell's label, e.g. a project's summary under its name. Use it in `md`
 * and `lg` tables; an `sm` row has no room for two lines.
 */
export type TableCellDescriptionProps = React.HTMLAttributes<HTMLSpanElement>;
