import { cva } from 'class-variance-authority';
import { cn } from 'src/lib/utils';

import { hoverTintMotion } from '../../motion/recipes';

export const breadcrumbsDividerVariants = cva(
  cn(
    'typography-label-strong-sm h-ws-forms-sm min-h-ws-forms-sm flex items-center justify-center text-(--ws-static-stroke-strong)',
  ),
  {
    variants: {
      separator: {
        arrow: 'text-ws-static-subtle w-ws-7',
        slash: 'w-ws-4',
      },
    },
    defaultVariants: {
      separator: undefined,
    },
  },
);

export const breadcrumbsItemMotionVariants = cva('', {
  variants: {
    enabled: { true: hoverTintMotion, false: '' },
  },
  defaultVariants: { enabled: true },
});
