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
      wrapperClassName,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref,
  ) => {
    const fallbackId = React.useId();
    const motion = useDefaultMotion(defaultMotion);
    const switchId = id || fallbackId;
    const descriptionId = `${switchId}-description`;
    const [registeredDescriptionId, setRegisteredDescriptionId] = React.useState<string>();
    const childDescriptions = React.Children.toArray(children).filter(
      (child): child is React.ReactElement<{ id?: string }> =>
        React.isValidElement(child) && child.type === SwitchDescription,
    );
    const childDescription = childDescriptions[0];
    const extraDescriptions = childDescriptions.length > 1;

    React.useEffect(() => {
      if (extraDescriptions) {
        // eslint-disable-next-line no-console
        console.warn('Switch: render one `Switch.Description` per switch; only one is announced.');
      }
    }, [extraDescriptions]);
    const renderedDescriptionId = childDescription
      ? (childDescription.props.id ?? descriptionId)
      : undefined;
    const describedBy =
      [ariaDescribedBy, registeredDescriptionId ?? renderedDescriptionId]
        .filter(Boolean)
        .join(' ') || undefined;

    const containerClassName = cn(
      'gap-ws-7 flex w-fit items-center',
      {
        'flex-row-reverse': labelPosition === 'left',
        'cursor-pointer': !disabled,
        'pointer-events-none': disabled,
      },
      wrapperClassName,
    );

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
        aria-describedby={describedBy}
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
      <SwitchContext.Provider
        value={{
          disabled,
          id: switchId,
          descriptionId,
          onDescriptionIdChange: setRegisteredDescriptionId,
        }}
      >
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
