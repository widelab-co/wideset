import type * as SliderPrimitive from '@radix-ui/react-slider';
import type React from 'react';

import type { MotionProps } from '../../motion/Motion.types';
import type { SliderLabel } from './SliderLabel';

/** The text label associated with `Slider`. */
export type SliderLabelProps = React.HTMLAttributes<HTMLSpanElement>;

export type SliderTooltipPosition = 'top' | 'right' | 'bottom' | 'left';

export type ShowTooltipValue = boolean | SliderTooltipPosition;

/** A draggable thumb with an optional value tooltip. */
export type SliderThumbProps = MotionProps &
  Pick<React.AriaAttributes, 'aria-label' | 'aria-labelledby'> & {
    /** Numeric value displayed in this thumb tooltip. */
    value?: number;
    /** Show tooltip with current value */
    showTooltipValue?: ShowTooltipValue;
  };

/** A single value or range selected along a track. */
export type SliderProps = React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> &
  MotionProps & {
    /** @deprecated The value's length sets the number of thumbs. */
    type?: 'single' | 'range';
    /** @deprecated Compose `Slider.Label` next to the slider. */
    labels?: 'left' | 'right' | 'side' | 'bottom';
    /** Show tooltip with current value */
    showTooltipValue?: ShowTooltipValue;
    /** Accessible name of the thumbs. A range prefixes it with `Minimum` / `Maximum` per thumb. */
    'aria-label'?: string;
    /** Id of the label that names the thumbs. */
    'aria-labelledby'?: string;
    /** Accessible name per thumb, in order, e.g. `['Minimum price', 'Maximum price']`. */
    thumbAriaLabels?: string[];
    /** Content rendered inside the slider, after the thumbs. */
    children?: React.ReactNode;
  };

export type SliderWithVariants = React.ForwardRefExoticComponent<
  React.PropsWithoutRef<SliderProps> & React.RefAttributes<HTMLDivElement>
> & {
  Label: typeof SliderLabel;
};
