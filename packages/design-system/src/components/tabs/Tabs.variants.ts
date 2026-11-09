import { cva } from 'class-variance-authority';
import { cn } from 'src/lib/utils';

import { hoverTintMotion, pressMotion } from '../../motion/recipes';

export const tabsVariants = cva(`text-ws-static-base flex flex-col`, {
  variants: {
    type: {
      regular: '',
      fullWidth: 'w-full flex-1 justify-stretch',
      pills: '',
      ghost: '',
    },
    size: {
      sm: '',
      lg: '',
    },
  },
  defaultVariants: {
    type: 'regular',
    size: 'sm',
  },
});

export const tabsListVariants = cva('relative flex', {
  variants: {
    type: {
      regular: 'gap-ws-12 w-fit',
      fullWidth: 'w-full justify-stretch',
      pills: 'gap-ws-5 w-fit',
      ghost: 'gap-ws-3 isolate w-fit',
    },
    size: {
      sm: '',
      lg: '',
    },
  },
  defaultVariants: {
    type: 'regular',
    size: 'sm',
  },
});

export const tabsIndicatorVariants = cva('pointer-events-none absolute left-0', {
  variants: {
    type: {
      regular: 'bottom-[-1px] h-[2px] bg-(--border-color-ws-dynamic-secondary-strong-default)',
      fullWidth: 'bottom-[-1px] h-[2px] bg-(--border-color-ws-dynamic-secondary-strong-default)',
      pills: 'hidden',
      ghost:
        'rounded-ws-control-lg bg-ws-dynamic-tertiary-alpha-strong-default inset-y-0 -z-[var(--ws-z-index-base)]',
    },
    animate: {
      true: 'transition-[transform,width,opacity] duration-(--ws-motion-duration-fast) ease-(--ws-motion-ease-smooth-out)',
      false: '',
    },
  },
  defaultVariants: { type: 'regular' },
});

export const tabsItemVariants = cva(
  cn(
    'text-ws-static-base focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default box-border flex cursor-pointer items-center justify-center',
    'disabled:text-ws-static-subtle disabled:pointer-events-none disabled:cursor-not-allowed',
  ),
  {
    variants: {
      type: {
        regular: cn(
          'mb-[-1px] border-b-2 border-b-transparent',
          'hover:border-ws-dynamic-secondary-hover',
        ),
        fullWidth: cn(
          'px-ws-9 mb-[-1px] flex-1 border-b-2 border-b-transparent',
          'hover:border-ws-dynamic-secondary-hover',
        ),
        pills: cn(
          // The border stays (transparent) so every state keeps the same box.
          'rounded-ws-control-full text-ws-static-subtle border-1 border-transparent',
          '[&_svg]:text-current',
          'not-aria-selected:not-data-active:hover:bg-ws-dynamic-tertiary-alpha-hover hover:text-ws-static-strong',
          'not-aria-selected:not-data-active:active:bg-ws-dynamic-tertiary-alpha-pressed',
          // Neutral selected fill, stronger than a hover; brand stays with the primary button.
          'aria-selected:bg-ws-dynamic-tertiary-alpha-strong-hover aria-selected:text-ws-static-strong',
          'data-active:bg-ws-dynamic-tertiary-alpha-strong-hover data-active:text-ws-static-strong',
        ),
        ghost: cn(
          'rounded-ws-control-lg text-ws-static-subtle hover:text-ws-static-strong',
          '[&_svg]:text-current',
          'aria-selected:text-ws-static-strong data-active:text-ws-static-strong',
        ),
      },
      size: {
        sm: 'typography-label-strong-sm',
        lg: 'typography-label-strong-md',
      },
    },
    compoundVariants: [
      {
        type: ['regular', 'fullWidth'],
        size: 'sm',
        className: 'gap-ws-3 pt-ws-6 pb-ws-5',
      },
      {
        type: ['regular', 'fullWidth'],
        size: 'lg',
        className: 'gap-ws-5 pt-ws-8 pb-ws-7',
      },
      {
        type: 'pills',
        size: 'sm',
        className: 'gap-ws-2 px-ws-5 py-ws-4',
      },
      {
        type: 'pills',
        size: 'lg',
        className: 'gap-ws-3 px-ws-9 py-ws-5',
      },
      {
        type: 'ghost',
        size: 'sm',
        className: 'gap-ws-4 px-ws-7 py-ws-4',
      },
      {
        type: 'ghost',
        size: 'lg',
        className: 'gap-ws-6 px-ws-9 py-ws-5',
      },
    ],
    defaultVariants: {
      type: 'regular',
      size: 'sm',
    },
  },
);

export const tabsItemMotionVariants = cva('', {
  variants: {
    enabled: {
      true: cn(hoverTintMotion, pressMotion),
      false: '',
    },
  },
  defaultVariants: { enabled: true },
});

// The count's digits sit Gap/5 (8px) after the label in every type and size, as in Figma.
// The item's own gap differs per type and size (see `tabsItemVariants`), so the count adds
// or takes back the difference with a margin.
export const tabsCountVariants = cva('', {
  variants: {
    type: {
      regular: '',
      fullWidth: '',
      pills: '',
      ghost: '',
    },
    size: {
      sm: '',
      lg: '',
    },
  },
  compoundVariants: [
    { type: ['regular', 'fullWidth'], size: 'sm', className: 'ml-ws-3' },
    { type: 'pills', size: 'sm', className: 'ml-ws-4' },
    { type: 'pills', size: 'lg', className: 'ml-ws-3' },
    { type: 'ghost', size: 'sm', className: 'ml-ws-2' },
    { type: 'ghost', size: 'lg', className: '-ml-ws-2' },
  ],
  defaultVariants: {
    type: 'regular',
    size: 'sm',
  },
});
