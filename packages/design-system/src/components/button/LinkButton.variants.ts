import { cva } from 'class-variance-authority';
import { cn } from 'src/lib/utils';

import { hoverTintMotion } from '../../motion/recipes';
import { buttonClassNames } from './Button.variants';

// Focused, Figma's Link Button takes Corner Radius/Control/sm and the variant's Alpha/Default fill;
// the ring is buttonClassNames' focus-visible:wds-focus-visible.
export const linkButtonVariants = cva(
  cn(
    buttonClassNames,
    'rounded-ws-control-sm h-auto [&[aria-disabled="true"]]:pointer-events-none [&[aria-disabled="true"]]:cursor-default',
  ),
  {
    variants: {
      underlined: {
        true: 'underline underline-offset-2 focus-visible:no-underline [&[aria-disabled="true"]]:no-underline',
        false: 'no-underline',
      },
      variant: {
        primary: cn(
          'text-ws-dynamic-primary-default outline-ws-dynamic-primary-strong-default focus-visible:bg-ws-dynamic-primary-alpha-default',
          'hover:text-ws-dynamic-primary-hover',
          'active:text-ws-dynamic-primary-pressed',
          '[&[aria-disabled="true"]]:text-ws-dynamic-primary-disabled',
        ),
        secondary: cn(
          'text-ws-dynamic-secondary-default outline-ws-dynamic-primary-strong-default focus-visible:bg-ws-dynamic-secondary-alpha-default',
          'hover:text-ws-dynamic-secondary-hover',
          'active:text-ws-dynamic-secondary-pressed',
          '[&[aria-disabled="true"]]:text-ws-dynamic-secondary-disabled',
        ),
        danger: cn(
          'text-ws-dynamic-danger-default outline-ws-dynamic-danger-strong-default focus-visible:bg-ws-dynamic-danger-alpha-default',
          'hover:text-ws-dynamic-danger-hover',
          'active:text-ws-dynamic-danger-pressed',
          '[&[aria-disabled="true"]]:text-ws-dynamic-danger-disabled',
        ),
        success: cn(
          'text-ws-dynamic-success-default outline-ws-dynamic-success-strong-default focus-visible:bg-ws-dynamic-success-alpha-default',
          'hover:text-ws-dynamic-success-hover',
          'active:text-ws-dynamic-success-pressed',
          '[&[aria-disabled="true"]]:text-ws-dynamic-success-disabled',
        ),
        inverse: cn(
          'text-ws-dynamic-inverse-default outline-ws-dynamic-primary-strong-default focus-visible:bg-ws-dynamic-inverse-alpha-default',
          'hover:text-ws-dynamic-inverse-hover',
          'active:text-ws-dynamic-inverse-pressed',
          '[&[aria-disabled="true"]]:text-ws-dynamic-inverse-disabled',
        ),
      },
      // Figma pads both sizes Gap/5 × Gap/3 (8 × 4px); size switches the label only.
      size: {
        sm: 'typography-label-strong-sm px-ws-5 py-ws-3',
        lg: 'typography-label-strong-md px-ws-5 py-ws-3',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'sm',
      underlined: false,
    },
  },
);

export const linkButtonMotionVariants = cva('', {
  variants: {
    enabled: { true: hoverTintMotion, false: '' },
  },
  defaultVariants: { enabled: true },
});
