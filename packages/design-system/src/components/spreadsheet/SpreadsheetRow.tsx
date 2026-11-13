import * as React from 'react';
import { cn } from 'src/lib/utils';

import type { SpreadsheetRowProps } from './Spreadsheet.types';

/** Passes the grid's surface on to its pinned cells, which paint it over what scrolls under. */
export const SpreadsheetRow = React.forwardRef<HTMLTableRowElement, SpreadsheetRowProps>(
  ({ className, ...props }, ref) => (
    <tr ref={ref} data-slot="spreadsheet-row" {...props} className={cn('bg-inherit', className)} />
  ),
);

SpreadsheetRow.displayName = 'Spreadsheet.Row';
