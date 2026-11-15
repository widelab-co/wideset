import { cva } from 'class-variance-authority';

/**
 * The clear button sits in the trigger's row, right before the divider and the chevron, inset
 * from the divider like a button in an inner `TextInput.Suffix` (4px, 8px in a large field).
 */
export const comboBoxClearButtonVariants = cva('ml-ws-5 shrink-0 p-0', {
  variants: {
    size: {
      sm: 'size-ws-11 mr-ws-3',
      md: 'size-ws-13 mr-ws-3',
      lg: 'size-ws-14 mr-ws-5',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});
