import { cva } from 'class-variance-authority';
import { cn } from 'src/lib/utils';

import { hoverTintMotion, pressMotion } from '../../motion/recipes';

export const multiSelectTriggerVariants = cva('', {
  variants: {
    // Text (placeholder, "2 values selected") keeps SelectTrigger's inset (12 / 16 / 16px), as in
    // Figma; tags sit closer to the edge, 4 / 8 / 8px, the same as above and below them.
    size: {
      sm: 'py-ws-3',
      md: 'py-ws-5',
      lg: 'py-ws-5',
    },
    tagsGrow: {
      true: 'h-auto max-h-none overflow-visible',
      false: '',
    },
    tags: {
      true: '',
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
    { size: 'sm', tags: true, class: 'ps-ws-3' },
    { size: 'md', tags: true, class: 'ps-ws-5' },
    { size: 'lg', tags: true, class: 'ps-ws-5' },
  ],
  defaultVariants: {
    size: 'md',
    tagsGrow: false,
    tags: false,
  },
});

// Figma keeps the tags one tag inset (4 / 8 / 8px) from what follows them, not the text inset the
// arrow and the clear button are placed after.
export const multiSelectValueRowVariants = cva('', {
  variants: {
    tags: {
      true: '-me-ws-5',
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
