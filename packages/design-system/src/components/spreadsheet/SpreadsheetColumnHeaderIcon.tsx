import { cn } from 'src/lib/utils';

import type { SpreadsheetColumnHeaderIconProps } from './Spreadsheet.types';

/** Figma: 14px (Size/8) in Static/Text/Subtle. */
export const SpreadsheetColumnHeaderIcon = ({
  icon: Icon,
  className,
  ...props
}: SpreadsheetColumnHeaderIconProps) => (
  <Icon
    aria-hidden="true"
    focusable="false"
    className={cn('size-ws-8 text-ws-static-subtle shrink-0', className)}
    data-slot="spreadsheet-column-header-icon"
    {...props}
  />
);

SpreadsheetColumnHeaderIcon.displayName = 'Spreadsheet.ColumnHeaderIcon';
