import { cva } from 'class-variance-authority';
import { cn } from 'src/lib/utils';

import { hoverTintMotion } from '../../motion/recipes';

export const datePickerTriggerVariants = cva('focus-within:outline-hidden', {
  variants: {
    preset: {
      border: '',
      ghost: 'shadow-none',
    },
    variant: {
      primary: cn(
        'group-focus-visible:border-ws-dynamic-primary-strong-default',
        'group-focus-visible:shadow-ws-forms-active',
      ),
      danger: cn(
        'group-focus-visible:border-ws-dynamic-danger-strong-default',
        'group-focus-visible:shadow-ws-forms-active-danger',
      ),
    },
  },
  defaultVariants: {
    preset: 'border',
    variant: 'primary',
  },
});

export const datePickerTriggerMotionVariants = cva('', {
  variants: {
    enabled: { true: hoverTintMotion, false: '' },
  },
  defaultVariants: { enabled: true },
});
