import { cva } from 'class-variance-authority';

import { fieldFocusMotion } from '../../motion/recipes';

export const comboBoxTriggerMotionVariants = cva('', {
  variants: {
    enabled: { true: fieldFocusMotion, false: '' },
  },
  defaultVariants: { enabled: true },
});
