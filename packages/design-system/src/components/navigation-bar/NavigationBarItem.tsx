import { Slot, Slottable } from '@radix-ui/react-slot';
import * as React from 'react';
import { cn } from 'src/lib/utils';

import { useDefaultMotion } from '../../motion/MotionProvider';
import type { NavigationBarItemProps } from './NavigationBar.types';
import {
  navigationBarItemIconVariants,
  navigationBarItemMotionVariants,
  navigationBarItemVariants,
} from './NavigationBar.variants';

const NavigationBarItem = React.forwardRef<HTMLAnchorElement, NavigationBarItemProps>(
  (
    {
      asChild = false,
      icon: Icon,
      label,
      badge,
      active = false,
      disabled = false,
      className,
      children,
      onClick,
      defaultMotion,
      ...props
    },
    ref,
  ) => {
    const motion = useDefaultMotion(defaultMotion);
    const Comp = asChild ? Slot : 'a';

    return (
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
      >
        {asChild ? <Slottable>{children}</Slottable> : null}
        {Icon ? (
          <Icon
            aria-hidden="true"
            focusable="false"
            className={navigationBarItemIconVariants({ active })}
          />
        ) : null}
        <span className="min-w-0 truncate">{label}</span>
        {/* Figma fades the badge with the disabled item, as it does the other trailing slots. */}
        {badge ? (
          <span className={cn('flex shrink-0', disabled && 'opacity-50')}>{badge}</span>
        ) : null}
      </Comp>
    );
  },
);

NavigationBarItem.displayName = 'NavigationBar.Item';

export { NavigationBarItem };
