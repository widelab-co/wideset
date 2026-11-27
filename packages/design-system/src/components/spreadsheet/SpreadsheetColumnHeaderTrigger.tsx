import { RiArrowDropDownFill } from '@remixicon/react';
import * as React from 'react';
import { cn } from 'src/lib/utils';

import type { SpreadsheetColumnHeaderTriggerProps } from './Spreadsheet.types';

/**
 * Figma: the Chevron of the Header cell, a 16px (Size/9) arrow-drop-down-fill in
 * Static/Text/Subtle right after the label. It takes no hover of its own: the header cell's
 * tint is the hover.
 */
export const SpreadsheetColumnHeaderTrigger = React.forwardRef<
  HTMLButtonElement,
  SpreadsheetColumnHeaderTriggerProps
>(({ className, type = 'button', ...props }, ref) => (
  <button
    ref={ref}
    type={type}
    data-slot="spreadsheet-column-header-trigger"
    {...props}
    className={cn(
      'text-ws-static-subtle rounded-ws-control-sm p-ws-0 inline-flex shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent',
      'focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default',
      className,
    )}
  >
    <RiArrowDropDownFill aria-hidden="true" focusable="false" className="size-ws-9" />
  </button>
));

SpreadsheetColumnHeaderTrigger.displayName = 'Spreadsheet.ColumnHeaderTrigger';
