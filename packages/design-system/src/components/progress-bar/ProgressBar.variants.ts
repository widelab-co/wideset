import { cva } from 'class-variance-authority';

import { fillTravelMotion } from '../../motion/recipes';

export const progressBarIndicatorVariants = cva('size-full flex-1 rounded-full', {
  variants: {
    variant: {
      default: 'bg-ws-dynamic-primary-default',
      success: 'bg-(--ws-semantic-stroke-positive)',
      error: 'bg-(--ws-semantic-stroke-negative)',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

// Figma draws the status icon at 24px (a 20px glyph) and lets it overhang the 20px ring slot by
// 2px on each side, so the negative margin keeps the slot at 20px.
export const progressBarCircleIconVariants = cva('size-ws-control-lg -m-ws-2', {
  variants: {
    variant: {
      success: 'text-(--ws-dynamic-fill-success-default)',
      error: 'text-(--ws-dynamic-text-danger-default)',
    },
  },
});

export const progressBarIndicatorMotionVariants = cva('', {
  variants: {
    enabled: { true: fillTravelMotion, false: '' },
  },
  defaultVariants: { enabled: true },
});

export const progressBarCircleMotionVariants = cva('', {
  variants: {
    enabled: { true: 'transition-[stroke-dashoffset] ease-linear', false: '' },
  },
  defaultVariants: { enabled: true },
});

export const progressBarVariants = cva('', {
  variants: {
    type: {
      bar: 'gap-ws-5 flex w-full flex-col',
      circle: 'gap-ws-5 inline-flex items-center',
    },
  },
  defaultVariants: { type: 'bar' },
});

export const progressBarTrackVariants = cva('', {
  variants: {
    type: {
      bar: 'h-ws-3 relative w-full overflow-hidden rounded-full bg-(--ws-dynamic-stroke-secondary-default)',
      circle: 'inline-flex shrink-0',
    },
  },
  defaultVariants: { type: 'bar' },
});

export const progressBarValueVariants = cva(
  'typography-label-sm text-ws-static-subtle tabular-nums',
  {
    variants: {
      fixedWidth: { true: 'w-ws-14 inline-block', false: '' },
    },
    defaultVariants: { fixedWidth: false },
  },
);
