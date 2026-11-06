import type * as RadixScrollArea from '@radix-ui/react-scroll-area';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import type { MotionProps } from '../../motion/Motion.types';

/**
 * A region that scrolls with Wideset's thin overlay scrollbar. `ref` points at the viewport, the
 * element that scrolls; every other prop goes to the root.
 */
export type ScrollAreaProps = Omit<
  ComponentPropsWithoutRef<typeof RadixScrollArea.Root>,
  'type' | 'children'
> &
  MotionProps & {
    /** The content that scrolls. */
    children: ReactNode;
    /**
     * Which way the content scrolls, and so which bars it gets. `vertical` keeps the content as
     * wide as the area, so `truncate` children cut with an ellipsis; `horizontal` and `both` let
     * it grow wider than the area (a wide table, a row of cards).
     * @default 'vertical'
     */
    orientation?: 'vertical' | 'horizontal' | 'both';
    /**
     * When the bar shows (Radix's `type`, named for what it does). `hover`: while the pointer is
     * over the area or it scrolls, fading out after. `scroll`: only while it scrolls, as on
     * macOS. `auto`: whenever the content overflows. `always`: from the start; the thumb still
     * shows only when there is something to scroll. `never`: no bar, while the wheel, touch and
     * keyboard still scroll; only where the cut-off content already shows there is more, such as
     * a collapsed Sidebar rail. The bar never takes space unless `scrollbarGutter` is set.
     * @default 'hover'
     */
    scrollbarVisibility?: 'hover' | 'scroll' | 'auto' | 'always' | 'never';
    /**
     * Reserves the bar's width on the scrolling edge (the bottom edge for `horizontal`), like CSS
     * `scrollbar-gutter: stable`, so content never sits under the thumb. Off, the thumb floats
     * over the content's edge: right for padded content, whose padding holds it. Set it when the
     * content runs to the edge and its end matters (right-aligned numbers, row actions), or to
     * line the content up with unscrolled parts beside it (Sidebar).
     * @default false
     */
    scrollbarGutter?: boolean;
    /**
     * Goes to the viewport, the element that takes focus. Left out, the viewport becomes a tab
     * stop only while it overflows and holds nothing focusable, so a keyboard user can always
     * reach and scroll it. `-1` turns that off for a list that manages focus itself.
     */
    tabIndex?: number;
  };
