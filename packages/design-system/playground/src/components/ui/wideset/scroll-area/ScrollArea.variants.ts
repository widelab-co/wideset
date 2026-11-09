import { cva } from 'class-variance-authority';
import { cn } from '@/lib/wideset/utils';

/**
 * A flex column, so the viewport fills a fixed height (`h-*`, `flex-1 min-h-0`) and shrinks under
 * a max height (`max-h-*`): both scroll, where a percentage height would only fill the first.
 * `isolate` keeps the bar's z-index local, so it clears sticky content inside the area without
 * rising above anything outside it.
 */
export const scrollAreaClassName = 'relative isolate flex flex-col overflow-hidden';

export const scrollAreaViewportVariants = cva(
  cn(
    'min-h-0 w-full flex-auto rounded-[inherit]',
    // Drawn inside: the root clips everything outside the viewport.
    'focus-visible:wds-focus-visible focus-visible:outline-ws-dynamic-primary-strong-default focus-visible:-outline-offset-2',
  ),
  {
    variants: {
      orientation: {
        // Radix wraps the content in `display: table` so it can grow wider than the area. A
        // vertical area keeps it a block instead: as wide as the area, so `truncate` cuts.
        vertical: '[&>div]:!block',
        horizontal: '',
        both: '',
      },
      // The bar's footprint (Size/6, 10px), on the edge it scrolls along.
      scrollbarGutter: { true: '', false: '' },
    },
    compoundVariants: [
      { scrollbarGutter: true, orientation: 'vertical', className: 'pe-ws-6' },
      { scrollbarGutter: true, orientation: 'horizontal', className: 'pb-ws-6' },
      { scrollbarGutter: true, orientation: 'both', className: 'pe-ws-6 pb-ws-6' },
    ],
    defaultVariants: { orientation: 'vertical', scrollbarGutter: false },
  },
);

/**
 * No track: a 10px strip (the hit area) holding a 6px thumb that widens to 8px under the pointer,
 * above a sticky table header or column scrolling under it. It stays mounted while hidden, so it
 * can fade out, and lets the pointer through to the content then, as it does while it has no
 * thumb (`always` with nothing to scroll).
 */
export const scrollAreaScrollbarVariants = cva(
  cn(
    'group/scrollbar p-ws-2 z-[calc(var(--ws-z-index-sticky)+1)] flex touch-none select-none',
    'empty:pointer-events-none data-[state=hidden]:pointer-events-none data-[state=hidden]:opacity-0',
  ),
  {
    variants: {
      orientation: {
        vertical: 'w-ws-6 hover:px-ws-1 active:px-ws-1',
        horizontal: 'h-ws-6 hover:py-ws-1 active:py-ws-1 flex-col',
      },
      // `never`: the bar stays mounted, since Radix only lets the viewport scroll while it is.
      hidden: { true: 'hidden', false: '' },
    },
    defaultVariants: { orientation: 'vertical', hidden: false },
  },
);

/**
 * Fades in quickly and out a little slower, and widens smoothly. Transitions on the motion tokens,
 * which shrink to 1ms for reduced motion.
 */
export const scrollAreaScrollbarMotionVariants = cva('', {
  variants: {
    enabled: {
      true: cn(
        'transition-[opacity,padding] ease-(--ws-motion-ease-out)',
        'duration-(--ws-motion-duration-quick) data-[state=hidden]:duration-(--ws-motion-duration-fast)',
        // Its only child, the thumb, changes tint.
        '*:transition-colors *:duration-(--ws-motion-duration-quick)',
      ),
      false: '',
    },
  },
  defaultVariants: { enabled: true },
});

/** An alpha fill, so it reads on any surface in light and dark; stronger while hovered or dragged. */
export const scrollAreaThumbClassName = cn(
  'bg-ws-static-alpha-strong rounded-ws-control-full flex-1',
  'group-hover/scrollbar:bg-ws-dynamic-secondary-alpha-strong-pressed group-active/scrollbar:bg-ws-dynamic-secondary-alpha-strong-pressed',
);
