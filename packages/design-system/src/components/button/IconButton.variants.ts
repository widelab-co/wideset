import { cva } from 'class-variance-authority';
import { cn } from 'src/lib/utils';

import { hoverTintMotion, pressMotion } from '../../motion/recipes';
import {
  buttonClassNames,
  buttonSizeVariants,
  sharedButtonCompoundVariants,
  sharedButtonDefaultVariants,
  sharedButtonVariants,
} from './Button.variants';

const removePaddingClasses = (classes: string): string =>
  classes.replace(/(?<![\w-])(?:px|py)-ws-\d+(?![\w-])/g, '');

export const iconButtonVariants = cva(cn(buttonClassNames, 'shrink-0 px-0'), {
  variants: {
    ...sharedButtonVariants,
    size: {
      xs: cn(removePaddingClasses(buttonSizeVariants.xs), 'h-ws-forms-xs w-ws-forms-xs'),
      sm: cn(removePaddingClasses(buttonSizeVariants.sm), 'h-ws-forms-sm w-ws-forms-sm'),
      md: cn(removePaddingClasses(buttonSizeVariants.md), 'h-ws-forms-md w-ws-forms-md'),
      lg: cn(removePaddingClasses(buttonSizeVariants.lg), 'h-ws-forms-lg w-ws-forms-lg'),
    },
  },
  compoundVariants: sharedButtonCompoundVariants,
  defaultVariants: sharedButtonDefaultVariants,
});

export const iconButtonMotionVariants = cva('', {
  variants: {
    enabled: { true: cn(hoverTintMotion, pressMotion), false: '' },
  },
  defaultVariants: { enabled: true },
});
