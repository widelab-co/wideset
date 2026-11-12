import { cva } from 'class-variance-authority';
import { cn } from '@/lib/wideset/utils';

import { hoverTintMotion, pressMotion } from '@/lib/wideset/motion/recipes';

export const chipVariants = cva(
  cn(
    'group/chip relative isolate inline-flex min-w-0 items-center has-[[data-slot=chip-action]]:p-ws-0',
    'has-[[data-slot=chip-action]:focus-visible]:wds-focus-visible has-[[data-slot=chip-action]:focus-visible]:outline-ws-dynamic-primary-strong-default',
  ),
  {
    variants: {
      variant: {
        primary: '',
        secondary: '',
      },
      // Figma's Filled variants carry no stroke (strokes: []), so the border
      // belongs to the Border style rather than the base.
      style: {
        filled: '',
        border: 'border',
      },
      size: {
        // gap = Figma frame itemSpacing + the 2px inset its "Container" wrapper
        // adds on each side (Gap/0+2, Gap/2+2, Gap/3+2).
        sm: 'rounded-ws-control-md typography-caption-strong-md h-ws-11 gap-ws-2 px-ws-3 py-ws-2',
        md: 'rounded-ws-control-lg typography-label-strong-sm h-ws-14 gap-ws-3 px-ws-6 py-ws-2',
        lg: 'rounded-ws-control-lg typography-label-strong-sm h-ws-16 gap-ws-4 px-ws-7 py-ws-4',
      },
    },
    compoundVariants: [
      {
        variant: 'primary',
        style: 'filled',
        className: cn(
          'bg-ws-dynamic-primary-default data-disabled:bg-ws-dynamic-primary-disabled',
          'has-[[data-slot=chip-action]:enabled:hover]:bg-ws-dynamic-primary-hover has-[[data-slot=chip-action]:enabled:active]:bg-ws-dynamic-primary-pressed',
          // Figma binds Dynamic/Text/OnPrimary per state, not just default.
          'text-ws-dynamic-on-primary-default data-disabled:text-ws-dynamic-on-primary-disabled',
          'has-[[data-slot=chip-action]:enabled:hover]:text-ws-dynamic-on-primary-hover has-[[data-slot=chip-action]:enabled:active]:text-ws-dynamic-on-primary-pressed',
        ),
      },
      {
        variant: 'primary',
        style: 'border',
        className: cn(
          'text-ws-dynamic-primary-default bg-ws-static-highlight-base border-ws-dynamic-primary-default data-disabled:border-ws-dynamic-primary-disabled data-disabled:text-ws-dynamic-primary-disabled',
          'has-[[data-slot=chip-action]:enabled:hover]:text-ws-dynamic-primary-hover has-[[data-slot=chip-action]:enabled:active]:text-ws-dynamic-primary-pressed',
          'has-[[data-slot=chip-action]:enabled:hover]:border-ws-dynamic-primary-hover has-[[data-slot=chip-action]:enabled:active]:border-ws-dynamic-primary-pressed',
        ),
      },
      {
        variant: 'secondary',
        style: 'filled',
        // Figma holds the Secondary/Filled fill at Alpha/Strong/Default when
        // disabled — only the label colour changes — and its label is
        // Dynamic/Text/Secondary/Default at Default, Hover and Pressed alike.
        className: cn(
          'bg-ws-dynamic-secondary-alpha-strong-default text-ws-dynamic-secondary-default data-disabled:text-ws-dynamic-on-secondary-disabled',
          'has-[[data-slot=chip-action]:enabled:hover]:bg-ws-dynamic-secondary-alpha-strong-hover has-[[data-slot=chip-action]:enabled:active]:bg-ws-dynamic-secondary-alpha-strong-pressed',
        ),
      },
      {
        variant: 'secondary',
        style: 'border',
        className: cn(
          'text-ws-dynamic-secondary-default bg-ws-static-highlight-base border-ws-dynamic-secondary-default data-disabled:border-ws-dynamic-secondary-disabled data-disabled:text-ws-dynamic-on-secondary-disabled',
          'has-[[data-slot=chip-action]:enabled:hover]:text-ws-dynamic-secondary-hover has-[[data-slot=chip-action]:enabled:active]:text-ws-dynamic-secondary-pressed',
          'has-[[data-slot=chip-action]:enabled:hover]:border-ws-dynamic-secondary-hover has-[[data-slot=chip-action]:enabled:active]:border-ws-dynamic-secondary-pressed',
        ),
      },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      style: 'filled',
    },
  },
);

export const chipActionVariants = cva(
  'group/chip-action inline-flex min-w-0 flex-1 cursor-pointer items-center justify-center self-stretch rounded-[inherit] bg-transparent text-inherit outline-none disabled:pointer-events-none disabled:cursor-default',
  {
    variants: {
      // The action owns the padding so its hit area reaches the chip edges.
      // Reserve room for the overlaid removal button without covering its label.
      size: {
        sm: 'gap-ws-2 px-ws-3 py-ws-2 group-has-[[data-slot=chip-icon-button]]/chip:pe-[calc(var(--spacing-ws-3)+var(--spacing-ws-2)+var(--spacing-ws-9))]',
        md: 'gap-ws-3 px-ws-6 py-ws-2 group-has-[[data-slot=chip-icon-button]]/chip:pe-[calc(var(--spacing-ws-6)+var(--spacing-ws-3)+var(--spacing-ws-11))]',
        lg: 'gap-ws-4 px-ws-7 py-ws-4 group-has-[[data-slot=chip-icon-button]]/chip:pe-[calc(var(--spacing-ws-7)+var(--spacing-ws-4)+var(--spacing-ws-12))]',
      },
      variant: { primary: '', secondary: '' },
      style: { filled: '', border: '' },
    },
    compoundVariants: [
      {
        variant: 'primary',
        style: 'filled',
        className: 'disabled:text-ws-dynamic-on-primary-disabled',
      },
      {
        variant: 'primary',
        style: 'border',
        className: 'disabled:text-ws-dynamic-primary-disabled',
      },
      {
        variant: 'secondary',
        style: 'filled',
        className: 'disabled:text-ws-dynamic-on-secondary-disabled',
      },
      {
        variant: 'secondary',
        style: 'border',
        className: 'disabled:text-ws-dynamic-on-secondary-disabled',
      },
    ],
    defaultVariants: { size: 'md', variant: 'primary', style: 'filled' },
  },
);

export const chipLabelVariants = cva('min-w-0 truncate');

export const chipIconButtonVariants = cva(
  cn(
    'shrink-0 bg-transparent text-current shadow-none focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-current disabled:pointer-events-auto disabled:bg-transparent',
    'group-has-[[data-slot=chip-action]]/chip:absolute group-has-[[data-slot=chip-action]]/chip:top-1/2 group-has-[[data-slot=chip-action]]/chip:z-ws-base group-has-[[data-slot=chip-action]]/chip:-translate-y-1/2',
  ),
  {
    variants: {
      size: {
        sm: 'size-ws-9 group-has-[[data-slot=chip-action]]/chip:end-ws-3',
        md: 'size-ws-11 group-has-[[data-slot=chip-action]]/chip:end-ws-6',
        lg: 'size-ws-12 group-has-[[data-slot=chip-action]]/chip:end-ws-7',
      },
      variant: { primary: '', secondary: '' },
      style: { filled: '', border: '' },
    },
    compoundVariants: [
      {
        variant: 'primary',
        style: 'filled',
        className:
          'hover:bg-ws-dynamic-primary-hover active:bg-ws-dynamic-primary-pressed hover:text-ws-dynamic-on-primary-hover active:text-ws-dynamic-on-primary-pressed disabled:text-ws-dynamic-on-primary-disabled',
      },
      {
        variant: 'primary',
        style: 'border',
        className:
          'hover:bg-ws-dynamic-primary-alpha-hover active:bg-ws-dynamic-primary-alpha-pressed hover:text-ws-dynamic-primary-hover active:text-ws-dynamic-primary-pressed disabled:text-ws-dynamic-primary-disabled',
      },
      {
        variant: 'secondary',
        className:
          'hover:bg-ws-dynamic-secondary-alpha-strong-hover active:bg-ws-dynamic-secondary-alpha-strong-pressed hover:text-ws-dynamic-secondary-hover active:text-ws-dynamic-secondary-pressed disabled:text-ws-dynamic-on-secondary-disabled',
      },
    ],
    defaultVariants: { size: 'md', variant: 'primary', style: 'filled' },
  },
);

export const chipSurfaceMotionVariants = cva('', {
  variants: { enabled: { true: hoverTintMotion, false: '' } },
  defaultVariants: { enabled: true },
});

export const chipMotionVariants = cva('', {
  variants: {
    enabled: {
      true: cn(hoverTintMotion, pressMotion),
      false: '',
    },
  },
  defaultVariants: { enabled: true },
});

/**
 * The prefix slot Figma calls `Entity`. It is Size/9 (16) at sm and md and
 * Size/11 (20) at lg — the extra room exists so Logo and Avatar prefixes fit
 * alongside the icon, which stays Size/9 at every size.
 */
export const chipIconSlotVariants = cva('inline-flex shrink-0 items-center justify-center', {
  variants: {
    size: {
      sm: 'size-ws-9',
      md: 'size-ws-9',
      lg: 'size-ws-11',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const chipIconVariants = cva('', {
  variants: {
    variant: {
      primary: '',
      secondary: '',
    },
    style: {
      filled: '',
      border: '',
    },
    // Figma draws the glyph at Size/9 (16) at every chip size; only the prefix
    // slot grows to Size/11 (20) at Large, to make room for Avatar/Logo prefixes.
    size: {
      sm: 'size-ws-9',
      md: 'size-ws-9',
      lg: 'size-ws-9',
    },
  },
  compoundVariants: [
    {
      variant: 'primary',
      style: 'filled',
      className:
        'text-ws-dynamic-on-primary-default group-data-disabled/chip:text-ws-dynamic-on-primary-disabled group-disabled/chip-action:text-ws-dynamic-on-primary-disabled',
    },
    {
      variant: 'primary',
      style: 'border',
      className:
        'text-ws-dynamic-primary-default group-data-disabled/chip:text-ws-dynamic-primary-disabled group-disabled/chip-action:text-ws-dynamic-primary-disabled',
    },
    {
      variant: 'secondary',
      style: 'filled',
      className:
        'text-ws-dynamic-on-secondary-default group-data-disabled/chip:text-ws-dynamic-on-secondary-disabled group-disabled/chip-action:text-ws-dynamic-on-secondary-disabled',
    },
    {
      variant: 'secondary',
      style: 'border',
      className:
        'text-ws-dynamic-secondary-default group-data-disabled/chip:text-ws-dynamic-on-secondary-disabled group-disabled/chip-action:text-ws-dynamic-on-secondary-disabled',
    },
  ],
  defaultVariants: {
    variant: 'primary',
    style: 'filled',
    size: 'md',
  },
});
