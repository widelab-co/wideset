import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';
import { cn } from 'src/lib/utils';

import type { TextLinkProps } from './TextLink.types';
import { textLinkClassName } from './TextLink.variants';

export const TextLink = React.forwardRef<HTMLAnchorElement, TextLinkProps>(
  ({ asChild = false, className, ...props }, ref) => {
    const Comp = asChild ? Slot : 'a';
    return (
      <Comp
        ref={ref}
        data-slot="text-link"
        className={cn(textLinkClassName, className)}
        {...props}
      />
    );
  },
);

TextLink.displayName = 'TextLink';
