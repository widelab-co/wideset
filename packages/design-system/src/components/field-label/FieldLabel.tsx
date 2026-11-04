import { RiInformationFill } from '@remixicon/react';
import * as React from 'react';
import { cn } from 'src/lib/utils';

import { Tooltip } from '../tooltip/Tooltip';
import type { FieldLabelProps } from './FieldLabel.types';

// The ref reaches the <label>, not the wrapper around it and its tooltip, aside and description.
export const FieldLabel = React.forwardRef<HTMLLabelElement, FieldLabelProps>(
  (
    {
      children,
      required,
      suffix,
      tooltip,
      aside,
      className,
      description,
      tooltipAriaLabel = 'More information',
      ...props
    },
    ref,
  ) => {
    const content = (
      <div
        data-slot={description ? undefined : 'field-label'}
        className={cn('gap-ws-3 flex flex-wrap items-start', { 'w-fit': !aside })}
      >
        <div className="gap-ws-3 flex min-w-0 flex-1 items-center">
          <label
            ref={ref}
            className={cn(
              'text-ws-static-strong typography-label-strong-sm gap-ws-3 flex min-w-0 flex-wrap items-center',
              className,
            )}
            {...props}
          >
            <span className="min-w-0 break-words">{children}</span>
            {required && (
              <span className="text-ws-semantic-negative typography-label-sm shrink-0">*</span>
            )}
            {suffix && (
              <span className="text-ws-static-subtle typography-label-sm shrink-0">{suffix}</span>
            )}
          </label>
          {tooltip && (
            <Tooltip>
              <Tooltip.Trigger asChild>
                <RiInformationFill
                  className="text-ws-static-subtle focus-visible:wds-focus-visible h-ws-9 w-ws-9 shrink-0 rounded-full"
                  tabIndex={0}
                  aria-label={tooltipAriaLabel}
                />
              </Tooltip.Trigger>
              <Tooltip.Content>{tooltip}</Tooltip.Content>
            </Tooltip>
          )}
        </div>
        {aside && (
          <div className="gap-ws-2 flex flex-shrink-0 items-center">
            {aside && <div className="text-ws-static-subtle typography-label-sm">{aside}</div>}
          </div>
        )}
      </div>
    );

    return description ? (
      <div data-slot="field-label" className={cn('gap-ws-3 flex flex-col', { 'w-fit': !aside })}>
        {content}
        {description && (
          <div className="text-ws-static-subtle typography-body-md">{description}</div>
        )}
      </div>
    ) : (
      content
    );
  },
);
FieldLabel.displayName = 'FieldLabel';
