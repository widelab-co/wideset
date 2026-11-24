import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';
import { cn } from 'src/lib/utils';

import { useDefaultMotion } from '../../motion/MotionProvider';
import { NavigationBarItemContext } from './NavigationBar.context';
import type { NavigationBarItemProps } from './NavigationBar.types';
import {
  navigationBarItemMotionVariants,
  navigationBarItemVariants,
} from './NavigationBar.variants';

const NavigationBarItem = React.forwardRef<HTMLAnchorElement, NavigationBarItemProps>(
  (
    {
      asChild = false,
      active = false,
      disabled = false,
      className,
      onClick,
      defaultMotion,
      ...props
    },
    ref,
  ) => {
    const motion = useDefaultMotion(defaultMotion);
    const context = React.useMemo(() => ({ active, disabled }), [active, disabled]);
    const Comp = asChild ? Slot : 'a';

    return (
      <NavigationBarItemContext.Provider value={context}>
        <Comp
          ref={ref}
          data-slot="navigation-bar-item"
          className={cn(
            navigationBarItemVariants({ active }),
            navigationBarItemMotionVariants({ enabled: motion }),
            className,
          )}
          aria-current={active ? 'page' : undefined}
          aria-disabled={disabled || undefined}
          tabIndex={disabled ? -1 : undefined}
          onClick={
            disabled ? (e: React.MouseEvent<HTMLAnchorElement>) => e.preventDefault() : onClick
          }
          {...props}
        />
      </NavigationBarItemContext.Provider>
    );
  },
);

NavigationBarItem.displayName = 'NavigationBar.Item';

export { NavigationBarItem };
