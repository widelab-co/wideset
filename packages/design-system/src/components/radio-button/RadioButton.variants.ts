import { cva } from 'class-variance-authority';
import { cn } from 'src/lib/utils';

import { boxFillMotion } from '../../motion/recipes';

export const radioVariants = cva(
  cn(
    'group relative box-border flex cursor-pointer border',
    'disabled:wds-disabled focus-visible:wds-focus-visible focus-visible:bg-ws-static-highlight-base',
    'radix-state-checked:border-2',
    'radix-state-checked:disabled:bg-ws-dynamic-secondary-alpha-default',
    'radix-state-checked:disabled:border-ws-dynamic-secondary-disabled',
  ),
  {
    variants: {
      size: {
        // my-ws-2 reproduces Figma's 16×20 Control Container (paddingTop/Bottom = 2)
        // so the sm control centers against the 20px label line.
        sm: 'size-ws-control-sm my-ws-2 rounded-full',
        lg: 'size-ws-control-md rounded-full',
      },
      variant: {
        primary: cn(
          'outline-ws-dynamic-primary-strong-default bg-ws-static-highlight-base border-ws-static-strong',

          'radix-state-unchecked:border-ws-static-strong',
          'radix-state-unchecked:hover:border-ws-dynamic-secondary-hover',
          'radix-state-unchecked:active:border-ws-dynamic-secondary-pressed',
          'radix-state-unchecked:disabled:bg-ws-dynamic-secondary-alpha-default',
          'radix-state-unchecked:disabled:border-ws-dynamic-secondary-disabled',

          'radix-state-checked:border-ws-dynamic-primary-strong-default',
          'radix-state-checked:bg-ws-dynamic-secondary-alpha-default',
          'radix-state-checked:hover:bg-ws-dynamic-primary-alpha-hover',
          'radix-state-checked:hover:border-ws-dynamic-primary-strong-hover',
          'radix-state-checked:active:bg-ws-dynamic-primary-alpha-pressed',
          'radix-state-checked:active:border-ws-dynamic-primary-strong-pressed',
        ),
        danger: cn(
          'outline-ws-dynamic-danger-strong-default bg-ws-static-highlight-base border-ws-dynamic-danger-strong-default',

          'radix-state-unchecked:border-ws-dynamic-danger-strong-default',
          'radix-state-unchecked:hover:border-ws-dynamic-danger-strong-hover',
          'radix-state-unchecked:active:border-ws-dynamic-danger-strong-pressed',
          'radix-state-unchecked:disabled:bg-ws-dynamic-secondary-alpha-default',
          'radix-state-unchecked:disabled:border-ws-dynamic-secondary-disabled',

          'radix-state-checked:bg-ws-dynamic-danger-alpha-default',
          'radix-state-checked:hover:bg-ws-dynamic-danger-alpha-hover',
          'radix-state-checked:hover:border-ws-dynamic-danger-strong-hover',
          'radix-state-checked:active:bg-ws-dynamic-danger-alpha-pressed',
          'radix-state-checked:active:border-ws-dynamic-danger-strong-pressed',
        ),
      },
    },
    defaultVariants: {
      size: 'lg',
      variant: 'primary',
    },
  },
);

export const radioMotionVariants = cva('', {
  variants: {
    enabled: { true: boxFillMotion, false: '' },
  },
  defaultVariants: { enabled: true },
});

export const radioIndicatorMotionVariants = cva('', {
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

export const radioIndicatorVariants = cva(
  cn(
    'rounded-full',
    'group-radix-state-unchecked:hidden group-disabled:bg-ws-dynamic-primary-disabled',
  ),
  {
    variants: {
      variant: {
        primary: cn(
          'bg-ws-dynamic-primary-default',
          'group-hover:bg-ws-dynamic-primary-hover',
          'group-active:bg-ws-dynamic-primary-pressed',
        ),
        danger: cn(
          'bg-ws-dynamic-danger-default',
          'group-hover:bg-ws-dynamic-danger-hover',
          'group-active:bg-ws-dynamic-danger-pressed',
        ),
      },
      size: {
        // Figma binds the sm dot to Size/5 (=8px); the lg dot is an unbound raw 10px in Figma.
        sm: 'size-ws-5',
        lg: 'h-[10px] w-[10px]',
      },
    },
  },
);
