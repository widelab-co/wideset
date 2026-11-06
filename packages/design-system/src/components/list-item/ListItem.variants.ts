import { cva } from 'class-variance-authority';
import { cn } from 'src/lib/utils';

import { hoverTintMotion, pressMotion } from '../../motion/recipes';

export const listItemVariants = cva(
  cn(
    // Figma renders menu row labels at Font/Weight/Normal (480). Shared by every
    // dropdown, select and menu in the library.
    'rounded-ws-control-md typography-label-sm gap-ws-5 px-ws-5 py-ws-3 flex cursor-pointer flex-row items-center justify-between focus:outline-none',
    'aria-disabled:cursor-default aria-disabled:bg-none aria-disabled:select-none',
  ),
  {
    variants: {
      variant: {
        primary: cn(
          'bg-ws-dynamic-secondary-alpha-default text-ws-dynamic-secondary-default',
          'hover:not-aria-disabled:bg-ws-dynamic-secondary-alpha-hover hover:not-aria-disabled:text-ws-dynamic-secondary-hover',
          'active:not-aria-disabled:bg-ws-dynamic-secondary-alpha-pressed active:not-aria-disabled:text-ws-dynamic-secondary-pressed',
          'focus:not-aria-disabled:bg-ws-dynamic-secondary-alpha-hover focus:not-aria-disabled:text-ws-dynamic-secondary-default',
          'data-[highlighted]:not-aria-disabled:bg-ws-dynamic-secondary-alpha-hover data-[highlighted]:not-aria-disabled:text-ws-dynamic-secondary-default',
          'data-[state=checked]:not-aria-disabled:bg-ws-dynamic-primary-alpha-strong-default',
          'aria-disabled:text-ws-dynamic-secondary-disabled',
        ),
        danger: cn(
          'bg-ws-dynamic-danger-alpha-default text-ws-dynamic-danger-default',
          'hover:not-aria-disabled:bg-ws-dynamic-danger-alpha-hover hover:not-aria-disabled:text-ws-dynamic-danger-hover',
          'active:not-aria-disabled:bg-ws-dynamic-danger-alpha-pressed active:not-aria-disabled:text-ws-dynamic-danger-pressed',
          'focus:not-aria-disabled:bg-ws-dynamic-danger-alpha-hover focus:not-aria-disabled:text-ws-dynamic-danger-default',
          'data-[highlighted]:not-aria-disabled:bg-ws-dynamic-danger-alpha-hover data-[highlighted]:not-aria-disabled:text-ws-dynamic-danger-default',
          'data-[state=checked]:not-aria-disabled:bg-ws-dynamic-danger-alpha-strong-default data-[state=checked]:not-aria-disabled:text-ws-dynamic-danger-default',
          'aria-disabled:text-ws-dynamic-danger-disabled',
        ),
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
);

// Figma's selected Menu Item: a 20px check-line in Dynamic/Text/Primary/Default, Primary/Disabled
// on a disabled row (read from the row's aria-disabled, which Radix items set). Danger rows have
// no selected state in Figma, so their check keeps the row's colour.
export const listItemCheckVariants = cva('size-ws-11 shrink-0', {
  variants: {
    variant: {
      primary: 'text-ws-dynamic-primary-default in-aria-disabled:text-ws-dynamic-primary-disabled',
      danger: '',
    },
  },
  defaultVariants: { variant: 'primary' },
});

export const listItemMotionVariants = cva('', {
  variants: {
    enabled: { true: cn(hoverTintMotion, pressMotion), false: '' },
  },
  defaultVariants: { enabled: true },
});

export const listItemDescriptionVariants = cva('typography-body-sm truncate', {
  variants: {
    variant: {
      primary: 'text-ws-static-subtle',
      danger: 'text-ws-dynamic-danger-default',
    },
    disabled: {
      true: 'text-ws-dynamic-secondary-disabled',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'primary',
    disabled: false,
  },
});
