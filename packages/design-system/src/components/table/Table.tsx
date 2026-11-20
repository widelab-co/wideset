/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import { cn } from 'src/lib/utils';

import { TableContext } from './Table.context';
import type { TableProps } from './Table.types';
import { TableBody } from './TableBody';
import { TableCell } from './TableCell';
import { TableCellDescription } from './TableCellDescription';
import { TableFoot } from './TableFoot';
import { TableHead } from './TableHead';
import { TableHeader } from './TableHeader';
import { TableRow } from './TableRow';

const TableRoot = ({
  children,
  className,
  size,
  separated,
  striped,
  truncate,
  flushMargin,
  placement,
  align,
  stickyHeader,
  stickyColumn,
  hasBackground,
  interactive,
  selectionMode,
  ...props
}: TableProps) => {
  // A sticky table sits in a scroll container the consumer renders. Focus on the table lets the
  // keyboard scroll that container; any other table takes no focus at all.
  const isScrollRegion = stickyHeader || stickyColumn;
  const effectiveHasBackground = hasBackground ?? (isScrollRegion ? true : undefined);

  return (
    <TableContext.Provider
      value={{
        align,
        flushMargin,
        size,
        separated,
        striped,
        truncate,
        placement,
        stickyHeader,
        stickyColumn,
        hasBackground: effectiveHasBackground,
        selectionMode,
        interactive: interactive || !!selectionMode,
      }}
    >
      <table
        data-slot="table"
        tabIndex={isScrollRegion ? 0 : undefined}
        {...props}
        role={selectionMode ? 'grid' : undefined}
        aria-multiselectable={selectionMode === 'multiple' ? true : undefined}
        className={cn(
          separated && 'is-separated',
          'group w-full table-auto border-separate border-spacing-0',
          // The ring is inset: the scroll container clips anything outside the table. Not
          // wds-focus-visible, whose select-none would drop a text selection in the table.
          isScrollRegion &&
            'focus-visible:outline-ws-dynamic-primary-strong-default focus-visible:outline-2 focus-visible:-outline-offset-2',
          className,
        )}
      >
        {children}
      </table>
    </TableContext.Provider>
  );
};

const Table = TableRoot as typeof TableRoot & {
  Body: typeof TableBody;
  Cell: typeof TableCell;
  CellDescription: typeof TableCellDescription;
  Foot: typeof TableFoot;
  Head: typeof TableHead;
  Header: typeof TableHeader;
  Row: typeof TableRow;
};

Table.Cell = TableCell;
Table.CellDescription = TableCellDescription;
Table.Row = TableRow;
Table.Header = TableHeader;
Table.Head = TableHead;
Table.Body = TableBody;
Table.Foot = TableFoot;

export { Table };
