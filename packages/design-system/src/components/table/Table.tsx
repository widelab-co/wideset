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
  const effectiveHasBackground = hasBackground ?? (stickyHeader || stickyColumn ? true : undefined);

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
        {...props}
        role={selectionMode ? 'grid' : undefined}
        aria-multiselectable={selectionMode === 'multiple' ? true : undefined}
        className={cn(
          separated && 'is-separated',
          'group w-full table-auto border-separate border-spacing-0',
          className,
        )}
        tabIndex={stickyColumn || stickyHeader ? 0 : -1}
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
