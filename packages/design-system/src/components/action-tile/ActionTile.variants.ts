import { cva } from 'class-variance-authority';

import { hoverTintMotion } from '../../motion/recipes';

export const actionTileVariants = cva(
  `rounded-ws-container-md focus-visible:outline-ws-dynamic-primary-strong-default focus-visible:wds-focus-visible min-h-ws-20 gap-ws-7 px-ws-9 py-ws-7 flex w-full items-center text-left`,
  {
    variants: {
      variant: {
        border:
          'bg-ws-static-highlight-base inset-ring inset-ring-[var(--ws-dynamic-stroke-secondary-default)] group-[.is-disabled]:inset-ring-[var(--ws-dynamic-stroke-secondary-disabled)] hover:inset-ring-[var(--ws-dynamic-stroke-secondary-hover)] active:inset-ring-[var(--ws-dynamic-stroke-secondary-pressed)]',
        filled:
          'bg-ws-dynamic-tertiary-alpha-strong-default active:bg-ws-dynamic-tertiary-alpha-strong-pressed hover:bg-ws-dynamic-tertiary-alpha-strong-hover group-[.is-disabled]:bg-ws-static-alpha-subtle',
      },
      disabled: {
        true: 'is-disabled group pointer-events-none',
      },
      // A decorative tile (no href, onClick, asChild, or type) keeps the visuals
      // and drops the pointer affordance — it is not a control.
      isInteractive: {
        true: 'cursor-pointer',
        false: '',
      },
    },
    compoundVariants: [
      {
        disabled: true,
        isInteractive: true,
        className: 'cursor-default',
      },
    ],
    defaultVariants: {
      variant: 'border',
      disabled: false,
      isInteractive: false,
    },
  },
);

export const actionTileMotionVariants = cva('', {
  variants: {
    enabled: { true: hoverTintMotion, false: '' },
  },
  defaultVariants: { enabled: true },
});
