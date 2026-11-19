import { cva } from 'class-variance-authority';

export const DIVIDER_WEIGHT_PX = { thin: 1, default: 2, bold: 4 } as const;

export const dividerLineVariants = cva('min-w-ws-14 flex-1 shrink-0 border-solid', {
  variants: {
    weight: {
      thin: 'border-b-1',
      default: 'border-b-2',
      bold: 'border-b-4',
    },
    emphasis: {
      subtle: 'border-ws-static-subtle',
      base: 'border-ws-static-base',
      strong: 'border-ws-static-strong',
    },
  },
  defaultVariants: {
    emphasis: 'base',
    weight: 'default',
  },
});

/* Dashed lines render as an SVG stroke, not border-dashed: the CSS dash pitch
   is UA-defined, while Figma specifies exactly 4/4. The stroke binds to the
   same --border-color-static-* vars the solid border uses — stroke-* utilities
   would miss them (semantic colors live outside the Tailwind color theme). */
export const dividerDashedLineVariants = cva('min-w-ws-14 flex-1 shrink-0', {
  variants: {
    emphasis: {
      subtle: '[stroke:var(--border-color-ws-static-subtle)]',
      base: '[stroke:var(--border-color-ws-static-base)]',
      strong: '[stroke:var(--border-color-ws-static-strong)]',
    },
  },
  defaultVariants: {
    emphasis: 'base',
  },
});

export const dividerTextVariants = cva(
  'typography-caption-strong-md text-ws-static-subtle min-w-0 shrink overflow-hidden text-ellipsis whitespace-nowrap',
  {
    variants: {
      textAlign: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
      },
    },
    defaultVariants: {
      textAlign: 'center',
    },
  },
);

export const dividerVariants = cva('flex w-full items-center', {
  variants: {
    withText: {
      true: 'h-ws-9 gap-ws-7',
      false: '',
    },
  },
  defaultVariants: {
    withText: false,
  },
});
