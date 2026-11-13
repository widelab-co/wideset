import * as React from 'react';
import { cn } from 'src/lib/utils';

import { useSpreadsheetContext } from './Spreadsheet.context';
import { useSpreadsheetCell } from './Spreadsheet.hooks';
import { cellContent } from './Spreadsheet.logic';
import type { SpreadsheetColumnHeaderProps } from './Spreadsheet.types';
import { spreadsheetCellVariants } from './Spreadsheet.variants';

const ARIA_SORT = { asc: 'ascending', desc: 'descending' } as const;

const ariaSort = (direction: SpreadsheetColumnHeaderProps['sortDirection']) =>
  direction === undefined ? undefined : direction === null ? 'none' : ARIA_SORT[direction];

/** Figma: the Header cell type (icon, Body/Small label, chevron) on the header row's tint. */
export const SpreadsheetColumnHeader = React.forwardRef<
  HTMLTableCellElement,
  SpreadsheetColumnHeaderProps
>(({ align = 'left', sortDirection, className, children, ...props }, ref) => {
  const { size } = useSpreadsheetContext();
  const cell = useSpreadsheetCell();
  const { content, title } = cellContent(children, align);

  return (
    <th
      ref={ref}
      scope="col"
      data-slot="spreadsheet-column-header"
      title={title}
      {...props}
      {...cell}
      aria-sort={ariaSort(sortDirection)}
      className={cn(spreadsheetCellVariants({ size, align, part: 'columnHeader' }), className)}
    >
      {content}
    </th>
  );
});

SpreadsheetColumnHeader.displayName = 'Spreadsheet.ColumnHeader';
