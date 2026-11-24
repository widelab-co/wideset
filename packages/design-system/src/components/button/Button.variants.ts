import { cva } from 'class-variance-authority';
import { cn } from 'src/lib/utils';

import { hoverTintMotion, pressMotion } from '../../motion/recipes';

export const buttonClassNames =
  'w-fit whitespace-nowrap box-border relative inline-flex cursor-pointer items-center justify-center focus-visible:wds-focus-visible focus-visible:select-none disabled:pointer-events-none disabled:cursor-default';

export const sharedButtonVariants = {
  variant: {
    primary: '',
    secondary: '',
    danger: '',
    success: '',
    inverse: '',
  },
  preset: {
    filled: '',
    border: 'border',
    ghost: '',
  },
};

// Height comes from the Components/Forms/* token, as in Figma, rather than
// being derived from padding + line-height. Figma binds the frame height and
// sets vertical padding to Gap/0, so there is no py-* here by design.
export const buttonSizeVariants = {
  xs: 'typography-caption-strong-md h-ws-forms-xs gap-ws-2 rounded-ws-control-md px-ws-4',
  sm: 'typography-label-strong-sm h-ws-forms-sm gap-ws-2 rounded-ws-control-lg px-ws-6',
  md: 'typography-label-strong-sm h-ws-forms-md gap-ws-3 rounded-ws-control-lg px-ws-7',
  lg: 'typography-label-strong-md h-ws-forms-lg gap-ws-4 rounded-ws-control-xl px-ws-9',
};

type SharedVariantKeys = {
  variant: keyof typeof sharedButtonVariants.variant;
  preset: keyof typeof sharedButtonVariants.preset;
};

export const sharedButtonCompoundVariants = [
  {
    variant: 'primary',
    preset: 'filled',
    className: cn(
      'bg-ws-dynamic-primary-default shadow-ws-controls-control text-ws-dynamic-on-primary-default outline-ws-dynamic-primary-strong-default',
      'hover:bg-ws-dynamic-primary-hover',
      'active:bg-ws-dynamic-primary-pressed',
      'disabled:bg-ws-dynamic-primary-disabled disabled:text-ws-dynamic-on-primary-disabled',
    ),
  },
  {
    variant: 'secondary',
    preset: 'filled',
    className: cn(
      'bg-ws-dynamic-secondary-default shadow-ws-controls-control text-ws-dynamic-on-secondary-default outline-ws-dynamic-primary-strong-default',
      'hover:bg-ws-dynamic-secondary-hover hover:text-ws-dynamic-on-secondary-hover',
      'active:bg-ws-dynamic-secondary-pressed active:text-ws-dynamic-on-secondary-pressed',
      'disabled:bg-ws-dynamic-secondary-disabled disabled:text-ws-dynamic-on-secondary-disabled',
    ),
  },
  {
    variant: 'danger',
    preset: 'filled',
    className: cn(
      'bg-ws-dynamic-danger-default shadow-ws-controls-control text-ws-dynamic-on-danger-default outline-ws-dynamic-danger-strong-default',
      'hover:bg-ws-dynamic-danger-hover',
      'active:bg-ws-dynamic-danger-pressed',
      'disabled:bg-ws-dynamic-danger-disabled disabled:text-ws-dynamic-on-danger-disabled',
    ),
  },
  {
    variant: 'success',
    preset: 'filled',
    className: cn(
      'bg-ws-dynamic-success-default shadow-ws-controls-control text-ws-dynamic-on-success-default outline-ws-dynamic-success-strong-default',
      'hover:bg-ws-dynamic-success-hover',
      'active:bg-ws-dynamic-success-pressed',
      'disabled:bg-ws-dynamic-success-disabled disabled:text-ws-dynamic-on-success-disabled',
    ),
  },
  {
    variant: 'inverse',
    preset: 'filled',
    className: cn(
      'bg-ws-dynamic-inverse-default shadow-ws-controls-control text-ws-dynamic-on-inverse-default outline-ws-dynamic-primary-strong-default focus-visible:outline-offset-0',
      'hover:bg-ws-dynamic-inverse-hover',
      'active:bg-ws-dynamic-inverse-pressed',
      'disabled:bg-ws-dynamic-inverse-disabled disabled:text-ws-dynamic-on-inverse-disabled',
    ),
  },
  {
    variant: 'primary',
    preset: 'border',
    className: cn(
      'border-ws-dynamic-primary-default shadow-ws-controls-control bg-ws-static-highlight-subtle text-ws-dynamic-primary-default outline-ws-dynamic-primary-strong-default',
      'hover:border-ws-dynamic-primary-hover hover:text-ws-dynamic-primary-hover',
      'active:border-ws-dynamic-primary-pressed active:text-ws-dynamic-primary-pressed',
      'disabled:border-ws-dynamic-primary-disabled disabled:text-ws-dynamic-primary-disabled',
    ),
  },
  {
    variant: 'secondary',
    preset: 'border',
    className: cn(
      'border-ws-dynamic-secondary-default shadow-ws-controls-control bg-ws-static-highlight-subtle text-ws-dynamic-secondary-default outline-ws-dynamic-primary-strong-default',
      'hover:border-ws-dynamic-secondary-hover hover:text-ws-dynamic-secondary-hover',
      'active:border-ws-dynamic-secondary-pressed active:text-ws-dynamic-secondary-pressed',
      'disabled:border-ws-dynamic-secondary-disabled disabled:text-ws-dynamic-secondary-disabled',
    ),
  },
  {
    variant: 'danger',
    preset: 'border',
    className: cn(
      'border-ws-dynamic-danger-default shadow-ws-controls-control bg-ws-static-highlight-subtle text-ws-dynamic-danger-default outline-ws-dynamic-danger-strong-default',
      'hover:border-ws-dynamic-danger-hover hover:text-ws-dynamic-danger-hover',
      'active:border-ws-dynamic-danger-pressed active:text-ws-dynamic-danger-pressed',
      'disabled:border-ws-dynamic-danger-disabled disabled:text-ws-dynamic-danger-disabled',
    ),
  },
  {
    variant: 'success',
    preset: 'border',
    className: cn(
      'border-ws-dynamic-success-default shadow-ws-controls-control bg-ws-static-highlight-subtle text-ws-dynamic-success-default outline-ws-dynamic-success-strong-default',
      'hover:border-ws-dynamic-success-hover hover:text-ws-dynamic-success-hover',
      'active:border-ws-dynamic-success-pressed active:text-ws-dynamic-success-pressed',
      'disabled:border-ws-dynamic-success-disabled disabled:text-ws-dynamic-success-disabled',
    ),
  },
  {
    variant: 'inverse',
    preset: 'border',
    className: cn(
      'border-ws-dynamic-inverse-default shadow-ws-controls-control text-ws-dynamic-inverse-default outline-ws-dynamic-primary-strong-default focus-visible:outline-offset-0',
      'focus:not-active:bg-ws-static-inverse-alpha-subtle',
      'hover:border-ws-dynamic-inverse-hover hover:text-ws-dynamic-inverse-hover',
      'active:border-ws-dynamic-inverse-pressed active:text-ws-dynamic-inverse-pressed',
      'disabled:border-ws-dynamic-inverse-disabled disabled:text-ws-dynamic-inverse-disabled',
    ),
  },
  {
    variant: 'primary',
    preset: 'ghost',
    className: cn(
      'bg-ws-dynamic-primary-alpha-default text-ws-dynamic-primary-default outline-ws-dynamic-primary-strong-default',
      'hover:bg-ws-dynamic-primary-alpha-hover hover:text-ws-dynamic-primary-hover',
      'active:bg-ws-dynamic-primary-alpha-pressed active:text-ws-dynamic-primary-pressed',
      'disabled:text-ws-dynamic-primary-disabled disabled:bg-none',
    ),
  },
  {
    variant: 'secondary',
    preset: 'ghost',
    className: cn(
      'bg-ws-dynamic-secondary-alpha-default text-ws-dynamic-secondary-default outline-ws-dynamic-primary-strong-default',
      'hover:bg-ws-dynamic-secondary-alpha-hover hover:text-ws-dynamic-secondary-hover',
      'active:bg-ws-dynamic-secondary-alpha-pressed active:text-ws-dynamic-secondary-pressed',
      'disabled:text-ws-dynamic-secondary-disabled disabled:bg-none',
    ),
  },
  {
    variant: 'danger',
    preset: 'ghost',
    className: cn(
      'bg-ws-dynamic-danger-alpha-default text-ws-dynamic-danger-default outline-ws-dynamic-danger-strong-default',
      'hover:bg-ws-dynamic-danger-alpha-hover hover:text-ws-dynamic-danger-hover',
      'active:bg-ws-dynamic-danger-alpha-pressed active:text-ws-dynamic-danger-pressed',
      'disabled:text-ws-dynamic-danger-disabled disabled:bg-none',
    ),
  },
  {
    variant: 'success',
    preset: 'ghost',
    className: cn(
      'bg-ws-dynamic-success-alpha-default text-ws-dynamic-success-default outline-ws-dynamic-success-strong-default',
      'hover:bg-ws-dynamic-success-alpha-hover hover:text-ws-dynamic-success-hover',
      'active:bg-ws-dynamic-success-alpha-pressed active:text-ws-dynamic-success-pressed',
      'disabled:text-ws-dynamic-success-disabled disabled:bg-none',
    ),
  },
  {
    variant: 'inverse',
    preset: 'ghost',
    className: cn(
      'bg-ws-dynamic-inverse-alpha-default text-ws-dynamic-inverse-default outline-ws-dynamic-primary-strong-default focus-visible:outline-offset-0',
      'hover:bg-ws-dynamic-inverse-alpha-hover hover:text-ws-dynamic-inverse-hover',
      'active:bg-ws-dynamic-inverse-alpha-pressed active:text-ws-dynamic-inverse-pressed',
      'disabled:text-ws-dynamic-inverse-disabled disabled:bg-none',
    ),
  },
] satisfies Array<SharedVariantKeys & { className: string }>;

export const sharedButtonDefaultVariants = {
  variant: 'primary',
  preset: 'filled',
  size: 'md',
} as const;

export const buttonVariants = cva(buttonClassNames, {
  variants: {
    ...sharedButtonVariants,
    size: buttonSizeVariants,
  },
  compoundVariants: sharedButtonCompoundVariants,
  defaultVariants: sharedButtonDefaultVariants,
});

export const buttonMotionVariants = cva('', {
  variants: {
    enabled: { true: cn(hoverTintMotion, pressMotion), false: '' },
  },
  defaultVariants: { enabled: true },
});
