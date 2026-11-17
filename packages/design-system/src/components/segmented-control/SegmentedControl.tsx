import { useComposedRefs } from '@radix-ui/react-compose-refs';
import * as RadioGroup from '@radix-ui/react-radio-group';
import React, { useState } from 'react';
import { cn } from 'src/lib/utils';

import { useDefaultMotion } from '../../motion/MotionProvider';
import { SegmentedControlContext } from './SegmentedControl.context';
import { useSelectionPill } from './SegmentedControl.hooks';
import type {
  SegmentedControlProps,
  SegmentedControlWithSubComponents,
} from './SegmentedControl.types';
import {
  segmentedControlGlideVariants,
  segmentedControlPillVariants,
  segmentedControlVariants,
} from './SegmentedControl.variants';
import { SegmentedControlIcon } from './SegmentedControlIcon';
import { SegmentedControlItem } from './SegmentedControlItem';

const SegmentedControl = React.forwardRef<HTMLDivElement, SegmentedControlProps>(
  (
    {
      children,
      size = 'md',
      variant = 'regular',
      className,
      value,
      defaultValue,
      onValueChange,
      disabled,
      defaultMotion,
      ...props
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const motion = useDefaultMotion(defaultMotion);
    const selection = useSelectionPill(motion);
    const composedRef = useComposedRefs(ref, selection.ref);

    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;

    const handleValueChange = (newValue: string) => {
      if (!newValue) return;

      if (!isControlled) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    };

    return (
      <SegmentedControlContext.Provider value={{ size, variant, motion }}>
        <RadioGroup.Root
          ref={composedRef}
          className={cn(
            segmentedControlVariants({ size, variant }),
            segmentedControlGlideVariants({ enabled: motion }),
            className,
          )}
          value={currentValue}
          onValueChange={handleValueChange}
          disabled={disabled}
          data-slot="segmented-control"
          {...props}
        >
          {children}
          {motion && selection.pill && (
            <span
              aria-hidden
              className={segmentedControlPillVariants({ size, animate: selection.pill.animate })}
              style={{
                width: selection.pill.width,
                height: selection.pill.height,
                transform: `translate(${selection.pill.x}px, ${selection.pill.y}px)`,
                opacity: selection.pill.visible ? 1 : 0,
              }}
            />
          )}
        </RadioGroup.Root>
      </SegmentedControlContext.Provider>
    );
  },
) as SegmentedControlWithSubComponents;

SegmentedControl.displayName = 'SegmentedControl';
SegmentedControl.Item = SegmentedControlItem;
SegmentedControl.Icon = SegmentedControlIcon;

export { SegmentedControl };
