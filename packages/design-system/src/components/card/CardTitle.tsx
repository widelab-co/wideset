import { Slot } from '@radix-ui/react-slot';
import { cn } from 'src/lib/utils';

import type { CardTitleProps } from './Card.types';

const CardTitle = ({ asChild, className, children, ...props }: CardTitleProps) => {
  const Comp = asChild ? Slot : 'h3';

  return (
    <Comp
      data-slot="card-title"
      className={cn('text-ws-static-strong typography-subtitle-xs mt-ws-2', className)}
      {...props}
    >
      {children}
    </Comp>
  );
};

CardTitle.displayName = 'Card.Title';

export { CardTitle };
