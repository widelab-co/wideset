import { cn } from 'src/lib/utils';

import type { CardDescriptionProps } from './Card.types';

const CardDescription = ({ className, ...props }: CardDescriptionProps) => (
  <p
    data-slot="card-description"
    className={cn('text-ws-static-subtle typography-body-md mt-ws-2 mb-ws-2', className)}
    {...props}
  />
);

CardDescription.displayName = 'Card.Description';

export { CardDescription };
