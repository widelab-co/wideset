import { cva } from 'class-variance-authority';
import { cn } from 'src/lib/utils';

import { hoverTintMotion } from '../../motion/recipes';
import {
  buttonClassNames,
  buttonSizeVariants,
  sharedButtonDefaultVariants,
  sharedButtonVariants,
} from './Button.variants';

export const splitButtonWrapperVariants = cva('inline-flex w-fit');

// No pressMotion: a half that shrank alone would open the seam between the two.
export const splitButtonMotionVariants = cva('', {
  variants: {
    enabled: { true: hoverTintMotion, false: '' },
  },
  defaultVariants: { enabled: true },
});

export const splitButtonTriggerMotionVariants = cva('', {
  variants: {
    enabled: { true: hoverTintMotion, false: '' },
  },
  defaultVariants: { enabled: true },
});

export const splitButtonMainVariants = cva(
  cn(buttonClassNames, 'focus-visible:z-ws-base min-w-0 flex-1 rounded-r-none'),
  {
    variants: {
      variant: sharedButtonVariants.variant,
      preset: {
        filled: '',
        border: 'border border-r-0',
      },
      size: {
        xs: cn(buttonSizeVariants.xs, 'rounded-none rounded-l-[var(--radius-ws-control-md)]'),
        sm: cn(buttonSizeVariants.sm, 'rounded-none rounded-l-[var(--radius-ws-control-lg)]'),
        md: cn(buttonSizeVariants.md, 'rounded-none rounded-l-[var(--radius-ws-control-lg)]'),
        lg: cn(buttonSizeVariants.lg, 'rounded-none rounded-l-[var(--radius-ws-control-xl)]'),
      },
    },
    compoundVariants: [
      {
        variant: 'primary',
        preset: 'filled',
        className: cn(
          'bg-ws-dynamic-primary-default text-ws-dynamic-on-primary-default outline-ws-dynamic-primary-strong-default',
          'hover:bg-ws-dynamic-primary-hover',
          'active:bg-ws-dynamic-primary-pressed',
          'disabled:bg-ws-dynamic-primary-disabled disabled:text-ws-dynamic-on-primary-disabled',
        ),
      },
      {
        variant: 'secondary',
        preset: 'filled',
        className: cn(
          'bg-ws-dynamic-secondary-default text-ws-dynamic-on-secondary-default outline-ws-dynamic-primary-strong-default',
          'hover:bg-ws-dynamic-secondary-hover hover:text-ws-dynamic-on-secondary-hover',
          'active:bg-ws-dynamic-secondary-pressed active:text-ws-dynamic-on-secondary-pressed',
          'disabled:bg-ws-dynamic-secondary-disabled disabled:text-ws-dynamic-on-secondary-disabled',
        ),
      },
      {
        variant: 'danger',
        preset: 'filled',
        className: cn(
          'bg-ws-dynamic-danger-default text-ws-dynamic-on-danger-default outline-ws-dynamic-danger-strong-default',
          'hover:bg-ws-dynamic-danger-hover',
          'active:bg-ws-dynamic-danger-pressed',
          'disabled:bg-ws-dynamic-danger-disabled disabled:text-ws-dynamic-on-danger-disabled',
        ),
      },
      {
        variant: 'success',
        preset: 'filled',
        className: cn(
          'bg-ws-dynamic-success-default text-ws-dynamic-on-success-default outline-ws-dynamic-success-strong-default',
          'hover:bg-ws-dynamic-success-hover',
          'active:bg-ws-dynamic-success-pressed',
          'disabled:bg-ws-dynamic-success-disabled disabled:text-ws-dynamic-on-success-disabled',
        ),
      },
      {
        variant: 'inverse',
        preset: 'filled',
        className: cn(
          'bg-ws-dynamic-inverse-default text-ws-dynamic-on-inverse-default outline-ws-dynamic-primary-strong-default',
          'hover:bg-ws-dynamic-inverse-hover',
          'active:bg-ws-dynamic-inverse-pressed',
          'disabled:bg-ws-dynamic-inverse-disabled disabled:text-ws-dynamic-on-inverse-disabled',
        ),
      },
      {
        variant: 'primary',
        preset: 'border',
        className: cn(
          'border-ws-dynamic-primary-default bg-ws-static-highlight-subtle text-ws-dynamic-primary-default outline-ws-dynamic-primary-strong-default',
          'hover:border-ws-dynamic-primary-hover hover:text-ws-dynamic-primary-hover',
          'active:border-ws-dynamic-primary-pressed active:text-ws-dynamic-primary-pressed',
          'disabled:border-ws-dynamic-primary-disabled disabled:text-ws-dynamic-primary-disabled',
        ),
      },
      {
        variant: 'secondary',
        preset: 'border',
        className: cn(
          'border-ws-dynamic-secondary-default bg-ws-static-highlight-subtle text-ws-dynamic-secondary-default outline-ws-dynamic-primary-strong-default',
          'hover:border-ws-dynamic-secondary-hover hover:text-ws-dynamic-secondary-hover',
          'active:border-ws-dynamic-secondary-pressed active:text-ws-dynamic-secondary-pressed',
          'disabled:border-ws-dynamic-secondary-disabled disabled:text-ws-dynamic-secondary-disabled',
        ),
      },
      {
        variant: 'danger',
        preset: 'border',
        className: cn(
          'border-ws-dynamic-danger-default bg-ws-static-highlight-subtle text-ws-dynamic-danger-default outline-ws-dynamic-danger-strong-default',
          'hover:border-ws-dynamic-danger-hover hover:text-ws-dynamic-danger-hover',
          'active:border-ws-dynamic-danger-pressed active:text-ws-dynamic-danger-pressed',
          'disabled:border-ws-dynamic-danger-disabled disabled:text-ws-dynamic-danger-disabled',
        ),
      },
      {
        variant: 'success',
        preset: 'border',
        className: cn(
          'border-ws-dynamic-success-default bg-ws-static-highlight-subtle text-ws-dynamic-success-default outline-ws-dynamic-success-strong-default',
          'hover:border-ws-dynamic-success-hover hover:text-ws-dynamic-success-hover',
          'active:border-ws-dynamic-success-pressed active:text-ws-dynamic-success-pressed',
          'disabled:border-ws-dynamic-success-disabled disabled:text-ws-dynamic-success-disabled',
        ),
      },
      {
        variant: 'inverse',
        preset: 'border',
        className: cn(
          'border-ws-dynamic-inverse-default bg-ws-static-highlight-subtle text-ws-dynamic-inverse-default outline-ws-dynamic-primary-strong-default',
          'focus:not-active:bg-ws-static-highlight-subtle',
          'hover:border-ws-dynamic-inverse-hover hover:text-ws-dynamic-inverse-hover',
          'active:border-ws-dynamic-inverse-pressed active:text-ws-dynamic-inverse-pressed',
          'disabled:border-ws-dynamic-inverse-disabled disabled:text-ws-dynamic-inverse-disabled',
        ),
      },
    ],
    defaultVariants: sharedButtonDefaultVariants,
  },
);

export const splitButtonIconButtonVariants = cva(
  cn(buttonClassNames, 'focus-visible:z-ws-base rounded-l-none'),
  {
    variants: {
      variant: sharedButtonVariants.variant,
      preset: {
        filled: 'border-l',
        border: 'border',
      },
      size: {
        xs: cn('w-ws-forms-xs', 'rounded-r-[var(--radius-ws-control-md)]'),
        sm: cn('w-ws-forms-sm', 'rounded-r-[var(--radius-ws-control-lg)]'),
        md: cn('w-ws-forms-md', 'rounded-r-[var(--radius-ws-control-lg)]'),
        lg: cn('w-ws-forms-lg', 'rounded-r-[var(--radius-ws-control-xl)]'),
      },
    },
    compoundVariants: [
      {
        variant: 'primary',
        preset: 'filled',
        className: cn(
          'bg-ws-dynamic-primary-default text-ws-dynamic-on-primary-default outline-ws-dynamic-primary-strong-default',
          'border-(--ws-static-stroke-inverse-strong)',
          'hover:bg-ws-dynamic-primary-hover',
          'active:bg-ws-dynamic-primary-pressed',
          'disabled:bg-ws-dynamic-primary-disabled disabled:text-ws-dynamic-on-primary-disabled disabled:border-ws-dynamic-primary-disabled',
        ),
      },
      {
        variant: 'secondary',
        preset: 'filled',
        className: cn(
          'bg-ws-dynamic-secondary-default text-ws-dynamic-on-secondary-default outline-ws-dynamic-primary-strong-default',
          'border-(--ws-static-text-inverse-base)',
          'hover:bg-ws-dynamic-secondary-hover hover:text-ws-dynamic-on-secondary-hover',
          'active:bg-ws-dynamic-secondary-pressed active:text-ws-dynamic-on-secondary-pressed',
          'disabled:bg-ws-dynamic-secondary-disabled disabled:text-ws-dynamic-on-secondary-disabled disabled:border-ws-dynamic-secondary-disabled',
        ),
      },
      {
        variant: 'danger',
        preset: 'filled',
        className: cn(
          'bg-ws-dynamic-danger-default text-ws-dynamic-on-danger-default outline-ws-dynamic-danger-strong-default',
          'border-(--ws-static-stroke-inverse-strong)',
          'hover:bg-ws-dynamic-danger-hover',
          'active:bg-ws-dynamic-danger-pressed',
          'disabled:bg-ws-dynamic-danger-disabled disabled:text-ws-dynamic-on-danger-disabled disabled:border-ws-dynamic-danger-disabled',
        ),
      },
      {
        variant: 'success',
        preset: 'filled',
        className: cn(
          'bg-ws-dynamic-success-default text-ws-dynamic-on-success-default outline-ws-dynamic-success-strong-default',
          'border-(--ws-static-stroke-inverse-strong)',
          'hover:bg-ws-dynamic-success-hover',
          'active:bg-ws-dynamic-success-pressed',
          'disabled:bg-ws-dynamic-success-disabled disabled:text-ws-dynamic-on-success-disabled disabled:border-ws-dynamic-success-disabled',
        ),
      },
      {
        variant: 'inverse',
        preset: 'filled',
        className: cn(
          'bg-ws-dynamic-inverse-default text-ws-dynamic-on-inverse-default outline-ws-dynamic-primary-strong-default',
          'border-(--ws-static-stroke-strong)',
          'hover:bg-ws-dynamic-inverse-hover',
          'active:bg-ws-dynamic-inverse-pressed',
          'disabled:bg-ws-dynamic-inverse-disabled disabled:text-ws-dynamic-on-inverse-disabled disabled:border-ws-dynamic-inverse-disabled',
        ),
      },
      {
        variant: 'primary',
        preset: 'border',
        className: cn(
          'bg-ws-static-highlight-subtle text-ws-dynamic-primary-default outline-ws-dynamic-primary-strong-default',
          'border-ws-dynamic-primary-default',
          'hover:border-ws-dynamic-primary-hover hover:text-ws-dynamic-primary-hover',
          'active:border-ws-dynamic-primary-pressed active:text-ws-dynamic-primary-pressed',
          'disabled:border-ws-dynamic-primary-disabled disabled:text-ws-dynamic-primary-disabled',
        ),
      },
      {
        variant: 'secondary',
        preset: 'border',
        className: cn(
          'bg-ws-static-highlight-subtle text-ws-dynamic-secondary-default outline-ws-dynamic-primary-strong-default',
          'border-ws-dynamic-secondary-default',
          'hover:border-ws-dynamic-secondary-hover hover:text-ws-dynamic-secondary-hover',
          'active:border-ws-dynamic-secondary-pressed active:text-ws-dynamic-secondary-pressed',
          'disabled:border-ws-dynamic-secondary-disabled disabled:text-ws-dynamic-secondary-disabled',
        ),
      },
      {
        variant: 'danger',
        preset: 'border',
        className: cn(
          'bg-ws-static-highlight-subtle text-ws-dynamic-danger-default outline-ws-dynamic-danger-strong-default',
          'border-ws-dynamic-danger-default',
          'hover:border-ws-dynamic-danger-hover hover:text-ws-dynamic-danger-hover',
          'active:border-ws-dynamic-danger-pressed active:text-ws-dynamic-danger-pressed',
          'disabled:border-ws-dynamic-danger-disabled disabled:text-ws-dynamic-danger-disabled',
        ),
      },
      {
        variant: 'success',
        preset: 'border',
        className: cn(
          'bg-ws-static-highlight-subtle text-ws-dynamic-success-default outline-ws-dynamic-success-strong-default',
          'border-ws-dynamic-success-default',
          'hover:border-ws-dynamic-success-hover hover:text-ws-dynamic-success-hover',
          'active:border-ws-dynamic-success-pressed active:text-ws-dynamic-success-pressed',
          'disabled:border-ws-dynamic-success-disabled disabled:text-ws-dynamic-success-disabled',
        ),
      },
      {
        variant: 'inverse',
        preset: 'border',
        className: cn(
          'bg-ws-static-highlight-subtle text-ws-dynamic-inverse-default outline-ws-dynamic-primary-strong-default',
          'border-ws-dynamic-inverse-default',
          'focus:not-active:bg-ws-static-highlight-subtle',
          'hover:border-ws-dynamic-inverse-hover hover:text-ws-dynamic-inverse-hover',
          'active:border-ws-dynamic-inverse-pressed active:text-ws-dynamic-inverse-pressed',
          'disabled:border-ws-dynamic-inverse-disabled disabled:text-ws-dynamic-inverse-disabled',
        ),
      },
    ],
    defaultVariants: sharedButtonDefaultVariants,
  },
);

export const splitButtonContentVariants = cva(
  'relative inline-flex min-w-0 items-center justify-center',
  {
    variants: {
      size: {
        xs: 'gap-ws-2',
        sm: 'gap-ws-2',
        md: 'gap-ws-3',
        lg: 'gap-ws-4',
      },
    },
  },
);

export const splitButtonIconVariants = cva('', {
  variants: {
    size: {
      xs: 'h-ws-8 w-ws-8',
      sm: 'h-ws-9 w-ws-9',
      md: 'h-ws-11 w-ws-11',
      lg: 'h-ws-11 w-ws-11',
    },
  },
});
