import * as React from 'react';
import { cn } from 'src/lib/utils';

import type { FieldLabelSuffixProps } from './FieldLabel.types';

export const FieldLabelSuffix = React.forwardRef<HTMLSpanElement, FieldLabelSuffixProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      data-slot="field-label-suffix"
      className={cn('text-ws-static-subtle typography-label-sm shrink-0', className)}
      {...props}
    />
  ),
);

FieldLabelSuffix.displayName = 'FieldLabel.Suffix';
