'use client';

import { Slot, Slottable } from '@radix-ui/react-slot';
import React from 'react';
import { cn } from '@/lib/wideset/utils';

import { useDefaultMotion } from '@/lib/wideset/motion/MotionProvider';
import { ButtonContext } from './Button.context';
import { ButtonIcon } from './ButtonIcon';
import type { IconButtonProps } from './IconButton.types';
import { iconButtonMotionVariants, iconButtonVariants } from './IconButton.variants';

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      children,
      iconClassName,
      type = 'button' as const,
      preset,
      variant,
      size,
      asChild = false,
      defaultMotion,
      icon: Icon,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';
    const motion = useDefaultMotion(defaultMotion);

    return (
      <ButtonContext.Provider value={{ size, preset }}>
        <Comp
          className={cn(
            iconButtonVariants({ preset, size, variant }),
            iconButtonMotionVariants({ enabled: motion }),
            className,
          )}
          ref={ref}
          type={asChild ? undefined : type}
          data-slot="icon-button"
          {...props}
        >
          {children ? <Slottable>{children}</Slottable> : null}
          <ButtonIcon icon={Icon} className={iconClassName} />
        </Comp>
      </ButtonContext.Provider>
    );
  },
);

IconButton.displayName = 'IconButton';

export { IconButton };
