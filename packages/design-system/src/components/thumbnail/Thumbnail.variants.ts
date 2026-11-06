import { cva } from 'class-variance-authority';

/**
 * Box per Figma `Type` x `Size`. Sizes are `Size/9..16` with the radius stepping
 * `Control/sm` -> `md` -> `lg`; the hue per file kind is the matching
 * `Non-Semantic/Fill/<hue>/Strong` + `Text/<hue>/OnStrong` pair.
 *
 * Figma's `PDF` fill is bound to `Non-Semantic/Fill/Scarlet/Strong` (#e96949),
 * a variable deleted from `WDS Color Tokens`, so it never reaches the token
 * export. `red` is the nearest hue the library has (ΔE 17.8; `orange` 29.7).
 * The PDF variants need rebinding in Figma, not a hard-coded colour here.
 */
export const thumbnailVariants = cva(
  'relative flex shrink-0 items-center justify-center overflow-hidden',
  {
    variants: {
      size: {
        xs: 'rounded-ws-control-sm size-ws-9',
        sm: 'rounded-ws-control-md size-ws-11',
        md: 'rounded-ws-control-md size-ws-12',
        lg: 'rounded-ws-control-lg size-ws-14',
        xl: 'rounded-ws-control-lg size-ws-16',
      },
      type: {
        icon: 'bg-ws-non-semantic-purple-strong text-ws-non-semantic-purple-on-strong',
        text: 'bg-ws-non-semantic-purple-strong text-ws-non-semantic-purple-on-strong',
        image: '',
        logo: 'bg-ws-static-highlight-base border-ws-static-subtle border',
        pdf: 'bg-ws-non-semantic-red-strong text-ws-non-semantic-red-on-strong',
        spreadsheet: 'bg-ws-non-semantic-green-strong text-ws-non-semantic-green-on-strong',
        document: 'bg-ws-non-semantic-cyan-strong text-ws-non-semantic-cyan-on-strong',
        video: 'bg-ws-non-semantic-indigo-strong text-ws-non-semantic-indigo-on-strong',
        picture: 'bg-ws-non-semantic-yellow-strong text-ws-non-semantic-yellow-on-strong',
      },
    },
    defaultVariants: {
      size: 'md',
      type: 'icon',
    },
  },
);

/** Glyph per size: 12 / 12 / 16 / 20 / 24 — Figma's centred icon frame. */
export const thumbnailIconVariants = cva('shrink-0', {
  variants: {
    size: {
      xs: 'size-ws-7',
      sm: 'size-ws-7',
      md: 'size-ws-9',
      lg: 'size-ws-11',
      xl: 'size-ws-12',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

/** Figma binds `Caption/Strong/Small` up to 24px, `Caption/Strong/Medium` at 32, `Label/Strong/Small` at 40. */
export const thumbnailTextVariants = cva('max-w-full truncate text-center', {
  variants: {
    size: {
      xs: 'typography-caption-strong-sm',
      sm: 'typography-caption-strong-sm',
      md: 'typography-caption-strong-sm',
      lg: 'typography-caption-strong-md',
      xl: 'typography-label-strong-sm',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});
