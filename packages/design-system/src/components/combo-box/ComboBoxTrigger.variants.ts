import { cva } from 'class-variance-authority';

export const comboBoxClearButtonVariants = cva('ml-ws-3 relative shrink-0 rounded-full p-0', {
  variants: {
    size: {
      sm: 'size-ws-11 mr-ws-2',
      md: 'size-ws-13 mr-ws-3',
      lg: 'size-ws-14 mr-ws-3',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});
