import { cva } from 'class-variance-authority';
import { cn } from 'src/lib/utils';

import { hoverTintMotion, pressMotion } from '../../motion/recipes';

export const chipVariants = cva(
  cn(
    'group inline-flex cursor-pointer items-center data-disabled:pointer-events-none data-disabled:cursor-default',
    'focus-visible:wds-focus-visible focus-visible:outline-ws-dynamic-primary-strong-default',
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
          'bg-ws-dynamic-primary-default hover:bg-ws-dynamic-primary-hover active:bg-ws-dynamic-primary-pressed data-[pressed=true]:bg-ws-dynamic-primary-pressed data-disabled:bg-ws-dynamic-primary-disabled',
          // Figma binds Dynamic/Text/OnPrimary per state, not just default.
          'text-ws-dynamic-on-primary-default hover:text-ws-dynamic-on-primary-hover active:text-ws-dynamic-on-primary-pressed data-[pressed=true]:text-ws-dynamic-on-primary-pressed data-disabled:text-ws-dynamic-on-primary-disabled',
        ),
      },
      {
        variant: 'primary',
        style: 'border',
        className:
          'text-ws-dynamic-primary-default hover:text-ws-dynamic-primary-hover active:text-ws-dynamic-primary-pressed data-[pressed=true]:text-ws-dynamic-primary-pressed bg-ws-static-highlight-base border-ws-dynamic-primary-default hover:border-ws-dynamic-primary-hover active:border-ws-dynamic-primary-pressed data-[pressed=true]:border-ws-dynamic-primary-pressed data-disabled:border-ws-dynamic-primary-disabled data-disabled:text-ws-dynamic-primary-disabled',
      },
      {
        variant: 'secondary',
        style: 'filled',
        // Figma holds the Secondary/Filled fill at Alpha/Strong/Default when
        // disabled — only the label colour changes — and its label is
        // Dynamic/Text/Secondary/Default at Default, Hover and Pressed alike.
        className:
          'bg-ws-dynamic-secondary-alpha-strong-default hover:bg-ws-dynamic-secondary-alpha-strong-hover active:bg-ws-dynamic-secondary-alpha-strong-pressed data-[pressed=true]:bg-ws-dynamic-secondary-alpha-strong-pressed text-ws-dynamic-secondary-default data-disabled:text-ws-dynamic-on-secondary-disabled',
      },
      {
        variant: 'secondary',
        style: 'border',
        className:
          'text-ws-dynamic-secondary-default hover:text-ws-dynamic-secondary-hover active:text-ws-dynamic-secondary-pressed data-[pressed=true]:text-ws-dynamic-secondary-pressed bg-ws-static-highlight-base border-ws-dynamic-secondary-default hover:border-ws-dynamic-secondary-hover active:border-ws-dynamic-secondary-pressed data-[pressed=true]:border-ws-dynamic-secondary-pressed data-disabled:border-ws-dynamic-secondary-disabled data-disabled:text-ws-dynamic-on-secondary-disabled',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export const chipMotionVariants = cva('', {
  variants: {
    enabled: {
      true: cn(
        hoverTintMotion,
        pressMotion,
        'data-[pressed=true]:duration-(--ws-motion-duration-micro)',
        'data-[pressed=true]:scale-(--ws-motion-scale-small)',
      ),
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
        'text-ws-dynamic-on-primary-default group-data-disabled:text-ws-dynamic-on-primary-disabled',
    },
    {
      variant: 'primary',
      style: 'border',
      className:
        'text-ws-dynamic-primary-default group-data-disabled:text-ws-dynamic-primary-disabled',
    },
    {
      variant: 'secondary',
      style: 'filled',
      className:
        'text-ws-dynamic-on-secondary-default group-data-disabled:text-ws-dynamic-on-secondary-disabled',
    },
    {
      variant: 'secondary',
      style: 'border',
      className:
        'text-ws-dynamic-secondary-default group-data-disabled:text-ws-dynamic-on-secondary-disabled',
    },
  ],
  defaultVariants: {
    variant: 'primary',
    style: 'filled',
    size: 'md',
  },
});
