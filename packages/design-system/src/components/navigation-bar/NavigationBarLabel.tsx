import { cn } from 'src/lib/utils';

import type { NavigationBarLabelProps } from './NavigationBar.types';

const NavigationBarLabel = ({ className, ...props }: NavigationBarLabelProps) => (
  <span data-slot="navigation-bar-label" className={cn('min-w-0 truncate', className)} {...props} />
);

NavigationBarLabel.displayName = 'NavigationBar.Label';

export { NavigationBarLabel };
