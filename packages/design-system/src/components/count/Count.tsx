import React from 'react';
import { cn } from 'src/lib/utils';

import type { CountProps } from './Count.types';
import { countVariants } from './Count.variants';

const Count = React.forwardRef<HTMLSpanElement, CountProps>(
  ({ children, className, contained, ...props }, ref) => (
    <span
      ref={ref}
      data-slot="count"
      className={cn(countVariants({ contained }), className)}
      {...props}
    >
      {children}
    </span>
  ),
);

Count.displayName = 'Count';

export { Count };
