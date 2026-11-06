import { cva } from 'class-variance-authority';

// py-ws-3: Figma's Helper Text pads its line Gap/3 above and below (a 24px row).
export const helperTextVariants = cva('typography-body-sm gap-ws-3 py-ws-3 flex items-center', {
  variants: {
    state: {
      default: 'text-ws-static-subtle',
      error: 'text-ws-semantic-negative',
      warning: 'text-ws-semantic-notice',
      success: 'text-ws-semantic-positive',
    },
  },
  defaultVariants: {
    state: 'default',
  },
});

export const helperTextIconVariants = cva('h-ws-control-sm w-ws-control-sm', {
  variants: {
    state: {
      error: 'text-ws-semantic-negative',
      warning: 'text-ws-semantic-notice',
      success: 'text-ws-semantic-positive',
    },
  },
});
