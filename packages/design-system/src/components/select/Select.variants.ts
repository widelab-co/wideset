import { cva } from 'class-variance-authority';
import { cn } from 'src/lib/utils';

import { hoverTintMotion } from '../../motion/recipes';

export const selectTriggerVariants = cva(
  cn(
    // A <button> centres and wraps its text by default; a field reads from its start on one line.
    'group/select-trigger text-ws-static-strong relative flex w-[16rem] cursor-pointer items-center justify-between overflow-hidden text-start whitespace-nowrap outline-hidden',
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
    enabled: { true: hoverTintMotion, false: '' },
  },
  defaultVariants: { enabled: true },
});

// Figma draws the arrow as an icon button (24 / 32 / 40px, the icon 16 / 16 / 20px in its middle)
// after the value's own inset, 4px from the edge. The side padding makes the svg as wide as that
// button (only its width matters: a taller box would stretch MultiSelect), and the negative end
// margin takes it into the trigger's padding, so the trigger keeps one `px` on both sides. The clear
// button, when shown, sits right before it.
export const selectTriggerIconVariants = cva(
  'text-ws-dynamic-secondary-default data-[disabled=true]:text-ws-dynamic-secondary-disabled box-content shrink-0',
  {
    variants: {
      size: {
        sm: 'px-ws-3 ms-ws-7 -me-ws-5 size-ws-9',
        md: 'px-ws-5 ms-ws-9 -me-ws-7 size-ws-9',
        lg: 'px-ws-6 ms-ws-9 -me-ws-7 size-ws-11',
      },
      // Ghost reads as a value, not a control: its arrow shows only while the trigger is hovered,
      // focused or open, and always on touch screens, which have no hover. It keeps its space, so
      // the value never shifts.
      preset: {
        border: '',
        ghost: cn(
          'opacity-0 transition-opacity duration-(--ws-motion-duration-quick) ease-(--ws-motion-ease-out)',
          'group-hover/select-trigger:not-data-[disabled=true]:opacity-100',
          'group-focus-visible/select-trigger:opacity-100 group-data-[state=open]/select-trigger:opacity-100',
          'pointer-coarse:opacity-100',
        ),
      },
    },
    defaultVariants: {
      size: 'md',
      preset: 'border',
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

// Select and MultiSelect: the clear button is Figma's icon button (24 / 32 / 40px), IconButton at
// this size.
export const selectClearButtonSize = { sm: 'xs', md: 'sm', lg: 'md' } as const;

// It is a sibling of the trigger (a button cannot hold a button), drawn over it right before the
// arrow. Its negative margin cancels its own width, so it takes no room; `end` moves it past the
// arrow and the 4px edge inset, and the 1px shift past the trigger's border. Logical sides keep it
// right in a right-to-left layout.
export const selectTriggerClearButtonVariants = cva(
  '-translate-x-ws-1 rtl:translate-x-ws-1 relative shrink-0 rounded-full p-0',
  {
    variants: {
      size: {
        sm: '-ms-ws-12',
        md: '-ms-ws-14',
        lg: '-ms-ws-16',
      },
      hideArrow: {
        true: 'end-ws-3',
        false: '',
      },
    },
    compoundVariants: [
      { hideArrow: false, size: 'sm', className: 'end-ws-13' },
      { hideArrow: false, size: 'md', className: 'end-ws-15' },
      { hideArrow: false, size: 'lg', className: 'end-ws-17' },
    ],
    defaultVariants: {
      size: 'md',
      hideArrow: false,
    },
  },
);

// The value's room for that clear button: its width, plus the 4px edge inset when no arrow is there
// to absorb it. The value then ends one inset (12 / 16 / 16px) before the button, as in Figma.
export const selectTriggerClearPaddingVariants = cva('', {
  variants: {
    size: {
      sm: 'pe-ws-12',
      md: 'pe-ws-14',
      lg: 'pe-ws-16',
    },
    hideArrow: {
      true: '',
      false: '',
    },
  },
  compoundVariants: [
    { hideArrow: true, size: 'sm', className: 'pe-ws-13' },
    { hideArrow: true, size: 'md', className: 'pe-ws-15' },
    { hideArrow: true, size: 'lg', className: 'pe-ws-17' },
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

export const selectValuePrefixVariants = cva(
  'text-ws-static-subtle border-ws-static-base data-[disabled=true]:border-ws-static-base flex h-full shrink-0 items-center justify-center border-r data-[disabled=true]:opacity-50',
  {
    variants: {
      size: {
        sm: 'mr-ws-5 -ml-ws-6 px-ws-4',
        md: 'mr-ws-7 -ml-ws-8 px-ws-5',
        lg: 'mr-ws-7 -ml-ws-8 px-ws-7',
      },
      // The divider separates the prefix inside a bordered field; a ghost field has no box to
      // divide, so the prefix sits beside the value like an icon.
      preset: {
        border: '',
        ghost: 'mr-ws-0 border-r-0',
      },
    },
    defaultVariants: {
      size: 'md',
      preset: 'border',
    },
  },
);
