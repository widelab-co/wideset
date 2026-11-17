import * as React from 'react';
import { cn } from 'src/lib/utils';

import { useSpreadsheetContext } from './Spreadsheet.context';
import { useSpreadsheetCell } from './Spreadsheet.hooks';
import { cellContent } from './Spreadsheet.logic';
import type { SpreadsheetCellProps } from './Spreadsheet.types';
import { spreadsheetCellVariants } from './Spreadsheet.variants';

/**
 * There is no `type` prop: Figma's cell types (Text, Number, Checkbox, Status Badge, Tags, Switch,
 * Progress, Icon, Person, Thumbnail, Payment Method) differ only in what the cell holds, so the
 * content is the library component itself. The cell gives every type the same frame: height,
 * padding, grid lines, state tints and one line of content.
 */
export const SpreadsheetCell = React.forwardRef<HTMLTableCellElement, SpreadsheetCellProps>(
  ({ align = 'left', className, children, ...props }, ref) => {
    const { size } = useSpreadsheetContext();
    const cell = useSpreadsheetCell();
    const { content, title } = cellContent(children, align);

    return (
      <td
        ref={ref}
        // A td in a grid is a gridcell to browsers already; the role says so to every tool.
        role="gridcell"
        data-slot="spreadsheet-cell"
        title={title}
        {...props}
        {...cell}
        className={cn(spreadsheetCellVariants({ size, align }), className)}
      >
        {content}
      </td>
    );
  },
);

SpreadsheetCell.displayName = 'Spreadsheet.Cell';
