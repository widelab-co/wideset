import { cva } from 'class-variance-authority';
import { cn } from 'src/lib/utils';

import { boxFillMotion } from '../../motion/recipes';

export const checkboxVariants = cva(
  cn(
    'group relative flex cursor-pointer border',
    'disabled:wds-disabled focus-visible:wds-focus-visible',
    'radix-state-unchecked:disabled:border-ws-dynamic-secondary-disabled radix-state-unchecked:disabled:bg-ws-static-alpha-subtle',
    'radix-state-checked:disabled:border-none radix-state-checked:disabled:bg-ws-dynamic-primary-disabled',
    'radix-state-indeterminate:disabled:border-none radix-state-indeterminate:disabled:bg-ws-dynamic-primary-disabled',
  ),
  {
    variants: {
      size: {
        // my-ws-2 reproduces Figma's 16×20 Control Container (paddingTop/Bottom = 2)
        // so the sm control centers against the 20px label line.
        sm: 'w-ws-control-sm h-ws-control-sm rounded-ws-control-sm my-ws-2',
        lg: 'w-ws-control-md h-ws-control-md rounded-ws-control-md',
      },
      variant: {
        primary: cn(
          'outline-ws-dynamic-primary-strong-default',
          'disabled:text-ws-dynamic-on-primary-disabled',
          'focus-visible:bg-ws-static-highlight-base',

          'radix-state-unchecked:border-ws-static-strong',
          'radix-state-unchecked:bg-ws-static-highlight-base',
          'radix-state-unchecked:hover:border-ws-dynamic-secondary-hover',
          'radix-state-unchecked:active:border-ws-dynamic-secondary-pressed',

          'radix-state-checked:border-none',
          'radix-state-checked:bg-ws-dynamic-primary-default',
          'radix-state-checked:hover:bg-ws-dynamic-primary-hover',
          'radix-state-checked:hover:text-ws-dynamic-on-primary-hover',
          'radix-state-checked:active:bg-ws-dynamic-primary-pressed',
          'radix-state-checked:active:text-ws-dynamic-on-primary-pressed',

          'radix-state-indeterminate:border-none',
          'radix-state-indeterminate:bg-ws-dynamic-primary-default',
          'radix-state-indeterminate:hover:bg-ws-dynamic-primary-hover',
          'radix-state-indeterminate:hover:text-ws-dynamic-on-primary-hover',
          'radix-state-indeterminate:active:bg-ws-dynamic-primary-pressed',
          'radix-state-indeterminate:active:text-ws-dynamic-on-primary-pressed',
        ),
        danger: cn(
          'outline-ws-dynamic-danger-strong-default',
          'disabled:text-ws-dynamic-on-danger-disabled',
          'focus-visible:bg-ws-static-highlight-base',

          'radix-state-unchecked:border-ws-dynamic-danger-strong-default',
          'radix-state-unchecked:bg-ws-static-highlight-base',
          'radix-state-unchecked:hover:border-ws-dynamic-danger-strong-hover',
          'radix-state-unchecked:active:border-ws-dynamic-danger-strong-pressed',

          'radix-state-checked:border-none',
          'radix-state-checked:bg-ws-dynamic-danger-default',
          'radix-state-checked:text-ws-dynamic-on-danger-default',
          'radix-state-checked:hover:bg-ws-dynamic-danger-hover',
          'radix-state-checked:hover:text-ws-dynamic-on-danger-hover',
          'radix-state-checked:active:bg-ws-dynamic-danger-pressed',
          'radix-state-checked:active:text-ws-dynamic-on-danger-pressed',

          'radix-state-indeterminate:border-none',
          'radix-state-indeterminate:bg-ws-dynamic-danger-default',
          'radix-state-indeterminate:text-ws-dynamic-on-danger-default',
          'radix-state-indeterminate:hover:bg-ws-dynamic-danger-hover',
          'radix-state-indeterminate:hover:text-ws-dynamic-on-danger-hover',
          'radix-state-indeterminate:active:bg-ws-dynamic-danger-pressed',
          'radix-state-indeterminate:active:text-ws-dynamic-on-danger-pressed',
        ),
      },
    },
    defaultVariants: {
      size: 'lg',
      variant: 'primary',
    },
  },
);

export const checkboxMotionVariants = cva('', {
  variants: {
    enabled: { true: boxFillMotion, false: '' },
  },
  defaultVariants: { enabled: true },
});

export const checkboxIndicatorMotionVariants = cva('', {
  variants: {
    enabled: {
      true: cn(
        'animate-in fade-in-0 zoom-in-[0.4]',
        // Grows in without overshooting: the mark appears, nothing jumps past its size.
        'fill-mode-both duration-(--ws-motion-duration-fast) ease-(--ws-motion-ease-out)',
      ),
      false: '',
    },
  },
  defaultVariants: { enabled: true },
});

export const checkboxCheckedIndicatorVariants = cva(
  // size-ws-9 (=16px) pins the icon to Figma's 16×16 check-line instance at both sizes;
  // without it the icon renders at 1em and depends on inherited font-size.
  'group-radix-state-indeterminate:hidden group-radix-state-unchecked:hidden size-ws-9',
  {
    variants: {
      variant: {
        primary: cn(
          'text-ws-dynamic-on-primary-default',
          'group-disabled:text-ws-dynamic-on-primary-disabled',
        ),
        danger: cn(
          'text-ws-dynamic-on-danger-default',
          'group-disabled:text-ws-dynamic-on-danger-disabled',
        ),
      },
    },
  },
);

export const checkboxIndeterminateIndicatorVariants = cva(
  'group-radix-state-checked:hidden group-radix-state-unchecked:hidden h-[2px]',
  {
    variants: {
      variant: {
        primary: cn(
          'bg-(--ws-dynamic-text-on-primary-default)',
          'group-disabled:bg-(--ws-dynamic-text-on-primary-disabled)',
        ),
        danger: cn(
          'bg-(--ws-dynamic-text-on-danger-default)',
          'group-disabled:bg-(--ws-dynamic-text-on-danger-disabled)',
        ),
      },
      size: {
        sm: 'w-[10px]',
        lg: 'w-[10px]',
      },
    },
  },
);
