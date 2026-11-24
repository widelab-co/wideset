import { cva } from 'class-variance-authority';
import { cn } from 'src/lib/utils';

/*
  `<kbd>` gets a monospace stack from the browser and from Tailwind's preflight. Both parts reset
  the family, so the keys use the page's font like every other component (Figma: Font/Family/Body).
*/

/**
 * Figma `Shortcut`: the keys in a row with no gap, Caption/Medium in Static/Text/Subtle.
 * Strong is a cap: Size/12 high, Gap/4 × Gap/2 padding, Corner Radius/Control/md and a 1px
 * Static/Stroke/Base stroke drawn inside the frame. A CSS border would add 2px to the hugged width,
 * so the stroke is an inset ring, as on Tile. Weak is the bare keys, Size/11 high.
 */
export const shortcutVariants = cva(
  cn(
    'inline-flex items-center whitespace-nowrap',
    'typography-caption-md text-ws-static-subtle font-[family-name:inherit]',
  ),
  {
    variants: {
      emphasis: {
        strong:
          'h-ws-12 px-ws-4 py-ws-2 rounded-ws-control-md inset-ring inset-ring-(--ws-static-stroke-base)',
        weak: 'h-ws-11',
      },
    },
    defaultVariants: {
      emphasis: 'strong',
    },
  },
);

/**
 * Figma `.Shortcut Symbol`: one key, centred. Command, Shift and Option keep a Size/9 minimum
 * width, Control and Letter Size/8; a longer label (Esc, Tab) hugs its text.
 */
export const shortcutKeyVariants = cva(
  'flex items-center justify-center font-[family-name:inherit]',
  {
    variants: {
      symbol: {
        command: 'min-w-ws-9',
        shift: 'min-w-ws-9',
        option: 'min-w-ws-9',
        control: 'min-w-ws-8',
        letter: 'min-w-ws-8',
      },
    },
    defaultVariants: {
      symbol: 'letter',
    },
  },
);
