import { cn } from 'src/lib/utils';

import { useCardContext } from './Card.context';
import type { CardFooterProps } from './Card.types';
import { cardFooterVariants } from './Card.variants';

const CardFooter = ({ className, ...props }: CardFooterProps) => {
  const { variant, divider } = useCardContext();

  return (
    <div
      data-slot="card-footer"
      className={cn(cardFooterVariants({ variant, divider }), className)}
      {...props}
    />
  );
};

CardFooter.displayName = 'Card.Footer';

export { CardFooter };
