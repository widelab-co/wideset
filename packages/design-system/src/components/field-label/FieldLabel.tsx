import * as React from 'react';
import { cn } from 'src/lib/utils';

import type { FieldLabelProps, FieldLabelWithSubComponents } from './FieldLabel.types';
import { FieldLabelAside } from './FieldLabelAside';
import { FieldLabelDescription } from './FieldLabelDescription';
import { FieldLabelSuffix } from './FieldLabelSuffix';
import { FieldLabelTooltip } from './FieldLabelTooltip';

const hasContent = (node: React.ReactNode) => node != null && node !== false && node !== '';

export const FieldLabel = React.forwardRef<HTMLLabelElement, FieldLabelProps>(
  (
    {
      children,
      required,
      className,
      suffix,
      tooltip,
      tooltipAriaLabel,
      aside,
      description,
      ...props
    },
    ref,
  ) => (
    <>
      <label
        ref={ref}
        data-slot="field-label"
        className={cn(
          'text-ws-static-strong typography-label-strong-sm gap-ws-3 inline-flex min-w-0 flex-wrap items-center',
          className,
        )}
        {...props}
      >
        <span className="min-w-0 break-words">{children}</span>
        {required && (
          <span
            aria-hidden="true"
            data-slot="field-label-required"
            className="text-ws-semantic-negative typography-label-sm shrink-0"
          >
            *
          </span>
        )}
        {hasContent(suffix) && <FieldLabelSuffix>{suffix}</FieldLabelSuffix>}
      </label>
      {hasContent(tooltip) && (
        <FieldLabelTooltip aria-label={tooltipAriaLabel}>{tooltip}</FieldLabelTooltip>
      )}
      {hasContent(aside) && <FieldLabelAside>{aside}</FieldLabelAside>}
      {hasContent(description) && <FieldLabelDescription>{description}</FieldLabelDescription>}
    </>
  ),
) as FieldLabelWithSubComponents;

FieldLabel.displayName = 'FieldLabel';

FieldLabel.Suffix = FieldLabelSuffix;
FieldLabel.Tooltip = FieldLabelTooltip;
FieldLabel.Aside = FieldLabelAside;
FieldLabel.Description = FieldLabelDescription;

export { FieldLabelAside, FieldLabelDescription, FieldLabelSuffix, FieldLabelTooltip };
