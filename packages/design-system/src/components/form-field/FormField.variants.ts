import { cva } from 'class-variance-authority';

export const formFieldVariants = cva('flex', {
  variants: {
    variant: {
      vertical: 'gap-ws-4 flex-col',
      horizontal: 'gap-ws-5 flex-row items-start',
    },
  },
  defaultVariants: {
    variant: 'vertical',
  },
});

export const formFieldLabelVariants = cva('', {
  variants: {
    variant: {
      vertical: '',
      horizontal: 'gap-ws-4 flex w-full max-w-[10rem] shrink-0 flex-col',
    },
  },
  defaultVariants: {
    variant: 'vertical',
  },
});

// Figma stacks FormField's parts with Gap/4; the helper text adds its own Gap/3 padding on top.
export const formFieldContentVariants = cva('gap-ws-4 flex flex-col', {
  variants: {
    variant: {
      vertical: '',
      horizontal: 'min-w-0 flex-1',
    },
  },
  defaultVariants: {
    variant: 'vertical',
  },
});
