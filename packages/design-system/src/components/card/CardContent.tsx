import { cn } from 'src/lib/utils';

import { ScrollArea } from '../scroll-area/ScrollArea';
import { useCardContext } from './Card.context';
import type { CardContentProps } from './Card.types';
import { cardContentVariants } from './Card.variants';

const CardContent = ({ className, contentClassName, ...props }: CardContentProps) => {
  const { variant } = useCardContext();

  return (
    // Bordered content is padded and its padding holds the bar; flat content runs to the edge,
    // so it keeps a gutter.
    <ScrollArea
      data-slot="card-content"
      scrollbarGutter={variant === 'flat'}
      className={cn('grow', className)}
    >
      <div className={cn(cardContentVariants({ variant }), contentClassName)} {...props} />
    </ScrollArea>
  );
};

CardContent.displayName = 'Card.Content';

export { CardContent };
