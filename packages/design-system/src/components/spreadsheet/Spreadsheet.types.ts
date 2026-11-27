import type { RemixiconComponentType } from '@remixicon/react';
import type { VariantProps } from 'class-variance-authority';
import type {
  ButtonHTMLAttributes,
  ForwardRefExoticComponent,
  HTMLAttributes,
  RefAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from 'react';

import type { RemixiconProps } from '../../types/icon.types';
import type { spreadsheetCellVariants } from './Spreadsheet.variants';
import type { SpreadsheetBody } from './SpreadsheetBody';
import type { SpreadsheetCell } from './SpreadsheetCell';
import type { SpreadsheetColumnHeader } from './SpreadsheetColumnHeader';
import type { SpreadsheetColumnHeaderIcon } from './SpreadsheetColumnHeaderIcon';
import type { SpreadsheetColumnHeaderTrigger } from './SpreadsheetColumnHeaderTrigger';
import type { SpreadsheetHead } from './SpreadsheetHead';
import type { SpreadsheetRow } from './SpreadsheetRow';
import type { SpreadsheetRowHeader } from './SpreadsheetRowHeader';

export type SpreadsheetSize = NonNullable<VariantProps<typeof spreadsheetCellVariants>['size']>;

/** Horizontal alignment of a cell's content. */
export type SpreadsheetAlign = NonNullable<VariantProps<typeof spreadsheetCellVariants>['align']>;

/**
 * A dense grid of cells the user moves through one cell at a time, as in a spreadsheet.
 *
 * Attributes and `ref` go to the scroll container (size it with `className`); `aria-label`,
 * `aria-labelledby` and `aria-describedby` name the grid itself, the inner `<table role="grid">`.
 */
export type SpreadsheetProps = HTMLAttributes<HTMLDivElement> &
  Pick<VariantProps<typeof spreadsheetCellVariants>, 'size'> & {
    /**
     * How many leading columns stay in place while the grid scrolls sideways. `1` pins the row
     * header column; raise it to keep a name column in view too, `0` pins none. The header row
     * always stays in place while the grid scrolls down.
     * @default 1
     */
    stickyColumns?: number;
  };

/** The head of the grid: the column header row, and any row you add under it. */
export type SpreadsheetHeadProps = HTMLAttributes<HTMLTableSectionElement>;

/** The body of the grid: one `Spreadsheet.Row` per record. */
export type SpreadsheetBodyProps = HTMLAttributes<HTMLTableSectionElement>;

/** A row of cells. */
export type SpreadsheetRowProps = HTMLAttributes<HTMLTableRowElement>;

/** A column header cell (`<th scope="col">`): type icon, label and column menu trigger. */
export type SpreadsheetColumnHeaderProps = ThHTMLAttributes<HTMLTableCellElement> & {
  /**
   * Horizontal alignment of the header content.
   * @default 'left'
   */
  align?: SpreadsheetAlign;
  /**
   * The direction the grid is sorted by this column; sets `aria-sort`. `null` marks a column
   * that can be sorted but is not; leave it out on columns that cannot be sorted. The grid
   * does not sort: change the order of your rows.
   */
  sortDirection?: 'asc' | 'desc' | null;
};

/** The type icon before a column header's label. */
export type SpreadsheetColumnHeaderIconProps = RemixiconProps & {
  /** Icon component from `@remixicon/react` that names the column's data type. */
  icon: RemixiconComponentType;
};

/**
 * The chevron after a column header's label: a button that opens the column's menu. Wrap it in
 * `DropdownMenu.Trigger asChild`.
 */
export type SpreadsheetColumnHeaderTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Names the button for screen readers, e.g. "Customers options". */
  'aria-label': string;
};

/** A row header cell (`<th scope="row">`), the row's number. */
export type SpreadsheetRowHeaderProps = ThHTMLAttributes<HTMLTableCellElement> & {
  /**
   * Horizontal alignment of the content.
   * @default 'center'
   */
  align?: SpreadsheetAlign;
};

/**
 * A data cell. Its content is composition: text, or a library component (`Tag`, `StatusBadge`,
 * `Checkbox`, `Avatar` and a name …) sized for the grid. Text and mixed content stay on one line
 * and end in an ellipsis when the column is narrower.
 */
export type SpreadsheetCellProps = TdHTMLAttributes<HTMLTableCellElement> & {
  /**
   * Horizontal alignment of the content. Right-align numbers and amounts.
   * @default 'left'
   */
  align?: SpreadsheetAlign;
};

export type SpreadsheetWithSubComponents = ForwardRefExoticComponent<
  SpreadsheetProps & RefAttributes<HTMLDivElement>
> & {
  Body: typeof SpreadsheetBody;
  Cell: typeof SpreadsheetCell;
  ColumnHeader: typeof SpreadsheetColumnHeader;
  ColumnHeaderIcon: typeof SpreadsheetColumnHeaderIcon;
  ColumnHeaderTrigger: typeof SpreadsheetColumnHeaderTrigger;
  Head: typeof SpreadsheetHead;
  Row: typeof SpreadsheetRow;
  RowHeader: typeof SpreadsheetRowHeader;
};
