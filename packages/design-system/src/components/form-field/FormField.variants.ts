import { cva } from 'class-variance-authority';

// Figma spaces a Checkbox Group or Radio Button Group Gap/7 from the label and the helper text;
// other controls sit Gap/4 below the label (Gap/5 beside a horizontal one).
const groupGap =
  'has-[[data-slot=checkbox-group]]:gap-ws-7 has-[[data-slot=radio-button-group]]:gap-ws-7';

export const formFieldVariants = cva(['flex', groupGap], {
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
      horizontal: 'gap-ws-3 flex w-full max-w-[10rem] shrink-0 flex-col',
    },
  },
  defaultVariants: {
    variant: 'vertical',
  },
});

export const formFieldContentVariants = cva(['gap-ws-4 flex flex-col', groupGap], {
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
