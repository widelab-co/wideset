import { useCallback, useEffect, useMemo, useState } from 'react';
import { cn } from 'src/lib/utils';

import { useDefaultMotion } from '../../motion/MotionProvider';
import { PaginationContext } from './Pagination.context';
import { clampPage } from './Pagination.logic';
import type { PaginationProps, PaginationWithSubComponents } from './Pagination.types';
import { PaginationNumbers } from './PaginationNumbers';
import { PaginationOverflow } from './PaginationOverflow';
import { PaginationRowsPerPage } from './PaginationRowsPerPage';

const Pagination = ({
  activePage,
  defaultActivePage = 1,
  pagesCount = 1,
  getPageHref,
  onChangeActivePage,
  itemsPerPage,
  defaultItemsPerPage = 10,
  onChangeItemsPerPage,
  rowsPerPageLabel = 'Rows per page',
  prevLabel = 'Prev',
  nextLabel = 'Next',
  ofLabel = 'of',
  navigationAriaLabel = 'pagination',
  prevPageAriaLabel = 'Go to previous page',
  nextPageAriaLabel = 'Go to next page',
  selectPageAriaLabel = (from, to) => `Select page between ${from} and ${to}`,
  ellipsisPlaceholder = '...',
  className,
  maxVisiblePages = 7,
  type = 'numbers',
  rowsPerPageOptions = false,
  defaultMotion,
  children,
  ...props
}: PaginationProps) => {
  if (pagesCount !== 0 && pagesCount < 1) {
    throw new Error('Pagination: `pagesCount` must be 0 or at least 1.');
  }

  const motion = useDefaultMotion(defaultMotion);
  const [localActivePage, setLocalActivePage] = useState(clampPage(defaultActivePage, pagesCount));
  const [localItemsPerPage, setLocalItemsPerPage] = useState(itemsPerPage ?? defaultItemsPerPage);
  const isControlled = activePage !== undefined;
  const currentPage = isControlled
    ? clampPage(activePage, pagesCount)
    : clampPage(localActivePage, pagesCount);

  const onChange = useCallback(
    (value: number) => {
      const newActivePage = clampPage(value, pagesCount);

      if (getPageHref) {
        globalThis.window?.location.assign(getPageHref(newActivePage));
        return;
      }

      if (!isControlled) {
        setLocalActivePage(newActivePage);
      }

      onChangeActivePage?.(newActivePage);
    },
    [getPageHref, isControlled, onChangeActivePage, pagesCount],
  );

  const onItemsPerPageChange = useCallback(
    (value: string) => {
      const newItemsPerPage = Number(value);

      if (Number.isNaN(newItemsPerPage)) return;

      setLocalItemsPerPage(newItemsPerPage);
      onChangeItemsPerPage?.(newItemsPerPage);
    },
    [onChangeItemsPerPage],
  );

  useEffect(() => {
    if (itemsPerPage !== undefined) {
      setLocalItemsPerPage(itemsPerPage);
    }
  }, [itemsPerPage]);

  const contextValue = useMemo(
    () => ({
      localActivePage: currentPage,
      pagesCount,
      getPageHref,
      localItemsPerPage,
      rowsPerPageLabel,
      prevLabel,
      nextLabel,
      ofLabel,
      navigationAriaLabel,
      prevPageAriaLabel,
      nextPageAriaLabel,
      selectPageAriaLabel,
      ellipsisPlaceholder,
      maxVisiblePages,
      rowsPerPageOptions: rowsPerPageOptions || [],
      onChange,
      onItemsPerPageChange,
      motion,
    }),
    [
      currentPage,
      pagesCount,
      getPageHref,
      localItemsPerPage,
      rowsPerPageLabel,
      prevLabel,
      nextLabel,
      ofLabel,
      navigationAriaLabel,
      prevPageAriaLabel,
      nextPageAriaLabel,
      selectPageAriaLabel,
      ellipsisPlaceholder,
      maxVisiblePages,
      rowsPerPageOptions,
      onChange,
      onItemsPerPageChange,
      motion,
    ],
  );

  if (pagesCount === 0 && children == null && !contextValue.rowsPerPageOptions.length) return null;

  return (
    <PaginationContext.Provider value={contextValue}>
      <nav
        role="navigation"
        aria-label={navigationAriaLabel}
        data-slot="pagination"
        className={cn(
          'flex items-center',
          rowsPerPageOptions ? 'justify-between' : 'justify-end',
          className,
        )}
        {...props}
      >
        {children ?? (
          <>
            {rowsPerPageOptions && <PaginationRowsPerPage />}
            {type === 'numbers' ? <PaginationNumbers /> : <PaginationOverflow />}
          </>
        )}
      </nav>
    </PaginationContext.Provider>
  );
};

const PaginationComponent = Pagination as PaginationWithSubComponents;
PaginationComponent.displayName = 'Pagination';
PaginationComponent.RowsPerPage = PaginationRowsPerPage;
PaginationComponent.Numbers = PaginationNumbers;
PaginationComponent.Overflow = PaginationOverflow;

export { PaginationComponent as Pagination };
