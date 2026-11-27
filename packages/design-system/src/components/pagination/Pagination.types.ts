import type { ComponentProps, ComponentType } from 'react';

import type { MotionProps } from '../../motion/Motion.types';

export type PaginationType = 'numbers' | 'overflow';

/** Props for the `<nav>` root that wraps the page controls. */
export type PaginationProps = ComponentProps<'nav'> &
  MotionProps & {
    /** Controlled active page value. */
    activePage?: number;
    /** Initial active page in uncontrolled mode. */
    defaultActivePage?: number;
    /** Total pages available. Pass 0 to hide the page controls when there are no results. */
    pagesCount?: number;
    /** Returns a destination URL for each page. Page controls become links, and page selects navigate to the same URLs. */
    getPageHref?: (page: number) => string;
    /** Called when a page is selected in button mode. */
    onChangeActivePage?: (page: number) => void;
    /** Controlled rows-per-page value. */
    itemsPerPage?: number;
    /** Initial rows-per-page value in uncontrolled mode. */
    defaultItemsPerPage?: number;
    /** Called whenever the rows-per-page selection changes. */
    onChangeItemsPerPage?: (itemsPerPage: number) => void;
    /** Visible label shown before the rows-per-page select. */
    rowsPerPageLabel?: string;
    /** Visible previous button label in overflow mode. */
    prevLabel?: string;
    /** Visible next button label in overflow mode. */
    nextLabel?: string;
    /** Visible label shown before the total page count in overflow mode. */
    ofLabel?: string;
    /** Accessible label for the pagination nav element. Defaults to `'pagination'`. */
    navigationAriaLabel?: string;
    /** Accessible label for the previous-page button when it has no visible text. Defaults to `'Go to previous page'`. */
    prevPageAriaLabel?: string;
    /** Accessible label for the next-page button when it has no visible text. Defaults to `'Go to next page'`. */
    nextPageAriaLabel?: string;
    /** Returns the accessible label for the ellipsis page-range select. Receives the first and last hidden page numbers. Defaults to `` `Select page between ${from} and ${to}` ``. */
    selectPageAriaLabel?: (from: number, to: number) => string;
    /** Placeholder shown inside the ellipsis page-range select trigger. Defaults to `'...'`. */
    ellipsisPlaceholder?: string;
    /** Maximum number of numbered page buttons rendered around the current page. */
    maxVisiblePages?: number;
    /** Pagination layout variant. Use `numbers` for direct page buttons or `overflow` for compact navigation. */
    type?: PaginationType;
    /** Rows-per-page options. Pass `false` to hide the rows-per-page section entirely. */
    rowsPerPageOptions?: number[] | false;
  };

/** The control choosing how many rows appear on a page. */
export type PaginationRowsPerPageProps = ComponentProps<'div'> &
  MotionProps & {
    /** Optional override for the rows-per-page label. */
    label?: string;
    /** Optional override for the selectable rows-per-page options. */
    options?: number[];
  };

/** The page number controls. */
export type PaginationNumbersProps = ComponentProps<'div'> & MotionProps;

/** The compact previous and next page controls. */
export type PaginationOverflowProps = ComponentProps<'div'> &
  MotionProps & {
    /** Optional override for the previous button label. */
    prevLabel?: string;
    /** Optional override for the next button label. */
    nextLabel?: string;
    /** Optional override for the label shown before the total page count. */
    ofLabel?: string;
  };

export type PaginationContextValue = {
  localActivePage: number;
  pagesCount: number;
  getPageHref?: PaginationProps['getPageHref'];
  localItemsPerPage: number;
  rowsPerPageLabel: string;
  prevLabel: string;
  nextLabel: string;
  ofLabel: string;
  navigationAriaLabel: string;
  prevPageAriaLabel: string;
  nextPageAriaLabel: string;
  selectPageAriaLabel: (from: number, to: number) => string;
  ellipsisPlaceholder: string;
  maxVisiblePages: number;
  rowsPerPageOptions: number[];
  onChange: (value: number) => void;
  onItemsPerPageChange: (value: string) => void;
  motion: boolean;
};

export type PaginationWithSubComponents = ComponentType<PaginationProps> & {
  RowsPerPage: ComponentType<PaginationRowsPerPageProps>;
  Numbers: ComponentType<PaginationNumbersProps>;
  Overflow: ComponentType<PaginationOverflowProps>;
};
