import { cva } from 'class-variance-authority';
import { cn } from 'src/lib/utils';

import { fieldFocusMotion, fieldShakeWithinMotion } from '../../motion/recipes';

export const textareaVariants = cva(
  cn(
    'text-ws-static-strong relative flex items-center',
    'box-border h-full min-h-lh resize-none overflow-auto overscroll-auto outline-hidden',
  ),
  {
    variants: {
      size: {
        sm: 'typography-body-md px-ws-7 py-ws-4',
        md: 'typography-body-md px-ws-9 py-ws-6',
        lg: 'typography-body-lg px-ws-9 py-ws-8',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export const textareaWrapperVariants = cva(
  cn(
    'text-ws-static-strong relative flex items-stretch',
    'h-auto min-h-lh overflow-hidden',
    'bg-ws-static-highlight-base border-ws-dynamic-secondary-default border',
  ),
  {
    variants: {
      resize: {
        none: 'resize-none',
        vertical: 'resize-y',
        horizontal: 'resize-x',
        both: 'resize',
      },
      variant: {
        // No native `:invalid` styling: an empty `required` field is invalid before it is
        // touched. The danger look comes only from `variant="danger"`, as in TextInput.
        primary:
          'has-focus:not-active:border-ws-dynamic-primary-strong-default has-[:focus]:not-active:shadow-ws-forms-active',
        danger: cn(
          'has-focus:not-active:border-ws-dynamic-danger-strong-default has-[:focus]:not-active:shadow-ws-forms-active-danger',
        ),
      },
      disabled: {
        true: cn(
          'text-ws-static-subtle',
          'border-ws-dynamic-secondary-disabled bg-ws-static-alpha-subtle',
          'hover:not-has-focus:border-ws-dynamic-secondary-disabled',
          'active:border-ws-dynamic-secondary-disabled',
          'has-focus:not-active:border-ws-dynamic-secondary-disabled',
        ),
        false: {},
      },
      size: {
        sm: 'rounded-ws-container-sm',
        md: 'rounded-ws-container-sm',
        lg: 'rounded-ws-container-sm',
      },
    },
    compoundVariants: [
      {
        disabled: false,
        variant: 'danger',
        className: cn(
          'border-ws-dynamic-danger-strong-default',
          'hover:not-has-focus:border-ws-dynamic-danger-strong-hover',
          'active:border-ws-dynamic-danger-strong-pressed',
        ),
      },
      {
        disabled: false,
        variant: 'primary',
        className: cn(
          'hover:not-has-focus:border-ws-dynamic-secondary-hover',
          'active:border-ws-dynamic-secondary-pressed',
        ),
      },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      resize: 'vertical',
    },
  },
);

export const textareaMotionVariants = cva('', {
  variants: {
    enabled: { true: cn(fieldFocusMotion, fieldShakeWithinMotion), false: '' },
  },
  defaultVariants: { enabled: true },
});
