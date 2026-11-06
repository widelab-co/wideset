import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import * as Label from '@radix-ui/react-label';
import { RiCheckLine } from '@remixicon/react';
import * as React from 'react';
import { cn } from 'src/lib/utils';

import { useDefaultMotion } from '../../motion/MotionProvider';
import { CheckboxContext } from './Checkbox.context';
import type { CheckboxProps, CheckboxWithVariants } from './Checkbox.types';
import {
  checkboxCheckedIndicatorVariants,
  checkboxIndeterminateIndicatorVariants,
  checkboxIndicatorMotionVariants,
  checkboxMotionVariants,
  checkboxVariants,
} from './Checkbox.variants';
import { CheckboxDescription } from './CheckboxDescription';
import { CheckboxGroup } from './CheckboxGroup';
import { CheckboxLabel } from './CheckboxLabel';

const Checkbox = React.forwardRef<React.ComponentRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  (
    {
      className,
      size = 'lg',
      variant = 'primary',
      id,
      label,
      description,
      disabled,
      defaultMotion,
      children,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref,
  ) => {
    const fallbackId = React.useId();
    const motion = useDefaultMotion(defaultMotion);
    const checkboxId = id || fallbackId;
    const descriptionId = `${checkboxId}-description`;
    const [composedDescriptionId, setComposedDescriptionId] = React.useState<string>();
    const describedBy =
      [ariaDescribedBy, label && description ? descriptionId : composedDescriptionId]
        .filter(Boolean)
        .join(' ') || undefined;

    const checkboxElement = (
      <CheckboxPrimitive.Root
        ref={ref}
        id={checkboxId}
        className={cn(
          checkboxVariants({ size, variant }),
          checkboxMotionVariants({ enabled: motion }),
          className,
        )}
        disabled={disabled}
        aria-describedby={describedBy}
        data-slot="checkbox"
        {...props}
      >
        <CheckboxPrimitive.Indicator
          className={cn(
            'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
            checkboxIndicatorMotionVariants({ enabled: motion }),
          )}
        >
          <RiCheckLine
            aria-hidden="true"
            focusable="false"
            className={checkboxCheckedIndicatorVariants({ variant })}
          />
          <div className={checkboxIndeterminateIndicatorVariants({ size, variant })} />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    );
    return (
      <CheckboxContext.Provider
        value={{
          disabled,
          id: checkboxId,
          descriptionId,
          onDescriptionIdChange: setComposedDescriptionId,
        }}
      >
        {label ? (
          <div className={cn('gap-ws-5 flex w-fit')}>
            {checkboxElement}
            <div className="gap-ws-3 flex flex-col">
              <Label.Root
                data-slot="checkbox-label"
                htmlFor={checkboxId}
                className={cn(
                  'typography-label-sm text-ws-static-base',
                  disabled ? 'text-ws-static-subtle pointer-events-none' : 'cursor-pointer',
                )}
              >
                {label}
              </Label.Root>
              {description && (
                <div
                  id={descriptionId}
                  data-slot="checkbox-description"
                  className="text-ws-static-subtle typography-body-sm"
                >
                  {description}
                </div>
              )}
            </div>
          </div>
        ) : children ? (
          <div className={cn('gap-ws-5 flex w-fit')}>
            {checkboxElement}
            <div className="gap-ws-3 flex flex-col">{children}</div>
          </div>
        ) : (
          checkboxElement
        )}
      </CheckboxContext.Provider>
    );
  },
) as CheckboxWithVariants;

Checkbox.displayName = 'Checkbox';
Checkbox.Group = CheckboxGroup;
Checkbox.Label = CheckboxLabel;
Checkbox.Description = CheckboxDescription;

export { Checkbox, CheckboxDescription, CheckboxLabel };
