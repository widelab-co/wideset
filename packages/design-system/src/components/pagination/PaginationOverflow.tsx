import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/react';
import { useMemo } from 'react';
import { Button } from 'src/components/button/Button';
import { Select } from 'src/components/select/Select';
import { cn } from 'src/lib/utils';

import { useDefaultMotion } from '../../motion/MotionProvider';
import { usePaginationContext } from './Pagination.context';
import type { PaginationOverflowProps } from './Pagination.types';

const PaginationOverflow = ({
  className,
  prevLabel,
  nextLabel,
  ofLabel,
  defaultMotion,
  ...props
}: PaginationOverflowProps) => {
  const {
    localActivePage,
    pagesCount,
    getPageHref,
    onChange,
    prevLabel: contextPrevLabel,
    nextLabel: contextNextLabel,
    ofLabel: contextOfLabel,
    prevPageAriaLabel,
    nextPageAriaLabel,
    motion: paginationMotion,
  } = usePaginationContext();
  const motion = useDefaultMotion(defaultMotion ?? paginationMotion);
  const visiblePrevLabel = prevLabel ?? contextPrevLabel;
  const visibleNextLabel = nextLabel ?? contextNextLabel;

  const pageSelectOptions = useMemo(
    () =>
      Array.from({ length: pagesCount }).map((_, index) => ({
        label: `${index + 1}`,
        value: `${index + 1}`,
      })),
    [pagesCount],
  );

  if (pagesCount === 0) return null;

  const previousHref = localActivePage > 1 ? getPageHref?.(localActivePage - 1) : undefined;
  const nextHref = localActivePage < pagesCount ? getPageHref?.(localActivePage + 1) : undefined;
  const previousIcon = <Button.Icon key="icon" icon={RiArrowLeftSLine} />;
  const nextIcon = <Button.Icon key="icon" icon={RiArrowRightSLine} />;

  return (
    <div
      data-slot="pagination-overflow"
      className={cn('gap-ws-9 ml-auto flex items-center', className)}
      {...props}
    >
      <Button
        aria-label={visiblePrevLabel ? undefined : prevPageAriaLabel}
        preset="ghost"
        size="sm"
        variant="secondary"
        defaultMotion={motion}
        disabled={localActivePage <= 1}
        asChild={previousHref !== undefined}
        onClick={previousHref === undefined ? () => onChange(localActivePage - 1) : undefined}
      >
        {previousHref === undefined ? (
          [previousIcon, visiblePrevLabel]
        ) : (
          <a href={previousHref}>
            {previousIcon}
            <span className="px-ws-2">{visiblePrevLabel}</span>
          </a>
        )}
      </Button>

      <div className="gap-ws-7 flex items-center">
        <Select
          className="w-ws-21"
          options={pageSelectOptions}
          value={localActivePage.toString()}
          onValueChange={(value) => {
            onChange(+value);
          }}
          size="sm"
          defaultMotion={motion}
        />
        <span className="text-ws-static-base typography-label-sm whitespace-nowrap">
          {ofLabel ?? contextOfLabel} {pagesCount}
        </span>
      </div>

      <Button
        aria-label={visibleNextLabel ? undefined : nextPageAriaLabel}
        preset="ghost"
        size="sm"
        variant="secondary"
        defaultMotion={motion}
        disabled={localActivePage >= pagesCount}
        asChild={nextHref !== undefined}
        onClick={nextHref === undefined ? () => onChange(localActivePage + 1) : undefined}
      >
        {nextHref === undefined ? (
          [visibleNextLabel, nextIcon]
        ) : (
          <a href={nextHref}>
            <span className="px-ws-2">{visibleNextLabel}</span>
            {nextIcon}
          </a>
        )}
      </Button>
    </div>
  );
};

PaginationOverflow.displayName = 'Pagination.Overflow';

export { PaginationOverflow };
