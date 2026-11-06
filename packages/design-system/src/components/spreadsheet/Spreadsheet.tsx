import { useComposedRefs } from '@radix-ui/react-compose-refs';
import * as React from 'react';
import { cn } from 'src/lib/utils';

import { SpreadsheetContext } from './Spreadsheet.context';
import {
  createActiveCellStore,
  useSpreadsheetKeyboard,
  useSpreadsheetLayout,
} from './Spreadsheet.hooks';
import type { SpreadsheetProps, SpreadsheetWithSubComponents } from './Spreadsheet.types';
import { SPREADSHEET_CLASS, SPREADSHEET_TABLE_CLASS } from './Spreadsheet.variants';
import { SpreadsheetBody } from './SpreadsheetBody';
import { SpreadsheetCell } from './SpreadsheetCell';
import { SpreadsheetColumnHeader } from './SpreadsheetColumnHeader';
import { SpreadsheetColumnHeaderIcon } from './SpreadsheetColumnHeaderIcon';
import { SpreadsheetColumnHeaderTrigger } from './SpreadsheetColumnHeaderTrigger';
import { SpreadsheetHead } from './SpreadsheetHead';
import { SpreadsheetRow } from './SpreadsheetRow';
import { SpreadsheetRowHeader } from './SpreadsheetRowHeader';

export const Spreadsheet = React.forwardRef<HTMLDivElement, SpreadsheetProps>(
  (
    {
      size = 'sm',
      stickyColumns = 1,
      className,
      children,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref,
  ) => {
    const [store] = React.useState(createActiveCellStore);
    const scrollerRef = React.useRef<HTMLDivElement>(null);
    const tableRef = React.useRef<HTMLTableElement>(null);
    const composedRef = useComposedRefs(ref, scrollerRef);
    const context = React.useMemo(() => ({ size: size ?? 'sm', store }), [size, store]);
    const { onFocus, onKeyDown } = useSpreadsheetKeyboard(scrollerRef, store);

    useSpreadsheetLayout(scrollerRef, tableRef, stickyColumns, store);

    return (
      <SpreadsheetContext.Provider value={context}>
        <div
          ref={composedRef}
          data-slot="spreadsheet"
          {...props}
          className={cn(SPREADSHEET_CLASS, className)}
        >
          <table
            ref={tableRef}
            role="grid"
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={ariaDescribedBy}
            className={SPREADSHEET_TABLE_CLASS}
            onFocus={onFocus}
            onKeyDown={onKeyDown}
          >
            {children}
          </table>
        </div>
      </SpreadsheetContext.Provider>
    );
  },
) as SpreadsheetWithSubComponents;

Spreadsheet.displayName = 'Spreadsheet';

Spreadsheet.Head = SpreadsheetHead;
Spreadsheet.Body = SpreadsheetBody;
Spreadsheet.Row = SpreadsheetRow;
Spreadsheet.ColumnHeader = SpreadsheetColumnHeader;
Spreadsheet.ColumnHeaderIcon = SpreadsheetColumnHeaderIcon;
Spreadsheet.ColumnHeaderTrigger = SpreadsheetColumnHeaderTrigger;
Spreadsheet.RowHeader = SpreadsheetRowHeader;
Spreadsheet.Cell = SpreadsheetCell;
