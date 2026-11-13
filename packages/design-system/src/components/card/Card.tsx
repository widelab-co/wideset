import * as React from 'react';
import { cn } from 'src/lib/utils';

import { CardContext } from './Card.context';
import type { CardProps, CardWithSubComponents } from './Card.types';
import { cardVariants } from './Card.variants';
import { CardAction } from './CardAction';
import { CardContent } from './CardContent';
import { CardDescription } from './CardDescription';
import { CardFooter } from './CardFooter';
import { CardHeader } from './CardHeader';
import { CardMedia } from './CardMedia';
import { CardTitle } from './CardTitle';

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant, divider = false, className, children, ...props }, ref) => (
    <CardContext.Provider value={{ variant, divider }}>
      <div
        ref={ref}
        data-slot="card"
        className={cn(cardVariants({ variant }), className)}
        {...props}
      >
        {children}
      </div>
    </CardContext.Provider>
  ),
) as CardWithSubComponents;

Card.displayName = 'Card';

Card.Content = CardContent;
Card.Footer = CardFooter;
Card.Header = CardHeader;
Card.Media = CardMedia;

/** Header subcomponents */
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Action = CardAction;
