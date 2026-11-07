import { cva } from 'class-variance-authority';
import { cn } from 'src/lib/utils';

import { hoverTintMotion } from '../../motion/recipes';

// Figma's track carries a raw inner shadow (0 1px 1px, #000 2%) bound to no style or variable;
// Forms/Base has the same geometry, so it is drawn inset from that token.
export const segmentedControlVariants = cva(
  'bg-ws-static-alpha-base p-ws-2 inset-shadow-(--ws-elevation-forms-base)',
  {
    variants: {
      variant: {
        regular: 'inline-flex w-fit',
        fullWidth: 'flex w-full',
      },
      size: {
        sm: 'rounded-ws-control-lg h-ws-forms-sm gap-ws-2',
        md: 'rounded-ws-control-lg h-ws-forms-md gap-ws-2',
        lg: 'rounded-ws-control-xl h-ws-forms-lg gap-ws-3',
      },
    },
    defaultVariants: {
      variant: 'regular',
      size: 'md',
    },
  },
);

export const segmentedControlItemVariants = cva(
  cn(
    'text-ws-dynamic-secondary-default flex cursor-pointer items-center justify-center',
    // Figma: an unselected segment's icon is Static/Text/Base; selected, focused and disabled
    // segments keep the item's text colour. Keyed on aria-checked, which a toggle-group item and a
    // radio item both set, so the rule does not depend on which primitive draws the segment.
    '[&[aria-checked=false]:enabled:not(:focus-visible)>[data-slot=segmented-control-icon]]:text-ws-static-base',
    'focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default',
    'hover:bg-ws-dynamic-secondary-alpha-hover active:bg-ws-dynamic-secondary-alpha-pressed',
    'data-[state=on]:bg-ws-static-highlight-strong data-[state=on]:shadow-ws-low',
    'data-[state=on]:hover:bg-ws-static-highlight-strong data-[state=on]:active:bg-ws-static-highlight-strong',
    'disabled:text-ws-dynamic-secondary-disabled disabled:pointer-events-none',
    'disabled:bg-transparent disabled:shadow-none',
    'disabled:data-[state=on]:bg-transparent disabled:data-[state=on]:shadow-none',
    'data-disabled:bg-transparent data-disabled:shadow-none',
    'data-disabled:data-[state=on]:bg-transparent data-disabled:data-[state=on]:shadow-none',
    'disabled:hover:bg-transparent disabled:active:bg-transparent',
    'disabled:data-[state=on]:hover:bg-transparent disabled:data-[state=on]:active:bg-transparent',
  ),
  {
    variants: {
      size: {
        sm: 'typography-label-strong-sm rounded-ws-control-md min-w-ws-13 gap-ws-5 px-ws-7 py-ws-3',
        md: 'typography-label-strong-sm rounded-ws-control-md min-w-ws-15 gap-ws-5 px-ws-9 py-ws-4',
        lg: 'typography-label-strong-md rounded-ws-control-lg min-w-ws-17 gap-ws-5 px-ws-11 py-ws-7',
      },
      variant: {
        regular: '',
        fullWidth: 'flex-1',
      },
      iconOnly: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      { size: 'sm', iconOnly: true, class: 'p-ws-4' },
      { size: 'md', iconOnly: true, class: 'p-ws-6' },
      { size: 'lg', iconOnly: true, class: 'p-ws-8' },
    ],
    defaultVariants: {
      size: 'md',
      variant: 'regular',
      iconOnly: false,
    },
  },
);

export const segmentedControlItemMotionVariants = cva('', {
  variants: {
    enabled: { true: hoverTintMotion, false: '' },
  },
  defaultVariants: { enabled: true },
});

export const segmentedControlGlideVariants = cva('', {
  variants: {
    enabled: {
      true: 'relative isolate *:data-[state=on]:bg-transparent! *:data-[state=on]:shadow-none!',
      false: '',
    },
  },
  defaultVariants: { enabled: true },
});

export const segmentedControlPillVariants = cva(
  'bg-ws-static-highlight-strong shadow-ws-low pointer-events-none absolute top-0 left-0 -z-[var(--ws-z-index-base)]',
  {
    variants: {
      size: {
        sm: 'rounded-ws-control-md',
        md: 'rounded-ws-control-md',
        lg: 'rounded-ws-control-lg',
      },
      animate: {
        true: 'transition-[transform,width,height,opacity] duration-(--ws-motion-duration-fast) ease-(--ws-motion-ease-smooth-out)',
        false: '',
      },
    },
    defaultVariants: { size: 'md', animate: false },
  },
);
