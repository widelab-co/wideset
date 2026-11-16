import * as SliderPrimitive from '@radix-ui/react-slider';
import React, { useState } from 'react';
import { cn } from 'src/lib/utils';

import type { SliderProps, SliderWithVariants } from './Slider.types';
import { SliderLabel } from './SliderLabel';
import { SliderThumb } from './SliderThumb';

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      className,
      children,
      type,
      min = 0,
      max = 100,
      value,
      defaultValue,
      onValueChange,
      step = 1,
      labels,
      showTooltipValue,
      defaultMotion,
      thumbAriaLabels,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      ...props
    },
    ref,
  ) => {
    const computedDefaultValue = defaultValue ?? (type === 'range' ? [min, max] : [min]);
    const [internalValue, setInternalValue] = useState<number[]>(value ?? computedDefaultValue);

    const currentValue = value ?? internalValue;

    const handleValueChange = (newValue: number[]) => {
      setInternalValue(newValue);
      onValueChange?.(newValue);
    };

    const getThumbLabel = (index: number) => {
      const own = thumbAriaLabels?.[index];
      if (own) return own;
      if (currentValue.length < 2) return ariaLabel;
      // Two thumbs under one name: prefix it so each thumb is still told apart.
      const endpoint = index === 0 ? 'Minimum' : 'Maximum';
      return ariaLabel ? `${endpoint} ${ariaLabel}` : endpoint;
    };

    const isLeftLabelVisible = labels === 'left' || labels === 'side';
    const isRightLabelVisible = labels === 'right' || labels === 'side';
    const isSideLayout = labels === 'left' || labels === 'right' || labels === 'side';

    return (
      <div
        ref={ref}
        data-slot="slider"
        className={cn(isSideLayout && 'gap-ws-9 flex items-center', className)}
      >
        {isLeftLabelVisible && <SliderLabel>{min}</SliderLabel>}
        <div className="w-full">
          <SliderPrimitive.Root
            className={cn(
              'h-ws-3 relative flex w-full touch-none items-center select-none',
              // Expands the click-to-seek target to the 24px WCAG 2.5.8 minimum
              // without adding to the layout box, which Figma pins to the track height.
              'before:-inset-y-ws-6 before:absolute before:inset-x-0 before:content-[""]',
            )}
            min={min}
            max={max}
            value={value}
            defaultValue={computedDefaultValue}
            onValueChange={handleValueChange}
            step={step}
            {...props}
          >
            <SliderPrimitive.Track className="rounded-ws-control-full bg-ws-static-alpha-strong h-ws-3 relative w-full grow overflow-hidden">
              <SliderPrimitive.Range
                className={cn(
                  'absolute h-full',
                  props.disabled
                    ? 'bg-ws-dynamic-primary-disabled'
                    : 'bg-ws-dynamic-primary-default',
                )}
              />
            </SliderPrimitive.Track>
            {currentValue.map((thumbValue, index) => (
              <SliderThumb
                key={index}
                value={thumbValue}
                showTooltipValue={showTooltipValue}
                aria-label={getThumbLabel(index)}
                aria-labelledby={ariaLabelledby}
                defaultMotion={defaultMotion}
              />
            ))}
            {children}
          </SliderPrimitive.Root>
          {labels === 'bottom' && (
            <div className="pt-ws-8 flex justify-between">
              <SliderLabel>{min}</SliderLabel>
              <SliderLabel>{max}</SliderLabel>
            </div>
          )}
        </div>
        {isRightLabelVisible && <SliderLabel>{max}</SliderLabel>}
      </div>
    );
  },
) as SliderWithVariants;

Slider.displayName = 'Slider';
Slider.Label = SliderLabel;

export { Slider };
