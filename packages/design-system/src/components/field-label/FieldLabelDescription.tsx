import * as React from 'react';
import { cn } from 'src/lib/utils';

import type { FieldLabelDescriptionProps } from './FieldLabel.types';

export const FieldLabelDescription = React.forwardRef<HTMLDivElement, FieldLabelDescriptionProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="field-label-description"
      className={cn('text-ws-static-subtle typography-body-md basis-full', className)}
      {...props}
    />
  ),
);

FieldLabelDescription.displayName = 'FieldLabel.Description';
