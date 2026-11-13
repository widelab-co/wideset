import * as React from 'react';
import { cn } from 'src/lib/utils';

import { useSpreadsheetContext } from './Spreadsheet.context';
import { useSpreadsheetCell } from './Spreadsheet.hooks';
import { cellContent } from './Spreadsheet.logic';
import type { SpreadsheetRowHeaderProps } from './Spreadsheet.types';
import { spreadsheetCellVariants } from './Spreadsheet.variants';

/** Figma (Clients screen): the row number column, a Text cell centred in Static/Text/Subtle. */
export const SpreadsheetRowHeader = React.forwardRef<
  HTMLTableCellElement,
  SpreadsheetRowHeaderProps
>(({ align = 'center', className, children, ...props }, ref) => {
  const { size } = useSpreadsheetContext();
  const cell = useSpreadsheetCell();
  // No title: a row number never needs its full text spelled out.
  const { content } = cellContent(children, align);

  return (
    <th
      ref={ref}
      scope="row"
      data-slot="spreadsheet-row-header"
      {...props}
      {...cell}
      className={cn(spreadsheetCellVariants({ size, align, part: 'rowHeader' }), className)}
    >
      {content}
    </th>
  );
});

SpreadsheetRowHeader.displayName = 'Spreadsheet.RowHeader';
