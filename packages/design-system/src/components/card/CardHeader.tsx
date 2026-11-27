import { cn } from 'src/lib/utils';

import { useCardContext } from './Card.context';
import type { CardHeaderProps } from './Card.types';
import { CARD_HEADER_CLASS, cardHeaderVariants } from './Card.variants';

const CardHeader = ({ className, ...props }: CardHeaderProps) => {
  const { variant, divider } = useCardContext();

  return (
    <div
      data-slot="card-header"
      className={cn(CARD_HEADER_CLASS, cardHeaderVariants({ variant, divider }), className)}
      {...props}
    />
  );
};

CardHeader.displayName = 'Card.Header';

export { CardHeader };
