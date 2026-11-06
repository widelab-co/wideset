import { cva } from 'class-variance-authority';
import { cn } from 'src/lib/utils';

import { hoverTintMotion } from '../../motion/recipes';

// Figma "Navigation Bar": a fixed 64px row (unbound in Figma; Size/20 is 64px) with Gap/12 at
// both ends and Gap/9 between the groups. The line is Static/Stroke/Base on the bottom edge.
export const navigationBarVariants = cva('gap-ws-9 px-ws-12 h-ws-20 flex shrink-0 items-center', {
  variants: {
    divider: {
      true: 'border-ws-static-base border-b',
      false: '',
    },
  },
  defaultVariants: { divider: true },
});

// Figma "Assets / Navigation Bar Page". Its Focused ring is Static/Background/Inverse/Base, a
// variable the code tokens do not have; Static/Fill/Inverse/Background is the nearest (the same
// white in dark, Neutral/1100 for Neutral/1050 in light).
export const navigationBarItemVariants = cva(
  cn(
    'typography-label-strong-sm rounded-ws-control-lg gap-ws-5 px-ws-5 py-ws-3 min-h-ws-14 flex min-w-0 cursor-pointer items-center no-underline',
    'focus-visible:wds-focus-visible outline-ws-static-inverse-background',
    'hover:not-aria-disabled:bg-ws-dynamic-secondary-alpha-hover',
    'active:not-aria-disabled:bg-ws-dynamic-secondary-alpha-pressed',
    'aria-disabled:text-ws-static-subtle aria-disabled:pointer-events-none aria-disabled:cursor-default',
  ),
  {
    variants: {
      active: {
        true: 'bg-ws-dynamic-tertiary-alpha-strong-default text-ws-static-strong',
        false: 'bg-ws-dynamic-secondary-alpha-default text-ws-static-base',
      },
    },
    defaultVariants: { active: false },
  },
);

export const navigationBarItemMotionVariants = cva('', {
  variants: {
    enabled: { true: hoverTintMotion, false: '' },
  },
  defaultVariants: { enabled: true },
});

// Figma dims the icon of every state but Active to Static/Text/Subtle at 75% layer opacity.
export const navigationBarItemIconVariants = cva('size-ws-10 shrink-0', {
  variants: {
    active: { true: '', false: 'text-ws-static-subtle opacity-75' },
  },
  defaultVariants: { active: false },
});
