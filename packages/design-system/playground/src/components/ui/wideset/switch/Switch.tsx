'use client';

import * as Label from '@radix-ui/react-label';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import React from 'react';
import { cn } from '@/lib/wideset/utils';

import { useDefaultMotion } from '@/lib/wideset/motion/MotionProvider';
import { SwitchContext } from './Switch.context';
import type { SwitchProps, SwitchWithVariants } from './Switch.types';
import {
  switchMotionVariants,
  switchThumbMotionVariants,
  switchThumbVariants,
  switchVariants,
} from './Switch.variants';
import { SwitchDescription } from './SwitchDescription';
import { SwitchLabel } from './SwitchLabel';

const Switch = React.forwardRef<React.ComponentRef<typeof SwitchPrimitive.Root>, SwitchProps>(
  (
    {
      id,
      label,
      labelPosition = 'right',
      size = 'lg',
      className,
      disabled,
      defaultMotion,
      children,
      ...props
    },
    ref,
  ) => {
    const fallbackId = React.useId();
    const motion = useDefaultMotion(defaultMotion);
    const switchId = id || fallbackId;

    const containerClassName = cn('gap-ws-7 flex w-fit items-center', {
      'flex-row-reverse': labelPosition === 'left',
      'cursor-pointer': !disabled,
      'pointer-events-none': disabled,
    });

    const switchRoot = (
      <SwitchPrimitive.Root
        ref={ref}
        className={cn(
          switchVariants({ size }),
          switchMotionVariants({ enabled: motion }),
          className,
        )}
        id={switchId}
        disabled={disabled}
        data-slot="switch"
        {...props}
      >
        <SwitchPrimitive.Thumb
          className={cn(
            switchThumbVariants({ size }),
            switchThumbMotionVariants({ enabled: motion, size }),
          )}
        />
      </SwitchPrimitive.Root>
    );

    return (
      <SwitchContext.Provider value={{ disabled, id: switchId }}>
        {label ? (
          <Label.Root htmlFor={switchId} className={containerClassName}>
            {switchRoot}
            <span
              data-slot="switch-label"
              className={cn(
                'typography-label-sm text-ws-dynamic-secondary-default',
                disabled && 'text-ws-dynamic-secondary-disabled',
              )}
            >
              {label}
            </span>
          </Label.Root>
        ) : (
          <div className={containerClassName}>
            {switchRoot}
            {children && <div className="gap-ws-3 flex flex-col">{children}</div>}
          </div>
        )}
      </SwitchContext.Provider>
    );
  },
) as SwitchWithVariants;

Switch.displayName = 'Switch';
Switch.Label = SwitchLabel;
Switch.Description = SwitchDescription;

export { Switch, SwitchDescription, SwitchLabel };
