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

const blockClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
  event.preventDefault();
  event.stopPropagation();
};

const NavigationBarItem = React.forwardRef<HTMLAnchorElement, NavigationBarItemProps>(
  (
    {
      asChild = false,
      active = false,
      disabled = false,
      className,
      href,
      onClick,
      onClickCapture,
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
          {...(disabled ? { role: 'link' } : href !== undefined && { href })}
          aria-current={active ? 'page' : undefined}
          aria-disabled={disabled || undefined}
          tabIndex={disabled ? -1 : undefined}
          onClick={disabled ? undefined : onClick}
          onClickCapture={disabled ? blockClick : onClickCapture}
          {...props}
        />
      </NavigationBarItemContext.Provider>
    );
  },
);

NavigationBarItem.displayName = 'NavigationBar.Item';

export { NavigationBarItem };
