import { cva } from 'class-variance-authority';

import { hoverTintMotion } from '../../motion/recipes';

export const multiSelectTriggerVariants = cva('', {
  variants: {
    // No pl-* override: the left inset comes from SelectTrigger's own px
    // (12/16/16px) — Figma insets the multi-select content exactly like the
    // plain Select's.
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

export const multiSelectTagRemoveMotionVariants = cva('', {
  variants: {
    enabled: { true: hoverTintMotion, false: '' },
  },
  defaultVariants: { enabled: true },
});
