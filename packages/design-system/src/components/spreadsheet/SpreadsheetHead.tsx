import * as React from 'react';
import { cn } from 'src/lib/utils';

import type { SpreadsheetHeadProps } from './Spreadsheet.types';

/** Sticks to the top of the grid; its background is the grid's surface. */
export const SpreadsheetHead = React.forwardRef<HTMLTableSectionElement, SpreadsheetHeadProps>(
  ({ className, ...props }, ref) => (
    <thead
      ref={ref}
      data-slot="spreadsheet-head"
      {...props}
      className={cn('z-ws-sticky sticky top-0 bg-inherit', className)}
    />
  ),
);

SpreadsheetHead.displayName = 'Spreadsheet.Head';
