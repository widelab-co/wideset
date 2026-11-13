import { RiArrowUpDownLine, RiSortAsc, RiSortDesc } from '@remixicon/react';
import { cn } from 'src/lib/utils';

import { IconButton } from '../button/IconButton';
import { useTableContext } from './Table.context';
import type { SortDirection, TableHeaderProps } from './Table.types';
import { getTruncatedTitle } from './Table.utils';
import { cellVariants } from './Table.variants';

const toAriaSortValue = (sortDirection: SortDirection): React.AriaAttributes['aria-sort'] =>
  sortDirection === 'asc' ? 'ascending' : sortDirection === 'desc' ? 'descending' : 'none';

export const TableHeader = ({
  children,
  className,
  align,
  flushMargin,
  truncate,
  sortable,
  sortDirection = null,
  onSort,
  disabled = false,
  sortAriaLabel,
  ...props
}: TableHeaderProps) => {
  const {
    align: contextAlign,
    flushMargin: contextFlushMargin,
    truncate: contextTruncate,
    stickyColumn,
    separated,
    size,
    hasBackground,
  } = useTableContext();

  const shouldTruncate = truncate ?? contextTruncate;

  const icon =
    sortDirection === 'asc'
      ? RiSortAsc
      : sortDirection === 'desc'
        ? RiSortDesc
        : // Sortable but not sorted: arrows along the column, the axis a sort runs on.
          RiArrowUpDownLine;

  const sortButton = sortable && (
    <IconButton
      size="xs"
      icon={icon}
      onClick={onSort}
      variant="secondary"
      preset="ghost"
      disabled={disabled}
      iconClassName={sortDirection ? undefined : 'text-ws-static-subtle'}
      className="ml-ws-2 align-middle"
      aria-label={
        sortAriaLabel ?? `Sort by ${typeof children === 'string' ? children : 'this column'}`
      }
    />
  );

  return (
    <th
      data-slot="table-header"
      title={getTruncatedTitle(children, shouldTruncate)}
      {...props}
      aria-sort={sortable ? toAriaSortValue(sortDirection) : undefined}
      className={cn(
        cellVariants({
          align: align ?? contextAlign,
          flushMargin: flushMargin ?? contextFlushMargin,
          header: true,
          stickyColumn,
          separated,
          size,
          hasBackground,
        }),
        '[thead_&]:border-b-2',
        className,
      )}
    >
      {shouldTruncate ? (
        // Truncate an inner wrapper, not the th itself — clipping the th would
        // also clip the sort button out of view in a narrow column.
        <span className="flex items-center">
          <span className="min-w-0 flex-1 truncate">{children}</span>
          {sortButton}
        </span>
      ) : (
        <>
          {children}
          {sortButton}
        </>
      )}
    </th>
  );
};

TableHeader.displayName = 'Table.Header';
