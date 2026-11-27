import * as React from 'react';
import { cn } from 'src/lib/utils';

import type { FieldLabelAsideProps } from './FieldLabel.types';

export const FieldLabelAside = React.forwardRef<HTMLDivElement, FieldLabelAsideProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="field-label-aside"
      className={cn(
        'text-ws-static-subtle typography-label-sm gap-ws-2 ml-auto flex shrink-0 items-center',
        className,
      )}
      {...props}
    />
  ),
);

FieldLabelAside.displayName = 'FieldLabel.Aside';
