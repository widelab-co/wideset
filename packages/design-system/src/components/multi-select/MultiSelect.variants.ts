import { cva } from 'class-variance-authority';
import { cn } from 'src/lib/utils';

import { hoverTintMotion, pressMotion } from '../../motion/recipes';

export const multiSelectTriggerVariants = cva('', {
  variants: {
    // The trigger keeps SelectTrigger's inset (12 / 16 / 16px) for text (placeholder, "2 values
    // selected"), as in Figma; the value row brings tags closer to the edge.
    size: {
      sm: 'py-ws-3',
      md: 'py-ws-5',
      lg: 'py-ws-5',
    },
    tagsGrow: {
      true: 'h-auto max-h-none overflow-visible',
      false: '',
    },
  },
  compoundVariants: [
    { size: 'sm', tagsGrow: false, class: 'h-ws-14' },
    { size: 'md', tagsGrow: false, class: 'h-ws-16' },
    { size: 'lg', tagsGrow: false, class: 'h-ws-18' },
    { size: 'sm', tagsGrow: true, class: 'min-h-ws-14' },
    { size: 'md', tagsGrow: true, class: 'min-h-ws-16' },
    { size: 'lg', tagsGrow: true, class: 'min-h-ws-18' },
  ],
  defaultVariants: {
    size: 'md',
    tagsGrow: false,
  },
});

// Figma sets tags one tag inset (4 / 8 / 8px) from the edge and from what follows them, 8px closer
// than text on both sides.
export const multiSelectValueRowVariants = cva('', {
  variants: {
    tags: {
      true: '-mx-ws-5',
      false: '',
    },
  },
  defaultVariants: {
    tags: false,
  },
});

export const multiSelectTagRemoveMotionVariants = cva('', {
  variants: {
    enabled: { true: cn(hoverTintMotion, pressMotion), false: '' },
  },
  defaultVariants: { enabled: true },
});
