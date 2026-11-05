import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/react';
import { useEffect, useMemo, useRef } from 'react';
import { IconButton } from 'src/components/button/IconButton';
import { cn } from 'src/lib/utils';

import { useDefaultMotion } from '../../motion/MotionProvider';
import { usePaginationContext } from './Pagination.context';
import { getPagesToDisplay } from './Pagination.logic';
import type { PaginationNumbersProps } from './Pagination.types';
import { PaginationNumbersItem } from './PaginationNumbersItem';

const PaginationNumbers = ({ className, defaultMotion, ...props }: PaginationNumbersProps) => {
  const {
    localActivePage,
    pagesCount,
    maxVisiblePages,
    onChange,
    prevPageAriaLabel,
    nextPageAriaLabel,
    motion: paginationMotion,
  } = usePaginationContext();
  const motion = useDefaultMotion(defaultMotion ?? paginationMotion);
  const pageButtons = useRef(new Map<number, HTMLButtonElement>());
  const pendingFocusPage = useRef<number | null>(null);

  useEffect(() => {
    const page = pendingFocusPage.current;
    pendingFocusPage.current = null;
    if (page === null || page !== localActivePage) return;

    const button = pageButtons.current.get(page);
    if (!button) return;

    const { activeElement, body } = button.ownerDocument;
    const focusIsOnEllipsis =
      activeElement?.getAttribute('role') === 'combobox' &&
      button.closest('[data-slot="pagination-numbers"]')?.contains(activeElement);

    if (activeElement === body || focusIsOnEllipsis) {
      button.focus({ preventScroll: true });
    }
  }, [localActivePage]);

  const pagesToDisplay = useMemo(
    () => getPagesToDisplay(localActivePage, pagesCount, maxVisiblePages),
    [localActivePage, pagesCount, maxVisiblePages],
  );

  if (!pagesToDisplay?.length) {
    return null;
  }

  const buttonSizeClassName = 'size-ws-14 p-0 flex-shrink-0';

  const handleEllipsisClose = (event: Event, selectedPage: number) => {
    pendingFocusPage.current = null;
    const button = pageButtons.current.get(selectedPage);
    if (button?.getAttribute('aria-current') !== 'page') {
      pendingFocusPage.current = selectedPage;
      return;
    }

    event.preventDefault();
    button.focus({ preventScroll: true });
  };

  return (
    <div
      data-slot="pagination-numbers"
      className={cn('gap-ws-7 ml-auto flex items-center', className)}
      {...props}
    >
      <IconButton
        aria-label={prevPageAriaLabel}
        preset="ghost"
        size="sm"
        variant="secondary"
        defaultMotion={motion}
        icon={RiArrowLeftSLine}
        disabled={localActivePage <= 1}
        onClick={() => onChange(localActivePage - 1)}
        className={buttonSizeClassName}
      />
      <ul className="gap-ws-5 flex">
        {pagesToDisplay.map((page, index) => (
          <PaginationNumbersItem
            key={page}
            page={page}
            previousPage={pagesToDisplay[index - 1]}
            isActive={localActivePage === page}
            onChange={onChange}
            pageButtonRef={(button) => {
              if (button) {
                pageButtons.current.set(page, button);
              } else {
                pageButtons.current.delete(page);
              }
            }}
            onEllipsisClose={handleEllipsisClose}
            buttonSizeClassName={buttonSizeClassName}
            defaultMotion={motion}
          />
        ))}
      </ul>
      <IconButton
        aria-label={nextPageAriaLabel}
        preset="ghost"
        size="sm"
        variant="secondary"
        defaultMotion={motion}
        icon={RiArrowRightSLine}
        disabled={localActivePage >= pagesCount}
        onClick={() => onChange(localActivePage + 1)}
        className={buttonSizeClassName}
      />
    </div>
  );
};

PaginationNumbers.displayName = 'Pagination.Numbers';

export { PaginationNumbers };
