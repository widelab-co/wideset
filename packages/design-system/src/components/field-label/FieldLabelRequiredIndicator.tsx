import * as React from 'react';
import { cn } from 'src/lib/utils';

import { useFieldLabelContext } from './FieldLabel.context';
import type { FieldLabelRequiredIndicatorProps } from './FieldLabel.types';

export const FieldLabelRequiredIndicator = React.forwardRef<
  HTMLSpanElement,
  FieldLabelRequiredIndicatorProps
>(({ className, children = '*', ...props }, ref) => {
  const { required } = useFieldLabelContext();
  if (!required) return null;

  return (
    <span
      ref={ref}
      aria-hidden="true"
      data-slot="field-label-required-indicator"
      className={cn('text-ws-semantic-negative typography-label-sm shrink-0', className)}
      {...props}
    >
      {children}
    </span>
  );
});

FieldLabelRequiredIndicator.displayName = 'FieldLabel.RequiredIndicator';
