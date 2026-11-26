import * as React from 'react';
import { cn } from 'src/lib/utils';

import type { SpreadsheetBodyProps } from './Spreadsheet.types';

export const SpreadsheetBody = React.forwardRef<HTMLTableSectionElement, SpreadsheetBodyProps>(
  ({ className, ...props }, ref) => (
    <tbody
      ref={ref}
      data-slot="spreadsheet-body"
      {...props}
      className={cn('bg-inherit', className)}
    />
  ),
);

SpreadsheetBody.displayName = 'Spreadsheet.Body';
