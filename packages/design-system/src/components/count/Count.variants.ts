import { cva } from 'class-variance-authority';

export const countVariants = cva(
  'typography-label-sm text-ws-static-subtle inline-flex shrink-0 items-center whitespace-nowrap tabular-nums',
  {
    variants: {
      contained: {
        true: 'h-ws-12 min-w-ws-12 px-ws-5 rounded-ws-control-full border-ws-static-strong justify-center border',
        false: '',
      },
    },
    defaultVariants: {
      contained: false,
    },
  },
);
