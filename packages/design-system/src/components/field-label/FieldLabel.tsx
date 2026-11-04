import * as React from 'react';
import { cn } from 'src/lib/utils';

import type { FieldLabelProps, FieldLabelWithSubComponents } from './FieldLabel.types';
import { FieldLabelAside } from './FieldLabelAside';
import { FieldLabelDescription } from './FieldLabelDescription';
import { FieldLabelSuffix } from './FieldLabelSuffix';
import { FieldLabelTooltip } from './FieldLabelTooltip';

export const FieldLabel = React.forwardRef<HTMLLabelElement, FieldLabelProps>(
  ({ children, required, className, ...props }, ref) => (
    <label
      ref={ref}
      data-slot="field-label"
      className={cn(
        'text-ws-static-strong typography-label-strong-sm gap-ws-3 inline-flex min-w-0 flex-wrap items-center break-words',
        className,
      )}
      {...props}
    >
      {children}
      {required && (
        <span
          aria-hidden="true"
          data-slot="field-label-required"
          className="text-ws-semantic-negative typography-label-sm shrink-0"
        >
          *
        </span>
      )}
    </label>
  ),
) as FieldLabelWithSubComponents;

FieldLabel.displayName = 'FieldLabel';

FieldLabel.Suffix = FieldLabelSuffix;
FieldLabel.Tooltip = FieldLabelTooltip;
FieldLabel.Aside = FieldLabelAside;
FieldLabel.Description = FieldLabelDescription;

export { FieldLabelAside, FieldLabelDescription, FieldLabelSuffix, FieldLabelTooltip };
