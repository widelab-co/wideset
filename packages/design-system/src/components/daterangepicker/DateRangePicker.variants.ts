import { cva } from 'class-variance-authority';

import { hoverTintMotion } from '../../motion/recipes';

export const dateRangePickerPresetMotionVariants = cva('', {
  variants: {
    enabled: { true: hoverTintMotion, false: '' },
  },
  defaultVariants: { enabled: true },
});
