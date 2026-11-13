import { cn } from 'src/lib/utils';

import { ScrollArea } from '../scroll-area/ScrollArea';
import { useCardContext } from './Card.context';
import type { CardContentProps } from './Card.types';
import { cardContentVariants } from './Card.variants';

const CardContent = ({ className, contentClassName, ...props }: CardContentProps) => {
  const { variant } = useCardContext();

  return (
    // orientation="both": content wider than the card (a table) scrolls inside it. The card's
    // min-w-0 keeps that content from setting its minimum width in a grid track or flex row.
    <ScrollArea data-slot="card-content" orientation="both" className={cn('grow', className)}>
      <div className={cn(cardContentVariants({ variant }), contentClassName)} {...props} />
    </ScrollArea>
  );
};

CardContent.displayName = 'Card.Content';

export { CardContent };
