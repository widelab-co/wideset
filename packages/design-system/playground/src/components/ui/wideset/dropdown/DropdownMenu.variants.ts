import { cva } from 'class-variance-authority';

import { menuFadeMotion } from '@/lib/wideset/motion/recipes';

export const dropdownMenuContentMotionVariants = cva('', {
  variants: {
    enabled: { true: menuFadeMotion, false: '' },
  },
  defaultVariants: { enabled: true },
});
