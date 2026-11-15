import { cva } from 'class-variance-authority';
import { cn } from 'src/lib/utils';

import { fieldFocusMotion, fieldShakeWithinMotion } from '../../motion/recipes';

export const textInputVariants = cva(
  cn(
    'text-ws-static-strong relative flex w-full max-w-full items-center overflow-hidden',
    'data-[disabled=true]:text-ws-static-subtle',
  ),
  {
    variants: {
      preset: {
        border: cn(
          'shadow-ws-forms-base bg-ws-static-highlight-base border-ws-dynamic-secondary-default border',
          'data-[disabled=true]:border-ws-dynamic-secondary-disabled data-[disabled=true]:bg-ws-static-alpha-subtle',
          'data-[disabled=true]:hover:not-focus-within:border-ws-dynamic-secondary-disabled',
          'data-[disabled=true]:active:border-ws-dynamic-secondary-disabled',
          'data-[disabled=true]:focus-within:not-active:border-ws-dynamic-secondary-disabled',
        ),
        ghost: cn('border border-transparent bg-transparent', ''),
      },
      variant: {
        /*
         * `:active` propagates from any descendant, so pressing an affix button
         * (clear, reveal, …) would otherwise put the whole field in its pressed
         * state and drop the focus ring for the duration of the press.
         * `not-has-[button:active]` keeps "pressed" meaning the field itself,
         * and the paired `has-[button:active]` rule holds the focus ring.
         */
        primary: cn(
          'hover:not-focus-within:not-data-[disabled=true]:border-ws-dynamic-secondary-hover',
          'active:not-has-[button:active]:not-data-[disabled=true]:border-ws-dynamic-secondary-pressed',
          'focus-within:not-active:border-ws-dynamic-primary-strong-default focus-within:not-active:shadow-ws-forms-active',
          'focus-within:has-[button:active]:border-ws-dynamic-primary-strong-default focus-within:has-[button:active]:shadow-ws-forms-active',
        ),
        danger: cn(
          'hover:not-focus-within:not-data-[disabled=true]:border-ws-dynamic-danger-strong-hover',
          'active:not-has-[button:active]:not-data-[disabled=true]:border-ws-dynamic-danger-strong-pressed',
          'focus-within:not-active:border-ws-dynamic-danger-strong-default focus-within:not-active:shadow-ws-forms-active-danger',
          'focus-within:has-[button:active]:border-ws-dynamic-danger-strong-default focus-within:has-[button:active]:shadow-ws-forms-active-danger',
        ),
      },
      size: {
        sm: 'typography-label-sm h-ws-forms-sm rounded-ws-control-lg',
        md: 'typography-label-sm h-ws-forms-md rounded-ws-control-lg',
        lg: 'typography-label-md h-ws-forms-lg rounded-ws-control-xl',
      },
    },
    compoundVariants: [
      {
        preset: 'border',
        variant: 'danger',
        className: 'border-ws-dynamic-danger-strong-default',
      },
      {
        preset: 'ghost',
        variant: 'danger',
        className: 'not-data-[disabled=true]:border-ws-dynamic-danger-strong-default',
      },
    ],
    defaultVariants: {
      preset: 'border',
      variant: 'primary',
      size: 'md',
    },
  },
);

export const textInputMotionVariants = cva('', {
  variants: {
    enabled: { true: cn(fieldFocusMotion, fieldShakeWithinMotion), false: '' },
  },
  defaultVariants: { enabled: true },
});

export const textInputInfoVariants = cva(
  cn(
    'text-ws-static-subtle border-ws-static-base flex h-full shrink-0 items-center justify-center',
    'data-[disabled=true]:border-ws-static-base data-[disabled=true]:opacity-50',
    // An affix whose only child renders nothing (a clear button on an empty
    // field) must not keep reserving its inset — it would eat input width and
    // leave a dead click-to-focus strip.
    'empty:hidden',
  ),
  {
    variants: {
      size: {
        sm: '',
        md: '',
        lg: '',
      },
      position: {
        prefix: '',
        suffix: '',
      },
      inner: {
        true: '',
        false: '',
      },
      /**
       * Figma sets the affix inset from the *kind* of content, not just the size:
       * `Type=Text` is roomier than an icon, and an icon button — which carries its
       * own internal padding — is tighter still. Figma's `Avatar`, `Entity` and
       * `Icon` types all resolve to the same numbers, so they share `icon` here.
       */
      content: {
        text: '',
        icon: '',
        iconButton: '',
      },
    },
    compoundVariants: [
      {
        position: 'prefix',
        inner: false,
        className: 'border-r',
      },
      {
        position: 'suffix',
        inner: false,
        className: 'border-l',
      },

      // ── Contained (Figma `Contained=True`) — symmetric inset ──────────────
      // A boxed affix is at least as wide as the control is tall, so short
      // content ("$", an icon) sits in a 1:1 square; longer text keeps the px
      // inset and grows past it.
      { inner: false, size: 'sm', className: 'min-w-ws-forms-sm' },
      { inner: false, size: 'md', className: 'min-w-ws-forms-md' },
      { inner: false, size: 'lg', className: 'min-w-ws-forms-lg' },
      { inner: false, content: 'text', size: ['sm', 'md', 'lg'], className: 'px-ws-7' },
      { inner: false, content: 'icon', size: 'sm', className: 'px-ws-5' },
      { inner: false, content: 'icon', size: ['md', 'lg'], className: 'px-ws-7' },
      { inner: false, content: 'iconButton', size: ['sm', 'md'], className: 'px-ws-3' },
      { inner: false, content: 'iconButton', size: 'lg', className: 'px-ws-5' },

      // ── Inner prefix (Figma `Contained=False`) — leading inset only ───────
      {
        inner: true,
        position: 'prefix',
        content: 'text',
        size: ['sm', 'md', 'lg'],
        className: 'pl-ws-7',
      },
      { inner: true, position: 'prefix', content: 'icon', size: 'sm', className: 'pl-ws-5' },
      {
        inner: true,
        position: 'prefix',
        content: 'icon',
        size: ['md', 'lg'],
        className: 'pl-ws-7',
      },
      {
        inner: true,
        position: 'prefix',
        content: 'iconButton',
        size: ['sm', 'md'],
        className: 'pl-ws-3',
      },
      { inner: true, position: 'prefix', content: 'iconButton', size: 'lg', className: 'pl-ws-5' },

      // ── Inner suffix — trailing inset only. Figma collapses every content
      //    type to Gap/5 at Large, while the matching prefix stays Gap/7. ────
      {
        inner: true,
        position: 'suffix',
        content: 'text',
        size: ['sm', 'md'],
        className: 'pr-ws-7',
      },
      { inner: true, position: 'suffix', content: 'icon', size: 'sm', className: 'pr-ws-5' },
      { inner: true, position: 'suffix', content: 'icon', size: 'md', className: 'pr-ws-7' },
      {
        inner: true,
        position: 'suffix',
        content: 'iconButton',
        size: ['sm', 'md'],
        className: 'pr-ws-3',
      },
      {
        inner: true,
        position: 'suffix',
        content: ['text', 'icon', 'iconButton'],
        size: 'lg',
        className: 'pr-ws-5',
      },
    ],
    defaultVariants: {
      size: 'md',
      position: 'prefix',
      inner: false,
      content: 'icon',
    },
  },
);

/**
 * The clear button takes the radius of the IconButton that Figma puts in a field of this size
 * (XSmall in sm, Small in md and lg).
 */
export const textInputClearButtonSizes = {
  sm: 'xs',
  md: 'sm',
  lg: 'sm',
} as const;

export const textInputClearButtonVariants = cva('shrink-0 p-0', {
  variants: {
    size: {
      sm: 'size-ws-11',
      md: 'size-ws-13',
      lg: 'size-ws-14',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const textInputClearButtonIconVariants = cva('w-auto p-0', {
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

export const textInputInputVariants = cva(
  cn(
    'placeholder:text-ws-static-subtle h-full w-full appearance-none bg-transparent text-inherit outline-hidden',
    'data-[disabled=true]:opacity-75 data-[disabled=true]:placeholder-shown:opacity-50',
    // `type="search"` is kept for semantics (screen readers announce a search
    // field, Escape clears it), but WebKit paints its own cancel button on top
    // of ours as soon as the input has a value. `appearance-none` on the input
    // itself does not remove it — the pseudo-element has to be reset directly.
    '[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none',
  ),
  {
    variants: {
      size: {
        sm: 'px-ws-7',
        md: 'px-ws-9',
        lg: 'px-ws-9',
      },
    },
  },
);
