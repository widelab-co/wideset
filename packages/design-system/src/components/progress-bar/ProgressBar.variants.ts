import { cva } from 'class-variance-authority';

import { fillTravelMotion } from '../../motion/recipes';

export const progressBarRootVariants = cva('gap-ws-5', {
  variants: {
    type: {
      bar: 'flex w-full flex-col',
      circle: 'inline-flex items-center',
    },
  },
  defaultVariants: {
    type: 'bar',
  },
});

export const progressBarTrackVariants = cva('', {
  variants: {
    type: {
      bar: 'h-ws-3 relative w-full overflow-hidden rounded-full bg-(--ws-dynamic-stroke-secondary-default)',
      circle: 'inline-flex shrink-0',
    },
  },
  defaultVariants: {
    type: 'bar',
  },
});

export const progressBarIndicatorVariants = cva('size-full flex-1 rounded-full', {
  variants: {
    status: {
      default: 'bg-ws-dynamic-primary-default',
      success: 'bg-(--ws-semantic-stroke-positive)',
      error: 'bg-(--ws-semantic-stroke-negative)',
    },
  },
  defaultVariants: {
    status: 'default',
  },
});

export const progressBarCircleIconVariants = cva('size-ws-control-md', {
  variants: {
    status: {
      success: 'text-(--ws-dynamic-stroke-success-strong-default)',
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
