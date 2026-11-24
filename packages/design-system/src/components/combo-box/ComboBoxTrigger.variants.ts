import { cva } from 'class-variance-authority';

/**
 * The clear button sits in the trigger's row, between the value and the arrow, so it needs no
 * offset: a small gap on each side keeps it clear of the text and of the arrow's divider.
 * (Select's clear button sits outside its trigger and pulls itself back in with margins, which
 * is why ComboBox does not reuse `selectClearButtonVariants`.)
 */
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
