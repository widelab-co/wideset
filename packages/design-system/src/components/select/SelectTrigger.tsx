import * as SelectPrimitive from '@radix-ui/react-select';
import { RiArrowDownSLine } from '@remixicon/react';
import * as React from 'react';
import { cn } from 'src/lib/utils';

import { useDefaultMotion } from '../../motion/MotionProvider';
import { useSelectContext } from './Select.context';
import type { SelectTriggerProps } from './Select.types';
import {
  selectTriggerIconVariants,
  selectTriggerMotionVariants,
  selectTriggerVariants,
} from './Select.variants';

export const SelectTrigger = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(
  (
    {
      className,
      children,
      size,
      preset,
      variant = 'primary',
      hideArrow,
      placeholder,
      shouldUsePrimitive = true,
      defaultMotion,
      'aria-label': ariaLabel,
      ...props
    },
    ref,
  ) => {
    const { motion: selectMotion } = useSelectContext();
    const motion = useDefaultMotion(defaultMotion ?? selectMotion);
    const triggerClassName = cn(
      selectTriggerVariants({ size, preset, variant }),
      selectTriggerMotionVariants({ enabled: motion }),
      className,
    );

    const icon = (
      <RiArrowDownSLine
        aria-hidden="true"
        focusable="false"
        className={cn(selectTriggerIconVariants({ size, preset }))}
        data-disabled={props.disabled}
      />
    );

    if (!shouldUsePrimitive) {
      return (
        <button
          ref={ref}
          data-slot="select-trigger"
          aria-label={ariaLabel}
          className={triggerClassName}
          data-disabled={props.disabled}
          data-placeholder={!children && placeholder ? '' : undefined}
          {...props}
        >
          {children || placeholder}
          {!hideArrow && icon}
        </button>
      );
    }

    return (
      <SelectPrimitive.Trigger
        ref={ref}
        data-slot="select-trigger"
        aria-label={ariaLabel}
        className={triggerClassName}
        data-disabled={props.disabled}
        data-danger={variant === 'danger'}
        {...props}
      >
        {children || (placeholder && <SelectPrimitive.Value placeholder={placeholder} />)}
        {!hideArrow && <SelectPrimitive.Icon asChild>{icon}</SelectPrimitive.Icon>}
      </SelectPrimitive.Trigger>
    );
  },
);

SelectTrigger.displayName = 'Select.Trigger';
