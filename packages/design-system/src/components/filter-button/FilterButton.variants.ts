import { cva } from 'class-variance-authority';
import { cn } from 'src/lib/utils';

import { hoverTintMotion, pressMotion } from '../../motion/recipes';

/**
 * Figma wraps the label in a `Label` frame carrying its own `Gap/2`–`Gap/3` inset,
 * so the visible text inset is `frame padding + wrapper padding`
 * (sm 10+2=12, md 12+4=16, lg 12+4=16).
 *
 * That wrapper is reproduced in code as `filterButtonPlaceholderVariants` rather
 * than folded into `pl-*`, so `pr-*`/`pl-*` here stay equal to Figma's own
 * frame-level padding and the two sides can drift independently — folding the sum
 * into `pl-*` would match the text inset while leaving the icon side wrong.
 */
export const filterButtonTriggerVariants = cva(
  cn(
    'text-ws-static-base border-ws-dynamic-secondary-default bg-ws-static-highlight-base shadow-ws-controls-control placeholder:text-ws-static-subtle hover:border-ws-dynamic-secondary-hover active:border-ws-dynamic-secondary-pressed relative flex max-w-full cursor-pointer items-center overflow-hidden border text-nowrap',
    'focus-visible:wds-focus-visible focus-visible:outline-ws-dynamic-primary-strong-default focus-visible:outline-solid',
    '[&>svg]:text-ws-dynamic-secondary-default [&_svg]:size-ws-9 [&_svg]:shrink-0',
  ),
  {
    variants: {
      size: {
        sm: 'rounded-ws-control-lg typography-label-sm h-ws-forms-sm gap-ws-3 pr-ws-5 pl-ws-6',
        md: 'rounded-ws-control-lg typography-label-md h-ws-forms-md gap-ws-3 pr-ws-7 pl-ws-7',
        lg: 'rounded-ws-control-xl typography-label-md h-ws-forms-lg gap-ws-4 pr-ws-9 pl-ws-7',
      },
      selected: {
        true: 'border-ws-dynamic-primary-default hover:border-ws-dynamic-primary-hover active:border-ws-dynamic-primary-pressed',
        false: '',
      },
      disabled: {
        true: 'text-ws-static-subtle bg-ws-dynamic-primary-alpha-default border-ws-dynamic-secondary-disabled [&>svg]:text-ws-dynamic-secondary-disabled pointer-events-none cursor-default shadow-none',
      },
    },
    compoundVariants: [
      // Selected swaps the trailing chevron for a clear IconButton, which Figma
      // sits closer to the edge and on a tighter gap than the bare chevron.
      { size: 'sm', selected: true, class: 'gap-ws-4 pr-ws-3 pl-ws-7' },
      { size: 'md', selected: true, class: 'gap-ws-4 pr-ws-3 pl-ws-9' },
      { size: 'lg', selected: true, class: 'gap-ws-4 pr-ws-5 pl-ws-9' },
    ],
    defaultVariants: {
      size: 'sm',
      disabled: false,
      selected: false,
    },
  },
);

/**
 * Figma's `Label` frame around the bare placeholder — applies only when no value is
 * selected. With a value the text sits inside `filterButtonLabelsVariants` instead.
 */
export const filterButtonPlaceholderVariants = cva('', {
  variants: {
    size: {
      sm: 'px-ws-2',
      md: 'px-ws-3',
      lg: 'px-ws-3',
    },
  },
  defaultVariants: { size: 'sm' },
});

/**
 * Figma's `Labels` group — the gap between the prefix label and the value summary.
 * It carries no padding of its own: the distance from the value to the clear button
 * is the trigger's own `gap-*` (see the selected compound variants above).
 */
export const filterButtonLabelsVariants = cva('flex min-w-0 items-center overflow-hidden', {
  variants: {
    size: {
      sm: 'gap-ws-3',
      md: 'gap-ws-4',
      lg: 'gap-ws-4',
    },
  },
  defaultVariants: { size: 'sm' },
});

/**
 * The selected value summary. Carries the size ramp explicitly rather than inheriting
 * it, because it is the one piece of text that goes strong while the prefix label
 * stays regular. Disabled drops back to the non-strong utility — Figma renders the
 * disabled value at `Font/Weight/Normal`.
 */
export const filterButtonValueVariants = cva('min-w-0 truncate', {
  variants: {
    size: {
      sm: '',
      md: '',
      lg: '',
    },
    disabled: { true: 'text-ws-static-subtle', false: 'text-ws-dynamic-primary-default' },
  },
  compoundVariants: [
    { size: 'sm', disabled: false, class: 'typography-label-strong-sm' },
    { size: 'md', disabled: false, class: 'typography-label-strong-md' },
    { size: 'lg', disabled: false, class: 'typography-label-strong-md' },
    { size: 'sm', disabled: true, class: 'typography-label-sm' },
    { size: 'md', disabled: true, class: 'typography-label-md' },
    { size: 'lg', disabled: true, class: 'typography-label-md' },
  ],
  defaultVariants: { size: 'sm', disabled: false },
});

/** Figma binds the clear button to `Components/Forms/*`: 24px at sm, 32px at md and lg. */
export const filterButtonClearSizes = {
  sm: 'xs',
  md: 'sm',
  lg: 'sm',
} as const;

export const filterButtonClearPlaceholderVariants = cva('shrink-0', {
  variants: {
    size: {
      sm: 'h-ws-forms-xs w-ws-forms-xs',
      md: 'h-ws-forms-sm w-ws-forms-sm',
      lg: 'h-ws-forms-sm w-ws-forms-sm',
    },
  },
  defaultVariants: { size: 'sm' },
});

export const filterButtonClearVariants = cva('relative shrink-0', {
  variants: {
    size: {
      sm: 'mr-[calc(var(--spacing-ws-3)+1px)] -ml-[calc(var(--spacing-ws-3)+var(--spacing-ws-forms-xs)+1px)]',
      md: 'mr-[calc(var(--spacing-ws-3)+1px)] -ml-[calc(var(--spacing-ws-3)+var(--spacing-ws-forms-sm)+1px)]',
      lg: 'mr-[calc(var(--spacing-ws-5)+1px)] -ml-[calc(var(--spacing-ws-5)+var(--spacing-ws-forms-sm)+1px)]',
    },
  },
  defaultVariants: { size: 'sm' },
});

export const filterButtonTriggerMotionVariants = cva('', {
  variants: {
    enabled: { true: cn(hoverTintMotion, pressMotion), false: '' },
  },
  defaultVariants: { enabled: true },
});
