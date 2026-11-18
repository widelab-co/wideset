import * as React from 'react';
import { cn } from 'src/lib/utils';

import { FieldLabelContext } from './FieldLabel.context';
import type { FieldLabelProps, FieldLabelWithSubComponents } from './FieldLabel.types';
import { FieldLabelAside } from './FieldLabelAside';
import { FieldLabelRequiredIndicator } from './FieldLabelRequiredIndicator';
import { FieldLabelSuffix } from './FieldLabelSuffix';
import { FieldLabelTooltip } from './FieldLabelTooltip';

export const FieldLabel = React.forwardRef<HTMLLabelElement, FieldLabelProps>(
  ({ children, required = false, className, ...props }, ref) => {
    const context = React.useMemo(() => ({ required }), [required]);

    return (
      <FieldLabelContext.Provider value={context}>
        <label
          ref={ref}
          data-slot="field-label"
          className={cn(
            'text-ws-static-strong typography-label-strong-sm gap-ws-3 inline-flex min-w-0 flex-wrap items-center wrap-anywhere',
            className,
          )}
          {...props}
        >
          {children}
        </label>
      </FieldLabelContext.Provider>
    );
  },
) as FieldLabelWithSubComponents;

FieldLabel.displayName = 'FieldLabel';

FieldLabel.RequiredIndicator = FieldLabelRequiredIndicator;
FieldLabel.Suffix = FieldLabelSuffix;
FieldLabel.Tooltip = FieldLabelTooltip;
FieldLabel.Aside = FieldLabelAside;

export { FieldLabelAside, FieldLabelRequiredIndicator, FieldLabelSuffix, FieldLabelTooltip };
