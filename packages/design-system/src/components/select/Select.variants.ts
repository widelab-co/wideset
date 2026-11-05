import { cva } from 'class-variance-authority';
import { cn } from 'src/lib/utils';

import { hoverTintMotion, pressMotion } from '../../motion/recipes';

export const selectTriggerVariants = cva(
  cn(
    // A <button> centres and wraps its text by default; a field reads left to right on one line.
    'text-ws-static-strong relative flex w-[16rem] cursor-pointer items-center justify-between overflow-hidden text-left whitespace-nowrap outline-hidden',
    'data-[placeholder]:text-ws-static-subtle',
    'data-[disabled=true]:text-ws-static-subtle data-[disabled=true]:cursor-default',
    'data-[disabled=true]:border-ws-dynamic-secondary-disabled data-[disabled=true]:bg-ws-static-alpha-subtle',
    'data-[disabled=true]:hover:not-focus-visible:border-ws-dynamic-secondary-disabled',
    'data-[disabled=true]:active:border-ws-dynamic-secondary-disabled',
    'data-[disabled=true]:focus-visible:not-active:border-ws-dynamic-secondary-disabled',
  ),
  {
    variants: {
      preset: {
        border: cn(
          'bg-ws-static-highlight-base border-ws-dynamic-secondary-default shadow-ws-forms-base border',
        ),
        ghost: cn('border border-transparent bg-transparent'),
      },
      variant: {
        primary: cn(
          'hover:not-focus-visible:not-data-[disabled=true]:border-ws-dynamic-secondary-hover',
          'active:not-data-[disabled=true]:border-ws-dynamic-secondary-pressed',
          'focus-visible:not-active:border-ws-dynamic-primary-strong-default focus-visible:not-active:shadow-ws-forms-active',
        ),
        danger: cn(
          'hover:not-focus-visible:not-data-[disabled=true]:border-ws-dynamic-danger-strong-hover',
          'active:not-data-[disabled=true]:border-ws-dynamic-danger-strong-pressed',
          'focus-visible:not-active:border-ws-dynamic-danger-strong-default focus-visible:not-active:shadow-ws-forms-active-danger',
        ),
      },
      size: {
        sm: 'typography-label-sm h-ws-forms-sm max-h-ws-forms-sm rounded-ws-control-lg px-ws-7',
        md: 'typography-label-sm h-ws-forms-md max-h-ws-forms-md rounded-ws-control-lg px-ws-9',
        lg: 'typography-label-md h-ws-forms-lg max-h-ws-forms-lg rounded-ws-control-xl px-ws-9',
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

export const selectTriggerMotionVariants = cva('', {
  variants: {
    enabled: { true: cn(hoverTintMotion, pressMotion), false: '' },
  },
  defaultVariants: { enabled: true },
});

export const selectTriggerIconVariants = cva(
  'text-ws-dynamic-secondary-default data-[disabled=true]:text-ws-dynamic-secondary-disabled size-ws-9 shrink-0',
  {
    variants: {
      size: {
        sm: '-mr-ws-3 ml-ws-5',
        md: '-mr-ws-4 ml-ws-6',
        lg: '-mr-ws-3 ml-ws-7',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export const selectTriggerSuffixVariants = cva('flex h-full shrink-0 items-center justify-center', {
  variants: {
    size: {
      sm: '-mr-ws-7 w-ws-14',
      md: '-mr-ws-9 w-ws-16',
      lg: '-mr-ws-9 w-ws-18',
    },
    preset: {
      border: 'border-ws-static-base border-l',
      ghost: '',
    },
  },
  defaultVariants: {
    size: 'md',
    preset: 'border',
  },
});

export const selectTriggerSuffixIconVariants = cva(
  'text-ws-dynamic-secondary-default data-[disabled=true]:text-ws-dynamic-secondary-disabled shrink-0',
  {
    variants: {
      size: {
        sm: 'size-ws-8',
        md: 'size-ws-9',
        lg: 'size-ws-11',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export const selectContentVariants = cva(
  cn(
    'rounded-ws-container-sm z-ws-popout overflow-hidden',
    'bg-ws-static-overlay shadow-ws-medium',
  ),
  {
    variants: {
      position: {
        popper: cn(
          'data-[side=bottom]:translate-y-ws-1 data-[side=left]:-translate-x-ws-1 data-[side=right]:translate-x-ws-1 data-[side=top]:-translate-y-ws-1',
          // Width floor: never narrower than the trigger nor the Size/28 menu
          // minimum; grows freely with content past that.
          'min-w-[max(var(--radix-select-trigger-width),var(--spacing-ws-28))]',
        ),
        'item-aligned': '',
      },
    },
    defaultVariants: {
      position: 'popper',
    },
  },
);

export const selectContentMotionVariants = cva('', {
  variants: {
    enabled: {
      true: cn(
        'origin-radix-select',
        'transition-none',
        'animate-in fade-in-0 zoom-in-95',
        'duration-(--ws-motion-duration-fast) ease-(--ws-motion-ease-smooth-out)',
        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
        'data-[state=closed]:duration-(--ws-motion-duration-quick)',
      ),
      false: '',
    },
  },
  defaultVariants: { enabled: true },
});

export const selectClearButtonVariants = cva('relative shrink-0 rounded-full p-0', {
  variants: {
    size: {
      sm: 'size-ws-11',
      md: 'size-ws-13',
      lg: 'size-ws-14',
    },
    hideArrow: {
      true: '',
      false: '',
    },
  },
  compoundVariants: [
    {
      size: 'sm',
      hideArrow: true,
      className:
        'mr-[calc(var(--spacing-ws-6)+1px)] -ml-[calc(var(--spacing-ws-6)+var(--spacing-ws-11)+1px)]',
    },
    {
      size: 'sm',
      hideArrow: false,
      className:
        'mr-[calc(var(--spacing-ws-13)+1px)] -ml-[calc(var(--spacing-ws-13)+var(--spacing-ws-11)+1px)]',
    },
    {
      size: 'md',
      hideArrow: true,
      className:
        'mr-[calc(var(--spacing-ws-7)+1px)] -ml-[calc(var(--spacing-ws-7)+var(--spacing-ws-13)+1px)]',
    },
    {
      size: 'md',
      hideArrow: false,
      className:
        'mr-[calc(var(--spacing-ws-15)+1px)] -ml-[calc(var(--spacing-ws-15)+var(--spacing-ws-13)+1px)]',
    },
    {
      size: 'lg',
      hideArrow: true,
      className:
        'mr-[calc(var(--spacing-ws-7)+1px)] -ml-[calc(var(--spacing-ws-7)+var(--spacing-ws-14)+1px)]',
    },
    {
      size: 'lg',
      hideArrow: false,
      className:
        'mr-[calc(var(--spacing-ws-17)+1px)] -ml-[calc(var(--spacing-ws-17)+var(--spacing-ws-14)+1px)]',
    },
  ],
  defaultVariants: {
    size: 'md',
    hideArrow: false,
  },
});

export const selectClearButtonIconVariants = cva('w-auto p-0', {
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

export const selectValueLeftPaddingVariants = cva('', {
  variants: {
    size: {
      sm: 'pl-ws-5',
      md: 'pl-ws-7',
      lg: 'pl-ws-7',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const selectValueRightPaddingVariants = cva('', {
  variants: {
    size: {
      sm: 'pr-ws-11',
      md: 'pr-ws-16',
      lg: 'pr-ws-19',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const selectValuePrefixVariants = cva(
  'text-ws-static-subtle border-ws-static-base data-[disabled=true]:border-ws-static-base flex h-full shrink-0 items-center justify-center border-r data-[disabled=true]:opacity-50',
  {
    variants: {
      size: {
        sm: 'mr-ws-5 -ml-ws-6 px-ws-4',
        md: 'mr-ws-7 -ml-ws-8 px-ws-5',
        lg: 'mr-ws-7 -ml-ws-8 px-ws-7',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);
