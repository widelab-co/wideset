import { RiInformationFill } from '@remixicon/react';
import * as React from 'react';
import { cn } from 'src/lib/utils';

import { Tooltip } from '../tooltip/Tooltip';
import type { FieldLabelTooltipProps } from './FieldLabel.types';

export const FieldLabelTooltip = React.forwardRef<HTMLButtonElement, FieldLabelTooltipProps>(
  ({ children, className, 'aria-label': ariaLabel = 'More information', ...props }, ref) => (
    <Tooltip>
      <Tooltip.Trigger asChild>
        <button
          ref={ref}
          type="button"
          data-slot="field-label-tooltip"
          aria-label={ariaLabel}
          className={cn(
            'text-ws-static-subtle focus-visible:wds-focus-visible inline-flex shrink-0 items-center justify-center rounded-full',
            className,
          )}
          {...props}
        >
          <RiInformationFill aria-hidden="true" focusable="false" className="h-ws-9 w-ws-9" />
        </button>
      </Tooltip.Trigger>
      <Tooltip.Content>{children}</Tooltip.Content>
    </Tooltip>
  ),
);

FieldLabelTooltip.displayName = 'FieldLabel.Tooltip';
