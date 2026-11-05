import { cva } from 'class-variance-authority';

export const formFieldVariants = cva('flex', {
  variants: {
    variant: {
      vertical: 'flex-col gap-[0.375rem]',
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
      horizontal: 'gap-ws-5 flex w-full max-w-[10rem] shrink-0 flex-col',
    },
  },
  defaultVariants: {
    variant: 'vertical',
  },
});

export const formFieldLabelRowVariants = cva('gap-ws-3 flex items-start');

export const formFieldContentVariants = cva('flex flex-col gap-[0.375rem]', {
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
