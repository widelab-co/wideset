import * as React from 'react';
import { cn } from 'src/lib/utils';

import type { TableCellDescriptionProps } from './Table.types';
import { tableCellDescriptionVariants } from './Table.variants';

/**
 * A second, quieter line under a cell's label: Figma's Table Cell `Description`. The label keeps
 * the cell's own type, so a two-line cell never needs a bigger font to stand out.
 */
export const TableCellDescription = React.forwardRef<HTMLSpanElement, TableCellDescriptionProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      data-slot="table-cell-description"
      {...props}
      className={cn(tableCellDescriptionVariants(), className)}
    />
  ),
);

TableCellDescription.displayName = 'Table.CellDescription';
