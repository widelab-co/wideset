import { cva } from 'class-variance-authority';
import { cn } from 'src/lib/utils';

import { hoverTintMotion } from '../../motion/recipes';

export const calendarClassNames = {
  chevron: 'hidden',
  months: 'flex flex-row gap-ws-12',
  weekdays: 'h-ws-14',
  weekday: 'typography-caption-md text-ws-static-subtle text-center w-ws-16 h-ws-14 p-0',
  month_grid: 'w-full border-collapse',
  hidden: '!invisible !bg-transparent before:!bg-transparent',
  day: 'size-ws-16 p-0 text-center',
  day_button: cn(
    'flex h-full w-full cursor-pointer items-center justify-center rounded-full',
    'text-ws-static-subtle typography-number-md',
    'hover:bg-ws-dynamic-secondary-alpha-hover active:bg-ws-dynamic-secondary-alpha-pressed',
    'disabled:cursor-default disabled:opacity-50 disabled:hover:bg-transparent disabled:active:bg-transparent',
    'focus-visible:wds-focus-visible focus-visible:outline-ws-dynamic-primary-strong-default',
  ),
  range_start: cn(
    'relative',
    'before:bg-ws-dynamic-primary-alpha-strong-default before:absolute before:inset-y-0 before:right-0 before:left-1/2',
    '[&>button]:z-ws-base [&>button]:relative',
  ),
  range_end: cn(
    'relative',
    'before:bg-ws-dynamic-primary-alpha-strong-default before:absolute before:inset-y-0 before:right-1/2 before:left-0',
    '[&>button]:z-ws-base [&>button]:relative',
  ),
  range_middle: cn(
    'range-middle bg-ws-dynamic-primary-alpha-strong-default rounded-none',
    '[&>button]:text-ws-dynamic-primary-default',
  ),
  selected: cn(
    '[&:not(.range-middle)>button]:typography-number-strong-md',
    '[&:not(.range-middle)>button]:bg-ws-dynamic-primary-default',
    '[&:not(.range-middle)>button]:text-ws-dynamic-on-primary-default',
    '[&:not(.range-middle)>button]:hover:bg-ws-dynamic-primary-hover',
    '[&:not(.range-middle)>button]:hover:text-ws-dynamic-on-primary-hover',
    '[&:not(.range-middle)>button]:active:bg-ws-dynamic-primary-pressed',
    '[&:not(.range-middle)>button]:active:text-ws-dynamic-on-primary-pressed',
  ),
  today: cn(
    '[&>button]:typography-number-strong-md',
    '[&>button]:border-ws-dynamic-primary-strong-default [&>button]:border',
    '[&>button]:text-ws-dynamic-primary-default [&>button]:rounded-full',
    '[&>button]:hover:border-ws-dynamic-primary-strong-hover [&>button]:active:border-ws-dynamic-primary-strong-pressed',
    '[&>button]:hover:bg-ws-dynamic-primary-alpha-hover [&>button]:active:bg-ws-dynamic-primary-alpha-pressed [&>button]:hover:text-ws-dynamic-primary-hover [&>button]:active:text-ws-dynamic-primary-pressed',
  ),
  disabled: 'text-ws-dynamic-secondary-disabled',
};

export const calendarFooterClassName =
  'text-ws-static-subtle typography-caption-md mt-ws-7 px-ws-7 pb-ws-5 w-0 min-w-full text-center break-words';

export const calendarGridCellClassName = cn(
  'typography-label-md rounded-ws-control-lg h-ws-16 flex items-center justify-center',
  'text-ws-static-subtle',
  'hover:bg-ws-dynamic-secondary-alpha-hover active:bg-ws-dynamic-secondary-alpha-pressed',
  'focus-visible:wds-focus-visible focus-visible:outline-ws-dynamic-primary-strong-default',
);

export const calendarGridCellSelectedClassName = cn(
  'border-ws-dynamic-primary-strong-default text-ws-dynamic-primary-default border',
  'hover:bg-ws-dynamic-primary-alpha-hover active:bg-ws-dynamic-primary-alpha-pressed hover:text-ws-dynamic-primary-hover active:text-ws-dynamic-primary-pressed',
);

export const calendarMotionVariants = cva('', {
  variants: {
    enabled: { true: hoverTintMotion, false: '' },
  },
  defaultVariants: { enabled: true },
});
